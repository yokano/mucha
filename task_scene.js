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
		brave.come(this.greeting);
		this._brave = brave;
	},
	
	/**
	 * 挨拶
	 * @method
	 * @memberof TaskScene
	 */
	greeting: function() {
		game.message({
			html: 'greeting',
			close: 'touch',
			caller: this,
			callback: this.doYouWantNewTask
		});
	},
	
	/**
	 * 新しいタスクが欲しいか確認
	 * @method
	 * @memberof TaskScene
	 */
	doYouWantNewTask: function() {
		game.message({
			html: 'do_you_want_new_task',
			close: 'answer',
			caller: this,
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
		game.message({
			html: 'why_do_you_come_here',
			close: 'touch',
			caller: this,
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
		
		game.message({
			html: 'select_project',
			close: 'button',
			caller: this,
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
		game.message({
			html: 'do_you_want_detail',
			close: 'answer',
			caller: this,
			callback: function(answer) {
				if(answer) {
					this.setCondition();
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
	setCondition: function() {
		var self = this;
		
		// 選択肢の準備
		// タスクの種類
		$.ajax('/backlog', {
			data: {
				method: 'get_issue_types',
				project: self._selectedProject,
				id: game.id,
				pass: game.pass,
				space: game.space
			},
			async: false,
			dataType: 'json',
			error: function() {
				console.log('タスクの種類の取得に失敗しました');
			},
			success: function(issueTypes) {
				var select = $('.issue_type>select');
				for(var i = 0; i < issueTypes.length; i++) {
					$('<option></option>').html(issueTypes[i].name).val(issueTypes[i].id).appendTo(select);
				}
			}
		});
		
		// カテゴリ
		$.ajax('/backlog', {
			data: {
				method: 'get_components',
				project: self._selectedProject,
				id: game.id,
				pass: game.pass,
				space: game.space
			},
			async: false,
			dataType: 'json',
			error: function() {
				console.log('カテゴリの取得に失敗しました');
			},
			success: function(components) {
				var select = $('.component>select');
				for(var i = 0; i < components.length; i++) {
					$('<option></option>').html(components[i].name).val(components[i].id).appendTo(select);
				}
			}
		});
		
		// 状態
		$.ajax('/backlog', {
			data: {
				method: 'get_statuses',
				project: self._selectedProject,
				id: game.id,
				pass: game.pass,
				space: game.space
			},
			async: false,
			dataType: 'json',
			error: function() {
				console.log('状態の取得に失敗しました');
			},
			success: function(statuses) {
				var select = $('.status>select');
				for(var i = 0; i < statuses.length; i++) {
					$('<option></option>').html(statuses[i].name).val(statuses[i].name).appendTo(select);
				}
			}
		});
		
		// 担当者
		$.ajax('/backlog', {
			data: {
				method: 'get_users',
				project: self._selectedProject,
				id: game.id,
				pass: game.pass,
				space: game.space
			},
			async: false,
			dataType: 'json',
			error: function() {
				console.log('ユーザの取得に失敗しました');
			},
			success: function(users) {
				var select = $('.assigner>select');
				for(var i = 0; i < users.length; i++) {
					$('<option></option>').html(users[i].name).val(users[i].id).appendTo(select);
				}
			}
		});
		
		// 条件設定ウィンドウを表示
		game.message({
			html: 'set_condition',
			close: 'button',
			caller: this,
			callback: function() {
				console.log('検索');
			}
		});
	},
	
	/**
	 * タスクを検索している時の表示
	 * @method
	 * @memberof TaskScene
	 */
	searchTask: function() {
		var self = this;
		
		game.message({
			html: 'searching',
			close: 'no'
		});
		
		game.startLoading();
		$.ajax('/backlog', {
			data: {
				method: 'find_issue',
				id: game.id,
				pass: game.pass,
				space: game.space,
				project: self._selectedProject,
				status: [1, 2, 3]
			},
			dataType: 'json',
			error: function() {
				console.log('api error');
				self.noTask();
			},
			success: function(result) {
				if(result.length > 0) {
					self._tasks = result;
					self.existTask();
				} else {
					self.noTask();
				}
			},
			complete: function() {
				game.stopLoading();
				$('#searching').css('z-index', 0);
			}
		});
	},
	
	/**
	 * タスクが見つかった
	 * @method
	 * @memberof TaskScene
	 */
	existTask: function() {
		game.message({
			html: 'exist_task',
			close: 'touch',
			caller: this,
			callback: this.showRandomTask
		});
	},
	
	/**
	 * タスクが見つからなかった
	 * @method
	 * @memberof TaskScene
	 */
	noTask: function() {
		
	},
	
	/**
	 * ランダムにタスクを表示する
	 * @method
	 * @memberof TaskScene
	 */
	showRandomTask: function() {
		var task = this._tasks[Math.floor(Math.random() * this._tasks.length)];
		
		$('#task_title').html(task.summary);
		$('#task_key').html(task.key);
		$('#task_created_on').html(task.created_on);
		$('#task_component').html(task.components);
		$('#task_status').html(task.status);
		$('#task_assigner').html(task.assigner);
		$('#task_description').html(task.description);
		$('#task_url').attr('href', task.url);
		
		game.message({
			html: 'task',
			close: 'button',
			callback: this.canYouDo,
			caller: this
		});
	},
	
	/**
	 * タスクをやってくれるか尋ねる
	 * @method
	 * @memberof TaskScene
	 */
	canYouDo: function() {
		game.message({
			html: 'can_you_do',
			close: 'answer',
			caller: this,
			callback: function(answer) {
				if(answer) {
					this.fix();
				} else {
					this.nextTask();
				}
			}
		});
	},
	
	/**
	 * 次のタスクを表示する
	 * @method
	 * @memberof TaskScene
	 */
	nextTask: function() {
		game.message({
			html: 'next_task',
			close: 'touch',
			caller: this,
			callback: this.showRandomTask
		});
	},
	
	/**
	 * タスクが決定した
	 * @method
	 * @memberof TaskScene
	 */
	fix: function() {
		game.message({
			html: 'fix_task',
			close: 'touch',
			caller: this,
			callback: this.exit
		});
	},
	
	/**
	 * 勇者が退出してタイトルへ戻る
	 * @method
	 * @memberof TaskScene
	 */
	exit: function() {
		this._brave.go(function() {
			game.changeScene(TitleScene);
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