import React from "react";
import PropTypes from "prop-types";
import mqtt from "../mqtt";
import DataView from "./DataView";
import ContextMenu from "../ContextMenu";
import "./Button.css";

export default class Button extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "text": "",
            "ctxEv": {},
            "edit": false,
            "editLabel": "",
            "editTopic": "",
            "editValue": ""
        };
        this.handleContextMenu = this.handleContextMenu.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleFinishEdit = this.handleFinishEdit.bind(this);
        this.handleEditCancel = this.handleEditCancel.bind(this);
        this.handleEditLabelChange = this.handleEditLabelChange.bind(this);
        this.handleEditTopicChange = this.handleEditTopicChange.bind(this);
        this.handleEditValueChange = this.handleEditValueChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
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
        if (this.props.data.length > 0) {
            let cfg = JSON.parse(this.props.data);
            this.setState({
                "edit": true,
                "editLabel": cfg.label,
                "editTopic": cfg.topic,
                "editValue": cfg.value
            });
        } else {
            this.setState({
                "edit": true,
                "editLabel": "",
                "editTopic": "",
                "editValue": ""
            });
        }
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
            this.props.onDataChange(JSON.stringify({
                "label": this.state.editLabel,
                "topic": this.state.editTopic,
                "value": this.state.editValue
            }));
        }
    }

    handleEditCancel() {
        this.setState({
            "edit": false
        });
    }

    handleEditLabelChange(ev) {
        this.setState({
            "editLabel": ev.target.value
        });
    }

    handleEditTopicChange(ev) {
        this.setState({
            "editTopic": ev.target.value
        });
    }

    handleEditValueChange(ev) {
        this.setState({
            "editValue": ev.target.value
        });
    }

    handleClick() {
        if (this.props.data.length > 0) {
            let cfg = JSON.parse(this.props.data);
            mqtt.publish(cfg.topic, cfg.value);
        }
    }

    render() {
        return (
            <DataView left={this.props.left} right={this.props.right} top={this.props.top} bottom={this.props.bottom} onResize={this.props.onResize} onContextMenu={this.handleContextMenu}>
                {this.state.edit ? (
                    <div className="button-edit-container">
                        <form action="#">
                            <div className="input-group">
                                <label htmlFor="label">Label:</label>
                                <input name="label" type="text" required value={this.state.editLabel} onChange={this.handleEditLabelChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="topic">Topic:</label>
                                <input name="topic" type="text" required value={this.state.editTopic} onChange={this.handleEditTopicChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="value">Payload:</label>
                                <input name="value" type="text" required value={this.state.editValue} onChange={this.handleEditValueChange} />
                            </div>
                        </form>
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
                    <div className="button-view" onClick={this.handleClick}>
                        {this.props.data.length > 0 && JSON.parse(this.props.data).label.split("\n").map((x, i) => (
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

Button.propTypes = {
    "data": PropTypes.string.isRequired,
    "left": PropTypes.number.isRequired,
    "right": PropTypes.number.isRequired,
    "top": PropTypes.number.isRequired,
    "bottom": PropTypes.number.isRequired,
    "onResize": PropTypes.func,
    "onDelete": PropTypes.func,
    "onDataChange": PropTypes.func
};
