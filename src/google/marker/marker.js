import DrawingInterface from "../drawingInterface";
import Map from "../map";
import {googleMapsApi, googleMapsConst} from "../../utils/googleApi";

class Marker extends DrawingInterface
{
    options = {
        anchorPoint: null,
        animation: null,
        clickable: null,
        crossOnDrag: null,
        cursor: null,
        draggable: true,
        icon: null,
        label: null,
        map: Map.map,
        opacity: null,
        optimized: null,
        position: Map.map.getCenter(),
        shape: null,
        title: null,
        visible: null,
        zIndex: 100,
    };

    events = [
        'dragend',
        'click'
    ];

    constructor(init, opts = {}) {
        super(init);

        if ('coords' in init)
            opts.position = this.setLatLng(init.coords);

        this.gooObject = googleMapsApi('Marker', {...this.options, ...opts});

        if (!this.dbID)
            this.isLocationPolygon();

        for(let eventName of this.events)
            this.gooObject.addListener(eventName, this[eventName])
    }

    isLocationPolygon = () => {
        const latLng = this.gooObject.getPosition();

        let isLocation = false;

        this.polygon().forEach(({gooObject}) => {
            if (isLocation)
                return;

            isLocation = googleMapsConst('geometry', 'poly', 'containsLocation') (latLng, gooObject);
        });

        if (isLocation)
            this.addAlert([this]);

        return isLocation;
    };

    dragend = () => {
        this.saveDb();
        this.isLocationPolygon();
    };
}

export default Marker;
