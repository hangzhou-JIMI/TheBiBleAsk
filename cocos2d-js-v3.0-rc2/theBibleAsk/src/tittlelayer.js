/**
 * Created by luzexi on 14-9-7.
 */


var g_screen_size = null;

var Tittlelayer = cc.Layer.extend({

    start_menubtn:null,

    init:function()
    {
        g_screen_size = cc.winSize;

        var img_bg = new cc.Sprite(res.s_tittle_bg,cc.rect(0,0,640,960));
        img_bg.setAnchorPoint(0,0);
        this.addChild(img_bg);

        var img_tittle = new cc.Sprite(res.s_tittle_tittle);
        this.addChild(img_tittle);
        img_tittle.setPosition(g_screen_size.width/2,g_screen_size.height/2+150);

        var start_btn = new cc.MenuItemImage(res.s_tittle_btn1,res.s_tittle_btn2,null,this.startgame,this);
        this.start_menubtn = cc.Menu.create(start_btn);
        this.start_menubtn.setAnchorPoint(0,0);
        this.start_menubtn.setPosition(g_screen_size.width/2,g_screen_size.height/2 - 50);
        this.addChild(this.start_menubtn);
    },

    start_callback:function()
    {
        var scaleToA = cc.ScaleTo.create(0.1,0.9,0.9);
        var scaleToB = cc.ScaleTo.create(0.1, 1, 1);
        var actionTodo = cc.CallFunc.create(this.startgame);

        this.start_menubtn.runAction(cc.Sequence.create(scaleToA,scaleToB,actionTodo));
    },

    startgame:function()
    {
        cc.log("hiden tittle");
        var scene = cc.Scene.create();
        var layer = new GameLayer();
        layer.init();
        scene.addChild(layer);
        cc.director.runScene(scene);
    }

});