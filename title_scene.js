/**
 * タイトルシーン
 * @class
 * @extends Scene
 */
var TitleScene = Class.create(Scene, {	
	/**
	 * コンストラクタ
	 * @method
	 * @memberof TitleScene
	 */
	initialize: function() {
		Scene.call(this);
		
		var background = new Sprite();
		background.image = game.assets['/mucha/title.png'];
		background.width = background.image.width;
		background.height = background.image.height;
		background.addEventListener(Event.TOUCH_START, function() {
			game.changeScene(LoginScene);
		});
		this.addChild(background);
	}
});
