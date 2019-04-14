import React from "react";
import Label from "./dataviews/Label";
import "./MainContainer.css";

const components = {
    "Label": Label
};

export default class MainContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "components": [
                {
                    "type": "Label",
                    "size": {
                        "left": 1,
                        "right": 10,
                        "top": 1,
                        "bottom": 6
                    }
                }
            ]
        };
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
                <Component key={`comp-${i}`} format="Hello, world!\nSine wave = {rocket_view/data/sine}"
                    left={comp.size.left} right={comp.size.right} top={comp.size.top} bottom={comp.size.bottom}
                    onResize={this.handleResize.bind(this, i)} />
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
