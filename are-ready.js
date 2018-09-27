/* EXERCICE 2.3 */
const fs = require('fs')
const checkModules = require('./is-ready')

const promiseModules = checkModules.promiseCheck()

function checkReadmePromise(){
    let promise = new Promise(function(resolve, reject) {
        fs.exists(__dirname + '/README.md', (exists) => {
            if (exists) {
                resolve({"README" : true } )
            } else if( !exists ) {
                resolve({"README" : false} )
            } else {
                reject(new Error("Some shit happends"))
            }
        });
    });

    return promise;
}

function app() {
    Promise.all([checkReadmePromise(), promiseModules]).then((value) => {
        console.log(value);
    })
}

exports.run = app

