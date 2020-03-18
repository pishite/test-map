import Marker from './marker';
import { humanOptions } from "../../data/markerOptions";
import { googleMapsApi } from '../../utils/googleApi'

class HumanMarker extends Marker
{
    constructor() {
        humanOptions.icon.scaledSize = googleMapsApi('Size', 48, 48);

        super(humanOptions)
    }
}

export default HumanMarker;