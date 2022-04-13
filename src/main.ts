import Gallery from './Gallery';
import gsap from 'gsap';
import GalleryUI from './GalleryUI';


const galleries: Gallery[] = [];
const galleryUI: GalleryUI = new GalleryUI();

// Generate Galleries
document.querySelectorAll<HTMLImageElement>('a[data-gallery]').forEach((galleryItem) => {
    const galleryId = galleryItem.getAttribute('data-gallery');
    const image = galleryItem.querySelector('img');
    // Check if its gallery already exists
    if (galleries.length > 0) {
        galleries.every(gallery => {
            if (gallery.id === galleryId) {
                gallery.addImage(image);
                galleryItem.setAttribute('data-index', (gallery.images.length - 1).toString());
                return false;
            }
        });
    } else {
        // Gallery doesnt exist
        const newGallery = new Gallery(galleryId);
        newGallery.addImage(image);
        galleries.push(newGallery);
        galleryItem.setAttribute('data-index', (newGallery.images.length - 1).toString());
    }

    // Attach events
    galleryItem.addEventListener('click', function(event: MouseEvent & {currentTarget: HTMLLinkElement}){
        event.preventDefault();

        let gallery = null;

        galleries.every(gal => {
            if(gal.id === event.currentTarget.getAttribute('data-gallery')) {
                gallery = gal;
            }
        });

        galleryUI.open(gallery, event.currentTarget.querySelector('img'), event.currentTarget.getAttribute('data-high-res'), parseInt(event.currentTarget.getAttribute('data-index')));
    });
});

