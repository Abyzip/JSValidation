const fs = require("fs")



function app() {
    checkFolder()
}

/* EXERCICE 2.1 (Require is-ready.js  dans app.run() de index.js ) */

function checkFolder(){
    fs.exists(__dirname + '/node_modules/', (exists) => {
        if (exists) {
            console.log("\033[93mmaybe")
            process.exit(0)
        } else {
            console.log("\033[31mNot ready")
            process.exit(255)
        }
    })
}


exports.run = app


/* EXERCICE 2.2 */

function checkFolderPromise(){
    let promise = new Promise(function(resolve, reject) {
        fs.exists(__dirname + '/node_modules/', (exists) => {
            if (exists) {
                resolve({"MODULES": true})
            } else if( !exists ) {
                resolve({"MODULES" : false})
            } else {
                reject(new Error("Some shit happends"))
            }
        });
    });

    return promise;
}



exports.promiseCheck = checkFolderPromise