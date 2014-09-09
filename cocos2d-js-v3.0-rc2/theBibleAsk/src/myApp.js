var StartScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var txtData = cc.loader.getRes(res.s_question1);
        questionReader(txtData);

        var layer = new Tittlelayer();
        layer.init();
        this.addChild(layer);
    }
});

