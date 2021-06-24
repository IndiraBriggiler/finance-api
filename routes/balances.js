var express = require("express");
var router = express.Router();
const data = require("../data/user");
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

router.delete("/:id", auth, async (req, res) => {
  const result = await data.deleteBalance(req.params.id, req.body);
  res.send(result);
});

router.put("/:id", auth, async (req, res) => {
  const result = await data.updateBalance(req.params.id, req.body);
  res.send(result);
});

module.exports = router;
