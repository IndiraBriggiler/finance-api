const joi = require("joi");

const schemaTransferCreate = joi.object({
  amount: joi.number().min(0.1).required(),
  incomeAccountId: joi.string().length(24).required(),
  outcomeAccountId: joi.string().length(24).required(),
  date: joi.date().iso(),
});

module.exports = schemaTransferCreate;
