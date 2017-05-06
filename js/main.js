var pofo = (function(myModule) {
  myModule.smoothScroll = function() {
  /*
   * code source
   * https://css-tricks.com/snippets/jquery/smooth-scrolling/
   */
    // Select all links with hashes
    $('a[href*="#"]')
      // Remove links that don't actually link to anything
      .not('[href="#"]')
      .not('[href="#0"]')
      .click(function(event) {
        // On-page links
        if (
          location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
          && 
          location.hostname == this.hostname
        ) {
          // Figure out element to scroll to
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
          // Does a scroll target exist?
          if (target.length) {
            // Only prevent default if animation is actually gonna happen
            event.preventDefault();
            $('html, body').animate({
              scrollTop: target.offset().top
            }, 1000, function() {
              // Callback after animation
            });
          }
        }
      });
  };
  
  myModule.hideDownShowUp = function() {
    /*
     * code source
     * http://codepen.io/viriava/pen/LxLYRP
     */
    // Hide Header on on scroll down
    var didScroll;
    var lastScrollTop = 0;
    var delta = 5;
    var navbarHeight = $('.navbar').outerHeight();

    $(window).scroll(function(event){
        didScroll = true;
    });

    setInterval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled() {
        var st = $(this).scrollTop();

        // Make sure they scroll more than delta
        if(Math.abs(lastScrollTop - st) <= delta)
            return;

        // If they scrolled down and are past the navbar, add class .nav-up.
        // This is necessary so you never see what is "behind" the navbar.
        if (st > lastScrollTop && st > navbarHeight){
            // Scroll Down
            $('.navbar').removeClass('nav-down').addClass('nav-up');
        } else {
            // Scroll Up
            if(st + $(window).height() < $(document).height()) {
                $('.navbar').removeClass('nav-up').addClass('nav-down');
            }
        }

        lastScrollTop = st;
    }
  };
  
  myModule.collapseNavbar = function() {
    $('.nav-link').click(function() {
      if($('.navbar-toggle').attr('aria-expanded')) {
        $('.navbar-toggle').click();
      }
    });
  };
  
  myModule.isEmailValid = function(content) {
    var arrCon = content.split('@');
    if(arrCon.length == 2) {
      return true;
    }else {
      return false
    }
  };
  
  myModule.initSendButton = function() {
    // framework: emailjs
    // emailjs DOC: https://www.emailjs.com/docs/
    $('.send-mail').click(function() {
      var userName = $('#name').val(),
          userEmail = $('#email').val(),
          userMessage = $('#message').val();
      var mailContent = {
        name: userName,
        email: userEmail,
        message: userMessage
      };
      var userValid = false;
      
      if(userName) {
        if(userEmail) {
          if(userMessage) {
            userValid = true;
          }
        }
      }
      
      if(userValid) {
        if(myModule.isEmailValid(userEmail)) {
          $('.send-mail').css('display', 'none');
          $('#response-message').html('');
          $('#send-container').append('<div class="loader text-right"></div>');
          emailjs.send('gmail', 'fromportfolio', mailContent)
          .then(
            function(response) {
              console.log("SUCCESS", response);
              $('.loader').css('display', 'none');
              $('#send-container').append('<div class="btn btn-success">Sent</div>');
              $('#response-message').html('Thanks for your message, I\'ll reply you ASAP :\)');
            },
            function(error) {
              console.log("FAILED", error);
              $('.loader').css('display', 'none');
              $('#send-container').append('<div class="btn btn-danger">error</div>');
              $('#response-message').html('Opps, something goes wrong, maybe you can contact me by <a href="https://github.com/enhsu" target="blank">GitHub</a>, <a href="https://www.linkedin.com/in/hsuchengen" target="blank">LinkedIn</a> or <a href="https://www.facebook.com/HsuChen9En" target="blank">Facebook</a>');
            });
        }else {
          $('#response-message').html('Please enter a valid email address');
        }
      }else {
        $('#response-message').html('Please fill in all fields. Thank you :\)');
      }
    });
  };
  
  return myModule;
})(pofo || {});

$(document).ready(function() {
  // trigger scrool smoothly
  pofo.smoothScroll();
  // trigger:
  //   hide navbar when scroll down
  //   show navbar when scroll up
  pofo.hideDownShowUp();
  // make sure collapse navbar after click .nav-link
  pofo.collapseNavbar();
  // init send mail
  pofo.initSendButton();
});