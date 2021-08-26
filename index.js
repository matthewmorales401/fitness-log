// A static server using Node and Express
const express = require("express");
const dbo = require('./databaseOps');
const app = express();


// make all the files in 'public' available on the Web
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/fitnessLog.html");
});

// instead of older body-parser 
app.use(express.json());



// handle post requests
app.post('/store', async function(request, response) {

  let date = new Date(request.body.date); 
  date = date.valueOf(); //convert date to UTC milliseconds

  //PAST ACTIVITY
  if (request.body.scalar != null) {
    const result = await dbo.database([request.body.activity, date, request.body.scalar])
    .then(console.log("Server sending data to database..."))
    .catch(function(error) {
      console.log("ERROR", error)
    });
  }
  //FUTURE ACTIVITY
   else {
     let today = new Date().toLocaleDateString();
    //  let weekCheck = new Date(today);
    // weekCheck.setDate(weekCheck.getDate() - 8)
    // weekCheck = weekCheck.toLocaleDateString()
    // weekCheck = new Date(weekCheck).valueOf();
    // console.log(weekCheck + "index");

     const result = await dbo.database([request.body.activity, date, -1])
    .then(console.log("Server sending data to database..."))
    .catch(function(error) {
      console.log("ERROR", error)
    });
  }

  console.log(
    "Server recieved a post request at", request.url, "with body:",
    request.body
  );
  response.send({
    message: "I recieved your POST request at /store"
  });
}); 


app.get('/reminder', async function(request, response) {
  await dbo.getFutureData(response, request.query.delete);
  // request.query.delete
  console.log("Server received a GET request at", request.url);
});


app.get('/week/', async function(request, response) {
  await dbo.getPastData(request.query.activity, request.query.date, response);
  console.log("Server received a GET request at", request.url);
  
});


// const today = new Date().getTime();
// app.get("/week", async function(request, response) {
//   const weekData = await dbo.getWeekData("Walk", today);
//   console.log("Server received a GET request at", request.url);
  
//   response.send({
//     message: "Message from /week",
//     weekData: weekData
//   });
// }); 


// listen for requests :)
const listener = app.listen(3000, () => {
  console.log("The static server is listening on port " + listener.address().port);
});