/**
 * エンディング画面
 * @class
 * @extends Scene
 */
var EndScene = Class.create(Scene, {
	/**
	 * コンストラクタ
	 * @method
	 * @memberof EndScene
	 */
	initialize: function() {
		Scene.call(this);
		var background = new Sprite();
		background.image = game.assets['/mucha/end.png'];
		background.width = background.image.width;
		background.height = background.image.height;
		background.addEventListener('touchstart', function() {
			game.changeScene(TitleScene);
		});
		this.addChild(background);
	}
});