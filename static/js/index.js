window.HELP_IMPROVE_VIDEOJS = false;

$(document).ready(function() {
  var $window = $(window);
  var $body = $('body');
  var navItems = Array.prototype.slice.call(document.querySelectorAll('.paper-navbar .navbar-item[href^="#"]'));
  var navSections = navItems.map(function(item) {
    var selector = item.getAttribute('href');
    return document.querySelector(selector);
  }).filter(Boolean);

  function updateNavbarState() {
    if ($window.scrollTop() > 48) {
      $body.addClass('has-scrolled');
    } else {
      $body.removeClass('has-scrolled');
    }
  }

  $('.navbar-burger').click(function() {
    var target = $(this).data('target');
    $(this).toggleClass('is-active');
    $('#' + target).toggleClass('is-active');
  });

  navItems.forEach(function(item) {
    item.addEventListener('click', function() {
      var targetSelector = item.getAttribute('href');
      var targetElement = document.querySelector(targetSelector);

      if (!targetElement) {
        return;
      }

      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      $('.navbar-burger').removeClass('is-active');
      $('#paper-navbar-menu').removeClass('is-active');
    });
  });

  updateNavbarState();
  $window.on('scroll', updateNavbarState);

  if ('IntersectionObserver' in window && navSections.length > 0) {
    var activeSectionObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) {
          return;
        }

        navItems.forEach(function(item) {
          var isTarget = item.getAttribute('href') === '#' + entry.target.id;
          item.classList.toggle('is-active', isTarget);
        });
      });
    }, {
      rootMargin: '-35% 0px -45% 0px',
      threshold: [0.15, 0.35, 0.6]
    });

    navSections.forEach(function(section) {
      activeSectionObserver.observe(section);
    });
  }

  if (typeof bulmaCarousel !== 'undefined') {
    bulmaCarousel.attach('.carousel', {
      slidesToScroll: 1,
      slidesToShow: 3,
      loop: true,
      infinite: true,
      autoplay: false,
      autoplaySpeed: 3000
    });
  }

  if (typeof bulmaSlider !== 'undefined') {
    bulmaSlider.attach();
  }

  var managedVideos = Array.prototype.slice.call(document.querySelectorAll('#paper-video video'));

  if ('IntersectionObserver' in window && managedVideos.length > 0) {
    var videoObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        var video = entry.target;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          var playPromise = video.play();

          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function() {
              video.muted = true;
              video.play().catch(function() {});
            });
          }
        } else {
          video.pause();
        }
      });
    }, {
      threshold: [0.6]
    });

    managedVideos.forEach(function(video) {
      video.setAttribute('playsinline', '');
      videoObserver.observe(video);
    });
  }
});
