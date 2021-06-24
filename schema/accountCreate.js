const joi = require("joi");

const accountCreate = joi.object({
  title: joi.string().required(),
  icon: joi
    .object()
    .keys({ type: joi.string().required(), name: joi.string().required() })
    .required(),
  balance: joi.number().min(0.1).required(),
});

module.exports = accountCreate;
