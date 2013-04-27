/**
 * 無茶振りクエスト
 * Backlog に登録されているタスクからランダムに無茶振りを行う
 * @author Yuta Okano
 */
enchant();

var game;
window.addEventListener('load', function() {
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
			pass: 'vtyfu7slg'
		});
		backlog.toBinary('mynameisokano');
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
	
	/**
	 * 文字列をバイナリに変換する
	 * @method
	 * @memberof Backlog
	 * @param {String} str 文字列
	 * @returns {String} Base64 文字列
	 */
	encodeBase64: function(str) {
	
		// バイト配列に変換
		var bytes = [];
		var char = 0;
		for(var i =  0; i < str.length; i++) {
			char = str.charCodeAt(i);
			for(var j = 0; j < 8; j++) {
				bytes.push((char & 0x80) >>> 7);
				char = char << 1;
			}
		}

		// 6bit で割り切れるようにビットを追加する
		var surplus = bytes.length % 6;
		for(var i = 0; i < 6 - surplus; i++) {
			bytes.push(0);
		}
	
		// 6bit ごとにグループ化
		var groups = [];
		for(var i = 0; i < bytes.length / 6; i++) {
			groups[i] = parseInt(bytes.slice(i * 6, i * 6 + 6).join(''), 2);
		}
		
		// 変換する
		var result = "";
		var Base64Table = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
			'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a',
			'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
			'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4',
			'5', '6', '7', '8', '9', '+', '/'];
		for(var i = 0; i < groups.length; i++) {
			result += Base64Table[groups[i]];
		}
		
		// 4 で割り切れる文字数へ = を追加して調整する
		var surplus = result.length % 4;
		for(var i = 0; i < surplus; i++) {
			result += '=';
		}
		
		return result;
	},
	
	test: function() {
		var messageObject = {};
		
	}
});