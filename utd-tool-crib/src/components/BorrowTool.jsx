import { Link } from "react-router-dom";
import "../styles/header.css";
import logo from "../styles/logo.svg";
import { useState, useEffect } from "react";
import "../styles/BorrowTools.css";
import axios from "axios";
import LoginButton from "./LoginButton";
import Profile from "./Profile";
import { useAuth0 } from "@auth0/auth0-react";

const API_URL = `http://${process.env.REACT_APP_DOMAIN}:${process.env.REACT_APP_API_PORT}`

function BorrowTool() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  console.log(logo);

  const [teamData, setTeamData] = useState([]);
  const [toolData, setToolData] = useState([]);
  const [teamNum, setTeamNum] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamMember, setTeamMember] = useState("select team member");
  const [currentTool, setTool] = useState("select tool");
  const [currentToolLimit, setToolLimit] = useState(0);
  const [currentTableNumber, setTableNumber] = useState(-1);
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState("");

  const {getAccessTokenSilently} = useAuth0();

  const filterfunction = (event) => {
    let input, filter, div, txtValue, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("tool-dropdown");
    a = div.getElementsByTagName("button");
    for (i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      await getTeamData();
      await getToolData();
      const current = new Date();
      let date = `${
        current.getMonth() + 1
      }/${current.getDate()}/${current.getFullYear()}`;
      if (current.getDate() < 10) {
        date = `${
          current.getMonth() + 1
        }/0${current.getDate()}/${current.getFullYear()}`;
      }
      if (current.getMonth() < 10) {
        date = `0${
          current.getMonth() + 1
        }/${current.getDate()}/${current.getFullYear()}`;
      }
      if (current.getMonth() < 10 && current.getDate() < 10) {
        date = `0${
          current.getMonth() + 1
        }/0${current.getDate()}/${current.getFullYear()}`;
      }

      setDueDate(date);
    }

    fetchData();
  }, []);

  async function getTeamData() {
    const accessToken = await getAccessTokenSilently();
    const options = { 
      method: "GET",
      url: `${API_URL}/teams/`,
      headers: { "authorization": `Bearer ${accessToken}` },
    };

    axios(options)
      .then((resp) => {
        setTeamData(resp.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const submitLogEvent = (event) => {
    const tempCurrentToolLimit = currentToolLimit - 1;
    const logData = {
      teamNumber: teamNum,
      tableNumber: currentTableNumber,
      teamMember: teamMember.trim(),
      dueDate: dueDate,
      toolLimit: tempCurrentToolLimit,
      toolName: currentTool,
      notes: notes,
    };

    const accessToken =getAccessTokenSilently();
    var options = { 
      method: "POST",
      url: `${API_URL}/logs/`,
      headers: { "authorization": `Bearer ${accessToken}`},
      data: logData,
    };

    axios(options)
      .then((resp) => {
        window.location.reload();
      })
      .catch(error => {
        console.log(error);
      });

    // axios.post(`${API_URL}/logs/`, logData, config).then((resp) => {
    //   window.location.reload();
    // });

    // fetch("http://localhost:8000/logs", {
    //   method: "POST",
    //   headers: { "content-type": "application/json" },
    //   body: JSON.stringify(logData),
    // })
    //   .then((res) => {
    //     window.location.reload();
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //   });

    // eslint-disable-next-line
    const currentTeam = teamData.filter((item) => item.teamNumber == teamNum);
    const currentTeamData = {
      teamNumber: currentTeam[0].teamNumber,
      tableNumber: currentTeam[0].tableNumber,
      teamMembers: convertString(currentTeam[0].teamMembers),
      tokens: tempCurrentToolLimit,
      id: currentTeam[0].id,
    };

    options = { 
      method: "PUT",
      url: `${API_URL}/teams/`,
      headers: { "authorization": `Bearer ${accessToken}`},
      data: currentTeamData,
    };

    axios(options)
      .then((resp) => {
        window.location.reload();
      })
      .catch(error => {
        console.log(error);
      });

    // axios.put(`${API_URL}/teams/`, currentTeamData, config).then(() => {
    //   window.location.reload();
    // });
    // fetch("http://localhost:8000/teams/" + currentTeam[0].id, {
    //   method: "PUT",
    //   headers: { "content-type": "application/json" },
    //   body: JSON.stringify(currentTeamData),
    // }).catch((err) => {
    //   console.log(err.message);
    // });
  };

  async function getToolData() {
    const accessToken =getAccessTokenSilently();
    const options = { 
      method: "GET",
      url: `${API_URL}/tools`,
      headers: { "authorization": `Bearer ${accessToken}`},
    };

    axios(options)
      .then((resp) => {
        setToolData(resp.data);
      })
      .catch(error => {
        console.log(error);
      });
    // axios.get(`${API_URL}/tools`, config).then((resp) => {
    //   setToolData(resp.data);
    // });
    // fetch("http://localhost:8000/tools")
    //   .then((res) => {
    //     return res.json();
    //   })
    //   .then((resp) => {
    //     setToolData(resp);
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //   });
  }
  const convertString = (string) => {
    return string.split(",");
  };
  const refactorData = (num) => {
    if (num > 0) {
      setTeamNum(num);
      // eslint-disable-next-line
      const currentTeam = teamData.filter((item) => item.teamNumber == num);
      if (currentTeam.length > 0) {
        setTeamMembers(convertString(currentTeam[0].teamMembers));
        setTableNumber(currentTeam[0].tableNumber);
        setToolLimit(currentTeam[0].tokens);
        setTeamMember("select team member");
      } else {
        setTeamMember("select team member");
        setTeamMembers([]);
      }
    }
  };

  return (
    <div className="borrow-tools">
      <div className="header">
        <div className="title">
        <img src={logo} alt="" />
          <h1>Borrow Tool</h1>
        </div>

        <div className="header-buttons">
          <Link to="/">
            <button>Back</button>
          </Link>
        </div>
      </div>
      <center>
      {!isAuthenticated && <LoginButton/>}
      {isAuthenticated && (
        <div className="input-box">
          <label>Team Number</label>
          <input
            type="text"
            placeholder="Type here"
            onChange={(event) => refactorData(event.target.value)}
          />
          <label>Tool Limit</label>
          <input type="text" value={currentToolLimit} />
          <label>Team Member</label>
          <div className="dropdown">
            <button
              onClick={() =>
                document
                  .getElementById("team-member-dropdown")
                  .classList.toggle("show")
              }
              className="drop-btn"
            >
              {teamMember}
            </button>
            <div id="team-member-dropdown" className="dropdown-content">
              {/* <input
              type="text"
              placeholder="Search..."
              onKeyUp={filterfunction()}
            /> */}
              {teamMembers &&
                teamMembers.map((entry) => (
                  <div>
                    <button
                      key={entry}
                      onClick={() => {
                        setTeamMember(entry);
                        document
                          .getElementById("team-member-dropdown")
                          .classList.toggle("show");
                      }}
                    >
                      {entry}
                    </button>
                  </div>
                ))}
            </div>
          </div>
          <label id="notes">Tool Name</label>
          <div className="dropdown">
            <button
              onClick={() =>
                document
                  .getElementById("tool-dropdown")
                  .classList.toggle("show")
              }
              className="drop-btn"
            >
              {currentTool}
            </button>
            <div id="tool-dropdown" className="dropdown-content">
              <input
                type="text"
                placeholder="Search..."
                onKeyUp={() => filterfunction(true)}
                id="myInput"
              />
              {toolData &&
                toolData.map((entry) => (
                  <div>
                    <button
                      key={entry.id}
                      onClick={() => {
                        setTool(entry.tool);
                        document
                          .getElementById("tool-dropdown")
                          .classList.toggle("show");
                      }}
                    >
                      {entry.tool}
                    </button>
                  </div>
                ))}
            </div>
          </div>
          <label id="notes">Notes</label>
          <input
            type="text"
            placeholder="Type here"
            onChange={(event) => setNotes(event.target.value)}
          />
          <label>Due Date</label>
          <input
            type="text"
            placeholder="MM-DD-YYYY"
            id="due-date"
            defaultValue={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
          <Link to="/">
            <button disabled={currentToolLimit > 0 ? false : true}
              className="submit"
              onClick={() => {
                submitLogEvent();
              }}
            >
              Submit
            </button>
          </Link>
        </div>
        )}
      </center>
    </div>
    
  
  );
}
export default BorrowTool;
