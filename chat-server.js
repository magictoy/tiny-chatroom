const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

var HashMap = require('hashmap');

// record the client
var userConnectionMap = new HashMap();
var connectNum = 0;

// connection
wss.on('connection', function(ws) {
    connectNum++;
    console.log('A client has connected. current connect num is : ' + connectNum);

    ws.on('message', function(message) {
        var objMessage = JSON.parse(message);
        var strType  = objMessage['type'];

        switch(strType) {
            case 'online' : 
                userConnectionMap.set(objMessage['user'], ws);
                console.log(objMessage['user']+' is online')
                break;
            default:
                var targetConnection = userConnectionMap.get(objMessage['to']);
                if (targetConnection) {
                    targetConnection.send(objMessage['message']);
                }
        }
    });

    ws.on('close', function(message) {
        var objMessage = JSON.parse(message);
        userConnectionMap.remove(objMessage['user']);
    	connectNum--;
    	console.log('A client has connected. current connect num is : ' + connectNum);
    });
});