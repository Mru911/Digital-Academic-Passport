const router = require("express").Router();
const Batches = require("../models/Batch");
const nodemailer = require("nodemailer");
const Students = require("../models/Students");
const cloudinary = require("../utils/cloudinary");


let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

router.post("/newBatch", async (req, res) => {
  const { batch_name, guardian_id, guardian_teacher, batch_div, batch_branch } =
    req.body;
  try {
    const newBatch = new Batches({
      batch_name,
      guardian_id,
      guardian_teacher,
      batch_div,
      batch_branch,
    });
    const batch = await newBatch.save();
    res.status(200).json(batch);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
// delete batch
router.delete("/deletebatch/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await Batches.findByIdAndDelete({ _id: id });
    res.status(200).json("Deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/getbatches", async (req, res) => {
  try {
    const batches = await Batches.find();
    res.status(200).json(batches);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get batches by teacher
router.get("/getbatches/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const batches = await Batches.find({ guardian_id: id });
    res.status(200).json(batches);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// add students to batch

router.put("/addstudents/:batchid", async (req, res) => {
  const id = req.params.batchid;
  try {
    // const students= req.body.students;
    const { students_mail, parents_mail } = req.body;
    const batch1 = await Batches.findById({ _id: id });
    const stdarr = students_mail;
    const parentarr = parents_mail;
    const prevstd = batch1.student_mails;
    const prevparents = batch1.parent_mails;
    const arr = stdarr.concat(prevstd);
    const parr = parentarr.concat(prevparents);
    const smail = students_mail[0];
    await Students.findOneAndUpdate(
      {
        id: smail,
      },
      {
        batch: batch1.batch_name,
      }
    );

    const batch = await Batches.findByIdAndUpdate(
      { _id: id },
      { $push: { batch_Students: req.body.students } }
    );

    await Batches.findByIdAndUpdate(
      { _id: id },
      { $set: { student_mails: arr, parent_mails: parr } }
    );

    res.status(200).json(batch);
    // console.log(students_mail[0]);
    // res.status(200).json(students_mail);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
// delete student from batch

router.delete("/deletestudent/:id/:index", async (req, res) => {
  const id = req.params.id;
  const index = req.params.index;
  try {
    const batch = await Batches.findById({ _id: id });
    const stdarr = batch.batch_Students;
    delete stdarr[index];
    for (let i = index; i < stdarr.length; i++) {
      stdarr[i] = stdarr[i + 1];
    }
    const arr = stdarr;
    console.log(arr);
    await Batches.findByIdAndUpdate(
      { _id: id },
      { $set: { batch_Students: arr } }
    );
    res.status(200).json(arr);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// send mail to batch students
router.post("/sendmail/:id", async (req, res) => {
  const id = req.params.id;

  const { subject, mailbody, attachment, filename } = req.body;
  try {
    if (filename && attachment) {
      const file = attachment;
      const result = await cloudinary.uploader.upload(file, {
        folder: "batches/mail/",
      });
      const batch = await Batches.findById({ _id: id });
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: batch.student_mails,
        subject: subject,
        html: `${mailbody}`,
        attachments: [
          {
            filename: filename,
            path: result.secure_url,
          },
        ],
      };
      await transporter.sendMail(mailOptions);
      await cloudinary.uploader.destroy(result.public_id);
    }else{
      const batch = await Batches.findById({ _id: id });
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: batch.student_mails,
        subject: subject,
        html: `${mailbody}`,
      };
      await transporter.sendMail(mailOptions);
    }
    res.status(200).json("Mail Sent Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// send mail to batch students parents
router.post("/sendmailp/:id", async (req, res) => {
  const id = req.params.id;

  const { subject, mailbody, attachment, filename } = req.body;
  try {
    if (filename && attachment) {
      const file = attachment;
      const result = await cloudinary.uploader.upload(file, {
        folder: "batches/mail/",
      });
      const batch = await Batches.findById({ _id: id });
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: batch.parent_mails,
        subject: subject,
        html: `${mailbody}`,
        attachments: [
          {
            filename: filename,
            path: result.secure_url,
          },
        ],
      };
      await transporter.sendMail(mailOptions);
      await cloudinary.uploader.destroy(result.public_id);
    }else{
      const batch = await Batches.findById({ _id: id });
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: batch.parent_mails,
        subject: subject,
        html: `${mailbody}`,
      };
      await transporter.sendMail(mailOptions);
    }
    res.status(200).json("Mail Sent Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
module.exports = router;
