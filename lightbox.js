document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImagesWrapper = document.querySelector('.lightbox-images');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxContainer = document.querySelector('.lightbox-container');
  const lightboxImagesContainer = document.querySelector('.lightbox-images-container');

  // Inject Open Sans font into the lightbox
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Open+Sans&display=swap';
  document.head.appendChild(fontLink);

  const style = document.createElement('style');
  style.textContent = `
    body, button, input, textarea {
      font-family: 'Open Sans', sans-serif !important;
    }
  `;
  document.head.appendChild(style);

  window.addEventListener('message', function(event) {
    if (event.data.type === 'openLightbox') {
      const clickedSrc = event.data.src;

      // Clear old content
      lightboxImagesWrapper.innerHTML = "";

      // Look up clicked image in images.js
      const imgObj = images.find(img => img.src === clickedSrc);

      // Only use the group defined in images.js
      let sources = [];
      if (imgObj && imgObj.group && imgObj.group.length > 0) {
        sources = imgObj.group; // exact order you define
      } else {
        return; // if no group is defined, do nothing
      }

      // Render all sources in order
      sources.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.classList.add('lightbox-img');
        lightboxImagesWrapper.appendChild(img);

        img.onload = function() {
          // Only set orientation from the first image in the group
          if (index === 0) {
            const isLandscape = this.naturalWidth > this.naturalHeight;
            lightboxContainer.classList.remove('landscape', 'portrait');
            lightboxContainer.classList.add(isLandscape ? 'landscape' : 'portrait');
          }
        };
      });

      lightbox.style.display = 'block';
      lightboxImagesContainer.scrollTop = 0;
    }
  });

  lightboxClose.onclick = function() {
    lightbox.style.display = 'none';
  };

  window.onclick = function(event) {
    if (event.target === lightbox) {
      lightbox.style.display = 'none';
    }
  };
});
