require("dotenv").config();
const pool = require("./config/db");

pool.getConnection().then(conn => {
  console.log("DB Connected.");
  conn.release();
}).catch(err => console.error("DB Error: ", err.message));
const initDB = require("./config/initDB");
initDB();
const express = require("express");
