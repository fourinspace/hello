document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImagesWrapper = document.querySelector('.lightbox-images');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxContainer = document.querySelector('.lightbox-container');
  const lightboxImagesContainer = document.querySelector('.lightbox-images-container');
  const lightboxTextInner = document.querySelector('.lightbox-text-inner');

  // Inject Open Sans
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Open+Sans&display=swap';
  document.head.appendChild(fontLink);

  const style = document.createElement('style');
  style.textContent = `
    body, button, input, textarea { font-family: 'Open Sans', sans-serif !important; }

    .lightbox-images-container {
      flex: 1; overflow-y: auto; scrollbar-width: none; background: white;
      display: flex; justify-content: center; align-items: flex-start; padding: 30px 0;
    }

    .lightbox-images {
      display: flex; flex-direction: column; gap: 30px; width: 100%; align-items: center;
    }

    /* THE VIDEO WRAPPER & RETRO LOADER */
    .video-loader-container {
      position: relative;
      width: 90%;
      max-width: 1100px;
      aspect-ratio: 16 / 9;
      background: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border: 1px solid #eee;
    }

    .pixel-label {
      font-family: 'Courier New', Courier, monospace;
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 10px;
      letter-spacing: 2px;
    }

    .pixel-bar-outline {
      width: 200px;
      height: 20px;
      border: 3px solid #000;
      padding: 2px;
      position: relative;
    }

    .pixel-bar-fill {
      height: 100%;
      background: #000;
      width: 0%;
      animation: fillBar 2s steps(10) infinite;
    }

    @keyframes fillBar {
      0% { width: 0%; }
      50% { width: 100%; }
      100% { width: 100%; }
    }

    /* Video Styling */
    .lightbox-video {
      opacity: 0;
      transition: opacity 0.5s ease;
      position: absolute;
      top: 0; left: 0; width: 100% !important; height: 100% !important;
      z-index: 2;
    }

    .video-loaded { opacity: 1; }

    .lightbox-img {
      width: 90%; max-width: 1100px; height: auto; display: block;
    }

    .lightbox-text {
      width: 250px; padding: 20px; background: white; position: sticky;
      top: 50px; align-self: flex-start; border-left: 1px solid #eee; margin-left: 20px;
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
        const isVideo = src.includes("player.vimeo.com");

        if (isVideo) {
          // 1. Create Container
          const container = document.createElement('div');
          container.classList.add('video-loader-container');

          // 2. Add "LOADING..." Text
          const label = document.createElement('div');
          label.classList.add('pixel-label');
          label.innerText = "LOADING...";
          container.appendChild(label);

          // 3. Add Pixel Bar
          const barOutline = document.createElement('div');
          barOutline.classList.add('pixel-bar-outline');
          const barFill = document.createElement('div');
          barFill.classList.add('pixel-bar-fill');
          barOutline.appendChild(barFill);
          container.appendChild(barOutline);

          // 4. Create Iframe
          const iframe = document.createElement('iframe');
          iframe.src = src;
          iframe.classList.add('lightbox-video');
          iframe.setAttribute('allow', 'autoplay; fullscreen');
          iframe.setAttribute('frameborder', '0');

          // 5. Load Event
          iframe.onload = function() {
            iframe.classList.add('video-loaded');
            // Hide the loader elements
            label.style.display = 'none';
            barOutline.style.display = 'none';
          };

          container.appendChild(iframe);
          lightboxImagesWrapper.appendChild(container);

        } else {
          const img = document.createElement('img');
          img.src = src;
          img.classList.add('lightbox-img');
          lightboxImagesWrapper.appendChild(img);
          
          if (index === 0) {
            img.onload = function() {
              const isLandscape = this.naturalWidth > this.naturalHeight;
              lightboxContainer.classList.remove('landscape', 'portrait');
              lightboxContainer.classList.add(isLandscape ? 'landscape' : 'portrait');
            };
          }
        }
      });

      lightbox.style.display = 'block';
      lightboxImagesContainer.scrollTop = 0;
    }
  });

  lightboxClose.onclick = () => { lightbox.style.display = 'none'; };
  window.onclick = (event) => { if (event.target === lightbox) { lightbox.style.display = 'none'; } };
});
