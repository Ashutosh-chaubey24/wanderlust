const joi=require("joi")
const review = require("./module/review")
const reviewvalidation=joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        Comment:joi.string().required()
    }).required()
})
module.exports=reviewvalidation