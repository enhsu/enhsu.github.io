var colors = ['#16a085', '#27ae60', '#2c3e50', '#f39c12', '#e74c3c', '#9b59b6', '#FB6964', '#342224', "#472E32", "#BDBB99", "#77B1A9", "#73A857"];

var rq = (function(module) {
  module.transferTime = 1000;
  
  module.showLoading = function() {
    // loading css from
    // https://codepen.io/Manoz/pen/pydxK?editors=1100
    $('.new-quote').prop('disabled', true);
    $('.quote-text').css('opacity', 0);
    $('.quote-title').css('opacity', 0);
    $('.quote-text-container').append('<div class="loading"><div class="line"></div><div class="line"></div><div class="line"></div></div>');
    $('.line').css('background-color', $('body').css('background-color'));
  };
  
  module.hideLoading = function() {
    $('.loading').remove();
    setTimeout(function() {
      $('.new-quote').prop('disabled', false);
    }, module.transferTime + 100);
  };
  
  module.getQuote = function() {
    module.showLoading();
    // WordPress JSON REST API
    // https://quotesondesign.com/api-v4-0/
    $.ajax({
      url: 'https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1',
      cache: false,
      success: function(data) {
        // console.log(data[0]);
        if(data[0].content.length > 300) {
          module.getQuote();
        }else {
          module.hideLoading();
          module.printQuote(data[0]);
          // module.initShareIcon();
        }
      },
      error:function(err) {
        // console.log('error', err);
        return err;
      }
    });
  };
  
  module.randomColor = function(colorList) {
    return colorList[Math.floor(Math.random()*colorList.length)]
  };
  
  module.formatQuoteText = function(data) {
    content = data.content.replace('</p>', '');
    content = content.replace('<p>', '');
    
    return content;
  };
  
  module.aniChgText = function(id, color, text) {
    $(id).animate(
      {
        opacity: 1,
        color: color
      }, module.transferTime).html(text);
  };
  
  module.aniChgColor = function(id, color) {
    $(id).animate({color: color}, module.transferTime);
  };
  
  module.aniChgBgColor = function(id, color) {
    $(id).animate({backgroundColor: color}, module.transferTime);
  };
  
  module.printQuote = function(data) {
    var color = module.randomColor(colors);
    var content = module.formatQuoteText(data);
    var title = '- ' + data.title;
    
    module.aniChgBgColor('body', color);
    module.aniChgText('.quote-text', color, content);
    module.aniChgText('.quote-title', color, title);
    module.aniChgColor('.quote-icon', color);
    module.aniChgColor('.social-icon', color);
    module.aniChgBgColor('.new-quote', color);
  };
  
  module.getCurQuote = function() {
    var retStr = '';
    
    retStr = $('.quote-text').html();
    retStr = retStr.slice(0, (retStr.length - 3));
    
    return retStr;
  };
  
  module.getCurTitle = function() {
    var retStr = '';
    
    retStr = $('.quote-title').html();
    retStr = retStr.replace('-', '');
    
    return retStr;
  };
  
  module.getTweetContent = function() {
    var retStr = '';
    
    var text = module.getCurQuote();
    var title = module.getCurTitle();
    
    retStr = '"' + text + '" -' + title;
    
    return retStr;
  };
  
  module.initTweet = function() {
    $('.twitter-share-button').click(function() {
      var tweetText = module.getTweetContent();
      
      var tweetLink = 
          'https://twitter.com/intent/tweet?' +
          'text=' + tweetText +
          '&'+
          'hashtags=quotes';
      
      $('.twitter-share-button').attr('href', tweetLink);
    });
  };
  
  module.initTumblr = function() {
    $('.tumblr-share-button').click(function() {
      var tumblrText = module.getCurQuote();
      var tumblrTitle = module.getCurTitle();

      var tumblrLink = 
          'https://www.tumblr.com/widgets/share/tool?' +
          'posttype=quote&' +
          'tags=quotes&' +
          'caption='+ tumblrTitle +'&' +
          'content=' + tumblrText +'&' +
          'canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&' +
          'shareSource=tumblr_share_button';

      $('.tumblr-share-button').attr('href', tumblrLink);
    });
  };
  
  module.initShareIcon = function() {
    module.initTweet();
    module.initTumblr();
  };
  
  return module;
})(rq || {});

$(document).ready(function() {
  rq.getQuote();
  rq.initShareIcon();
  
  $('.new-quote').click(function() {
    rq.getQuote();
  });
});