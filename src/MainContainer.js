import React from "react";
import Label from "./dataviews/Label";
import Graph from "./dataviews/Graph";
import mqtt from "./mqtt";
import "./MainContainer.css";

const components = {
    "Label": Label,
    "Graph": Graph
};

const PUBLISH_IGNORE = 5000;

export default class MainContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "components": []
        };
        this.handlePublish = this.handlePublish.bind(this);
        this.lastPublish = new Date(0);
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
            <div className="main">
                {grid}
                {comps}
            </div> 
        );
    }
}
