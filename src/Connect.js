import React from "react";
import mqtt from "./mqtt";
import "./Connect.css";

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

export default class Connect extends React.Component {
    constructor(props) {
        super(props);
        let client = "rocketui";
        while (client.length < 23) {
            client += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }
        this.state = {
            "server": "localhost",
            "username": "",
            "password": "",
            "port": 9001,
            "client": client,
            "ssl": false
        };
        this.handleServerChange = this.handleServerChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePortChange = this.handlePortChange.bind(this);
        this.handleClientChange = this.handleClientChange.bind(this);
        this.handleSslChange = this.handleSslChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleServerChange(ev) {
        this.setState({
            "server": ev.target.value
        });
    }

    handleUsernameChange(ev) {
        this.setState({
            "username": ev.target.value
        });
    }

    handlePasswordChange(ev) {
        this.setState({
            "password": ev.target.value
        });
    }

    handlePortChange(ev) {
        this.setState({
            "port": ev.target.value
        });
    }

    handleClientChange(ev) {
        this.setState({
            "client": ev.target.value
        });
    }

    handleSslChange(ev) {
        this.setState({
            "ssl": ev.target.checked
        });
    }

    handleSubmit(ev) {
        ev.preventDefault();
        if (ev.target.form.checkValidity()) {
            mqtt.connect(this.state.server, this.state.username, this.state.password, parseInt(this.state.port), this.state.client, this.state.ssl);
        }
    }

    render() {
        return (
            <div className="connect">
                <div className="padding" />
                <div>
                    <div className="padding" />
                    <form action="#" onSubmit={this.handleSubmit}>
                        <div className="input-group">
                            <h1>Connect to Rocket</h1>
                        </div>
                        <div className="input-group">
                            <label htmlFor="server">Server:</label>
                            <input name="server" type="text" required value={this.state.server} onChange={this.handleServerChange} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="username">Username:</label>
                            <input name="username" type="text" value={this.state.username} onChange={this.handleUsernameChange} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password:</label>
                            <input name="password" type="password" value={this.state.password} onChange={this.handlePasswordChange} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="port">Port:</label>
                            <input name="port" type="number" min="1" max="65535" required value={this.state.port} onChange={this.handlePortChange} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="client">Client ID:</label>
                            <input name="client" type="text" minLength="1" maxLength="23" required value={this.state.client} onChange={this.handleClientChange} />
                        </div>
                        <div className="input-group checkbox">
                            <input name="ssl" type="checkbox" checked={this.state.ssl} onChange={this.handleSslChange} />
                            <label htmlFor="ssl">Use SSL</label>
                        </div>
                        <div className="input-group">
                            <button className="right" type="submit" onClick={this.handleSubmit}>Connect</button>
                        </div>
                    </form>
                    <div className="padding" />
                </div>
                <div className="padding" />
            </div>
        );
    }
}
