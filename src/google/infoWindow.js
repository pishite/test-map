import {googleMapsApi} from "../utils/googleApi";

class InfoWindow
{
    id;

    active = false;

    gooObject = null;

    constructor(content = '', opts = {}) {
        this.gooObject = googleMapsApi('InfoWindow', {
            content,
            ...opts
        });
    }

    isActive() {
        return this.active;
    }

    open(drawInterface) {
        if (this.id === drawInterface.id)
            return this.close();

        this.id = drawInterface.id;

        this.gooObject.open(Map.map, drawInterface.gooObject);
        this.active = true;
    }

    close() {
        this.id = undefined;
        this.active = false;
        this.gooObject.close();
    }

    showInfo = (drawInterface) => {
        this.gooObject.setPosition(drawInterface.gooObject.getPosition())
    }
}

export default InfoWindow;