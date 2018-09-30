
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui {
    export class indexUI extends View {
		public back:Laya.Box;
		public add:Laya.Button;
		public showButton:Laya.Button;
		public openDataCanvas:Laya.Sprite;
		public rankBox:Laya.Box;
		public rankList:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":1334,"height":750,"centerY":0.5,"centerX":0.5},"child":[{"type":"Box","props":{"y":0,"x":0,"var":"back"},"child":[{"type":"Rect","props":{"y":0,"x":0,"width":1334,"lineWidth":0,"height":750,"fillColor":"#938a8a"}}]},{"type":"Button","props":{"y":89,"x":17,"width":167,"var":"add","skin":"comp/button.png","labelSize":16,"labelFont":"SimSun","label":"增加小游戏分数","height":31}},{"type":"Button","props":{"y":88,"x":230,"width":167,"var":"showButton","skin":"comp/button.png","labelSize":16,"labelFont":"SimSun","label":"显示/隐藏排行榜","height":31}},{"type":"Sprite","props":{"y":0,"x":0,"var":"openDataCanvas"}},{"type":"Box","props":{"y":185,"x":0,"visible":false,"var":"rankBox"},"child":[{"type":"Image","props":{"width":482,"skin":"comp/bg.png","sizeGrid":"33,26,20,24","height":442}},{"type":"List","props":{"y":32,"x":9,"width":464,"var":"rankList","height":401},"child":[{"type":"Box","props":{"width":464,"renderType":"render","height":88},"child":[{"type":"Rect","props":{"y":0,"x":0,"width":464,"lineWidth":0,"height":86,"fillColor":"#c1c0ba"}},{"type":"Image","props":{"y":7,"x":4,"skin":"rank/first.png","scaleY":0.15,"scaleX":0.15,"name":"rank"}},{"type":"Image","props":{"y":8,"x":89,"width":70,"name":"avatar","height":70}},{"type":"Text","props":{"y":30,"x":170,"width":120,"text":"1","overflow":"hidden","name":"nickname","height":26,"fontSize":26,"font":"SimSun","color":"#84592E","align":"left"}},{"type":"Text","props":{"y":30,"x":298,"width":81,"text":"总分：","name":"scoreText","height":26,"fontSize":26,"font":"SimSun","color":"#BA9F7B","align":"left"}},{"type":"Text","props":{"y":30,"x":366,"width":89,"text":"99999","name":"scoreText","height":26,"fontSize":26,"font":"SimSun","color":"#F07538","align":"center"}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.indexUI.uiView);

        }

    }
}
