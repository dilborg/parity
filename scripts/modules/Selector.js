var Selector = (function() {

  var selector = $("#selector"); // the selector
  var coordinates = {
    x: 0,
    y: 0
  };

  var snapTo = function(x, y) {
    coordinates.x = x;
    coordinates.y = y;
    selector.animate({
      top: $('td[data-x="' + x + '"][data-y="' + y + '"]').offset().top + 'px',
      left: $('td[data-x="' + x + '"][data-y="' + y + '"]').offset().left + 'px'
    }, 100, function() {
      //todo when complete
    })
  }

  var resnap = function() {
    selector.css('top', $('td[data-x="' + coordinates.x + '"][data-y="' + coordinates.y + '"]').offset().top + 'px');
    selector.css('left', $('td[data-x="' + coordinates.x + '"][data-y="' + coordinates.y + '"]').offset().left + 'px');
  }

  var fadeIn = function() {
    selector.fadeIn(options['fade']);
  }

  var fadeOut = function() {
    selector.fadeOut(options['fade']);
  }

  return {
    snapTo: snapTo,
    resnap: resnap,
    fadeIn: fadeIn,
    fadeOut: fadeOut
  }
}())

// Add the mediator to the module
mediator.installTo(Selector);

Selector.subscribe('selector_snap_to', Selector.snapTo);
Selector.subscribe('window_resized', Selector.resnap);
Selector.subscribe('board_faded_in', Selector.fadeIn);
Selector.subscribe('board_fade_out', Selector.fadeOut);