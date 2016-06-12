window.GameApp = window.GameApp || {};

(function() {
	'use strict';

	var canAttack = true;

	// The following are events that are triggered when certain keys are pressed, corresponding
	// with an attack or inventory item belonging to the hero.

	$(document).on('keydown', function(e) {
		var code = e.keyCode;
		e.preventDefault();
		if (code === 32) {
			GameApp.vent.trigger('attack');
		};
	});

	$(document).on('keydown', function(e) {
		var code = e.keyCode;
		if (code === 88) {
			GameApp.vent.trigger('magic');
		};
	});

	$(document).on('keydown', function(e) {
		var code = e.keyCode;
		if (code === 49) {
			GameApp.vent.trigger('use:health-potion');
		};
	});

	$(document).on('keydown', function(e) {
		var code = e.keyCode;
		if (code === 50) {
			GameApp.vent.trigger('use:bomb');
		};
	});

	$(document).on('keydown', function(e) {
		var code = e.keyCode;
		if (code === 51) {
			GameApp.vent.trigger('use:double-whammy');
		};
	});

	GameApp.heroAttack = function() {
		if(canAttack === true) {
			GameApp.hero.attack(GameApp.villain);
			GameApp.changeVillainHealth();
			if(checkHealth()) {
				GameApp.villainAttack();
				$('.instructions').fadeOut();
				$('.villain-turn').fadeIn();
			}
			canAttack = false;
		}
	}

	GameApp.villainAttack = function() {
		setTimeout(function() {
			GameApp.villain.attack(GameApp.hero);
			GameApp.changeHeroHealth();
			if(checkHealth()) {
				$('.villain-turn').fadeOut();
				$('.instructions').fadeIn();
				console.log('Hero health remaining: '+GameApp.hero.health);
				console.log('ready');
				canAttack = true;
			}
		}, 3000);
	}

	GameApp.heroMagic = function() {
		if(canAttack === true) {
			GameApp.hero.magic(GameApp.villain);
			GameApp.changeVillainHealth();
			if(checkHealth()) {
				GameApp.villainAttack();
				$('.instructions').fadeOut();
				$('.villain-turn').fadeIn();
			};
			canAttack = false;
		}
	}

	GameApp.useHealth = function() {
		if(canAttack === true) {
			GameApp.hero.useItem('health-potion');
			GameApp.changeHeroHealth();
			if(checkHealth()) {
				GameApp.villainAttack();
				$('.instructions').fadeOut();
				$('.villain-turn').fadeIn();
			};
			canAttack = false;
		}
	}

	GameApp.useBomb = function() {
		if(canAttack === true) {
			GameApp.hero.useItem('bomb');
			GameApp.changeVillainHealth();
			if(checkHealth()) {
				GameApp.villainAttack();
				$('.instructions').fadeOut();
				$('.villain-turn').fadeIn();
			};
			canAttack = false;
		}
	}

	GameApp.useWhammy = function() {
		if(canAttack === true) {
			GameApp.hero.useItem('double-whammy');
			GameApp.changeVillainHealth();
			if(checkHealth()) {
				GameApp.villainAttack();
				$('.instructions').fadeOut();
				$('.villain-turn').fadeIn();
			};
			canAttack = false;
		}
	}

	function checkHealth () {
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

	GameApp.changeHeroHealth = function() {
		var healthPercent = Math.round((GameApp.hero.health / GameApp.heroHealth) * 100);
		console.log(healthPercent);
		$('.health-green.hero').css({'width': ''+healthPercent+'%'})
	}

	GameApp.changeVillainHealth = function() {
		var healthPercent = Math.round((GameApp.villain.health / GameApp.villainHealth) * 100);
		console.log(healthPercent);
		$('.health-green.villain').css({'width': ''+healthPercent+'%'})
	}

})();
