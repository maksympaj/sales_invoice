const Sequelize = require('sequelize');
const pdf = require('pdf-creator-node');
const fs = require('fs');

module.exports = {
  getAllChairDelivery,
  getChairDelivery,
  getAllDeskDelivery,
  getDeskDelivery,
  getAllAccessoryDelivery,
  getAccessoryDelivery,
  generateDeliveryPDF,
  signDelivery,
};

async function getAllChairDelivery(req, res, next) {
  try {
    const result = await db.ChairToOrder.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: db.SalesOrder,
          include: [
            {
              model: db.User,
              as: 'Seller',
              attributes: ['id', 'firstName', 'lastName', 'prefix'],
            },
          ],
        },
        {
          model: db.ChairStock,
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const host = req.get('host');
    const protocol = req.protocol;

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getChairDelivery(req, res, next) {
  try {
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const result = await db.ChairToOrder.findAll({
      attributes: [
        'id',
        'preDeliveryDate',
        'from',
        'to',
        'delivered',
        'signURL',
      ],
      where: {
        preDeliveryDate: {
          [Sequelize.Op.gte]: fromDate,
          [Sequelize.Op.lte]: toDate,
        },
      },
      include: [
        {
          attributes: [
            'name',
            'phone',
            'email',
            'district',
            'street',
            'block',
            'floor',
            'unit',
          ],
          model: db.SalesOrder,
          where: {
            paid: true,
          },
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const host = req.get('host');
    const protocol = req.protocol;

    res.json(
      result.map((item) => {
        const { SalesOrder, signURL, ...restProps } = item.get();
        return {
          clientName: SalesOrder.name,
          clientPhone: SalesOrder.phone,
          clientEmail: SalesOrder.email,
          clientDistrict: SalesOrder.district,
          clientStreet: SalesOrder.street,
          clientBlock: SalesOrder.block,
          clientFloor: SalesOrder.floor,
          clientUnit: SalesOrder.unit,
          pdfURL: `${protocol}://${host}/deliveryPDFs/Chair-${restProps.id}.pdf`,
          ...restProps,
        };
      })
    );
  } catch (err) {
    next(err);
  }
}

async function getAllDeskDelivery(req, res, next) {
  try {
    const result = await db.DeskToOrder.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: db.SalesOrder,
          include: [
            {
              model: db.User,
              as: 'Seller',
              attributes: ['id', 'firstName', 'lastName', 'prefix'],
            },
          ],
        },
        {
          model: db.DeskStock,
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const host = req.get('host');
    const protocol = req.protocol;

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getDeskDelivery(req, res, next) {
  try {
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const result = await db.DeskToOrder.findAll({
      attributes: [
        'id',
        'preDeliveryDate',
        'from',
        'to',
        'delivered',
        'signURL',
      ],
      where: {
        preDeliveryDate: {
          [Sequelize.Op.gte]: fromDate,
          [Sequelize.Op.lte]: toDate,
        },
      },
      include: [
        {
          attributes: [
            'name',
            'phone',
            'email',
            'district',
            'street',
            'block',
            'floor',
            'unit',
          ],
          model: db.SalesOrder,
          where: {
            paid: true,
          },
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const host = req.get('host');
    const protocol = req.protocol;

    res.json(
      result.map((item) => {
        const { SalesOrder, signURL, ...restProps } = item.get();
        return {
          clientName: SalesOrder.name,
          clientPhone: SalesOrder.phone,
          clientEmail: SalesOrder.email,
          clientDistrict: SalesOrder.district,
          clientStreet: SalesOrder.street,
          clientBlock: SalesOrder.block,
          clientFloor: SalesOrder.floor,
          clientUnit: SalesOrder.unit,
          pdfURL: `${protocol}://${host}/deliveryPDFs/Desk-${restProps.id}.pdf`,
          ...restProps,
        };
      })
    );
  } catch (err) {
    next(err);
  }
}

async function getAllAccessoryDelivery(req, res, next) {
  try {
    const result = await db.AccessoryToOrder.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: db.SalesOrder,
          include: [
            {
              model: db.User,
              as: 'Seller',
              attributes: ['id', 'firstName', 'lastName', 'prefix'],
            },
          ],
        },
        {
          model: db.AccessoryStock,
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const host = req.get('host');
    const protocol = req.protocol;

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getAccessoryDelivery(req, res, next) {
  try {
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const result = await db.AccessoryToOrder.findAll({
      attributes: [
        'id',
        'preDeliveryDate',
        'from',
        'to',
        'delivered',
        'signURL',
      ],
      where: {
        preDeliveryDate: {
          [Sequelize.Op.gte]: fromDate,
          [Sequelize.Op.lte]: toDate,
        },
      },
      include: [
        {
          attributes: [
            'name',
            'phone',
            'email',
            'district',
            'street',
            'block',
            'floor',
            'unit',
          ],
          model: db.SalesOrder,
          where: {
            paid: true,
          },
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const host = req.get('host');
    const protocol = req.protocol;

    res.json(
      result.map((item) => {
        const { SalesOrder, signURL, ...restProps } = item.get();
        return {
          clientName: SalesOrder.name,
          clientPhone: SalesOrder.phone,
          clientEmail: SalesOrder.email,
          clientDistrict: SalesOrder.district,
          clientStreet: SalesOrder.street,
          clientBlock: SalesOrder.block,
          clientFloor: SalesOrder.floor,
          clientUnit: SalesOrder.unit,
          pdfURL: `${protocol}://${host}/deliveryPDFs/Accessory-${restProps.id}.pdf`,
          ...restProps,
        };
      })
    );
  } catch (err) {
    next(err);
  }
}

async function signDelivery(req, res, next) {
  try {
    const host = req.get('host');
    const protocol = req.protocol;

    var { productType: type, deliveryId: id, signature } = req.body;
    type = type.charAt(0).toUpperCase() + type.slice(1);

    const delivery = await db[`${type}ToOrder`].findByPk(id);
    // if (delivery.delivered) throw 'This Delivery is already finished!';
    const dirpath = 'uploads/signature';
    const filepath = `${dirpath}/${Date.now()}.png`;
    fs.writeFileSync(`server/${filepath}`, signature, 'base64');
    Object.assign(delivery, { signURL: filepath, delivered: true });
    await delivery.save();

    await _generateDeliveryPDF(type, delivery.id, `${protocol}://${host}`);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

function generateDeliveryPDF(req, res, next) {
  const host = req.get('host');
  const protocol = req.protocol;
  var { productType: type, deliveryId: id } = req.body;
  type = type.charAt(0).toUpperCase() + type.slice(1);
  if (!fs.existsSync(`server/uploads/deliveryPDFs/${type}-${id}.pdf`))
    _generateDeliveryPDF(type, id, `${protocol}://${host}`)
      .then(() => {
        res.json({
          success: true,
          url: `${protocol}://${host}/uploads/deliveryPDFs/${type}-${id}.pdf`,
        });
      })
      .catch(next);
  else
    res.json({
      success: true,
      url: `${protocol}://${host}/uploads/deliveryPDFs/${type}-${id}.pdf`,
    });
}

async function _generateDeliveryPDF(type, id, host) {
  const html = fs.readFileSync('server/view/doc/delivery.hbs', 'utf8');

  const options = {
    format: 'A4',
    orientation: 'portrait',
    border: '10mm',
  };

  const deliveryInfo = await db[`${type}ToOrder`].findOne({
    where: { id },
    include: [
      {
        model: db.SalesOrder,
        where: {
          paid: true,
        },
        include: [
          {
            model: db.User,
            as: 'Seller',
            attributes: ['firstName', 'lastName', 'prefix'],
          },
        ],
      },
      {
        model: db[`${type}Stock`],
      },
    ],
  });

  if (!deliveryInfo) throw 'Delivery was not found.';

  const preDeliveryDate =
    deliveryInfo.SalesOrder.timeLine % 7 === 0
      ? `Est ${deliveryInfo.SalesOrder.timeLine / 7} working week${
          deliveryInfo.SalesOrder.timeLine / 7 === 1 ? '' : 's'
        } after payment`
      : `Est ${deliveryInfo.SalesOrder.timeLine} working day${
          deliveryInfo.SalesOrder.timeLine === 1 ? '' : 's'
        } after payment`;

  const invoiceNum = `I-${deliveryInfo.SalesOrder.Seller.prefix}${new Date(
    deliveryInfo.SalesOrder.createdAt
  ).getFullYear()}-${('000' + deliveryInfo.SalesOrder.id).substr(-3)}`;

  const client = {
    name: deliveryInfo.SalesOrder.name,
    email: deliveryInfo.SalesOrder.email,
    phone: deliveryInfo.SalesOrder.phone,
    unit: deliveryInfo.SalesOrder.unit,
    floor: deliveryInfo.SalesOrder.floor,
    block: deliveryInfo.SalesOrder.block,
    street: deliveryInfo.SalesOrder.street,
    district: deliveryInfo.SalesOrder.district,
  };

  const delivery = {
    dueDate: deliveryInfo.SalesOrder.dueDate,
    preDeliveryDate,
    sellerName: `${deliveryInfo.SalesOrder.Seller.firstName} ${deliveryInfo.SalesOrder.Seller.lastName}`,
    paymentTerms: deliveryInfo.SalesOrder.paymentTerms,
  };

  const product = {
    qty: deliveryInfo.qty,
    description:
      type === 'Chair'
        ? `Chair Brand: ${deliveryInfo.ChairStock.brand}<br />Chair Model: ${
            deliveryInfo.ChairStock.model
          }<br />${
            deliveryInfo.ChairStock.withHeadrest
              ? 'With Headrest'
              : 'Without Headrest'
          }<br />${
            deliveryInfo.ChairStock.withAdArmrest
              ? 'With Adjustable Armrest'
              : 'Without Adjustable Armrest'
          }<br />FrameColor: ${
            deliveryInfo.ChairStock.frameColor
          }<br />Back Color: ${
            deliveryInfo.ChairStock.backColor
          }<br />Seat Color: ${
            deliveryInfo.ChairStock.seatColor
          }<br />Remark: ${
            deliveryInfo.ChairStock.remark
          }<br />With delivery and installation included`
        : type === 'Desk'
        ? `Desk Model: ${deliveryInfo.DeskStock.model}<br />Color of Legs: ${
            deliveryInfo.DeskStock.color
          }<br />ArmSize: ${deliveryInfo.DeskStock.armSize}<br />FeetSize: ${
            deliveryInfo.DeskStock.feetSize
          }<br />Beam Size: ${deliveryInfo.DeskStock.beamSize}<br />${
            deliveryInfo.hasDeskTop
              ? `Table Top: ${deliveryInfo.topMaterial} ${deliveryInfo.topColor}<br />Table Top Size: ${deliveryInfo.topLength}x${deliveryInfo.topWidth}x${deliveryInfo.topThickness}<br />Table Top Color:<br />Rounded Corners: ${deliveryInfo.topRoundedCorners}, Radius: R${deliveryInfo.topCornerRadius}<br />Holes Required: ${deliveryInfo.topHoleCount}, Holes Shaped: ${deliveryInfo.topHoleType}`
              : 'Without DeskTop'
          }<br />With delivery and installation included`
        : '',
  };

  var document = {
    html,
    data: {
      invoiceNum,
      client,
      delivery,
      product,
      signURL: deliveryInfo.signURL ? `${host}/${deliveryInfo.signURL}` : null,
    },
    path: `server/uploads/deliveryPDFs/${type}-${deliveryInfo.id}.pdf`,
    type: '',
  };
  await pdf.create(document, options);
}
