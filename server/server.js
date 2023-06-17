const express = require("express");
const mysql = require('mysql');
const PORT = 3002;
const cors = require('cors');
// const https = require("https");
// const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

// lets req.body objects be defined idk why
app.use(express.urlencoded({extended: false}));

app.use('/tools', require('./routes/toolRoutes'));
app.use('/teams', require('./routes/teamRoutes'));
// app.use('/checkout', require('./routes/checkoutRoutes'))
app.use('/logs', require('./routes/logRoutes'));
// app.use('/teams', require('./routes/importRoutes'));

app.listen(PORT, () => {
  console.log(`Yay you're port is running on ${PORT}`);
});
// https.createServer(
//   {
//     key: fs.readFileSync("key.pem"),
//     cert: fs.readFileSync("cert.pem"),
//   },
//   app).listen(PORT, ()=>{
//   console.log(`Yay you're port is running on ${PORT}`)
// });