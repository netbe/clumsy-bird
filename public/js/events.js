var onIssuesLoaded = new Event('issues:loaded');
var onGameOver = new Event('game:over');
var onLevelChanged = new Event('level:changed');

document.addEventListener('game:over', function () {
		game.data.level = 0;
		game.data.pipeCounter = 0;
});

document.addEventListener('level:changed', function () {
		console.info('Level changed');
});
