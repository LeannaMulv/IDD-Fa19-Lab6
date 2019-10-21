/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  var NumberOfPeople=0;
  socket.on('loaded', function() { // we wait until the client has loaded and contacted us that it is ready to go.

    socket.emit('answer', "Hey, hello I am Dining Hall Bot. "); //We start with the introduction;
    setTimeout(timedQuestion, 5000, socket, "We're making chicken tacos."); // Wait a moment and respond with a question.

  });
  socket.on('message', (data) => { // If we get a new message from the client we process it;
    console.log(data);
    questionNum = bot(data, socket, questionNum); // run the bot function with the new message
  });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data, socket, questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

  /// These are the main statments that make up the conversation.
  if (questionNum == 0) {
    answer = 'Are you excited?'; // output response
    waitTime = 2000;
    question = 'How many people will be at this meal?'; // load next question
  } else if (questionNum == 1) {
    NumberOfPeople=parseInt(input)
    answer = 'Really, ' + input + ' people? So that means you need ' + (0.33 * NumberOfPeople) + ' pounds of chicken.'; // output response
    waitTime = 2000;
    question = 'Do you need to buy tortillas?'; // load next question
  } else if (questionNum == 2) {
    if (input.toLowerCase() === 'yes' || input === 1) {
      answer = 'Alright. You need ' + (2 * NumberOfPeople) + ' tortillas.';
      waitTime = 2000;
    }
    if(input.toLowerCase() === 'no' || input === 0) {
       answer = '';
      waitTime = 100;
      }
  
    question = 'Do you need to buy salsa?';
    
  } else if (questionNum == 3) {
    if (input.toLowerCase() === 'yes' || input === 1) {
      answer = 'Cool. You need ' + (2 * NumberOfPeople) + ' tortillas.';
      waitTime = 2000;
    }
    if(input.toLowerCase() === 'no' || input === 0) {
       answer = '';
      waitTime = 100;
     }
    question = 'Do you need to buy salsa?'; //repeat this chunk for each ingredient
    } 
    
    else if (questionNum == 4) {
    if (input.toLowerCase() === 'yes' || input === 1) {
      answer = 'Word. You need ' + (3 * NumberOfPeople) + ' ounces of salsa.';
      waitTime = 2000;
    }
    if(input.toLowerCase() === 'no' || input === 0) {
       answer = '';
      waitTime = 100;
     }
    question = 'Do you need to buy cheese?'; //repeat this chunk for each ingredient
    } 
    
    else if (questionNum == 5) {
    if (input.toLowerCase() === 'yes' || input === 1) {
      answer = 'Awesomesauce. You need ' + (2 * NumberOfPeople) + ' ounces of cheese.';
      waitTime = 2000;
    }
    if(input.toLowerCase() === 'no' || input === 0) {
       answer = '';
      waitTime = 100;
     }
    question = 'Do you need to buy black beans?'; //repeat this chunk for each ingredient
    }
    else if (questionNum == 6) {
    if (input.toLowerCase() === 'yes' || input === 1) {
      answer = 'Dope. You need ' + (2 * NumberOfPeople) + ' ounces of black beans.';
      waitTime = 2000;
    }
    if(input.toLowerCase() === 'no' || input === 0) {
       answer = '';
      waitTime = 100;
     }
    question = 'Do you need to buy lettuce?'; //repeat this chunk for each ingredient
    }  
    
    else if (questionNum == 7) {
    if (input.toLowerCase() === 'yes' || input === 1) {
      answer = 'Groovy. You need ' + (0.4 * NumberOfPeople) + ' heads of lettuce.';
      waitTime = 5000;
    }
    if(input.toLowerCase() === 'no' || input === 0) {
       answer = '';
      waitTime = 100;
     }
    
    }
      
    else if (questionNum == 8) {
    answer = 'You are all set. Enjoy the tacos!'; // output response
    waitTime = 0;
    question = '';
  }
  //{
  /// We take the changed data and distribute it across the required objects.
  socket.emit('answer', answer);
  setTimeout(timedQuestion, waitTime, socket, question);
  return (questionNum + 1);
}
      
function timedQuestion(socket, question) {
  if (question != '') {
    socket.emit('question', question);
  } else {
    //console.log('No Question send!');
  }
}
//----------------------------------------------------------------------------//
