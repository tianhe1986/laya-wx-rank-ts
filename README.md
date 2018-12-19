# laya-wx-rank-ts
Layabox(windows版本，因为没钱买苹果)开发的微信小游戏排行榜demo，使用开放数据域，开发用的Typescript语言，对应Laya类库版本 >= 1.7.19

# 使用步骤(版本 <= 1.7.20)
为了同时使用版本管理和图集加载，做了一些特殊的处理，具体原理会在之后说明，这里请先照着用吧:)。
1. 下载本项目解压，可以看到三个文件夹,main为主代码，open-data为开放数据域代码，wxgame对应最后发布出来的小游戏代码（现在是空的，等这些步骤执行完，它就有东西了)。
2. 在两个Layabox窗口中分别打开main项目和open-data项目。
3. 在两个项目中都切换到编辑模式，按F12导出资源。
4. 执行main项目下的copy.bat脚本，将排行榜图集拷贝到单独的文件夹下。
5. main项目切换回代码模式，编译，然后发布项目。这里是重点，发布项目的选项，要勾选启用版本管理，后续执行脚本要选择main项目下的release.bat文件。然后就能看到与main平级的wxgame文件夹下有内容了。
6. 继续发布open-data项目，注意，发布选项，*不要*勾选版本管理，后续执行脚本选择open-data项目下的release_opendata文件。
7. 用微信web开发者工具打开wxgame文件夹，填入你自己的小游戏AppID，即可执行看到效果了。

# 使用步骤(版本 >= 1.7.21)
由于laya库升级，增加了将图集直接传到子域的方法，这样就不再需要将排行榜图集独立出来了，子域也可以使用版本管理，但是官方库中还有点问题，需要改一行代码，请先照着用:)。
1. 下载本项目解压，可以看到三个文件夹,main为主代码，open-data为开放数据域代码，wxgame对应最后发布出来的小游戏代码（现在是空的，等这些步骤执行完，它就有东西了)。
2. 在两个Layabox窗口中分别打开main项目和open-data项目。
3. 在两个项目中都切换到编辑模式，按F12导出资源。
4. main项目中，打开`bin/libs/laya.wxmini.js`，找到`MiniAdpter.postInfoToContext`方法，将里面的
```
fileNativeUrl=textureUrl
```
改为
```
fileNativeUrl=URL.formatURL(textureUrl)
```
5. main项目切换回代码模式，编译，然后发布项目。这里是重点，发布项目的选项，要勾选启用版本管理，后续执行脚本要选择main项目下的release.bat文件。然后就能看到与main平级的wxgame文件夹下有内容了。
6. 继续发布open-data项目，注意，发布选项，*不要*勾选版本管理，后续执行脚本选择open-data项目下的release_opendata文件。
7. 用微信web开发者工具打开wxgame文件夹，填入你自己的小游戏AppID，即可执行看到效果了。

界面比较丑，请忽略
![view](./view.png?raw=true)

# 代码说明
### 基础实现
这个其实在社区里有不少文章说过了，但是在这里我还是重复讲一遍吧。  
首先，大家都知道肯定是需要两个项目的，一个对应小游戏的主域，另一个对应小游戏的开放数据域（子域）。  
main文件夹，对应主域，初始化的时候用 <code>Laya.MiniAdpter.init(true, false);</code>，表示是主域，并自动将加载的文本数据自动传递到子域。  
而open-data对应子域，初始化时用 <code>Laya.MiniAdpter.init(true, true);</code>，其实我觉得第一个参数没啥用，关键是第二个参数表示它是子域。  

---
在主域中，做了以下几件事：
* 设置共享画布，根据小游戏的文档，它的宽高只能在主域设置，不能在开放数据域中设置，我这里使用了如下的代码：
```
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
```
* 绘制离屏画布，我在这里是把它放在了页面里，首先创建了一个Sprite组件，并设置它的var为openDataCanvas，然后，在View初始化时使用如下代码：
```
let texture:Laya.Texture = new Laya.Texture(Laya.Browser.window.sharedCanvas);
texture.bitmap.alwaysChange = true;//小程序使用，非常费，这个参数可以根据自己的需求适当调整，如果内容不变可以不用设置成true
this.openDataCanvas.graphics.drawTexture(texture, 0, 0, texture.width, texture.height);
```
* 控制离屏画布的显示和隐藏，有了上面的openDataCanvas，直接设置它的visible属性就好。然后在显示的同时，向子域发送刷新数据的命令（参考下方子域接收命令的说明），以下是部分代码：
```
protected postMessage(item:Object):void
{
    if (Laya.Browser.onMiniGame) {
        let wx = Laya.Browser.window.wx;
        let openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage(item);
    }
}

public showRankList():void
{
    this.rankBox.x = -480;
    this.openDataCanvas.x = -471;
    this.rankBox.visible = true;
    this.openDataCanvas.visible = true;

    Laya.Tween.to(this.rankBox, {"x": 0}, 200);
    Laya.Tween.to(this.openDataCanvas, {"x": 0}, 200);

    this.postMessage({
        cmd: 'showRank',
    });
}
```

---
在子域中，主要就是一件事，接收主域的命令并处理，在这里，我把它分为系统需要的部分和自定义部分。
* 系统需要部分，主要就是缓存文件数据和重设渲染canvas。
* 自定义部分，主要是处理关系链数据及绘制。
示例代码如下：
```
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
```

### 版本管理&图集使用
##### 版本 <= 1.7.20
主域使用版本管理，子域不使用，当主域自动把atlas内容通过消息传给子域后，子域再去加载资源。  

主域中，资源加载完成后，将atlas内容传给子域。因为使用了版本管理，因此系统自动的传递，子域接收到后对应的URL是不正确的，所以需要手动再传一次，如下：  
```
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
```

子域收到loadRes的消息后，才开始加载资源。  
但是这里还有一个问题，在主域，加载atlas之后，再加载对应的png文件，也是带着版本号的，而在子域中，是直接加载不带版本号的png文件。  
所以，我在这里多做了一个操作，将原始不带版本号的png文件拷贝了一份，放在同一个文件夹下。  
我以rank.atlas和rank.png为例，将它们从res文件夹中拷贝出来，放在单独rankRes文件夹中，就是发布图集之后执行copy.bat做的事情,然后进行加载。  
当然，直接将它们从bin/res/atlas文件夹拷贝到release/wxgame/res/atlas文件夹下也是可以的。  
那么，我把它放在单独的文件夹中有什么好处呢？答案是，整个res文件夹，我是放在网上进行加载的，最后发布出来的微信小游戏项目中，res文件夹我是直接删除的，本地和网络加载的文件混在一起，处理起来会有些麻烦:)

##### 版本 >= 1.7.21
首先，版本管理暂时不太容易绕过，因为需要读取version.json文件的内容，而在子域里，非常不幸，没有办法使用文件系统相关的方法。
或许可以更改laya源码部分，将version.json内容传送到子域，但是这个改动可能有点大，不是一行代码的事，坐等官方更新。所以，还是先将就着不要用版本管理吧，而且实际跟使用版本管理也没有区别，因为最终加载的是带版本号的文件。 
    
比起之前版本的进步在于，rank.atlas和rank.png，不需要放在单独的文件夹中了，从主域加载了可以直接将本地文件url传过去，需要时直接使用即可。
存在的一个问题就是，使用`MiniAdpter.sendAtlasToOpenDataContext`时，传的url还是原始的未经过版本管理解析的，这样子域会加载不到，因此需要改一行代码，变成真正存在的url。

# ~~TODO~~
~~研究一下有没有什么开挂的方法，让子域需要的图集也能从网络加载，或者说，主域从网络加载了，同步到子域中。~~  
从版本1.7.21开始，laya已经增加了将图集直接传到子域的方法`MiniAdpter.sendAtlasToOpenDataContext`，使用它即可，使用步骤里已经有补充，不再赘述。
