(function(){
  var viewableThreshold = 10;
  var $window = $(window);
  var banners = [{
    id: 'test_ad_0',
    img: 'public/1.png',
    click: '',
    spanText: 'A',
    width: 675
  },{
    id: 'test_ad_1',
    img: 'public/1.png',
    img: 'public/2.png',
    click: '',
    spanText: 'B',
    width: 114,
    styles: {
      float: 'right',
      marginLeft: 20
    }
  },{
    id: 'test_ad_2',
    img: 'public/1.png',
    img: 'public/3.png',
    click: '',
    spanText: 'C',
    width: 335,
    styles: {
      float: 'left',
      marginRight: 20
    }
  }];
  var groups = [
    ['banner', banners[0]],
    ['h', '什么是可见曝光？'],
    ['p', '可见曝光是一个更加准确地反映一个广告被用户真实看到的指标。通过可见曝光，使得广告主拥有更加科学的方法，能够清晰地了解其广告被真实地传递到消费者多少次。'],
    ['p', '国际上，可见曝光的标准一般都需要符合媒体评级委员会（MRC, Media Ratings Council）的规定。 AdMaster Smart Serving技术支持在广告Serving进行时，根据MRC标准计算可见曝光，使得广告主拥有更加科学精准量化的KPI计算线上广告效果。'],
    ['h', '为什么可见曝光很重要？'],
    ['banner', banners[1]],
    ['p', '如果广告没有被真实看到，则该广告实际上无法将品牌信息传递给消费者，加深消费者与品牌的联系与信任。在网络广告投放中，可见曝光是最精准的演算网络广告曝光效果的指标。可见曝光使得广告主对于广告项目效果，及品牌营销效果有了更加清醒的认识，并且能够基于更好的评估广告ROI，更有效果地分配广告预算，从而提升最终转换效率。'],
    ['p', '根据2014年Google对于可见曝光的研究，其时Google发现56%的展示广告并没有真正被曝光，基于此，如何真实地评估广告曝光效果就显得尤为重要。'],
    ['h', '行业内如何看待“可见曝光”？'],
    ['p', '早在2013年，美国互动广告局(IAB, Interactive Advertising Bureau) 和媒体评级委员会(MRC) 就开始了长达18个月，与上百家主要代理公司，广告主，媒体和技术供应商一起制定一个行业公认的计算可见曝光数的行业标准。'],
    ['banner', banners[2]],
    ['p', '在2014年3月， MRC 踏出了行业规范的第一步，其建议将可见曝光数作为数字广告购买的一个主要标准，确立了可见曝光成为一个正式的行业标准。'],
    ['h', '什么是行业标准？'],
    ['p', 'AdMaster Smartserving 全面支持IAB和MRC对于展示类广告可见曝光的定义,即50%以上的广告面积持续展示超过1秒。'],
    ['p', '有了该标准之后，就能更科学地定义曝光的真正价值，从而更好的分析、优化广告库存、改善转换效果，实现ROI的全面提升。']
  ];
  var renderArticle = function() {
    _.chain(groups).map(function(x) {
      switch(x[0]){
        case 'banner':
          x[1].element = $('<div id="' + x[1].id + '" class="banner">' +
            '<a href="' + x[1].click + '" target="_blank">' +
              '<span>' + x[1].spanText + '</span>' +
              '<img width="' + x[1].width + '" src="' + x[1].img + '"/>' +
            '</a>' +
          '</div>')
          x[1].element.__styles = x[1].styles;
          return x[1].element;
        case 'h': return '<h1>' + x[1] + '</h1>';
        case 'p': return '<p>' + x[1] + '</p>';
      }
    }).each(function(x) {
      $('article.main .left').append(x);
      if(x.__styles) x.css(x.__styles);
    });
  };
  var renderDisplay = function() {
    var articleMain = $('article.main .left');
    var displayContainer = $('article.main .right .results');
    var displayInfoTable = $('<tbody>').attr({
      class: 'info-table'
    });
    displayInfoTable.insertAfter('article.main .right .results .info-title');
    _.each(banners, function(x) {
      var spanTextEle = $('<td class="span-text">');
      var inviewEle = $('<td class="in-view">');
      var timeEle = $('<td class="view-time">');
      var viewableEle = $('<td class="viewable">');
      var line = $('<tr>');
      line.append(spanTextEle);
      line.append(inviewEle);
      line.append(timeEle);
      line.append(viewableEle);
      x.lineEle = line;
      x.spanTextEle = spanTextEle;
      x.inviewEle = inviewEle;
      x.timeEle = timeEle;
      x.viewableEle = viewableEle;
      displayInfoTable.append(line);
    });
    window.onscroll = window.onresize = function() {
      var scrollTop = $window.scrollTop();
      // 计算每个广告位的信息
      _.each(banners, function(x) {
        var ele = x.element;
        var inview =
          (Math.min(scrollTop + $window.height(), ele.offset().top + ele.height()) -
          Math.max(ele.offset().top, scrollTop)) * 100 / ele.height();
        if(inview < 0) inview = 0;
        var inview50 = inview >= 50;
        x.spanTextEle.html(x.spanText);
        x.inviewEle.html(
          inview.toFixed(1) + '%'
        );
        // 计算广告位view时间
        if(!x.inited) {
          x.viewtime = x.viewtime || 0;
          x.timeEle.html('0.0s');
          x.viewableEle.html('<i class="fa fa-close"></i>');
          x.inited = true;
        }
        if(inview50){
          if(!x.interval) {
            x.interval = setInterval(function(){
              x.timeEle.html((++x.viewtime/10).toFixed(1) + 's');
              if(x.viewtime == 10) {
                x.element.addClass('selected');
                x.lineEle.addClass('selected');
                x.viewableEle.html('<i class="fa fa-check"></i>')
              }
            }, 100);
          }
        } else {
          if(x.viewtime < 10) {
            x.viewtime = 0;
            x.timeEle.html('0.0s');
          }
          clearInterval(x.interval);
          x.interval = null;
        }
      });
      // 计算右边信息框的位置
      if(scrollTop > 120)
        displayContainer.css({
          top: 30
        });
      else
        displayContainer.css({
          top: 150 - scrollTop
        });
    };
    //time on page
    var time = 0;
    var timeOnPage = $('.time-on-page');
    var timeToString = function(t){
      return (t<10 ? '0' : '') + t;
    };
    var timeOnPageInterval = function(){
      time++;
      var second = time % 60;
      var min = (time - second)/60 % 60;
      var hour = (time - second - 60 * min)/3600;
      timeOnPage.html(timeToString(hour)+':'+timeToString(min)+':'+timeToString(second));
    };
    setInterval(timeOnPageInterval, 1000);
    timeOnPageInterval();
    window.onscroll();
  };
  $(function(){
    renderArticle();
    setTimeout(renderDisplay, 1000);
  });
})();
