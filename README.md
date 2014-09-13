TheBiBleAsk
===========

圣经我问你答Html5游戏<br>

这是一款用cocos2dx-js-v3.0-rc2做得公益游戏。<br>
在cocos2dx-js-v3.0里使用cocos compile -p web -m release来对html5的js代码进行压缩。<br>
它将生成在public/html5里，说这个是因为很多人都在找js压缩方法，但官网并没有明确的提到.<br>

关于微信分享部分，在index.html里有写，它主要的原理是在doc中注册一个监听事件，在当<br>
微信点击分享时，触发这个事件，从而写入分享内容。因此分享内容一般都会在页面全局变量window中进行设置。<br>

这款游戏的地址为 http://thbibleask.luzexi.com 最好用手机打开。<br>


