IDs = ['search', 'update'];

setDisplay = function(modalID, state) {
  var element = document.getElementById(modalID);
  element.style.display = state;
}

toggle = function(modalID) {
  var element = document.getElementById(modalID);
  var displayState = element.style.display;
  if (displayState == 'none') {
    element.style.display = 'block';
  } else {
    element.style.display = 'none';
  }
}

exports.togglesearch = function() {
  toggle('search');
}

exports.hide = hide = function() {
  IDs.forEach(function(modalID) {
    setDisplay(modalID, 'none');
  });
}

exports.show = function(modalID) {
  hide();
  setDisplay(modalID, 'block');

  if (modalID == 'search') {
    if (typeof search.selectize != 'undefined') {
      search.selectize.focus();
      search.selectize.clear();
    }
  }
}
