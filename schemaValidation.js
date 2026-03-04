const Joi = require('joi');

const listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        price : Joi.number().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        image : Joi.string().allow("",null),
    }).required()
}).required();

module.exports = listingSchema;