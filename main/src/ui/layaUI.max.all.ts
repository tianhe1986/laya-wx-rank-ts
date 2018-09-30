
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui {
    export class indexUI extends View {
		public back:Laya.Box;
		public add:Laya.Button;
		public showButton:Laya.Button;
		public rankBox:Laya.Box;
		public openDataCanvas:Laya.Sprite;

        public static  uiView:any ={"type":"View","props":{"width":1334,"height":750,"centerY":0.5,"centerX":0.5},"child":[{"type":"Box","props":{"y":0,"x":0,"var":"back"},"child":[{"type":"Rect","props":{"y":0,"x":0,"width":1334,"lineWidth":0,"height":750,"fillColor":"#938a8a"}}]},{"type":"Button","props":{"y":89,"x":17,"width":193,"var":"add","skin":"comp/button.png","labelSize":26,"labelFont":"SimSun","label":"增加小游戏分数","height":63}},{"type":"Button","props":{"y":88,"x":230,"width":208,"var":"showButton","skin":"comp/button.png","labelSize":26,"labelFont":"SimSun","label":"显示/隐藏排行榜","height":68}},{"type":"Box","props":{"y":185,"x":0,"visible":false,"var":"rankBox"},"child":[{"type":"Image","props":{"width":482,"skin":"comp/bg.png","sizeGrid":"33,26,20,24","height":442}}]},{"type":"Sprite","props":{"y":0,"x":0,"width":1334,"visible":false,"var":"openDataCanvas","height":750}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.indexUI.uiView);

        }

    }
}
