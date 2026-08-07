(function($) {
  "use strict"; // Start of use strict

  var isAutoScrolling = false;
  var autoScrollTimer = null;

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        var destination = target.offset().top - 48;

        isAutoScrolling = true;
        if (autoScrollTimer) {
          clearTimeout(autoScrollTimer);
        }

        $('html, body').stop(true).animate({
          scrollTop: destination
        }, 600, "easeInOutExpo", function() {
          autoScrollTimer = setTimeout(function() {
            isAutoScrolling = false;
            updateActiveNav();
          }, 40);
        });

        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Keeps sidebar section state in sync with viewport position.
  var navLinks = $('#sideNav .navbar-nav .js-scroll-trigger[href^="#"]');
  var sections = navLinks.map(function() {
    var target = $($(this).attr('href'));
    return target.length ? target[0] : null;
  }).get();

  function updateActiveNav() {
    var scrollPosition = $(window).scrollTop() + 150;
    var currentId = sections.length ? sections[0].id : '';

    sections.forEach(function(section) {
      if (scrollPosition >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.removeClass('active');
    if (currentId) {
      $('#sideNav .navbar-nav .js-scroll-trigger[href="#' + currentId + '"]').addClass('active');
    }
  }

  // Adds subtle navbar elevation after scrolling.
  $(window).on('scroll', function() {
    if ($(this).scrollTop() > 12) {
      $('#sideNav').addClass('navbar-shrink');
    } else {
      $('#sideNav').removeClass('navbar-shrink');
    }

    if (!isAutoScrolling) {
      updateActiveNav();
    }
  });

  $(window).on('resize load', function() {
    updateActiveNav();
  });

  navLinks.on('click', function() {
    navLinks.removeClass('active');
    $(this).addClass('active');
  });

  // Prevent anchor buttons from remaining in focused visual state after click.
  $('.cta-row .btn').on('mouseup touchend', function() {
    $(this).blur();
  });

})(jQuery); // End of use strict
