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
			callback: this.login
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
	 */
	login: function(config) {
		if(config == null) {
			console.log('login data error');
			return;
		}
		
		$.ajax('/backlog', {
			data: {
				method: 'get_projects',
				id: config.id,
				pass: config.pass,
				space: config.space
			},
			dataType: 'json',
			error: function() {
				console.log('backlog api error');
			},
			success: function(data) {
				if(data.length == 0) {
					alert('ログインに失敗しました');
				} else {
					alert('ログインに成功しました');
				}
			}
		});
	}
});

