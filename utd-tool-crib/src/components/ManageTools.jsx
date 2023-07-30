import { Link } from "react-router-dom";
import "../styles/header.css";
import logo from "../styles/logo.svg";
import { useState, useEffect } from "react";
import "../styles/ManageTools.css";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";

const API_URL = `http://${process.env.REACT_APP_DOMAIN}:${process.env.REACT_APP_API_PORT}`

function ManageTools() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const {getAccessTokenSilently} = useAuth0();
  console.log(logo);

  const [data, setData] = useState([]);

  const [addTool, setAdd] = useState(false);

  const [toolName, setToolName] = useState("");

  useEffect(() => {
    async function fetchData() {
      await getToolData();
    }

    fetchData();
  }, []);

  async function getToolData() {
    const accessToken =getAccessTokenSilently();
    const options = { 
      method: "GET",
      url: `${API_URL}/tools/`,
      headers: { "authorization": `Bearer ${accessToken}`},
    };

    axios(options)
      .then((resp) => {
        setData(resp.data);
      })
      .catch(error => {
        console.log(error);
      });
    // axios.get(`${API_URL}/tools`).then((resp) => {
    //   setData(resp.data);
    // });
    // fetch("http://localhost:8000/tools")
    //   .then((res) => {
    //     return res.json();
    //   })
    //   .then((resp) => {
    //     setData(resp);
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //   });
  }

  const cancelAddUserEvent = (event) => {
    setAdd(!addTool);
  };

  const addUserEvent = (event) => {
    setAdd(!addTool);
  };

  const removeUserEvent = (item) => {
    if (window.confirm("Do you want to remove " + item.tool + "?")) {
      const accessToken =getAccessTokenSilently();
    const options = { 
      method: "DELETE",
      url: `${API_URL}/tools/` + item.id,
      headers: { "authorization": `Bearer ${accessToken}`},
    };

    axios(options)
      .then((resp) => {
        window.location.reload();
      })
      .catch(error => {
        console.log(error);
      });
      // axios.delete(`${API_URL}/tools/` + item.id).then(() => {
      //   window.location.reload();
      // });
      // fetch("http://localhost:8000/tools/" + item.id, {
      //   method: "DELETE",
      // })
      //   .then((res) => {
      //     alert("Removed successfully.");
      //     window.location.reload();
      //   })
      //   .catch((err) => {
      //     console.log(err.message);
      //   });
    }
  };

  const submitToolEvent = (event) => {
    // eslint-disable-next-line
    const filteredData = data.filter((item) => item.tool == toolName);
    if (filteredData.length > 0) {
      alert("Tool Already Exists");
    } else {
    const toolData = { tool: toolName };
    const accessToken =getAccessTokenSilently();
    const options = { 
      method: "POST",
      url: `${API_URL}/logs/`,
      headers: { "authorization": `Bearer ${accessToken}`},
      data: toolData,
    };

    axios(options)
      .then((resp) => {
        window.location.reload();
      })
      .catch(error => {
        console.log(error);
      });
      // axios.post(`${API_URL}/tools`, toolData).then(() => {
      //   window.location.reload();
      // });
      // fetch("http://localhost:8000/tools", {
      //   method: "POST",
      //   headers: { "content-type": "application/json" },
      //   body: JSON.stringify(toolData),
      // })
      //   .then((res) => {
      //     window.location.reload();
      //   })
      //   .catch((err) => {
      //     console.log(err.message);
      //   });
    }
  };

  const addToolHtml = () => {
    if (addTool) {
      return (
        <div className="add-input-box">
          <h2>Add Tool</h2>
          <hr />
          <p>Tool Name</p>
          <input type="text" onChange={(e) => setToolName(e.target.value)} />
          <div className="add-bttn">
            <button onClick={submitToolEvent}>Submit</button>
            <button onClick={cancelAddUserEvent}>Cancel</button>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <button className="add" onClick={addUserEvent}>
            Add Tool
          </button>
        </div>
      );
    }
  };
  return (
    <div className="manage-tools">
      {!isAuthenticated && <LoginButton/>}
      {isAuthenticated && user["http://localhost:3000/roles"].toString()==="Admin" && (
      <div className="header">
        <div className="title">
        <img src={logo} alt="" />
        <h1>Admin Panel</h1>
        </div>
        <div className="header-buttons">
          <Link to="/Manage-Teams">
            <button>Manage Teams</button>
          </Link>
          <Link to="/Manage-Tools">
            <button id="manage-tools-button">Manage Tools</button>
          </Link>
          <button>Create Users</button>
          <Link to="/">
            <button>Dashboard</button>
          </Link>
        </div>
      </div>
      )}
      {isAuthenticated && user["http://localhost:3000/roles"].toString() === "Admin" && (
      <div className="add-button">{addToolHtml()}</div>
      )}
      {isAuthenticated && user["http://localhost:3000/roles"].toString() === "Admin" && (
      <div className="grid-3">
        <div className="column-grid-header">
          <div className="header-cell">Tool</div>
          <div className="header-cell">options</div>
        </div>

        {data &&
          data.map((item) => (
            <div className="column-grid-3">
              {/* <div className="cell">{item.id}</div> */}
              <div className="cell">{item.tool}</div>
              <div className="cell">
                <button
                  onClick={() => {
                    removeUserEvent(item);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
      </div>
      )}
    </div>
  );
}
export default ManageTools;
