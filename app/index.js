const hostname = process.env.IP;
const port = process.env.PORT;

var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/app'));
app.use(express.static('app'));
app.listen(port, hostname, () =>{
    console.log(`Server running at http://${hostname}:${port}/`);
})
