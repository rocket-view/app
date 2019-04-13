import _MQTT from "paho.mqtt.js";
const Paho = { "MQTT": _MQTT };

let client;
let connectListeners = [];

let mqtt = {
    "connect": (server, username, password, port, clientId, ssl) => {
        client = new Paho.MQTT.Client(server, port, "/", clientId);
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
    }
};
export default mqtt;
