import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import "./amcat.css";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import FormInput from "../Student_Internships//FormInput";
import AmcatBox from "./AmcatBox";
import axios from "axios";

function Amcat({user}) {
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFile2, setSelectedFile2] = useState("");

  const [english, setEnglish] = useState("");
  const [logical, setLogical] = useState("");
  const [quantitative, setQuantitative] = useState("");
  const [critical, setCritical] = useState("");
  const [cprog, setCprog] = useState("");
  const [automata, setAutomata] = useState("");
  const [internets, setInternets] = useState("");
  const [average, setAverage] = useState("");

  const [sfilename, setFilename] = useState("");
  const [sfilename2, setFilename2] = useState("");
  function changeHandler(event) {
    setSelectedFile2(event.target.files[0]);
  }
  function handleImage(event) {
    const file = setSelectedFile(event.target.files[0]);
    setFileToBase(file);
    // filename = file.name;
    setFilename(file.name);
    console.log(file);
  }

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setSelectedFile(reader.result);
    };
  };
  function handleImage2(event) {
    const file = setSelectedFile2(event.target.files[0]);
    setFileToBase2(file);
    // filename = file.name;
    setFilename2(file.name);
    console.log(file);
  }

  const setFileToBase2 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setSelectedFile2(reader.result);
    };
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [datas, setDatas] = useState([]);
  const handleAddAmcat = async (e) => {
    const data = {
      english,
      logical,
      quantitative,
      critical,
      cprog,
      automata,
      internets,
      average,

      dashboard: selectedFile,
      report:selectedFile2,
      student_id: user._id,
      student_name: user.fullname,
      student_div: user.div,
      student_branch: user.branch,
      student_roll: user.rollno,
    };

    if (
      !english ||
      !logical ||
      !quantitative ||
      !critical ||
      !cprog ||
      !automata ||
      !internets ||
      !average ||
      !selectedFile ||
      !selectedFile2
    ) {
      window.alert("All the fields are required");
      return;
    }
    try {
      await axios.post("/api/amcat/newAmcat", data);
      window.alert("Amcat Data Added Successfully");
      setOpen(false);
    } catch (err) {
      console.log(err);
    }
    console.log(selectedFile);
  };

  return (
    <>
      <Navbar />
      <div className="studentAmcatDashboard">
        <div className="dataheader">
          <p className="amcat_data_header">Amcat Details</p>
          <Button variant="contained" onClick={handleOpen}>
            Add{" "}
          </Button>
        </div>
      </div>
      <br />
      <br />
      <center>
        <div className="amcatboxes">
          {datas?.map((d) => (
            <AmcatBox data={d} user={user} />
          ))}
        </div>
      </center>
      <Modal
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box className="amcatboxmodal" >
            <center>
              <h2>Enter Your Amcat details</h2>

              <FormInput
                name="English Comprehension"
                type="number"
                placeholder="Enter Your English Comprehension marks"
                onChange={(e) => setEnglish(e.target.value)}
              />

              <FormInput
                name="Logical Ability"
                type="number"
                placeholder="Enter your Logical Ability marks"
                onChange={(e) => setLogical(e.target.value)}
              />
              <FormInput
                name="Critical Reasoning"
                type="number"
                placeholder="Enter your Critical Reasoning marks"
                onChange={(e) => setCritical(e.target.value)}
              />
              <FormInput
                name="Quantitative Ability"
                type="number"
                placeholder="Enter your Quantitative Ability marks"
                onChange={(e) => setQuantitative(e.target.value)}
              />
              <FormInput
                name="C++ Programming"
                type="number"
                placeholder="Enter your C++ Programming marks"
                onChange={(e) => setCprog(e.target.value)}
              />
              <FormInput
                name="Automata"
                type="number"
                placeholder="Enter your Automata marks"
                onChange={(e) => setAutomata(e.target.value)}
              />
              <FormInput
                name="Internet Ability Simulation"
                type="number"
                placeholder="Enter your Internet Ability Simulation marks"
                onChange={(e) => setInternets(e.target.value)}
              />
              <FormInput
                name="ELQ Average"
                type="number"
                placeholder="(English+Logical+Quantitative)/27"
                onChange={(e) => setAverage(e.target.value)}
              />

              <div className="amcat1">
                <Button
                  id="outlined-btn"
                  variant="contained"
                  component="label"
                  size="small"
                  className="offerbtn"
                >
                  <div className="uploadmarksheet">
                    <i class="fa-solid fa-upload"></i>
                    Dashboard pdf
                  </div>
                  <input
                    hidden
                    accept=".pdf"
                    multiple
                    type="file"
                    onChange={handleImage}
                  />
                </Button>
                {/* <br /> */}
                {/* <span style={{ fontSize: "10px", color: "orange" }}>
                  {selectedFile?.name}
                </span> */}
                {<br />}
                <Button
                  id="outlined-btn"
                  variant="contained"
                  component="label"
                  size="small"
                  className="offerbtn2"
                >
                  <div className="uploadlor">
                    <i className="fa-solid fa-upload"></i>
                    AMCAT Report
                  </div>
                  <input
                    hidden
                    accept=".pdf"
                    multiple
                    type="file"
                    onChange={changeHandler}
                  />
                </Button>
              </div>
              <span style={{ fontSize: "10px", color: "orange" }}>
              
              {selectedFile?.name}
              <br />
            </span>
              <span style={{ fontSize: "10px", color: "orange" }}>
              
                {selectedFile2?.name}
              </span>

              <div className="submitbtndiv">
                <Button className="internsubtn" onClick={handleAddAmcat}>
                  Submit
                </Button>
              </div>
            </center>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default Amcat;
