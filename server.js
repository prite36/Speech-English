var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var server = require('http').Server(app)
var io = require('socket.io')(server)
var word = require ('./word')

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('dist'))

io.on('connection', function (socket) {
  socket.on('get', function (data) {
    // socket.emit('get', data)
    // console.log(data)
    console.log('sending room post', data.room);
    socket.emit('yourLevel', {
        message: data.message,
        who: 'me'
    })
    socket.broadcast.to(data.room).emit('rivalLevel', {
        message: data.message,
        who: 'rival'
    })
  })
  socket.on('set', function (data) {
    console.log(data)
  })
  socket.on('subscribe', function(room) {
    console.log('joining room', room);
    socket.join(room);
  })
})

app.set('port', (process.env.PORT || 3000))
server.listen(app.get('port'), function () {
  console.log('Express server listening on port %d in %s mode', this.address().port, app.settings.env)
})
