import React from "react";
import Label from "./dataviews/Label";
import "./MainContainer.css";

export default class MainContainer extends React.Component {
    render() {
        return (
            <div className="main">
                <Label format="Hello, world!\nSine wave = {rocket_view/data/sine}" />
            </div> 
        );
    }
}
