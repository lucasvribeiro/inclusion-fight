var map
var bgIndustrial
var bgSky
var player1
var player2
var mapLayer
var healthBar1
var healthBar2
var hud

var musicIntro
var musicDano
var musicSoco
var musicSpecialCadeirante

const config = {};
config.GRAVITY = 1500;

config.CADEIRANTE_VELOCITY = 200;
config.CADEIRANTE_SPECIAL_VELOCITY = 800;
config.IDOSO_VELOCITY = 100;

config.PLAYER_JUMP_VELOCITY = 500;
config.PLAYER_DOUBLE_JUMP_VELOCITY = 600;
config.PLAYER_LIVES = 3;

function playerDeath(player) {
    hud.finishGame.visible = true;
    hud.finishGame.text = player.key.toUpperCase() + ' WINS';
    player1.kill();
    player2.kill();

    setTimeout(function () {
        console.log("oi");
        game.state.start('char');
    }, 1000);

    musicIntro.stop();

    counter = 0;

    


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

function playerHit(player) {

    musicSoco.play();

    game.physics.arcade.overlap(player1, player2, function (p1, p2) {

        musicDano.play()

        console.log('player1: ' + player1.health + ' player2: ' + player2.health);

        game.camera.shake(0.005, 200);

        if (player.key == 'player1') {
            player2.health -= 5;
            healthBar2.setPercent(player2.health);

            if (player2.health <= 0)
                playerDeath(player1);
        }

        else {
            player1.health -= 5;
            healthBar1.setPercent(player1.health);

            if (player1.health <= 0)
                playerDeath(player2);
        }
    });
};


var matchState = {
    preload: function () {

        console.log(mapName.key)
        game.load.image("nome", "assets/name.png");

        if (mapName.key == 'cenario1') {
            game.load.image("industrial-bg", "assets/industrial-bg.png");
            game.load.tilemap('mapa1', 'assets/mapa1.json', null, Phaser.Tilemap.TILED_JSON)
            game.load.image('industrial', 'assets/industrial.png')
        } else if (mapName.key == 'cenario2') {
            game.load.image("sky-bg", "assets/sky-bg.png");
            game.load.tilemap('mapa2', 'assets/mapa2.json', null, Phaser.Tilemap.TILED_JSON)
            game.load.image('tileset-42x42', 'assets/tileset-42x42.png')
        }

        var widthP1 = p1 == 'cadeirante' ? 49
            : p1 == 'idoso' ? 58 : p1 == 'obeso' ? 57 : 0;

        var widthP2 = p2 == 'cadeirante' ? 49
            : p2 == 'idoso' ? 58 : p1 == 'obeso' ? 57 : 0;

        var heightP1 = p1 == 'cadeirante' ? 70
            : p1 == 'idoso' ? 56 : p1 == 'obeso' ? 96 : 0;

        var heightP2 = p2 == 'cadeirante' ? 70
            : p2 == 'idoso' ? 56 : p1 == 'obeso' ? 96 : 0;

        console.log(p1 + p2)
        game.load.spritesheet('player1', `assets/${p1}.png`, widthP1, heightP1);
        game.load.spritesheet('player2', `assets/${p2}.png`, widthP2, heightP2);

        game.load.audio('intro', 'assets/intro.ogg');
        game.load.audio('dano', 'assets/dano.ogg');
        game.load.audio('soco', 'assets/soco.ogg');
        game.load.audio('special-cadeirante', 'assets/special-cadeirante.ogg');
    },


    create: function () {

        //game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = config.GRAVITY;

        if (mapName.key == 'cenario1') {
            console.log("teste")
            bgIndustrial = this.createBackground('industrial-bg');
            this.createTileMap('mapa1', 'industrial');
        }

        else if (mapName.key == 'cenario2') {
            bgSky = this.createBackground('sky-bg');
            this.createTileMap('mapa2', 'tileset-42x42');

        }


        var player2Keys = game.input.keyboard.addKeys({
            left: Phaser.KeyCode.LEFT,
            right: Phaser.KeyCode.RIGHT,
            hit: Phaser.KeyCode.SPACEBAR,
            special: Phaser.KeyCode.CONTROL
        });

        var player1Keys = game.input.keyboard.addKeys({
            left: Phaser.KeyCode.A,
            right: Phaser.KeyCode.D,
            hit: Phaser.KeyCode.E,
            special: Phaser.KeyCode.R
        });


        player1 = this.createPlayer(100, 100, "player1", p1, player1Keys, 1);
        player2 = this.createPlayer(1000, 100, "player2", p2, player2Keys, -1);
        game.camera.follow(player1, Phaser.Camera.FOLLOW_LOCKON, 0.05, 0.05);

        player1.anchor.setTo(0.5, 0.5)
        player2.anchor.setTo(0.5, 0.5)

        musicIntro = game.add.audio('intro')
        musicDano = game.add.audio('dano')

        musicSoco = game.add.audio('soco')
        musicSoco.volume = 1;
        musicSpecialCadeirante = game.add.audio('special-cadeirante')

        musicIntro.play();

        this.createHud();
        var name = game.add.sprite(game.width/2, 30, 'nome');
        name.anchor.setTo(0.5,0);
    },

    createHud: function () {
        healthBar1 = new HealthBar(game, { x: 150, y: 80 })
        healthBar2 = new HealthBar(game, { x: game.width - 150, y: 80 })
        hud = {
            finishGame: createText(game.width / 2, game.height / 2, '', 60, '#ff0000'),
            commandsPlayer1: createText(75, 130, 'Left: A\nRight: D\nE: Hit\nSpecial: R', 14, '#00ff00'),
            commandsPlayer2: createText(game.width - 80, 130, 'Left: Arrow Left\nRight: Arrow Light\nControl: Hit\nSpecial: Spacebar', 14, '#00ff00')
        }

        hud.finishGame.visible = false;
    },

    createPlayer: function (x, y, image, tipo, keys, scale) {
        var player = game.add.sprite(x, y, image);
        player.anchor.setTo(0.5, 0.5);

        if (tipo == 'cadeirante') {
            player.animations.add("idle", [0, 1], 5, true);
            player.animations.add("run", [0, 1, 2], 5, true);
            player.animations.add("hit", [3], 5, false);
            player.animations.add("special", [4, 5, 6], 5, true);
        } else if (tipo == 'idoso') {
            player.animations.add("idle", [4, 6], 5, true);
            player.animations.add("run", [5, 7], 5, true);
            player.animations.add("hit", [8, 9], 5, false);
            player.animations.add("special", [0, 1, 2], 5, true);
        } else if (tipo == 'obeso') {
            player.animations.add("idle", [1, 2,], 5, true);
            player.animations.add("run", [3, 4], 5, true);
            player.animations.add("hit", [0], 5, false);
            player.animations.add("special", [0], 5, true);
        }



        player.animations.play("idle");

        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.body.maxVelocity.setTo(
            config.CADEIRANTE_SPECIAL_VELOCITY
        );
        player.keys = keys;
        player.keys.hit.onDown.add(function () {
            playerHit(player);
        })

        player.health = 100;
        player.tipo = tipo;

        if (player.tipo == 'idoso') {
            player.body.setSize(player.width - 20, player.height - 4, 8, 2);
        } else if (player.tipo == 'cadeirante') {
            player.body.setSize(player.width - 10, player.height - 18, 8, 16);
        } else if (player.tipo == 'obeso') {
            player.body.setSize(player.width - 8, player.height - 20, 4, 10);
        }

        player.scale.x = scale;
        return player;
    },


    createTileMap: function (tilemap, tileSetImage) {
        map = game.add.tilemap(tilemap);
        map.addTilesetImage(tileSetImage);
        mapLayer = map.createLayer("Camada de Tiles 1");
        map.setCollisionBetween(1, 1024, true, "Camada de Tiles 1");
        mapLayer.resizeWorld();
    },

    createBackground: function (img) {
        var bg = game.add.tileSprite(0, 0, game.width, game.height, img);
        bg.fixedToCamera = true;
        return bg;
    },

    update: function () {
        game.physics.arcade.collide(player1, mapLayer);
        this.updatePlayer(player1);

        game.physics.arcade.collide(player2, mapLayer);
        this.updatePlayer(player2);
    },

    updatePlayer: function (player) {
        if (!player.body.enable) {
            player.frame = 0;
            return;
        }

        //player.body.setSize(player.width - 20, player.height - 4, 8, 2);
        if (player.keys.left.isDown) {
            if (player.tipo == 'cadeirante') {
                if (player.keys.special.isDown) {
                    player.body.velocity.x = -config.CADEIRANTE_SPECIAL_VELOCITY;
                    if (!musicSpecialCadeirante.isPlaying)
                        musicSpecialCadeirante.play();
                }

                else {
                    player.body.velocity.x = -config.CADEIRANTE_VELOCITY;
                    musicSpecialCadeirante.stop();
                }

            } else if (player.tipo == 'idoso') {

                player.body.velocity.x = -config.CADEIRANTE_VELOCITY;

                if (player.keys.special.isDown) {

                    player.body.setSize(player.width - 20, player.height + 10, 60, -5);

                    playerHit(player);
                }


                //     player.body.setSize(player.width - 10, player.height - 18, 8, 16);
                // else
                //     player.body.setSize(player.width - 20, player.height - 4, 8, 2);

                //
            } else if (player.tipo == 'obeso') {
                player.body.velocity.x = -config.CADEIRANTE_VELOCITY;

            }


        } else if (player.keys.right.isDown) {
            if (player.tipo == 'cadeirante') {
                if (player.keys.special.isDown) {
                    if (!musicSpecialCadeirante.isPlaying)
                        musicSpecialCadeirante.play();

                    player.body.velocity.x = config.CADEIRANTE_SPECIAL_VELOCITY;
                }

                else {
                    player.body.velocity.x = config.CADEIRANTE_VELOCITY;
                    musicSpecialCadeirante.stop();
                }

            } else if (player.tipo == 'idoso') {

                player.body.velocity.x = config.CADEIRANTE_VELOCITY;

                if (player.keys.special.isDown)
                    playerHit(player);
                //     player.body.setSize(player.width - 10, player.height - 18, 8, 16);
                // else
                //     player.body.setSize(player.width - 20, player.height - 4, 8, 2);

                //playerHit(player);
            } else if (player.tipo == 'obeso') {
                player.body.velocity.x = config.CADEIRANTE_VELOCITY;


            }

        } else {
            player.body.velocity.x = 0;
        }
        this.animatePlayer(player);
    },

    animatePlayer: function (player) {
        var anim = "idle";

        if (player.body.velocity.x != 0) anim = "run";
        if (player.keys.hit.isDown) anim = "hit";
        if (player.keys.special.isDown) {
            anim = "special";

        }

        player.animations.play(anim);


        if (player.body.velocity.x > 0) player.scale.x = 1;
        else if (player.body.velocity.x < 0) player.scale.x = -1;
    },



    render: function () {
        //game.debug.body(player1);
        //game.debug.body(player2);
    }
}