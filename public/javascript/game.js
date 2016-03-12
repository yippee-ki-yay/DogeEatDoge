$(document).ready(function() {
   
    var Game = (function() {
        
        var canvas = $("#game_canvas")[0];
        var context = canvas.getContext('2d');
        var CANVAS_WIDTH = 1100;
        var CANVAS_HEIGHT = 500;
        
        var playerList = [];
        
        (function main() {
            
          var FPS = 10;
            
          var p = new Player(context);  
          p.draw();
        
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
            playerList.forEach(function() {
                
            });
           
        }
    
    })();
});