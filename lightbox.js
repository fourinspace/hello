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
      gap: 20px;
      width: 100%;
      align-items: center;
    }

    /* THE SHARED COMMAND for both images and video containers */
    .lightbox-img, 
    .video-wrapper {
      width: 90% !important;               
      max-width: 1100px !important;
      margin: 0 auto !important;
      display: block !important;
      border: none !important; /* Removed all ghost borders */
    }

    .lightbox-img {
      height: auto;
    }

    /* THE BOX THAT FORCES THE VIDEO TO BE BIG */
    .video-wrapper {
      position: relative;
      padding-bottom: 56.25%; /* Forces 16:9 ratio based on WIDTH */
      height: 0;
      overflow: hidden;
      background: #fff; /* Match page background */
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .video-wrapper iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100% !important;
      height: 100% !important;
      border: 0;
      opacity: 0; /* Hidden until loaded */
      transition: opacity 0.4s ease;
      z-index: 2;
    }

    .video-wrapper iframe.loaded {
      opacity: 1;
    }

    /* PIXEL LOADER STYLES */
    .pixel-loader-ui {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 1;
    }

    .pixel-label {
      font-family: 'Courier New', Courier, monospace;
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 10px;
      letter-spacing: 2px;
      color: #000;
    }

    .pixel-bar-outline {
      width: 180px;
      height: 16px;
      border: 3px solid #000;
      padding: 2px;
      background: #fff;
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
          // 1. Create the "Force Box"
          const wrapper = document.createElement('div');
          wrapper.classList.add('video-wrapper');

          // 2. Create the Loader UI
          const loaderUI = document.createElement('div');
          loaderUI.classList.add('pixel-loader-ui');
          
          const label = document.createElement('div');
          label.classList.add('pixel-label');
          label.innerText = "LOADING...";
          
          const barOutline = document.createElement('div');
          barOutline.classList.add('pixel-bar-outline');
          const barFill = document.createElement('div');
          barFill.classList.add('pixel-bar-fill');
          
          barOutline.appendChild(barFill);
          loaderUI.appendChild(label);
          loaderUI.appendChild(barOutline);
          wrapper.appendChild(loaderUI);

          // 3. Put the video inside it
          const iframe = document.createElement('iframe');
          iframe.src = src;
          iframe.setAttribute('allow', 'autoplay; fullscreen');
          iframe.setAttribute('frameborder', '0');
          
          // 4. Reveal video when loaded
          iframe.onload = function() {
            iframe.classList.add('loaded');
            loaderUI.style.display = 'none';
          };
          
          wrapper.appendChild(iframe);
          element = wrapper;
        } else {
          element = document.createElement('img');
          element.src = src;
          element.classList.add('lightbox-img');
        }

        lightboxImagesWrapper.appendChild(element);

        // Handle Landscape/Portrait switching
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
