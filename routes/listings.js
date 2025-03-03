const express=require("express")
const route=express.Router()
const wrapasync=require("../utils/wrapasync");
const review = require("../module/review");
const listing=require("../module/listing");
const servervalidattion = require("../serevervalidation")
const ExpressError=require("../utils/ExpressError")


const validschemamiddleware=(req,res,next)=>{
    let {error}=servervalidattion.validate(req.body)
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

// app.get("/",(req,res)=>{
//     console.log("hello i am root")
//     res.send("hello i am root")
// })
// indexroute
route.get("/",wrapasync(async(req,res)=>{
    const ALLlistings= await listing.find()
    // console.log(ALLlistings)
    res.render("./listing/index.ejs",{ALLlistings})
}))
// new Router
route.get("/new",(req,res)=>{
    res.render("./listing/new.ejs")
})
// create Router
route.post("/",validschemamiddleware,wrapasync(async(req,res,next)=>{
        let listings=req.body.listing;
        // if(!listings){
        //     throw new ExpressError(400,"please enter  valid data")
        //   }
        console.log(listings)
       

  const create= new listing(listings)
  
//   if(!create.title){
//     throw new ExpressError(400,"please enter  valid title")
//   }
//   if(!create.decription){
//     throw new ExpressError(400,"please enter  valid decription")
//   }
//   if(!create.price){
//     throw new ExpressError(400,"please enter  valid price")
//   }
//   if(!create.location){
//     throw new ExpressError(400,"please enter  valid location")
//   }
//   if(!create.country){
//     throw new ExpressError(400,"please enter  valid country")
//   }
  console.log(create)
  await create.save()
  res.redirect("/listings")
    // console.log(create)
}))
// edit
route.get("/:id/edit",wrapasync(async(req,res,next)=>{
    let{id}=req.params;
let find=await listing.findById(id)
res.render("./listing/edit.ejs",{find})
}))
route.put("/:id",validschemamiddleware,wrapasync(async(req,res,next)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(404,"please enter  valid data")
    //   }
    let{id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect("/listings")
}))
// show routes
route.get("/:id",wrapasync(async(req,res)=>{
    let{id}=req.params;
let find=await listing.findById(id).populate("reviews")
console.log(find)
res.render("./listing/show.ejs",{find})
}))

// delete route
route.delete("/:id",wrapasync(async(req,res)=>{
    let{id}=req.params;
    let deletelisting=await listing.findByIdAndDelete(id)
    // console.log(deletelisting)
    res.redirect("/listings")
}))
module.exports=route;