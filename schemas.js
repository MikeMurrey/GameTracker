const Joi = require('joi');


module.exports.gameSchema = Joi.object({
  game: Joi.object({
    title: Joi.string().required(),
    // image: Joi.string().required(),
    platform: Joi.string().required(),
    year: Joi.number().required().min(2020),
    note: Joi.string().allow('')
  }).required(),
  deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(0).max(5),
    body: Joi.string().required()
  }).required()
})