const joi = require('joi');

const schemaUserCreate = joi.object({
    first: joi.string().alphanum().min(3).required(),
    last: joi.string().alphanum().min(3).required(),
    email: joi.string().email({minDomainSegments: 2}).required(),
    password: joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')).required(),
    repeat_password: joi.ref('password')
});

module.exports = schemaUserCreate;

