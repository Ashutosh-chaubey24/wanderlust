const mongoose=require("mongoose")
const listing=require("../module/listing")
const initdata=require("./data");
 const MONGOURL='mongodb://127.0.0.1:27017/wanderlust'
async function main() {
    mongoose.connect(MONGOURL)
}
main().then((res)=>{
    console.log("connection is sucsses")
}).catch((err)=>{
    console.log(err)
}) 

const initDb=async ()=>{
    await listing.deleteMany({})
    await listing.insertMany(initdata.data)
    console.log("data was initilazied")
}
initDb()


