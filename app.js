var express = require('express');

var app = express();

var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io')(server);

var currPlayers = {};

var port = process.env.PORT || 6969;

server.listen(port, function() {
    console.log("Server has been started and is listening ");
});

app.use('/public', express.static(__dirname + '/public'));

app.use( bodyParser.json() );  
app.use(bodyParser.urlencoded({     
  extended: true
}));


app.get('/', function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.get('/player_list', function(req, res) {
    res.send(JSON.stringify(currPlayers));
});

io.on('connection', function(socket) {
    
    //when the player entered the game
    socket.on('player_entered', function(p) {
        socket.broadcast.emit('player_entered', p);
        console.log('Player :' + p.name + ' has joined');
        currPlayers[p.name] = p;
    });
    
    //we get the player's changed pos and we tell all the other players about it
    socket.on('player_move', function(p) {
        socket.broadcast.emit('player_move', p);
       // console.log("Player name: " + p.name + " x: " + p.x + " y: " + p.y);
    });
    
    socket.on('player_grow', function(p) {
        socket.broadcast.emit('player_grow', p);
    });
 
});