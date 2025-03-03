class ExpressError extends Error{
    constructor(statscode,message){
        super();
        this.statscode=statscode
        this.message=message
    }
}
module.exports=ExpressError