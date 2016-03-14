$(document).ready(function() {
   
    var Setup = (function() {
        
        //set modal unclosable
        $('#login_modal').modal({
          backdrop: 'static',
          keyboard: false
        });
        
        // document.body.style.cursor = 'none';
        
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
                     player.color = p.color;
                     player.state = p.state;

                     playerList[p.name] = player;
                });

                Game(playerList, nickname);
            });
        }      
        
    })();
    
    
    var Game = function(playerList, nickname) {
        
        var canvas = $("#game_canvas")[0];
        var context = canvas.getContext('2d');
        var CANVAS_WIDTH = window.innerWidth;
        var CANVAS_HEIGHT = window.innerHeight;
        
        
        var currPlayer = new Player(); 
        
         currPlayer.x = (CANVAS_WIDTH*Math.random()|0);
         currPlayer.y = (CANVAS_HEIGHT*Math.random()|0);
        
        currPlayer.color = getRndColor();
        currPlayer.state = 'inactive';
  
        currPlayer.name = nickname;
                
        var mouseX = currPlayer.x;
        var mouseY = currPlayer.y;
        
       // var bots = BotPlayers(playerList);
        
        var socket = io.connect();
        
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
             player.color = p.color;
             player.state = p.state;
             
             playerList[p.name] = player;
        });
        
        socket.on("player_move", function(p) {
            var playerPos = p;
            
            playerList[p.name].x = p.x;
            playerList[p.name].y = p.y;
        });
        
        socket.on("player_grow", function(p) {
            playerList[p.name].grow();
        });
        
        
        (function main() {
            
          var FPS = 15;
            
          setTimeout(function() {
              currPlayer.state = 'active';
          }, 3000);
            
          playerList[currPlayer.name] = currPlayer;
        
          setInterval(function() {
              update();
              draw();
              
          }, 1000/FPS);
            
        })();
        
        function update()
        {
            //0.5 should be spped
            //make the player follow the mouse
            
            var speed = 5.0;
            
            //bots.move();
            
            if(currPlayer.x > mouseX) {
                currPlayer.x -= speed;
            }
             if(currPlayer.x < mouseX) {
                currPlayer.x += speed;
            }   
             if(currPlayer.y > mouseY) {
                currPlayer.y -= speed;
            }
             if(currPlayer.y < mouseY) {
                currPlayer.y += speed;
            }
            
            //collision detection for all the players
            $.each(playerList, function(i, p1) {
                
                $.each(playerList, function(i, p2) {
                    
                    if(p2.name !== p1.name && p1.state === 'active' && p2.state === 'active')
                    if(circleCollision(p1, p2) === true) {
                       
                       if(p1.width > p2.width) 
                       {
                            p1.grow();
                            p2.state = 'dead';
                           // delete playerList[p2.name];
                           socket.emit("player_grow", {name: p1.name});
                        }
                        else
                        {
                            p2.grow();
                            p1.state = 'dead';
                             socket.emit("player_grow", {name: p2.name});
                           // delete playerList[p1.name]
                        }
                       }
                })
            });
        }
        
        function draw()
        {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            context.setTransform(1,0,0,1,0,0)
            
            context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            
          //  var camX = clamp(-currPlayer.x + canvas.width/2, 2000, 2000000 - canvas.width);
           // var camY = clamp(-currPlayer.y + canvas.height/2, 2000, 2000000 - canvas.height);

            var camX = currPlayer.x + 1;
            var camY = currPlayer.y + 1;
            
           //  context.translate( camX, camY ); 
            
            //draw each player in the game
            $.each(playerList, function(i, p) {
                p.draw(context);
            });
           
        }
        
        //listen for mouse move event to move our player to that position
        canvas.addEventListener("mousemove", function(e) {
            mouseX = getMousePos(canvas, e).x;
            mouseY = getMousePos(canvas, e).y;
            
            
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
        
        function circleCollision(p1, p2) {
            
            if(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2) <= Math.pow((p1.width + p2.width), 2))
                {
                    return true;
                }
            
            return false;
        }
        
        
    };
    
    
    var BotPlayers = function(playerList) {
        
        var BOT_NUMBERS = 40;
        var botList = [];
        
        (function createRandomPlayers() {
            for(var i = 0; i < BOT_NUMBERS; ++i) {
                var currPlayer = botPlayer();
                
                playerList[currPlayer.name] = currPlayer;
                botList.push(currPlayer);
            }
        })();
        
        function botPlayer() {
            var p = new Player();
            p.name = "Bot"+ (1000*Math.random()|0).toString();
            p.x = (1000*Math.random()|0);
            p.y = (800*Math.random()|0);
            p.width = 10;
            p.color = getRndColor();
            p.state = 'active';
            
            return p;
            
        }
        
        BotPlayers.prototype.move = function() {
            $.each(botList, function(i, v) {
                v.x += 1;
            });
        }
        
    }
});