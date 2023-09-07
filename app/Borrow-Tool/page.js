"use client";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import "@/app/borrow-tool/BorrowTools.css";
import Header from "../Components/Header";
import { useState } from "react";
import useSWR from "swr";
import DatePicker from "react-date-picker";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default withPageAuthRequired(
  function BorrowTool() {
    const { data: teamData, isLoading: teamIsLoading } = useSWR(
      "/api/teams",
      fetcher
    );
    const { data: toolData, isLoading: toolIsLoading } = useSWR(
      "/api/tools",
      fetcher
    );
    const [teamId, setTeamId] = useState(-1);
    const [teamMembers, setTeamMembers] = useState([]);
    const [memberId, setMemberId] = useState(-1);
    const [teamMember, setTeamMember] = useState("Select Team Member");
    const [toolId, setToolId] = useState(-1);
    const [currentTool, setToolName] = useState("Select Tool");
    const [currentToolLimit, setToolLimit] = useState(0);
    const [notes, setNotes] = useState("");
    const [dueDate, setDueDate] = useState(new Date());
    const [teamNumber, setTeamNumber] = useState("");

    const refactorTeamData = (num) => {
      setTeamNumber(num);
      // console.log(teamData.data)
      if (num > 0) {
        // eslint-disable-next-line
        const currentTeams = teamData.data.filter(
          (item) => item.teamNumber == num
        );
        if (currentTeams.length > 0) {
          setTeamMembers(currentTeams[0].teamMembers);
          setToolLimit(currentTeams[0].tokens - currentTeams[0].tokensUsed);
          setTeamMember("select team member");
          setMemberId(-1);
          setTeamId(currentTeams[0].id);
        } else {
          setTeamMember("select team member");
          setTeamMembers([]);
        }
      }
    };

    const filterTools = () => {
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

    const submitLogEvent = async () => {
      // Set to current date at 11:59 PM
      const theDate = new Date(dueDate.setHours(23, 59));
      // Create log entry data
      const log = {
        dueDate: theDate.toISOString(),
        notes: notes,
        teamId: teamId,
        studentId: memberId,
        toolId: toolId,
      };

      // Send request to API
      const res = await fetch("/api/logs/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ log: log }),
      });

      setTeamMember("Select Team Member");
      setToolName("Select Tool");
      setNotes("");
      refactorTeamData("");
      setTeamMembers([]);

      // document.getElementById("team-number-input").setAttribute("value", "");

      // window.location.reload();
    };

    return (
      <div className="borrow-tools">
        <Header title="Borrow Tool" />
        <center>
          <div className="input-box">
            <label>Team Number</label>
            <input
              id="team-number-input"
              type="text"
              placeholder="Type here"
              value={teamNumber}
              onChange={(event) => refactorTeamData(event.target.value)}
            />
            <label>Tool Checkouts Remaining</label>
            <input type="text" value={currentToolLimit} readOnly={true} />
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
                {teamIsLoading
                  ? "Loading..."
                  : teamMembers.map((entry) => (
                      <div key={entry.id}>
                        <button
                          onClick={() => {
                            setTeamMember(entry.name);
                            setMemberId(entry.id);
                            document
                              .getElementById("team-member-dropdown")
                              .classList.toggle("show");
                          }}
                        >
                          {entry.name}
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
                  onKeyUp={() => filterTools()}
                  id="myInput"
                />
                {toolIsLoading
                  ? "Loading..."
                  : toolData.data.map((entry) => (
                      <div key={entry.id}>
                        <button
                          onClick={() => {
                            setToolName(entry.name);
                            setToolId(entry.id);
                            document
                              .getElementById("tool-dropdown")
                              .classList.toggle("show");
                          }}
                        >
                          {entry.name}
                        </button>
                      </div>
                    ))}
              </div>
            </div>
            <label id="notes">Notes</label>
            <input
              type="text"
              placeholder="Type here"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
            <label>Due Date</label>
            {/* <input
            type="text"
            placeholder="MM-DD-YYYY"
            id="due-date"
            defaultValue={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          /> */}
            <DatePicker
              clearIcon={null}
              onChange={setDueDate}
              value={dueDate}
            />
            {/* <Link href="/"> */}
            <button
              disabled={
                !(
                  currentToolLimit > 0 &&
                  toolId > 0 &&
                  teamId > 0 &&
                  memberId > 0
                )
              }
              className="submit"
              onClick={() => {
                submitLogEvent();
              }}
            >
              Submit
            </button>
            {/* </Link> */}
          </div>
        </center>
      </div>
    );
  },
  { returnTo: "/" }
);
