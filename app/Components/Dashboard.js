"use client";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import "./Dashboard.css";
import useSWR from "swr";
import { writeFile, utils } from "xlsx";
// import UpdateCheckout from "@/Components/UpdateCheckout";
import { useState } from "react";
import DatePicker from "react-date-picker";
import { useUser } from "@auth0/nextjs-auth0";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Dashboard() {
  // Main data displayed in table
  const {
    data: logData,
    mutate,
    isLoading,
  } = useSWR("/api/logs/current", fetcher, {
    refreshInterval: 300000, // Refresh every 5 minutes automatically
  });

  const [currentEditId, setCurrentEditId] = useState(0);
  const [currentDueDate, setCurrentDueDate] = useState(new Date());
  const [currentStrikeID, setCurrentStrikeId] = useState(0);

  const handleCancelOrStrike = (id) => {
    if (currentStrikeID != 0) {
      setCurrentStrikeId(0);
      return;
    }
    if (currentEditId != 0) {
      setCurrentEditId(0);
      return;
    }

    setCurrentStrikeId(id);
  };

  const handleDateUpdate = async (logId, theDueDate) => {
    const reqData = {
      dueDate: theDueDate.toISOString(),
    };
    // console.log(e.target.valueAsDate);
    const apiString = "/api/logs/update/" + String(logId);
    const res = await fetch(apiString, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ update: reqData }),
    });
    console.log(await res.json());
    mutate();
  };

  const editCheckoutEvent = (id, dueDate, teamId) => {
    // console.log(id);
    if (currentEditId != 0 && id == currentEditId) {
      // const basicDueDate = new Date(currentDueDate);
      const theDueDate = new Date(currentDueDate.setHours(23, 59));
      // console.log(theDueDate);
      handleDateUpdate(id, theDueDate);
      setCurrentEditId(0);
      return;
    }

    if (currentStrikeID != 0 && id == currentStrikeID) {
      addStrike(teamId);
      setCurrentStrikeId(0);
      return;
    }
    // console.log(dueDate);
    setCurrentDueDate(new Date(dueDate));
    setCurrentEditId(id);
  };

  const addStrike = async (teamId) => {
    const apiString = "/api/teams/strikes/add/" + String(teamId);
    const res = await fetch(apiString);
    console.log(await res.json());
    mutate();
  };

  const logCleanup = (logIn) => {
    // Array to store output logs
    const logOut = [];
    logIn.map((entry) =>
      logOut.push({
        Team: entry["team"]["teamNumber"],
        Table: entry["team"]["tableNumber"],
        Tool: entry["tool"]["name"],
        Student: entry["teamMember"]["name"],
        "Date Created": new Date(entry["dateCreated"]),
        "Date Due": new Date(entry["dateDue"]),
        "Date Returned": entry["isReturned"]
          ? new Date(entry["dateReturned"])
          : null,
        Notes: entry["notes"],
      })
    );
    return logOut;
  };

  const logToWorksheet = (logIn) => {
    // Clean up logs to be array of single tier objects
    const rows = logCleanup(logIn);
    // Convert rows into better data
    const worksheet = utils.json_to_sheet(rows, { cellDates: true });
    // TODO: Fix column widths here
    return worksheet;
  };

  const sortByTeam = (logIn) => {
    logIn.sort((a, b) => a["team"]["teamNumber"] > b["team"]["teamNumber"]);
    return logIn;
  };

  const exportLogs = async (event) => {
    const { data: allData } = await (await fetch("/api/logs/all")).json();
    const { data: overdueData } = await (
      await fetch("/api/logs/overdue")
    ).json();
    const workbook = utils.book_new();
    utils.book_append_sheet(
      workbook,
      logToWorksheet(sortByTeam(logData.data)),
      "Out"
    );
    overdueData.length &&
      utils.book_append_sheet(workbook, logToWorksheet(overdueData), "Overdue");
    utils.book_append_sheet(workbook, logToWorksheet(allData), "All");
    writeFile(workbook, "ToolcribLog.xlsx");
  };

  const loadTime = new Date();
  // console.log(loadTime)
  return (
    <div className="dashboard">
      <div>
        <button className="export" onClick={exportLogs}>
          Export Log History
        </button>
      </div>
      <div className="grid">
        <div className="column-grid-header">
          <div className="header-cell">Team Number</div>
          <div className="header-cell">Table Number</div>
          <div className="header-cell">Team Member</div>
          <div className="header-cell">Due Date</div>
          <div className="header-cell">Tool Name</div>
          <div className="header-cell">Notes</div>
          <div className="header-cell">Options</div>
          {/* <div className="header-cell">Tool Limit</div> */}
        </div>

        {isLoading
          ? "Loading..."
          : logData.data.map((item) => (
              <div
                className={
                  new Date(item.dateDue) < loadTime
                    ? "column-grid late"
                    : "column-grid"
                }
                key={item.id}
              >
                <div className="cell">
                  <p>{item.team.teamNumber}</p>
                </div>
                <div className="cell">
                  <p>{item.team.tableNumber}</p>
                </div>
                <div className="cell">
                  <p>{item.teamMember.name}</p>
                </div>
                <div className="cell">
                  {item.id === currentEditId ? (
                    <DatePicker
                      clearIcon={null}
                      onChange={setCurrentDueDate}
                      value={currentDueDate}
                    />
                  ) : (
                    <p>{new Date(item.dateDue).toLocaleDateString()}</p>
                  )}
                </div>
                <div className="cell">
                  <p>{item.tool.name}</p>
                </div>
                <div className="cell">
                  <p>{item.notes}</p>
                </div>
                <div className="cell">
                  {/* <p> */}
                  <div>
                    <div className="column-grid">
                      <div className="cell" style={{ borderStyle: "none" }}>
                        <button
                          onClick={() => {
                            // console.log(item);
                            // console.log(user);
                            editCheckoutEvent(
                              item.id,
                              item.dateDue,
                              item.teamId
                            );
                          }}
                        >
                          {item.id === currentEditId ||
                          item.id == currentStrikeID
                            ? "Submit"
                            : "Edit"}
                        </button>
                      </div>
                      <div
                        className="cell"
                        style={{ borderStyle: "none", padding: "0" }}
                      >
                        <button onClick={() => handleCancelOrStrike(item.id)}>
                          {item.id === currentEditId ||
                          item.id == currentStrikeID
                            ? "Cancel"
                            : "Strike"}
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* </p> */}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
