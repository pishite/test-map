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
        const chords = [];

        geometry.forEachLatLng(latlng => chords.push(latlng) );

        this.enableDrawMode(false);

        this.addPolygonCallback(Polygon, chords);
    }
}

export default Data;