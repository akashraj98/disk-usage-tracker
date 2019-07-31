const express = require('express');
const bodyParser = require('body-parser');
const sql = require('sqlite3').verbose()
const request = require('request');
const spawn = require("child_process").spawn;
const pythonProcess = spawn('python',["./thon.py",]);

const app = express();
app.use(bodyParser.json()) // for parsing application/json

// var data = pythonProcess.stdout.on('data');
// function sf (data) => {
//     var output = data;
// }
function run() {
    var spawn = require('child_process').spawn;
    var result = '';
    pythonProcess.stdout.on('data', function(data) {
         result = data;
         console.log(result)
         return result;
    });
}

run();


app.post('/',async (req,res)=>{
    try {
        
    } catch (error) {
        console.error('ERROR:');
        console.error(error);
    }
    });
app.get('/',(req,res)=>{
     const user={
        //  "url":"www.google.com",
         "text":"hi there"
     };
     res.send(user)
 })


app.listen(5069);
console.log("listening on port 5069")
