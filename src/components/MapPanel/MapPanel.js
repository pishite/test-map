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
import {alertAdd, alertGet, drawGet} from "../../utils/ajax";
import AlertHistory from "../AlertHistory/AlertHistory";

class MapPanel extends Component {
    state = {
        loaded: false,
        draw: [],
        alerts: []
    };

    isLoading = {
        gooApi: false,
        alerts: false,
        draw: false,
        mapInit: false,
        drawInit: false
    };

    map = null;

    draw = null;

    componentDidMount() {
        if (!this.isLoading.gooApi) {
            this.isLoading.gooApi = true;

            loadScript(gooApiUrl, 'google-maps-api', () => {
                if (typeof window['google'] !== 'object')
                    throw new Error('Google Maps API not found');

                this.updateAlert();

                DrawingInterface.prototype.addAlert = this.addAlert;
                Marker.prototype.polygon = () => this.getPolygon();
                Polygon.prototype.markers = () => this.getMarkers();

                this.map = new Map();
                this.draw = new Data(this.addDraw);

                this.map.onload(() => {
                    this.isLoading.mapInit = true;
                    this.initDraw();
                });

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

        if (!this.isLoading.alerts) {
            this.isLoading.alerts = true;

            this.updateAlert();
        }

        if (!this.isLoading.draw) {
            this.isLoading.draw = true;

            drawGet()
                .then(draw => {
                    if (draw)
                        this.setState({draw});

                    this.isLoading.drawInit = true;
                    this.initDraw();
                })
                .catch(e => {});
        }
    }

    initDraw = () => {
        const { mapInit, drawInit } = this.isLoading;

        if (!mapInit || !drawInit)
            return;

        const { draw } = this.state;

        this.setState({
            draw: draw.map(item => {
                switch (item.type) {
                    case 'Car':
                        return new CarMarker(item);
                    case 'Polygon':
                        return new Polygon(item);
                    case 'People':
                        return new HumanMarker(item);
                    default:
                        return null;
                }
            })
        })
    };

    updateAlert = () => {
        alertGet()
            .then(alerts => this.setState({alerts}));
    };

    getPolygon = () => {
        return this.state.draw.filter(obj => obj instanceof Polygon)
    };

    getMarkers = () => {
        return this.state.draw.filter(obj => obj instanceof Marker)
    };

    addAlert = (markers = []) => {
        const newMarkers = markers.map(marker => ({
            createStamp: (new Date()).getTime(),
            draw_id: marker.dbID,
            coords: marker.getLatLng()
        }));

        this.setState({alerts: [...this.state.alerts, newMarkers]});

        alertAdd(newMarkers.filter(({draw_id}) => draw_id));

        alert(`Alert! Object count: ${newMarkers.length} `)
    };

    addDraw = (draw, ...args) => {
        const drawObject = new draw(...args)

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
        const { loaded, alerts } = this.state;

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

                <AlertHistory alerts={alerts} update={this.updateAlert}/>
            </div>
        )
    }
}

export default MapPanel;
