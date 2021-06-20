const joi = require("joi");

const schemaTransferCreate = joi.object({
  // type: joi.string().valid("ingreso", "egreso").required(),
  // category: joi.string().length(24).required(),
  // description: joi.string(),
  amount: joi.number().min(0.1).required(),
  incomeAccountId: joi.string().length(24).required(),
  outcomeAccountId: joi.string().length(24).required(),
  date: joi.date().iso(),
});

// {
//   "amount": 2000,
// "incomeAccountId": "60c620da96ce0f4824fb6a04",
// "outcomeAccountId": "60c620da96ce0f4824fb6a03",

// }

module.exports = schemaTransferCreate;
