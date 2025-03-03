const joi=require("joi")
const listing = require("./module/listing")
const servervalidattion=joi.object({
    listing:joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        price:joi.number().required().min(0),
        country:joi.string().required(),
        image:joi.object({url:joi.string().allow("",null)}),
        location:joi.string().required()
        }).required()
})
module.exports=servervalidattion
