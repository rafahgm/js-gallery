import * as utils from './utils';

class Gallery {
    id: string | null;
    images: HTMLImageElement[];
    toolbarTitle: HTMLSpanElement;

    constructor(id: string | null){
        this.id = id;
        this.images = [];
    }

    addImage(image: HTMLImageElement): void {
        this.images.push(image);
    }
}

export default Gallery;