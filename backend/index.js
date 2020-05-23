const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const app = express();
let db = new sqlite3.Database("./config/db.db");

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "../app/public/")));

// An api endpoint that returns all stockData
app.get("/api/getAllStockData", async (req, res) => {
  const sql = `SELECT * FROM stockData`;

  db.all(sql, [], async (err, rows) => {
    if (err) {
      throw err;
    } else {
      var returnArr = new Array();

      for (const r of rows) {
        returnArr.push(r);
      }

      res.json(returnArr);
    }
  });
});

// An api endpoint that inserts a new entry into stockData
app.get("/api/addNewStockData", async (req, res) => {
  const sql = `INSERT INTO stockData(exchange,stockTicker) VALUES(?,?)`;

  db.all(sql, ["SES", "C61U"], async (err, rows) => {
    if (err) {
      return console.log(err.message);
    } else {
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    }
  });
});

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "../app/public/"));
});

const port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log("Application Started at: " + port);
});
