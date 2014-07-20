var Gap = 20;
var Count = 4;
var Grids = [];
var Calc = [];
var Drop = [];
var View = {};

var Grid = cc.Sprite.extend({
    index:0,
    num:2,
    txt:null,
    hit:false,

    init:function (index, layer) {
        this._super(s_grid);

        this.index = index;
        this.num = 2;

        this.setPosition(this.position());

        this.txt = cc.LabelTTF.create("", "Arial", 40);
        var size = this.getContentSize();
        this.txt.setPosition(cc.p(size.width * 0.5, size.height * 0.5));
        this.txt.setColor(cc.c3b(50, 50, 50));
        this.addChild(this.txt);
        this.updateSprite();

        this.setScale(0.5);
        this.setOpacity(0);
        this.setVisible(false);
        layer.addChild(this, 1);

        var action1_1 = cc.ScaleTo.create(0.3, 1);
        var action1_2 = cc.FadeIn.create(0.3);
        var action1 = cc.DelayTime.create(0.3);
        var action2 = cc.Show.create();
        var action3 = cc.Spawn.create(action1_1, action1_2);
        this.runAction(cc.Sequence.create(action1, action2, action3));
    },

    updateSprite:function () {
        if (this.num == 2) {
            this.txt.setString("商");
            this.setColor(cc.c3b(238, 228, 218));
        } else if (this.num == 4) {
            this.txt.setString("周");
            this.setColor(cc.c3b(237, 224, 200));
        } else if (this.num == 8) {
            this.txt.setString("秦");
            this.setColor(cc.c3b(242, 177, 121));
        } else if (this.num == 16) {
            this.txt.setString("汉");
            this.setColor(cc.c3b(245, 149, 99));
        } else if (this.num == 32) {
            this.txt.setString("唐");
            this.setColor(cc.c3b(246, 124, 95));
        } else if (this.num == 64) {
            this.txt.setString("宋");
            this.setColor(cc.c3b(246, 94, 59));
        } else if (this.num == 128) {
            this.txt.setString("元");
            this.setColor(cc.c3b(237, 207, 114));
        } else if (this.num == 256) {
            this.txt.setString("明");
            this.setColor(cc.c3b(237, 204, 97));
        } else if (this.num == 512) {
            this.txt.setString("清");
            this.setColor(cc.c3b(238, 147, 143));
        } else if (this.num == 1024) {
            this.txt.setString("ROC");
            this.setColor(cc.c3b(244, 128, 218));
        } else if (this.num == 2048) {
            this.txt.setString("PRC");
            this.setColor(cc.c3b(255, 0, 0));
        } else {
            this.txt.setString("?");
            this.setColor(cc.c3b(238, 228, 218));
        }
    },

    position:function () {
        return cc.p((100 + Gap) * (this.index % Count - 0.5 * (Count - 1)), 
            (100 + Gap) * (Math.floor(this.index / Count) - 0.5 * (Count - 1)));
    },

    move:function () {
        var action1 = cc.MoveTo.create(0.3, this.position());
        if (this.hit) {
            var action2 = cc.ScaleTo.create(0.1, 1.2);
            var action3 = cc.CallFunc.create(this.updateSprite, this);
            var action4 = cc.ScaleTo.create(0.1, 1);
            this.runAction(cc.Sequence.create(action1, action2, action3, action4));
            this.hit = false;
        } else {
            this.runAction(action1);
        }
    },

    remove:function () {
        this.getParent().reorderChild(this, 0);
        var action1 = cc.MoveTo.create(0.3, this.position());
        var action2 = cc.FadeOut.create(0.2);
        var removeSprite = function () {
            this.getParent().removeChild(this, true);
        };
        var action3 = cc.CallFunc.create(removeSprite, this);
        this.runAction(cc.Sequence.create(action1, action2, action3));
    }
});

var MyLayer = cc.Layer.extend({
    container:null,
    beganX:0,
    beganY:0,

    init:function () {
        this._super();

        var winSize = cc.Director.getInstance().getWinSize();

        var colorLayer = cc.LayerColor.create(cc.c4b(255, 255, 255, 255), winSize.width, winSize.height);
        colorLayer.setAnchorPoint(cc.p(0, 0));
        colorLayer.setPosition(cc.p(-winSize.width * 0.5, -winSize.height * 0.5));
        this.addChild(colorLayer, 0);

        this.container = cc.Node.create();
        this.addChild(this.container, 0);

        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setPosition(cc.p(winSize.width * 0.5, winSize.height * 0.5));

        for (var i = 3; i <= 7; i++) {
            var btn = cc.Sprite.create(s_grid);
            btn.setAnchorPoint(cc.p(0.5, 0));
            btn.setColor(cc.c3b(238, 228, 218));
            var txt = cc.LabelTTF.create(i.toString(), "Arial", 40);
            var size = btn.getContentSize();
            txt.setPosition(cc.p(size.width * 0.5, size.height * 0.5));
            txt.setColor(cc.c3b(50, 50, 50));
            btn.addChild(txt);
            btn.setPosition(cc.p((100 + Gap) * (i - 5), -winSize.height * 0.5 + 5))
            View["btn" + i] = btn;
            this.addChild(btn, 2);
        };

        this.reset();

        this.setTouchEnabled(true);
        return true;
    },

    getRandomIndex:function () {
        var indexes = [];
        for (var i = 0; i < Count * Count; i++) {
            if (!Grids[i]) {
                indexes.push(i);
            }
        };

        if (indexes.length > 0) {
            var temp = Math.floor(Math.random() * indexes.length);
            return temp;
        } else {
            return -1;
        }
    },

    random:function () {
        var index = this.getRandomIndex();
        if (index >= 0) {
            var grid = new Grid();
            grid.init(index, this.container);
            Grids[index] = grid;
        }
    },

    action:function () {
        Grids = [];

        for (var i = 0; i < Count; i++) {
            var list = Calc[i];
            for (var j = 0; j < list.length; j++) {
                var grid = list[j];
                Grids[grid.index] = grid;
                grid.move();
            };
        };

        for (var i = 0; i < Drop.length; i++) {
            Drop[i].remove();
        };

        Calc = [];
        Drop = [];

        this.random();
    },

    moveLeft:function () {
        for (var i = 0; i < Count; i++) {
            Calc[i] = [];
            for (var j = 0; j < Count; j++) {
                var index = i * Count + j;
                if (Grids[index]) {
                    var last = Calc[i].length - 1;
                    if (last >= 0 && Grids[index].num == Calc[i][last].num && !Calc[i][last].hit) {
                        Grids[index].index = Calc[i][last].index;
                        Calc[i][last].num = Calc[i][last].num * 2;
                        Calc[i][last].hit = true;
                        Drop.push(Grids[index]);
                    } else {
                        Grids[index].index = i * Count + Calc[i].length;
                        Calc[i].push(Grids[index]);
                    }
                }
            };
        };

        this.action();
    },

    moveRight:function () {
        for (var i = 0; i < Count; i++) {
            Calc[i] = [];
            for (var j = 0; j < Count; j++) {
                var index = i * Count + Count - j - 1;
                if (Grids[index]) {
                    var last = Calc[i].length - 1;
                    if (last >= 0 && Grids[index].num == Calc[i][last].num && !Calc[i][last].hit) {
                        Grids[index].index = Calc[i][last].index;
                        Calc[i][last].num = Calc[i][last].num * 2;
                        Calc[i][last].hit = true;
                        Drop.push(Grids[index]);
                    } else {
                        Grids[index].index = i * Count + Count - Calc[i].length - 1;
                        Calc[i].push(Grids[index]);
                    }
                }
            };
        };

        this.action();
    },

    moveUp:function () {
        for (var i = 0; i < Count; i++) {
            Calc[i] = [];
            for (var j = 0; j < Count; j++) {
                var index = i + (Count - j - 1) * Count;
                if (Grids[index]) {
                    var last = Calc[i].length - 1;
                    if (last >= 0 && Grids[index].num == Calc[i][last].num && !Calc[i][last].hit) {
                        Grids[index].index = Calc[i][last].index;
                        Calc[i][last].num = Calc[i][last].num * 2;
                        Calc[i][last].hit = true;
                        Drop.push(Grids[index]);
                    } else {
                        Grids[index].index = i + Count * (Count - 1 - Calc[i].length);
                        Calc[i].push(Grids[index]);
                    }
                }
            };
        };

        this.action();
    },

    moveDown:function () {
        for (var i = 0; i < Count; i++) {
            Calc[i] = [];
            for (var j = 0; j < Count; j++) {
                var index = i + j * Count;
                if (Grids[index]) {
                    var last = Calc[i].length - 1;
                    if (last >= 0 && Grids[index].num == Calc[i][last].num && !Calc[i][last].hit) {
                        Grids[index].index = Calc[i][last].index;
                        Calc[i][last].num = Calc[i][last].num * 2;
                        Calc[i][last].hit = true;
                        Drop.push(Grids[index]);
                    } else {
                        Grids[index].index = i + Count * Calc[i].length;
                        Calc[i].push(Grids[index]);
                    }
                }
            };
        };

        this.action();
    },

    reset:function () {
        for (var i = 0; i < Grids.length; i++) {
            if (Grids[i]) {
                Grids[i].remove();
            }
        };

        Grids = [];

        this.container.removeAllChildren(true);

        var winSize = cc.Director.getInstance().getWinSize();

        var sp = cc.Scale9Sprite.create(s_grid);
        sp.setInsetLeft(10);
        sp.setInsetTop(10);
        sp.setInsetRight(10);
        sp.setInsetBottom(10);
        var width = 100 * Count + Gap * (Count + 1);
        sp.setPreferredSize(cc.size(width, width));
        sp.setColor(cc.c3b(187, 173, 160));
        this.container.addChild(sp);
        this.container.setScale(winSize.width / width);

        for (var i = 0; i < Count * Count; i++) {
            var sp = cc.Sprite.create(s_grid);
            sp.setColor(cc.c3b(204, 192, 179));
            sp.setPosition(cc.p((100 + Gap) * (i % Count - 0.5 * (Count - 1)), (100 + Gap) * (Math.floor(i / Count) - 0.5 * (Count - 1))));
            this.container.addChild(sp);
        };

        this.random();
        this.random();
    },

    onTouchesBegan:function (touches, event) {
        var touchPos = touches[0].getLocation();
        this.beganX = touchPos.x;
        this.beganY = touchPos.y;
    },

    onTouchesMoved:function (touches, event) {
    },

    onTouchesEnded:function (touches, event) {
        var touchPos = touches[0].getLocation();
        var x = touchPos.x;
        var y = touchPos.y;
        for (var i = 3; i <= 7; i++) {
            var btn = View["btn" + i];
            if (this.isTouchInside(btn, x, y) && this.isTouchInside(btn, this.beganX, this.beganY)) {
                Count = i;
                this.reset();
                return true;
            }
        };

        var deltaX = x - this.beganX;
        var deltaY = y - this.beganY;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) {
                this.moveLeft();
            } else if (deltaX > 0) {
                this.moveRight();
            }
        } else {
            if (deltaY < 0) {
                this.moveDown;
            } else if (deltaY > 0) {
                this.moveUp();
            }
        }
        return true;
    },

    onTouchesCancelled:function (touches, event) {
        console.log("onTouchesCancelled");
    },

    isTouchInside:function (spite, x, y) {
        var box = spite.getBoundingBox();
        var touchLocation = spite.getParent().convertToNodeSpace(cc.p(x, y));
        return cc.rectContainsPoint(box, touchLocation);
    }
});

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MyLayer();
        layer.init();
        this.addChild(layer);
    }
});
