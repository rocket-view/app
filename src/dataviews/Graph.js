import React from "react";
import PropTypes from "prop-types";
import smoothie from "smoothie";
import mqtt from "../mqtt";
import DataView from "./DataView";
import "./Graph.css";
import ContextMenu from "../ContextMenu";

export default class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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

    componentDidMount() {
        if (this.props.data.length > 0) {
            mqtt.subscribe(this.props.data, this.handlePublish);
        }
        this.baseTime = new Date();
        this.data = new smoothie.TimeSeries();
        let chart = new smoothie.SmoothieChart({
            "responsive": true
        });
        chart.addTimeSeries(this.data, {
            "strokeStyle": "#00FF00",
            "fillStyle": "rgba(0, 255, 0, 0.2)",
            "lineWidth": 1
        });
        chart.streamTo(this.canvas, 500);
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
        this.data.append(new Date().getTime(), parseFloat(msg));
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

    render() {
        return (
            <DataView left={this.props.left} right={this.props.right} top={this.props.top} bottom={this.props.bottom} onResize={this.props.onResize} onContextMenu={this.handleContextMenu}>
                <div className="graph-container">
                    <canvas className="graph-canvas" ref={el => this.canvas = el} />
                    {this.state.edit ? (
                        <div>
                            <textarea value={this.state.editText} onChange={this.handleEditChange} />
                            <ContextMenu event={this.state.ctxEv} elements={[
                                "Save",
                                "Cancel",
                                "Delete"
                            ]} onClick={[
                                this.handleFinishEdit,
                                this.handleEditCancel,
                                this.handleDeleteClick
                            ]} />
                        </div>
                    ) : (
                        <div>
                            <ContextMenu event={this.state.ctxEv} elements={[
                                "Edit Sensor",
                                "Delete"
                            ]} onClick={[
                                this.handleEditClick,
                                this.handleDeleteClick
                            ]} />
                        </div>
                    )}
                </div>
            </DataView>
        );
    }
}

Graph.propTypes = {
    "data": PropTypes.string.isRequired,
    "left": PropTypes.number.isRequired,
    "right": PropTypes.number.isRequired,
    "top": PropTypes.number.isRequired,
    "bottom": PropTypes.number.isRequired,
    "onResize": PropTypes.func,
    "onDelete": PropTypes.func,
    "onDataChange": PropTypes.func
};
