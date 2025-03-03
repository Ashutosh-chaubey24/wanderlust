const express=require("express");
const mongoose=require("mongoose")
const listing=require("./module/listing");
const app=express()
const ExpressError=require("./utils/ExpressError")
const methodoverride=require("method-override")
app.use(methodoverride("_method"))
const reviews=require("./module/review")
const path=require("path");
const servervalidattion =require("./serevervalidation")
const reviewvalidation =require("./reviewvalidation")
const { render } = require("ejs");
const ejsmate=require("ejs-mate");
const wrapasync=require("./utils/wrapasync");
const review = require("./module/review");
app.use(express.static(path.join(__dirname,"public")))
app.engine("ejs",ejsmate)
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views"))
 const MONGOURL='mongodb://127.0.0.1:27017/wanderlust'
async function main() {
    mongoose.connect(MONGOURL)
}
main().then((res)=>{
    console.log("connection is sucsses")
}).catch((err)=>{
    console.log(err)
})
const validschemamiddleware=(req,res,next)=>{
    let {error}=servervalidattion.validate(req.body)
    console.log(error)
    // console.log(result)
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",")
        console.log(errmsg)
        throw new ExpressError(400,errmsg)
    }
    else{
        next()
    }
}
const validReviewmiddleware=(req,res,next)=>{
    let {error}=reviewvalidation.validate(req.body)
    // console.log(result)
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",")
        console.log(errmsg)
        throw new ExpressError(400,errmsg)
    }
    else{
        console.log("chek")
        next()
    }
}
//  all listings
app.get("/listings",wrapasync(async(req,res)=>{
    let ALLlistings= await listing.find({})
    console.log(ALLlistings)
    res.render("./listing/index.ejs",{ALLlistings})
}))
// new route
app.get("/listings/new" ,(req,res)=>{
    res.render("./listing/new.ejs")
})
app.post("/listings",validschemamiddleware,wrapasync(async(req,res)=>{
    let newlisting=req.body.listing
    console.log(newlisting);
   result= await new listing(newlisting)
   result.save()
}))
// show Rout
app.get("/listings/:id",wrapasync(async(req,res)=>{
    let{id}=req.params;
    let find=await listing.findById(id)
    console.log(find)
    res.render("./listing/show.ejs",{find})
}))
// edit route
app.get("/listings/:id/edit",wrapasync(async(req,res)=>{
    let{id}=req.params;
    let find=await listing.findById(id)
    res.render("./listing/edit.ejs",{find})
}))
app.put("/listings/:id",validschemamiddleware,wrapasync(async(req,res)=>{
    let {id}=req.params;
    let editlisting= await  listing.findByIdAndUpdate(id,{...req.body.listing})
    console.log(editlisting)
res.redirect(`/listings/${id}`)
}))

// delete route
app.delete("/listings/:id", wrapasync(async(req,res)=>{
    let {id}=req.params;
    let deletelisting=await listing.findByIdAndDelete(id)
    res.redirect("/listings")
}))
// review
//post review route
app.post("/listings/:id/reviews",validReviewmiddleware,wrapasync(async(req,res)=>{
     let listings =await listing.findById(req.params.id)
    //  console.log("hello")
    //  console.log(listings)
     let newreview= new reviews(req.body.review)
     console.log(newreview)
     listings.reviews.push(newreview)
      await newreview.save();
      await listings.save();
      res.redirect(`/listings/${listings._id}`)
}))
// delete review route
app.delete("/listings/:id/reviews/:reviewid", wrapasync(async(req,res)=>{
let {id,reviewid}=req.params;
await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}})
await reviews.findByIdAndDelete(reviewid)
res.redirect(`/listings/${id}`)
}))
// app.get("/testing",async(req,res)=>{
//     let listingdata= await new listing({
//         title:"house",
//         description:"hose is goa",
//         price:1200,
//         country:"india",
//         location:"renukoot",
//     })
//     listingdata.save()
//     console.log("data was saved")
//     res.send("sucsses")

// })
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page is not found"))
})
app.use((err,req,res,next)=>{
    // console.log(err)
    let{statscode=500,message="somthing want wrong"}=err
    res.status(statscode).render("./listing/error.ejs",{err})
})
app.listen(8080,()=>{
    console.log("listen at port 8080" )
})