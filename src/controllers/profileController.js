const pool = require('../config/db');
const { fetchUser, fetchRepos } = require('../utils/github');

const analyzeProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const [user, repos] = await Promise.all([
      fetchUser(username),
      fetchRepos(username)
    ]);

    // compute insights from repos
    const languages = {};
    let total_stars = 0;
    let total_forks = 0;

    for(const repo of repos) {
      if(repo.fork) continue;
      total_stars += repo.stargazers_count;
      total_forks += repo.forks_count;
      if(repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    }

    const top_repos = repos
      .filter(repo => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map(repo => ({ name: repo.name, stars: repo.stargazers_count, language: repo.language }));

    // upsert profile
    const [upsert] = await pool.query(
      `INSERT INTO profiles
        (github_id, username, name, bio, location, avatar_url, github_url, followers, following, public_repos, created_at_github)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        name=VALUES(name), bio=VALUES(bio), location=VALUES(location),
        followers=VALUES(followers), following=VALUES(following),
        public_repos=VALUES(public_repos), analyzed_at=CURRENT_TIMESTAMP`,
      [
        user.id, user.login, user.name, user.bio, user.location,
        user.avatar_url, user.html_url, user.followers, user.following,
        user.public_repos, new Date(user.created_at)
      ]
    )

    // get profile id
    let profileId = upsert.insertId;
    if(!profileId) {
      const [[row]] = await pool.query('SELECT id FROM profiles WHERE github_id = ?', [user.id]);
      profileId = row.id;
    }

    // insert new insight
    await pool.query(
      `INSERT INTO insights (profile_id, total_stars, total_forks, languages, top_repos)
       VALUES (?, ?, ?, ?, ?)`,
      [profileId, total_stars, total_forks, JSON.stringify(languages), JSON.stringify(top_repos)]
    );

    res.json({ success: true, message: `${username} analyzed`, data: { user, insights: { total_stars, total_forks, languages, top_repos }}});
  } catch(err) {
    if(err.response?.status === 404) {
      return res.status(404).json({ success: false, message: 'GitHub user not found' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
}

const getAllProfiles = async (req, res) => {
  try {
    const [profiles] = await pool.query(
      `SELECT p.*, i.total_stars, i.total_forks, i.languages, i.top_repos, i.recorded_at
       FROM profiles p
       LEFT JOIN insights i ON i.id = (
         SELECT id FROM insights WHERE profile_id = p.id ORDER BY recorded_at DESC LIMIT 1
       )
       ORDER BY p.analyzed_at DESC`
    );
    res.json({ success: true, data: profiles });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

const getProfile = async (req, res) => {
  try {
    const [[profile]] = await pool.query(
      'SELECT * FROM profiles WHERE username = ?', [req.params.username]
    );
    if(!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    const [insights] = await pool.query(
      'SELECT * FROM insights WHERE profile_id = ? ORDER BY recorded_at DESC', [profile.id]
    );
    res.json({ success: true, data: { profile, insights } });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { analyzeProfile, getAllProfiles, getProfile };
