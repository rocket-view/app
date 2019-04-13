import React from "react";
import Connect from "./Connect";
import MainContainer from "./MainContainer";
import mqtt from "./mqtt";
import "./App.css";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "connected": false
        };
        this.handleConnect = this.handleConnect.bind(this);
    }

    componentDidMount() {
        mqtt.addConnectListener(this.handleConnect);
    }

    componentWillUnmount() {
        mqtt.removeConnectListener(this.handleConnect);
    }

    handleConnect() {
        this.setState({
            "connected": true
        });
    }

    render() {
        return (
            <div className="app">
                {this.state.connected ? <MainContainer /> : <Connect />}
            </div>
        );
    }
}
