"use client";
import { useState } from "react";
import "./ManageTools.css";
import useSWR from "swr";
import { useUser } from "@auth0/nextjs-auth0";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

// export default withPageAuthRequired(
export default function ManageTools() {
  const { user, isLoading: userIsLoading, error } = useUser();

  // Sates for adding tool and the name of the tool
  const [addTool, setAddTool] = useState(false);
  const [toolName, setToolName] = useState("");

  // Get tool list from backend
  const { data: toolRes, mutate, isLoading } = useSWR("/api/tools", fetcher);

  // Create new tool
  const submitToolEvent = async (event) => {
    const res = await fetch("/api/admin/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: toolName }),
    });

    mutate();
    setAddTool(false);
  };

  // Remove a tool
  const removeToolEvent = async (tool) => {
    const requestAddress = "/api/admin/tools/" + String(tool.id);
    await fetch(requestAddress, {
      method: "DELETE",
    });
    mutate();
  };
  const cancelAddUserEvent = () => {
    setAddTool(false);
  };
  const addUserEvent = () => {
    setAddTool(true);
  };
  const addToolHtml = () => {
    if (addTool) {
      return (
        <div className="add-input-box">
          <h2>Add Tool</h2>
          <hr />
          <p>Tool Name</p>
          <input type="text" onChange={(e) => setToolName(e.target.value)} />
          <div className="add-bttn">
            <button onClick={submitToolEvent}>Submit</button>
            <button onClick={cancelAddUserEvent}>Cancel</button>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <button className="add" onClick={addUserEvent}>
            Add Tool
          </button>
        </div>
      );
    }
  };
  if (userIsLoading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated!</div>;
  return (
    <div className="manage-tools">
      <div className="add-button">{addToolHtml()}</div>
      <div className="grid-3">
        <div className="column-grid-header">
          <div className="header-cell">Tool</div>
          <div className="header-cell">Options</div>
        </div>
        {isLoading
          ? "Loading..."
          : toolRes.data.map((tool) => (
              <div key={tool.id} className="column-grid-3">
                <div className="cell">{tool.name}</div>
                <div className="cell">
                  <button
                    onClick={() => {
                      removeToolEvent(tool);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
//   ,
//   { returnTo: "/" }
// );
