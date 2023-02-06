import { Button } from "@mui/material";
import React, { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import "./amcat1.css";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";

function AmcatBox({ data, user }) {
  const [open1, setOpen1] = React.useState(false);
  const [url, setUrl] = useState("");
  const handleClose1 = () => setOpen1(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  // console.log(data);
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const onButtonClick = () => {
    // using Java Script method to get PDF file
    fetch(url).then((response) => {
      response.blob().then((blob) => {
        // Creating new object of PDF file
        const fileURL = window.URL.createObjectURL(blob);
        // Setting various property values
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = url;
        alink.setAttribute("Download", user.rollno + "_Marksheet");
        alink.click();
      });
    });
  };

  const handleOffer = () => {
    setUrl(data.dashboard?.url);
    setOpen1(true);
  };
  const handleCompletion = () => {
    setUrl(data.report?.url);
    setOpen1(true);
  };
 



  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/amcat/deleteAmcat/${data._id}`);
      window.alert("Amcat Details Deleted Successfully");
      // window.location.reload();
    } catch (err) {
      console.log(err);
      window.alert("Currently Not able to delete the amcat data");
    }
  };
  var en = data.english;
  var qn = data.quantitative;
  var lo = data.logical;
  var avgelq =( (en+qn+lo) /27);
  return (
    <div className="abox">
      <div className="amcatbox">
        <div className="amcatboxtop"></div>
        <br />
        <div className="amcatbox_desc">
          <p>
            <h2 style={{paddingTop: "0"}}>Attemp No : {data.attempt}</h2>
          </p>
          <p>
            <b>English Comprehension: {data.english}</b>
          </p>
          <p>
            <b>Logical Ability: {data.logical} </b>
          </p>
          <b>Quantitaive Ability: {data.quantitative} </b>
          <p>
            <b>Automata: {data.automata}</b>
          </p>
          <p>
            <b>Average ELQ:  {parseFloat(avgelq).toFixed(2)}</b>
          </p>
        </div>
        <div className="editbtndiv">
          <Button
            variant="outlined"
            className="editbtn e1"
            onClick={handleOffer}
          >
            Dashboard
          </Button>

          <Button
            variant="outlined"
            className="editbtn e1"
            onClick={handleCompletion}
          >
            Report{" "}
          </Button>

          {/* <Button variant="outlined" className="editbtn" onClick={handleOpen}>
            Edit{" "}
          </Button> */}
          <Button variant="outlined" className="editbtn" onClick={handleDelete}>
            Delete{" "}
          </Button>
        </div>
       
        <Modal
          aria-describedby="transition-modal-description"
          open={open1}
          onClose={handleClose1}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open1}>
            <Box className="amcatboxmodal pdfbox" >
              {url && <Button onClick={onButtonClick}>Download PDF</Button>}
              <Document
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
                className="pdfdoc"
              >
                <Page pageNumber={pageNumber} />
              </Document>
              <div className="change_page_div">
                <p
                  onClick={() => setPageNumber(pageNumber - 1)}
                  className="direction"
                >
                  {"<"}
                </p>
                <p>
                  Page {pageNumber} of {numPages}
                </p>
                <p
                  onClick={() => setPageNumber(pageNumber + 1)}
                  className="direction"
                >
                  {">"}
                </p>
              </div>
            </Box>
          </Fade>
        </Modal>
      </div>
    </div>
  );
}

export default AmcatBox;
