var mongoose = require("mongoose");

var Notices = new mongoose.Schema({
    notice_by:{
        type:String,
        required: true
    }
    ,
    heading:{
        type:String,
        required: true
    },
    desc:{
        type:String,
        required: true
    }
    ,
    forw:{
        type:String,
        required: true
    },
    important:{
        type: Boolean,
    },
    teacher_id:{
        type:String,
        required: true
    },
    file:{
        public_id: {
            type: String,
          },
          url: {
            type: String,
          },
    },

},
{timestamps: true})

module.exports = mongoose.model("Notices",Notices)