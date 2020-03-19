import DrawingInterface from "../drawingInterface";
import Map from '../map'
import {googleMapsApi, googleMapsConst} from '../../utils/googleApi'

class Polygon extends DrawingInterface {
    events = [
        'click'
    ];

    name = 'Polygon';

    constructor(init) {
        super(init);

        if ('coords' in init)
            init.coords = init.coords.map(coord => this.setLatLng(coord));

        this.gooObject = googleMapsApi('Polygon', {
            clickable:      true,
            editable:       true,
            map:            Map.map,
            paths:          init.coords,
            fillColor:      'red',
            strokeColor:    'red',
            strokeOpacity:  .6,
            strokeWeight:   3,
            zIndex:         10
        });

        if (!this.dbID)
            this.isLocationPolygon();

        for(let eventName of this.events)
            this.gooObject.addListener(eventName, this[eventName])
    }

    isLocationPolygon = () => {
        const markers = [];

        this.markers().forEach((marker) => {
            if (googleMapsConst('geometry', 'poly', 'containsLocation') (marker.gooObject.getPosition(), this.gooObject))
                markers.push(marker);
        });

        if (markers.length)
            this.addAlert(markers);

        return markers.length;
    };

    getLatLng = () => {
        const result = [];

        this.gooObject.getPath().forEach((latLng) => {
            result.push([latLng.lat(), latLng.lng()]);
        });

        return result
    };

    click = event => {
        DrawingInterface.infoWindow.open(this, event.latLng)
    };
}

export default Polygon;
