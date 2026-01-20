const express = require("express");
const router = express.Router();
const controller = require("../controllers/test.controller");

router.get("/mysql", controller.testMySQL);
router.get("/mongo", controller.testMongo);
router.get("/sqlserver", controller.testSQLServer);

module.exports = router;
