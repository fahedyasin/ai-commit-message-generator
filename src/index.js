const core = require('@actions/core');
const github = require('@actions/github');
const { generateCommitMessage } = require('./ai');

async function run() {
  try {
    const token = core.getInput('github-token');
    const octokit = github.getOctokit(token);

    // Get latest commit diff
    const { data: commits } = await octokit.rest.repos.listCommits({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      per_page: 1
    });

    const commitSha = commits[0].sha;
    const { data: commitDetails } = await octokit.rest.repos.getCommit({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      ref: commitSha
    });

    const diff = commitDetails.files.map(f => `File: ${f.filename}\nChanges:\n${f.patch}`).join("\n\n");

    // Generate AI commit message
    const aiCommitMessage = await generateCommitMessage(diff);

    // Output commit message
    core.setOutput('commit-message', aiCommitMessage);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
