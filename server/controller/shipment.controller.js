const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
const fs = require("fs");

const chairStockController = require("./chairStock.controller");
const deskStockController = require("./deskStock.controller");
const accessoryStockController = require("./accessoryStock.controller");
const db = require("../models");

module.exports = {
  getProducts,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  const sql = `
  SELECT s.id, s.poNum, 
      IF(s.itemType='A', CONCAT(a.category, ' - ', a.name), IF(s.itemType='C', CONCAT(c.brand, ' - ', c.model), CONCAT(d.supplierCode, ' - ', d.model))) AS des,
        s.qty, s.orderQty, s.createdAt AS orderDate, s.finishDate, location, supplier,
        IF(s.orderId='', 0, o.invoiceNum) AS invoice, s.remark 
    FROM shipments s 
        LEFT JOIN accessorystocks a ON s.stockId=a.id AND s.itemType='A'
        LEFT JOIN chairstocks c ON s.stockId=c.id AND s.itemType='C'
        LEFT JOIN deskstocks d ON s.stockId=d.id AND s.itemType='D'
        LEFT JOIN salesorders o ON s.orderId=o.id
    ORDER BY s.poNum
  `;
  const rows = await db.sequelize.query(sql, { plain: false, type: QueryTypes.SELECT });
  return rows;
}

async function create(req, res, next) {
  try {
    const { products, ...restParams } = req.body;

    const currentYear = new Date().getFullYear();
    const poNumber = await getPONum(currentYear)
    products.forEach(product => {
      restParams.poNum = poNumber
      restParams.itemType = product.productType.substr(0, 1).toUpperCase()
      restParams.stockId = product.productId
      restParams.qty = product.productQty
  
      db.Shipment.create({ ...restParams }) 
    });

    res.json({ message: "New Shipment was created successfully." });
  } catch (err) {
    next(err);
  }
}

async function _delete(id) {
  const shipment = await getById(id);
  await shipment.destroy();
}

async function getById(id) {
  const shipment = await db.Shipment.findOne({
    where: { id },
    include: [      
    ],
  });

  const currentYear = new Date().getFullYear();
  var query = `
  SELECT s.id, s.poNum, s.itemType, s.stockId,
      IF(s.itemType='A', CONCAT(a.category, ' - ', a.name), IF(s.itemType='C', CONCAT(c.brand, ' - ', c.model), CONCAT(d.supplierCode, ' - ', d.model))) AS des,
        s.qty, s.orderQty, s.createdAt AS orderDate, s.finishDate, location, supplier,
        IF(s.orderId='', 0, o.invoiceNum) AS invoice, s.remark 
    FROM shipments s 
        LEFT JOIN accessorystocks a ON s.stockId=a.id AND s.itemType='A'
        LEFT JOIN chairstocks c ON s.stockId=c.id AND s.itemType='C'
        LEFT JOIN deskstocks d ON s.stockId=d.id AND s.itemType='D'
        LEFT JOIN salesorders o ON s.orderId=o.id
    WHERE YEAR(s.createdAt)=${currentYear} AND s.poNum=${shipment.poNum}
  `
  const siblings = await db.sequelize.query(query, { type: QueryTypes.SELECT });

  // Create product arrays
  var accessoryProducts = []
  var chairProducts = []
  var deskProducts = []
  
  siblings.forEach(element => {
    const product = {
      pid: element.stockId,
      desc: element.des,
      qty: element.qty
    }

    if (element.itemType == 'A')
      accessoryProducts.push(product)
    
    if (element.itemType == 'C')
      chairProducts.push(product)

    if (element.itemType == 'D')
      deskProducts.push(product)
  })

  if (!shipment) throw "Shipment was not found.";

  shipment.dataValues.accProducts = accessoryProducts
  shipment.dataValues.chairProducts = chairProducts
  shipment.dataValues.deskProducts = deskProducts

  console.log(deskProducts)

  return shipment;
}

async function getPONum(year) {
  const shipment = await db.Shipment.findOne({
    attributes: [
      [Sequelize.fn("MAX", Sequelize.col("poNum")), "max_inv"],
    ],
    where: {
      createdAt: {
        [Sequelize.Op.lt]: `${year + 1}-01-01`,
        [Sequelize.Op.gte]: `${year}-01-01`,
      },
    },
    raw: true,
  });

  return shipment.max_inv + 1;
}

async function update(req, res, next) {
  try {
    const id = req.params.id;

    // Delete all in this number
    const query = `
      DELETE FROM shipments 
        WHERE YEAR(createdAt)=(SELECT YEAR(createdAt) FROM shipments WHERE id='${id}') 
          AND poNum=(SELECT poNum FROM shipments WHERE id='${id}')
    `
    await db.sequelize.query(query, { type: QueryTypes.DELETE });

    // Create new records
    const { products, ...restParams } = req.body;

    const currentYear = new Date().getFullYear();
    const poNumber = await getPONum(currentYear)
    products.forEach(product => {
      restParams.poNum = poNumber
      restParams.itemType = product.productType.substr(0, 1).toUpperCase()
      restParams.stockId = product.productId
      restParams.qty = product.productQty
  
      db.Shipment.create({ ...restParams }) 
    });


    // const shipment = await getById(id);
    // const { supplier, location, remark, products } = req.body;
    
    // shipment.supplier = supplier
    // shipment.location = location
    // shipment.remark = remark

    // await shipment.save();

    // // Update product details
    // products.forEach(async element => {
    //   const theYear = shipment.createdAt.getFullYear()
    //   const query = `
    //     UPDATE shipments SET qty=${element.productQty} 
    //       WHERE poNum=${shipment.poNum} AND YEAR(createdAt)=${theYear} AND stockId='${element.productId}'
    //   `
    //   await db.sequelize.query(query, { type: QueryTypes.UPDATE });
    // })

    res.json({ message: "Shipment was updated successfully." });
  } catch (err) {
    next(err);
  }
}




async function getProducts(req, res, next) {
  try {
    const chairProducts = await db.sequelize.query(
      "SELECT SUM(l.qty) AS totalQty, SUM(l.qty) AS orderedQty, GROUP_CONCAT(r1.`name` SEPARATOR ',') AS clients, l.orderId, l.stockId, r2.model, GROUP_CONCAT(l.id SEPARATOR ',') AS rids FROM chairtoorders AS l LEFT JOIN salesorders AS r1 ON l.orderId=r1.id LEFT JOIN chairstocks AS r2 ON l.stockId=r2.id WHERE l.preOrder=1 AND l.shipmentId IS NULL GROUP BY l.stockId",
      {
        type: QueryTypes.SELECT,
      }
    );
    const deskProducts = await db.sequelize.query(
      "SELECT SUM(l.qty) AS totalQty, SUM(l.qty) AS orderedQty, GROUP_CONCAT(r1.`name` SEPARATOR ',') AS clients, l.orderId, l.stockId, r2.model, l.hasDeskTop, l.topMaterial, l.topColor, GROUP_CONCAT(l.id SEPARATOR ',') AS rids FROM desktoorders AS l LEFT JOIN salesorders AS r1 ON l.orderId=r1.id LEFT JOIN deskstocks AS r2 ON l.stockId=r2.id WHERE l.preOrder=1 AND l.shipmentId IS NULL AND l.hasDeskTop=0 GROUP BY l.stockId UNION SELECT l.qty AS totalQty, l.qty AS orderedQty, r1.`name` AS clients, l.orderId, l.stockId, r2.model, l.hasDeskTop, l.topMaterial, l.topColor, l.id AS rids FROM desktoorders AS l LEFT JOIN salesorders AS r1 ON l.orderId=r1.id LEFT JOIN deskstocks AS r2 ON l.stockId=r2.id WHERE l.preOrder=1 AND l.shipmentId IS NULL AND l.hasDeskTop=1",
      {
        type: QueryTypes.SELECT,
      }
    );
    const accessoryProducts = await db.sequelize.query(
      "SELECT SUM(l.qty) AS totalQty, SUM(l.qty) AS orderedQty, GROUP_CONCAT(r1.`name` SEPARATOR ',') AS clients, l.orderId, l.stockId, r2.`name`, GROUP_CONCAT(l.id SEPARATOR ',') AS rids FROM accessorytoorders AS l LEFT JOIN salesorders AS r1 ON l.orderId=r1.id LEFT JOIN accessorystocks AS r2 ON l.stockId=r2.id WHERE l.preOrder=1 AND l.shipmentId IS NULL GROUP BY l.stockId",
      {
        type: QueryTypes.SELECT,
      }
    );

    const products = {
      chairs: chairProducts,
      desks: deskProducts,
      accessories: accessoryProducts,
    };
    res.json(products);
  } catch (err) {
    next(err);
  }
}

async function getAllOld(where) {
  return await db.Shipment.findAll({
    where,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: db.ChairStock,
        through: {
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      },
      {
        model: db.DeskToShipment,
      },
      {
        model: db.DeskStock,
        through: {
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      },
      {
        model: db.AccessoryStock,
        through: {
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      },
    ],
  });
}




