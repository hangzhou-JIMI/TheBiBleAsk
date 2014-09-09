/**
 * Created by luzexi on 14-9-9.
 */



var GameoverLayer = cc.Layer.extend({

    share_layer:null,
    share_label:null,

    init:function()
    {
        var per = parseInt(g_win_num / g_question_num * 1000)/10.0;
        var tittle_lab = cc.LabelTTF.create("您的最后得分:"+g_game_score+"\n\n您的答对:"+g_win_num+"题目"+"\n\n您的正确率为:"+per+"%","",30);
        tittle_lab.setPosition(g_screen_size.width/2, g_screen_size.height/2+200);
        this.addChild(tittle_lab);

        var reset_label = cc.LabelTTF.create("再来一次","",30);
        var reset_btn = cc.MenuItemLabel.create(reset_label,this.reset,this);
        var reset_menu = cc.Menu.create(reset_btn);
        reset_menu.setPosition(g_screen_size.width/2-100,g_screen_size.height/2-100);
        this.addChild(reset_menu);

        var share_label = cc.LabelTTF.create("分享给弟兄姊妹","",30);
        var share_btn = cc.MenuItemLabel.create(share_label,this.share,this);
        var share_menu = cc.Menu.create(share_btn);
        share_menu.setPosition(g_screen_size.width/2+100,g_screen_size.height/2-100);
        this.addChild(share_menu);

        window.shareData.tTitle = "你在圣经问答中获得"+g_game_score+"分,你对圣经的了解超过64%的弟兄姊妹";
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

