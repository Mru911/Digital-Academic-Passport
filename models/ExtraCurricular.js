var mongoose = require("mongoose");

var ExtraCurricular = new mongoose.Schema({
    organization:{
        type:String,
        required: true
    },
    role:{
        type:String,
        required: true
    },
    desc:{
        type:String
    },
    sdate:{
        type:Date,
    },
    edate:{
        type:Date
    },
    student_id:{
        type:String,
        required: true
    },
    sname:{
        type:String
    },
    sdiv:{
        type:String
    },
    srollno:{
        type:Number
    },
    sbatch:{
        type:String
    },
    file:{
        public_id:{
            type:String,
            required: true,
        },
        url:{
            type:String,
            required: true,
        }
    }
},{timestamps: true})

module.exports = mongoose.model("Extracurricular",ExtraCurricular);