var express = require("express");
var router = express.Router();
const data = require("../data/transfer");
// const schemaTransferCreate = require("../schema/transferCreate");

// router.get("/:id", async (req, res) => {
//   const accounts = await data.getAccounts(req.params.id);
//   console.log(accounts);
//   if (accounts) {
//     res.json(accounts);
//   } else {
//     res.status(404).send("Cuenta no encontradas");
//   }
// });

module.exports = router;
