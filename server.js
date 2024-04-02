require("rootpath")();
require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("server/middleware/error-handler");
require("server/whatsapp/main.js");

const authorize = require("server/middleware/authorize");
const uploadController = require("server/controller/upload.controller");

global.db = require("server/models");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// api routes
router.use("/chairStock", require("server/routes/chairStock.routes"));
router.use("/deskStock", require("server/routes/deskStock.routes"));
router.use("/accessoryStock", require("server/routes/accessoryStock.routes"));
router.use("/sales", require("server/routes/sales.routes"));
router.use("/quotation", require("server/routes/quotation.routes"));
// router.use("/purchase", require("server/routes/purchase.routes"));
router.use("/shipment", require("server/routes/shipment.routes"));
router.use("/delivery", require("server/routes/delivery.routes"));
router.use("/user", require("server/routes/user.routes"));
router.use("/email", require("server/routes/email.routes"));
router.use("/whatsapp", require("server/routes/whatsapp.routes"));
router.post("/upload", authorize(), uploadController.upload);

app.use("/api", router);

app.use("/uploads", express.static(path.join(__dirname, "server", "uploads")));
app.use("/images", express.static(path.join(__dirname, "server", "images")));
app.use("/deliveryPDFs", express.static(path.join(__dirname, "server", "uploads", "deliveryPDFs")));

app.use(express.static(path.join(__dirname, "client", "build")));

app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// global error handler
app.use(errorHandler);

// start server
const port = 4000; //process.env.NODE_ENV === 'production' ? process.env.PORT || 80 : 4000;
app.listen(port, () => console.log("Server listening on port " + port));
