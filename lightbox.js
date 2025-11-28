document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImagesWrapper = document.querySelector('.lightbox-images');
  const lightboxClose = document.getElementById('lightboxClose');
  const items = document.querySelectorAll('.gallery-item');

  let currentIndex = 0;
  let currentItems = [];

  function openLightbox(index, itemsArray) {
    currentIndex = index;
    currentItems = itemsArray;

    updateLightbox();
    lightbox.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  function updateLightbox() {
    const item = currentItems[currentIndex];
    lightboxImagesWrapper.innerHTML = '';

    // --- IMAGE ---
    if (item.src) {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt || '';
      img.classList.add('lightbox-media'); // ensures same styling
      lightboxImagesWrapper.appendChild(img);
    }

    // --- VIDEO ---
    if (item.group && item.group.length > 0) {
      const videoUrl = item.group[0];

      const iframe = document.createElement('iframe');
      iframe.src = videoUrl;
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
      iframe.allowFullscreen = true;

      iframe.classList.add('lightbox-media'); // SAME SIZE AS IMAGES

      lightboxImagesWrapper.appendChild(iframe);
    }

    // TEXT
    if (item.text) {
      const textBox = document.createElement('div');
      textBox.classList.add('lightbox-text');
      textBox.innerText = item.text;
      lightboxImagesWrapper.appendChild(textBox);
    }
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  lightboxClose.addEventListener('click', closeLightbox);

  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      const data = window.galleryData; 
      openLightbox(index, data);
    });
  });

  // Navigation
  document.getElementById('lightboxPrev').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
    updateLightbox();
  });

  document.getElementById('lightboxNext').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentItems.length;
    updateLightbox();
  });
});
