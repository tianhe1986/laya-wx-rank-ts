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
var View = laya.ui.View;
var Dialog = laya.ui.Dialog;
var ui;
(function (ui) {
    var indexUI = /** @class */ (function (_super) {
        __extends(indexUI, _super);
        function indexUI() {
            return _super.call(this) || this;
        }
        indexUI.prototype.createChildren = function () {
            View.regComponent("Text", laya.display.Text);
            _super.prototype.createChildren.call(this);
            this.createView(ui.indexUI.uiView);
        };
        indexUI.uiView = { "type": "View", "props": { "width": 1334, "height": 750, "centerY": 0.5, "centerX": 0.5 }, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "var": "back" }, "child": [{ "type": "Rect", "props": { "y": 0, "x": 0, "width": 1334, "lineWidth": 0, "height": 750, "fillColor": "#938a8a" } }] }, { "type": "Button", "props": { "y": 89, "x": 17, "width": 167, "var": "add", "skin": "comp/button.png", "labelSize": 16, "labelFont": "SimSun", "label": "增加小游戏分数", "height": 31 } }, { "type": "Button", "props": { "y": 88, "x": 230, "width": 167, "var": "showButton", "skin": "comp/button.png", "labelSize": 16, "labelFont": "SimSun", "label": "显示/隐藏排行榜", "height": 31 } }, { "type": "Sprite", "props": { "y": 0, "x": 0, "var": "openDataCanvas" } }, { "type": "Box", "props": { "y": 185, "x": 0, "visible": false, "var": "rankBox" }, "child": [{ "type": "Image", "props": { "width": 482, "skin": "comp/bg.png", "sizeGrid": "33,26,20,24", "height": 442 } }, { "type": "List", "props": { "y": 32, "x": 9, "width": 464, "var": "rankList", "height": 401 }, "child": [{ "type": "Box", "props": { "width": 464, "renderType": "render", "height": 88 }, "child": [{ "type": "Rect", "props": { "y": 0, "x": 0, "width": 464, "lineWidth": 0, "height": 86, "fillColor": "#c1c0ba" } }, { "type": "Image", "props": { "y": 7, "x": 4, "skin": "rank/first.png", "scaleY": 0.15, "scaleX": 0.15, "name": "rank" } }, { "type": "Image", "props": { "y": 8, "x": 89, "width": 70, "name": "avatar", "height": 70 } }, { "type": "Text", "props": { "y": 30, "x": 170, "width": 120, "text": "1", "overflow": "hidden", "name": "nickname", "height": 26, "fontSize": 26, "font": "SimSun", "color": "#84592E", "align": "left" } }, { "type": "Text", "props": { "y": 30, "x": 298, "width": 81, "text": "总分：", "name": "scoreText", "height": 26, "fontSize": 26, "font": "SimSun", "color": "#BA9F7B", "align": "left" } }, { "type": "Text", "props": { "y": 30, "x": 366, "width": 89, "text": "99999", "name": "scoreText", "height": 26, "fontSize": 26, "font": "SimSun", "color": "#F07538", "align": "center" } }] }] }] }] };
        return indexUI;
    }(View));
    ui.indexUI = indexUI;
})(ui || (ui = {}));
//# sourceMappingURL=layaUI.max.all.js.map