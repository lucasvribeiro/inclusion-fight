var mapGroup
var mapName


var cenarioState = {

    preload: function () {
        game.load.image('cenario1', 'assets/cenario1.jpg');
        game.load.image('cenario2', 'assets/cenario2.jpg');
    },
    create: function () {

        mapGroup = game.add.group();
        mapGroup.inputEnableChildren = true;

        mapGroup.create(250, 200, 'cenario1');
        var textCenario1 = game.add.text(355, 410, 'Factory', { fill: 'white' })

        mapGroup.create(650, 200, 'cenario2');
        var textIdosoCenario2 = game.add.text(770, 410, 'Garden', { fill: 'white' })


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