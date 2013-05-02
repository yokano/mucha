/**
 * タスク無茶振りシーン
 * @class
 * @extends Scene
 */
var TaskScene = Class.create(Scene, {
	/**
	 * コンストラクタ
	 * @method
	 * @memberof TaskScene
	 */
	initialize: function() {
		Scene.call(this);
	},
	
	onenter: function() {
		var background = new Sprite();
		background.image = game.assets['/mucha/castle.png'];
		background.width = background.image.width;
		background.height = background.image.height;
		this.addChild(background);
	}
});