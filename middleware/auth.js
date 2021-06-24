const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const user = jwt.verify(token, "ultrasecreta");
    next();
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
}

// function authorization(userId, token) {
//   try {
//     const user = jwt.verify(token, "ultrasecreta");
//    (user._id === userId){

//    }
//   } catch (error) {
//     res.status(401).send({ error: error.message });
//   }
// }

module.exports = auth;
