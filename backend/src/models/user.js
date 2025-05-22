const mongoose= require("mongoose")

const userSchema =new mongoose.Schema({
    first_name:{
        type: String,
        required:true
    },

    last_name:{
        type: String,
        required:true
    },

    gender:{
        type: String,
        required:true,
        enum:["Male","Female","Other","Prefer not to say"],
    },

    menstrualCycleStatus: {
        type: String,
        enum: ["Regular", "Irregular", "Pregnancy", "Menopause"],
        validate: {
            validator: function(value) {
                if (this.gender === "Male" && value) {
                    return false; 
                }
                if (this.gender === "Female" && !value) {
                    return false; 
                }
                return true; 
            },
            message: function(props) {
                return props.value
                    ? "Menstrual Cycle Status can not be entered for male patients."
                    : "Menstrual Cycle Status is required for female patients.";
            }
        }
    },

    date_of_birth:{
        type: Date,
        required: true
    },

    email:{
        type: String,
        required: true,
        lowercase: true
    },

    password:{
        type:String,
        required: true 
    },

    phone: {
    type: String,
    required: true
    },

seizureTypes:{
    type: String,
    required:true,
    enum:["Focal With Loss of Awareness"," Focal Without Loss of Awarness", "Generalized","Non-epileptic"],
},

medication: [{
    medication_name: {
        type: String,
        required: true,
        enum: [
                    "ESCITALOPRAM 10 mg",
                    "ESCITALOPRAM 15 mg",
                    "FLUOXETINE 20 mg",
                    "SERTRALINE 50 mg",
                    "SERTRALINE 100 mg",
                    "FLUVOXAMINE 100 mg",
                    "PAROXETINE 20 mg",
                    "PAROXETINE 25 mg",
                    "CITALOPRAM 20 mg",
                    "VORTIOXETINE 5 mg",
                    "VORTIOXETINE 10 mg",
                    "VORTIOETINE 20 mg",
                    "VENLAFAXINE 37.5 mg",
                    "VENLAFAXINE 75 mg",
                    "VENLAFAXINE 150 mg",
                    "DULOXETINE 30 mg",
                    "DULOXETINE 60 mg",
                    "BUPROPION 150 mg",
                    "CLOMIPRAMINE 25 mg",
                    "CLOMIPRAMINE 75 mg",
                    "IMIPRAMINE 10 mg",
                    "IMIPRAMINE 25 mg",
                    "AMITRYPTILINE 10 mg",
                    "AMITRYPTILINE 25 mg",
                    "DOXEPIN 10 mg",
                    "DOXEPINE 50 mg",
                    "MIRTAZAPINE 30 mg",
                    "RISPERIDONE 1 mg",
                    "RISPERIDONE 2 mg",
                    "RISPERIDONE 4 mg",
                    "OLANZAPINE 5 mg",
                    "OLANZAPINE 10 mg",
                    "OLANZAPINE 20 mg",
                    "QUETIAPINE 25 mg",
                    "QUETIAPINE 50 mg",
                    "QUETIAPINE 100 mg",
                    "QUETIAPINE 300 mg",
                    "QUETIAPINE 400 mg",
                    "CLOZAPINE 100 mg",
                    "CLOZAPINE 25 mg",
                    "PALIPERIDONE 3 mg",
                    "PALIPERIDONE 6 mg",
                    "PALIPERIDONE 9 mg",
                    "ARIPIPRAZOLE 5 mg",
                    "ARIPIPRAZOLE 10 mg",
                    "ARIPIPRAZOLE 15 mg",
                    "ARIPIPRAZOLE 30 mg",
                    "CARIPRAZINE 1.5 mg",
                    "CARIPRAZINE 3 mg",
                    "CARIPRAZINE 4.5 mg",
                    "CARIPRAZINE 6 mg",
                    "AMISULPRIDE 100 mg",
                    "AMISULPRIDE 400 mg",
                    "PIMOZIDE 4 mg",
                    "HALDOL 5 mg",
                    "PERPHENAZINE 8 mg",
                    "CHLORPROMAZINE 100 mg",
                    "CHLORPROMAZINE 25 mg",
                    "PROMETHAZINE 25 mg",
                    "ALPRAZOLAM 0.5 mg",
                    "ALPRAZOLAM 2 mg",
                    "LORAZEPAM 1 mg",
                    "LORAZEPAM 2 mg",
                    "CLONAZEPAM 0.5 mg",
                    "CLONAZEPAM 2 mg",
                    "DIAZEPAM 5 mg",
                    "DIAZEPAM 10 mg",
                    "BROMAZEPAM 1.5 mg",
                    "BROMAZEPAM 3 mg",
                    "BROMAZEPAM 6 mg",
                    "ZOLPIDEM 10 mg",
                    "ZOPICLONE 2 mg",
                    "ZOPICLONE 3 mg",
                    "METHYLPHENIDATE (RITALIN) 10 mg",
                    "METHYLPHENIDATE (CONCERTA) 18 mg",
                    "METHYLPHENIDATE (CONCERTA) 27 mg",
                    "METHYLPHENIDATE (CONCERTA) 36 mg",
                    "METHYLPHENIDATE (CONCERTA) 54 mg",
                    "ATOMOXETINE 18 mg",
                    "ATOMOXETINE 25 mg",   
                    "Other"]
    },
    other_medication_name: {
        type: String,
        required: false // Not required, always optional
    },
    dose: {
        type: String,
        required: false // dose is optional
    },
    frequency: {
        type: String,
        required: true,
        enum: ["Daily", "As needed", "Rarely"] // add more if needed
    }
}],
})

module.exports=mongoose.model("user",userSchema)