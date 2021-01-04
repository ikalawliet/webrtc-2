const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');
// const fs = require('fs')
// const https = require('https')
// const options = {
//   key:fs.readFileSync('server-key.pem'),
//   cert: fs.readFileSync('server-cert.pem')
// }
// const httpsServer = https.createServer(options, app)
// const io = require('socket.io')(httpsServer)

const PORT = 3030;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
});
 
app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room});
});

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log(roomId + " " + userId);
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId);
        });
    });
});

server.listen(PORT, () => {
   console.log(`Server up and running on port: ${PORT}`);
});
// httpsServer.listen(PORT, () => {
//     console.log(`Server up and running on port: ${PORT}`, httpsServer.address().address, httpsServer.address().port);
// });