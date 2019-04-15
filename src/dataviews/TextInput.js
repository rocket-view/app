import React from "react";
import PropTypes from "prop-types";
import mqtt from "../mqtt";
import DataView from "./DataView";
import "./TextInput.css";
import ContextMenu from "../ContextMenu";

const PUBLISH_IGNORE = 5000;

export default class TextInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "text": "",
            "ctxEv": {},
            "edit": false,
            "editText": ""
        };
        this.lastPublish = new Date(0);
        this.handlePublish = this.handlePublish.bind(this);
        this.handleContextMenu = this.handleContextMenu.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleFinishEdit = this.handleFinishEdit.bind(this);
        this.handleEditChange = this.handleEditChange.bind(this);
        this.handleEditCancel = this.handleEditCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        if (this.props.data.length > 0) {
            mqtt.subscribe(this.props.data, this.handlePublish);
        }
    }

    componentWillUnmount() {
        if (this.props.data.length > 0) {
            mqtt.unsubscribe(this.props.data, this.handlePublish);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            if (prevProps.data.length > 0) {
                mqtt.unsubscribe(prevProps.data, this.handlePublish);
            }
            if (this.props.data.length > 0) {
                mqtt.subscribe(this.props.data, this.handlePublish);
            }
        }
    }

    handlePublish(msg) {
        if (new Date() - this.lastPublish > PUBLISH_IGNORE) {
            this.setState({
                "text": msg
            });
        }
    }

    handleContextMenu(ev) {
        ev.preventDefault();
        ev.stopPropagation();
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

    handleChange(ev) {
        this.setState({
            "text": ev.target.value
        });
        if (this.props.data.length > 0) {
            this.lastPublish = new Date();
            mqtt.publish(this.props.data, ev.target.value);
        }
    }

    render() {
        return (
            <DataView left={this.props.left} right={this.props.right} top={this.props.top} bottom={this.props.bottom} onResize={this.props.onResize} onContextMenu={this.handleContextMenu}>
                {this.state.edit ? (
                    <div className="text-input-container">
                        <textarea className="text-input-area" value={this.state.editText} onChange={this.handleEditChange} />
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
                    <div className="text-input-container">
                        <textarea className="text-input-area" value={this.state.text} onChange={this.handleChange} />
                        <ContextMenu event={this.state.ctxEv} elements={[
                            "Edit Topic",
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

TextInput.propTypes = {
    "data": PropTypes.string.isRequired,
    "left": PropTypes.number.isRequired,
    "right": PropTypes.number.isRequired,
    "top": PropTypes.number.isRequired,
    "bottom": PropTypes.number.isRequired,
    "onResize": PropTypes.func,
    "onDelete": PropTypes.func,
    "onDataChange": PropTypes.func
};
