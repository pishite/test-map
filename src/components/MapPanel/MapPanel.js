import React, { Component } from 'react';
import Map from "../../google/map";
import CarMarker from "../../google/marker/car";
import HumanMarker from "../../google/marker/human";
import { loadScript } from "../../utils/loadScript";
import Data from "../../google/pencil/data";
import Marker from "../../google/marker/marker";
import Polygon from "../../google/pencil/polygon";
import DrawingInterface from "../../google/drawingInterface";
import { gooApiUrl } from "../../utils/gooApiUrl";

class MapPanel extends Component {
    state = {
        loaded: false,
        draw: [],
        alerts: []
    };

    map = null;

    draw = null;

    componentDidMount() {
        if (this.loaded)
            return;

        loadScript(gooApiUrl, 'google-maps-api', () => {
            if (typeof window['google'] !== 'object')
                throw new Error('Google Maps API not found');

            DrawingInterface.prototype.addAlert = this.addAlert;
            Marker.prototype.polygon = () => this.getPolygon();
            Polygon.prototype.markers = () => this.getMarkers();

            this.map = new Map();
            this.draw = new Data(this.addDraw);

            document.getElementById('map_canvas').addEventListener('click', (e) => {
                if (!DrawingInterface.infoWindow ||
                    e.target.nodeType !== 1 ||
                    e.target.tagName !== 'BUTTON' ||
                    e.target.className !== 'remote-draw-object')
                    return;

                this.dropDrawImage();
            });

            this.setState({
                loaded: true
            });
        });
    }

    getPolygon = () => {
        return this.state.draw.filter(obj => obj instanceof Polygon)
    };

    getMarkers = () => {
        return this.state.draw.filter(obj => obj instanceof Marker)
    };

    addAlert = (markers = []) => {
        console.log(markers)
        alert(markers)
    };

    addDraw = (draw, ...args) => {
        const drawObject = new draw(args)

        drawObject.saveDb();

        this.setState({
            draw: [...this.state.draw, drawObject]
        });
    };

    drawPolygon = () => {
        this.draw.enableDrawMode();
    };

    getDrawObject = id => {
        const obj = this.state.draw.filter(obj => obj.id === id);

        return obj.length ? obj.shift() : null
    };

    dropDrawImage = () => {
        const removeObj = this.getDrawObject(DrawingInterface.infoWindow.id);

        if (!removeObj)
            return;

        removeObj.remove();

        this.setState({
            draw: this.state.draw.filter(obj => obj.id !== DrawingInterface.infoWindow.id)
        })
    };

    render() {
        const { loaded } = this.state;

        if (!loaded)
            return 'Loaded......';

        return (
            <div className="map-panel">

                <button onClick={this.addDraw.bind(this, HumanMarker)}>
                    Add People
                </button>

                <button onClick={this.addDraw.bind(this, CarMarker)}>
                    Add Car
                </button>

                <button onClick={this.drawPolygon}>
                    Draw Polygon
                </button>

            </div>
        )
    }
}

export default MapPanel;