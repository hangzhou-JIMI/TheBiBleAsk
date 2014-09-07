/****************************************************************************
 Copyright (c) 2013 cocos2d-x.org

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var UIRichTextTest = UIScene.extend({
    _richText:null,
    init: function () {
        if (this._super()) {
            //init text
            this._topDisplayLabel.setText("");
            this._bottomDisplayLabel.setText("RichText");

            var widgetSize = this._widget.getSize();
            var button = ccs.Button.create();
            button.setTouchEnabled(true);
            button.loadTextures("res/cocosgui/animationbuttonnormal.png", "res/cocosgui/animationbuttonpressed.png", "");
            button.setTitleText("switch");
            button.setPosition(cc.p(widgetSize.width / 2, widgetSize.height / 2 + button.getSize().height * 2.5));
            button.addTouchEventListener(this.touchEvent,this);
            this._uiLayer.addWidget(button);


            // RichText
            var richText = ccs.RichText.create();
            richText.ignoreContentAdaptWithSize(false);
            richText.setSize(cc.size(120, 100));

            var re1 = ccs.RichElementText.create(1, cc.white(), 255, "This color is white. ", "Helvetica", 10);
            var re2 = ccs.RichElementText.create(2, cc.yellow(), 255, "And this is yellow. ", "Helvetica", 10);
            var re3 = ccs.RichElementText.create(3, cc.blue(), 255, "This one is blue. ", "Helvetica", 10);
            var re4 = ccs.RichElementText.create(4, cc.green(), 255, "And green. ", "Helvetica", 10);
            var re5 = ccs.RichElementText.create(5, cc.red(), 255, "Last one is red ", "Helvetica", 10);

            var reimg = ccs.RichElementImage.create(6,cc.white(), 255, "res/cocosgui/sliderballnormal.png");

            ccs.ArmatureDataManager.getInstance().addArmatureFileInfo("res/cocosgui/100/100.ExportJson");
            var pAr = ccs.Armature.create("100");
            pAr.getAnimation().play("Animation1");

            var recustom = ccs.RichElementCustomNode.create(1, cc.white(), 255, pAr);
            var re6 = ccs.RichElementText.create(7, cc.orange(), 255, "Have fun!! ", "Helvetica", 10);
            richText.pushBackElement(re1);
            richText.insertElement(re2, 1);
            richText.pushBackElement(re3);
            richText.pushBackElement(re4);
            richText.pushBackElement(re5);
            richText.insertElement(reimg, 2);
            richText.pushBackElement(recustom);
            richText.pushBackElement(re6);

            richText.setPosition(cc.p(widgetSize.width / 2, widgetSize.height / 2));

            this._uiLayer.addWidget(richText);
            this._richText = richText;
            return true;
        }
        return false;
    },
    touchEvent: function (sender, type) {
        if (type == ccs.TouchEventType.ended) {
            if (this._richText.isIgnoreContentAdaptWithSize()) {
                this._richText.ignoreContentAdaptWithSize(false);
                this._richText.setSize(cc.size(120, 100));
            }
            else {
                this._richText.ignoreContentAdaptWithSize(true);
            }
        }
    }
});