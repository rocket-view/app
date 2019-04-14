import React from "react";
import PropTypes from "prop-types";
import smoothie from "smoothie";
import mqtt from "../mqtt";
import DataView from "./DataView";
import "./Graph.css";

export default class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.handlePublish = this.handlePublish.bind(this);
    }

    componentDidMount() {
        mqtt.subscribe(this.props.topic, this.handlePublish);
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
        mqtt.unsubscribe(this.props.topic, this.handlePublish);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.topic !== this.props.topic) {
            mqtt.unsubscribe(prevProps.topic, this.handlePublish);
            mqtt.subscribe(this.props.topic, this.handlePublish);
        }
    }

    handlePublish(msg) {
        this.data.append(new Date().getTime(), parseFloat(msg));
    }

    render() {
        return (
            <DataView left={this.props.left} right={this.props.right} top={this.props.top} bottom={this.props.bottom} onResize={this.props.onResize}>
                <div className="graph-container">
                    <canvas className="graph-canvas" ref={el => this.canvas = el} />
                </div>
            </DataView>
        );
    }
}

Graph.propTypes = {
    "topic": PropTypes.string.isRequired,
    "left": PropTypes.number.isRequired,
    "right": PropTypes.number.isRequired,
    "top": PropTypes.number.isRequired,
    "bottom": PropTypes.number.isRequired,
    "onResize": PropTypes.func
};
