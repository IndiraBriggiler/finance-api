var express = require("express");
var router = express.Router();
const data = require("../data/account");
const auth = require("../middleware/auth");

const accountCreate = require("../schema/accountCreate");

router.get("/:id", auth, async (req, res) => {
  const accounts = await data.getAccounts(req.params.id);
  console.log(accounts);
  if (accounts) {
    res.json(accounts);
  } else {
    res.status(404).send("Cuentas no encontradas");
  }
});

//HACER EL FILTRO POR ID DE CUENTA

// router.get("/:id", auth, async (req, res) => {
//   const account = await data.getAccount(req.params.id);
//   console.log(account);
//   if (account) {
//     res.json(account);
//   } else {
//     res.status(404).send("Cuenta no encontrada");
//   }
// });

router.post("/:id", auth, async (req, res) => {
  let validation = accountCreate.validate(req.body);
  if (validation.error) {
    res.status(400).send(validation.error.details[0].message);
  } else {
    const result = await data.addAccount(req.body, req.params.id);
    res.send(result);
  }
});

router.delete("/:id", auth, async (req, res) => {
  const result = await data.deleteAccount(req.params.id);
  res.send(result);
});

// router.put("/:id", auth, async (req, res) => {
//   const result = await data.updateAccount(req.params.id, req.body);
//   res.send(result);
// });

module.exports = router;
