'use client'

import { useDebugValue, useState } from "react";

export default function EditUser({userData, setEditId, mutateTeams}) {
    const [newUserCounter, setNewUserCounter] = useState(0)
    const [removedMembers, setRemovedMembers] = useState([])
    // let removedMembers = []
    // console.log(userData["teamMembers"])
    const editUserEvent = async (event) => {
        const teamMemDetails = document.querySelectorAll(
            "div.team-member-container > input"
          );
        const teamMembersValues = [];
        teamMemDetails.forEach((input) => {
            teamMembersValues.push(input.value);
        });
        const teamId = userData["id"]
        const tableNumber = Number(document.getElementById("tablenumber").value);
        const tokenNumber = Number(document.getElementById("tokennumber").value);
        const teamData = {
            teamId: teamId,
            tableNumber: tableNumber,
            tokens: tokenNumber,
            newMembers: teamMembersValues.filter(Boolean),
            removeMembers: removedMembers
        }
        // console.log(teamData)
        const res = await fetch("/api/admin/teams", {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({team: teamData})
          })
        setEditId(0)
        mutateTeams()
        // console.log(res)
    }

    const removeCurrentMember = (id) => {
        // console.log(removedMembers)
        setRemovedMembers(arr => [...arr, id])
    }

    return(
        <div className="add-input-box">
            <h2>Edit Team</h2>
            <hr />
            <p>Team Number</p>
            <input type="text" name="" id="teamnumber" defaultValue={userData.teamNumber} disabled={true}/>
            <p>Table Number</p>
            <input type="text" name="" id="tablenumber" defaultValue={userData.tableNumber}/>
            <p>Team Members</p>
            {/* {Array.apply(null, Array(counter)).map((c, i) => (
            <div key={i} className="team-member-container">
                <input type="text" />
            </div>
            ))} */}
            
            {
                userData["teamMembers"].map((member) => (
                    !removedMembers.includes(member.id) &&
                    <div key={member.id} className="current-team-member-container">
                        <input type="text" defaultValue={member.name} disabled={true}/>
                        <button id="new-member" onClick={() => removeCurrentMember(member.id)}>-</button>
                    </div>
                ))
            }
            {Array.apply(null, Array(newUserCounter)).map((c, i) => (
            <div key={i} className="team-member-container">
              <input type="text" />
              {/* <button id="new-member">-</button> */}
            </div>
          ))}
            {/* <button id="new-member" onClick={addInputEvent}>
            +
            </button> */}
            <button id="new-member" onClick={() => setNewUserCounter(newUserCounter+1)}>
            +
            </button>

            <p>Token</p>
            <input type="text" id="tokennumber" defaultValue={userData["tokens"]} />

            {/* <button onClick={addUserEvent}>Submit</button>
            <button onClick={cancelEvent}>Cancel</button> */}
            <button onClick={editUserEvent}>Submit</button>
            <button onClick={() => {
                setEditId(0)
            }}>Cancel</button>
        </div>
    );
}