/*
* name;
*/
var Main = /** @class */ (function () {
    function Main() {
        this.wxSystemInfo = null;
    }
    Main.GetInstance = function () {
        if (null == Main.instance) {
            Main.instance = new Main();
        }
        return Main.instance;
    };
    Main.prototype.getWxSystemInfo = function () {
        if (Laya.Browser.onMiniGame) {
            if (this.wxSystemInfo == null) {
                this.wxSystemInfo = Laya.Browser.window.wx.getSystemInfoSync();
            }
        }
        return this.wxSystemInfo;
    };
    Main.prototype.start = function () {
        Laya.MiniAdpter.init(true, false);
        Laya.init(1334, 750, Laya.WebGL);
        this.initStage();
        Laya.ResourceVersion.type = Laya.ResourceVersion.FILENAME_VERSION;
        Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.loadOpenDataResource));
    };
    //初始化stage
    Main.prototype.initStage = function () {
        if (Laya.Browser.onMiniGame) {
            var systemInfo = this.getWxSystemInfo();
            if (systemInfo.windowWidth * 750 > systemInfo.windowHeight * 1334) { //宽屏，高度固定
                Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_HEIGHT;
            }
            else {
                Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_WIDTH;
            }
        }
        else {
            Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
        }
        //自动横屏
        Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
        Laya.stage.alignV = Laya.Stage.ALIGN_CENTER;
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
        Laya.stage.bgColor = "#627069";
    };
    Main.prototype.loadOpenDataResource = function () {
        Laya.loader.load("rankRes/rank.atlas", Laya.Handler.create(this, this.openDataHandle), null, Laya.Loader.ATLAS);
    };
    Main.prototype.openDataHandle = function () {
        if (Laya.Browser.onMiniGame) {
            var wx = Laya.Browser.window.wx;
            var urlArr = ["rankRes/rank.atlas"];
            for (var i = 0; i < urlArr.length; i++) {
                wx.postMessage({ url: urlArr[i], data: Laya.loader.getRes(urlArr[i]), isLoad: "filedata" });
            }
            wx.postMessage({ cmd: "loadRes" });
        }
        this.loadResource();
    };
    Main.prototype.loadResource = function () {
        var prefix = "";
        var uiResArry = [
            { url: prefix + "res/atlas/comp.atlas", type: Laya.Loader.ATLAS },
        ];
        Laya.loader.load(uiResArry, Laya.Handler.create(this, this.loadEnd));
    };
    Main.prototype.loadEnd = function () {
        var indexView = new views.Index();
        Laya.stage.addChild(indexView);
    };
    return Main;
}());
Main.GetInstance().start();
//# sourceMappingURL=Main.js.map