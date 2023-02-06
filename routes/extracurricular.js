const router = require("express").Router();
const ExtraC = require("../models/ExtraCurricular");
const cloudinary = require("../utils/cloudinary");

router.post("/newExtrac", async (req, res) => {
  const {
    organization,
    role,
    desc,
    sdate,
    edate,
    student_id,
    file,
    sname,
    sdiv,
    srollno,
    sbatch,
  } = req.body;
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "extra_curricular/",
    });
    const newExtra = new ExtraC({
      organization,
      role,
      desc,
      sdate,
      edate,
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
    const extra = await newExtra.save();
    res.status(200).json(extra);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get by student id

router.get("/getbysidd/:id", async (req, res) => {
  const sid = req.params.id;
  try {
    const extracs = await ExtraC.find({ student_id: sid });
    res.status(200).json(extracs);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/getbydiv/:div", async (req, res) => {
  const sdiv = req.params.div;
  try {
    const extracs = await ExtraC.find({ sdiv });
    res.status(200).json(extracs);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/getbybatch/:batch", async (req, res) => {
  const sbatch = req.params.batch;
  try {
    const extracs = await ExtraC.find({ sbatch });
    res.status(200).json(extracs);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
router.get("/getbyroll/:rollno", async (req, res) => {
  const srollno = req.params.rollno;
  try {
    const extracs = await ExtraC.find({ srollno });
    res.status(200).json(extracs);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
// delete extra curricular activity
router.delete("/deleteactivitiy/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const acti = await ExtraC.findOne({ _id: id });
    // console.log(notice);
    const fileId = acti.file.public_id;
    await cloudinary.uploader.destroy(fileId);
    await ExtraC.findOneAndDelete({ _id: id });
    res.status(200).json("Deleted Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
