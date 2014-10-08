/**
 * Created by luzexi on 14-9-7.
 */

var g_game_score = 0;
var g_win_num = 0;
var g_question_num = 0;

var GameLayer = cc.Layer.extend({

    score_lab:null,
    question_lab:null,
    answer_a_btn:null,
    answer_b_btn:null,
    answer_c_btn:null,

    answer_index:null,

    init:function()
    {
        g_game_score = 0;
        g_win_num = 0;
        g_question_num = 1;

        var img_bg = new cc.Sprite(res.s_game_bg);
        img_bg.setPosition(0,0);
        img_bg.setAnchorPoint(0,0);
        this.addChild(img_bg);

        this.score_lab = cc.LabelTTF.create("您的得分:0","",30);
        this.score_lab.setColor(cc.color(0,0,0,255));
        this.score_lab.setPosition(150 , g_screen_size.height - 120);
        this.addChild(this.score_lab);

        this.showQuestion();
    },

    showQuestion:function()
    {

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

//        cc.LabelAtlas.create();

        this.question_lab = cc.LabelTTF.create("第"+g_question_num+"题:\n\n    编号"+question.id+"--请问:"+question.ask,"",30,cc.size(500,350));
        this.question_lab.setColor(cc.color(0,0,0,255));
        this.question_lab.setPosition(g_screen_size.width/2 , g_screen_size.height/2+100);
        this.addChild(this.question_lab);

        this.answer_index = parseInt( Math.random()*100%3 );

        //var label_a = cc.LabelTTF.create("A. "+question.answer[0]);

        var lab_a = null;
        var lab_b = null;
        var lab_c = null;

        var btn_a = null;
        var btn_b = null;
        var btn_c = null;
        switch( this.answer_index )
        {
            case 0:
                lab_a = cc.LabelTTF.create("A. "+question.answer[0],"",30,cc.size(200,0),cc.TEXT_ALIGNMENT_LEFT);
                lab_b = cc.LabelTTF.create("B. "+question.answer[1],"",30,cc.size(200,0),cc.TEXT_ALIGNMENT_LEFT);
                lab_c = cc.LabelTTF.create("C. "+question.answer[2],"",30,cc.size(200,0),cc.TEXT_ALIGNMENT_LEFT);
                break;
            case 1:
                lab_a = cc.LabelTTF.create("A. "+question.answer[1],"",30,cc.size(200,0),cc.TEXT_ALIGNMENT_LEFT);
                lab_b = cc.LabelTTF.create("B. "+question.answer[0],"",30,cc.size(200,0),cc.TEXT_ALIGNMENT_LEFT);
                lab_c = cc.LabelTTF.create("C. "+question.answer[2],"",30,cc.size(200,0),cc.TEXT_ALIGNMENT_LEFT);
                break;
            case 2:
                lab_a = cc.LabelTTF.create("A. "+question.answer[1],"",30,cc.size(200,0),cc.TEXT_ALIGNMENT_LEFT);
                lab_b = cc.LabelTTF.create("B. "+question.answer[2],"",30,cc.size(200,0),cc.TEXT_ALIGNMENT_LEFT);
                lab_c = cc.LabelTTF.create("C. "+question.answer[0],"",30,cc.size(200,0),cc.TEXT_ALIGNMENT_LEFT);
                break;
        }

        lab_a.setColor(cc.color(0,0,0,255));
        lab_b.setColor(cc.color(0,0,0,255));
        lab_c.setColor(cc.color(0,0,0,255));

        btn_a = cc.MenuItemLabel.create(lab_a,this.answer_a,this);
        btn_b = cc.MenuItemLabel.create(lab_b,this.answer_b,this);
        btn_c = cc.MenuItemLabel.create(lab_c,this.answer_c,this);
        this.answer_a_btn = cc.Menu.create(btn_a);
        this.answer_a_btn.setPosition(g_screen_size.width/2,g_screen_size.height/2+50);
        this.answer_b_btn = cc.Menu.create(btn_b);
        this.answer_b_btn.setPosition(g_screen_size.width/2,g_screen_size.height/2-50);
        this.answer_c_btn = cc.Menu.create(btn_c);
        this.answer_c_btn.setPosition(g_screen_size.width/2,g_screen_size.height/2-150);

        this.addChild(this.answer_a_btn);
        this.addChild(this.answer_b_btn);
        this.addChild(this.answer_c_btn);
    },

    win:function()
    {
        g_question_num++;
        g_game_score += 100;
        g_win_num++;
        this.score_lab.setString("您的得分:"+g_game_score);
    },

    lose:function()
    {
//        if(g_question_num > 10)
        {
            var scene = cc.Scene.create();
            var layer = new GameoverLayer();
            layer.init();
            scene.addChild(layer);
            cc.director.runScene(scene);
            return false;
        }
//        g_question_num++;
        return true;
    },

    answer_a:function()
    {
        if( this.answer_index == 0)
        {
            this.win();
            this.showQuestion();
        }
        else
        {
            if(this.lose())
                this.showQuestion();
        }
    },
    answer_b:function()
    {
        if( this.answer_index == 1)
        {
            this.win();
            this.showQuestion();
        }
        else
        {
            if(this.lose())
                this.showQuestion();
        }
    },
    answer_c:function()
    {
        if( this.answer_index == 2)
        {
            this.win();
            this.showQuestion();
        }
        else
        {
            if(this.lose())
                this.showQuestion();
        }
    }

});