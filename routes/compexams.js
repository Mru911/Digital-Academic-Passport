const router = require("express").Router();
const CompExam = require("../models/CompExams");
const cloudinary = require("../utils/cloudinary");


router.post("/newCompExam", async (req, res) => {
    const {
      exam,
      date,
      score,
      file,
      student_id,
      sname,
      sdiv,
      srollno,
      sbatch,
    } = req.body;
    try {
      const result = await cloudinary.uploader.upload(file, {
        folder: "Competitive_Exams/",
      });
      const newCompExam = new CompExam({
        exam,
        date,
        score,
        student_id,
        file: {
          public_id: result.public_id,
          url: result.secure_url,
        },
        sname,
        sdiv,
        srollno,
        sbatch,
      });
      const extra = await newCompExam.save();
      res.status(200).json(extra);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });


  
router.get("/getbysid/:id", async (req, res) => {
    const sid = req.params.id;
    try {
      const extracs = await CompExam.find({ student_id: sid });
      res.status(200).json(extracs);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  
  router.get("/getbydiv/:div", async (req, res) => {
    const sdiv = req.params.div;
    try {
      const extracs = await CompExam.find({ sdiv });
      res.status(200).json(extracs);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  
  router.get("/getbybatch/:batch", async (req, res) => {
    const sbatch = req.params.batch;
    try {
      const extracs = await CompExam.find({ sbatch });
      res.status(200).json(extracs);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  router.get("/getbyroll/:rollno", async (req, res) => {
    const srollno = req.params.rollno;
    try {
      const extracs = await CompExam.find({ srollno });
      res.status(200).json(extracs);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  // delete extra curricular activity
  router.delete("/deletecomexam/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const acti = await CompExam.findOne({ _id: id });
      // console.log(notice);
      const fileId = acti.file.public_id;
      await cloudinary.uploader.destroy(fileId);
      await CompExam.findOneAndDelete({ _id: id });
      res.status(200).json("Deleted Successfully");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  
  
  module.exports = router;