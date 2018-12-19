/*
* name;
*/
class Main{
	protected wxSystemInfo:any = null;
    protected static instance:Main;
    protected needReload:boolean = true;
	//排行页
    protected rankView:laya.ui.View= null;

    public static GetInstance():Main
    {
        if(null == Main.instance)
        {
            Main.instance = new Main();
        }
        return Main.instance;
    }

    constructor()
    {
        this.needReload = (this.versionCompare(Laya.version, '1.7.20') <= 0);
    }

    protected versionCompare(versionOne:string, versionTwo:string):number
    {
        let arrOne = versionOne.split('.');
        let arrTwo = versionTwo.split('.');
        for (let i = 0, len = arrOne.length; i < len; i++) {
            let numberOne = parseInt(arrOne[i]);
            let numberTwo = parseInt(arrTwo[i]);
            if (numberOne < numberTwo) {
                return -1;
            } else if (numberOne > numberTwo) {
                return 1;
            }
        }

        return 0;
    }

	public getWxSystemInfo():any
    {
        if (Laya.Browser.onMiniGame) {
            if (this.wxSystemInfo == null) {
                this.wxSystemInfo = Laya.Browser.window.wx.getSystemInfoSync();
            }
        }

        return this.wxSystemInfo;
    }

    public start()
    {
        Laya.MiniAdpter.init(true, true);
        Laya.init(1334, 750);

        this.initOpenData();
        this.initStage();
    }

    //初始化stage
    protected initStage(): void
    {
        if (Laya.Browser.onMiniGame) {
            let systemInfo = this.getWxSystemInfo();
            if (systemInfo.windowWidth * 750 > systemInfo.windowHeight * 1334) { //宽屏，高度固定
                Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_HEIGHT;
            } else {
                Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_WIDTH;
            }
        } else {
            Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
        }
        
        //自动横屏
        Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
        Laya.stage.alignV = Laya.Stage.ALIGN_CENTER;
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
        Laya.stage.bgColor = "#627069";
    }

    public getMondayTimestamp():number
    {
        let newDate = new Date();
        let day = newDate.getDay();
        let hour = newDate.getHours();
        let minute = newDate.getMinutes();
        let second = newDate.getSeconds();
        let diffSeconds = ((7 + day - 1) % 7) * 24 * 3600 + hour * 3600 + minute * 60 + second;
        let timestamp = newDate.valueOf()/1000 - diffSeconds;
        //console.log((new Date(timestamp * 1000)).toLocaleDateString());
        return timestamp;
    }

    protected increaseWeekScore():void
    {
        if (Laya.Browser.onMiniGame) {
            let wx = Laya.Browser.window.wx;
            let mondayTimestamp = Main.GetInstance().getMondayTimestamp();
            wx.getUserCloudStorage({
                keyList: ['week_score'], // 你要获取的、托管在微信后台的key
                success: res => {
                    let nowNum:number = 0;
                    let kvLen = res["KVDataList"].length;
                    for (let j = 0; j < kvLen; j++) {
                        if (res["KVDataList"][j]["key"] == 'week_score') {
                            let valueJson = JSON.parse(res["KVDataList"][j]["value"]);
                            if (valueJson["wxgame"]["update_time"] >= mondayTimestamp) { //是本周的
                                nowNum = valueJson["wxgame"]["score"];
                            }
                            break;
                        }
                    }

                    nowNum++;
                    wx.setUserCloudStorage({
                        KVDataList: [{ "key": 'week_score', "value": JSON.stringify({"wxgame":{"score":nowNum,"update_time": Math.round((new Date()).valueOf()/1000)}}) }],
                        success: res => {
                            console.log("设置周数据成功，" + res);
                        },
                        fail: res => {
                            console.log("设置周数据失败，" + res);
                        }
                    });
                }
            });
        }
    }

	public initOpenData():void
	{
		if (Laya.Browser.onMiniGame) {
			let wx = Laya.Browser.window.wx;
			wx.onMessage(data => {
				let MiniFileMgr = laya.wx.mini.MiniFileMgr;
				//console.log(data);
				if (data.cmd != undefined) {
					if (data.cmd == 'addScore') {
                        this.increaseWeekScore();
					} else if (data.cmd == 'showRank') {
                        (this.rankView as views.Rank).showRankList();
					} else if (data.cmd == 'hideRank') {
						
					} else if (data.cmd == 'loadRes') {
						this.loadResource();
					}
				} else {
					if (data['isLoad'] == "filedata") {
						MiniFileMgr.ziyuFileData[data.url] = data.data;//文本数据
					} else if(data['isLoad']=="opendatacontext"){
                        if(data.url){
                            MiniFileMgr.ziyuFileData[data.url]=data.atlasdata;
                            (MiniFileMgr as any).ziyuFileTextureData[data.imgReadyUrl]=data.imgNativeUrl;
                        }
                    }else if(data['isLoad']=="openJsondatacontext"){
                        if(data.url){
                            MiniFileMgr.ziyuFileData[data.url]=data.atlasdata;
                        }
                    }else if(data['isLoad']=="openJsondatacontextPic"){
                        (MiniFileMgr as any).ziyuFileTextureData[data.imgReadyUrl]=data.imgNativeUrl;
                    } else if (data['isLoad'] == "filenative") {
						if(data.isAdd)
							MiniFileMgr.filesListObj[data.url] = data.data;
						else
							delete MiniFileMgr.filesListObj[data.url];
					} else if (data['type'] == "resizeShared") {
						let tempMatrix = data.data.matrix;
						let matrix:Laya.Matrix = new Laya.Matrix();
						matrix.a = tempMatrix.a;
						matrix.b = tempMatrix.b;
						matrix.c = tempMatrix.c;
						matrix.d = tempMatrix.d;
						Laya.stage._canvasTransform = matrix;//重新设置矩阵
					}
				}
			});
		}
	}

    protected loadResource():void
    {
        Laya.loader.load(this.needReload ? "rankRes/rank.atlas" : "res/atlas/rank.atlas", Laya.Handler.create(this, this.loadEnd), null, Laya.Loader.ATLAS);
    }

    protected loadEnd():void
    {
		this.rankView = new views.Rank();
		Laya.stage.addChild(this.rankView);
    }
}

Main.GetInstance().start();