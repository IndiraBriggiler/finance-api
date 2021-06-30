var express = require("express");
var router = express.Router();
const data = require("../data/transfer");
const schemaTransferCreate = require("../schema/transferCreate");
const schemaUpdateTransfer = require("../schema/updateTransfer");
const auth = require("../middleware/auth");

router.get("/:id", auth, async (req, res) => {
  const transfers = await data.getTransfers(req.params.id);
  console.log(transfers);
  if (transfers) {
    res.json(transfers);
  } else {
    res.status(404).send("Transferencias no encontradas");
  }
});

router.post("/:id", auth, async (req, res) => {
  let validation = schemaTransferCreate.validate(req.body);
  if (validation.error) {
    res.status(400).send(validation.error.details[0].message);
  } else {
    const result = await data.addTransfer(req.body, req.params.id);
    res.send(result);
  }
});

router.delete("/:id", auth, async (req, res) => {

  const result = await data.deleteTransfer(req.params.id, req.body);
  res.send(result);

});

router.put("/:id", auth, async (req, res) => {
  let validation = schemaUpdateTransfer.validate(req.body);
  if (validation.error) {
    res.status(400).send(validation.error.details[0].message);
  } else {
    const result = await data.updateTransfer(req.params.id, req.body);
    res.send(result)
  }
});

module.exports = router;
