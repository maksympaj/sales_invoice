const util = require('util');
const multer = require('multer');
const maxSize = 2 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/stocks');
  },
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now();
    file.url = `uploads/stocks/${uniquePrefix}-${file.originalname}`;
    file.src = `server/uploads/stocks/${uniquePrefix}-${file.originalname}`;
    cb(null, `${uniquePrefix}-${file.originalname}`);
  },
});

const uploadFile = multer({
  storage,
  limits: { fileSize: maxSize },
}).single('file');

const uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
