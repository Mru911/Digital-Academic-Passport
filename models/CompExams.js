var mongoose = require("mongoose");

var CompExams = new mongoose.Schema({
    exam:{
        type:String,
        required: true
    },
    date:{
        type:Date,
        required: true
    },
    score:{
        type:Number
    },
    file:{
        public_id:{
            type:String
        },
        url:{
            type:String
        }
    },
    student_id:{
        type:String
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
})

module.exports = mongoose.model("CompExams",CompExams);