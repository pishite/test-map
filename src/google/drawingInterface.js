import InfoWindow from "./infoWindow";

let increment = 0;

class DrawingInterface {
    id;

    static infoWindow;

    gooObject;

    constructor() {
        if (!DrawingInterface.infoWindow)
            DrawingInterface.infoWindow = new InfoWindow(this.infoContent());

        this.id = increment++;
    }

    remove = () => {
        this.gooObject.setMap(null);
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