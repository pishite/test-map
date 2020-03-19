import Marker from './marker';
import { carOptions } from '../../data/markerOptions';
import DrawingInterface from "../drawingInterface";


class CarMarker extends Marker
{
    name = 'Car';

    constructor() {
        super(carOptions)
    }
}

export default CarMarker;
