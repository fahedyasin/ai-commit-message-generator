const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require("@octokit/rest");
const { generateCommitMessage } = require('./ai');

async function run() {
  try {
    const token = process.env.GH_TOKEN//core.getInput('github-token');
    if (!token) {
      console.error("::error::GH_TOKEN is not set!");
      process.exit(1);
    }
    let repoDetails = process.env.GITHUB_REPOSITORY;
    if (repoDetails.includes('github.com')) {
      const parts = repoDetails.split('github.com/')[1]; // Extract after github.com/
      repoDetails = parts || '';
    }
    const [owner, repo] = repoDetails.split('/')
    console.log(`owner: ${owner}. repo: ${repo}`)

    const octokit = new Octokit({ auth: token })

    const commits = await octokit.repos.listCommits({
      owner,
      repo,
      per_page: 1,
    });

    if (!commits.data.length) {
      console.error("::error1::No commits found.");
      return;
    }

    const commitSha = commits.data[0].sha;
    const { data: commitDetails } = await octokit.repos.getCommit({
      owner,
      repo,
      ref: commitSha
    });
    console.log("Commit Details:", commits.data[0].commit.message)

    const diff = commitDetails.files.map(f => `File: ${f.filename}\nChanges:\n${f.patch}`).join("\n\n");
    // console.log("diff:", diff)

    // Generate AI commit message
    const aiCommitMessage = await generateCommitMessage(diff);
    // Output commit message
    core.setOutput('commit-message', aiCommitMessage);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
