import React from "react";
import PropTypes from "prop-types";
import mqtt from "../mqtt";
import DataView from "./DataView";
import ContextMenu from "../ContextMenu";
import "./Label.css";

export default class Label extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "data": {},
            "format": [],
            "text": "",
            "ctxEv": {},
            "edit": false,
            "editText": ""
        };
        this.handlePublish = this.handlePublish.bind(this);
        this.handleContextMenu = this.handleContextMenu.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleFinishEdit = this.handleFinishEdit.bind(this);
        this.handleEditChange = this.handleEditChange.bind(this);
        this.handleEditCancel = this.handleEditCancel.bind(this);
    }

    clearData() {
        Object.getOwnPropertyNames(this.state.data).forEach(topic => {
            mqtt.unsubscribe(topic, this.handlePublish);
        });
    }

    formatString(data, format) {
        let str = "";
        format.forEach((msg, i) => {
            if (i % 2) {
                if (data[msg]) {
                    str += data[msg];
                } else {
                    str += "?";
                }
            } else {
                str += msg;
            }
        });
        return str;
    }

    updateData() {
        let topics = [];
        let format = [];
        let str = this.props.data;
        while (str.length > 0) {
            let idx = str.indexOf("{");
            if (idx < 0) {
                format.push(str);
                break;
            }
            format.push(str.substr(0, idx));
            str = str.substr(idx + 1);
            idx = str.indexOf("}");
            let topic = str.substr(0, idx);
            topics.push(topic);
            format.push(topic);
            str = str.substr(idx + 1);
        }
        topics.forEach(topic => {
            mqtt.subscribe(topic, this.handlePublish);
        });
        this.setState({
            "data": {},
            "format": format,
            "text": this.formatString({}, format)
        });
    }

    componentDidMount() {
        this.updateData();
    }

    componentWillUnmount() {
        this.clearData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.clearData();
            this.updateData();
        }
    }

    handlePublish(msg, topic) {
        let data = this.state.format;
        data[topic] = msg;
        this.setState({
            "data": data,
            "text": this.formatString(data, this.state.format)
        });
    }

    handleContextMenu(ev) {
        ev.preventDefault();
        this.setState({
            "ctxEv": {
                "clientX": ev.clientX,
                "clientY": ev.clientY,
                "ev": ev
            }
        });
    }

    handleEditClick() {
        this.setState({
            "edit": true,
            "editText": this.props.data
        });
    }

    handleDeleteClick() {
        if (this.props.onDelete) {
            this.props.onDelete();
        }
    }

    handleFinishEdit() {
        this.setState({
            "edit": false
        });
        if (this.props.onDataChange) {
            this.props.onDataChange(this.state.editText);
        }
    }

    handleEditChange(ev) {
        this.setState({
            "editText": ev.target.value
        });
    }

    handleEditCancel() {
        this.setState({
            "edit": false
        });
    }

    render() {
        return (
            <DataView left={this.props.left} right={this.props.right} top={this.props.top} bottom={this.props.bottom} onResize={this.props.onResize} onContextMenu={this.handleContextMenu}>
                {this.state.edit ? (
                    <div className="label-edit-container">
                        <textarea className="label-edit-area" value={this.state.editText} onChange={this.handleEditChange} />
                        <ContextMenu event={this.state.ctxEv} elements={[
                            "Save",
                            "Cancel",
                            "Delete"
                        ]} onClick={[
                            this.handleFinishEdit,
                            this.handleEditCancel,
                            this.handleDeleteClick
                        ]}></ContextMenu>
                    </div>
                ) : (
                    <div>
                        {this.state.text.split("\n").map((x, i) => (
                            <p key={i}>{x}</p>
                        ))}
                        <ContextMenu event={this.state.ctxEv} elements={[
                            "Edit Text",
                            "Delete"
                        ]} onClick={[
                            this.handleEditClick,
                            this.handleDeleteClick
                        ]} />
                    </div>
                )}
            </DataView>
        );
    }
}

Label.propTypes = {
    "data": PropTypes.string.isRequired,
    "left": PropTypes.number.isRequired,
    "right": PropTypes.number.isRequired,
    "top": PropTypes.number.isRequired,
    "bottom": PropTypes.number.isRequired,
    "onResize": PropTypes.func,
    "onDelete": PropTypes.func,
    "onDataChange": PropTypes.func
};
