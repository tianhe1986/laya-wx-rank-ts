/*
* name;
*/
class Main{
	protected wxSystemInfo:any = null;
    protected static instance:Main;
    protected openDataNeedReload:boolean = true;

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
        this.openDataNeedReload = (this.versionCompare(Laya.version, '1.7.20') <= 0);
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
        Laya.MiniAdpter.init(true, false);
        Laya.init(1334, 750, Laya.WebGL);

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

		if (Laya.Browser.onMiniGame) {
            let wx = Laya.Browser.window.wx;
            Laya.timer.once(1000, this, () => {
                //设置共享画布大小
                let sharedCanvas = wx.getOpenDataContext().canvas;
                sharedCanvas.width = Laya.stage.width;
                sharedCanvas.height = Laya.stage.height;
                //主域往子域透传消息
                wx.postMessage({type:"resizeShared",url:"",data:{width:Laya.stage.width,height:Laya.stage.height,matrix:Laya.stage._canvasTransform},isLoad:false});
				Laya.ResourceVersion.type = Laya.ResourceVersion.FILENAME_VERSION;
        		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.loadOpenDataResource));
            });
        } else {
			Laya.ResourceVersion.type = Laya.ResourceVersion.FILENAME_VERSION;
        	Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.loadOpenDataResource));
		}
    }

	protected loadOpenDataResource():void
	{
        //Laya.URL.basePath = "http://test.mine.cn/opendata/";
		Laya.loader.load(this.openDataNeedReload ? "rankRes/rank.atlas" : "res/atlas/rank.atlas", Laya.Handler.create(this, this.openDataHandle), null, Laya.Loader.ATLAS);
	}

	protected openDataHandle():void
    {
        if (Laya.Browser.onMiniGame) {
            let wx = Laya.Browser.window.wx;
            if (this.openDataNeedReload) {
                let urlArr = ["rankRes/rank.atlas"];
                for (let i = 0; i < urlArr.length; i++) {
                    wx.postMessage({url:urlArr[i], data:Laya.loader.getRes(urlArr[i]),isLoad:"filedata"});
                }
            } else {
                let urlArr = ["res/atlas/rank.atlas"];
                for (let i = 0; i < urlArr.length; i++) {
                    (Laya.MiniAdpter as any).sendAtlasToOpenDataContext(urlArr[i]);
                }
            }
            
            wx.postMessage({cmd:"loadRes"});
        }
        this.loadResource();
    }

    protected loadResource():void
    {
		let prefix = "";
		let uiResArry:Array<any> = [
            { url: prefix + "res/atlas/comp.atlas", type:Laya.Loader.ATLAS},
        ];
        
        Laya.loader.load(uiResArry, Laya.Handler.create(this, this.loadEnd));
    }

	protected loadEnd():void
	{
		let indexView = new views.Index();
		Laya.stage.addChild(indexView);

		if (Laya.Browser.onMiniGame) {
            let wx = Laya.Browser.window.wx;
			wx.login({
				success: (res) => {
					let code = res.code;
					wx.getSetting({
						success: (resSetting) => {
							if (resSetting.authSetting["scope.userInfo"] == true)  {
								indexView.showAll();
							} else {
								indexView.hideAll();
								let systemInfo = this.getWxSystemInfo();
								//console.log(systemInfo);
								let button = wx.createUserInfoButton({
									text: '登录',
									withCredentials: true,
									style: {
										left: systemInfo.windowWidth/2 - 64,
										top: systemInfo.windowHeight/2 + 99,
										width: 200,
										height: 40,
										lineHeight: 40,
										backgroundColor: '#ff0000',
										color: '#ffffff',
										textAlign: 'center',
										fontSize: 20,
										borderRadius: 4
									}
								})
								button.onTap((res2) => {
									button.hide();
									indexView.showAll();
								})
							}
						}
					});
				}
			});
		}
	}
}

Main.GetInstance().start();