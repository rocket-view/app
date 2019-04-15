import React from "react";
import PropTypes from "prop-types";
import "./ContextMenu.css";

const WIDTH = 100;
const HEIGHT = 20;

export default class ContextMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "x": 0,
            "y": 0,
            "active": false
        };
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleBackgroundClick = this.handleBackgroundClick.bind(this);
        this.handleBtnClick = this.handleBtnClick.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keyup", this.handleKeyUp);
    }

    componentWillUnmount() {
        document.removeEventListener("keyup", this.handleKeyUp);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.event !== this.props.event) {
            let x = this.props.event.clientX;
            let y = this.props.event.clientY;
            if (x + WIDTH > document.body.clientWidth) {
                x -= WIDTH;
            }
            if (y + HEIGHT * this.props.elements.length > document.body.clientHeight) {
                y = document.body.clientHeight - HEIGHT * this.props.elements.length;
            }
            this.setState({
                "x": x,
                "y": y,
                "active": true
            });
            document.addEventListener("click", this.handleBackgroundClick);
        }
    }

    handleKeyUp(ev) {
        if (ev.keyCode === 27 && this.state.active) {
            this.setState({
                "active": false
            });
            document.removeEventListener("click", this.handleBackgroundClick);
        }
    }

    handleBackgroundClick(ev) {
        if (ev.target.parentNode !== this.ul) {
            this.setState({
                "active": false
            });
            document.removeEventListener("click", this.handleBackgroundClick);
        }
    }

    handleBtnClick(idx, ev) {
        this.setState({
            "active": false
        });
        document.removeEventListener("click", this.handleBackgroundClick);
        if (this.props.onClick && this.props.onClick[idx]) {
            this.props.onClick[idx](ev);
        }
    }

    render() {
        return this.state.active ? (
            <ul className="context-menu" ref={el => this.ul = el} style={{
                "left": `${this.state.x}px`,
                "top": `${this.state.y}px`
            }}>
                {this.props.elements.map((el, i) => (
                    <li key={`el-${i}`} onClick={this.handleBtnClick.bind(this, i)}>
                        {el}
                    </li>
                ))}
            </ul>
        ) : <div />;
    }
}

ContextMenu.propTypes = {
    "event": PropTypes.object.isRequired,
    "elements": PropTypes.arrayOf(PropTypes.string).isRequired,
    "onClick": PropTypes.arrayOf(PropTypes.func)
};
