const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose()
const request = require('request');

let db = new sqlite3.Database('./sample.db');
// db.run('CREATE TABLE disklog(HOSTNAME TEXT ,MOUNTPOINT TEXT,TOTALSIZE TEXT,USED TEXT,AVAIL TEXT,PERCENTAGEUSED TEXT)');

const app = express();
app.use(bodyParser.json()) // for parsing application/json

app.post('/post',(req,res)=>{
    try {
        db.run('INSERT INTO disklog(HOSTNAME,MOUNTPOINT,TOTALSIZE,USED,AVAIL,PERCENTAGEUSED) VALUES((?),(?),(?),(?),(?),(?))',
        req.body.hostname, req.body.mountpoint,req.body.totalsize,req.body.used,req.body.avail,req.body.percentageused,
        function(err) {
            if (err) { return console.log(err.message)}});
        
        console.log(req.body)
        res.send("done")
    }catch (error) {
        console.error('ERROR:');
        db.close()
        console.log(db)
        // console.error(error);
        res.send(error)
    }
    });
app.get('/',(req,res)=>{
    const user={
        //  "url":"www.google.com",
         "text":"hi there"
    };
     
    let sql = 'SELECT * FROM disklog';
    db.all(sql, [], (err, rows) => {
    if (err) {
    throw err;
    }
    rows.forEach((row) => {
    console.log(row);
    });
    });
     res.send(user)
 })


app.listen(5047);
console.log("listening on port 5047")
