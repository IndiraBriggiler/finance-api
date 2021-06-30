const joi = require('joi');

const schemaUpdateCategory = joi.object({
    title: joi.string(),
    icon: joi.object().keys({
        type: joi.string().required(),
        name: joi.string().required()
    }),
});

module.exports = schemaUpdateCategory;