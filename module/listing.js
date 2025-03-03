const mongoose=require("mongoose")
const review = require("./review")
const listingschema= new mongoose.Schema({
    title:{
        type:String,
        requred:true
    },
    description:String,
    image:{
        filename:{
            type:String
        },
        url:{
            type:String
        },

        // set:(v)=>v=== " "? "some img":v,
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }

    ]
})
listingschema.post("findOneAndDelete",async(listing)=>{
    console.log("hello lsiting")
    console.log(listing)
    if(listing){
        // console.log(review._id)
        // console.log(listing._id)
        await review.deleteMany({_id:{$in:listing.reviews}})
    }
})
let listing=mongoose.model("Listing",listingschema)

module.exports=listing;