const express = require("express")
const http = require("http")
const app = express()
const fs = require("fs")
const bodyParser = require("body-parser");

let current = 0
let alltime = null
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

function readAllTimeCounter(callback){
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
                    alltime = obj.ports[i].count

                    test = true
                }
                console.log("All time counter on port " + obj.ports[i].port +" => " +obj.ports[i].count)
            }
            if(!test){
                obj.ports.push({ port :port, count: 1});
            }
            writePort(err, obj)

        }

        if(callback){
            callback()
        }
    })

}

const logger = function(req, res, next) {

    current++
    console.log("current counter : " + current)

    readAllTimeCounter(next)

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
        readAllTimeCounter()
    })

    //app.use(logger)
    app.use(express.static(__dirname + '/public'), logger);
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.set('view engine', 'ejs');
} else {
    throw new Error("Server failed to start")
}


function reset( resetCurrent, resetAlltime ){

    if(resetCurrent){
        current = 0
    }
    if(resetAlltime) {

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
                        obj.ports[i].count = 0
                        alltime = obj.ports[i].count
                        test = true
                    }
                    console.log("All time counter on port " + obj.ports[i].port +" => " +obj.ports[i].count)
                }
                if(!test){
                    obj.ports.push( { port :port, count: 0} );
                }

                writePort(err, obj)

            }
        })
    }
}

app.get("/", (req, res) => {
    res.render(__dirname +"/index", {current : current, alltime: alltime})
})

app.post('/reset', (req, res)=>{
    const body = req.body

    resetAlltime = (body.alltime == "on")
    resetCurrent = (body.current == "on")
    reset( resetCurrent, resetAlltime )
    res.send("merci <br><a href='/'>Retour</a>" )
})

app.get("/getJSON", (req, res) => {
    res.send("<br><a href='/'>Retour</a><br>" + JSON.stringify({current : current, alltime: alltime}) )
})