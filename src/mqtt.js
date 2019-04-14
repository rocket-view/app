import _MQTT from "paho.mqtt.js";
const Paho = { "MQTT": _MQTT };

let client;
let connectListeners = [];
let subscriptions = {};

let mqtt = {
    "connect": (server, username, password, port, clientId, ssl) => {
        client = new Paho.MQTT.Client(server, port, "/", clientId);
        client.onMessageArrived = msg => {
            if (subscriptions[msg.destinationName]) {
                subscriptions[msg.destinationName].forEach(callback => {
                    callback(msg.payloadString, msg.destinationName);
                });
            }
        };
        client.connect({
            "timeout": 10,
            "userName": username,
            "password": password,
            "cleanSession": true,
            "useSSL": ssl,
            "onSuccess": () => {
                connectListeners.forEach(func => {
                    func();
                });
            },
            "onFailure": (e) => {
                alert(`Error code ${e.errorCode}: ${e.errorMessage}`);
            }
        });
    },
    "addConnectListener": func => {
        connectListeners.push(func);
    },
    "removeConnectListener": func => {
        let idx = connectListeners.indexOf(func);
        if (idx >= 0) {
            connectListeners.splice(idx, 1);
        }
    },
    "subscribe": (topic, func) => {
        if (subscriptions[topic]) {
            subscriptions[topic].push(func);
        } else {
            subscriptions[topic] = [ func ];
            client.subscribe(topic, {});
        }
    },
    "unsubscribe": (topic, func) => {
        if (subscriptions[topic]) {
            let idx = subscriptions[topic].indexOf(func);
            if (idx >= 0) {
                subscriptions[topic].splice(idx, 1);
                if (subscriptions[topic].length === 0) {
                    delete subscriptions[topic];
                    client.unsubscribe(topic, {});
                }
            }
        }
    }
};
export default mqtt;
