const mongoose= require("mongoose")

const food_and_diet =new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId, ref:"user",
        required:true
    },

    log_date:{
        type: Date,
        required:true,
    },

    meal_frequency:{
        type:Number,
        min:0,
        required:true
    },

    water:{
        type:Number,
        min:0,
        required:true
    },


})



module.exports=mongoose.model("food_and_diet",food_and_diet)