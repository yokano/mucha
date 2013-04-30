/**
 * 無茶振りクエスト
 * Backlog に登録されているタスクからランダムに無茶振りを行う
 * @author Yuta Okano
 */
enchant();

var game;
$(function() {
	game = new Game();
	game.start();
});

/**
 * ゲームの設定
 */
var config = {
};

/**
 * Gameクラス
 * @class
 * @extends Core
 */
var Game = Class.create(Core, {
	/**
	 * 初期化
	 * @method
	 * @memberof Game
	 */
	initialize: function() {
		Core.call(this, 320, 480);
		this.preload('/mucha/background.png');
		this.preload('/mucha/small_window.png');
	},
	
	/**
	 * ゲーム開始時の処理
	 * @method
	 * @memberof Game
	 */
	onload: function() {
		// 背景
		var background = new Sprite();
		background.image = this.assets['/mucha/background.png'];
		background.width = background.image.width;
		background.height = background.image.height;
		this.currentScene.addChild(background);
		
		// Backlog テスト
		var backlog = new Backlog({
			url: 'https://okano.backlog.jp/XML-RPC',
			id: 'okano',
			pass: 'vtyfu7slg',
			method: 'get_projects'
		});
		
		this.test = 'hello'
		
		this.smallMessage({
			message: 'メッセージ出力テスト',
			confirm: false,
			callback: function(answer) {
				console.log(answer);
			}
		});
	},
	
	/**
	 * 小さいウィンドウでメッセージを表示
	 * @memberof Game
	 * @method
	 * @param {Object} config
	 * {
	 *     message: {string} 表示するメッセージ
	 *     form: {string} 表示する HTML フォームの id
	 *     confirm: {bool} はい、いいえを表示するかどうか
	 *     callback: {function} メッセージを閉じた時に呼び出される関数
	 * }
	 */
	smallMessage: function(config) {
		var background = new Sprite();
		background.image = this.assets['/mucha/small_window.png'];
		background.width = background.image.width;
		background.height = background.image.height;
		
		var label = new Label();
		label.color = 'white';
		label.text = config.message;
		label.font = '20px sans-serif'
		label.x = 20;
		label.y = 20;
		
		var messageWindow = new Group();
		messageWindow.width = background.width;
		messageWindow.height = background.height;
		messageWindow.x = (game.width - messageWindow.width) / 2;
		messageWindow.y = (game.height - messageWindow.height) - 10;
		
		messageWindow.addChild(background);
		messageWindow.addChild(label);
		game.currentScene.addChild(messageWindow);
		
		if(config.confirm) {
			// 選択肢付きメッセージ
			var yes = new Label();
			var no = new Label();
			yes.color = no.color = 'white';
			yes.font = no.font = '40px sans-serif';
			yes.y = no.y = 90;
			yes.x = 30;
			no.x = 160;
			yes.text = 'はい';
			no.text = 'いいえ';
			messageWindow.addChild(yes);
			messageWindow.addChild(no);
			yes.addEventListener('touchstart', function() {
				game.currentScene.removeChild(messageWindow);
				config.callback.call(game, true);
			});
			no.addEventListener('touchstart', function() {
				game.currentScene.removeChild(messageWindow);
				config.callback.call(game, false);
			});
		} else {
			// 通常メッセージ
			messageWindow.addEventListener('touchstart', function() {
				game.currentScene.removeChild(messageWindow);
				config.callback.call(game);
			});
		}
	}
});

/**
 * ログインフォームクラス
 * @class
 * @member {DOM} _div ログインフォームのdiv
 */
var LoginForm = Class.create({
	/**
	 * コンストラクタ
	 * @method
	 * @memberof LoginForm
	 */
	initialize: function() {
		var submit = $('#submit');
		var space = $('#space');
		var id = $('#id');
		var pass = $('#pass');
		
		var self = this;
		submit.click(function() {
			self._login(space.val(), id.val(), pass.val());
		});
	},
	
	/**
	 * ログインする
	 * @method
	 * @memberof LoginForm
	 * @param {String} space Backlogスペース名
	 * @param {String} id ログインID
	 * @param {String} pass パスワード
	 * @returns {Array(Object)} 
	 */
	_login: function(space, id, pass) {
		if(space == '' || id == '' || pass == '') {
			alert('入力されていない項目があります');
			return;
		}
		
		$.ajax('/backlog', {
			data: {
				space: space,
				id: id,
				pass: pass,
				method: 'get_projects'
			},
			dataType: 'json',
			error: function() {
				console.log('error');
			},
			success: function(data) {
				console.log(data);
			}
		});
	}
});

/**
 * Backlog へのインタフェース
 * @class
 */
var Backlog = Class.create({
	_url: "",
	_id: "",
	_pass: "",
	
	/**
	 * コンストラクタ
	 * @method
	 * @memberof Backlog
	 * @param {Object} config 設定オブジェクト
	 * url : API のURL
	 * id : ログインID
	 * pass : ログインパスワード
	 */
	initialize: function(config) {
		this._url = config.url;
		this._id = config.id;
		this._pass = config.pass;
	}
});