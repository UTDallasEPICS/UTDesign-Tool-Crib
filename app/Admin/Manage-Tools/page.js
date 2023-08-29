'use client'
import { useState } from 'react'
import '../../../src/Styles/ManageTools.css'
import useSWR from 'swr'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default withPageAuthRequired(function ManageTools() {
  const [addTool, setAddTool] = useState(false)
  const [toolName, setToolName] = useState("")
  const {data: toolRes, mutate, error, isLoading} = useSWR("/api/tools", fetcher);
  
  const submitToolEvent = async (event) => {
    const res = await fetch('/api/admin/tools',{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"name": toolName})
    })

    mutate()
    setAddTool(false)
    
  }

// let data = []
const removeToolEvent = async (tool) => {
  const requestAddress = "/api/admin/tools/"+String(tool.id)
  await fetch(requestAddress, {
    method: 'DELETE'
  })
  mutate()
}
  const cancelAddUserEvent = () => {
    setAddTool(false)
  }
  const addUserEvent = () => {
    setAddTool(true)
  }
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
  // if (isLoading) return <div>Loading...</div>
  // if (isError) return <div>${isError}</div>
    return (
        <div className="manage-tools">
      {/* <LoginButton/> */}
      
      <div className="add-button">{addToolHtml()}</div>
      <div className="grid-3">
        <div className="column-grid-header">
          <div className="header-cell">Tool</div>
          <div className="header-cell">Options</div>
        </div>
        {isLoading ? "Loading..." :
          toolRes.data.map((tool) => (
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
          ))
          }
      </div>
    </div>
    )
}, {returnTo: '/'});