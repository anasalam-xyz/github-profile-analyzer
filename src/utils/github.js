require("dotenv").config();
const axios = require("axios");

const github = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    })
  }
});

const fetchUser = async (username) => {
  const { data } = await github.get(`/users/${username}`);
  return data;
}

const fetchRepos = async (username) => {
  const { data } = await github.get(`users/${username}/repos`, {
    params: {
      per_page: 100,
      sort: "updated",
    }
  });

  return data;
}

module.exports = { fetchUser, fetchRepos };
