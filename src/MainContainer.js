import React from "react";
import Label from "./dataviews/Label";
import Graph from "./dataviews/Graph";
import mqtt from "./mqtt";
import "./MainContainer.css";
import ContextMenu from "./ContextMenu";
import Button from "./dataviews/Button";
import TextInput from "./dataviews/TextInput";

const components = {
    "Label": Label,
    "Graph": Graph,
    "Button": Button,
    "Textbox": TextInput
};

const PUBLISH_IGNORE = 5000;

export default class MainContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "components": [],
            "ctxEv": {}
        };
        this.handlePublish = this.handlePublish.bind(this);
        this.lastPublish = new Date(0);
        this.handleContextMenu = this.handleContextMenu.bind(this);
    }

    componentDidMount() {
        mqtt.subscribe("rocket_view/display_config", this.handlePublish);
    }

    componentWillUnmount() {
        mqtt.unsubscribe("rocket_view/display_config", this.handlePublish);
    }

    handlePublish(msg) {
        if (new Date() - this.lastPublish > PUBLISH_IGNORE) {
            this.setState({
                "components": JSON.parse(msg)
            });
        }
    }

    handleResize(cid, left, right, top, bottom) {
        let comps = this.state.components;
        comps[cid].size = {
            "left": left,
            "right": right,
            "top": top,
            "bottom": bottom
        };
        this.setState({
            "components": comps
        });
        this.lastPublish = new Date();
        mqtt.publish("rocket_view/display_config/set", JSON.stringify(comps));
    }

    handleDelete(cid) {
        let comps = this.state.components;
        comps.splice(cid, 1);
        this.setState({
            "components": comps
        });
        this.lastPublish = new Date();
        mqtt.publish("rocket_view/display_config/set", JSON.stringify(comps));
    }

    handleDataChange(cid, data) {
        let comps = this.state.components;
        comps[cid].data = data;
        this.setState({
            "components": comps
        });
        this.lastPublish = new Date();
        mqtt.publish("rocket_view/display_config/set", JSON.stringify(comps));
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

    handleAddClick(type) {
        let x = Math.round(32 * this.state.ctxEv.clientX / document.body.clientWidth);
        let y = Math.round(18 * this.state.ctxEv.clientY / document.body.clientHeight);
        let comps = this.state.components;
        comps.push({
            "type": type,
            "size": {
                "left": x,
                "right": 32 - x - 3,
                "top": y,
                "bottom": 18 - y - 2
            },
            "data": ""
        });
        this.setState({
            "components": comps
        });
        this.lastPublish = new Date();
        mqtt.publish("rocket_view/display_config/set", JSON.stringify(comps));
    }

    render() {
        let grid = [];
        for (let x = 1; x < 32; ++x) {
            for (let y = 1; y < 18; ++y) {
                grid.push((
                    <div className="grid-dot" key={`grid-${x}-${y}`} style={{
                        "left": `${100*x/32}vw`,
                        "top": `${100*y/18}vh`
                    }} />
                ));
            }
        }
        let comps = [];
        this.state.components.forEach((comp, i) => {
            let Component = components[comp.type];
            comps.push((
                <Component key={`comp-${i}`} data={comp.data}
                    left={comp.size.left} right={comp.size.right} top={comp.size.top} bottom={comp.size.bottom}
                    onResize={this.handleResize.bind(this, i)} onDelete={this.handleDelete.bind(this, i)} onDataChange={this.handleDataChange.bind(this, i)} />
            ));
        });
        return (
            <div className="main" onContextMenu={this.handleContextMenu}>
                {grid}
                {comps}
                <ContextMenu event={this.state.ctxEv} elements={Object.getOwnPropertyNames(components).map(e => `Add ${e}`)}
                    onClick={Object.getOwnPropertyNames(components).map(e => this.handleAddClick.bind(this, e))} />
            </div>
        );
    }
}
