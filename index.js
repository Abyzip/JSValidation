// EXERCICE 2.1 a décommenter pour test et commenter le require
/*
const app = require("./is-ready")
app.run
*/

// EXERCICE 2.2
/*
const app = require('./is-ready-test')

app.run()

*/

// EXERCICE 2.3
/*
const app = require('./are-ready')

app.run()
*/


// EXERCICE 4

const { exec } = require('child_process');
exec( "node juggler.js -p 5000" , (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
});

exec( "node juggler.js -p 8000" )

