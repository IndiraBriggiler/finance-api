const joi = require('joi');

const schemaCategoryCreate = joi.object({
    type: joi.string().valid("ingreso", "egreso").required(),
    title: joi.string().required(),
    icon: joi.object().keys({
        type: joi.string().required(),
        name: joi.string().required()
    }).required(),
});

module.exports = schemaCategoryCreate;