﻿function DotManager() {
    this._list = [];
}

var _p = DotManager.prototype;

_p.tryCreate = function () {
    chance(DOT_CREATION_FREQ, this.create.bind(this));
}

_p.create = function (type, x, y, size, velocity) {
    var dot = new Dot(type, x, y, size, velocity);
    this._list.push(dot);
}

_p.draw = function () {
    ctx.globalCompositeOperation = 'source-atop';
    for (var i = 0; i < this._list.length; i++) {
        var dot = this._list[i];
        var wsp = getScreenPosition(dot);
        if (player.see(dot)) {
            drawArc(ctx, wsp.x, wsp.y, Math.sqrt(dot.size), dot.color);
        }
    }
    ctx.globalCompositeOperation = 'source-over';
}

_p.grow = function () {
    for (var i = 0; i < this._list.length; i++) {
        var dot = this._list[i];
        chance(DOT_GROW_FREQ, dot.grow.bind(dot));
    }
}

_p.move = function () {
    var playerX = player.getX();
    var playerY = player.getY();
    var playerR = player.getR();
    var playerType = player.getType();
    for (var i = 0; i < this._list.length; i++) {
        var dot = this._list[i];
        var x = 1 - (dot.type == playerType) * 2;

        var v = new Vector(playerX - dot.x, playerY - dot.y);

        var distance = v.getSize();
        if (distance > MAX_DISTANCE) {
            this._list.splice(i, 1);
            i--;
            continue;
        }
            
        var f = dot.size * playerR * playerR;
        v.toSize(f * x * GRAVITY_FORCE / distance / distance);


        dot.Vx += v[0];
        dot.Vy += v[1];

        dot.x += dot.Vx;
        dot.y += dot.Vy;
    }
}

_p.getAll = function () {
    return this._list;
}

function Dot() {

    var maxDistance = 1000;
    var minDistance = player.getRange();

    var x = player.getX();
    var y = player.getY();

    var distance = rand(minDistance, maxDistance);
    var fi = rand(0, 2*Math.PI);

    this.x = x + distance * Math.cos(fi);
    this.y = y + distance * Math.sin(fi);

    this.size = rand(1, 10) | 0;
    this.Vy = rand(-1, 1);
    this.Vx = rand(-1, 1);
    this.type = rand(0, 2) | 0;
    this.color = colors[this.type];
}

Dot.prototype.grow = function () {
    this.size++;
}