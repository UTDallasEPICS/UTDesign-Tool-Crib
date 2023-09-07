"use client";
import "./Dashboard.css";
import useSWR from "swr";
import { writeFile, utils } from "xlsx";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Dashboard() {
  // Main data displayed in table
  const { data: logData, isLoading } = useSWR("/api/logs/current", fetcher, {
    refreshInterval: 300000, // Refresh every 5 minutes automatically
  });

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
                      <p style={{ color: "red" }}>
                        {new Date(item.dateDue).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="cell">
                      <p style={{ color: "red" }}>{item.tool.name}</p>
                    </div>
                    <div className="cell">
                      <p style={{ color: "red" }}>{item.notes}</p>
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
                      {new Date(item.dateDue).toLocaleDateString()}
                    </div>
                    <div className="cell">{item.tool.name}</div>
                    <div className="cell">{item.notes}</div>
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
