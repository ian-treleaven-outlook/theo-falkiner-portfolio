// Gallery functionality - loads artwork from JSON and renders with PhotoSwipe

document.addEventListener('DOMContentLoaded', async function() {
    const gallery = document.getElementById('gallery');
    
    if (!gallery) {
        console.error('Gallery element not found');
        return;
    }

    // Show loading state
    gallery.innerHTML = '<div class="gallery-loading">Loading artwork...</div>';

    try {
        // Fetch artwork data
        const response = await fetch('data/artwork.json');
        
        if (!response.ok) {
            throw new Error('Failed to load artwork data');
        }

        const data = await response.json();
        
        if (!data.artwork || data.artwork.length === 0) {
            gallery.innerHTML = '<div class="gallery-empty"><p>No artwork available at this time.</p></div>';
            return;
        }

        // Clear loading state
        gallery.innerHTML = '';

        // Render artwork items
        data.artwork.forEach((art, index) => {
            const artItem = createArtItem(art, index);
            gallery.appendChild(artItem);
        });

        // Initialize PhotoSwipe lightbox
        initPhotoSwipe();

        // Trigger scroll animations
        if (typeof initScrollAnimations === 'function') {
            initScrollAnimations();
        }

    } catch (error) {
        console.error('Error loading artwork:', error);
        gallery.innerHTML = '<div class="gallery-empty"><p>Unable to load artwork. Please try again later.</p></div>';
    }
});

// Create art item element
function createArtItem(art, index) {
    const item = document.createElement('div');
    item.className = `art-item fade-in ${index % 2 === 0 ? 'layout-left' : 'layout-right'}`;
    
    // Image container
    const imageDiv = document.createElement('div');
    imageDiv.className = 'art-image';
    
    const img = document.createElement('img');
    img.src = art.image;
    img.alt = art.title;
    img.loading = 'lazy';
    
    const link = document.createElement('a');
    link.href = art.image;
    link.setAttribute('data-pswp-width', art.width || 1200);
    link.setAttribute('data-pswp-height', art.height || 1600);
    link.setAttribute('data-pswp-caption', createCaption(art));
    link.appendChild(img);
    
    imageDiv.appendChild(link);
    
    // Details container
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'art-details';
    
    const title = document.createElement('h3');
    title.textContent = art.title;
    
    const meta = document.createElement('p');
    meta.className = 'art-meta';
    meta.textContent = `${art.medium} • ${art.year}`;
    
    detailsDiv.appendChild(title);
    detailsDiv.appendChild(meta);
    
    // Dimensions
    if (art.dimensions) {
        const dimensions = document.createElement('p');
        dimensions.className = 'art-dimensions';
        dimensions.textContent = art.dimensions;
        detailsDiv.appendChild(dimensions);
    }
    
    // Description
    if (art.description) {
        const description = document.createElement('p');
        description.className = 'art-description';
        description.textContent = art.description;
        detailsDiv.appendChild(description);
    }
    
    // Price
    if (art.price) {
        const price = document.createElement('p');
        price.className = 'art-price';
        price.textContent = art.price;
        detailsDiv.appendChild(price);
    }
    
    // Sold/Available badge
    if (art.sold !== undefined) {
        const badge = document.createElement('span');
        badge.className = art.sold ? 'badge-sold' : 'badge-available';
        badge.textContent = art.sold ? 'Sold' : 'Available';
        detailsDiv.appendChild(badge);
    }
    
    // Tags
    if (art.tags && art.tags.length > 0) {
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'tags';
        
        art.tags.forEach(tagText => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = tagText;
            tagsDiv.appendChild(tag);
        });
        
        detailsDiv.appendChild(tagsDiv);
    }
    
    item.appendChild(imageDiv);
    item.appendChild(detailsDiv);
    
    return item;
}

// Create caption for PhotoSwipe
function createCaption(art) {
    let caption = `<h4>${art.title}</h4>`;
    caption += `<p>${art.medium}, ${art.year}</p>`;
    
    if (art.dimensions) {
        caption += `<p>${art.dimensions}</p>`;
    }
    
    if (art.description) {
        caption += `<p>${art.description}</p>`;
    }
    
    return caption;
}

// Initialize PhotoSwipe lightbox
function initPhotoSwipe() {
    if (typeof PhotoSwipeLightbox === 'undefined') {
        console.warn('PhotoSwipe not loaded');
        return;
    }

    const lightbox = new PhotoSwipeLightbox({
        gallery: '#gallery',
        children: 'a',
        pswpModule: PhotoSwipe,
        showHideAnimationType: 'fade',
        bgOpacity: 0.9,
        spacing: 0.1,
        allowPanToNext: true,
        loop: true,
        pinchToClose: true,
        closeOnVerticalDrag: true,
        preload: [1, 2],
        arrowPrev: true,
        arrowNext: true,
        zoom: true,
        close: true,
        counter: true
    });

    // Parse caption HTML
    lightbox.on('uiRegister', function() {
        lightbox.pswp.ui.registerElement({
            name: 'custom-caption',
            order: 9,
            isButton: false,
            appendTo: 'root',
            html: 'Caption text',
            onInit: (el, pswp) => {
                lightbox.pswp.on('change', () => {
                    const currSlideElement = lightbox.pswp.currSlide.data.element;
                    let captionHTML = '';
                    
                    if (currSlideElement) {
                        const captionText = currSlideElement.getAttribute('data-pswp-caption');
                        if (captionText) {
                            captionHTML = captionText;
                        }
                    }
                    
                    el.innerHTML = captionHTML || '';
                });
            }
        });
    });

    lightbox.init();
}