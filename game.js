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
		this.preload('/mucha/large_window.png');
		this.preload('/mucha/title.png');
		this.preload('/mucha/button.png');
	},
	
	/**
	 * ゲーム開始時の処理
	 * @method
	 * @memberof Game
	 */
	onload: function() {
		var titleScene = new TitleScene();
		this.pushScene(titleScene);
	},
	
	/**
	 * シーンを変更する
	 * @method
	 * @memberof Game
	 */
	changeScene: function(scene) {
		this.popScene();
		this.pushScene(new scene());
	},
	
	/**
	 * 大きいウィンドウでメッセージを表示
	 * @memberof Game
	 * @method
	 * @param {Object} config
	 * {
	 *     title: {string} 表示するウィンドウのタイトル
	 *     message: {string} 表示するメッセージ
	 *     button: {string} ボタンに表示するラベル
	 *     form: {string} 表示する HTML フォームの id
	 *     callback: {function} メッセージを閉じた時に呼び出される関数
	 * }
	 */
	largeMessage: function(config) {
		var background = new Sprite();
		background.image = this.assets['/mucha/large_window.png'];
		background.width = background.image.width;
		background.height = background.image.height;
		
		var messageWindow = new Group();
		messageWindow.width = background.width;
		messageWindow.height = background.height;
		messageWindow.x = (game.width - messageWindow.width) / 2;
		messageWindow.y = (game.height - messageWindow.height) / 2;
		messageWindow.addChild(background);
		
		var title = new Label();
		title.color = 'white';
		title.text = config.title;
		title.font = '30px sans-serif';
		title.x = 20;
		title.y = 15;
		messageWindow.addChild(title);
		
		var message = new Label();
		message.color = 'white';
		message.text = config.message;
		message.font = '20px sans-serif';
		message.x = 20;
		message.y = 100;
		messageWindow.addChild(message);
		
		var form;
		if(config.form != undefined) {
			form = $('#' + config.form);
			form.css('z-index', 2);
		}
		
		// button が設定されていたらボタンを押して閉じる
		// 設定されていなかったらウィンドウをタップして閉じる
		var closeTrigger = null;
		if(config.button == undefined) {
			closeTrigger = messageWindow;
		} else {
			var button = new Group();
			closeTrigger = button;

			var background = new Sprite();
			background.image = game.assets['/mucha/button.png'];
			background.width = background.image.width;
			background.height = background.image.height;
			button.addChild(background);
			
			var label = new Label();
			label.text = config.button;
			label.color = 'white';
			label.font = '30px sans-serif';
			label.x = (background.width - label._boundWidth) / 2;
			label.y = (background.height - 30) / 2;
			button.addChild(label);
			
			button.width = background.width;
			button.height = background.height;
			button.x = (messageWindow.width - button.width) / 2;
			button.y = 350;
			messageWindow.addChild(button);
		}
		
		// 閉じる処理
		var formDatas = null;
		closeTrigger.addEventListener('touchstart', function() {
			if(form != undefined) {
				if(!game.checkForm(form)) {
					return;
				} else {
					formDatas = game.getForm(form);
					form.css('z-index', 0);
				}
			}
			game.currentScene.removeChild(messageWindow);
			config.callback.call(game, formDatas);
		});
		
		game.currentScene.addChild(messageWindow);
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
	},
	
	/**
	 * 指定されたフォーム内の<input>がすべて入力されているか調べる
	 * @param {jQuery Object} form フォームオブジェクト
	 */
	checkForm: function(form) {
		var inputs = form.find('input');
		for(var i = 0; i < inputs.length; i++) {
			if($(inputs[i]).val() == '') {
				alert('入力されていない項目があります');
				return false;
			}
		}
		return true;
	},
	
	/**
	 * 指定されたフォーム内の<input>に入力されたデータを取得する
	 * @param {jQuery Object} form フォームオブジェクト
	 * @returns {Object} <input> の id と value のキーバリュー値
	 */
	getForm: function(form) {
		var inputs = form.find('input');
		var result = {};
		for(var i = 0; i < inputs.length; i++) {
			var input = $(inputs[i]);
			result[input.attr('id')] = input.val();
		}
		return result;
	}
});