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
		
		var loginForm = new LoginForm();
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
	 */
	_login: function(space, id, pass) {
		if(space == '' || id == '' || pass == '') {
			alert('入力されていない項目があります');
			return;
		}
		
		console.log(navigator.userAgent);
		$.ajax('/backlog', {
			data: {
				space: space,
				id: id,
				pass: pass,
				method: 'get_projects',
				agent: navigator.userAgent
			},
			error: function() {
				console.log('error');
			},
			success: function() {
				console.log('success');
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
		
	},
		
	test: function() {
		var messageObject = {};
		
	}
});