require('dotenv').config();
const express = require('express');
const cors = require('cors');
const initDB = require('./config/initDB');
const profileRoutes = require("./routes/profiles");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", profileRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'GitHub Profile Analyzer API' });
});

initDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
