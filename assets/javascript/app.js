// indentation needs some work
var config = {
  apiKey: "AIzaSyDyupahqRG9RT_5RD9DMZqyh_35R_JTtvw",
  authDomain: "limited-slip-differential.firebaseapp.com",
  databaseURL: "https://limited-slip-differential.firebaseio.com",
  projectId: "limited-slip-differential",
  storageBucket: "limited-slip-differential.appspot.com",
  messagingSenderId: "807949935870"
};

// database wasn't defined below
var firebaseApp = firebase.initializeApp(config);
var database = firebaseApp.database();

function convertToMinutes(time) {
 	if ($("#units-select").val() === "hours") {
    return time * 60;
  } else {
    return time;
  }
}

//adds new row to table of train info
function addRow(snapshotObj, key) {
  var newRow = $("<tr>").attr("id", key);

  var minsAway = calculateMinsAway(snapshotObj.start, snapshotObj.frequency);

  newRow.append("<td>" + snapshotObj.name + "</td>");
  newRow.append("<td>" + snapshotObj.route + "</td>");
  newRow.append("<td>" + snapshotObj.frequency + "</td>");
  newRow.append("<td>" + nextTrainTime(minsAway) + "</td>");
  newRow.append("<td>" + minsAway + "</td>");
  newRow.append("<td> <span class='glyphicon glyphicon-trash'></span></td>");

  $("#schedule-body").append(newRow);

}

function calculateMinsAway(startTime, frq) {
  //make sure start time is before current time
  var convertedStart = moment(startTime, "hh:mm").subtract(1, "years");
  console.log("start: " + convertedStart.format("hh:mm"));
  //save current time in variable
  var now = moment();
  console.log("current: " + moment(now).format("hh:mm"));

  var difference = moment(now).diff(moment(convertedStart), "minutes");
  console.log("difference: " + difference);

  var remainder = difference % frq;

  return frq - remainder;
}

function nextTrainTime(mins) {
  return moment().add(mins, "minutes").format("hh:mm");
}

//alert user of input error
function errorAnimate() {
  $("#input-section").css("background-color", "rgba(188, 121, 116,0.7)");
  $("#input-section").animate({backgroundColor: "rgba(255,255,255,0.7)"});
}

$(document).on("click", ".glyphicon-trash", function () {
var parent = $(this).parents("tr");
  firebase.database().ref(parent.attr("id")).remove(); //removes node with given ID from firebase

});

$("#add-train").on("click", function(event) {
  event.preventDefault();
  var nameInput = $("#name-input").val().trim();
  var routeInput = $("#route-input").val().trim();
  var startInput = $("#start-input").val().trim();
  var frequencyInput = convertToMinutes(parseInt($("#frequency-input").val().trim()));

  //regex to check time input
  var p = /([01]?[0-9]|2[0-3]):[0-5][0-9]/;

  if (nameInput === "" || routeInput === "" || startInput === "" || frequencyInput === "") {
    errorAnimate();
    $("#error").show();
    
  } else if (!p.test(startInput)) {
    errorAnimate();
    $("#time-error").show();

  } else {
    $("#error").hide();
    $("#time-error").hide();

    database.push({
      name: nameInput,
      route: routeInput,
      start: startInput,
      frequency: frequencyInput,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    //empty input boxes
    $("#name-input").val("");
    $("#route-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");
  }

});

// you need to use database refs to call the "on" functions and etc.
// https://firebase.google.com/docs/database/web/read-and-write#listen_for_value_events
var databaseRef = database.ref('/');
databaseRef.on("child_added", function(snap) {
  var value = snap.val();
  var key = snap.key;	//key will be used as row ID for row deletion

  addRow(value, key);

}, function(err) {
  console.log("Errors handled: " + err.code);
});

//row deletion
database.on("child_removed", function(snap) {
  $("#" + snap.key).remove();

}, function(err) {
  console.log("Errors handled: " + err.code);
});

for (var i=0; i<initialData.length; i++) {
  addRow(initialData[i], "");
}



/* var suits = [ "hearts", "diams", "clubs", "spades" ];
var ranks = [ 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A" ];

var deck = [];

$(init);

function init() {
makeDeck();

$("#drawbtn").click( function() {
  
  var myCard = drawCard();
  
  if( myCard ) {
    makeCard( myCard.suit, myCard.rank );
  } else {
    alert("no more cards in the deck");
  }
  
});

}

function makeDeck() {

deck = [];
//for each type of suit
for( var i = 0; i < suits.length; i++ ) {
  //and for each rank
  for( var j = 0; j < ranks.length; j++ ) {
    
    //make a card
    var card = {};
    card.suit = suits[i];
    card.rank = ranks[j];
    
    deck.push(card);
  }
}

console.log( "MADE A NEW DECK OF ", deck.length, " CARDS" );
console.log( deck );
}

function drawCard() {

var card;

if( deck.length > 0 ) {
  
  var randIndex = Math.floor( Math.random() * deck.length );
  card = deck.splice( randIndex, 1 )[0];
}

return card;
}

function makeCard( suit, rank ) {
var card = $(".card.template").clone();

card.removeClass("template");

card.find(".rank").html(rank);
card.find(".suit").html("&"+suit+";");

if( suit === "hearts" || suit === "diams" ) {
  card.addClass("red");
}

$("body").append(card);
} */
