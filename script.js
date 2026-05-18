document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentIndex = 0;
    let visibleItems = Array.from(galleryItems);

    // Filtering Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Filter gallery items
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hide');
                    // Add simple fade in animation
                    item.style.animation = 'fadeIn 0.5s ease';
                } else {
                    item.classList.add('hide');
                }
            });

            // Update visible items for lightbox navigation
            visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('hide'));
        });
    });

    // Add keyframes for fadeIn if not in CSS
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // Lightbox Logic
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.overlay-text').innerText;
            
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.innerText = caption;
            
            // Find current index within visible items
            currentIndex = visibleItems.indexOf(item);
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close Lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
        setTimeout(() => {
            lightboxImg.src = ''; // Clear image src after transition
        }, 400);
    };

    closeBtn.addEventListener('click', closeLightbox);
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navigation Logic
    const showImage = (index) => {
        if (visibleItems.length === 0) return;
        
        // Handle wrapping
        if (index >= visibleItems.length) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = visibleItems.length - 1;
        } else {
            currentIndex = index;
        }

        const item = visibleItems[currentIndex];
        const img = item.querySelector('img');
        const caption = item.querySelector('.overlay-text').innerText;
        
        // Simple fade out/in effect for image change
        lightboxImg.style.opacity = 0;
        
        setTimeout(() => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.innerText = caption;
            lightboxImg.style.opacity = 1;
        }, 200);
    };

    // Make lightbox image opacity transitionable
    lightboxImg.style.transition = 'opacity 0.2s ease, transform 0.4s cubic-bezier(0.2, 1, 0.3, 1)';

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent background click
        showImage(currentIndex + 1);
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent background click
        showImage(currentIndex - 1);
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    });

    // Touch Swipe Navigation for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            showImage(currentIndex + 1); // Swipe left, go next
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            showImage(currentIndex - 1); // Swipe right, go prev
        }
    };
});
