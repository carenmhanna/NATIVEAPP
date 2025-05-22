const mongoose= require("mongoose")

const alcohol_and_substance_use =new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId, ref:"user",
        required:true
    },

    log_date:{
        type: Date,
        required:true,
    },

    alcohol:[{
        alcoholType: { 
            type: String, 
            enum: ["Vodka", "Beer", "Whiskey", "Gin", "Wine", "Arak", "Other"],
            },
        quantity: Number,
        unit: { type: String, enum: ["glass", "shot"] },
        
    }],

    smoking:[{
        smokingType: { 
            type: String, 
            enum: ["Icos", "Vape", "Cigar", "Cigarette", "Other"], 
        },
        quantity:Number,
    }],

    narguileh:{ 
        quantity:Number,
    },

    Caffeine:[{
        CaffeineType: { 
            type: String, 
            enum: ["Coffee", "Tea","Soft Drinks"], 
            },
        quantity:Number,
    }],

    energy_drinks:[{
        energy_drink_type:{
            type:String,
            enum: ["Red Bull", "Monster", "XXL", "Dark Blue"],
        },
        quantity:Number,
    }],

    recreational_drug_use :[{
            drugtype:{type:String},
            quantity:Number
        }],


})



module.exports=mongoose.model("alcohol_and_substance_use",alcohol_and_substance_use)