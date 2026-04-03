const Joi = require('joi');

const listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        price : Joi.number().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        image : Joi.object({
            url: Joi.string().allow("", null),
            filename: Joi.string().optional()
        }).optional(),
    }).required()
}).required();

module.exports = listingSchema;

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
    }).required()
}).required();