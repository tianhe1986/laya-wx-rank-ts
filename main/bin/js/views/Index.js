var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
* name
*/
var views;
(function (views) {
    var Index = /** @class */ (function (_super) {
        __extends(Index, _super);
        function Index() {
            var _this = _super.call(this) || this;
            _this.add.on(Laya.Event.CLICK, _this, _this.addScore);
            _this.showButton.on(Laya.Event.CLICK, _this, _this.switchShow);
            if (Laya.Browser.onMiniGame) {
                var texture = new Laya.Texture(Laya.Browser.window.sharedCanvas);
                texture.bitmap.alwaysChange = true; //小程序使用，非常费，这个参数可以根据自己的需求适当调整，如果内容不变可以不用设置成true
                _this.openDataCanvas.graphics.drawTexture(texture, 0, 0, texture.width, texture.height);
            }
            return _this;
        }
        //增加分数
        Index.prototype.addScore = function () {
            this.postMessage({
                cmd: 'addScore',
            });
        };
        //显示/隐藏排行榜
        Index.prototype.switchShow = function () {
            if (this.rankBox.visible) {
                this.hideRankList();
            }
            else {
                this.showRankList();
            }
        };
        //向开放数据域发送消息
        Index.prototype.postMessage = function (item) {
            if (Laya.Browser.onMiniGame) {
                var wx = Laya.Browser.window.wx;
                var openDataContext = wx.getOpenDataContext();
                openDataContext.postMessage(item);
            }
        };
        Index.prototype.showRankList = function () {
            this.rankBox.x = -480;
            this.openDataCanvas.x = -471;
            this.rankBox.visible = true;
            this.openDataCanvas.visible = true;
            Laya.Tween.to(this.rankBox, { "x": 0 }, 200);
            Laya.Tween.to(this.openDataCanvas, { "x": 0 }, 200);
            this.postMessage({
                cmd: 'showRank',
            });
        };
        Index.prototype.hideRankList = function () {
            var _this = this;
            this.postMessage({
                cmd: 'hideRank',
            });
            Laya.Tween.to(this.rankBox, { "x": -480 }, 200);
            Laya.Tween.to(this.openDataCanvas, { "x": -471 }, 200, null, Laya.Handler.create(this, function () {
                _this.rankBox.visible = false;
                _this.openDataCanvas.visible = false;
                _this.rankBox.x = 0;
                _this.openDataCanvas.x = 0;
            }));
        };
        return Index;
    }(ui.indexUI));
    views.Index = Index;
})(views || (views = {}));
//# sourceMappingURL=Index.js.map