window.GameApp = window.GameApp || {};

(function() {
	'use strict';

	$(document).on('click', '.hero', function(e) {
		var target = e.target;
		GameApp.vent.trigger('hero:selected', target);
		GameApp.vent.trigger('can:start');
	});

	GameApp.GenerateHero = function GenerateHero(id) {
		this.health = (Math.round(Math.random() * 500) + 50);
		GameApp.heroHealth = this.health;
		this.attack = function(target) {
			var damage = (Math.round(Math.random() * 10) + 15);
			console.log("Hero dealt: " +damage+ ' damage.');
			healthChange(target, damage);
			return damage;
		}
		this.inventory = ['health-potion','bomb','double-whammy'];
		this.magic = function(target) {
			if (!GameApp.hero.usedMagic) {
				var damage = (Math.round(Math.random() * 10) + 25);
				healthChange(target, damage);
				GameApp.hero.usedMagic = true;
				return damage;
			}
		}
		this.useItem = function(item) {
			if (this.inventory.indexOf(item) != -1) {
				inventory[item]();
			}
		}
		this.avatar = images[id]();
		GameApp.arena = images['arena' + randomize()]();
		GameApp.villain = new GenerateVillain();
	}

	function GenerateVillain() {
		this.health = (Math.round(Math.random() * 500) + 50);
		GameApp.villainHealth = this.health;
		this.attack = function(target) {
			var damage = (Math.round(Math.random() * 10) + 15);
			console.log("Villain dealt: " +damage+ ' damage.');
			healthChange(target, damage);
			return damage;
		}
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
			$('.hero-img .damage').text('-'+damage);
			$('.hero-img .damage').fadeOut(1500);
		} else {
			$('.villain-img .damage').fadeIn();
			$('.villain-img .damage').text('-'+damage);
			$('.villain-img .damage').fadeOut(1500);
		}
	}

	function randomize() {
		return Math.floor(Math.random() * 3) + 1;
	}

	var images = {
		'hero1': function () {
			return '../asset/heros/hero1.png';
		},
		'hero2': function () {
			return '../asset/heros/hero2.png';
		},
		'hero3': function () {
			return '../asset/heros/hero3.png';
		},
		'arena1': function () {
			$('.arena:first-child() img').addClass('selected');
			return '../asset/locations/arena1.jpg';
		},
		'arena2': function () {
			$('.arena:nth-child(2) img').addClass('selected');
			return '../asset/locations/arena2.jpg';
		},
		'arena3': function () {
			$('.arena:last-child() img').addClass('selected');
			return '../asset/locations/arena3.jpg';
		},
		'villain1': function () {
			$('.villain:first-child() img').addClass('selected');
			return '../asset/villain/villain1.png';
		},
		'villain2': function () {
			$('.villain:nth-child(2) img').addClass('selected');
			return '../asset/villain/villain2.png';
		},
		'villain3': function () {
			$('.villain:last-child() img').addClass('selected');
			return '../asset/villain/villain3.png';
		}
	}

	var inventory = {
		'health-potion': function(target) {
			GameApp.hero.health += 25;
		},
		'bomb': function(target, other) {
			GameApp.villain.health -= 50;
			GameApp.hero.health -= 40;
		},
		'double-whammy': function(target) {
			GameApp.villain.health -= (Math.round(Math.random() * 10) + 25);
			GameApp.villain.health -= (Math.round(Math.random() * 10) + 25);
		}
	}

	GameApp.allowStart = function() {
		GameApp.CanStart = true;
		$('.fightButton').addClass('clickable-now');
	}

})();
