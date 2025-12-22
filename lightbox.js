document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImagesWrapper = document.querySelector('.lightbox-images');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxContainer = document.querySelector('.lightbox-container');
  const lightboxImagesContainer = document.querySelector('.lightbox-images-container');
  const lightboxTextInner = document.querySelector('.lightbox-text-inner');

  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Open+Sans&display=swap';
  document.head.appendChild(fontLink);

  const style = document.createElement('style');
  style.textContent = `
    body, button, input, textarea {
      font-family: 'Open Sans', sans-serif !important;
    }

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
    }

    .lightbox-images {
      display: flex;
      flex-direction: column;
      gap: 30px; /* Consistent gap between all media */
      width: 100%;
      align-items: center;
    }

    /* THE MASTER WIDTH COMMAND */
    .lightbox-img, 
    .lightbox-video {
      width: 90% !important;               
      max-width: 1100px !important;
      margin: 0 auto !important;
      display: block !important;
      border: none;
    }

    .lightbox-img {
      height: auto;
    }

    .lightbox-video {
      /* Uses standard 16:9 but allows the browser to adjust if the video is slimmer */
      aspect-ratio: 16 / 9;
      height: auto !important; 
      background: #fff; /* Matches your lightbox background */
    }

    .lightbox-text {
      width: 250px;
      padding: 20px;
      background: white;
      position: sticky;
      top: 50px;
      align-self: flex-start;
      border-left: 1px solid #eee;
      margin-left: 20px;
    }
  `;
  document.head.appendChild(style);

  window.addEventListener('message', function(event) {
    if (event.data.type === 'openLightbox') {
      const clickedSrc = event.data.src;
      lightboxImagesWrapper.innerHTML = "";
      const imgObj = images.find(img => img.src === clickedSrc);

      lightboxTextInner.textContent = (imgObj && imgObj.text) ? imgObj.text : "";

      let sources = (imgObj && imgObj.group && imgObj.group.length > 0) ? imgObj.group : [];

      sources.forEach((src, index) => {
        let element;
        const isVideo = src.includes("player.vimeo.com");

        if (isVideo) {
          element = document.createElement('iframe');
          element.src = src;
          element.classList.add('lightbox-video');
          element.setAttribute('allow', 'autoplay; fullscreen');
          
          /* By setting these to 100%, the iframe fills the 90% width 
             but the aspect-ratio in the CSS controls the height.
          */
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
        } else if (index === 0) {
          lightboxContainer.classList.remove('landscape', 'portrait');
          lightboxContainer.classList.add('landscape');
        }
      });

      lightbox.style.display = 'block';
      lightboxImagesContainer.scrollTop = 0;
    }
  });

  lightboxClose.onclick = () => { lightbox.style.display = 'none'; };
  window.onclick = (event) => { if (event.target === lightbox) { lightbox.style.display = 'none'; } };
});
