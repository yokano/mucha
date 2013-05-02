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
	
	/**
	 * シーン開始時の処理
	 * @method
	 * @memberof TaskScene
	 */
	onenter: function() {
		var background = new Sprite();
		background.image = game.assets['/mucha/castle.png'];
		background.width = background.image.width;
		background.height = background.image.height;
		this.addChild(background);
		
		var brave = new Brave();
		this.addChild(brave);
		brave.come(function() {
			brave.go(function() {
				console.log('勇者の退出終了');
			});
		});
	}
});

/**
 * 勇者
 * @class
 * @extends Sprite
 * @property {number} frame スプライトのフレーム数
 */
var Brave = Class.create(Sprite, {
	_frameCount: 4,
	
	/**
	 * 初期化
	 * @method
	 * @memberof Brave
	 */
	initialize: function() {
		Sprite.call(this);
		this.image = game.assets['/mucha/brave.png'];
		this.width = this.image.width / this._frameCount;
		this.height = this.image.height;
		this.x = (game.width - this.width) / 2;
		this.y = game.height;
		this.frame = 0;
	},
	
	/**
	 * 画面内に出現させる
	 * @method
	 * @memberof Brave
	 * @param {function} callback 歩行完了時に呼び出される関数
	 */
	come: function(callback) {
		var wait = 5;
		var count = 0;
		var goal = 310;
		this.onenterframe = function() {
			if(this.y < goal) {
				this.frame = 0;
				this.onenterframe = function() {};
				callback.call(game.currentScene);
			} else if(count > wait) {
				this.frame = ++this.frame % this._frameCount;
				count = 0;
			} else {
				count++;
			}
			this.y -= 2;
		};
	},
	
	/**
	 * 画面外に退出させる
	 * @method
	 * @memberof Brave
	 * @param {function} callback 退出完了時に呼び出される関数
	 */
	go: function(callback) {
		var wait = 5;
		var count = 0;
		var goal = game.height;
		this.onenterframe = function() {
			if(this.y > goal) {
				this.onenterframe = function() {};
				callback.call(game.currentScene);
			} else if(count > wait) {
				this.frame = ++this.frame % this._frameCount;
				count = 0;
			} else {
				count++;
			}
			this.y += 2;
		};
	}
});