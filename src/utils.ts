export type Image = {
    finalX: number,
    finalY: number,
    finalWidth: number,
    finalHeight: number,
}

export function getImageSize(
    image: HTMLImageElement,
    callback: Function
): void {
    let w, h: number;
    const poll = setInterval(() => {
        w = image.naturalWidth;
        h = image.naturalHeight;

        if (w && h) {
            clearInterval(poll);
            callback.apply(this, [w, h]);
        }
    });
}

export function disableScrolling() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;

    window.onscroll = function () {
        window.scrollTo(scrollLeft, scrollTop);
    };
}

export function enableScrolling() {
    window.onscroll = function () {};
}

export function createIconButton(faClass: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.classList.add('fa-solid', faClass);
    return button;
}

export function fitToViewport(imageViewer: HTMLDivElement, initialImage: HTMLImageElement): Image {
    const ratio = initialImage.naturalWidth / initialImage.naturalHeight;
    const pratio = imageViewer.clientWidth / imageViewer.clientHeight;

    let finalWidth, finalHeight, finalX, finalY: number;

    if (ratio < pratio) {
        const scaleFactor =
            imageViewer.clientHeight / initialImage.naturalHeight;
        finalHeight = imageViewer.clientHeight;
        finalWidth = initialImage.naturalWidth * scaleFactor;

        finalX = imageViewer.clientWidth / 2 - finalWidth / 2;
        finalY = imageViewer.offsetTop;
    } else {
        const scaleFactor = imageViewer.clientWidth / initialImage.naturalWidth;

        finalWidth = imageViewer.clientWidth;
        finalHeight = initialImage.naturalHeight * scaleFactor;

        finalX = imageViewer.offsetLeft;
        finalY = (imageViewer.clientHeight / 2 - finalHeight / 2) + imageViewer.getBoundingClientRect().top;
    }

    return {
        finalWidth: finalWidth,
        finalHeight: finalHeight,
        finalX: finalX,
        finalY: finalY
    };
}
