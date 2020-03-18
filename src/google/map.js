import {googleMapsApi, googleMapsConst} from "../utils/googleApi";
import DrawingInterface from "./drawingInterface";

class Map {

    static map = null;

    constructor() {
        const myLatlng = googleMapsApi('LatLng', 56.83837514232508, 60.6134438468966);

        const myOptions = {
            zoom: 12,
            center: myLatlng,
            mapTypeId: googleMapsConst('MapTypeId', 'ROADMAP')
        };

        Map.map = googleMapsApi('Map',
            document.getElementById("map_canvas"),
            myOptions
        );

        Map.map.addListener('click', () => {
            if (DrawingInterface.infoWindow)
                DrawingInterface.infoWindow.close();
        })
    }

    onload = (callback) => {
        callback(Map.map);
    }
}

export default Map;