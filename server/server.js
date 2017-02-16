const express = require('express')
"use-strict";
const bodyParser = require('body-parser');

const http = require('http')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static("public")); 
app.use(express.static("client/dist"));

var count = 0
io.on('connection', (socket) => {
	count++;
	io.emit('news', { msg: 'One more person is online', count: count });
	console.log(count);
	
	socket.on('private', function (data) {
		console.log(data);
	});

	socket.on('disconnect', function() {
		count--;
		io.emit('news', { msg: 'Someone went home', count: count });
	});
});

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/views/index.html');
  // res.send('<p style="color: red">Hello World!' + req.method + '</p>')
})

app.get('/yass', function (req, res) {
  res.send('<p style="color: red">Hello Yass!' + req.method + '</p>' +
	 '<form method="post"><input>Click</input><input type="submit" value="Submit">Click</input></form>')
})

app.post('/yass', function (req, res) {
	console.log("aabsfa" + JSON.stringify(req.body));
})

server.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})