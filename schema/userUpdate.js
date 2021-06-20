const joi = require('joi');

//como hacer para que repeat sea obligatorio cuando password viene

const schemaUserUpdate = joi.object({
    first: joi.string().alphanum().min(3),
    last: joi.string().alphanum().min(3),
    email: joi.string().email({minDomainSegments: 2}),
    password: joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')),
    repeat_password: joi.ref('password'),
    rol: joi.number().min(0).max(1)
});

module.exports = schemaUserUpdate;