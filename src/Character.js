var charGroup
var counter = 0
var p1
var p2
var charSelectionRed
var charSelectionBlue

var charState = {

    preload: function () {
        game.load.image('anao', 'assets/anao.jpg');
        game.load.image('idoso', 'assets/anao.jpg');
        game.load.image('obeso', 'assets/anao.jpg');
        game.load.image('cadeirante', 'assets/cadeirante.jpg');
        game.load.image('red', 'assets/red.png')
        game.load.image('blue', 'assets/blue.png')
    },
    create: function () {

        charGroup = game.add.group();
        charGroup.inputEnableChildren = true;

        charGroup.create(40, 150, 'anao');
        var textAnao = game.add.text(100, 430, 'Anão', { fill: 'white' })

        charGroup.create(340, 150, 'idoso');
        var textIdoso = game.add.text(410, 430, 'Idoso', { fill: 'white' })

        charGroup.create(640, 150, 'obeso');
        var textObeso = game.add.text(700, 430, 'Obeso', { fill: 'white' })

        charGroup.create(940, 150, 'cadeirante');
        var textCadeirante = game.add.text(975, 430, 'Cadeirante', { fill: 'white' })

        charGroup.scale.setTo(1, 1);


        charGroup.forEach(function (obj) {
            obj.events.onInputDown.add(listener, { char: obj })
        })
    },
}

function listener(params) {

    if (counter == 0) {

        charSelectionRed = game.add.sprite(charGroup.getAt(0).x, charGroup.getAt(0).y, 'red')
        p1 = params.key;

        charSelectionRed.x = params.x;

    }


    else if (counter == 1) {


        charSelectionBlue = game.add.sprite(charGroup.getAt(0).x, charGroup.getAt(0).y, 'blue')
        p2 = params.key;

        charSelectionBlue.x = params.x;
        // timeout
        game.state.start('cenario', true, false, p1, p2)
    }

    counter++;
}