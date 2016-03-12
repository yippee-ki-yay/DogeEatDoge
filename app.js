var express = require('express');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(6969, function() {
    console.log("Server has been started and is listening on port 6969");
});

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

io.on('connection', function(socket) {
    
    //when the player entered the game
    socket.on('player_entered', function(p) {
        io.sockets.emit('player_entered', p);
        console.log('Player :' + p.name + ' has joined');
    });
    
    //we get the player's changed pos and we tell all the other players about it
    socket.on('player_move', function(p) {
        socket.broadcast.emit(p);
    });
 
});