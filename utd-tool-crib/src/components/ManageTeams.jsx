import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/header.css";
import logo from "../styles/logo.svg";
import "../styles/manageTeams.css";
import axios from "axios";
import { read } from "xlsx";

const API_URL = `http://${process.env.REACT_APP_DOMAIN}:${process.env.REACT_APP_API_PORT}`

function ManageTeams() {
  console.log(logo);

  const [counter, setCounter] = useState(1);

  const [data, setData] = useState([]);

  const [addUser, setAdd] = useState(false);

  const [currentEditingId, setID] = useState(0);

  //const [editTeamNumber, setTeamnumber] = useState(0);

  //  const [editTeamMembers, setTeammember] = useState([]);

  //const [editTokens, setToken] = useState(0);

  const removeAllUserEvent = (item) => {
    if (window.confirm("Do you want to remove all teams?")) {
      axios.post(`${API_URL}/teams/removeall/`).then(() => {
        window.location.reload();
      });
    }
  };

  const removeUserEvent = (item) => {
    if (
      window.confirm(
        "Do you want to remove team number " + item.teamNumber + "?"
      )
    ) {
      axios.delete(`${API_URL}/teams/` + item.id).then(() => {
        window.location.reload();
      });
      // fetch("http://localhost:8000/teams/" + item.id, {
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

  const editUserEvent = (id) => {
    setID(id);
  };

  useEffect(() => {
    async function fetchData() {
      await getTeamData();
    }

    fetchData();
  }, []);

  const cancelEvent = (event) => {
    setAdd(!addUser);
  };

  const addUserEvent = (event) => {
    if (addUser) {
      const teamMemDetails = document.querySelectorAll(
        "div.team-member-container > input"
      );

      const teamMembersValues = [];
      teamMemDetails.forEach((input) => {
        teamMembersValues.push(input.value);
      });

      let teamNumber = Number(document.getElementById("teamnumber").value);
      let tableNumber = Number(document.getElementById("tablenumber").value);
      let tokenNumber = Number(document.getElementById("tokennumber").value);

      const teamdata = {
        teamNumber: teamNumber,
        tableNumber: tableNumber,
        teamMembers: teamMembersValues,
        tokens: tokenNumber,
      };

      axios.post(`${API_URL}/teams/`, teamdata).then(() => {
        window.location.reload();
      });
      //   fetch("http://localhost:8000/teams", {
      //     method: "POST",
      //     headers: { "content-type": "application/json" },
      //     body: JSON.stringify(teamdata),
      //   })
      //     .then((res) => {
      //       window.location.reload();
      //     })
      //     .catch((err) => {
      //       console.log(err.message);
      //     });
      // }
    }
    setAdd(!addUser);
  };

  const addInputEvent = (event) => {
    setCounter(counter + 1);
  };

  const addUserHtml = () => {
    if (addUser) {
      return (
        <div className="add-input-box">
          <h2>Add User</h2>
          <hr />
          <p>Team Number</p>
          <input type="text" name="" id="teamnumber" />
          <p>Table Number</p>
          <input type="text" name="" id="tablenumber" />
          <p>Team Members</p>
          {Array.apply(null, Array(counter)).map((c, i) => (
            <div className="team-member-container">
              <input type="text" />
            </div>
          ))}
          <button id="new-member" onClick={addInputEvent}>
            +
          </button>
          <p>Token</p>
          <input type="text" id="tokennumber" defaultValue={5} />

          <button onClick={addUserEvent}>Submit</button>
          <button onClick={cancelEvent}>Cancel</button>
        </div>
      );
    } else {
      return (
        <div>
          <button className="add" onClick={addUserEvent}>
            Add User
          </button>
        </div>
      );
    }
  };

  const submitEditUserEvent = (id) => {
    if (id > 0) {
      const editTeamMemDetailsInputs = document.querySelectorAll(
        "input.editing-team-details-input"
      );

      let editTeamMemDetails = [];

      editTeamMemDetailsInputs.forEach((input) => {
        editTeamMemDetails.push(input.value);
      });

      const editTeamNumber = document.getElementById(id + "number").value;
      const editTableNumber = document.getElementById(id + "tnumber").value;
      const editTokens = document.getElementById(id + "token").value;
      const teamdata = {
        teamNumber: editTeamNumber,
        tableNumber: editTableNumber,
        teamMembers: editTeamMemDetails,
        tokens: editTokens,
        id: id,
      };

      axios.put(`${API_URL}/teams/`, teamdata).then(() => {
        window.location.reload();
      });
      //   fetch("http://localhost:8000/teams/" + id, {
      //     method: "PUT",
      //     headers: { "content-type": "application/json" },
      //     body: JSON.stringify(teamdata),
      //   })
      //     .then((res) => {
      //       window.location.reload();
      //     })
      //     .catch((err) => {
      //       console.log(err.message);
      //     });
      // }
    }
  };

  const convertStringToArray = (string) => {
    let array = string.split(",");
    for (let i = 0; i < array.length - 1; i++) {
      array[i] = array[i] + ", ";
    }
    return array;
  };

  const convertString = (string) => {
    return string.split(",");
  };

  const editUserHtml = (id) => {
    if (id > 0) {
      return data.map((item) => (
        <div className="">
          {item.id == id ? (
            <div className="column-grid-2">
              <div className="cell-2">
                <input
                  type="text"
                  defaultValue={item["teamNumber"]}
                  id={item.id + "number"}
                  className="edit"
                />
              </div>
              <div className="cell-2">
                <input
                  type="text"
                  defaultValue={item["tableNumber"]}
                  id={item.id + "tnumber"}
                  className="edit"
                />
              </div>
              <div className="cell-2">
                {item["teamMembers"] &&
                  item["teamMembers"].length > 0 &&
                  convertString(item["teamMembers"]).map((item_) => (
                    <span>
                      <input
                        type="text"
                        defaultValue={item_}
                        className="editing-team-details-input"
                      />
                    </span>
                  ))}
              </div>
              <div className="cell-2">
                <input
                  type="text"
                  defaultValue={item["tokens"]}
                  id={id + "token"}
                  className="edit"
                />
              </div>
              <div className="cell-2">
                <button
                  onClick={() => {
                    setID(0);
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    submitEditUserEvent(currentEditingId);
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          ) : (
            <div className="column-grid-2">
              <div className="cell-2" id={item.id + "number"}>
                {item["teamNumber"]}
              </div>
              <div className="cell-2" id={item.id + "tnumber"}>
                {item["tableNumber"]}
              </div>
              <div className="single-row">
                {item["teamMembers"] &&
                  item["teamMembers"].length > 0 &&
                  convertStringToArray(item["teamMembers"]).map((item_) => (
                    <span>
                      <p>{item_}</p>
                    </span>
                  ))}
              </div>
              <div className="cell-2">{item["tokens"]}</div>
              <div className="cell-2">
                <button
                  onClick={() => {
                    editUserEvent(item.id);
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    removeUserEvent(item);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      ));
    } else {
      return data.map((item) => (
        <div className="column-grid-2" id={item.id + "div"}>
          <div className="cell-2" id={item.id + "number"}>
            {item["teamNumber"]}
          </div>
          <div className="cell-2" id={item.id + "tnumber"}>
            {item["tableNumber"]}
          </div>
          <div className="single-row">
            {item["teamMembers"] &&
              item["teamMembers"].length > 0 &&
              convertStringToArray(item["teamMembers"]).map((item_) => (
                <span>
                  <p>{item_}</p>
                </span>
              ))}
          </div>
          <div className="cell-2">{item["tokens"]}</div>
          <div className="cell-2">
            <button
              onClick={() => {
                editUserEvent(item.id);
              }}
            >
              Edit
            </button>
            <button
              onClick={() => {
                removeUserEvent(item);
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ));
    }
  };

  async function getTeamData() {
    axios.get(`${API_URL}/teams/`).then((resp) => {
      setData(resp.data);
    });
    // fetch("http://localhost:8000/teams")
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

  async function handleFileAsync(e) {
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    /* data is an ArrayBuffer */
    const workbook = read(data);
    let sheet = workbook.Sheets.Sheet1;
    const arr = Object.values(sheet);
    for (let i = 9; i < arr.length - 1; i += 8) {
      const teamData = {
        teamNumber: arr[i].v,
        tableNumber: arr[i + 1].v,
        teamMembers: [
          arr[i + 2].v,
          arr[i + 3].v,
          arr[i + 4].v,
          arr[i + 5].v,
          arr[i + 6].v,
          arr[i + 7].v,
        ],
        tokens: 5,
      };
      axios.post(`${API_URL}/teams/`, teamData).then(() => {
        window.location.reload();
      });
    }
    // console.log(arr);
    // sheet.forEach(myFunction);

    /* DO SOMETHING WITH workbook HERE */
  }

  const inputFile = (e) => {
    const fileInput = document.getElementById("file-input");
    // let fileName = [];
    console.log(fileInput);
    fileInput.addEventListener("change", handleFileAsync, false);

    // fileInput.addEventListener("change", () => {
    //   // console.log(fileInput.files[0]);
    //   // console.log(fileInput.result);
    //   fileName = fileInput.value.split(".");
    //   if (fileName.length > 0 && fileName[1] == "xlsx") {
    //     // let file = fileInput.files[0];
    //     // let reader = new FileReader();
    //     // reader.onload = function (e) {
    //     //   var data = fileInput.result;
    //     //   /* reader.readAsArrayBuffer(file) -> data will be an ArrayBuffer */
    //     //   var workbook = XLSX.read(fileInput.result);
    //     //   console.log(workbook);
    //     //   /* DO SOMETHING WITH workbook HERE */
    //     // };
    //     // reader.readAsArrayBuffer(file);
    //     // axios.post(`http://localhost:${PORT}/teams/import`, {
    //     //   file: fileInput.files[0],
    //     //   result: fileInput.result,
    //     // });
    //     //     let file = fileInput.files[0];
    //     //     const reader = new FileReader();
    //     //     reader.onload = () => {
    //     //       try {
    //     //         const data = new Uint8Array(reader.result);
    //     //         const workbook = read(data, { type: "array" });
    //     //         const sheetName = workbook.SheetNames[0];
    //     //         const sheet = workbook.Sheets[sheetName];
    //     //         const json = utils.sheet_to_json(sheet);
    //     //         setFileData(json);
    //     //         console.log("Hello");
    //     //       } catch (error) {
    //     //         console.error(error);
    //     //       }
    //     //     };
    //   }
    // });
  };
  return (
    <div>
      <div className="header">
        <div className="title">
          <img src={logo} alt="" />
          <h1>Admin Panel</h1>
        </div>

        <div className="header-buttons">
          <Link to="/Manage-Teams">
            <button id="manage-teams-button">Manage Teams</button>
          </Link>

          <Link to="/Manage-Tools">
            <button>Manage Tools</button>
          </Link>

          <button>Create Users</button>
          <Link to="/">
            <button>Back</button>
          </Link>
        </div>
      </div>

      <div className="manage-teams-bttns">{addUserHtml()}</div>
      <div>
        <input
          className="manage-teams-bttns"
          type="file"
          id="file-input"
          onClick={() => inputFile()}
        />
        <button className="add" onClick={removeAllUserEvent}>
          Remove All Teams
        </button>
      </div>
      <div className="grid-2">
        <div id="table-header" className="column-grid-2">
          <div className="cell">Team Number</div>
          <div className="cell">Table Number</div>
          <div className="cell">Team Members</div>
          <div className="cell">Tokens</div>
          <div className="cell">options</div>
        </div>
        {editUserHtml(currentEditingId)}
        {/* {data &&
          data.map((item) => (
            <div className="column-grid-2" id={item.id + "div"}>
              <div className="cell-2" id={item.id + "number"}>
                {item["teamNumber"]}
              </div>

              <div className="single-row">
                {item["teamMembers"] &&
                  item["teamMembers"].length > 0 &&
                  item["teamMembers"].map((item_) => (
                    <span>
                      <p>{item_ + ", "}</p>
                    </span>
                  ))}
              </div>

              <div className="cell-2">{item["tokens"]}</div>
              <div className="cell-2">
                <button
                  onClick={() => {
                    editUserEvent(item.id);
                  }}
                >
                  Edit
                </button>
                <button>Remove</button>
              </div>
            </div>
          ))} */}
      </div>
    </div>
  );
}
export default ManageTeams;
