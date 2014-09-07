/**
 * Created by luzexi on 14-9-7.
 */


var GameLayer = cc.Layer.extend({

    question_lab:null,
    answer_a_btn:null,
    answer_b_btn:null,
    answer_c_btn:null,

    init:function()
    {
        var bg_layer = cc.LayerColor.create(cc.c4b(50,200,100,255),g_screen_size.width,g_screen_size.height);
        this.addChild(bg_layer);

        this.showQuestion();
    },

    showQuestion:function() {
        if (this.question_lab != null) {
            this.question_lab.removeFromParent();
            this.question_lab = null;
        }
        if (this.answer_a_btn != null) {
            this.answer_a_btn.removeFromParent();
            this.answer_a_btn = null;
        }
        if (this.answer_b_btn != null)
        {
            this.answer_b_btn.removeFromParent();
            this.answer_b_btn = null;
        }
        if(this.answer_c_btn != null)
        {
            this.answer_c_btn.removeFromParent();
            this.answer_c_btn = null;
        }

        var question = g_questionMgr.randomQuestion();

        this.question_lab = cc.LabelTTF.create("ID"+question.id+"--请问:"+question.ask,"",30);
        this.question_lab.setPosition(g_screen_size.width/2 , g_screen_size.height/2);
        this.addChild(this.question_lab);

        //var label_a = cc.LabelTTF.create("A. "+question.answer[0]);
        var btn_a = cc.MenuItemFont.create("A. "+question.answer[0],this.answer_a,this);
        var btn_b = cc.MenuItemFont.create("B. "+question.answer[1],this.answer_b,this);
        var btn_c = cc.MenuItemFont.create("C. "+question.answer[2],this.answer_c,this);
//        var label_b = cc.LabelTTF.create("B. "+question.answer[1]);
//        var label_c = cc.LabelTTF.create("C. "+question.answer[2]);
        this.answer_a_btn = cc.Menu.create(btn_a);
        this.answer_a_btn.setPosition(g_screen_size.width/2,g_screen_size.height/2-50);
        this.answer_b_btn = cc.Menu.create(btn_b);
        this.answer_b_btn.setPosition(g_screen_size.width/2,g_screen_size.height/2-100);
        this.answer_c_btn = cc.Menu.create(btn_c);
        this.answer_c_btn.setPosition(g_screen_size.width/2,g_screen_size.height/2-150);

        this.addChild(this.answer_a_btn);
        this.addChild(this.answer_b_btn);
        this.addChild(this.answer_c_btn);
    },

    answer_a:function()
    {
        cc.log("a");
    },
    answer_b:function()
    {
        cc.log("b");
    },
    answer_c:function()
    {
        cc.log("c");
    }

});