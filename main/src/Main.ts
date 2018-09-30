/*
* name;
*/
class Main{
	protected wxSystemInfo:any = null;
    protected static instance:Main;

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
        Laya.ResourceVersion.type = Laya.ResourceVersion.FILENAME_VERSION;
        Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.loadOpenDataResource));
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

	protected loadOpenDataResource():void
	{
		Laya.loader.load("rankRes/rank.atlas", Laya.Handler.create(this, this.openDataHandle), null, Laya.Loader.ATLAS);
	}

	protected openDataHandle():void
    {
        if (Laya.Browser.onMiniGame) {
            let wx = Laya.Browser.window.wx;
            let urlArr = ["rankRes/rank.atlas"];
            for (let i = 0; i < urlArr.length; i++) {
                wx.postMessage({url:urlArr[i], data:Laya.loader.getRes(urlArr[i]),isLoad:"filedata"});
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
	}
}

Main.GetInstance().start();