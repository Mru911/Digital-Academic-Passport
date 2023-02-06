var mongoose = require("mongoose");

var TeacherSchema = new mongoose.Schema({
  fullname: {
    type: String,
    trim: true,
    required: true,
  },
  collegeId: {
    type: String,
    unique: true,
    required: true,
  },
  mail:{
    type:String
  },
  password: {
    type: String,
  },
  department: {
    type: String,
    default: "",
  },
  mobile_no:{
    type:Number,
    default: 0
  },
  DOB:{
    type: String,
    default: ""
  },
  gender: {
    type: String,
    default: ""
  },
  category:{
    type: String,
    default: ""
  },
  pan: {
    type:String,
    default: ""
  },
  aadhar:{
    type: String,
    default: ""
  },
  PWD:{
    type:String,
    default: ""
  },
  blood_grp:{
    type:String,
    default: ""
  },
  temporary_address:{
    type:String,
    default: ""
  },
  permenant_Address:{
    type:String,
    default: ""
  },
  role:{
    type:String,
    default: "teacher"
  }
},
{timestamps: true});

module.exports = mongoose.model("Teachers",TeacherSchema);