import { Link } from "react-router-dom";
import "../styles/header.css";
import "../styles/ReturnTool.css";
import logo from "../styles/logo.svg";
// import orderData from "../data/db.json";
import { useState, useEffect } from "react";
import axios from "axios";
//import myFunction from "../scripts/returnTools.js"

const API_URL = `http://${process.env.REACT_APP_DOMAIN}:${process.env.REACT_APP_API_PORT}`

function ReturnTool() {
  console.log(logo);

  const [data, setData] = useState([]);

  const [, setNumber] = useState(-1);

  const [items, setItem] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await getOrderData();
    }
    fetchData();
  }, []);

  const handleRemoveEvent = (event) => {
    for (let i = 0; i < items.length; i++) {
      if (
        document.getElementById(items[i].toolName) &&
        document.getElementById(items[i].toolName).checked
      ) {
        axios.delete(`${API_URL}/logs/` + items[i].id);
        // fetch("http://localhost:8000/logs/" + items[i].id, {
        //   method: "DELETE",
        // }).catch((err) => {
        //   console.log(err.message);
        // });
      }
    }
  };

  const handleEnterData = (event) => {
    setNumber(event.target.value);
    const filteredData = data.filter(
      // eslint-disable-next-line
      (entry) => entry["teamNumber"] == event.target.value
    );
    if (filteredData.length > 0) {
      // const toolNames = filteredData.map((entry) => {toolName: entry["toolName"], identity: entry.id});
      setItem(filteredData);
    } else {
      setItem([]);
    }
    // delete orderData[0];
  };

  // function myFunction(item){
  //     if(document.getElementById('teamnumber').value === item['team-number']){
  //         const inputItem = document.createElement('input');
  //         inputItem.setAttribute('id', item['tool-name']);
  //         const toolName = item['tool-name']

  //         return '<div>' +{inputItem}+'<p>'+{toolName}+'</p>'+'</div>';
  //     }

  // }

  async function getOrderData() {
    axios.get(`${API_URL}/logs/`).then((resp) => {
      setData(resp.data);
    });
    // fetch(`http://localhost:${PORT}/logs/`)
    //   .then((res) => {
    //     return res.json();
    //   })
    //   .then((resp) => {
    //     setData(resp);
    //   })
    //   .catch((error) => {
    //     console.log(error.message);
    //   });
  }
  return (
    <div className="return-tool">
      <div className="header">
        <div className="title">
        <img src={logo} alt="" />
          <h1>Return Tool</h1>
        </div>

        <div className="header-buttons">
          <Link to="/">
            <button>Back</button>
          </Link>
        </div>
      </div>

      <center>
        <div className="input-box">
          <div>
            <p>Team Number</p>
            <input type="text" id="teamnumber" onChange={handleEnterData} />
          </div>
          <div>
            {items &&
              items.map((item) => (
                <div className="tool-list">
                  <input type="checkbox" id={item.toolName} />
                  <p>{item.toolName}</p>
                </div>
              ))}
          </div>
          <div>
            <Link to="/">
              <button id="remove-bttn" onClick={() => handleRemoveEvent()}>
                Remove
              </button>
            </Link>
          </div>
        </div>
      </center>
    </div>
  );
}
export default ReturnTool;
