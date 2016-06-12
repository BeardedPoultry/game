require.register("character-select", function(exports, require, module){
  'use strict';

window.GameApp = window.GameApp || {};

(function () {
	'use strict';

	$(document).on('click', '.hero', function (e) {
		var target = e.target;
		GameApp.vent.trigger('hero:selected', target);
		GameApp.vent.trigger('can:start');
	});

	GameApp.GenerateHero = function GenerateHero(id) {
		this.health = Math.round(Math.random() * 500) + 50;
		GameApp.heroHealth = this.health;
		this.attack = function (target) {
			var damage = Math.round(Math.random() * 10) + 15;
			console.log("Hero dealt: " + damage + ' damage.');
			healthChange(target, damage);
			return damage;
		};
		this.inventory = ['health-potion', 'bomb', 'double-whammy'];
		this.magic = function (target) {
			if (!GameApp.hero.usedMagic) {
				var damage = Math.round(Math.random() * 10) + 25;
				healthChange(target, damage);
				GameApp.hero.usedMagic = true;
				return damage;
			}
		};
		this.useItem = function (item) {
			if (this.inventory.indexOf(item) != -1) {
				inventory[item]();
			}
		};
		this.avatar = images[id]();
		GameApp.arena = images['arena' + randomize()]();
		GameApp.villain = new GenerateVillain();
	};

	function GenerateVillain() {
		this.health = Math.round(Math.random() * 500) + 50;
		GameApp.villainHealth = this.health;
		this.attack = function (target) {
			var damage = Math.round(Math.random() * 10) + 15;
			console.log("Villain dealt: " + damage + ' damage.');
			healthChange(target, damage);
			return damage;
		};
		this.avatar = images['villain' + randomize()]();
	}

	function healthChange(target, damage) {
		target.health -= damage;
		showDamage(target, damage);
		return target.health;
	}

	function showDamage(target, damage) {
		if (target === GameApp.hero) {
			$('.hero-img .damage').fadeIn();
			$('.hero-img .damage').text('-' + damage);
			$('.hero-img .damage').fadeOut(1500);
		} else {
			$('.villain-img .damage').fadeIn();
			$('.villain-img .damage').text('-' + damage);
			$('.villain-img .damage').fadeOut(1500);
		}
	}

	function randomize() {
		return Math.floor(Math.random() * 3) + 1;
	}

	var images = {
		'hero1': function hero1() {
			return '../asset/heros/hero1.png';
		},
		'hero2': function hero2() {
			return '../asset/heros/hero2.png';
		},
		'hero3': function hero3() {
			return '../asset/heros/hero3.png';
		},
		'arena1': function arena1() {
			$('.arena:first-child() img').addClass('selected');
			return '../asset/locations/arena1.jpg';
		},
		'arena2': function arena2() {
			$('.arena:nth-child(2) img').addClass('selected');
			return '../asset/locations/arena2.jpg';
		},
		'arena3': function arena3() {
			$('.arena:last-child() img').addClass('selected');
			return '../asset/locations/arena3.jpg';
		},
		'villain1': function villain1() {
			$('.villain:first-child() img').addClass('selected');
			return '../asset/villain/villain1.png';
		},
		'villain2': function villain2() {
			$('.villain:nth-child(2) img').addClass('selected');
			return '../asset/villain/villain2.png';
		},
		'villain3': function villain3() {
			$('.villain:last-child() img').addClass('selected');
			return '../asset/villain/villain3.png';
		}
	};

	var inventory = {
		'health-potion': function healthPotion(target) {
			GameApp.hero.health += 25;
		},
		'bomb': function bomb(target, other) {
			GameApp.villain.health -= 50;
			GameApp.hero.health -= 40;
		},
		'double-whammy': function doubleWhammy(target) {
			GameApp.villain.health -= Math.round(Math.random() * 10) + 25;
			GameApp.villain.health -= Math.round(Math.random() * 10) + 25;
		}
	};

	GameApp.allowStart = function () {
		GameApp.CanStart = true;
		$('.fightButton').addClass('clickable-now');
	};
})();
  
});


require.register("game", function(exports, require, module){
  'use strict';

window.GameApp = window.GameApp || {};

(function () {
	'use strict';

	var canAttack = true;

	// The following are events that are triggered when certain keys are pressed, corresponding
	// with an attack or inventory item belonging to the hero.

	$(document).on('keydown', function (e) {
		var code = e.keyCode;
		e.preventDefault();
		if (code === 32) {
			GameApp.vent.trigger('attack');
		};
	});

	$(document).on('keydown', function (e) {
		var code = e.keyCode;
		if (code === 88) {
			GameApp.vent.trigger('magic');
		};
	});

	$(document).on('keydown', function (e) {
		var code = e.keyCode;
		if (code === 49) {
			GameApp.vent.trigger('use:health-potion');
		};
	});

	$(document).on('keydown', function (e) {
		var code = e.keyCode;
		if (code === 50) {
			GameApp.vent.trigger('use:bomb');
		};
	});

	$(document).on('keydown', function (e) {
		var code = e.keyCode;
		if (code === 51) {
			GameApp.vent.trigger('use:double-whammy');
		};
	});

	GameApp.heroAttack = function () {
		if (canAttack === true) {
			GameApp.hero.attack(GameApp.villain);
			GameApp.changeVillainHealth();
			if (checkHealth()) {
				GameApp.villainAttack();
				$('.instructions').fadeOut();
				$('.villain-turn').fadeIn();
			}
			canAttack = false;
		}
	};

	GameApp.villainAttack = function () {
		setTimeout(function () {
			GameApp.villain.attack(GameApp.hero);
			GameApp.changeHeroHealth();
			if (checkHealth()) {
				$('.villain-turn').fadeOut();
				$('.instructions').fadeIn();
				console.log('Hero health remaining: ' + GameApp.hero.health);
				console.log('ready');
				canAttack = true;
			}
		}, 3000);
	};

	GameApp.heroMagic = function () {
		if (canAttack === true) {
			GameApp.hero.magic(GameApp.villain);
			GameApp.changeVillainHealth();
			if (checkHealth()) {
				GameApp.villainAttack();
				$('.instructions').fadeOut();
				$('.villain-turn').fadeIn();
			};
			canAttack = false;
		}
	};

	GameApp.useHealth = function () {
		if (canAttack === true) {
			GameApp.hero.useItem('health-potion');
			GameApp.changeHeroHealth();
			if (checkHealth()) {
				GameApp.villainAttack();
				$('.instructions').fadeOut();
				$('.villain-turn').fadeIn();
			};
			canAttack = false;
		}
	};

	GameApp.useBomb = function () {
		if (canAttack === true) {
			GameApp.hero.useItem('bomb');
			GameApp.changeVillainHealth();
			if (checkHealth()) {
				GameApp.villainAttack();
				$('.instructions').fadeOut();
				$('.villain-turn').fadeIn();
			};
			canAttack = false;
		}
	};

	GameApp.useWhammy = function () {
		if (canAttack === true) {
			GameApp.hero.useItem('double-whammy');
			GameApp.changeVillainHealth();
			if (checkHealth()) {
				GameApp.villainAttack();
				$('.instructions').fadeOut();
				$('.villain-turn').fadeIn();
			};
			canAttack = false;
		}
	};

	function checkHealth() {
		if (GameApp.hero.health <= 0) {
			alert("YOU LOST!");
			return false;
		} else if (GameApp.villain.health <= 0) {
			alert("YOU WON!");
			false;
		} else {
			return true;
		}
	}

	GameApp.changeHeroHealth = function () {
		var healthPercent = Math.round(GameApp.hero.health / GameApp.heroHealth * 100);
		console.log(healthPercent);
		$('.health-green.hero').css({ 'width': '' + healthPercent + '%' });
	};

	GameApp.changeVillainHealth = function () {
		var healthPercent = Math.round(GameApp.villain.health / GameApp.villainHealth * 100);
		console.log(healthPercent);
		$('.health-green.villain').css({ 'width': '' + healthPercent + '%' });
	};
})();
  
});


require.register("main", function(exports, require, module){
  'use strict';

(function () {
  'use strict';

  // Create an event hub

  $(document).ready(function () {
    GameApp.router = new GameApp.GameRouter();
    Backbone.history.start();
    // fetchMessages();
    // window.setInterval(fetchMessages, 30000);

    $(document).on('click', '.characterSelectButton', function (e) {
      $('.popup-div').hide();
    });

    $(document).on('click', '.fightButton', function () {
      if (GameApp.CanStart === true) {
        GameApp.router.navigate('fight', { trigger: true });
      }
    });

    $(document).on('click', '.hide-footer', function () {
      $('.fight-status').slideToggle();
      $('.show-footer').show();
    });

    $(document).on('click', '.show-footer', function () {
      $('.fight-status').slideToggle();
      $('.show-footer').hide();
    });
  });
})();
  
});


require.register("router", function(exports, require, module){
  // create global variable if doesn't already exist
'use strict';

window.GameApp = window.GameApp || {};

(function () {

  GameApp.GameRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      'fight': 'fight'
    },

    index: function index() {
      $('.application').html(JST['characterselect']());

      GameApp.vent.on('hero:selected', function (target) {
        if (!GameApp.heroSelected) {
          $(target).siblings().toggle('visibility');
          $(target).toggleClass('selected');
          GameApp.hero = new GameApp.GenerateHero(target.id);
          GameApp.heroSelected = true;
          GameApp.vent.on('can:start', function () {
            GameApp.allowStart();
          });
        }
      });
    },

    fight: function fight() {
      $('.application').html(JST['fight-screen']());

      $('html').css({ 'background-image': 'url("' + GameApp.arena + '")' });
      $('.hero-img img').attr('src', '../' + GameApp.hero.avatar);
      $('.villain-img img').attr('src', '../' + GameApp.villain.avatar);

      $('.villain-turn').fadeOut();
      GameApp.vent.on('attack', function () {
        GameApp.heroAttack();
      });
      GameApp.vent.on('magic', function () {
        GameApp.heroMagic();
      });
      GameApp.vent.on('use:health-potion', function () {
        GameApp.useHealth();
      });
      GameApp.vent.on('use:bomb', function () {
        GameApp.useBomb();
      });
      GameApp.vent.on('use:double-whammy', function () {
        GameApp.useWhammy();
      });
      // $('html').css('background-image', GameApp.arena);
    }
  });

  GameApp.router = new GameApp.GameRouter();
})();
  
});


require.register("vent", function(exports, require, module){
  'use strict';

window.GameApp = window.GameApp || {};

(function () {
	'use strict';

	GameApp.vent = _.extend({}, Backbone.Events);
})();
  
});


//# sourceMappingURL=app.js.map
