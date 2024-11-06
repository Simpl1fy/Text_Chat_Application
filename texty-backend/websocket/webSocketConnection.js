const WebSocket = require('ws');

function setUpWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log("Client Connected");

        ws.on('message', (message) => {
            console.log(`Received Message : ${message.toString()}`);
            const msgToSend = JSON.stringify({ text: message.toString() });
            console.log(`Message to send = ${msgToSend}`);
            wss.clients.forEach((client) => {
                if(client.readyState === WebSocket.OPEN) {
                    client.send(msgToSend);
                }
            });
        })

    });

    wss.on('close', () => {
        console.log("Client Disconnected"); 
    });

    return wss;
}

module.exports = setUpWebSocket;