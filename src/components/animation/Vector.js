import React from "react";




export const Animation = () =>{

    window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();
    var c = document.createElement('canvas');
    document.body.appendChild(c);
    var $ = c.getContext('2d');
    c.width = window.innerWidth;
    c.height = window.innerHeight;


    window.addEventListener("mousemove", msMove, false);
    c.addEventListener("mousedown", msDown, false);
    window.addEventListener("mouseup", msUp, false);

    var w = c.width;
    var h = c.height;
    var min = (w < h) ? w : h;   //min canvas size
    var ms = [];  //mouse position array

    var walls;      //cube walls
    var ppos, pvel;  //particle position, partical velocity


    var pt2d, pt3d;  //2D && 3D points
    var side_dots;   //dots per side
    var parts;      //particles
    var rots = [];  //rotation array

    let thisx, thisy, thisz, thiscol ,thiss, thisrotY, thisrotZ, thisrotX

    function Pt2D(x, y, col, s) {  //x, y, color, size
        thisx = x;
        thisy = y;
        thiscol = col || "rgba(255,255,255,1)";
        thiss = s || 1;
    }

    function Pt3D(x, y, z, col, s) {
        thisx = x;
        thisy = y;
        thisz = z;

        thiscol = col || "rgba(255,255,255,1)";
        thiss = s || 1;
        //OR:
        // if (this.col === undefined) {
        //     this.col = "rgba(255,255,255,1)";
        // }

        // if (this.s === undefined) {
        //     this.s = 5;
        // }

        this.rotX = 0;
        this.rotY = 0;
        this.rotZ = 0;

        //rotate and 2d transform
        this.rotate = function() {
            var rx = thisx * Math.cos(this.rotX + rots.x) * Math.cos(thisrotY + rots.y) - thisy * Math.sin(thisrotX + rots.x) * Math.cos(thisrotY + rots.y) - thisz * Math.sin(thisrotY + rots.y);
            var ry = thisy * Math.cos(this.rotX + rots.x) * Math.cos(thisrotZ + rots.z) + thisx * Math.sin(thisrotX + rots.x) * Math.cos(thisrotZ + rots.z) - thisz * Math.cos(thisrotY + rots.y) * Math.sin(thisrotZ + rots.z) - thisx * Math.cos(thisrotX + rots.x) * Math.sin(thisrotY + rots.y) * Math.sin(thisrotZ + rots.z) + thisy * Math.sin(thisrotX + rots.x) * Math.sin(thisrotY + rots.y) * Math.sin(thisrotZ + rots.z);
            var rz = thisy * Math.cos(this.rotX + rots.x) * Math.sin(thisrotZ + rots.z) + thisx * Math.sin(thisrotX + rots.x) * Math.sin(thisrotZ + rots.z) + thisz * Math.cos(thisrotY + rots.y) * Math.cos(thisrotZ + rots.z) + thisx * Math.cos(thisrotX + rots.x) * Math.sin(thisrotY + rots.y) * Math.cos(thisrotZ + rots.z) - y * Math.sin(thisrotX + rots.x) * Math.sin(thisrotY + rots.y) * Math.cos(thisrotZ + rots.z);

            return new Pt3D(rx, ry, rz, thiscol, thiss);
        };
        //current point location
        this.loc = function() {
            var f = min / (4 + thisz);

            return new Pt2D(thisx * f + w / 2, thisy * f + h / 2, thiscol, thiss);
        };
    }
    //mousdown
    function msDown(e) {
        ms.lastY = e.clientX - c.getBoundingClientRect().left;
        ms.lastX = e.clientY - c.getBoundingClientRect().top;
        ms.msDragged = true;
    }
    //mousemove
    function msMove(e) {
        ms.x = e.clientX - c.getBoundingClientRect().left;
        ms.y = e.clientY - c.getBoundingClientRect().top;

        if (ms.msDragged) {
            var toRad = Math.PI / 180;
            rots.z = ((ms.lastY - ms.y) * toRad) % 20;
            rots.x = ((ms.lastX - ms.x) * toRad) % 20;
            if (rots.z >= Math.PI * 2) {
                rots.z -= Math.PI;
            }
            if (rots.z <= -Math.PI * 2) {
                rots.z += Math.PI;
            }
            if (rots.x >= Math.PI * 2) {
                rots.x -= Math.PI;
            }
            if (rots.x <= -Math.PI * 2) {
                rots.x += Math.PI;
            }
        }
    }
    //mouseup
    function msUp(e) {
        ms.msDragged = false;
        ms.lastX = undefined;
        ms.lastY = undefined;
    }

    function run() {
        window.requestAnimFrame(update);
        window.requestAnimFrame(draw);
        window.requestAnimFrame(run);
    }

    go();
    run();

    function go() {
        rots.x = Math.random()*Math.PI;
        rots.y = Math.random()*Math.PI;
        rots.z = Math.random()*Math.PI;

        side_dots = 30;  //dots per side
        var parts = 60;  //total particles

        walls = new Array();
        ppos = new Array();
        pvel = new Array();

        for (var i = 0; i < parts; i++) {

            ppos.push(new Pt3D(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, "rgba(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + "," + 1 + ")", 5));
            pvel.push(new Pt3D((Math.round(Math.random()) > 0) ? 0.01 : -0.01, (Math.round(Math.random()) > 0) ? 0.01 : -0.01, (Math.round(Math.random()) > 0) ? 0.01 : -0.01, undefined, undefined));
        }
        var angle;
        //dots per line
        var dots_line = Math.floor(Math.sqrt(side_dots));
        var colRot = 0;  //color rotations for individual rainbow cells
        var colChng = 0;  //hue changes for outside walls
        for (var i = 0; i <= dots_line; i++) {
            for (var j = 0; j <= dots_line; j++) {

                for (var k = 0; k <= dots_line; k++) {
                    var axis1 = (i / dots_line) * 2 - 1;
                    var axis2 = (j / dots_line) * 2 - 1;
                    var axis3 = (k / dots_line) * 2 - 1;

                    if (axis1 === -1 || axis1 === 1 || axis2 === -1 || axis2 === 1 || axis3 === -1 || axis3 == 1) {
                        colChng -= 0.5;
                        //using a hue change variable to slowly change the color of the outside walls as object rotates
                        var clr = "hsla(" + (colChng % 360) + ",100%,50%,0.75)";
                        var dotSize = 3;
                    } else {
                        //and individual rainbow created by the color rotation var for inside walls and free cells
                        var clr = "hsla(" + colRot + ",100%,50%,0.4)";
                        var dotSize = 5;
                    }

                    colRot += 1;
                    if (colRot > 360) {
                        colRot = 0;
                    }
                    walls.push(new Pt3D(axis1, axis2, axis3, clr, dotSize));
                }
            }
        }
    }
    //range values
    function rng(val, begin, halt, _begin, _halt) {
        return _begin + (_halt - _begin) * ((val - begin) / (halt - begin));
    }

    function update() {

        for (var i = 0; i < ppos.length; i++) {
            ppos[i].x += pvel[i].x;
            ppos[i].y += pvel[i].y;
            ppos[i].z += pvel[i].z;

            if (ppos[i].x > 1) {
                ppos[i].x = 1;
                pvel[i].x *= -1;
            }
            if (ppos[i].x < -1) {
                ppos[i].x = -1;
                pvel[i].x *= -1;
            }

            if (ppos[i].y > 1) {
                ppos[i].y = 1;
                pvel[i].y *= -1;
            }
            if (ppos[i].y < -1) {
                ppos[i].y = -1;
                pvel[i].y *= -1;
            }

            if (ppos[i].z > 1) {
                ppos[i].z = 1;
                pvel[i].z *= -1;
            }
            if (ppos[i].z < -1) {
                ppos[i].z = -1;
                pvel[i].z *= -1;
            }
        }

        if (!ms.msDragged) {
            rots.x += 0.02;
            rots.y += 0.01;
        }
    }

    function rotate(point) {
        var rx = thisx * Math.cos(thisrotX + rots.x) * Math.cos(thisrotY + rots.y) - thisy * Math.sin(thisrotX + rots.x) * Math.cos(thisrotY + rots.y) - thisz * Math.sin(thisrotY + rots.y);

        var ry = thisy * Math.cos(thisrotX + rots.x) * Math.cos(thisrotZ + rots.z) + thisx * Math.sin(thisrotX + rots.x) * Math.cos(thisrotZ + rots.z) - thisz * Math.cos(thisrotY + rots.y) * Math.sin(thisrotZ + rots.z) - thisx * Math.cos(thisrotX + rots.x) * Math.sin(thisrotY + rots.y) * Math.sin(thisrotZ + rots.z) + thisy * Math.sin(thisrotX + rots.x) * Math.sin(thisrotY + rots.y) * Math.sin(thisrotZ + rots.z);

        var rz = thisy * Math.cos(thisrotX + rots.x) * Math.sin(thisrotZ + rots.z) + thisx * Math.sin(thisrotX + rots.x) * Math.sin(thisrotZ + rots.z) + thisz * Math.cos(thisrotY + rots.y) * Math.cos(thisrotZ + rots.z) + thisx * Math.cos(thisrotX + rots.x) * Math.sin(thisrotY + rots.y) * Math.cos(thisrotZ + rots.z) - thisy * Math.sin(thisrotX + rots.x) * Math.sin(thisrotY + rots.y) * Math.cos(thisrotZ + rots.z);

    }

    function draw() {
        go()
        run()
        //control the motion blur with the fillstyle opacity.  higher or 1 will give less / no blur,  lower than .5 = superBlur
        $.fillStyle = "hsla(0, 0%, 0%, .75)";
        $.fillRect(0, 0, w, h);


        for (var i = 0; i < walls.length; i++) {

            pt3d = walls[i].rotate();
            pt2d = pt3d.loc();
            $.beginPath();
            $.fillStyle = pt2d.col;
            $.arc(pt2d.x, pt2d.y, pt2d.s, 0, Math.PI * 2, true);
            $.fill();
            $.closePath();
        }


        for (var i = 0; i < ppos.length; i++) {

            pt3d = ppos[i].rotate();
            pt2d = pt3d.loc();

            $.beginPath();

            var RGBA = pt2d.col;
            RGBA = RGBA.replace(/[^\d,]/g, '').split(',');
            for (var j = 0; j < RGBA.length; j++) {
                RGBA[j] = +RGBA[j];
            }

            $.fillStyle = "rgba(" + RGBA[0] + "," + RGBA[1] + "," + RGBA[2] + "," + rng(pt3d.z, 1, -1, 0.4, 1) + ")";

            $.arc(pt2d.x, pt2d.y, pt2d.s, 0, Math.PI * 2, true);
            $.fill();
            $.closePath();

        }

    }

    draw()
}
