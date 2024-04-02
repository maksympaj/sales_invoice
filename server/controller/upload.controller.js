const fs = require('fs');
const XLSX = require('xlsx');

const uploadFile = require('server/middleware/upload');

module.exports = {
  upload,
  uploadCreate,
};

async function upload(req, res, next) {
  try {
    await uploadFile(req, res);
    if (req.file === undefined) next(new Error('Please upload a file!'));
    else {
      const host = req.get('host');
      const protocol = req.protocol;

      res.json({
        url: `${protocol}://${host}/${req.file.url}`,
      });
    }
  } catch (err) {
    next(err);
  }
}

async function uploadCreate(req, res, next) {
  try {
    await uploadFile(req, res);
    if (req.file === undefined) next(new Error('Please upload a file!'));
    const workbook = XLSX.readFile(req.file.src);
    let worksheets = {};
    for (const sheetName of workbook.SheetNames) {
      worksheets[sheetName] = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheetName]
      );
    }
    const chairStocks = await db.ChairStock.bulkCreate(
      (worksheets.Chairs || []).map((item) => ({
        brand: item['Brand'],
        model: item['Model'],
        frameColor: item['Frame Color'],
        backColor: item['Back Color'],
        seatColor: item['Seat Color'],
        backMaterial: item['Back Material'],
        seatMaterial: item['Seat Material'],
        withHeadrest:
          String(item['Headrest']).toLowerCase === 'yes' ? true : false,
        withAdArmrest:
          String(item['Adjustable Armrest']).toLowerCase === 'yes'
            ? true
            : false,
        unitPrice: item['Unit Price'],
      }))
    );
    const deskStocks = await db.DeskStock.bulkCreate(
      (worksheets.Desks || []).map((item) => ({
        supplierCode: item['Supplier'],
        model: item['Model'],
        color: item['Color'],
        armSize: item['Arm Size'],
        feetSize: item['Feet Size'],
        beamSize: item['Beam Size'],
        unitPrice: item['Unit Price'],
      }))
    );
    res.json({ chairs: chairStocks.length, desks: deskStocks.length });
  } catch (error) {
    console.log(error);
    next(error);
  }
}
