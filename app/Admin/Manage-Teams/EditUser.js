"use client";
import { useDebugValue, useState } from "react";

export default function EditUser({ userData, setEditId, mutateTeams }) {
  // State variables for number of new users and IDs of members to remove
  const [newUserCounter, setNewUserCounter] = useState(0);
  const [removedMembers, setRemovedMembers] = useState([]);

  // Processing function for form data
  const editUserEvent = async (event) => {
    // Get new team member input objects
    const teamMemDetails = document.querySelectorAll(
      "div.team-member-container > input"
    );
    // Create array new team member names
    const teamMembersValues = [];
    teamMemDetails.forEach((input) => {
      teamMembersValues.push(input.value);
    });
    // Get updated team info
    const teamId = userData["id"];
    const tableNumber = Number(document.getElementById("tablenumber").value);
    const tokenNumber = Number(document.getElementById("tokennumber").value);
    const strikeNumber = Number(document.getElementById("strikenumber".value));
    const teamData = {
      teamId: teamId,
      tableNumber: tableNumber,
      tokens: tokenNumber,
      newMembers: teamMembersValues.filter(Boolean),
      removeMembers: removedMembers,
      strikeCount: strikeNumber,
    };
    // Send request to update team data
    const res = await fetch("/api/admin/teams", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ team: teamData }),
    });

    // Close out edit form
    setEditId(0);
    // Reload team data
    mutateTeams();
  };

  const removeCurrentMember = (id) => {
    // Add ID of member to be removed to array
    setRemovedMembers((arr) => [...arr, id]);
  };

  return (
    <div className="add-input-box">
      <h2>Edit Team</h2>
      <hr />
      <p>Team Number</p>
      <input
        type="text"
        name=""
        id="teamnumber"
        defaultValue={userData.teamNumber}
        disabled={true}
      />
      <p>Table Number</p>
      <input
        type="text"
        name=""
        id="tablenumber"
        defaultValue={userData.tableNumber}
      />
      <p>Team Members</p>

      {userData["teamMembers"].map(
        (member) =>
          !removedMembers.includes(member.id) && (
            <div key={member.id} className="current-team-member-container">
              <input type="text" defaultValue={member.name} disabled={true} />
              <button
                id="new-member"
                onClick={() => removeCurrentMember(member.id)}
              >
                -
              </button>
            </div>
          )
      )}
      {Array.apply(null, Array(newUserCounter)).map((c, i) => (
        <div key={i} className="team-member-container">
          <input type="text" />
          {/* <button id="new-member">-</button> */}
        </div>
      ))}
      <button
        id="new-member"
        onClick={() => setNewUserCounter(newUserCounter + 1)}
      >
        +
      </button>

      <p>Tokens</p>
      <input type="text" id="tokennumber" defaultValue={userData["tokens"]} />
      <p>Strikes</p>
      <input
        type="text"
        id="strikenumber"
        defaultValue={userData["strikeCount"]}
      />
      <button onClick={editUserEvent}>Submit</button>
      <button
        onClick={() => {
          setEditId(0);
        }}
      >
        Cancel
      </button>
    </div>
  );
}
