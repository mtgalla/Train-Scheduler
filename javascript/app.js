// Initialize Firebase
var config = {
    apiKey: "AIzaSyAQiCsaZmhVZtCMPN0vZPwbu-eCuHd15Qs",
    authDomain: "train-scheduler-1c2c9.firebaseapp.com",
    databaseURL: "https://train-scheduler-1c2c9.firebaseio.com",
    projectId: "train-scheduler-1c2c9",
    storageBucket: "",
    messagingSenderId: "933474237242"
  };
  firebase.initializeApp(config);

//Initial train data
  var initialName = ["Blue Line","BNSF","Green Line"]
  var initialDestination = ["O'Hare","Elburn","Oak Park"]
  var initialFrequency = [5,10,7];
  var initialTime = ["05:00:00 AM","05:15:00 AM","01:00 PM"]
  var tFreq = initialFrequency;

//loop through each initial train arrays, convert time and display initial trains

for (let i = 0; i < initialName.length; i++){
var initialTimeConverted = moment(initialTime[i], "HH:mm").subtract(1, "years");
  console.log(initialTimeConverted);
// Current Time
let tcurrentTime = moment();
console.log("CURRENT TIME: " + moment(tcurrentTime).format("hh:mm"));

// Difference between the times
let tdiffTime = moment().diff(moment(initialTimeConverted), "minutes");
console.log("DIFFERENCE IN TIME: " + tdiffTime);

// Time apart (remainder)
let tRemain = tdiffTime % tFreq[i];
console.log(tRemain);

// Minute Until Train
let tMinutesTillTrain = tFreq[i] - tRemain;
console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// Next Train
let tnextTime = moment().add(tMinutesTillTrain, "minutes");
console.log("ARRIVAL TIME: " + moment(tnextTime).format("hh:mm"));

// Create the initial rows
var initialRows = $("<tr>").append(
$("<td>").text(initialName[i]),
$("<td>").text(initialDestination[i]),
$("<td>").text(initialFrequency[i]),
$("<td>").text(moment(tnextTime).format("hh:mm a")),
$("<td>").text(tMinutesTillTrain)
)


$("#train-table > tbody").append(initialRows);
}

// Create a variable to reference the database.
    var database = firebase.database();
// 2. Button for adding Trains
$("#add-train").on("click", function(event) {
  event.preventDefault();
  // Grabs user input
  var trainName = $("#name-input").val().trim();
  console.log(trainName);
  var trainDestination = $("#destination-input").val().trim();
  console.log(trainDestination);
  var trainTime = moment($("#time-input").val().trim(),"hh:mm").format("HH:mm:ss A");
  console.log(trainTime);
  var trainFrequency = $("#frequency-input").val().trim();
  console.log(trainFrequency);

  // object for train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    time: trainTime,
    frequency: trainFrequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.time);
  console.log(newTrain.frequency);


  // Clears all of the text-boxes
  $("#name-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#frequency-input").val("");
});

// Firebase event for adding trains to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  let trainName = childSnapshot.val().name;
  let trainDestination = childSnapshot.val().destination;
  let trainTime = childSnapshot.val().time;
  let trainFrequency = childSnapshot.val().frequency;

  // train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainTime);
  console.log(trainFrequency);

  // 
  let tFrequency = trainFrequency
  let firstTime = trainTime
  
  let firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);
// Current Time
  let currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  let tRemainder = diffTime % tFrequency;
  console.log(tRemainder);

  // Minute Until Train
  let tMinutesTillTrain = tFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  let nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  // Create the new row
  let newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(moment(nextTrain).format("hh:mm a")),
    $("<td>").text(tMinutesTillTrain)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});


