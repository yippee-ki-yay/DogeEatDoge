var Player = function(context) {
           
    Player.prototype.x = 0;
    Player.prototype.y = 0;
    
    Player.prototype.name = "Player1";
            
    Player.prototype.width = 30;
    Player.prototype.height = 30;
         
    Player.prototype.toJson = function() {
        var jsonStr = {x: this.x, y: this.y, name: this.name, width: this.width, height: this.height};
        
        return jsonStr;
    }
    
    
    Player.prototype.draw = function() {
        context.fillStyle = "#00A";
        context.fillRect(this.x, this.y, 50, 50);
    }
    
    Player.prototype.setX = function(x) {
        this.x = x;
    }
    
     Player.prototype.setY = function(y) {
        this.y = y;
    }
    
      Player.prototype.setName = function(name) {
        this.name = name;
    }
    
      Player.prototype.setWidth = function(width) {
        this.width = width;
    }
    
      Player.prototype.setHeight = function(height) {
        this.height = height;
    }

};