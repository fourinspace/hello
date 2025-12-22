document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImagesWrapper = document.querySelector('.lightbox-images');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxContainer = document.querySelector('.lightbox-container');
  const lightboxImagesContainer = document.querySelector('.lightbox-images-container');
  const lightboxTextInner = document.querySelector('.lightbox-text-inner');

  // Inject Open Sans font
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Open+Sans&display=swap';
  document.head.appendChild(fontLink);

  const style = document.createElement('style');
  style.textContent = `
    body, button, input, textarea {
      font-family: 'Open Sans', sans-serif !important;
    }

    /* CONTAINER STYLES */
    .lightbox-images-container {
      flex: 1;
      overflow-y: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
      background: white;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 30px 0;
      scroll-padding-top: 30px;
    }
    .lightbox-images-container::-webkit-scrollbar { display: none; }

    .lightbox-images {
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 20px;
      min-height: 100%;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
    }

    /* THE SHARED COMMAND: Width is the master trigger */
    .lightbox-img, 
    .lightbox-video {
      width: 90%;               
      max-width: 1100px;
      margin: 0 auto;
      display: block;
      box-sizing: border-box;
      border: none;
    }

    .lightbox-img {
      height: auto;
    }

    .lightbox-video {
      /* This forces the player to follow the width, not the video quality */
      aspect-ratio: 16 / 9;
      height: auto; 
    }

    /* TEXT PANEL STYLES */
    .lightbox-text {
      width: 250px;
      padding: 20px;
      background: white;
      position: sticky;
      top: 50px;
      align-self: flex-start;
      border-left: 1px solid #eee;
      height: fit-content;
      margin-left: 20px;
    }
    .lightbox-text-inner { display: inline; }
  `;
  document.head.appendChild(style);

  window.addEventListener('message', function(event) {
    if (event.data.type === 'openLightbox') {
      const clickedSrc = event.data.src;

      // Clear previous content
      lightboxImagesWrapper.innerHTML = "";

      const imgObj = images.find(img => img.src === clickedSrc);

      // Set text
      if (imgObj && imgObj.text) {
        lightboxTextInner.textContent = imgObj.text;
      } else {
        lightboxTextInner.textContent = "";
      }

      // Load group
      let sources = (imgObj && imgObj.group && imgObj.group.length > 0) ? imgObj.group : [];

      sources.forEach((src, index) => {
        let element;
        const isVideo = src.includes("player.vimeo.com");

        if (isVideo) {
          element = document.createElement('iframe');
          element.src = src;
          element.classList.add('lightbox-video');
          element.setAttribute('allow', 'autoplay; fullscreen');
          
          // Force iframe attributes to fill the CSS container
          element.setAttribute('width', '100%');
          element.setAttribute('height', '100%');
        } else {
          element = document.createElement('img');
          element.src = src;
          element.classList.add('lightbox-img');
        }

        lightboxImagesWrapper.appendChild(element);

        if (!isVideo) {
          element.onload = function() {
            if (index === 0) {
              const isLandscape = this.naturalWidth > this.naturalHeight;
              lightboxContainer.classList.remove('landscape', 'portrait');
              lightboxContainer.classList.add(isLandscape ? 'landscape' : 'portrait');
            }
          };
        } else {
          if (index === 0) {
            lightboxContainer.classList.remove('landscape', 'portrait');
            lightboxContainer.classList.add('landscape');
          }
        }
      });

      lightbox.style.display = 'block';
      lightboxImagesContainer.scrollTop = 0;
    }
  });

  lightboxClose.onclick = () => {
    lightbox.style.display = 'none';
  };

  window.onclick = (event) => {
    if (event.target === lightbox) {
      lightbox.style.display = 'none';
    }
  };
});
