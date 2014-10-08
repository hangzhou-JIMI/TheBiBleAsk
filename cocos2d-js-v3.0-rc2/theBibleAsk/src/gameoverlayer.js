/**
 * Created by luzexi on 14-9-9.
 */



var GameoverLayer = cc.Layer.extend({

    share_layer:null,
    share_label:null,

    init:function()
    {
        var img_bg = new cc.Sprite(res.s_over_bg);
        img_bg.setPosition(0,0);
        img_bg.setAnchorPoint(0,0);
        this.addChild(img_bg);

        var per = parseInt(g_win_num / g_question_num * 1000)/10.0;
        var tittle_lab = cc.LabelTTF.create("您的最后得分:"+g_game_score+"\n\n您的答对:"+g_win_num+"题目"+"\n\n您的正确率为:"+per+"%","",30);
        tittle_lab.setColor(cc.color(0,0,0,255));
        tittle_lab.setPosition(g_screen_size.width/2, g_screen_size.height/2+100);
        this.addChild(tittle_lab);

        var reset_btn = cc.MenuItemImage.create(res.s_over_resetbtn1,res.s_over_resetbtn2,this.reset,this);
        var reset_menu = cc.Menu.create(reset_btn);
        reset_menu.setPosition(g_screen_size.width/2-100,g_screen_size.height/2-100);
        this.addChild(reset_menu);

        var share_btn = cc.MenuItemImage.create(res.s_over_sharebtn1,res.s_over_sharebtn2,this.share,this);
        var share_menu = cc.Menu.create(share_btn);
        share_menu.setPosition(g_screen_size.width/2+100,g_screen_size.height/2-100);
        this.addChild(share_menu);

        var per = 0;
        per = Math.ceil( g_game_score / 20.0 );
        window.shareData.tTitle = "你在圣经问答中获得"+g_game_score+"分,超过"+per+"%的弟兄姊妹";
    },

    reset:function()
    {
        var scene = cc.Scene.create();
        var layer = new Tittlelayer();
        layer.init();
        scene.addChild(layer);
        cc.director.runScene(scene);
    },

    share:function()
    {
        this.share_layer = cc.LayerColor.create(cc.color(0,0,0,200));
        this.share_label = cc.LabelTTF.create("点击分享朋友圈↑↑↑","",30);
        this.share_label.setColor(cc.color(255,0,0));
        this.share_label.setPosition(g_screen_size.width - 150 , g_screen_size.height -30);
        this.addChild(this.share_layer);
        this.addChild(this.share_label);

        var listen = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesEnded:function (touches, event) {
                if (touches.length <= 0)
                    return;
//                event.getCurrentTarget().moveSprite(touches[0].getLocation());
                event.getCurrentTarget().remove_sharelayer();
                cc.eventManager.removeListener(listen);
            }
        });
        cc.eventManager.addListener( listen , this);
    },

    remove_sharelayer:function()
    {
        if(this.share_layer != null )
        {
            this.share_layer.removeFromParent(true);
            this.share_layer = null;
        }
        if(this.share_label != null)
        {
            this.share_label.removeFromParent(true);
            this.share_label = null;
        }
    },

    onMouseUp:function (event) {

        this.remove_sharelayer();
    },

    onTouchesEnded:function (touches, event) {
        this.remove_sharelayer();
    }

});

