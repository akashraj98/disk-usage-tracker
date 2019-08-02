const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose()
const request = require('request');

const sqliteJson = require('sqlite-json');
let db = new sqlite3.Database('./log.db');
const exporter = sqliteJson(db);
const table = "disklog";
db.run('CREATE TABLE IF NOT EXISTS '+table+'(HOSTNAME TEXT ,MOUNTPOINT TEXT,TOTALSIZE TEXT,USED TEXT,AVAIL TEXT,PERCENTAGEUSED TEXT);');
db.get("SELECT * FROM disklog LIMIT 2;", function(error, row) {
    if (row !== undefined) {
        console.log("table exists. cleaning existing records");
        db.run("DELETE FROM disklog", function(error) {
            if (error)
                console.log(error);
        });
    }
});
const app = express();
app.use(bodyParser.json()) // for parsing application/json

app.post('/post',(req,res)=>{
    try {

        db.run("INSERT INTO disklog(HOSTNAME,MOUNTPOINT,TOTALSIZE,USED,AVAIL,PERCENTAGEUSED) SELECT(?),(?),(?),(?),(?),(?) WHERE NOT EXISTS(SELECT * FROM disklog  WHERE HOSTNAME=(?));",
        req.body.hostname, req.body.mountPoint,req.body.totalsize,req.body.used,req.body.avail,req.body.percentageused,req.body.hostname);
        res.send("data recieved")
    }catch (error) {    
        console.error('ERROR:');
        db.close()
        console.log(db)
        // console.error(error);
        res.send(error)
    }
    });

app.get('/get',(req,res)=>{

    exporter.json('select * FROM disklog;', function (err, json) {
        console.log(json)
        res.send(json)
        db.run("DELETE FROM disklog;", function(error) {
            if (error)
                console.log(error);
        });
      });
 });

app.get('/',(req,res)=>{
    var sendit = "An overexcited response"
    res.send(sendit)
});
//  sample post request3
//  {
// 	"hostname": "master-Inspiron",
// 	"mountPoint": "/user/bin", 
// 	"totalsize": "31G", 
// 	"used": "16G", 
// 	"avail": "14G", 
// 	"percentageused": "53%"
	
// }



app.listen(8080);
console.log("running on port 8080");