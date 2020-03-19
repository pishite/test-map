import Map from '../map';
import Polygon from './polygon';
import { googleMapsApi } from '../../utils/googleApi';

class Data
{
    gooObject = null;

    addPolygonCallback = null;

    constructor(addPolygonCallback) {
        this.addPolygonCallback = addPolygonCallback;

        this.gooObject = googleMapsApi('Data', {
            featureFactory: this.geometry,
            map: Map.map
        });
    }

    enableDrawMode = (enabled = true) => {
        this.gooObject.setDrawingMode(enabled ? 'Polygon' : null);
    };

    geometry = geometry => {
        const coords = [];

        geometry.forEachLatLng(latlng =>
            coords.push([latlng.lat(), latlng.lng()]) );

        this.enableDrawMode(false);

        this.addPolygonCallback(Polygon, {coords});
    }
}

export default Data;
