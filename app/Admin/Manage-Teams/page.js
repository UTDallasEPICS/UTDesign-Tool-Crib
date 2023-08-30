'use client'
import "../../../src/Styles/manageTeams.css"
import "../../../src/Styles/header.css"
import {read, utils} from "xlsx"
import { useState } from "react";
import useSWR from 'swr'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import EditUser from "./EditUser";

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default withPageAuthRequired( function ManageTeams() {
  const [counter, setCounter] = useState(1);
  const [data] = useState([]);

  const [addUser, setAdd] = useState(false);
  const [currentEditingId, setID] = useState(0);

  const API_URL = '';
  const accessToken = {};

  const {data: teamData, mutate, isLoading} = useSWR("/api/teams", fetcher)

  // Deactivate all teams
  const removeAllUserEvent = async () => {
    if (window.confirm("Do you want to remove all teams?")) {
      const res = await fetch("/api/admin/teams/removeall")
      mutate()
    }
  };

  // Remove specific team
  const removeUserEvent = async (item) => {
    if (
      window.confirm(
        "Do you want to remove team number " + item.teamNumber + "?"
      )
    ) {
      const res = await fetch('/api/admin/teams', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"id": item.id})
      })
      mutate()
    }
  };

  const editUserEvent = (id) => {
    setID(id);
  };

  const cancelEvent = () => {
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

      const teamData = {
        teamNumber: teamNumber,
        tableNumber: tableNumber,
        teamMembers: teamMembersValues,
        tokens: tokenNumber,
      };

      const res = fetch("/api/admin/teams", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({team: teamData})
      })
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
          <h2>Add Team</h2>
          <hr />
          <p>Team Number</p>
          <input type="text" name="" id="teamnumber" />
          <p>Table Number</p>
          <input type="text" name="" id="tablenumber" />
          <p>Team Members</p>
          {Array.apply(null, Array(counter)).map((c, i) => (
            <div key={i} className="team-member-container">
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
            Add Team
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

  const editUserHtml = () => {
    if (currentEditingId > 0) {
      return data.map((item) => (
        <div className="" key={item.id}>
          {item.id == currentEditingId ? (
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
                    <span key={item_.id}>
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
            <div className="column-grid-2" key={item.id}>
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
                    <span key={item_.id}>
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
        <div className="column-grid-2" id={item.id + "div"} key={item.id}>
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
                <span key={item_.id}>
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

  async function handleFileAsync(e) {
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    /* data is an ArrayBuffer */
    const workbook = read(data);
    let sheet = workbook.Sheets[workbook.SheetNames[0]]
    const arr = utils.sheet_to_json(sheet, {headers: 1})
    // const arr = Object.values(sheet);
    // console.log(arr)
    
    for (let row in arr) {
      const teamNumber = String(arr[row]["Team Number"])
      const tableNumber = arr[row]["Table Number"]
      // let teamMembers = []
      const memberObject = Object.fromEntries(Object.entries(arr[row]).filter(([prop]) => prop.toLocaleLowerCase().startsWith('student')))
      const teamMembers = Object.values(memberObject)
      const newTeamData = {teamNumber, tableNumber, teamMembers}
      const res = await fetch("/api/admin/teams", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({team: newTeamData})
      })
      // console.log(res)
    }
    window.location.reload()
  }

  const inputFile = (e) => {
    const fileInput = document.getElementById("file-input");
    // let fileName = [];
    // console.log(fileInput);
    fileInput.addEventListener("change", handleFileAsync, false);
  };

    return (
    <div>
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
        {/* {editUserHtml(currentEditingId)} */}
        {isLoading ? "Loading..." :
          teamData.data.map((item) => (
            item.id === currentEditingId ? <EditUser userData={item} setEditId={setID} mutateTeams={mutate} key={item.id}/> : 
            <div className="column-grid-2" id={item.id + "div"} key={item.id}>
              <div className="cell-2" id={item.id + "number"}>
                {item.teamNumber}
              </div>
              <div className="cell-2">{item.tableNumber}</div>
              <div className="single-row">
                {item.teamMembers && (
                    <p>{item.teamMembers.map(a => a.name).join(", ")}</p>
                )}
              </div>

              <div className="cell-2">{item.tokens}</div>
              <div className="cell-2">
                <button
                  onClick={() => {
                    // console.log(item.id)
                    editUserEvent(item.id);
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    removeUserEvent(item)
                  }}>Remove</button>
              </div>
            </div>
          ))}
      </div>
    </div>
    )
}, {returnTo: '/'})