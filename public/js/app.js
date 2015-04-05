(function () {
		var github = new Github({
				token: window.githubAccessToken,
				auth: "oauth"
		});

		var repos;
		function reposHandler (err, results) {
				repos = results;
				var isLastRepo = false;
				var i = 0;
				repos.forEach(function (repo, index) {
						var username = repo.owner.login;
						var reponame = repo.name;
						var issues = github.getIssues(username, reponame);

						if (index == repos.length - 1) {
								isLastRepo = true;
						}

						(function (isLastRepo) {
								issues.list(null, function (err, results) {
										issuesHandler(err, results, isLastRepo);
								});
						})(isLastRepo);
				});
		}

		var issues = [];
		function issuesHandler (err, results, isLastRepo) {
				if (results && results.length > 0) {
						issues.push(results);
				}

				if (isLastRepo) {
						issues.sort(function (a, b) {
								return a.length - b.length;
						});

						game.data.issues = issues;

						document.dispatchEvent(onIssuesLoaded);
				}
		}

		github.getRepos().contents(reposHandler);
})();

document.addEventListener('game:over', function () {
		game.data.level = 0;
		game.data.pipeCounter = 0;
});

document.addEventListener('level:changed', function () {
		game.data.level++;
		game.data.pipeCounter = 0;

		var color = '#'+Math.floor(Math.random()*16777215).toString(16);
		me.game.world.addChild(new BackgroundLayer('bg', color, 1));
});
