// board.js(BoardModule)

var BoardModule = (function() {

  // Components of the DOM
  var board = $('#board');
  var cells = [];
  var levelLink = $('#level');
  var overlay = $('#overlay');
  var resetLink = $('#reset');

  // Variables for the page
  var active = false;
  var level; // Contains the level data
  var numLevels = -1;

  // Resets the level to its original state
  var reset = function() {
    render(level);
  }

  // Populates cells array with links to cells in DOM
  for(var i = 0; i < 4; ++i) {
    cells.push([]);
    for(var j = 0; j < 4; ++j) {
      cells[i].push($('td[data-x="' + i + '"][data-y="' + j + '"]'));
    }
  }

  // Updates the board, called whenever a change is made
  var update = function() {
    $('td.selected').removeClass('selected');

    cells[level.selected.x][level.selected.y].addClass('selected');

    if(isWin()) {
      board.fadeOut(options['fade'], function() {
        mediator.publish('board_level_complete');
      })
    }
  }

  // Looks for a winning condition on the board, returns true or false
  function isWin() {
    var value = cell(0,0);
    for(var i = 0; i < 3; ++i) {
      for(var j = 0; j < 3; ++j) {
        if(cell(i,j) != value)
          return false
      }
    }
    return true;
  }

  // Selects the cell to the left of the current cell
  function left() {
    if(active && level.selected.x > 0) {
      select(--level.selected.x, level.selected.y);
      update();
    }
  }

  // Selects the cell above the current cell
  function up() {
    if(active && level.selected.y > 0) {
      select(level.selected.x, --level.selected.y);
      update();
    }
  }

  // Selects the cell to the right of the current cell
  function right() {
    if(active && level.selected.x < 2) {
      select(++level.selected.x, level.selected.y);
      update();
    }
  }

  // Selects the cell under the current cell
  function down() {
    if(active && level.selected.y < 2) {
      select(level.selected.x, ++level.selected.y);
      update();
    }
  }

  // Selects a cell and modifies it's value if necessary
  function select(x, y) {
    var sel = level.selected;
    if(cells[sel.x][sel.y].hasClass('black')) {
      cell(sel.x, sel.y, cell(sel.x, sel.y)+1);
    }
    else if(cells[sel.x][sel.y].hasClass('white')) {
      cell(sel.x, sel.y, cell(sel.x, sel.y)-1);
    }
    else {
      cell(sel.x, sel.y, cell(sel.x, sel.y)+1);
    }
  }

  // Sets the value of a cell at x, y. If no value given, returns the value
  function cell(x, y, value) {
    if(arguments.length == 3)
      cells[x][y].html(value);
    else
      return parseInt(cells[x][y].html());
  }

  // Initially draws the level's cells
  var render = function(data) {
    // Deactivate previous overlays
    mediator.publish('overlay_set_inactive');

    level = data;

    // Parse the level data
    for(var i = 0; i < level.contents.length; ++i) {
      var x = i % 3;
      var y = Math.floor(i / 3);
      cell(x, y, level.contents[i]);
      if(level.mode == "b&w") {
        if(level.colors[i] == "b") {
          cells[x][y].removeClass('white');
          cells[x][y].addClass('black');
        }
        else {
          cells[x][y].removeClass('black');
          cells[x][y].addClass('white')
        }
      }
    }

    level.selected = {
      x: data.initialSelected.x,
      y: data.initialSelected.y
    };

    // Set the level text
    levelLink.html('level ' + level.number + '/' + numLevels);

    // Fade in once populated
    board.fadeIn(options['fade']);
    active = true;

    // Update to select the appropriate cell
    update();
  };

  // Can be called by other modules, setting the total number of levels
  var setNumLevels = function(num) { numLevels = num; }

  // Fades out the board and sets it as inactive
  var setInactive = function() {
    board.fadeOut(options['fade']);
    active = false;
  }

  // Event bindings
  resetLink.on('click', reset);

  // The facade
  return {
    render: render,
    up: up,
    down: down,
    left: left,
    right: right,
    setNumLevels: setNumLevels,
    setInactive: setInactive
  }
}())

// Add the mediator to the module
mediator.installTo(BoardModule);

// Subscribe to messages

// Draw the board when told
BoardModule.subscribe('board_render', BoardModule.render);

// Listen to be told when to deactivate the view
BoardModule.subscribe('board_set_inactive', BoardModule.setNumLevels);

// Listen to the keyboard so the selector can be moved
BoardModule.subscribe('controls_key_down', BoardModule.down);
BoardModule.subscribe('controls_key_left', BoardModule.left);
BoardModule.subscribe('controls_key_right', BoardModule.right);
BoardModule.subscribe('controls_key_up', BoardModule.up);

// Set the number of levels in this module
BoardModule.subscribe('story_num_levels', BoardModule.setNumLevels);