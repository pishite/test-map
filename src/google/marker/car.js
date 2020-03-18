import Marker from './marker';
import { carOptions } from '../../data/markerOptions';


class CarMarker extends Marker
{
    constructor() {
        super(carOptions)
    }
}

export default CarMarker;
