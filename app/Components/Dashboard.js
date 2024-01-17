"use client";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import "./Dashboard.css";
import useSWR from "swr";
import { writeFile, utils } from "xlsx";
// import UpdateCheckout from "@/Components/UpdateCheckout";
import { useState } from "react";
import DatePicker from "react-date-picker";

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

  const editCheckoutEvent = (id, dueDate) => {
    // console.log(id);
    if (currentEditId != 0 && id == currentEditId) {
      // const basicDueDate = new Date(currentDueDate);
      const theDueDate = new Date(currentDueDate.setHours(23, 59));
      // console.log(theDueDate);
      handleDateUpdate(id, theDueDate);
      setCurrentEditId(0);
    } else {
      // console.log(dueDate);
      setCurrentDueDate(new Date(dueDate));
      setCurrentEditId(id);
    }
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
      {true && (
        <div>
          <button className="export" onClick={exportLogs}>
            Export Log History
          </button>
        </div>
      )}
      {true && (
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
            : logData.data.map((item) =>
                new Date(item.dateDue) < loadTime ? (
                  <div id="late" className="column-grid" key={item.id}>
                    <div className="cell">
                      <p style={{ color: "red" }}>{item.team.teamNumber}</p>
                    </div>
                    <div className="cell">
                      <p style={{ color: "red" }}>{item.team.tableNumber}</p>
                    </div>
                    <div className="cell">
                      <p style={{ color: "red" }}>{item.teamMember.name}</p>
                    </div>
                    <div className="cell">
                      {item.id === currentEditId ? (
                        <DatePicker
                          clearIcon={null}
                          onChange={setCurrentDueDate}
                          value={currentDueDate}
                        />
                      ) : (
                        new Date(item.dateDue).toLocaleDateString()
                      )}
                    </div>
                    <div className="cell">
                      <p style={{ color: "red" }}>{item.tool.name}</p>
                    </div>
                    <div className="cell">
                      <p style={{ color: "red" }}>{item.notes}</p>
                    </div>
                    <div className="cell">
                      <button
                        onClick={() => {
                          // console.log(item);
                          editCheckoutEvent(item.id, item.dateDue);
                        }}
                      >
                        {item.id === currentEditId ? "Submit" : "Edit"}
                      </button>
                    </div>
                    {/* <div className="cell">
                    <p style={{ color: "red" }}>{item["toolLimit"]}</p>
                  </div> */}
                    {/* {console.log(item)} */}
                  </div>
                ) : (
                  <div className="column-grid" key={item.id}>
                    <div className="cell">{item.team.teamNumber}</div>
                    <div className="cell">{item.team.tableNumber}</div>
                    <div className="cell">{item.teamMember.name}</div>
                    <div className="cell">
                      {item.id === currentEditId ? (
                        <DatePicker
                          clearIcon={null}
                          onChange={setCurrentDueDate}
                          value={currentDueDate}
                        />
                      ) : (
                        new Date(item.dateDue).toLocaleDateString()
                      )}
                    </div>
                    <div className="cell">{item.tool.name}</div>
                    <div className="cell">{item.notes}</div>
                    <div className="cell">
                      {/* {item.id === currentEditId ? ( */}
                      <button
                        onClick={() => {
                          editCheckoutEvent(item.id, item.dateDue);
                          // console.log(currentDueDate);
                        }}
                      >
                        {item.id === currentEditId ? "Submit" : "Edit"}
                      </button>
                      {/* ) : (
                        <button
                          onClick={() => {
                            submitUpdate(item.id);
                          }}
                        >
                          Submit
                        </button> */}
                      {/* )} */}
                    </div>
                    {/* <div className="cell">{item["toolLimit"]}</div> */}
                    {/* {console.log(item)} */}
                  </div>
                )
              )}
        </div>
      )}
    </div>
  );
}
