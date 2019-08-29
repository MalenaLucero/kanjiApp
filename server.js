const express = require('express')
const server = express()
const port = 3000

server.get('/', (req, res) =>{
    //res.send('hola')
    res.json({"data":"sarasa"})
})

server.listen(port,()=>{
    console.log('Example app listening con port 3000')
})