var mongoose = require("mongoose");

var LORSchema = new mongoose.Schema({
  sname: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
  },
  date: {
    type: String,
    required: true,
  },
  sid: {
    type: String,
  },
  yearpassing: {
    type: String,
    required: true,
  },
  rollno: {
    type: Number,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  parentemail: {
    type: String,
    required: true,
  },
  parentcontact: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  passportphoto: {
    type: String,
    required: true,
  },
  year: {
    type: String,
  },
  marks: {
    type: String,
  },
  percentage: {
    type: String,
  },
  year1: {
    type: String,
  },
  marks1: {
    type: String,
  },
  percentage1: {
    type: String,
  },
  year2: {
    type: String,
  },
  marks2: {
    type: String,
  },
  percentage2: {
    type: String,
  },
  year3: {
    type: String,
  },
  marks3: {
    type: String,
  },
  percentage3: {
    type: String,
  },
  exam: {
    type: String,
  },
  enrollno: {
    type: String,
  },
  score: {
    type: String,
  },
  result: {
    type: String,
  },
  faculty: {
    type: String,
  },
  program: {
    type: String,
  },
  university: {
    type: String,
  },
  branch: {
    type: String,
  },
  div: {
    type: String,
  },
  country: {
    type: String,
  },
});

module.exports = mongoose.model("LOR", LORSchema);
