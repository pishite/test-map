import InfoWindow from "./infoWindow";
import {drawRemove, drawSave} from "../utils/ajax";

let increment = 0;

class DrawingInterface {
    id;

    dbID;

    name = 'DrawInterface';

    static infoWindow;

    gooObject;

    constructor() {
        if (!DrawingInterface.infoWindow)
            DrawingInterface.infoWindow = new InfoWindow(this.infoContent());

        this.id = increment++;
    }

    saveDb = () => {
        drawSave(this)
            .then(data => {
                if (data && 'id' in data && data.id)
                    this.dbID = data.id
            })
            .catch(e => {
                console.log(e)
            })
    };

    getId = () => {
        return this.dbID ? this.dbID : null;
    };

    getLatLng = () => {
        const latLng = this.gooObject.getPosition();

        return [latLng.lat(), latLng.lng()];
    };

    remove = () => {
        this.gooObject.setMap(null);

        drawRemove(this);
    };

    click = () => {
        DrawingInterface.infoWindow.open(this)
    };

    infoContent() {
        return `<div>
                    <button class="remote-draw-object">
                        Remove Object
                    </button>
                </div>`
    }
}

export default DrawingInterface;