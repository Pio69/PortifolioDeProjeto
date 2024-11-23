// routes/measuresRoutes.js
const express = require("express");
const router = express.Router();
const measuresController = require("../controllers/measuresController");

router.get("/measures", measuresController.getMeasures);
router.get('/history', measuresController.getHistory);

module.exports = router;
