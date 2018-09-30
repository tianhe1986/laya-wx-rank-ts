/**
* name 
*/
module views{
	export class Rank extends ui.rankUI{
		protected trophyList = ["rank/first.png", "rank/second.png", "rank/third.png"];
		constructor(){
			super();

			this.rankList.vScrollBarSkin = "";
			this.rankList.renderHandler = new Laya.Handler(this,this.rankListRender);
			this.rankList.array = [];
		}

		public showInit():void
		{
			
		}

		public showRankList():void
		{
			//获取好友排行榜数据
			let wx = Laya.Browser.window.wx;
			wx.getFriendCloudStorage({
				keyList: ['week_score'], // 你要获取的、托管在微信后台的key
				success: res => {
					this.processFriendDataList(res.data);
					this.rankList.scrollTo(0);
				}
			});
			//展示
			//this.mockList();
		}

		protected processFriendDataList(data:any):void
		{
			let mondayTimestamp = Main.GetInstance().getMondayTimestamp();
			let resultArr = [];

			//console.log(data);
			let len = data.length;
			for (let i = 0; i < len; i++) {
				let kvLen = data[i]["KVDataList"].length;
				for (let j = 0; j < kvLen; j++) {
					if (data[i]["KVDataList"][j]["key"] == 'week_score') {
						let valueJson = JSON.parse(data[i]["KVDataList"][j]["value"]);
						if (valueJson["wxgame"]["update_time"] >= mondayTimestamp) { //是本周的
							let newDate = new Date(valueJson["wxgame"]["update_time"] * 1000);
							resultArr.push({
								"avatar": data[i]["avatarUrl"], 
								"nickname":data[i]["nickname"], 
								"scoreNum": valueJson["wxgame"]["score"], 
								"dateString": newDate.getFullYear() + "/" + (newDate.getMonth() + 1) + "/" + newDate.getDate()
							});
						}
						break;
					}
				}
			}
			resultArr.sort(function(a:any, b:any):number{return b["scoreNum"] - a["scoreNum"];})
			this.rankList.array = resultArr;
		}

		public mockList():void
		{
		    let num = Math.round(1 + 10 * Math.random());
			let arr = [];
			for (let i = 0; i <　num; i++) {
				arr.push({"avatar": "", "nickname":"测试" + i, "scoreNum": Math.round(num * Math.random()), "dateString": "2018/9/30"});
			}
			arr.sort(function(a:any, b:any):number{return b["scoreNum"] - a["scoreNum"];})
			this.rankList.array = arr;
		}

		protected rankListRender(cell:Laya.Box,index:number)
		{
			let arr = this.rankList.array;
			if (index >= arr.length) {
				return;
			}
			(cell.getChildByName("avatar") as Laya.Image).skin = arr[index]["avatar"];
			(cell.getChildByName("nickname") as Laya.Text).text = arr[index]["nickname"];
			(cell.getChildByName("scoreNum") as Laya.Text).text = arr[index]["scoreNum"];
			(cell.getChildByName("dateString") as Laya.Text).text = arr[index]["dateString"];
			(cell.getChildByName("trophy") as Laya.Image).skin = (this.trophyList[index] != undefined ? this.trophyList[index] : "");
		}
	}
}