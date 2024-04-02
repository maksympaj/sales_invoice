const Sequelize = require('sequelize');

module.exports = {
  getFeatures,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  bulkDelete: _bulkDelete,
};

async function getFeatures() {
  return await db.AccessoryStock.findAll({
    attributes: ['category'],
    group: ['category'],
  });
}

async function getAll(where) {
  return await db.AccessoryStock.findAll({
    where,
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    order: ['createdAt'],
  });
}

async function getById(id) {
  return await getAccessoryStock(id);
}

async function create(req, res, next) {
  try {
    const params = req.body;
    const {
      thumbnailURL,
      balance,
      qty,
      shipmentDate,
      arrivalDate,
      ...restParams
    } = params;
    const nonRegistered = await db.AccessoryStock.findOne({
      where: { isRegistered: false, ...restParams },
    });
    const registered = await db.AccessoryStock.findOne({
      where: { isRegistered: true, ...restParams },
    });
    if (registered) throw 'Identical AccessoryStock Exists.';
    else {
      if (nonRegistered) {
        // set isRegistered as true and save
        nonRegistered.isRegistered = true;
        await nonRegistered.save();
      } else {
        // save registered AccessoryStock
        await db.AccessoryStock.create({ ...params, isRegistered: true });
      }
    }
    res.json({ message: 'New AccessoryStock was created successfully.' });
  } catch (err) {
    next(err);
  }
}

async function update(id, params) {
  const accessoryStock = await getAccessoryStock(id);
  const {
    thumbnailURL,
    balance,
    qty,
    shipmentDate,
    arrivalDate,
    ...restParams
  } = params;
  if (
    await db.AccessoryStock.findOne({
      where: { id: { [Sequelize.Op.ne]: id }, ...restParams },
    })
  )
    throw 'Identical AccessoryStock Exists.';
  Object.assign(accessoryStock, params);
  await accessoryStock.save();
  return accessoryStock.get();
}

async function _delete(id) {
  const accessoryStock = await getAccessoryStock(id);
  await accessoryStock.destroy();
}

async function _bulkDelete(where) {
  return await db.AccessoryStock.destroy({ where });
}

//helper function

async function getAccessoryStock(id) {
  const accessoryStock = await db.AccessoryStock.findByPk(id);
  if (!accessoryStock) throw 'AccessoryStock was not found.';
  return accessoryStock;
}
