var Player = function(context) {
           
    Player.prototype.x = 0;
    Player.prototype.y = 0;
            
    Player.prototype.width = 30;
    Player.prototype.height = 30;
            
    Player.prototype.draw = function() {
        context.fillStyle = "#00A";
        context.fillRect(this.x, this.y, 50, 50);
    }

};