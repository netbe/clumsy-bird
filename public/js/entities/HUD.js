game.HUD = game.HUD || {};

game.HUD.Container = me.Container.extend({
    init: function() {
        // call the constructor
        this._super(me.Container, 'init');
        // persistent across level change
        this.isPersistent = true;

        // non collidable
        this.collidable = false;

        // make sure our object is always draw first
        this.z = Infinity;

        // give a name
        this.name = "HUD";

        // add our child score object at the top left corner
        this.addChild(new game.HUD.ScoreItem(5, 5));
    }
});


/**
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend({
    /**
     * constructor
     */
    init: function(x, y) {
        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, "init", [x, y, 10, 10]);

        // local copy of the global score
        this.stepsFont = new me.Font('gamefont', 80, '#000', 'center');

        // make sure we use screen coordinates
        this.floating = true;
    },

    draw: function (renderer) {
        var context = renderer.getContext();
        if (game.data.start && me.state.isCurrent(me.state.PLAY))
            this.stepsFont.draw(context, game.data.steps, me.video.renderer.getWidth()/2, 10);
    }

});

var BackgroundLayer = me.ColorLayer.extend({
    init: function(name, color, z) {
        width = 900;
        height = 600;

        this._super(me.ColorLayer, 'init', [name, color, z]);
    },

    update: function() {
        if (me.input.isKeyPressed('mute')) {
            game.data.muted = !game.data.muted;
            if (game.data.muted) {
                me.audio.disable();
            } else {
                me.audio.enable();
            }
        }

				var changeBackgroundColor = function () {
						var color = '#'+Math.floor(Math.random()*16777216).toString(16);
						this.color = color;
						document.body.style.backgroundColor = color;
				}.bind(this);

				if (game.data.levelChanged) {
						changeBackgroundColor();
						game.data.levelChanged = false;
				}
				
        return true;
    }
});
