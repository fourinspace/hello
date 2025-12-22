document.addEventListener('DOMContentLoaded', () => {
  const menu = document.getElementById('menu');
  const menuToggle = document.getElementById('menuToggle');
  const contentArea = document.getElementById('contentArea');
  const homeBtn = document.getElementById('homeBtn');
  const workBtn = document.querySelector('#workItem .menu-btn');
  const initialVideoURL = "https://stream.mux.com/q00jL1eCze5gsW3wRIBqDkP4x2xPGlcacZc1FUULt7Jo.m3u8";
  const headerWorkMenu = document.getElementById('headerWorkMenu'); 
  const aboutItem = document.getElementById('aboutItem');
  const contactItem = document.getElementById('contactItem');

  function syncButton() {
    const open = !menu.classList.contains('collapsed');
    menuToggle.classList.toggle('active', open);
    if (open) {
      aboutItem.classList.add('open');
      contactItem.classList.add('open');
    } else {
      aboutItem.classList.remove('open');
      contactItem.classList.remove('open');
      document.getElementById('workItem').classList.remove('open');
    }
  }

  menuToggle.addEventListener('click', () => {
    menu.classList.toggle('collapsed');
    syncButton();
  });

  menu.addEventListener('click', (e) => {
    const btn = e.target.closest('.menu-btn');
    if (!btn) return;
    if (btn === workBtn) {
      loadWorkContent('all');
      btn.closest('li').classList.add('open');
      return;
    }
    if (menu.classList.contains('collapsed')) {
      menu.classList.remove('collapsed');
      syncButton();
    }
  });

  function loadHomeContent() {
    contentArea.innerHTML = `
      <div class="align-wrapper">
        <div class="video-wrapper">
          <video autoplay muted loop><source src="${initialVideoURL}" type="video/mp4"></video>
        </div>
      </div>`;
    headerWorkMenu.classList.remove('is-active');
  }

  function loadWorkContent(filter = 'all') {
    const filteredImages = getFilteredImages(filter);
    const imagesHTML = filteredImages.map(img => `<img src="${img.src}" alt="${img.alt}">`).join('');
    const workHTML = `
      <html><head><style>
        body { margin: 0; padding: 20px 20px 10px 0; background: white; }
        .work-gallery { column-count: 3; column-gap: 5px; }
        .work-gallery img { width: 100%; height: auto; margin-bottom: 5px; display: block; cursor: pointer; break-inside: avoid; }
        @media (max-width: 1024px) { .work-gallery { column-count: 2; } }
        @media (max-width: 768px) { .work-gallery { column-count: 1; } }
      </style></head>
      <body><div class="work-gallery">${imagesHTML}</div>
      <script>
        document.querySelectorAll('img').forEach(img => {
          img.onclick = () => window.parent.postMessage({type: 'openLightbox', src: img.src}, '*');
        });
      <\/script></body></html>`;

    const workDataURL = "data:text/html;charset=utf-8," + encodeURIComponent(workHTML);
    contentArea.innerHTML = `<div class="align-wrapper"><div class="work-iframe-wrapper"><iframe src="${workDataURL}"></iframe></div></div>`;
    headerWorkMenu.classList.add('is-active');
  }

  homeBtn.onclick = loadHomeContent;
  document.getElementById('logoLink').onclick = (e) => { e.preventDefault(); loadHomeContent(); };
  workBtn.onclick = () => loadWorkContent('all');

  document.querySelectorAll('.submenu-btn').forEach(btn => {
    btn.onclick = () => loadWorkContent(btn.dataset.filter);
  });

  loadHomeContent();
});
