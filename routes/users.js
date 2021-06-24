var express = require("express");
var router = express.Router();
const data = require("../data/user");
const auth = require("../middleware/auth");
const { id } = require("../schema/userCreate");
const schemaUserCreate = require("../schema/userCreate");
const schemaUserUpdate = require("../schema/userUpdate");

router.get("/:id", auth, async (req, res, userToken) => {
  //todo autenticacion
  //si no mando algo en el body no funciona
  //Esto ver
  if (userToken._id === req.params.id) {
    console.log("esta ok");
  }
  console.log(userToken);
  const user = await data.getUser(req.params.id);
  if (user) {
    //preguntar si lo mandamos con password
    delete user.password;
    res.json(user);
  } else {
    res.status(404).send("Usuario no encontrado");
  }
});

router.post("/", async (req, res) => {
  const result = schemaUserCreate.validate(req.body);
  const emailExists = await data.validateEmail(req.body.email);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
  } else if (!emailExists) {
    let user = await data.addUser(req.body);
    res.send(user);
  } else {
    res.status(400).send("El email ya se encuentra registrado");
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await data.findByCredential(req.body.email, req.body.password);
    const token = data.generateAuthToken(user);
    res.send({ user, token });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  //todo autenticacion
  let result = schemaUserUpdate.validate(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
  }
  if (req.body.email) {
    const emailExists = await data.validateEmail(req.body.email);
    if (emailExists) {
      res.status(400).send("El email ya se encuentra registrado");
    }
  }
  result = await data.updateUser(req.body, req.params.id);
  res.json(result);
});

router.delete("/:id", auth, async (req, res) => {
  const user = await data.getUser(req.params.id);
  if (!user) {
    res.status(404).send("Usuario no encontrado");
  } else {
    data.deleteUser(req.params.id);
    res.status(200).send("Usuario eliminado");
  }
});

module.exports = router;
