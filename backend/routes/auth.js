const express = require("express");
const router = express.Router();

// TEST AUTH
router.get("/test", (req, res) => {
  res.json({ status: "AUTH ROUTE OK" });
});

module.exports = router;
