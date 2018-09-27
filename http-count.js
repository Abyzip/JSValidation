const express = require("express")
const http = require("http")
const app = express()
const fs = require("fs")

let current = 0
let port = null

function checkArgs() {
    let args = process.argv
    if( ( args[2] === "-p" || args[2] === "PORT") &&
        ( args[3] % 1 === 0 && args[3] > 1024 ) ){
        port = args[3]
        return true
    }
    return false
}


const logger = function(req, res, next) {
    current++

    fs.readFile('mycounter.json', 'utf8', function(err, contents) {

        if( err && err.code !== "ENOENT" && err.code  ){
            throw "error in fs.readFile"
        } else {
            let obj = {
                ports: []
            }

            if(contents !== "" && contents !== undefined){
                obj = JSON.parse(contents);
            }

            let test = false
            for( let i = 0 ; i < obj.ports.length ; i++){
                if ( obj.ports[i].port === port ){
                    obj.ports[i].count ++
                    test = true
                }
            }
            if(!test){
                obj.ports.push({ port :port, count: 1});
            }
            writePort(err, obj)

        }
    })

    next(); // Passing the request to the next handler in the stack.
}

function writePort(err, obj){
    let json = JSON.stringify(obj);
    fs.writeFile('mycounter.json', json, 'utf8', function(err) {
        if(err){
            throw "error in fs.writeFile"
        }
    })
}


const args = process.argv
if( checkArgs() ) {
    http.createServer(app).listen(args[3], () => {
        console.log(`Listening on port  ${args[3]}`)
    })

    app.use(logger)
} else {
    throw new Error("Server failed to start")
}

app.get("/", (req, res) => {
    res.send("hello world !")
})