
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui {
    export class rankUI extends View {
		public rankList:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":1334,"top":0,"left":0,"height":750},"child":[{"type":"List","props":{"y":217,"x":9,"width":464,"var":"rankList","height":401},"child":[{"type":"Box","props":{"width":464,"renderType":"render","height":88},"child":[{"type":"Rect","props":{"y":0,"x":0,"width":464,"lineWidth":0,"height":86,"fillColor":"#c1c0ba"}},{"type":"Image","props":{"y":7,"x":4,"skin":"rank/first.png","name":"trophy"}},{"type":"Image","props":{"y":8,"x":89,"width":70,"name":"avatar","height":70}},{"type":"Text","props":{"y":30,"x":170,"width":120,"text":"1","overflow":"hidden","name":"nickname","height":26,"fontSize":26,"font":"SimSun","color":"#84592E","align":"left"}},{"type":"Text","props":{"y":10,"x":298,"width":81,"text":"总分:","name":"scoreText","height":26,"fontSize":26,"font":"SimSun","color":"#BA9F7B","align":"left"}},{"type":"Text","props":{"y":10,"x":366,"width":89,"text":"99999","name":"scoreNum","height":26,"fontSize":26,"font":"SimSun","color":"#F07538","align":"center"}},{"type":"Text","props":{"y":47,"x":307,"width":134,"text":"2018/7/5","overflow":"hidden","name":"dateString","height":26,"fontSize":26,"font":"SimSun","color":"#BA9F7B","align":"right"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.rankUI.uiView);

        }

    }
}
