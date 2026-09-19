const headerMarkup = `
  <header class="site-header" data-site-header>
    <div class="header-inner">
      <a class="brand" href="index.html" aria-label="Garzón Institute home">
        <span class="brand-symbol" aria-hidden="true"></span>
        <span>GARZÓN<br>INSTITUTE</span>
      </a>
      <nav class="header-links" aria-label="Primary navigation">
        <a href="about.html" data-nav="about">About</a>
        <a href="index.html#projects" data-nav="projects">Projects</a>
        <a href="news.html" data-nav="news">Stories</a>
        <a href="connect.html" data-nav="connect">Connect</a>
        <a class="header-cta" href="https://buymeacoffee.com/rikuna_project" target="_blank" rel="noopener">Support</a>
      </nav>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu-panel" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
  <div class="menu-panel" id="menu-panel" aria-hidden="true">
    <nav aria-label="Mobile navigation">
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="rikuna.html">Rikuna</a>
      <a href="water-y.html">Water-Y</a>
      <a href="co-emprende.html">Co-Emprende</a>
      <a href="news.html">Stories</a>
      <a href="connect.html">Connect</a>
    </nav>
  </div>`;

const footerMarkup = `
  <footer class="footer">
    <div class="container footer__top">
      <div>
        <img class="footer-logo" src="assets/brand/garzon-logo-transparent.png" alt="Garzón Institute" loading="lazy">
        <a class="brand" href="index.html" aria-label="Garzón Institute home">
          <span class="brand-symbol" aria-hidden="true"></span>
          <span>GARZÓN<br>INSTITUTE</span>
        </a>
        <p class="footer__mission">Science, water, and community-led action for a more resilient future—from the Ecuadorian Amazon to every place where knowledge can become change.</p>
      </div>
      <div>
        <div class="footer__heading">Explore</div>
        <nav class="footer__links" aria-label="Footer navigation">
          <a href="about.html">About &amp; Team</a>
          <a href="rikuna.html">Rikuna</a>
          <a href="water-y.html">Water-Y</a>
          <a href="co-emprende.html">Co-Emprende</a>
          <a href="news.html">Stories &amp; Press</a>
        </nav>
      </div>
      <div>
        <div class="footer__heading">Stay close</div>
        <nav class="footer__links" aria-label="Social links">
          <a href="https://www.instagram.com/rikunacenter/" target="_blank" rel="noopener">Instagram / Rikuna</a>
          <a href="https://www.facebook.com/CentroRikuna" target="_blank" rel="noopener">Facebook / Rikuna</a>
          <a href="https://www.instagram.com/_water_y/" target="_blank" rel="noopener">Instagram / Water-Y</a>
          <a href="mailto:garzondomenica@gmail.com">garzondomenica@gmail.com</a>
          <a href="https://buymeacoffee.com/rikuna_project" target="_blank" rel="noopener">Support the work ↗</a>
        </nav>
      </div>
    </div>
    <div class="container footer__bottom">
      <span>© <span data-year></span> Garzón Institute Corporation (IL)</span>
      <span>Research · Education · Conservation · Community</span>
    </div>
  </footer>`;

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('[data-site-header]')?.replaceWith(document.createRange().createContextualFragment(headerMarkup));
  document.querySelector('[data-site-footer]')?.replaceWith(document.createRange().createContextualFragment(footerMarkup));

  const bodyPage = document.body.dataset.page;
  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.dataset.nav === bodyPage || (bodyPage === 'home' && link.dataset.nav === 'projects' && location.hash === '#projects')) {
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

  document.querySelectorAll('[data-year]').forEach(node => { node.textContent = new Date().getFullYear(); });
});
