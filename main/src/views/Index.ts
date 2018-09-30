/**
* name 
*/
module views{
	export class Index extends ui.indexUI{
		constructor(){
			super();

			this.add.on(Laya.Event.CLICK, this, this.addScore);
			this.showButton.on(Laya.Event.CLICK, this, this.switchShow);

			if (Laya.Browser.onMiniGame) {
				let texture:Laya.Texture = new Laya.Texture(Laya.Browser.window.sharedCanvas);
				texture.bitmap.alwaysChange = true;//小程序使用，非常费，这个参数可以根据自己的需求适当调整，如果内容不变可以不用设置成true
				this.openDataCanvas.graphics.drawTexture(texture, 0, 0, texture.width, texture.height);
			}
		}

		public showAll():void
		{
			this.visible = true;
		}

		public hideAll():void
		{
			this.visible = false;
		}

		//增加分数
		protected addScore():void
		{
			this.postMessage({
				cmd: 'addScore',
			});
		}

		//显示/隐藏排行榜
		protected switchShow():void
		{
			if (this.rankBox.visible) {
				this.hideRankList();
			} else {
				this.showRankList();
			}
		}

		//向开放数据域发送消息
		protected postMessage(item:Object):void
		{
			if (Laya.Browser.onMiniGame) {
				let wx = Laya.Browser.window.wx;
				let openDataContext = wx.getOpenDataContext();
				openDataContext.postMessage(item);
			}
		}

		public showRankList():void
		{
			this.rankBox.x = -480;
			this.openDataCanvas.x = -471;
			this.rankBox.visible = true;
			this.openDataCanvas.visible = true;

			Laya.Tween.to(this.rankBox, {"x": 0}, 200);
			Laya.Tween.to(this.openDataCanvas, {"x": 0}, 200);

			this.postMessage({
				cmd: 'showRank',
			});
		}

		public hideRankList():void
		{
			this.postMessage({
				cmd: 'hideRank',
			});
			Laya.Tween.to(this.rankBox, {"x": -480}, 200);
			Laya.Tween.to(this.openDataCanvas, {"x": -471}, 200, null, Laya.Handler.create(this, () => {
				this.rankBox.visible = false;
				this.openDataCanvas.visible = false;
				this.rankBox.x = 0;
				this.openDataCanvas.x = 0;
			}));
		}
	}
}