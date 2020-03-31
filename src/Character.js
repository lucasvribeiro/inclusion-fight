var charGroup
var counter = 0
var p1
var p2
var charSelectionRed
var charSelectionBlue

var charState = {

    preload: function () {
        game.load.image('idoso', 'assets/idoso.jpg');
        game.load.image('obeso', 'assets/obeso.jpg');
        game.load.image('cadeirante', 'assets/cadeirante.jpg');
        game.load.image('red', 'assets/red.png')
        game.load.image('blue', 'assets/blue.png')
        game.load.image('nome', 'assets/name.png')
    },
    create: function () {

        charGroup = game.add.group();
        charGroup.inputEnableChildren = true;

        charGroup.create(200, 150, 'idoso');
        var textIdoso = game.add.text(270, 430, 'Idoso', { fill: 'white' })

        charGroup.create(500, 150, 'obeso');
        var textObeso = game.add.text(560, 430, 'Obeso', { fill: 'white' })

        charGroup.create(800, 150, 'cadeirante');
        var textCadeirante = game.add.text(835, 430, 'Cadeirante', { fill: 'white' })

        charGroup.scale.setTo(1, 1);


        charGroup.forEach(function (obj) {
            obj.events.onInputDown.add(listener, { char: obj })
        })
        
        var name = game.add.sprite(game.width/2, 30, 'nome');
        name.anchor.setTo(0.5,0);
    
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
        setTimeout(function(){
            game.state.start('cenario', true, false, p1, p2)
        }, 500);
        
    }

    counter++;
}