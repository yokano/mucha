/**
 * タスク無茶振りシーン
 * @class
 * @extends Scene
 * @property {string} _selectedProject 選択したプロジェクトのID
 */
var TaskScene = Class.create(Scene, {
	_selectedProject: '',
	
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
		brave.come(this.greeting);
	},
	
	/**
	 * 挨拶
	 * @method
	 * @memberof TaskScene
	 */
	greeting: function() {
		game.smallMessage({
			message: 'よくきたな　ゆうしゃよ<br/>ぶじなすがたを　みれて<br/>なによりじゃ',
			callback: this.doYouWantNewTask
		});
	},
	
	/**
	 * 新しいタスクが欲しいか確認
	 * @method
	 * @memberof TaskScene
	 */
	doYouWantNewTask: function() {
		game.smallMessage({
			message: 'あらたな　にんむを<br/>うけたいのか？',
			confirm: true,
			callback: function(answer) {
				if(answer) {
					this.selectProject();
				} else {
					this.whyDoYouComeHere();
				}
			}
		});
	},
	
	/**
	 * どうしてここへきたの？
	 * @method
	 * @memberof TaskScene
	 */
	whyDoYouComeHere: function() {
		game.smallMessage({
			message: 'なんじゃと！<br/>それでは　いったい<br/>なぜ　ここへきたのじゃ？',
			callback: this.doYouWantNewTask
		});
	},
	
	/**
	 * プロジェクトの選択
	 * @method
	 * @memberof TaskScene
	 */
	selectProject: function() {
		// <option> の作成
		$('#projects').empty();
		for(var i = 0; i < game.projects.length; i++) {
			var project = game.projects[i];
			$('<option value="' + project.id + '">' + project.name + '</option>').appendTo($('#projects'));
		}
		
		game.smallMessage({
			message: 'どのプロジェクトへ<br/>さんかしているのじゃ？',
			form: 'select_project',
			button: 'きめる',
			callback: function(formDatas) {
				this._selectedProject = formDatas.projects;
				this.doYouWantDetail();
			}
		});
	},
	
	/**
	 * 検索の詳細設定をするか？
	 * @method
	 * @memberof TaskScene
	 */
	doYouWantDetail: function() {
		game.smallMessage({
			message: 'くわしい　じょうけんを<br/>していするのか？',
			confirm: true,
			callback: function(answer) {
				if(answer) {
					this.setDetail();
				} else {
					this.searchTask();
				}
			}
		});
	},
	
	/**
	 * タスクを検索するための詳細条件を入力する
	 * @method
	 * @memberof TaskScene
	 */
	setDetail: function() {
		console.log('詳細条件の設定');
	},
	
	/**
	 * タスクを検索している時の表示
	 * @method
	 * @memberof TaskScene
	 */
	searchTask: function() {
		game.waitMessage('ふむ　なにか　いいにんむは<br/>あったかのう？<br/>すこし　まつのじゃ');
		game.startLoading();
		$.ajax('/backlog', {
			data: {
				method: 'find_issue',
				id: game.id,
				pass: game.pass,
				space: game.space,
				project: this._selectedProject,
				status: [1, 2, 3]
			},
			dataType: 'json',
			error: function() {
				console.log('api error');
			},
			success: function() {
				console.log('sccess');
			}
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