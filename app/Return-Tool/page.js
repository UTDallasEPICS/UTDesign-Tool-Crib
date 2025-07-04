"use client";
import Header from "../Components/Header";
import useSWR from "swr";
import "@/app/styles/header.css";
import "./ReturnTool.css";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@auth0/nextjs-auth0";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

// export default withPageAuthRequired(
export default function ReturnTool() {
  const {
    data: toolLogs,
    mutate,
    isLoading,
  } = useSWR("/api/logs/current", fetcher);
  const { user, isLoading: userIsLoading, error } = useUser();

  const [teamNumber, setNumber] = useState("Select Team...");
  const [itemList, setItem] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const textInput = useRef();

  const effectCalledRef = useRef(false);
  useEffect(() => {
    if (!isLoading && !effectCalledRef.current) {
      const tempTeams = [
        ...new Set(toolLogs.data.map((item) => item.team.teamNumber)),
      ];
      console.log(tempTeams);
      setTeamList(tempTeams.sort());
    }
  }, [toolLogs, isLoading]);

  const handleRemoveEvent = async () => {
    let itemsToRemove = [];
    for (let i = 0; i < itemList.length; i++) {
      if (
        document.getElementById(itemList[i].id) &&
        document.getElementById(itemList[i].id).checked
      ) {
        itemsToRemove.push(itemList[i].id);
      }
    }

    if (itemsToRemove.length) {
      const res = await fetch(`/api/logs/return/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: itemList[0].team.id,
          logIds: itemsToRemove,
        }),
      });
      if (res.status === 200) {
        document.getElementById("teamnumber").setAttribute("value", null);
        setNumber("");
        setItem([]);
        mutate();
      } else {
        console.log(await res.json());
        alert("Failed to return items. Please try again.");
      }
    }
  };

  const handleEnterData = (event) => {
    // console.log(event);
    setNumber(event);
    const filteredData = toolLogs.data.filter(
      // eslint-disable-next-line
      (entry) => entry.team.teamNumber.toUpperCase() == event.toUpperCase()
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
  // Wait for user to load
  if (userIsLoading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated!</div>;

  return (
    <div className="return-tool">
      <Header title="Return Tool" />

      <center>
        <div className="input-box">
          <div className="dropdown">
            {/* <p>Team Number</p>
              <input
                type="text"
                id="teamnumber"
                onChange={handleEnterData}
                value={teamNumber}
              /> */}

            <button
              onClick={() => {
                document
                  .getElementById("tool-dropdown")
                  .classList.toggle("show");
                textInput.current.focus();
              }}
              className="drop-btn"
            >
              {teamNumber}
            </button>
            <div id="tool-dropdown" className="dropdown-content">
              <input
                type="text"
                placeholder="Search..."
                onKeyUp={() => filterTools()}
                id="myInput"
                ref={textInput}
              />
              {isLoading
                ? "Loading..."
                : teamList.map((entry) => (
                    <div key={entry}>
                      <button
                        onClick={() => {
                          console.log(teamNumber);
                          document
                            .getElementById("tool-dropdown")
                            .classList.toggle("show");
                          handleEnterData(entry);
                        }}
                      >
                        {entry}
                      </button>
                    </div>
                  ))}
            </div>
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
}
//   ,
//   { returnTo: "/" }
// );
