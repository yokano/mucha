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
 * Gameクラス
 * @class
 * @extends Core
 * @property {array} projects プロジェクト一覧のキャッシュ
 * @property {string} id ログインid
 * @property {string} pass パスワード
 * @property {string} Backlogのログイン先スペース名
 */
var Game = Class.create(Core, {
	projects: null,
	id: null,
	pass: null,
	space: null,
	
	/**
	 * 初期化
	 * @method
	 * @memberof Game
	 */
	initialize: function() {
		Core.call(this, 320, 480);
		for(var i = 0; i < resources.length; i++) {
			this.preload(resources[i]);
		}
	},
	
	/**
	 * ゲーム開始時の処理
	 * @method
	 * @memberof Game
	 */
	onload: function() {
		this.changeScene(TitleScene);
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
	 * メッセージの表示
	 * @method
	 * @memberof Game
	 * @param {object} config 設定項目
	 * {
	 *     html: 表示するHTMLタグのid
	 *     close: ウィンドウを閉じる方法
	 *         'touch': 画面をタッチしたら閉じる、通常メッセージで使う
	 *         'button': ボタンを押したら閉じる(class="close_button"の要素)、フォームで使う
	 *         'answer': はい/いいえを選択したら閉じる、選択肢で使う
	 *         'no': ユーザは閉じられない、システムがclose()を呼び出して閉じる、待機中に使う
	 *     check: trueならすべての<input>に入力しないと閉じられなくなる
	 *            <input>が存在しない場合はfalseと同等
	 *            falseなら閉じられる
	 *     callback: ウィンドウを閉じた時に呼び出したい関数
	 *     caller: 呼び出し元オブジェクト コールバック時に参照する
	 * }
	 */
	message: function(config) {
		// HTML要素を手前に表示
		var html = $('#' + config.html);
		html.css('z-index', 2);
		
		var close = function() {
			html.css('z-index', 0);
			$('#yes').css('z-index', 0);
			$('#yes').unbind('click');
			$('#no').css('z-index', 0);
			$('#no').unbind('click');
		};
		
		if(config.close == 'touch') {
			// タッチしたら閉じる
			html.bind('click', function() {
				close();
				config.callback.call(config.caller, game.getForm(html));
			});
		} else if(config.close == 'button') {
			// フォームのボタンを押したら閉じる
			html.find('.close_button').off('click').on('click', function() {
				if(!config.check || game.checkForm(html)) {
					close();
					config.callback.call(config.caller, game.getForm(html));
				}
			});
		} else if(config.close == 'answer') {
			// はい/いいえで閉じる
			$('#yes').css('z-index', 2).click(function() {
				close();
				config.callback.call(game.currentScene, true);
			});
			$('#no').css('z-index', 2).click(function() {
				close();
				config.callback.call(game.currentScene, false);
			});
		} else if(config.close == 'no') {
			// 閉じない
		} else {
			console.log('window close error');
		}
	},
		
	/**
	 * 指定されたフォーム内の<input>がすべて入力されているか調べる
	 * @method
	 * @memberof Game
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
	 * 指定されたフォーム内の<input>,<select>に入力されたデータを取得する
	 * @method
	 * @memberof Game
	 * @param {jQuery Object} form フォームオブジェクト
	 * @returns {Object} <input> の id と value のキーバリュー値
	 */
	getForm: function(form) {
		var inputs = form.find('input');
		var selects = form.find('select');
		var result = {};
		for(var i = 0; i < inputs.length; i++) {
			var input = $(inputs[i]);
			result[input.attr('id')] = input.val();
		}
		for(var i = 0; i < selects.length; i++) {
			var select = $(selects[i]);
			if(select.attr('multiple') == undefined) {
				result[select.attr('id')] = select.find('option:selected').val();
			} else {
				result[select.attr('id')] = select.val();
			}
		}
		return result;
	},
	
	/**
	 * ローディングアニメーションの表示
	 * @method
	 * @memberof Game
	 */
	startLoading: function() {
		var loading = new Sprite(50, 50);
		loading.image = game.assets['/mucha/loading.png'];
		loading.x = (game.width - loading.width) / 2;
		loading.y = (game.height - loading.height) / 2;
		loading.addEventListener('enterframe', function() {
			loading.frame = (game.frame / 3) % 8;
		});
		this.currentScene.addChild(loading);
		this._loading = loading;
	},
	
	/**
	 * ローディングアニメーションの非表示
	 * @method
	 * @memberof Game
	 */
	stopLoading: function() {
		this.currentScene.removeChild(this._loading);
	}
});
