"use client";
import Header from "../Components/Header";
import useSWR from "swr";
import "@/app/styles/header.css";
import "./ReturnTool.css";
import { useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default withPageAuthRequired(
  function ReturnTool() {
    const {
      data: toolLogs,
      mutate,
      isLoading,
    } = useSWR("/api/logs/current", fetcher);
    const [teamNumber, setNumber] = useState("");
    const [itemList, setItem] = useState([]);

    const handleRemoveEvent = async () => {
      for (let i = 0; i < itemList.length; i++) {
        if (
          document.getElementById(itemList[i].id) &&
          document.getElementById(itemList[i].id).checked
        ) {
          var apiString = "/api/logs/return/" + String(itemList[i].id);
          const res = await fetch(apiString);
          document.getElementById("teamnumber").setAttribute("value", null);
          setNumber("");
          setItem([]);
          mutate();
        }
      }
    };

    const handleEnterData = (event) => {
      setNumber(event.target.value);
      const filteredData = toolLogs.data.filter(
        // eslint-disable-next-line
        (entry) => entry.team.teamNumber == event.target.value
      );
      if (filteredData.length > 0) {
        // const toolNames = filteredData.map((entry) => {toolName: entry["toolName"], identity: entry.id});
        setItem(filteredData);
        // console.log(filteredData)
      } else {
        setItem([]);
      }
      // delete orderData[0];
    };

    return (
      <div className="return-tool">
        <Header title="Return Tool" />

        <center>
          <div className="input-box">
            <div>
              <p>Team Number</p>
              <input
                type="text"
                id="teamnumber"
                onChange={handleEnterData}
                value={teamNumber}
              />
            </div>
            <div>
              {isLoading ? (
                <></>
              ) : (
                itemList.map((item) => (
                  <div className="tool-list" key={item.id}>
                    <input type="checkbox" id={item.id} />
                    <p>{item.tool.name}</p>
                    <p className="notes">{item.notes}</p>
                  </div>
                ))
              )}
            </div>
            <div>
              {/* <Link to="/"> */}
              <button id="remove-bttn" onClick={() => handleRemoveEvent()}>
                Remove
              </button>
              {/* </Link> */}
            </div>
          </div>
        </center>
      </div>
    );
  },
  { returnTo: "/" }
);
