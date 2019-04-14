import React from "react";
import PropTypes from "prop-types";
import "./DataView.css";

let mouseX, mouseY;

document.addEventListener("dragover", ev => {
    mouseX = ev.clientX;
    mouseY = ev.clientY;
});

export default class DataView extends React.Component {
    constructor(props) {
        super(props);
        this.handleDragStart = this.handleDragStart.bind(this);
    }

    handleDrag(left, right, top, bottom) {
        if (this.props.onResize) {
            let x = Math.round(32 * mouseX / document.body.clientWidth);
            let y = Math.round(18 * mouseY / document.body.clientHeight);
            let l = this.props.left;
            let r = this.props.right;
            let t = this.props.top;
            let b = this.props.bottom;
            if (left) {
                l = x;
                if (l >= 32 - r) {
                    l = 32 - r - 1;
                }
            } else if (right) {
                r = 32 - x;
                if (32 - r <= l) {
                    r = 32 - (l + 1);
                }
            }
            if (top) {
                t = y;
                if (t >= 18 - b) {
                    t = 18 - b - 1;
                }
            } else if (bottom) {
                b = 18 - y;
                if (18 - t <= b) {
                    b = 18 - (t + 1);
                }
            }
            if (l !== this.props.left || r !== this.props.right || t !== this.props.top || b !== this.props.bottom) {
                this.props.onResize(l, r, t, b);
            }
        }
    }

    handleDragStart(ev) {
        ev.dataTransfer.setData("text/plain", null);
    }

    render() {
        return (
            <div className="data-view" style={{
                "left": `${100*this.props.left/32}%`,
                "right": `${100*this.props.right/32}%`,
                "top": `${100*this.props.top/18}%`,
                "bottom": `${100*this.props.bottom/18}%`
            }}>
                <div className="handle handle-left" draggable onDragStart={this.handleDragStart} onDrag={this.handleDrag.bind(this, true, false, false, false)} />
                <div className="handle handle-right" draggable onDragStart={this.handleDragStart} onDrag={this.handleDrag.bind(this, false, true, false, false)} />
                <div className="handle handle-top" draggable onDragStart={this.handleDragStart} onDrag={this.handleDrag.bind(this, false, false, true, false)} />
                <div className="handle handle-bottom" draggable onDragStart={this.handleDragStart} onDrag={this.handleDrag.bind(this, false, false, false, true)} />
                <div className="handle handle-left handle-top" draggable onDragStart={this.handleDragStart} onDrag={this.handleDrag.bind(this, true, false, true, false)} />
                <div className="handle handle-right handle-top" draggable onDragStart={this.handleDragStart} onDrag={this.handleDrag.bind(this, false, true, true, false)} />
                <div className="handle handle-left handle-bottom" draggable onDragStart={this.handleDragStart} onDrag={this.handleDrag.bind(this, true, false, false, true)} />
                <div className="handle handle-right handle-bottom" draggable onDragStart={this.handleDragStart} onDrag={this.handleDrag.bind(this, false, true, false, true)} />
                <div className="container">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

DataView.propTypes = {
    "left": PropTypes.number.isRequired,
    "right": PropTypes.number.isRequired,
    "top": PropTypes.number.isRequired,
    "bottom": PropTypes.number.isRequired,
    "onResize": PropTypes.func
};
