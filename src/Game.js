var game = new Phaser.Game(1200, 600, Phaser.CANVAS, null);

game.state.add('char', charState)
game.state.add('cenario', cenarioState)
game.state.add('match', matchState)
game.state.start('char')