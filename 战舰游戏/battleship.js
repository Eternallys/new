var view = {
  displayMessage: function(msg){
    var MessageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },
  displayHit: function(location){
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },
  displayMiss: function(location){
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
}

// view.displayMiss("00");
// view.displayHit("34");
// view.displayMiss("55");
// view.displayHit("12");
// view.displayMiss("25");
// view.displayHit("26");
// view.displayMessage("Tap tap, is this thing on?");


var model = {
  boardSize: 7,
  numShips: 3,
  shipsSunk: 0,
  shipLength: 3,
  ships: [ { locations: [0, 0, 0], hits: ["", "", ""] },
           { locations: [0, 0, 0], hits: ["", "", ""] },
           { locations: [0, 0, 0], hits: ["", "", ""] }],

fire: function(guess) {
  for (var i = 0; i < this.numShips; i++) {
    var ship = this.ships[i];
    var index = ship.locations.indexOf(guess);
    if (index >= 0) {
      ship.hits[index] = "hit";
      view.displayHit(guess);
      view.displayMessage("HIT!");
      if (this.isSunk(ship)) {
        view.displayMessage("You sank my battleship!"); 
        this.shipsSunk++;
      }
      return true;
    }
  } 
  view.displayMiss(guess);
  view.displayMessage("You missed."); 
  return false;
},

isSunk: function(ship){
  var count = 0;
  for (var i = 0; i < this.shipLength; i++){
    if (ship.hits[i] === "hit") {
      count++;
      for (var a = 0; a < this.shipLength; a++) {
        var changecolor = document.getElementById(ship.locations[a])
        view.displayHit(ship.locations[a])
        var newcolor = document.getElementById(event.target.id)
        newcolor.style.backgroundImage= "url('boom.png')"
      }
    }
  };
  
  if (count > this.shipLength * 0.666){
    for (var t = 0; t < this.shipLength; t++) {
    var tdcolor = document.getElementById(ship.locations[t])
    view.displayHit(ship.locations[t])
    tdcolor.style.backgroundImage= "url('boom.png')"
    }
    return true;
  }
  return false;
},

generateShipLocations: function() {
  var locations;
  for (var i = 0; i < this.numShips; i++) {
    do {
      locations = this.generateShip();
    } while (this.collision(locations));
    this.ships[i].locations = locations;
  }
  console.log("Ships array: ");
  console.log(this.ship);
},

generateShip: function() {
  var direction = Math.floor(Math.random() * 2);
  var row, col;

  if (direction === 1) {
    row = Math.floor(Math.random() * this.boardSize);
    col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
  } else {
    row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    col = Math.floor(Math.random() * this.boardSize);
  }

  var newShipLocations = [];
  for (var i = 0; i < this.shipLength; i++) {
    if (direction === 1) {
      newShipLocations.push(row + "" + (col + i));
    } else {
      newShipLocations.push((row + i) + "" + col);
    }
  }
  return newShipLocations; 
},

collision: function(locations) {
  for (var i = 0; i < this.numShips; i++) {
    var ship = model.ships[i];
    for (var j = 0; j < locations.length; j++) {
      if (ship.locations.indexOf(locations[j]) >= 0) {
        return true;
      }
    }
  }
  return false;
}
};

function parseGuess(guess) {
//var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
  if (guess === null || guess.length !==2){
    alert("Oops, please enter a letter and a number on the board.");
  } else {
    firstChar = guess.charAt(0);
    //var row= alphabet.indexOf(firstChar);
    var row = guess.charAt(0);
    var column = guess.charAt(1);
    if (isNaN(row) || isNaN(column)){
      alert("Oops, that isn't on the board.");
    } else if (row < 0 || row >+ model.boardSize ||
      column < 0 || column >= model.boardSize) {
      alert("Oops, that's off the board!");
    } else {
      return row + column;
    }
  }
  return null;
}

var controller = {
  guesses: 0,
  processGuess: function(guess) {
    var location = parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("恭喜你，终于干翻了所有敌舰, 总共射了 " + this.guesses + " 次");
      }
    }
  }
};

function init() {
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  console.log(model.ships)
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;
  model.generateShipLocations();
  var TD=document.getElementsByTagName('td')
  for(i=0; i < TD.length; i++){
    TD[i].onclick=text
  }
}

function text(event) {
  var guess = this.id;
  controller.processGuess(guess);
  // console.log(event.target.id)
}

function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;
  controller.processGuess(guess);
  guessInput.value = "";
}

function handleKeyPress(e) {
  var fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}

window.onload = init;

