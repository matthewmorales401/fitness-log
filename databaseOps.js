'use strict'

const db = require('./sqlWrap');

const insertDB = "INSERT INTO ActivityTable (activity, date, amount) values (?,?,?)";
const getOneDB = "SELECT * FROM ActivityTable where activity = ? and date = ? and amount = ?";
const allDB = "SELECT * FROM ActivityTable where activity = ?";
const allFutureDB = "SELECT * FROM ActivityTable where amount = -1";
const deleteDB = "DELETE FROM ActivityTable where activity = ? and date = ? and amount = ?";
const allWeekDB = "SELECT * FROM ActivityTable WHERE activity = ? and date BETWEEN ? AND ?";
const pastDB = "SELECT * FROM ActivityTable where activity = ? and amount > -1";
const allPastDB = "SELECT * FROM ActivityTable where activity > -1";

let today = new Date().toLocaleDateString();
today = new Date(today).valueOf();
let weekCheck = new Date(today);
weekCheck.setDate(weekCheck.getDate() - 7)
weekCheck = weekCheck.toLocaleDateString();
weekCheck = new Date(weekCheck).valueOf();


let pastWeek = new Date(today);
pastWeek.setDate(pastWeek.getDate() - 6)
pastWeek = pastWeek.toLocaleDateString();
pastWeek = new Date(pastWeek).valueOf();

async function database(myData) {
  //await db.deleteEverything();
  
  await db.run(insertDB, myData);
  let result = await db.get(getOneDB, myData).then(console.log("Database got myData:"));

  // let test = await db.all(allDB,["Walk"]);
  // console.log("hello.....", test);
}
async function getPastData(activity, date, response){
  // deal with cases where there is no activity entered
  if (activity === undefined){
    let fullPast = await db.all(allPastDB);
    activity = fullPast[fullPast.length-1].activity
  }

  let pastActivities = await db.all(pastDB, [activity])
  //use to limit amount of data for past week
  date = parseInt(date);
   let pastWeek = new Date(date);
  pastWeek.setDate(pastWeek.getDate() - 7)
  pastWeek = pastWeek.toLocaleDateString();
  pastWeek = new Date(pastWeek).valueOf();

  //traverse list of weeks and insert data that is in correct weeks
  let pastWeekList = []
  for (var i = pastActivities.length - 1; i >= 0; i--) {
    if(pastActivities[i].date > date){
      continue;
    }

    if (pastActivities[i].date > pastWeek){
      pastWeekList.push(pastActivities[i]);
    }
  }
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let dayHash = {};
  for (var i = 0; i < pastWeekList.length; i++) {
    let pastDay =  pastWeekList[i].date
    pastDay =  days[new Date(pastDay).getDay()];
    if (pastDay in dayHash){
      dayHash[pastDay] = dayHash[pastDay] + pastWeekList[i].amount;
    } else {
      dayHash[pastDay] = pastWeekList[i].amount;
    }
  }
  response.json({pastWeekList: pastWeekList, dayHash: dayHash});

}


async function getFutureData(response) {
  let recentActivity = null;
  let result = await db.all(allFutureDB);
  if (result.length == 0) {
    console.log("No planned activities from the past.");
    return null;
  }




  // let pastWeek = new Date(date);
  // pastWeek.setDate(pastWeek.getDate() - 6)
  // pastWeek = pastWeek.toLocaleDateString();
  // pastWeek = new Date(pastWeek).valueOf();
  // for (var i = pastActivities.length - 1; i >= 0; i--) {
  //   if (activity === null){

  //   }
  // }


  // let recentActivity = result[0]; //initialize most recent 
  // let date = recentActivity.date;
  // if (result.length == 1) {
  //   if (date > today) {
  //     recentActivity = null;
  //     date = null;
  //     console.log("No planned activities from the past.")
  //   }
  //   return null;
  // }
  
  for (var i = result.length - 1; i >= 0; i--) {
    let formatDate = result[i].date;
    //if formatDate is in the future
    if (formatDate >= today) {
      continue;
    }
    else {
       
      //check if initial date is yesterday
      if (formatDate >= weekCheck) {
        if (recentActivity === null){
          recentActivity = result[i]; 
          // continue;
        }
        await db.run(deleteDB, [result[i].activity,result[i].date,result[i].amount]);
      }
      else {
        await db.run(deleteDB, [result[i].activity,result[i].date,result[i].amount]);
      }


    } 
  }

  //check 
  // if (date > today) {
  //   recentActivity = null;
  //   date = null;
  //   console.log("No planned activities from the past.")
  //   return null;
  // }
    response.json( {
    message: "I received your GET request at /reminder",
    recentActivity: recentActivity
  });
}


// async function getWeekData(activity, week) {
//   console.log("incoming date", week);
//   // let upperDate = Date.parse(week); //convert the upper bound date to milliseconds
//   let lowerDate = week-604800000; //lower bound of week

//   let result =  await db.run(allWeekDB, [activity, lowerDate, week]);
//   console.log("RESULT", result);
//   return result;
// }


module.exports = { database, getPastData, getFutureData };const getActivityUser = ' select * from ActivityTable where activity = "yoga" ';