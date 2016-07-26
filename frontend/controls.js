document.addEventListener('wheel', wheelHandler);

function wheelHandler(e) {
  e.preventDefault();
  var prev_spell_slot = document.getElementById('spell_slot_' +
    SELECTED_SPELL_SLOT);
  prev_spell_slot.removeAttribute('class', 'selected_spell_slot');
  prev_spell_slot.setAttribute('class', 'spell_logo');
  var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
  if (delta === 1) {
     SELECTED_SPELL_SLOT -= 1;
     if (SELECTED_SPELL_SLOT < 1) {
       SELECTED_SPELL_SLOT = 10;
     }
  } else {
    SELECTED_SPELL_SLOT += 1;
    if (SELECTED_SPELL_SLOT > 10) {
      SELECTED_SPELL_SLOT = 1;
    }
  }
  var current_spell_slot = document.getElementById("spell_slot_" +
    SELECTED_SPELL_SLOT);
  current_spell_slot.setAttribute('class', 'selected_spell_slot spell_logo');
}

function bindKeys() {
  $(document).keydown(function(event) {
    switch(event.which) {
      case 37: //left
        move(0, -1);
        break;

      case 38: //up
        move(-1, 0);
        break;

      case 39: //right
        move(0, 1)
        break;

      case 40: //down
        move(1, 0);
        break;

      default:
        return;
    }
    event.preventDefault(); //prevent scrolling
  });
}
