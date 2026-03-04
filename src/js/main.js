document.addEventListener('DOMContentLoaded', function () {
  var labels = [
    'Administração de Sistemas',
    'API',
    'Atendimento Funerário',
    'Cemitério',
    'Caixa',
    'Compras e Suprimentos',
    'Contas a Pagar',
    'Contas a Receber',
    'Contratos',
    'CRM',
    'Dashboard & Analytics',
    'Financeiro',
    'Produtos',
    'Serviços',
    'Frotas',
    'Nota Fiscal'
  ];

  var track = document.getElementById('modulesCarouselTrack');
  if (track) {
    function buildItems(arr) {
      var frag = document.createDocumentFragment();
      arr.forEach(function (label) {
        var a = document.createElement('a');
        a.className = 'carousel-item';
        a.textContent = label.toUpperCase();
        a.href = '#features';
        frag.appendChild(a);
      });
      return frag;
    }
    track.appendChild(buildItems(labels));
    track.appendChild(buildItems(labels));
  }

  // Names belt (estreito, entre Sobre e Módulos)
  var beltTrack = document.getElementById('namesBeltTrack');
  if (beltTrack) {
    function buildNameItems(arr) {
      var frag = document.createDocumentFragment();
      arr.forEach(function (label) {
        var div = document.createElement('div');
        div.className = 'names-belt-item';
        div.textContent = label.toUpperCase();
        frag.appendChild(div);
      });
      return frag;
    }
    beltTrack.appendChild(buildNameItems(labels));
    beltTrack.appendChild(buildNameItems(labels)); // duplicado para loop contínuo
  }

  var viewport = document.getElementById('dragCardsViewport');
  if (viewport) {
    var isDown = false, startX = 0, scrollStart = 0;
    var velX = 0, lastMouseX = 0, lastMoveTime = 0, animFrame = null;
    var nudgeTimer1 = null, nudgeTimer2 = null;
    var dragWrapper = viewport.parentElement;
    var dragHint = dragWrapper ? dragWrapper.querySelector('.drag-hint') : null;

    function hideHint() {
      if (dragHint) dragHint.classList.add('hidden');
      if (dragWrapper) dragWrapper.classList.add('scrolled');
      viewport.removeEventListener('mousedown', hideHint);
      viewport.removeEventListener('touchstart', hideHint);
      viewport.removeEventListener('scroll', hideHint);
    }

    function cancelNudge() {
      clearTimeout(nudgeTimer1);
      clearTimeout(nudgeTimer2);
    }

    function applyMomentum() {
      if (Math.abs(velX) < 0.5) return;
      viewport.scrollLeft += velX;
      velX *= 0.90;
      animFrame = requestAnimationFrame(applyMomentum);
    }

    /* Desktop: mouse drag com inércia */
    viewport.addEventListener('mousedown', function (e) {
      cancelNudge();
      hideHint();
      cancelAnimationFrame(animFrame);
      isDown = true;
      viewport.classList.add('dragging');
      startX = e.pageX - viewport.offsetLeft;
      scrollStart = viewport.scrollLeft;
      lastMouseX = e.pageX;
      lastMoveTime = Date.now();
      velX = 0;
    });

    function endDrag() {
      if (!isDown) return;
      isDown = false;
      viewport.classList.remove('dragging');
      animFrame = requestAnimationFrame(applyMomentum);
    }

    viewport.addEventListener('mouseup', endDrag);
    viewport.addEventListener('mouseleave', endDrag);

    viewport.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - viewport.offsetLeft;
      viewport.scrollLeft = scrollStart - (x - startX);
      var now = Date.now();
      velX = (lastMouseX - e.pageX) / Math.max(now - lastMoveTime, 1) * 14;
      lastMouseX = e.pageX;
      lastMoveTime = now;
    });

    /* Mobile: browser gerencia nativamente */
    viewport.addEventListener('touchstart', function () {
      cancelNudge();
      hideHint();
    }, { passive: true });

    viewport.addEventListener('mousedown', hideHint);
    viewport.addEventListener('touchstart', hideHint, { passive: true });
    viewport.addEventListener('scroll', hideHint);

    /* Nudge de load */
    nudgeTimer1 = setTimeout(function () {
      var firstCard = viewport.querySelector('.drag-card');
      if (!firstCard) return;
      viewport.scrollTo({ left: Math.round(firstCard.offsetWidth * 0.65), behavior: 'smooth' });
      nudgeTimer2 = setTimeout(function () {
        viewport.scrollTo({ left: 0, behavior: 'smooth' });
      }, 900);
    }, 1400);
  }

  // Header interaction on scroll
  var header = document.querySelector('.header');
  if (header) {
    var toggleHeaderShadow = function () {
      if (window.scrollY > 10) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    };
    toggleHeaderShadow();
    window.addEventListener('scroll', toggleHeaderShadow);
  }

  // Smooth scroll behavior for internal links (for better UX on older browsers)
  var internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href').substring(1);
      var target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Mobile menu toggle
  var mobileToggle = document.querySelector('.nav-mobile-toggle');
  var navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('is-open');
      mobileToggle.classList.toggle('is-open', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('is-open');
        mobileToggle.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Contact form submission
  var contactForm = document.getElementById('contactForm');
  var formMessage = document.getElementById('formMessage');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      var submitBtn = contactForm.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      var data = {
        name:    contactForm.elements['name'].value.trim(),
        email:   contactForm.elements['email'].value.trim(),
        phone:   contactForm.elements['phone'].value.trim(),
        company: contactForm.elements['company'].value.trim(),
        role:    contactForm.elements['role'].value.trim(),
        message: contactForm.elements['message'].value.trim(),
      };

      try {
        await submitContactForm(data);
        formMessage.textContent = 'Mensagem enviada! Em breve entraremos em contato.';
        formMessage.className = 'form-message success';
        contactForm.reset();
      } catch (err) {
        formMessage.textContent = 'Ops! Não foi possível enviar. Tente novamente ou entre em contato pelo WhatsApp.';
        formMessage.className = 'form-message error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Mensagem';
      }
    });
  }

  // Reveal sections on scroll
  var revealTargets = document.querySelectorAll(
    '.hero, .about, .features, .modules-drag, .platform-prepared, .contact, .feature-card, .drag-card, .prepared-card, .contact-form-wrapper'
  );

  if ('IntersectionObserver' in window && revealTargets.length) {
    revealTargets.forEach(function (el) {
      el.classList.add('reveal');
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }
});
