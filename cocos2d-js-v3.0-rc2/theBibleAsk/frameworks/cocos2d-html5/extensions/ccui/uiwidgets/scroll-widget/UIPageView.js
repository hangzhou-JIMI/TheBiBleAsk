/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

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

/**
 * The PageView control of Cocos UI.
 * @class
 * @extends ccui.Layout
 */
ccui.PageView = ccui.Layout.extend(/** @lends ccui.PageView# */{
    _curPageIdx: 0,
    _pages: null,
    _touchMoveDirection: null,
    _touchStartLocation: 0,
    _touchMoveStartLocation: 0,
    _movePagePoint: null,
    _leftBoundaryChild: null,
    _rightBoundaryChild: null,
    _leftBoundary: 0,
    _rightBoundary: 0,

    _isAutoScrolling: false,
    _autoScrollDistance: 0,
    _autoScrollSpeed: 0,
    _autoScrollDirection: 0,

    _childFocusCancelOffset: 0,
    _pageViewEventListener: null,
    _pageViewEventSelector: null,
    _className:"PageView",
    _eventCallback: null,

    /**
     * allocates and initializes a UIPageView.
     * Constructor of ccui.PageView
     * @example
     * // example
     * var uiPageView = new ccui.PageView();
     */
    ctor: function () {
        ccui.Layout.prototype.ctor.call(this);
        this._pages = [];
        this._touchMoveDirection = ccui.PageView.TOUCH_DIR_LEFT;

        this._movePagePoint = null;
        this._leftBoundaryChild = null;
        this._rightBoundaryChild = null;

        this._childFocusCancelOffset = 5;
        this._pageViewEventListener = null;
        this._pageViewEventSelector = null;
        this.setTouchEnabled(true);
    },

    init: function () {
        if (ccui.Layout.prototype.init.call(this)) {
            this.setClippingEnabled(true);
            return true;
        }
        return false;
    },

    onEnter:function(){
        ccui.Layout.prototype.onEnter.call(this);
        this.scheduleUpdate(true);
    },

    /**
     * Add a widget to a page of PageView.
     * @param {ccui.Widget} widget widget to be added to PageView.
     * @param {number} pageIdx index of page.
     * @param {Boolean} forceCreate if force create and there is no page exist, PageView would create a default page for adding widget.
     */
    addWidgetToPage: function (widget, pageIdx, forceCreate) {
        if (!widget || pageIdx < 0)
            return;

        var pageCount = this._getPageCount();
        if (pageIdx < 0 || pageIdx >= pageCount) {
            if (forceCreate) {
                if (pageIdx > pageCount)
                    cc.log("pageIdx is %d, it will be added as page id [%d]", pageIdx, pageCount);
                var newPage = this._createPage();
                newPage.addChild(widget);
                this.addPage(newPage);
            }
        } else {
            var page = this._pages[pageIdx];
            if (page)
                page.addChild(widget);
        }
    },

    /**
     * create page
     * @returns {ccui.Layout}
     * @protected
     */
    _createPage: function () {
        var newPage = ccui.Layout.create();
        newPage.setContentSize(this.getContentSize());
        return newPage;
    },

    /**
     * Push back a page to PageView.
     * @param {ccui.Layout} page
     */
    addPage: function (page) {
        if (!page || this._pages.indexOf(page) != -1)
            return;

        this.addChild(page);
        this._pages.push(page);
        this._doLayoutDirty = true;
    },

    /**
     * Insert a page to PageView.
     * @param {ccui.Layout} page page to be added to PageView.
     * @param {Number} idx index
     */
    insertPage: function (page, idx) {
        if (idx < 0 || !page || this._pages.indexOf(page) != -1)
            return;

        var pageCount = this._getPageCount();
        if (idx >= pageCount)
            this.addPage(page);
        else {
            this._pages[idx] = page;
            this.addChild(page);
        }
        this._doLayoutDirty = true;
    },

    /**
     * Remove a page of PageView.
     * @param {ccui.Layout} page
     */
    removePage: function (page) {
        if (!page) {
            return;
        }
        this.removeChild(page);
        var index = this._pages.indexOf(page);
        if(index > -1)
            this._pages.splice(index, 1);
        this._doLayoutDirty = true;
    },

    /**
     * Remove a page at index of PageView.
     * @param {number} index
     */
    removePageAtIndex: function (index) {
        if (index < 0 || index >= this._pages.length)
            return;
        var page = this._pages[index];
        if (page)
            this.removePage(page);
    },

    /**
     * remove all pages from PageView
     */
    removeAllPages: function(){
        var locPages = this._pages;
        for(var i = 0, len = locPages.length; i < len; i++){
            this.removeChild(locPages[i]);
        }
        this._pages.length = 0;
    },

    _updateBoundaryPages: function () {
        var locPages = this._pages;
        if (locPages.length <= 0) {
            this._leftBoundaryChild = null;
            this._rightBoundaryChild = null;
            return;
        }
        this._leftBoundaryChild = locPages[0];
        this._rightBoundaryChild = locPages[locPages.length - 1];
    },

    _getPageCount: function(){
        return this._pages.length;
    },

    /**
     * Get x position by index
     * @param {number} idx
     * @returns {number}
     */
    _getPositionXByIndex: function (idx) {
        return (this.getContentSize().width * (idx - this._curPageIdx));
    },

    _onSizeChanged: function () {
        ccui.Layout.prototype._onSizeChanged.call(this);
        this._rightBoundary = this.getContentSize().width;
        this._doLayoutDirty = true;
    },

    _updateAllPagesSize: function(){
        var selfSize = this.getContentSize();
        var locPages = this._pages;
        for (var i = 0, len = locPages.length; i < len; i++)
            locPages[i].setContentSize(selfSize);
    },

    _updateAllPagesPosition: function(){
        var pageCount = this._getPageCount();
        if (pageCount <= 0) {
            this._curPageIdx = 0;
            return;
        }

        if (this._curPageIdx >= pageCount)
            this._curPageIdx = pageCount-1;

        var pageWidth = this.getContentSize().width;
        var locPages = this._pages;
        for (var i=0; i< pageCount; i++)
            locPages[i].setPosition(cc.p((i - this._curPageIdx) * pageWidth, 0));
    },

    /**
     * scroll PageView to index.
     * @param {number} idx index of page.
     */
    scrollToPage: function (idx) {
        if (idx < 0 || idx >= this._pages.length)
            return;
        this._curPageIdx = idx;
        var curPage = this._pages[idx];
        this._autoScrollDistance = -(curPage.getPosition().x);
        this._autoScrollSpeed = Math.abs(this._autoScrollDistance) / 0.2;
        this._autoScrollDirection = this._autoScrollDistance > 0 ? ccui.PageView.DIRECTION_RIGHT : ccui.PageView.DIRECTION_LEFT;
        this._isAutoScrolling = true;
    },

    update: function (dt) {
        if (this._isAutoScrolling)
            this._autoScroll(dt);
    },

    setLayoutType:function(type){

    },

    getLayoutType: function(){
        return ccui.Layout.ABSOLUTE;
    },

    _autoScroll: function(dt){
        var step;
        switch (this._autoScrollDirection) {
            case ccui.PageView.DIRECTION_LEFT:
                step = this._autoScrollSpeed * dt;
                if (this._autoScrollDistance + step >= 0.0) {
                    step = -this._autoScrollDistance;
                    this._autoScrollDistance = 0.0;
                    this._isAutoScrolling = false;
                } else
                    this._autoScrollDistance += step;
                this._scrollPages(-step);
                if(!this._isAutoScrolling)
                    this._pageTurningEvent();
                break;
                break;
            case ccui.PageView.DIRECTION_RIGHT:
                step = this._autoScrollSpeed * dt;
                if (this._autoScrollDistance - step <= 0.0) {
                    step = this._autoScrollDistance;
                    this._autoScrollDistance = 0.0;
                    this._isAutoScrolling = false;
                } else
                    this._autoScrollDistance -= step;
                this._scrollPages(step);
                if(!this._isAutoScrolling)
                    this._pageTurningEvent();
                break;
            default:
                break;
        }
    },

    onTouchMoved: function (touch, event) {
        this._handleMoveLogic(touch);
        var widgetParent = this.getWidgetParent();
        if (widgetParent)
            widgetParent.interceptTouchEvent(ccui.Widget.TOUCH_MOVED, this, touch);
        this._moveEvent();
    },

    onTouchEnded: function (touch, event) {
        ccui.Layout.prototype.onTouchEnded.call(this, touch, event);
        this._handleReleaseLogic(touch);
    },

    onTouchCancelled: function (touch, event) {
        ccui.Layout.prototype.onTouchCancelled.call(this, touch, event);
        this._handleReleaseLogic(touch);
    },

    _doLayout: function(){
        if (!this._doLayoutDirty)
            return;

        this._updateAllPagesPosition();
        this._updateAllPagesSize();
        this._updateBoundaryPages();
        this._doLayoutDirty = false;
    },

    _movePages: function (offset) {
        var arrayPages = this._pages;
        var length = arrayPages.length;
        for (var i = 0; i < length; i++) {
            var child = arrayPages[i];
            //var pos = child.getPosition();
            //child.setPosition(pos.x + offset, pos.y);
            child.setPositionX(child.getPositionX() + offset);
        }
    },

    _scrollPages: function (touchOffset) {
        if (this._pages.length <= 0)
            return false;

        if (!this._leftBoundaryChild || !this._rightBoundaryChild)
            return false;

        var realOffset = touchOffset;
        switch (this._touchMoveDirection) {
            case ccui.PageView.TOUCH_DIR_LEFT: // left
                var rightBoundary = this._rightBoundaryChild.getRightBoundary();
                if (rightBoundary + touchOffset <= this._rightBoundary) {
                    realOffset = this._rightBoundary - rightBoundary;
                    this._movePages(realOffset);
                    return false;
                }
                break;
            case ccui.PageView.TOUCH_DIR_RIGHT: // right
                var leftBoundary = this._leftBoundaryChild.getLeftBoundary();
                if (leftBoundary + touchOffset >= this._leftBoundary) {
                    realOffset = this._leftBoundary - leftBoundary;
                    this._movePages(realOffset);
                    return false;
                }
                break;
            default:
                break;
        }

        this._movePages(realOffset);
        return true;
    },

    _handleMoveLogic: function (touch) {
        var offset = touch.getLocation().x - touch.getPreviousLocation().x;
        if (offset < 0)
            this._touchMoveDirection = ccui.PageView.TOUCH_DIR_LEFT;
        else if (offset > 0)
            this._touchMoveDirection = ccui.PageView.TOUCH_DIR_RIGHT;
        this._scrollPages(offset);
    },

    _handleReleaseLogic: function (touchPoint) {
        if (this._pages.length <= 0)
            return;
        var curPage = this._pages[this._curPageIdx];
        if (curPage) {
            var curPagePos = curPage.getPosition();
            var pageCount = this._pages.length;
            var curPageLocation = curPagePos.x;
            var pageWidth = this.getSize().width;
            var boundary = pageWidth / 2.0;
            if (curPageLocation <= -boundary) {
                if (this._curPageIdx >= pageCount - 1)
                    this._scrollPages(-curPageLocation);
                else
                    this.scrollToPage(this._curPageIdx + 1);
            }
            else if (curPageLocation >= boundary) {
                if (this._curPageIdx <= 0)
                    this._scrollPages(-curPageLocation);
                else
                    this.scrollToPage(this._curPageIdx - 1);
            } else
                this.scrollToPage(this._curPageIdx);
        }
    },

    interceptTouchEvent: function (handleState, sender, touch) {
        var touchPoint = touch.getLocation();
        switch (handleState) {
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_MOVED:
                var offset = 0;
                offset = Math.abs(sender.getTouchBeganPosition().x - touchPoint.x);
                if (offset > this._childFocusCancelOffset) {
                    sender.setFocused(false);
                    this._handleMoveLogic(touch);
                }
                break;
            case ccui.Widget.TOUCH_ENDED:
            case ccui.Widget.TOUCH_CANCELED:
                this._handleReleaseLogic(touch);
                break;
        }
    },

    _pageTurningEvent: function () {
        if (this._pageViewEventListener && this._pageViewEventSelector)
            this._pageViewEventSelector.call(this._pageViewEventListener, this, ccui.PageView.EVENT_TURNING);
        if (this._eventCallback)
            this._eventCallback(this, ccui.PageView.EVENT_TURNING);
    },

    /**
     * @param {Function} selector
     * @param {Object} target
     */
    addEventListenerPageView: function (selector, target) {
        this._pageViewEventSelector = selector;
        this._pageViewEventListener = target;
    },

    addEventListener: function(callback){
        this._eventCallback = callback;
    },

    /**
     * get current page index
     * @returns {number}
     */
    getCurPageIndex: function () {
        return this._curPageIdx;
    },

    /**
     * get all pages of PageView
     * @returns {Array}
     */
    getPages:function(){
        return this._pages;
    },

    /**
     * get a page from PageView by index
     * @param {Number} index
     * @returns {ccui.Layout}
     */
    getPage: function(index){
        if (index < 0 || index >= this.getPages().size())
            return null;
        return this._pages[index];
    },

    /**
     * Returns the "class name" of widget.
     * @returns {string}
     */
    getDescription: function () {
        return "PageView";
    },

    _createCloneInstance: function () {
        return ccui.PageView.create();
    },

    _copyClonedWidgetChildren: function (model) {
        var arrayPages = model.getPages();
        for (var i = 0; i < arrayPages.length; i++) {
            var page = arrayPages[i];
            this.addPage(page.clone());
        }
    },

    _copySpecialProperties: function (pageView) {
        ccui.Layout.prototype._copySpecialProperties.call(this, pageView);
        this._eventCallback = pageView._eventCallback;
        this._pageViewEventListener = pageView._pageViewEventListener;
        this._pageViewEventSelector = pageView._pageViewEventSelector;
    }
});
/**
 * allocates and initializes a UIPageView.
 * @deprecated
 * @return {ccui.PageView}
 * @example
 * // example
 * var uiPageView = ccui.PageView.create();
 */
ccui.PageView.create = function () {
    return new ccui.PageView();
};

// Constants
//PageView event
ccui.PageView.EVENT_TURNING = 0;

//PageView touch direction
ccui.PageView.TOUCH_DIR_LEFT = 0;
ccui.PageView.TOUCH_DIR_RIGHT = 1;

//PageView auto scroll direction
ccui.PageView.DIRECTION_LEFT = 0;
ccui.PageView.DIRECTION_RIGHT = 1;