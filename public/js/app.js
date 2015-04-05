(function () {
		var github = new Github({
				token: window.githubAccessToken,
				auth: "oauth"
		});

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

		function issuesHandler (err, results, isLastRepo) {
				if (results && results.length > 0) {
						issues.push(results);
				}

				if (isLastRepo) {
						game.data.issues = sortIssues(issues);
						document.dispatchEvent(onIssuesLoaded);
				}
		}

		var sortIssues = function (issues) {
				return issues.sort(function (a, b) {
						return a.length - b.length;
				});
		};

		document.addEventListener('game:over', function () {
				game.data.level = 0;
				game.data.pipeCounter = 0;
		});

		var repos;
		var issues = [];
		github.getRepos().contents(reposHandler);
})();
