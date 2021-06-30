const joi = require("joi");

const schemaUpdateTransfer = joi.object({
  _id: joi.string().length(24).required(),
  amount: joi.number().min(0.1).required(),
  incomeAccountId: joi.string().length(24).required(),
  outcomeAccountId: joi.string().length(24).required(),
  date: joi.date().iso(),
});

module.exports = schemaUpdateTransfer;
