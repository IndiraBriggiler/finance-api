const joi = require('joi');

const schemaTransactionCreate = joi.object({
    type: joi.string().valid("ingreso", "egreso").required(),
    category: joi.string().length(24).required(),
    description: joi.string(),
    amount: joi.number().min(0.1).required(),
    account: joi.string().length(24).required(),
    date: joi.date().iso(),
});

module.exports = schemaTransactionCreate;
