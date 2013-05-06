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
		this.addChild(background);
		
		var fire = new Sprite();
		fire.image = game.assets['/mucha/fire.png'];
		fire.width = fire.image.width;
		fire.height = fire.image.height;
		fire.tl.fadeOut(30, SIN_EASEIN).fadeIn(30, SIN_EASEOUT).loop();
		fire.addEventListener(Event.TOUCH_START, function() {
			game.changeScene(LoginScene);
		});
		this.addChild(fire);
		
		var mucha = new Sprite();
		mucha.image = game.assets['/mucha/mucha.png'];
		mucha.width = mucha.image.width;
		mucha.height = mucha.image.height;
		mucha.x = 5;
		mucha.y = 25;
		mucha.addEventListener(Event.TOUCH_START, function() {
			game.changeScene(LoginScene);
		});
		this.addChild(mucha);
	}
});
