"use client";
import { useState } from "react";
import "../../src/Styles/logGrid.css";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Dashboard() {
  const {
    data: logData,
    mutate,
    error,
    isLoading,
  } = useSWR("/api/logs/current", fetcher, { refreshInterval: 300000 }); // Refresh every 5 minutes automatically

  const exportLogs = (event) => {
    const a = "b";
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
