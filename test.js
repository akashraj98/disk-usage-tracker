const spawn = require("child_process").spawn;
const pythonProcess = spawn('python',["./thon.py",]);


function run() {
    var result = '';
    pythonProcess.stdout.on('data', function(data) {
         result = data;
         console.log(result)
         return result;
    });
}

var newd =  run()
console.log(newd)