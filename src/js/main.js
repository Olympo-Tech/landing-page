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
    var isDown = false;
    var startX = 0;
    var scrollStart = 0;

    viewport.addEventListener('mousedown', function (e) {
      isDown = true;
      viewport.classList.add('dragging');
      startX = e.pageX - viewport.offsetLeft;
      scrollStart = viewport.scrollLeft;
    });

    viewport.addEventListener('mouseleave', function () {
      isDown = false;
      viewport.classList.remove('dragging');
    });

    viewport.addEventListener('mouseup', function () {
      isDown = false;
      viewport.classList.remove('dragging');
    });

    viewport.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - viewport.offsetLeft;
      var walk = (x - startX);
      viewport.scrollLeft = scrollStart - walk;
    });

    viewport.addEventListener('touchstart', function (e) {
      isDown = true;
      startX = e.touches[0].pageX - viewport.offsetLeft;
      scrollStart = viewport.scrollLeft;
    }, { passive: false });

    viewport.addEventListener('touchend', function () {
      isDown = false;
    });

    viewport.addEventListener('touchmove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.touches[0].pageX - viewport.offsetLeft;
      var walk = (x - startX);
      viewport.scrollLeft = scrollStart - walk;
    }, { passive: false });
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
