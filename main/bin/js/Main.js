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
    };
    //初始化stage
    Main.prototype.initStage = function () {
        var _this = this;
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
        if (Laya.Browser.onMiniGame) {
            var wx_1 = Laya.Browser.window.wx;
            Laya.timer.once(1000, this, function () {
                //设置共享画布大小
                var sharedCanvas = wx_1.getOpenDataContext().canvas;
                sharedCanvas.width = Laya.stage.width;
                sharedCanvas.height = Laya.stage.height;
                //主域往子域透传消息
                wx_1.postMessage({ type: "resizeShared", url: "", data: { width: Laya.stage.width, height: Laya.stage.height, matrix: Laya.stage._canvasTransform }, isLoad: false });
                Laya.ResourceVersion.type = Laya.ResourceVersion.FILENAME_VERSION;
                Laya.ResourceVersion.enable("version.json", Laya.Handler.create(_this, _this.loadOpenDataResource));
            });
        }
        else {
            Laya.ResourceVersion.type = Laya.ResourceVersion.FILENAME_VERSION;
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.loadOpenDataResource));
        }
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
        var _this = this;
        var indexView = new views.Index();
        Laya.stage.addChild(indexView);
        if (Laya.Browser.onMiniGame) {
            var wx_2 = Laya.Browser.window.wx;
            wx_2.login({
                success: function (res) {
                    var code = res.code;
                    wx_2.getSetting({
                        success: function (resSetting) {
                            if (resSetting.authSetting["scope.userInfo"] == true) {
                                indexView.showAll();
                            }
                            else {
                                indexView.hideAll();
                                var systemInfo = _this.getWxSystemInfo();
                                //console.log(systemInfo);
                                var button_1 = wx_2.createUserInfoButton({
                                    text: '登录',
                                    withCredentials: true,
                                    style: {
                                        left: systemInfo.windowWidth / 2 - 64,
                                        top: systemInfo.windowHeight / 2 + 99,
                                        width: 200,
                                        height: 40,
                                        lineHeight: 40,
                                        backgroundColor: '#ff0000',
                                        color: '#ffffff',
                                        textAlign: 'center',
                                        fontSize: 20,
                                        borderRadius: 4
                                    }
                                });
                                button_1.onTap(function (res2) {
                                    button_1.hide();
                                    indexView.showAll();
                                });
                            }
                        }
                    });
                }
            });
        }
    };
    return Main;
}());
Main.GetInstance().start();
//# sourceMappingURL=Main.js.map