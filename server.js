const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');
const sshConnection = require('ssh2');
var connectionReady = false;

app.use(express.static((__dirname + '/css')));
app.use(express.static((__dirname + '/js')));
app.use(express.static((__dirname + '/html')));
app.use(express.static((__dirname + '/node_modules/codemirror')));

app.post('/', function (req, res) {
    res.send(res.data);
//  console.log(res);
});

let server = app.listen(3000, () => {
    console.log('port open on: ' + server.address().port);
});

var io = socket(server);

io.on('connection', (socket) => {
    console.log('Connected with id: ', socket.id);
    sshCon = new sshConnection();
    sshCon.connect({
        host: '192.168.56.101',
        port: 22,
        username: 'sejiko',
        password: 'Admin123#'
                //  privateKey: require('fs').readFileSync('/here/is/my/key')
    });
    sshCon.on('ready', function () {
        connectionReady = true;
        sshCon.shell(function (err, stream) {
            if (err) {
                console.log(err);
            }
            
            stream.setEncoding('UTF-8');
            socket.on('ssh', (data) => {
                stream.stdout.write(data.msg.code + '\n');

                stream.on('data', function (data) {
                    socket.emit('ssh-sc', data);
                });

            });
        });
    });
});