var express = require("express");
var router = express.Router();
const data = require("../data/transfer");
const schemaTransferCreate = require("../schema/transferCreate");
const auth = require("../middleware/auth");

router.get("/:id",auth, async (req, res) => {
  const transfers = await data.getTransfers(req.params.id);
  console.log(transfers);
  if (transfers) {
    res.json(transfers);
  } else {
    res.status(404).send("Transferencias no encontradas");
  }
});

router.post("/:id", async (req, res) => {
  let validation = schemaTransferCreate.validate(req.body);
  if (validation.error) {
    res.status(400).send(validation.error.details[0].message);
  } else {
    const result = await data.addTransfer(req.body, req.params.id);
    res.send(result);
  }
});

router.delete("/:id", async (req, res) => {
  const result = await data.deleteTransfer(req.params.id);
  res.send(result);
});

router.put("/:id", async (req, res) => {
  const result = await data.updateTransfer(req.params.id, req.body);
  res.send(result);
});

module.exports = router;
