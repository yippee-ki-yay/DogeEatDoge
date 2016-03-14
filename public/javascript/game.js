$(document).ready(function() {
   
    var Setup = (function() {
        
        //set modal unclosable
        $('#login_modal').modal({
          backdrop: 'static',
          keyboard: false
        });
        
        //Open the login modal
        $("#login_modal").modal('show');
              
        $("#submit_nickname").click(function() {
           var nickname = $("#nickname").val();
            
           if(nickname !== '' || nickname === undefined) {
               $("#login_modal").modal('hide');
               startGame(nickname);    
            }
            
        });
        
        
        function startGame(nickname) {
            //Load current players in the game
            $.ajax(
            {
                method: "GET",
                url: "player_list"
            }).done(function(playerData) {

                var playerList = {};

                //json to object in the list
                $.each(JSON.parse(playerData), function(i, p) {
                     var player = new Player();
                     player.x = p.x;
                     player.y = p.y;
                     player.name = p.name;
                     player.width = p.width;
                     player.height = p.height;

                     playerList[p.name] = player;
                });

                Game(playerList, nickname);
            });
        }      
        
    })();
    
    
    var Game = function(playerList, nickname) {
        
        var canvas = $("#game_canvas")[0];
        var context = canvas.getContext('2d');
        var CANVAS_WIDTH = 1100;
        var CANVAS_HEIGHT = 500;
        
        
        var currPlayer = new Player(); 
  
        currPlayer.name = nickname;
                
        var socket = io.connect('http://localhost:6969');
        
        //emit that we entered the game to other players
         socket.emit('player_entered', currPlayer.toJson());
        
         //is called when another player has just joined the game
         socket.on("player_entered", function(p) {
             var player = new Player();
             player.x = p.x;
             player.y = p.y;
             player.name = p.name;
             player.width = p.width;
             player.height = p.height;
             
             playerList[p.name] = player;
        });
        
        socket.on("player_move", function(p) {
            var playerPos = p;
            
            playerList[p.name].x = p.x;
            playerList[p.name].y = p.y;
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
                p.draw(context);
            });
           
        }
        
        //listen for mouse move event to move our player to that position
        canvas.addEventListener("mousemove", function(e) {
            currPlayer.x = getMousePos(canvas, e).x;
            currPlayer.y = getMousePos(canvas, e).y;
            
            updatePlayerPos(currPlayer.x, currPlayer.y);
            
        }, false);
        
        
        function updatePlayerPos(x, y)
        {
            socket.emit('player_move', {name: currPlayer.name, x: x, y: y});
        }
    
        //helper function to extract mouse pos from canvas    
        function getMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            
            return {
              x: evt.clientX - rect.left,
              y: evt.clientY - rect.top
            };
      }
    };
});