$(document).ready(function() {
   
    var Game = (function() {
        
        var canvas = $("#game_canvas")[0];
        var context = canvas.getContext('2d');
        var CANVAS_WIDTH = 1100;
        var CANVAS_HEIGHT = 500;
        
        var playerList = {};
        
        var currPlayer = new Player(context); 
        currPlayer.setName(Math.random().toString()); //just for testing giving random names
        
        var socket = io.connect('http://localhost:6969');
        
        socket.emit('player_entered', currPlayer.toJson());
        
         socket.on("player_entered", function(p) {
             var player = new Player(context);
             player.setX(p.x);
             player.setY(p.y);
             player.setName(p.name);
             player.setWidth(p.width);
             player.setHeight(p.height);
             
             playerList[p.name] = player;
        });
        
        socket.on("player_move", function() {
            
        });
        
        
        (function main() {
            
          var FPS = 15;

          playerList[currPlayer.name] = currPlayer;
        
          setInterval(function() {
              update();
              draw();
              
          }, 1000/FPS);
            
        })();
        
        function update()
        {
            
        }
        
        function draw()
        {
            context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            
            //draw each player in the game
            $.each(playerList, function(i, p) {
                p.draw();
            });
           
        }
        
        //listen for mouse move event to move our player to that position
        canvas.addEventListener("mousemove", function(e) {
            currPlayer.setX(getMousePos(canvas, e).x);
            currPlayer.setY(getMousePos(canvas, e).y);
            
            updatePlayerPos(currPlayer.x, currPlayer.y);
            
        }, false);
        
        
        function updatePlayerPos(x, y)
        {
         //   socket.emit('player_pos', {name: currPlayer.name, x: x, y: y});
        }
    
        //helper function to extract mouse pos from canvas    
        function getMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            
            return {
              x: evt.clientX - rect.left,
              y: evt.clientY - rect.top
            };
      }
    })();
});