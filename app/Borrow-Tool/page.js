"use client";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import "./BorrowTools.css";
import Header from "../Components/Header";
import { useRef, useState, useEffect } from "react";
import useSWR from "swr";
import DatePicker from "react-date-picker";
import { useUser } from "@auth0/nextjs-auth0";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

// export default withPageAuthRequired(
export default function BorrowTool() {
  const {
    data: teamData,
    isLoading: teamIsLoading,
    mutate,
  } = useSWR("/api/teams", fetcher);
  const { user, isLoading, error } = useUser();
  const { data: toolData, isLoading: toolIsLoading } = useSWR(
    "/api/tools",
    fetcher
  );

  const effectCalledRef = useRef(false);
  useEffect(() => {
    if (!teamIsLoading && !effectCalledRef.current) {
      const tempTeams = [
        ...new Set(teamData.data.map((item) => item.teamNumber)),
      ];
      console.log(tempTeams);
      setTeamList(tempTeams.sort());
    }
  }, [teamData, teamIsLoading]);

  const [teamId, setTeamId] = useState(-1);
  const [teamMembers, setTeamMembers] = useState([]);
  const [memberId, setMemberId] = useState(-1);
  const [teamMember, setTeamMember] = useState("Select Team Member");
  const [toolId, setToolId] = useState(-1);
  const [currentTool, setToolName] = useState("Select Tool");
  const [currentToolLimit, setToolLimit] = useState(0);
  const [numStrikes, setNumStrikes] = useState(0);
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [teamNumberSearch, setTeamNumberSearch] = useState("");
  const [strikeTime, setStrikeTime] = useState(new Date());
  const [teamNumber, setTeamNumber] = useState("Select Team...");
  const [teamNumberIsValid, setValidTeam] = useState(false);
  const [teamList, setTeamList] = useState([]);
  const teamSearchBox = useRef();

  const refactorTeamData = (num) => {
    setTeamNumber(num);
    if (num.length > 0) {
      // eslint-disable-next-line
      const currentTeams = teamData.data.filter(
        (item) => item.teamNumber.toUpperCase() == num.toUpperCase()
      );
      if (currentTeams.length > 0) {
        setValidTeam(true);
        setTeamMembers(currentTeams[0].teamMembers);
        setToolLimit(currentTeams[0].tokens - currentTeams[0].tokensUsed);
        setTeamMember("Select Team Member");
        setMemberId(-1);
        setTeamId(currentTeams[0].id);
      } else {
        setValidTeam(false);
        setToolLimit(0);
        setTeamMember("Select Team Member");
        setTeamMembers([]);
      }
    }
  };

  const filterTeams = () => {
    let filter, div, txtValue, a, i;
    filter = teamNumberSearch.toUpperCase();
    div = document.getElementById("team-number-dropdown");
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

  const getStrikeActive = (strikeTime, strikeLength) => {
    const currentTime = new Date();
    const strikeExpire = new Date(strikeTime);
    strikeExpire.setDate(strikeExpire.getDate() + strikeLength);
    console.log(strikeExpire);
    if (strikeExpire > currentTime) {
      return true;
    }
    return false;
  };

  const submitLogEvent = async () => {
    let strikeFlag = false;
    if (numStrikes === 1) {
      strikeFlag = getStrikeActive(strikeTime, 1);
    } else if (numStrikes === 2) {
      strikeFlag = getStrikeActive(strikeTime, 7);
    } else if (numStrikes >= 3) {
      strikeFlag = getStrikeActive(strikeTime, 30);
    }

    if (strikeFlag) {
      let warning = "";
      console.log(user);
      if (user.email.toLowerCase().includes("ams")) {
        if (numStrikes === 1) {
          warning =
            "Gene, this team has a strike...you emailed them this morning and already forgot?";
        } else if (numStrikes === 2) {
          warning = "Cmon, Gene, read the box...they've got 2 strikes.";
        } else if (numStrikes === 3) {
          warning =
            "Gene, if you check out this tool...you're not gonna get it back. They have 3 strikes and zero respect for your s***.";
        } else {
          warning = `You didn't take my advice Gene. I told you they wouldn't return the tool last time. Now look what happened: strike ${numStrikes}!`;
        }
      } else {
        if (numStrikes === 1) {
          warning =
            "Hey there bud, this team got a strike this morning. They can't check out a tool until tomorrow. Better check with your boss on this one.";
        } else if (numStrikes === 2) {
          warning =
            "So here's the deal: this team has 2 strikes. They're probably gonna forget to bring this tool back to you.";
        } else {
          warning = `OOF buddy...this team has ${numStrikes} strikes. Probably aught to let 'em cool down before you go giving them any more tools.`;
        }
      }
      if (!window.confirm(warning)) {
        return;
      }
    }
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

    // setTeamMember("Select Team Member");
    setToolName("Select Tool");
    setNotes("");
    // refactorTeamData("");
    // setTeamMembers([]);
    setToolId(0);
    setToolLimit(currentToolLimit - 1);
    mutate();
    // document.getElementById("team-number-input").setAttribute("value", "");

    // window.location.reload();
  };

  const handleTeamSearch = (searchText) => {
    setTeamNumberSearch(searchText);
    // refactorTeamData(searchText);
  };

  const handleSetTeam = (teamNumber) => {
    const currentTeams = teamData.data.filter(
      (item) => item.teamNumber.toUpperCase() == teamNumber.toUpperCase()
    );
    setTeamNumber(teamNumber);
    setValidTeam(true);
    setTeamMembers(currentTeams[0].teamMembers);
    setToolLimit(currentTeams[0].tokens - currentTeams[0].tokensUsed);
    setNumStrikes(currentTeams[0].strikeCount);
    setStrikeTime(new Date(currentTeams[0].strikeTime));
    setTeamMember("Select Team Member");
    setMemberId(-1);
    setTeamId(currentTeams[0].id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated!</div>;

  return (
    <div className="borrow-tools">
      <Header title="Borrow Tool" />
      <center>
        <div className="input-box">
          <label>Team Number</label>
          <button
            onClick={() => {
              document
                .getElementById("team-number-dropdown")
                .classList.toggle("show");
              teamSearchBox.current.focus();
            }}
            className="drop-btn"
            style={{ marginBottom: "2em" }}
          >
            {teamNumber}
          </button>
          <div className="dropdown">
            <div id="team-number-dropdown" className="dropdown-content">
              <input
                type="text"
                placeholder="Search..."
                value={teamNumberSearch}
                onKeyUp={() => filterTeams()}
                onChange={(e) => handleTeamSearch(e.target.value)}
                id="myTeamInput"
                ref={teamSearchBox}
              />
              {isLoading
                ? "Loading..."
                : teamList.map((entry) => (
                    <div key={entry}>
                      <button
                        onClick={() => {
                          console.log(teamNumber);
                          document
                            .getElementById("team-number-dropdown")
                            .classList.toggle("show");
                          handleSetTeam(entry);
                        }}
                      >
                        {entry}
                      </button>
                    </div>
                  ))}
            </div>
          </div>
          {/* <label>Team Number</label>
          <input
            id="team-number-input"
            type="text"
            placeholder="Type here"
            className={teamNumberIsValid ? null : "invalid"}
            value={teamNumber}
            onChange={(event) => refactorTeamData(event.target.value)}
          /> */}
          <label>Tool Checkouts Remaining</label>
          <input type="text" value={currentToolLimit} readOnly={true} />
          <label>Team Strikes</label>
          <input type="text" value={numStrikes} readOnly={true} />
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
            locale="en-US"
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
}
// ,
// { returnTo: "/" }
// );
