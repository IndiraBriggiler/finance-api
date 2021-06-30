var express = require("express");
var router = express.Router();
const data = require("../data/balance");
const auth = require("../middleware/auth");

//solo put, get, delete

router.get("/:id", auth, async (req, res) => {
  const balance = await data.getBalance(req.params.id);
  if (balance) {
    res.json(balance);
  } else {
    res.status(404).send("Balance no encontrado");
  }
});

module.exports = router;
