const asyncHandler = require('express-async-handler');
const queryLogs = require("../db-service");

/*
@desc Fetches the logs table from the database
@route GET /logs
@access Private
*/
const getLogs = asyncHandler(async (req, res) => {
    queryLogs.query("SELECT * FROM managelogs ORDER BY id DESC", (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            let data = [];
            for(let i = 0; i < result.length; i++){
                data.push([result[i].id, result[i].teamNumber, result[i].tableNumber, result[i].teamMember, result[i].dueDate, result[i].toolLimit, result[i].toolName, result[i].notes]);
            }

            data = sortData(data);

            const response = data.reduce((acc, [id, teamNumber, tableNumber, teamMember, dueDate,toolLimit, toolName, notes]) => {
                acc.push({id, teamNumber, tableNumber, teamMember, dueDate, toolLimit, toolName, notes});
                return acc;
              }, []);
            // let response = {};
            // for(let i = 0; i < data.length; i++){
            //     const respData = {
            //         id: data[i][0],
            //         teamNumber: data[i][1],
            //         tableNumber: data[i][2],
            //         teamMember: data[i][3],
            //         dueDate: data[i][4],
            //         toolLimit: data[i][5],
            //         toolName: data[i][6],
            //         notes: data[i][7],
            //     }
            //     response.push(respData);
            // }
            res.send(response);
        }
    })
});

function sortData(data){
    let temp = data;
    
    for(let i = 0; i < temp.length; i++){
        for(let j = 0; j < temp.length - 1; j++){
            
            if(!compareDate(temp[j][4], temp[j+1][4])){
                let rando = temp[j];
                temp[j] = temp[j+1];
                temp[j+1] = rando;
            }
        }
    }
    return temp;
}

/* 
@desc compareDate compares two dates firstDate and secondDate if first Date is smaller than second date it returns true else false.
*/
function compareDate(firstDate, secondDate) {
    const compareDay = firstDate.substring(3, 5);
    const compareMonth = firstDate.substring(0, 2);
    const compareYear = firstDate.substring(6, 10);
    const currentDate = secondDate.substring(3, 5);
    const currentMonth = secondDate.substring(0, 2);
    const currentYear = secondDate.substring(6, 10);
    
    if (compareYear >= currentYear) {
      if (compareMonth >= currentMonth) {
        if (compareDay >= currentDate) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

const setLogs = asyncHandler(async (req, res) => {
    const postNumber = req.body.teamNumber;
    const postTableNumber = req.body.tableNumber;
    const postMember = req.body.teamMember;
    const postDate = req.body.dueDate;
    const postLimit = req.body.toolLimit;
    const postName = req.body.toolName;
    const postNotes = req.body.notes;
    queryLogs.query("INSERT INTO managelogs (teamNumber,tableNumber, teamMember, dueDate, toolLimit, toolName, notes) VALUES (?, ?, ?, ?, ?, ?, ?)", [postNumber,postTableNumber, postMember, postDate, postLimit, postName, postNotes], (err, result) => {
        if(err){
            console.log(err);
        }
        else{
            
        }
    });
    queryLogs.query("INSERT INTO loghistory (teamNumber,tableNumber, teamMember, date, toolLimit, toolName, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?,?)", [postNumber,postTableNumber, postMember, postDate, postLimit, postName, postNotes, "Borrowed"], (err, result) => {
        if(err){
            console.log(err);
        }
        else{
            res.send("VALUES Inserted");
        }
    });
});

const removeLogs = asyncHandler(async (req, res) => {
    const id = req.params.id;
    queryLogs.query("SELECT * FROM managelogs WHERE id = ?", id, (err, result) => {
        if(err){
            console.log(err);
        }
        else{
            const current = new Date();
            let date = `${
                current.getMonth() + 1
            }/${current.getDate()}/${current.getFullYear()}`;
            if (current.getDate() < 10) {
                date = `${
                current.getMonth() + 1
                }/0${current.getDate()}/${current.getFullYear()}`;
            }
            if (current.getMonth() < 10) {
                date = `0${
                current.getMonth() + 1
                }/${current.getDate()}/${current.getFullYear()}`;
            }
            if (current.getMonth() < 10 && current.getDate() < 10) {
                date = `0${
                current.getMonth() + 1
                }/0${current.getDate()}/${current.getFullYear()}`;
            }
            const postNumber = result[0].teamNumber;
            const postTableNumber = result[0].tableNumber;
            const postMember = result[0].teamMember;
            const postDate = date;
            const postLimit = result[0].toolLimit;
            const postName = result[0].toolName;
            const postNotes = result[0].notes;
            queryLogs.query("INSERT INTO loghistory (teamNumber,tableNumber, teamMember, date, toolLimit, toolName, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?,?)", [postNumber,postTableNumber, postMember, postDate, postLimit, postName, postNotes, "Returned"], (err, result) => {
                if(err){
                    console.log(err);
                }
                else{
                    
                }
            });
            queryLogs.query("UPDATE manageteams SET tokens = tokens + 1 WHERE teamNumber = ?", [result[0].teamNumber], (err, result) => {
                if(err){
                    console.log(err);
                }
                else{
                    
                }
            });
        }
    })
    queryLogs.query("DELETE FROM managelogs WHERE id = ?",  id, (err) => {
        if(err){
            console.log(err);
        }
        else {
            res.send("deleted log " + id);
        }
    });
});

const exportLogs = asyncHandler(async (req, res) => {
    queryLogs.query("SELECT * FROM loghistory ORDER BY id ASC", (err, result) => {
        if(err){
            console.log(err);
        }
        else {
            // res.send(result);
            // console.log(result);
            let data = [["id", "Team Number", "Table Number", "Team Member", "Date", "Tool Limit", "Tool Name", "Notes", "status"]];
            for(let i = 0; i < result.length; i++){
                data.push([result[i].id, result[i].teamNumber, result[i].tableNumber, result[i].teamMember, result[i].date, result[i].toolLimit, result[i].toolName, result[i].notes, result[i].status]);
            }
            
            res.send(data);
        }
    });
});

module.exports = {
    getLogs,
    removeLogs,
    setLogs,
    exportLogs,
}