const joi = require('joi');

const schemaUpdateTransaction = joi.object({
    _id: joi.string().length(24).required(),
    type: joi.string().valid("ingreso", "egreso").required(),
    category: joi.string().length(24).required(),
    description: joi.string().required(),
    amount: joi.number().min(0.1).required(),
    account: joi.string().length(24).required(),
    date: joi.date().iso().required(),
});

module.exports = schemaUpdateTransaction;