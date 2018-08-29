var mapGroup
var mapName


var cenarioState = {

    preload: function () {
        game.load.image('cenario1', 'assets/cenario1.jpg');
        game.load.image('cenario2', 'assets/cenario2.jpg');
        game.load.image('cenario3', 'assets/cenario3.jpg');

        console.log('aaaaaa '+ p1)
    },
    create: function () {

        mapGroup = game.add.group();
        mapGroup.inputEnableChildren = true;

        mapGroup.create(40, 200, 'cenario1');
        mapGroup.create(440, 200, 'cenario2');
        mapGroup.create(840, 200, 'cenario3');


        mapGroup.scale.setTo(1, 1);


        mapGroup.forEach(function (obj) {
            
            obj.events.onInputDown.add(listenerCenario, { map: obj.key })
        })
    },
}

function listenerCenario(params) {
    mapName = params
    game.state.start('match', true, false, p1, p2, mapName)
}