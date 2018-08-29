"use strict";

/* Código do jogo vai aqui! */
var bgSky;
var bgMountain;
var map;
var mapLayer;
var player1;
var coins;
var droids;
var hud;

const config = {};
config.GRAVITY = 1500;
config.PLAYER_VELOCITY = 200;
config.PLAYER_FALL_VELOCITY = 400;
config.PLAYER_JUMP_VELOCITY = 500;
config.PLAYER_DOUBLE_JUMP_VELOCITY = 600;
config.PLAYER_LIVES = 3;

var game = new Phaser.Game(800, 480, Phaser.CANVAS, null, {
  preload: preload,
  create: create,
  update: update,
  render: render
});

function preload() {
  game.load.image("background-sky", "assets/bg01.png");
  game.load.image("background-mountain", "assets/bg02.png");
  game.load.tilemap(
    "level1",
    "assets/level1.json",
    null,
    Phaser.Tilemap.TILED_JSON
  );
  game.load.image("tiles1", "assets/tileset-42x42.png");
  game.load.spritesheet("player", "assets/player.png", 49, 72);
  game.load.spritesheet("coin", "assets/coin.png", 32, 32);
  game.load.spritesheet("droid", "assets/droid.png", 64, 64);
}

function create() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = config.GRAVITY;

  bgSky = createBackground("background-sky");
  bgMountain = createBackground("background-mountain");

  var player1Keys = game.input.keyboard.addKeys({
    left: Phaser.KeyCode.LEFT,
    right: Phaser.KeyCode.RIGHT,
    jump: Phaser.KeyCode.CONTROL
  });
  player1 = createPlayer(100, 100, "player", player1Keys);
  game.camera.follow(player1, Phaser.Camera.FOLLOW_LOCKON, 0.05, 0.05);

  createTileMap();
  coins = createObjects(67, "coin", initCoin);
  droids = createObjects(73, "droid", initDroid);

  createHud();
  updateHud();
}

function createHud() {
  hud = {
    title: createText(game.width / 2, 200, "Lizard Boy", " 60, #00ff00"),
    gameover: createText(game.width / 2, 200, "GAME OVER", 60, "#ff0000"),
    gamewin: createText(game.width / 2, 200, "LEVEL CLEAR", 60, "#0000ff"),
    lives: createText(50, 50, "Lives x 3", 16, "#ffffff"),
    coins: createText(50, 75, "Coins x 0", 16, "#ffffff")
  };

  hud.title.visible = false;
  hud.gameover.visible = false;
  hud.gamewin.visible = false;
}

function updateHud() {
  hud.lives.text = `Lives x ${player1.health}`;
  hud.coins.text = `Coins x ${player1.coinsCount}`;
}

function createText(x, y, text, size, color) {
  var style = { font: `bold ${size}px Arial`, fill: color };
  var obj = game.add.text(x, y, text, style);
  obj.stroke = "#000000";
  obj.strokeThickness = 4;
  obj.anchor.setTo(0.5, 0.5);
  obj.fixedToCamera = true;
  return obj;
}

function createPlayer(x, y, image, keys) {
  var player = game.add.sprite(x, y, image);
  player.health = config.PLAYER_LIVES;
  player.anchor.setTo(0.5, 0.5);

  player.animations.add("idle", [0, 1], 5, true);
  player.animations.add("run", [2, 3, 4, 5], 5, true);
  player.animations.add("jump", [6], 5, false);
  player.animations.add("fall", [7], 5, false);

  player.animations.play("idle");

  game.physics.arcade.enable(player);
  player.body.collideWorldBounds = true;
  player.body.maxVelocity.setTo(
    config.PLAYER_VELOCITY,
    config.PLAYER_DOUBLE_JUMP_VELOCITY
  );
  player.body.setSize(player.width - 14, player.height - 11, 30, 15);

  player.isDoubleJump = false;
  player.startX = player.x;
  player.startY = player.y;

  player.coinsCount = 0;

  player.keys = keys;
  player.keys.jump.onDown.add(function() {
    playerJump(player);
  });
  return player;
}

function createTileMap() {
  map = game.add.tilemap("level1");
  map.addTilesetImage("tiles1");
  mapLayer = map.createLayer("Tile Layer 1");
  map.setCollisionBetween(1, 11, true, "Tile Layer 1");
  mapLayer.resizeWorld();
}

function createObjects(gid, key, initFunction) {
  var objGroup = game.add.group();
  map.createFromObjects("Object Layer 1", gid, key, 0, true, true, objGroup);

  objGroup.forEach(function(obj) {
    initFunction(obj);
  });

  return objGroup;
}

function initCoin(coin) {
  game.physics.arcade.enable(coin);
  coin.body.allowGravity = false;
  coin.animations.add("spin", null, 10, true);
  coin.animations.play("spin");
}

function initDroid(droid) {
  game.physics.arcade.enable(droid);
  droid.body.allowGravity = false;
  droid.body.immovable = true;
  droid.body.setSize(50, 28, 6, 30);
  droid.anchor.setTo(0.5, 0.5);
  droid.animations.add("move", null, 10, true);
  droid.animations.play("move");
  droid.smoothed = false;

  game.add
    .tween(droid.body)
    .to({ x: droid.x - 300 }, 3000, "Quart.easeInOut")
    .to({ x: droid.x }, 3000, "Quart.easeInOut")
    .loop(-1)
    .start();
}

function createBackground(img) {
  var bg = game.add.tileSprite(-10, 0, game.width + 20, game.height, img);
  bg.fixedToCamera = true;
  bg.tileScale.setTo(2, 3);
  return bg;
}

function updatePlayer(player) {
  if (!player.body.enable) {
    player.frame = 0;
    return;
  }

  if (player.keys.left.isDown) {
    player.body.velocity.x = -config.PLAYER_VELOCITY;
  } else if (player.keys.right.isDown) {
    player.body.velocity.x = config.PLAYER_VELOCITY;
  } else {
    player.body.velocity.x = 0;
  }
  animatePlayer(player);
}

function animatePlayer(player) {
  var anim = "idle";
  var onFloor = player.body.onFloor();

  // se esta no chao e movendo-se
  if (player.body.velocity.x != 0 && onFloor) anim = "run";
  // se esta subindo e nao esta no chao
  else if (player.body.velocity.y <= 0 && !onFloor) anim = "jump";
  // se esta descendo e nao esta no chao
  else if (player.body.velocity.y > 0 && !onFloor) anim = "fall";

  player.animations.play(anim);

  // usa escala negativa para inverter lado
  if (player.body.velocity.x > 0) player.scale.x = 1;
  else if (player.body.velocity.x < 0) player.scale.x = -1;
}

function playerJump(player, attack = false) {
  var onFloor = player.body.onFloor();
  if (onFloor || !player.isDoubleJump || attack) {
    if (!onFloor) {
      player.isDoubleJump = !attack;
    } else {
      player.isDoubleJump = false;
    }

    player.body.velocity.y = -config.PLAYER_JUMP_VELOCITY;
  }
}

function update() {
  bgSky.tilePosition.x -= 0.2;
  bgMountain.tilePosition.x = -game.camera.x / 5;
  game.physics.arcade.collide(player1, mapLayer);
  updatePlayer(player1);
  game.physics.arcade.overlap(player1, coins, collectCoin);
  game.physics.arcade.overlap(player1, droids, hitDroid);
}

function collectCoin(player, coin) {
  coin.kill();
  player.coinsCount += 1;
  updateHud();
}

function hitDroid(player, droid) {
  if (!player.alive) return;

  if (
    (player.body.onFloor() || player.body.velocity.y > 0) &&
    player.body.y < droid.body.y
  ) {
    droid.kill();
    playerJump(player, true);
  } else {
    hitPlayer(player);
  }

  updateHud();
}

function hitPlayer(player) {
  player.damage(1);
  player.x = player.startX;
  player.y = player.startY;
  game.camera.shake(0.005, 200);

  if (!player.alive) {
    gameOver();
  }
}

function gameOver() {
  game.camera.follow(null);
  hud.gameover.visible = true;
  hud.gameover.alpha = 0;

  game.add
    .tween(hud.gameover)
    .to({ alpha: 1 }, 150)
    .to({ alpha: 0 }, 150, "linear", 3000)
    .start()
    .onComplete.add(function() {
      game.state.restart(true);
    });
}

function render() {
  //game.debug.body(player1)
}
