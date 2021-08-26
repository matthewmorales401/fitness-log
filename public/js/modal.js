import barchart from './barchart.js'
import data from './data.js'

let dayHash = {};
//MODAL AND BAR CHART STUFF
//click progress button, show modal
var modal = document.getElementById("myModal");
document.getElementById("progress-btn").addEventListener("click", function(){
  let inputDate = new Date(document.getElementById('modal-date').value);
  let modalDate = new Date(inputDate.toLocaleDateString())
  modalDate = new Date(modalDate);
  modalDate.setDate(modalDate.getDate() + 1);
  dayHash = {};



  data[6].date = modalDate.valueOf();
  modalDate.setDate(modalDate.getDate() - 1);
  data[5].date = modalDate.valueOf();
  modalDate.setDate(modalDate.getDate() - 1);
  data[4].date = modalDate.valueOf();
  modalDate.setDate(modalDate.getDate() - 1);
  data[3].date = modalDate.valueOf();
  modalDate.setDate(modalDate.getDate() - 1);
  data[2].date = modalDate.valueOf();
  modalDate.setDate(modalDate.getDate() - 1);
  data[1].date = modalDate.valueOf();
  modalDate.setDate(modalDate.getDate() - 1);
  data[0].date = modalDate.valueOf();
  
  
  
  // modalDate.setDate(modalDate.getDate() - 8)
  // modalDate = modalDate.valueOf()
let progressActivity = getActivity();


fetch("/week?date=" + String(data[6].date) + "&activity=" + progressActivity)
.then(response => response.json())
.then(data => {
  dayHash = data.dayHash;
})
.then (()=>{
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
for (var i = 0; i < data.length; i++){
  let regularDate = new Date(data[i].date);
  // console.log(days[regularDate.getDay()]);
  if (days[regularDate.getDay()] in dayHash){
    console.log(days[regularDate.getDay()]);
    data[i].value = dayHash[days[regularDate.getDay()]];
  }
}
barchart.render(data, activityDisplay);
})
.catch((error) => {
    console.error("/week error:", error);
});
  modal.style.display = "block";
});

//close the modal when user clicks on the x
document.getElementsByClassName("close")[0].addEventListener("click", function(){
  console.log(dayHash);
  modal.style.display = "none";
});

let activityDisplay = "Kilometers walked";

function getActivity() {
  const measurements = {'Walk': 'Kilometers Walked', 'Run': 'Kilometers Ran', 'Swim' : 'Laps Swam', 'Bike' : 'Kilometers Biked', 'Yoga' : 'Minutes of Yoga', 'Basketball' : 'Minutes of Basketball', 'Soccer' : 'Minutes of Soccer'}
  let progressActivity = document.getElementById('modal-activity').value;
  activityDisplay = measurements[progressActivity];
  return progressActivity;
}

//updates bar data
document.getElementById("go-btn").addEventListener("click", () => {
  let inputDate = new Date(document.getElementById('modal-date').value);
  let today = new Date();
  let modalDate = new Date(inputDate.toLocaleDateString())
  modalDate = new Date(modalDate);
  modalDate.setDate(modalDate.getDate() + 1);
  if (modalDate > today){
    alert("Invalid date");
    return;
  }
  dayHash = {};
  data[0].value = 0;
  data[1].value = 0;
  data[2].value = 0;
  data[3].value = 0;
  data[4].value = 0;
  data[5].value = 0;
  data[6].value = 0; 


  data[6].date = modalDate.valueOf();
  modalDate.setDate(modalDate.getDate() - 1);
  data[5].date = modalDate.valueOf();
  modalDate.setDate(modalDate.getDate() - 1);
  data[4].date = modalDate.valueOf();
  modalDate.setDate(modalDate.getDate() - 1);
  data[3].date = modalDate.valueOf();
  modalDate.setDate(modalDate.getDate() - 1);
  data[2].date = modalDate.valueOf();
  modalDate.setDate(modalDate.getDate() - 1);
  data[1].date = modalDate.valueOf();
  modalDate.setDate(modalDate.getDate() - 1);
  data[0].date = modalDate.valueOf();
  
  
  
  // modalDate.setDate(modalDate.getDate() - 8)
  // modalDate = modalDate.valueOf()
let progressActivity = getActivity();


fetch("/week?date=" + String(data[6].date) + "&activity=" + progressActivity)
.then(response => response.json())
.then(data => {
  dayHash = data.dayHash;
})
.then (()=>{
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
for (var i = 0; i < data.length; i++){
  let regularDate = new Date(data[i].date);
  // console.log(days[regularDate.getDay()]);
  if (days[regularDate.getDay()] in dayHash){
    console.log(days[regularDate.getDay()]);
    data[i].value = dayHash[days[regularDate.getDay()]];
  }
}
barchart.render(data, activityDisplay);
})
.catch((error) => {
    console.error("/week error:", error);
});



});


export default activityDisplay;