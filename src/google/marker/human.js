import Marker from './marker';
import { humanOptions } from "../../data/markerOptions";
import { googleMapsApi } from '../../utils/googleApi'

class HumanMarker extends Marker
{
    name = 'People';

    constructor(init) {
        humanOptions.icon.scaledSize = googleMapsApi('Size', 48, 48);

        super(init, humanOptions)
    }
}

export default HumanMarker;
