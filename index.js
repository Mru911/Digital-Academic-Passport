const express = require("express");
const app = express();
const mogoose = require("mongoose");
const dotenv = require("dotenv");
const studentsRoute = require("./routes/students");
const internshipRoute = require("./routes/internship");
const batchRoute = require("./routes/batch");
const techActivityRoute = require("./routes/technicalActivities");
const noticeRoute = require("./routes/notices");
const lorRoute = require("./routes/lor");
const amcatRoute = require("./routes/amcat");
const compExamRoute = require("./routes/compexams");
const teachersRoute = require("./routes/teachers");
const extraCRoute = require("./routes/extracurricular");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//uploading files
const multer = require("multer");

dotenv.config();

try {
  mogoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
    console.log("Connect to MONGODB");
  });
} catch (err) {
  console.log(err);
}
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
// app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://192.168.65.34:3000",
      "https://digital-academic-passport.herokuapp.com",
    ],
  })
);
// app.use(cookieParser);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use("/api/students", studentsRoute);
app.use("/api/internships", internshipRoute);
app.use("/api/compexams", compExamRoute);
app.use("/api/LOR", lorRoute);
app.use("/api/notices", noticeRoute);
app.use("/api/techActivity", techActivityRoute);
app.use("/api/amcat", amcatRoute);
app.use("/api/batches", batchRoute);
app.use("/api/teachers", teachersRoute);
app.use("/api/extracurricular", extraCRoute);

if ((process.env.NODE_ENV = "production")) {
  app.use(express.static("frontend/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendfile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend is running!");
});
