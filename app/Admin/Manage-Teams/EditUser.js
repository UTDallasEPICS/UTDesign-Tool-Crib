'use client'

import { useState } from "react";

export default function EditUser({userData}) {
    let counter = userData["teamMembers"].length
    console.log(userData["teamMembers"])
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
                    <div key={member.id} className="team-member-container">
                        <input type="text" defaultValue={member.name}/>
                        <button id="new-member">-</button>
                    </div>
                ))
            }
            {/* <button id="new-member" onClick={addInputEvent}>
            +
            </button> */}
            <button id="new-member">
            +
            </button>

            <p>Token</p>
            <input type="text" id="tokennumber" defaultValue={5} />

            {/* <button onClick={addUserEvent}>Submit</button>
            <button onClick={cancelEvent}>Cancel</button> */}
            <button>Submit</button>
            <button>Cancel</button>
        </div>
    );
}