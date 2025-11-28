document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImagesWrapper = document.querySelector('.lightbox-images');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxContainer = document.querySelector('.lightbox-container');
  const lightboxImagesContainer = document.querySelector('.lightbox-images-container');

  // Reference to existing text field
  const lightboxTextInner = document.querySelector('.lightbox-text-inner');

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
    .lightbox-video {
      width: 100%;
      height: 100%;
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

      // Set the text from images.js
      if (imgObj && imgObj.text) {
        lightboxTextInner.textContent = imgObj.text;
      } else {
        lightboxTextInner.textContent = "";
      }

      // Only use the group defined in images.js
      let sources = [];
      if (imgObj && imgObj.group && imgObj.group.length > 0) {
        sources = imgObj.group;
      } else {
        return; // nothing to show
      }

      // Render all sources in order (image or Vimeo)
      sources.forEach((src, index) => {
        let element;

        // --- VIMEO DETECTED ---
        if (src.includes("player.vimeo.com")) {
          element = document.createElement('iframe');
          element.src = src;
          element.frameBorder = "0";
          element.allow = "autoplay; fullscreen; picture-in-picture";
          element.setAttribute("allowfullscreen", "");
          element.classList.add('lightbox-video');

          // Videos are landscape by nature
          if (index === 0) {
            lightboxContainer.classList.remove('landscape', 'portrait');
            lightboxContainer.classList.add('landscape');
          }

        } else {
          // --- NORMAL IMAGE ---
          element = document.createElement('img');
          element.src = src;
          element.classList.add('lightbox-img');

          element.onload = function() {
            if (index === 0) {
              const isLandscape = this.naturalWidth > this.naturalHeight;
              lightboxContainer.classList.remove('landscape', 'portrait');
              lightboxContainer.classList.add(isLandscape ? 'landscape' : 'portrait');
            }
          };
        }

        lightboxImagesWrapper.appendChild(element);
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
