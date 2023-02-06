import React, { useEffect, useState } from "react";
import "./s_dashboard.css";
import Boxes from "../Boxes/Boxes";
import Profile from "../Profile/Profile";
import Navbar from "../navbar/Navbar";
import axios from "axios";

function StudentDashboard({ student }) {
  const student_box_contents = [
    { title: "Personal Details", url: "/student/personaldetails" }, //done
    { title: "Academic Details", url: "/student/Academics" },// done
    // { title: "Placement Details", url: "" },
    { title: "Extra Curricular", url: "/student/extra_curricular" }, //done
    { title: "Internship data", url: "/student/internship" }, //done
    { title: "Competitive Exams", url: "/student/competitive_exams" },  // done
    { title: "Technical Activities", url: "/student/technical_activities" },   
    { title: "LOR Application", url: "/student/LOR" },   // done
    { title: "Amcat Details", url: "/student/amcat" },    // done
    { title: "Notices", url: "/notices" },  //done
  ];
  const [notices, setNotices] = useState([]);
  const [bnotices, setBNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        if (student.role === "student") {
          const res = await axios.get("/api/notices/getbyforw/" + student?.branch);
          const resb = await axios.get("/api/notices/getbyforw/" + student?.batch);
          setBNotices(resb.data);
          setNotices(res.data);
        } else if (student.role === "teacher") {
          const res = await axios.get(
            "/api/notices/getallTeacherNotices/" + student?._id
          );
          setNotices(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchNotices();
  });
  const length = notices.length + bnotices.length;
  return (
    <div className="sdashboard">
      <Navbar user={student} />

      <div className="student_dashboard">
        <div className="profile_div">
          <Profile />
        </div>
        <div className="student_dashboard_contents">
          <div className="years">
            <h3>Students Dashboard</h3>
            <small><a href="/printProfile"><i class="fa-solid fa-print"></i></a></small>
          </div>
          <div className="boxes_div">
            {student_box_contents.map((s) => (
              <>
                {s.title === "Notices" ? (
                    <Boxes title={s.title} url={s.url} length={length}/>
                ) : (
                  <Boxes title={s.title} url={s.url} />
                )}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
