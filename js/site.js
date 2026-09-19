const headerMarkup = `
  <header class="site-header" data-site-header>
    <div class="header-inner">
      <a class="brand-lockup" href="index.html" aria-label="Garzon Institute home">
        <img src="assets/brand/garzon-logo-cutout.png" alt="Garzon Institute">
      </a>
      <nav class="header-links" aria-label="Primary navigation">
        <a href="about.html" data-nav="about" data-i18n-key="nav.about">About</a>
        <a href="index.html#projects" data-nav="projects" data-i18n-key="nav.projects">Projects</a>
        <a href="news.html" data-nav="news" data-i18n-key="nav.stories">Stories</a>
        <a href="connect.html" data-nav="connect" data-i18n-key="nav.connect">Connect</a>
        <a class="header-cta" href="https://buymeacoffee.com/rikuna_project" target="_blank" rel="noopener" data-i18n-key="nav.support">Support</a>
      </nav>
      <button class="language-toggle" type="button" aria-label="Switch language">ES</button>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu-panel" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
  <div class="menu-panel" id="menu-panel" aria-hidden="true">
    <nav aria-label="Mobile navigation">
      <a href="index.html" data-i18n-key="nav.home">Home</a>
      <a href="about.html" data-i18n-key="nav.about">About</a>
      <a href="rikuna.html">Rikuna</a>
      <a href="water-y.html">Water-Y</a>
      <a href="co-emprende.html">Co-Emprende</a>
      <a href="news.html" data-i18n-key="nav.stories">Stories</a>
      <a href="connect.html" data-i18n-key="nav.connect">Connect</a>
    </nav>
  </div>`;

const footerMarkup = `
  <footer class="footer">
    <div class="container footer__top">
      <div>
        <a class="footer-logo-link" href="index.html" aria-label="Garzon Institute home">
          <img class="footer-logo" src="assets/brand/garzon-logo-cutout.png" alt="Garzon Institute" loading="lazy">
        </a>
        <p class="footer__mission">Science, water, and community-led action for a more resilient future—from the Ecuadorian Amazon to every place where knowledge can become change.</p>
      </div>
      <div>
        <div class="footer__heading" data-i18n-key="footer.explore">Explore</div>
        <nav class="footer__links" aria-label="Footer navigation">
          <a href="about.html" data-i18n-key="footer.about">About &amp; Team</a>
          <a href="rikuna.html">Rikuna</a>
          <a href="water-y.html">Water-Y</a>
          <a href="co-emprende.html">Co-Emprende</a>
          <a href="news.html" data-i18n-key="footer.stories">Stories &amp; Press</a>
        </nav>
      </div>
      <div>
        <div class="footer__heading" data-i18n-key="footer.stay">Stay close</div>
        <div class="footer__social-groups">
          <div>
            <div class="footer__heading">Rikuna</div>
            <nav class="footer__links" aria-label="Rikuna social links">
              <a href="https://www.instagram.com/rikunacenter/" target="_blank" rel="noopener">Instagram ↗</a>
              <a href="https://www.facebook.com/CentroRikuna" target="_blank" rel="noopener">Facebook ↗</a>
            </nav>
          </div>
          <div>
            <div class="footer__heading">Water-Y</div>
            <nav class="footer__links" aria-label="Water-Y social links">
              <a href="https://www.instagram.com/_water_y/" target="_blank" rel="noopener">Instagram ↗</a>
              <a href="https://www.facebook.com/waterYoficial" target="_blank" rel="noopener">Facebook ↗</a>
              <a href="https://x.com/_Water_Y" target="_blank" rel="noopener">X ↗</a>
            </nav>
          </div>
        </div>
      </div>
    </div>
    <div class="container footer__bottom">
      <span>© <span data-year></span> Garzon Institute</span>
      <span>Research · Education · Conservation · Community</span>
    </div>
  </footer>`;

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('[data-site-header]')?.replaceWith(document.createRange().createContextualFragment(headerMarkup));
  document.querySelector('[data-site-footer]')?.replaceWith(document.createRange().createContextualFragment(footerMarkup));

  const bodyPage = document.body.dataset.page;
  const projectPages = ['rikuna', 'water-y', 'co-emprende'];
  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.dataset.nav === bodyPage || (projectPages.includes(bodyPage) && link.dataset.nav === 'projects') || (bodyPage === 'home' && link.dataset.nav === 'projects' && location.hash === '#projects')) {
      link.setAttribute('aria-current', 'page');
    }
  });

  const header = document.querySelector('.site-header');
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 32);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu-panel');
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    toggle?.setAttribute('aria-expanded', String(open));
    menu?.setAttribute('aria-hidden', String(!open));
  };
  toggle?.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(node => revealObserver.observe(node));

  const parallaxNodes = document.querySelectorAll('[data-parallax]');
  const moveParallax = () => {
    parallaxNodes.forEach(node => {
      const rect = node.getBoundingClientRect();
      const amount = Math.max(-22, Math.min(22, (window.innerHeight / 2 - (rect.top + rect.height / 2)) * .035));
      node.style.transform = `translateY(${amount}px) scale(1.05)`;
    });
  };
  if (parallaxNodes.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    moveParallax();
    window.addEventListener('scroll', moveParallax, { passive: true });
  }

  document.querySelectorAll('video[autoplay]').forEach(video => {
    const startVideo = () => video.play().catch(() => {});
    startVideo();
    new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) startVideo(); });
    }, { threshold: .15 }).observe(video);
  });

  document.querySelectorAll('[data-year]').forEach(node => { node.textContent = new Date().getFullYear(); });

  const languageCopy = {
    'nav.home': ['Home', 'Inicio'],
    'nav.about': ['About', 'Instituto'],
    'nav.projects': ['Projects', 'Proyectos'],
    'nav.stories': ['Stories', 'Historias'],
    'nav.connect': ['Connect', 'Contacto'],
    'nav.support': ['Support', 'Apoyar'],
    'footer.explore': ['Explore', 'Explorar'],
    'footer.about': ['About & Team', 'Instituto y equipo'],
    'footer.stories': ['Stories & Press', 'Historias y prensa'],
    'footer.stay': ['Stay close', 'Mantente cerca'],
    'footer.support': ['Support the work ↗', 'Apoya el trabajo ↗']
  };
  const normalize = value => value.replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
  const pageMap = window.GARZON_I18N?.[bodyPage] || {};
  const rawTextMap = { ...(window.GARZON_I18N?.common || {}), ...pageMap };
  const textMap = Object.fromEntries(Object.entries(rawTextMap).map(([key, value]) => [normalize(key), value]));
  const languageButton = document.querySelector('.language-toggle');
  let currentLanguage = localStorage.getItem('garzon-language') === 'es' ? 'es' : 'en';

  const applyLanguage = language => {
    currentLanguage = language;
    document.documentElement.lang = language;
    const titlePair = window.GARZON_I18N?.titles?.[bodyPage];
    if (titlePair) document.title = titlePair[language === 'es' ? 1 : 0];

    document.querySelectorAll('[data-i18n-key]').forEach(node => {
      const pair = languageCopy[node.dataset.i18nKey];
      if (pair) node.innerHTML = pair[language === 'es' ? 1 : 0];
    });

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.parentElement?.closest('script, style, [data-i18n-key]') && !node.parentElement?.matches('[data-year]')) nodes.push(node);
    }
    nodes.forEach(node => {
      if (node._garzonEnglish === undefined) node._garzonEnglish = node.nodeValue;
      const original = node._garzonEnglish;
      const key = normalize(original);
      const translated = language === 'es' ? textMap[key] : null;
      if (language === 'en') {
        node.nodeValue = original;
        return;
      }
      const replacement = translated || key;
      const leading = original.match(/^\s*/)?.[0] || '';
      const trailing = original.match(/\s*$/)?.[0] || '';
      node.nodeValue = `${leading}${replacement}${trailing}`;
    });

    if (languageButton) {
      languageButton.textContent = language === 'es' ? 'EN' : 'ES';
      languageButton.setAttribute('aria-label', language === 'es' ? 'Cambiar a ingles' : 'Switch to Spanish');
    }
    document.querySelector('.menu-toggle')?.setAttribute('aria-label', language === 'es' ? 'Abrir menu' : 'Open menu');
  };

  languageButton?.addEventListener('click', () => {
    const nextLanguage = currentLanguage === 'en' ? 'es' : 'en';
    localStorage.setItem('garzon-language', nextLanguage);
    applyLanguage(nextLanguage);
  });
  applyLanguage(currentLanguage);
});
