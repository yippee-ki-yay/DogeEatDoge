var Player = function() {
           
    Player.prototype.x = 0;
    Player.prototype.y = 0;
    
    Player.prototype.name = "Player1";
            
    Player.prototype.width = 30;
    Player.prototype.height = 30;
    
    Player.prototype.color = 'green';
    
    Player.prototype.state = 'inactive';
         
    Player.prototype.toJson = function() {
        var jsonStr = {x: this.x, y: this.y, name: this.name, width: this.width, height: this.height, color: this.color, state: this.state};
        
        return jsonStr;
    }
    
    
    Player.prototype.draw = function(context) {
      context.beginPath();
      context.arc(this.x, this.y, this.width, 0, 2 * Math.PI, false);
      context.fillStyle = this.color;
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = '#003300';
      context.stroke();
    }
    
    Player.prototype.grow = function() {
        if(this.width < 120)
        {
            this.width += 8;   
        }
        
    }
    
 


};