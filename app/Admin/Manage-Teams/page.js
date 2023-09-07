"use client";
import "./manageTeams.css";
import "@/app/styles/header.css";
import { read, utils } from "xlsx";
import { useState } from "react";
import useSWR from "swr";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import EditUser from "./EditUser";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default withPageAuthRequired(
  function ManageTeams() {
    // State variables for team member counter, addUser box, and current team being edited
    const [counter, setCounter] = useState(1);
    const [addUser, setAdd] = useState(false);
    const [currentEditingId, setID] = useState(0);

    // Load in team data, get mutate function, and loading state
    const { data: teamData, mutate, isLoading } = useSWR("/api/teams", fetcher);

    // Deactivate all teams
    const removeAllUserEvent = async () => {
      if (window.confirm("Do you want to remove all teams?")) {
        const res = await fetch("/api/admin/teams/removeall");
        mutate();
      }
    };

    // Remove specific team
    const removeUserEvent = async (item) => {
      if (
        window.confirm(
          "Do you want to remove team number " + item.teamNumber + "?"
        )
      ) {
        const res = await fetch("/api/admin/teams", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: item.id }),
        });
        mutate();
      }
    };

    // Take ID of team and enable editing window
    const editUserEvent = (id) => {
      setID(id);
    };

    // Set addUser state to inverse (should only be called when true)
    const cancelEvent = () => {
      setAdd(false);
    };

    // Add team to list
    const addUserEvent = async (event) => {
      if (addUser) {
        const teamMemDetails = document.querySelectorAll(
          "div.team-member-container > input"
        );

        const teamMembersValues = [];
        teamMemDetails.forEach((input) => {
          teamMembersValues.push(input.value);
        });

        let teamNumber = String(document.getElementById("teamnumber").value);
        let tableNumber = Number(document.getElementById("tablenumber").value);
        let tokenNumber = Number(document.getElementById("tokennumber").value);

        const teamData = {
          teamNumber: teamNumber,
          tableNumber: tableNumber,
          teamMembers: teamMembersValues,
          tokens: tokenNumber,
        };

        const res = await fetch("/api/admin/teams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ team: teamData }),
        });
      }
      // Close addUser window
      setAdd(!addUser);
      mutate();
    };

    // Increment counter to add new students
    const addInputEvent = (event) => {
      setCounter(counter + 1);
    };

    // Form to create new team
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

    // File handling for team excel file
    async function handleFileAsync(e) {
      const file = e.target.files[0];
      const data = await file.arrayBuffer();
      /* data is an ArrayBuffer */
      const workbook = read(data);
      let sheet = workbook.Sheets[workbook.SheetNames[0]];
      const arr = utils.sheet_to_json(sheet, { headers: 1 });

      for (let row in arr) {
        const teamNumber = String(arr[row]["Team Number"]);
        const tableNumber = arr[row]["Table Number"];
        const memberObject = Object.fromEntries(
          Object.entries(arr[row]).filter(([prop]) =>
            prop.toLocaleLowerCase().startsWith("student")
          )
        );
        const teamMembers = Object.values(memberObject);
        const newTeamData = { teamNumber, tableNumber, teamMembers };
        const res = await fetch("/api/admin/teams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ team: newTeamData }),
        });
      }
      window.location.reload();
    }

    // Get file input
    const inputFile = (e) => {
      const fileInput = document.getElementById("file-input");
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
          {isLoading
            ? "Loading..."
            : teamData.data.map((item) =>
                item.id === currentEditingId ? (
                  <EditUser
                    userData={item}
                    setEditId={setID}
                    mutateTeams={mutate}
                    key={item.id}
                  />
                ) : (
                  <div
                    className="column-grid-2"
                    id={item.id + "div"}
                    key={item.id}
                  >
                    <div className="cell-2" id={item.id + "number"}>
                      {item.teamNumber}
                    </div>
                    <div className="cell-2">{item.tableNumber}</div>
                    <div className="single-row">
                      {item.teamMembers && (
                        <p>{item.teamMembers.map((a) => a.name).join(", ")}</p>
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
                          removeUserEvent(item);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )
              )}
        </div>
      </div>
    );
  },
  { returnTo: "/" }
); // Return to home if not authenticated when accessing page
