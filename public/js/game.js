var game = {
    data: {
        score : 0,
        steps: 0,
        start: false,
        newHiScore: false,
        muted: false,
				issues: null,
				level: 0,
				pipeCounter: 0
    },

    "onload": function() {
        if (!me.video.init("screen", me.video.CANVAS, 900, 600, true, 'auto')) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }
        me.audio.init("mp3,ogg");

        me.loader.onload = this.loaded.bind(this);
        me.loader.preload(game.resources);
        me.state.change(me.state.LOADING);
    },

    "loaded": function() {
				document.addEventListener('issues:loaded', function () {
						me.state.set(me.state.MENU, new game.TitleScreen());
						me.state.set(me.state.PLAY, new game.PlayScreen());
						me.state.set(me.state.GAME_OVER, new game.GameOverScreen());

						me.input.bindKey(me.input.KEY.SPACE, "fly", true);
						me.input.bindKey(me.input.KEY.M, "mute", true);
						me.input.bindPointer(me.input.KEY.SPACE);

						me.pool.register("clumsy", BirdEntity);
						me.pool.register("pipe", PipeEntity, true);
						me.pool.register("hit", HitEntity, true);
						me.pool.register("ground", Ground, true);

						// in melonJS 1.0.0, viewport size is set to Infinity by default
						me.game.viewport.setBounds(0, 0, 900, 600);
						me.state.change(me.state.MENU);
				}, false);
    }
};
