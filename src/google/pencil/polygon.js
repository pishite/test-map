import DrawingInterface from "../drawingInterface";
import Map from '../map'
import {googleMapsApi, googleMapsConst} from '../../utils/googleApi'

class Polygon extends DrawingInterface {
    events = [
        // 'click'
    ];

    constructor(chords) {
        super();

        this.gooObject = googleMapsApi('Polygon', {
            clickable:      true,
            editable:       true,
            map:            Map.map,
            paths:           chords,
            fillColor:      'red',
            strokeColor:    'red',
            strokeOpacity:  .6,
            strokeWeight:   3,
            zIndex:         10
        });

        this.gooObject.addListener('mouseup', this.mouseup);

        this.isLocationPolygon()

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

    mouseup = () => {
        this.isLocationPolygon()
    }
}

export default Polygon;
