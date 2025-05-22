const mongoose= require("mongoose")

const mental_health =new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId, ref:"user",
        required:true
    },

    log_date:{
        type: Date,
        required:true,
    },

    stress:{
        type:Number,
        required:true,
        min:0,
        max:10
    }, 
    
    mood:{
        type:Number,
        required:true,
        min:0,
        max:10
    },

    significant_event:{
        severity: {
            type: Number,
            min:0,
            max:10
        }
    },


})



module.exports=mongoose.model("mental_health",mental_health)