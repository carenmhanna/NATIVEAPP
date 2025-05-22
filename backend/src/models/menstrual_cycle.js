const mongoose= require("mongoose")

const menstrual_cycle =new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId, ref:"user",
        required:true
    },

    log_date:{
        type: Date,
        required:true,
    },

    period:{
        is_on_period:{
            type:Boolean
        },
        start_date:{
            type: Date
        }
    },

    pregnant:{
        type:Boolean
    }


})



module.exports=mongoose.model("menstrual_cycle",menstrual_cycle)