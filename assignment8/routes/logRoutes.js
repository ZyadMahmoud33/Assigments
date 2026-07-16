const express = require("express");
const router = express.Router();
const { insertLog } = require("../controllers/logController");

router.post("/", insertLog);

module.exports = router;
