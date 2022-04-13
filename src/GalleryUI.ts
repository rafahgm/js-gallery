import Gallery from './Gallery';
import * as utils from './utils';

import gsap from 'gsap';

class GalleryUI {
    private _currentGallery: Gallery;
    private _container: HTMLDivElement;
    private _topbar: HTMLDivElement;
    private _backdrop: HTMLDivElement;
    private _originalImage: HTMLImageElement;
    private _currentImage: HTMLImageElement;
    private _slider: HTMLDivElement;
    private _imageViewer: HTMLDivElement;
    private _imageViewerViewport: HTMLDivElement;
    private _currentIndex: number;
    private _nextButton: HTMLButtonElement;
    private _prevButton: HTMLButtonElement;

    constructor() {}

    open(
        gallery: Gallery,
        initialImage: HTMLImageElement,
        highResolutionSrc?: string,
        index?: number
    ) {
        this._currentGallery = gallery;
        this._currentIndex = index;
        console.log(`Image with index ${index} opened`);
        // Crate container
        this._container = document.createElement('div');
        this._container.classList.add('gallery');

        // Disbale scrolling
        utils.disableScrolling();

        // Create backdrop
        this._backdrop = document.createElement('div');
        this._backdrop.classList.add('gallery-backdrop');
        document.body.appendChild(this._backdrop);

        // Create topbar
        this.createTopbar();
        this.changeTitle(`${index + 1} / ${gallery.images.length}`);
        this._container.appendChild(this._topbar);

        // Add Image Preview
        this._imageViewer = document.createElement('div');
        this._imageViewer.classList.add('gallery__image_viewer');

        this._prevButton = utils.createIconButton('fa-chevron-left');
        this._prevButton.classList.add('gallery__image_viewer__prev');
        this._prevButton.addEventListener('click', () => {
            this.prevImage();
        });
        if (this._currentIndex === 0) {
            // Primeira image, desabilita o botão de voltar
            this._prevButton.setAttribute('disabled', '');
        }

        this._nextButton = utils.createIconButton('fa-chevron-right');
        this._nextButton.classList.add('gallery__image_viewer__next');
        this._nextButton.addEventListener('click', () => {
            this.nextImage();
        });

        this._imageViewer.append(this._prevButton, this._nextButton);

        this._imageViewerViewport = document.createElement('div');
        this._imageViewerViewport.classList.add(
            'gallery__image_viewer__viewport'
        );

        gallery.images.forEach((_) => {
            const imageContainer = document.createElement('div');
            // imageContainer.style.backgroundColor = '#FF0000';
            imageContainer.classList.add('gallery__image_viewer__item');
            this._imageViewerViewport.append(imageContainer);
        });

        this._imageViewerViewport.style.transform = `translateX(-${
            index * document.body.clientWidth
        }px)`;

        this._imageViewer.append(this._imageViewerViewport);

        this._container.appendChild(this._imageViewer);

        // Setup gallery slider
        this._slider = document.createElement('div');
        this._slider.classList.add('gallery__slider');
        const sliderViewport = document.createElement('div');
        sliderViewport.classList.add('gallery__slider__viewport');

        gallery.images.forEach((image) => {
            const div = document.createElement('div');
            div.classList.add('gallery__slider__item');

            const imageElement = document.createElement('img');
            imageElement.src = image.src;
            div.appendChild(imageElement);
            sliderViewport.appendChild(div);
        });

        this._slider.appendChild(sliderViewport);
        this._container.appendChild(this._slider);

        // Animation
        gsap.fromTo(
            [this._container, this._backdrop],
            { opacity: 0 },
            { opacity: 1, duration: 0.4 }
        );
        gsap.fromTo(
            this._slider,
            { y: 100 },
            { y: 0, duration: 0.4, delay: 0.2 }
        );
        gsap.fromTo(
            this._topbar,
            { y: -60 },
            { y: 0, duration: 0.4, delay: 0.2 }
        );

        // Append container to body
        document.body.appendChild(this._container);

        // Load prev image if not first
        if (this._currentIndex !== 0) {
            this.loadPrevImage();
        }
        // Load next image if not last
        if (this._currentIndex < this._currentGallery.images.length - 1) {
            this.loadNextImage();
        }
        this.createImageAnimation(initialImage);

        // Set current image
        this._originalImage = initialImage;
    }

    loadNextImage() {
        // Chekc if next slot is empty
        if (
            this._imageViewerViewport.querySelector(
                `div:nth-child(${this._currentIndex + 2})`
            ).childNodes.length === 0
        ) {
            // Load next image into next cell
            const nextImage = document.createElement('img');
            const nextImageElement =
                this._currentGallery.images[this._currentIndex + 1];

            // Fit image to viewport
            const { finalWidth, finalHeight, finalX } = utils.fitToViewport(
                this._imageViewer,
                nextImageElement
            );

            gsap.set(nextImage, {
                height: finalHeight,
                width: finalWidth,
            });

            // nextImage.style.backgroundColor = '#ff0000';
            nextImage.src = nextImageElement.src;

            this._imageViewerViewport
                .querySelector(`div:nth-child(${this._currentIndex + 2})`)
                .append(nextImage);
        }
    }

    loadPrevImage() {
        // Chekc if previous slot is empty
        if (
            this._imageViewerViewport.querySelector(
                `div:nth-child(${this._currentIndex})`
            ).childNodes.length === 0
        ) {
            // Load next image into next cell
            const prevImage = document.createElement('img');
            const prevImageElement =
                this._currentGallery.images[this._currentIndex - 1];

            // Fit image to viewport
            const { finalWidth, finalHeight, finalX } = utils.fitToViewport(
                this._imageViewer,
                prevImageElement
            );

            gsap.set(prevImage, {
                height: finalHeight,
                width: finalWidth,
            });

            // nextImage.style.backgroundColor = '#ff0000';
            prevImage.src = prevImageElement.src;

            this._imageViewerViewport
                .querySelector(`div:nth-child(${this._currentIndex})`)
                .append(prevImage);
        }
    }

    createImageAnimation(initialImage: HTMLImageElement) {
        // Create image
        this._currentImage = document.createElement('img');
        this._currentImage.classList.add('gallery_image_preview');
        this._currentImage.style.height = `${initialImage.clientHeight}px`;
        this._currentImage.style.width = `${initialImage.clientWidth}px`;
        this._currentImage.src = initialImage.src;

        // Set image final size to best fit image viewer

        const { finalWidth, finalHeight, finalX, finalY } = utils.fitToViewport(
            this._imageViewer,
            initialImage
        );
        // Animate image to center with its current height and width to its final size
        gsap.fromTo(
            this._currentImage,
            {
                x: initialImage.offsetLeft,
                y: initialImage.offsetTop - window.scrollY,
                width: initialImage.clientWidth,
                height: initialImage.clientHeight,
            },
            {
                x: finalX,
                y: finalY,
                height: finalHeight,
                width: finalWidth,
                onComplete: () => {
                    this._imageViewerViewport
                        .querySelector(
                            `div:nth-child(${this._currentIndex + 1})`
                        )
                        .append(this._currentImage);
                    this._currentImage.classList.remove(
                        'gallery_image_preview'
                    );
                    // gsap.set(this._currentImage, { y: 0 });
                    this._currentImage.style.transform = '';

                    // Show prev and next button
                    gsap.to(this._prevButton, { x: 50, duration: 0.3 });
                    gsap.to(this._nextButton, { x: -50, duration: 0.3 });
                },
            }
        );

        document.body.appendChild(this._currentImage);
    }

    createTopbar() {
        this._topbar = document.createElement('div');
        this._topbar.classList.add('gallery__topbar');

        const imageTitle = document.createElement('span');

        const buttons = document.createElement('div');
        buttons.classList.add('gallery__topbar__buttons');

        // const downloadButton = utils.createIconButton('fa-download');
        // const shareButton = utils.createIconButton('fa-share-nodes');
        const zoomButton = utils.createIconButton('fa-magnifying-glass-plus');
        zoomButton.addEventListener('click', () => {
            this.zoom();
            gsap.to(this._currentImage, { scale: 4.4582 });
        });

        const closeButton = utils.createIconButton('fa-xmark');
        closeButton.classList.add('gallery__topbar__close');
        closeButton.addEventListener('click', () => {
            this.close();
        });

        buttons.append(zoomButton, closeButton);

        this._topbar.appendChild(imageTitle);
        this._topbar.appendChild(buttons);
    }

    changeTitle(newTitle: string) {
        this._topbar.querySelector('span').innerText = newTitle;
    }

    close() {
        const initialX = this._currentImage.getBoundingClientRect().left;
        const initialY = this._currentImage.getBoundingClientRect().top;

        // Give back its calss
        this._currentImage.classList.add('gallery_image_preview');
        document.body.appendChild(this._currentImage);

        // Retract current image to original image position
        gsap.fromTo(
            this._currentImage,
            {
                x: initialX,
                y: initialY,
                width: this._currentImage.clientWidth,
                height: this._currentImage.clientHeight,
            },
            {
                x: this._originalImage.offsetLeft,
                y: this._originalImage.offsetTop - window.scrollY,
                height: this._originalImage.clientHeight,
                width: this._originalImage.clientWidth,
                duration: 0.3,
                onComplete: () => {
                    this._currentImage.remove();
                },
            }
        );

        gsap.to([this._container, this._backdrop], {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                this._backdrop.remove();
                this._container.remove();
                utils.enableScrolling();
            },
        });

        gsap.to(this._slider, {
            y: 100,
            duration: 0.3,
        });

        // Animate topbar leaving
        gsap.to(this._topbar, {
            y: -60,
            duration: 0.3,
        });

        // Animate prev next buttons
        gsap.to(this._nextButton, { x: 0, duration: 0.3 });
    }
    prevImage() {
        this._currentIndex -= 1;

        gsap.to(this._imageViewerViewport, {
            x: -(this._currentIndex * document.body.clientWidth),
            duration: 0.4,
        });

        this.changeTitle(
            `${this._currentIndex + 1} / ${this._currentGallery.images.length}`
        );

        this._originalImage = this._currentGallery.images[this._currentIndex];
        this._currentImage = this._imageViewerViewport.querySelector(
            `div:nth-child(${this._currentIndex + 1}) > img`
        );

        //If not first image, Load prev image
        if (this._currentIndex !== 0) {
            this.loadPrevImage();
            this._nextButton.removeAttribute('disabled');
        } else {
            this._prevButton.setAttribute('disabled', '');
        }
    }

    nextImage() {
        this._currentIndex += 1;

        gsap.to(this._imageViewerViewport, {
            x: -(this._currentIndex * document.body.clientWidth),
            duration: 0.4,
        });

        this.changeTitle(
            `${this._currentIndex + 1} / ${this._currentGallery.images.length}`
        );

        this._originalImage = this._currentGallery.images[this._currentIndex];
        this._currentImage = this._imageViewerViewport.querySelector(
            `div:nth-child(${this._currentIndex + 1}) > img`
        );

        //If not last image, Load next image
        if (this._currentIndex < this._currentGallery.images.length - 1) {
            this.loadNextImage();
            this._prevButton.removeAttribute('disabled');
        } else {
            // Disable button
            this._nextButton.setAttribute('disabled', '');
        }
    }

    zoom() {
        gsap.to(this._slider, { y: 100, duration: 0.3 });
    }
}

export default GalleryUI;
