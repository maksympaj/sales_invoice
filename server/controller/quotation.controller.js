const Sequelize = require("sequelize");
const fs = require("fs");

const chairStockController = require("./chairStock.controller");
const deskStockController = require("./deskStock.controller");
const accessoryStockController = require("./accessoryStock.controller");
const { drawDeskTop } = require("server/middleware/deskDrawing");

module.exports = {
  getAll,
  getById,
  create,
  update,
  updateWithoutStock,
  delete: _delete,
  bulkDelete: _bulkDelete,
};

async function getAll(where) {
  return await db.Quotation.findAll({
    where,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: db.User,
        as: "Seller",
        attributes: ["id", "firstName", "lastName", "prefix"],
      },
      {
        model: db.ChairStock,
        through: {
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      },
      {
        model: db.DeskToQuotation,
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
      {
        model: db.ServiceToQuotation,
        attributes: ["id", "description", "price"],
      },
    ],
  });
}

async function getById(id) {
  return await getQuotation(id);
}

async function create(req, res, next) {
  try {
    const host = req.get("host");
    const protocol = req.protocol;
    const { products, ...restParams } = req.body;
    restParams.sellerId = req.user.id;

    const currentYear = new Date().getFullYear();
    restParams.quotationNum = await getQuotationNum(currentYear);

    const id = (await db.Quotation.create({ ...restParams })).id;

    const quotation = await getQuotation(id);

    for (var index = 0; index < products.length; index++) {
      if (products[index].productType === "chair") {
        const stock = await chairStockController.getById(
          products[index].productId
        );

        await quotation.addChairStock(stock, {
          through: {
            unitPrice: products[index].productPrice,
            qty: products[index].productAmount,
            deliveryOption: products[index].productDeliveryOption,
            remark: products[index].remark,
          },
        });
      } else if (products[index].productType === "desk") {
        const stock = await deskStockController.getById(
          products[index].productId
        );
        const {
          productId: stockId,
          productPrice: unitPrice,
          productAmount: qty,
          productDeliveryOption: deliveryOption,
          productType,
          ...restParams
        } = products[index];

        if (restParams.hasDeskTop && !restParams.topSketchURL) {
          const drawer = products.find(
            (item) =>
              item.productType === "accessory" &&
              item.productCategory === "Drawer"
          );

          const drawerAmount = drawer ? drawer.productAmount : null;

          const tmp = new Date(quotation.createdAt);
          const quotationNum = `Q-${
            quotation.Seller.prefix
          }${tmp.getFullYear()}${tmp.getMonth()}${tmp.getDate()}${(
            "000" + quotation.quotationNum
          ).substr(-3)}`;
          restParams.topSketchURL = `${protocol}://${host}/${await drawDeskTop(
            {
              quotationNum,
              ...restParams,
            },
            drawerAmount
          )}`;
        }
        const join1 = await db.DeskToQuotation.create({
          unitPrice,
          qty,
          deliveryOption,
          stockId: stockId,
          ...restParams,
        });
        await quotation.addDeskToQuotation(join1);
      } else if (products[index].productType === "accessory") {
        const stock = await accessoryStockController.getById(
          products[index].productId
        );
        await quotation.addAccessoryStock(stock, {
          through: {
            unitPrice: products[index].productPrice,
            qty: products[index].productAmount,
            deliveryOption: products[index].productDeliveryOption,
            remark: products[index].remark,
          },
        });
      } else if (products[index].productType === "misc") {
        await db.ServiceToQuotation.create({
          id: products[index].id,
          description: products[index].description,
          price: products[index].price,
          quotationId: id,
        });
      }
    }
    res.json({ message: "New Quotation was created successfully." });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const host = req.get("host");
    const protocol = req.protocol;
    const id = req.params.id;
    const quotation = await getQuotation(id);
    const { ChairStocks, DeskStocks, AccessoryStocks } = quotation;
    const { products, ...restParams } = req.body;
    console.log("request---", req.body);
    Object.assign(quotation, restParams);
    await quotation.save();
    for (var index = 0; index < ChairStocks.length; index++) {
      await quotation.removeChairStock(ChairStocks[index]);
    }
    for (var index = 0; index < DeskStocks.length; index++) {
      await quotation.removeDeskStock(DeskStocks[index].id);
    }
    for (var index = 0; index < AccessoryStocks.length; index++) {
      await quotation.removeAccessoryStock(AccessoryStocks[index].id);
    }

    // Delete services for this quotation
    db.ServiceToQuotation.destroy({
      where: {
        quotationId: id,
      },
    });

    for (var index = 0; index < products.length; index++) {
      if (products[index].productType === "chair") {
        const stock = await chairStockController.getById(
          products[index].productId
        );
        await quotation.addChairStock(stock, {
          through: {
            unitPrice: products[index].productPrice,
            qty: products[index].productAmount,
            deliveryOption: products[index].productDeliveryOption,
            remark: products[index].remark,
          },
        });
      } else if (products[index].productType === "desk") {
        const stock = await deskStockController.getById(
          products[index].productId
        );
        const {
          productId: stockId,
          productPrice: unitPrice,
          productAmount: qty,
          productDeliveryOption: deliveryOption,
          productType,
          ...restParams
        } = products[index];
        if (restParams.hasDeskTop) {
          if (restParams.topSketchURL) {
            const filepath =
              __dirname.split("controller")[0] +
              "uploads" +
              restParams.topSketchURL.split("uploads")[1];
            fs.unlinkSync(filepath);
          }

          const drawer = products.find(
            (item) =>
              item.productType === "accessory" &&
              item.productCategory === "Drawer"
          );

          const drawerAmount = drawer ? drawer.productAmount : null;

          const tmp = new Date(quotation.createdAt);
          const quotationNum = `Q-${
            quotation.Seller.prefix
          }${tmp.getFullYear()}${tmp.getMonth()}${tmp.getDate()}${(
            "000" + quotation.quotationNum
          ).substr(-3)}`;
          restParams.topSketchURL = `${protocol}://${host}/${await drawDeskTop(
            {
              quotationNum,
              ...restParams,
            },
            drawerAmount
          )}`;
        }

        const join1 = await db.DeskToQuotation.create({
          unitPrice,
          qty,
          deliveryOption,
          stockId: stockId,
          ...restParams,
        });
        await quotation.addDeskToQuotation(join1);
      } else if (products[index].productType === "accessory") {
        const stock = await accessoryStockController.getById(
          products[index].productId
        );
        await quotation.addAccessoryStock(stock, {
          through: {
            unitPrice: products[index].productPrice,
            qty: products[index].productAmount,
            deliveryOption: products[index].productDeliveryOption,
            remark: products[index].remark,
          },
        });
      } else if (products[index].productType === "misc") {
        db.ServiceToQuotation.create({
          id: products[index].id,
          description: products[index].description,
          price: products[index].price,
          quotationId: id,
        });
      }
    }
    res.json({ message: "Quotation was updated successfully." });
  } catch (err) {
    next(err);
  }
}

async function updateWithoutStock(id, params) {
  const quotation = await getQuotation(id);
  Object.assign(quotation, params);
  await quotation.save();
}

async function _delete(id) {
  const quotation = await getQuotation(id);
  await quotation.destroy();
}

async function _bulkDelete(where) {
  return await db.Quotation.destroy({ where });
}

//helper function

async function getQuotation(id) {
  const quotation = await db.Quotation.findOne({
    where: { id },
    include: [
      {
        model: db.User,
        as: "Seller",
        attributes: ["id", "firstName", "lastName", "prefix"],
      },
      {
        model: db.ChairStock,
        through: {
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
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
        model: db.DeskToQuotation,
      },
      {
        model: db.AccessoryStock,
        through: {
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      },
      {
        model: db.ServiceToQuotation,
        attributes: ["id", "description", "price"],
      },
    ],
  });
  if (!quotation) throw "ChairStock was not found.";
  return quotation;
}

async function getQuotationNum(year) {
  const quotation = await db.Quotation.findOne({
    attributes: [
      [Sequelize.fn("MAX", Sequelize.col("quotationNum")), "max_inv"],
    ],
    where: {
      createdAt: {
        [Sequelize.Op.lt]: `${year + 1}-01-01`,
        [Sequelize.Op.gte]: `${year}-01-01`,
      },
    },
    raw: true,
  });

  return quotation.max_inv + 1;
}
