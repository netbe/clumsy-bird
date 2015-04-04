(function () {
	var github = new Github({
	  token: window.githubAccessToken,
	  auth: "oauth"
	});

	var repos;
	function reposHandler (err, results) {
		repos = results;
		var i = 0;
		repos.forEach(function (repo) {
			var username = repo.owner.login;
			var reponame = repo.name;
			var issues = github.getIssues(username, reponame);
			issues.list(null, issuesHandler);
		});
	}

	var issues = [];
	function issuesHandler (err, results) {
		if (results && results.length > 0) {
			issues.push(results);
		}

		issues.sort(function (a, b) {
			return a.length - b.length;
		});
	}

	github.getRepos().contents(reposHandler);
})();