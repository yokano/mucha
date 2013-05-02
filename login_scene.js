/**
 * Backlogログインシーン
 * @class
 * @extends Scene
 */
var LoginScene = Class.create(Scene, {
	/**
	 * コンストラクタ
	 * @method
	 * @memberof LoginScene
	 */
	initialize: function() {
		Scene.call(this);
		this.backgroundColor = 'black';
	},
	
	/**
	 * シーン開始時の処理
	 * @method
	 * @memberof LoginScene
	 */
	onenter: function() {
		game.largeMessage({
			title: 'Backlog へログイン',
			message: '',
			form: 'login',
			button: 'けってい',
			callback: function(formDatas) {
				this.login(formDatas, function(result) {
					if(result) {
						alert('ログインに成功しました');
						game.changeScene(TaskScene);
					} else {
						alert('ログインに失敗しました');
						game.currentScene.onenter();
					}
				});
			}
		});
	},
	
	/**
	 * Backlog へのログインを試みる
	 * ログインする API はないため、
	 * backlog.getProjects が成功するかどうかで判断する。
	 * @method
	 * @memberof LoginScene
	 * @param {Object} config
	 * {
	 *     space {string} backlogスペース
	 *     id {string} ログインID
	 *     pass {string} パスワード
	 * }
	 * @param {function} callback ログイン処理終了時に呼び出される関数
	 * @returns {bool} 成功したらTrue
	 */
	login: function(config, callback) {
		var result;
		if(config == null) {
			console.log('login data error');
			return false;
		}
		
		game.startLoading();
		$.ajax('/backlog', {
			data: {
				method: 'get_projects',
				id: config.id,
				pass: config.pass,
				space: config.space
			},
			dataType: 'json',
			error: function() {
				result = false;
				console.log('backlog api error');
			},
			success: function(data) {
				if(data.length == 0) {
					result = false;
				} else {
					result = true;
				}
			},
			complete: function() {
				game.stopLoading();
				callback.call(this, result);
			}
		});
	}
});

