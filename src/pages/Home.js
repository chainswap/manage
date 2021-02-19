import React, {useEffect} from 'react'
import '../assets/css/animator.css'
import '../styles.css'
import LogoLineWhite from '../assets/image/logo-line-white.svg'
import LogoLineBlack from '../assets/image/logo-line-black.svg'
import MobileBlock from '../assets/image/mobile-block.svg'
import Bottom1 from '../assets/image/bottom1.svg'
import Bottom2 from '../assets/image/bottom2.svg'
import Bottom3 from '../assets/image/bottom3.svg'
import BlockIcon1 from '../assets/image/block-icon-1.svg'
import BlockIcon2 from '../assets/image/block-icon-2.svg'
import BlockIcon3 from '../assets/image/block-icon-3.svg'
import BlockIcon4 from '../assets/image/block-icon-4.svg'
import BlockIcon5 from '../assets/image/block-icon-5.svg'
import BlockIcon6 from '../assets/image/block-icon-6.svg'
import Comp from '../assets/image/comp.svg'
import LeftLines from '../assets/image/left-lines.svg'
import RightLines from '../assets/image/right-lines.svg'
import MobileBG from '../assets/image/mobile-bg.jpg'
import MediaQuery from 'react-responsive';

const dat = require('dat.gui');


//vector class
class Vector {

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.magnitude = Math.sqrt(x * x + y * y);
        this.angle = Math.atan2(y, x);
    }

    add(v) {
        this.x = this.x + v.x;
        this.y = this.y + v.y;
        this.magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
        this.angle = Math.atan2(this.y, this.x);
        return this;
    }

    subtract(v) {
        this.x = this.x - v.x;
        this.y = this.y - v.y;
        this.magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
        this.angle = Math.atan2(this.y, this.x);
        return this;
    }

    setAngle(angle) {
        this.angle = angle;
        this.x = this.magnitude * Math.cos(angle);
        this.y = this.magnitude * Math.sin(angle);
        return this;
    }

    setMagnitude(magnitude) {
        this.magnitude = magnitude;
        this.x = Math.cos(this.angle) * magnitude;
        this.y = Math.sin(this.angle) * magnitude;
        return this;
    }}



//particle class
class Particle {

    constructor(opts) {
        this.x = opts.x || Math.random() * cW;
        this.y = opts.y || Math.random() * cH;
        this.radius = opts.radius || 15;
        this.v = opts.v || new Vector();
        this.acc = opts.acc || new Vector();
        this.mass = opts.mass || 40;
        this.color = opts.color || 320;
        this.maxV = opts.maxV || 8;
        this.maxA = opts.maxA || 0.5;
        this.tasteTheRainbow = opts.tasteTheRainbow || false;
        if (opts.trail) {
            this.trail = true;
            this.trailLength = opts.trailLength || 10;
            this.trajPoints = new Queue([]);
        }
    }

    accelerate() {
        this.acc.magnitude = this.acc.magnitude > this.maxA ? this.acc.setMagnitude(this.maxA) : this.acc.magnitude;
        this.v.add(this.acc);
    }

    isOnScreen() {
        return this.x <= cW || this.x >= 0 || this.y <= cH || this.y >= 0;
    }

    update() {
        if (this.acc.magnitude) {this.accelerate();}
        if (this.trail) {
            let point = {
                x: this.x,
                y: this.y };

            this.trajPoints.enqueue(point);
            if (this.trajPoints.getLength() >= this.trailLength) {this.trajPoints.dequeue();}
        }
        this.v.magnitude = this.v.magnitude > this.maxV ? this.v.setMagnitude(this.maxV) : this.v.magnitude;
        this.x += this.v.x;
        this.y += this.v.y;
        if (this.tasteTheRainbow) {this.color = this.color <= 360 ? ++this.color : 1;}
    }

    render(context, trailContext = null) {
        context.beginPath();
        context.fillStyle = `hsl(${this.color}, 100%, 50%)`;
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.closePath();
        if (this.trail && trailContext) {
            let trajectory = this.trajPoints;
            trailContext.beginPath();
            trailContext.strokeStyle = `hsl(${this.color}, 100%, 50%)`;
            trailContext.lineWidth = 0.2;
            trailContext.moveTo(trajectory.queue[0].x, trajectory.queue[0].y);
            for (let i = 1, len = trajectory.getLength(); i < len; i++) {
                trailContext.lineTo(trajectory.queue[i].x, trajectory.queue[i].y);
            }
            trailContext.stroke();
            trailContext.closePath();
        }
    }}



class Planet extends Particle {

    gravitate(p) {
        if (Particle.prototype.isPrototypeOf(p)) {
            const d = Math.sqrt((this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y));
            const attractiveForce = p.mass * this.mass / (d * d);
            this.acc.setAngle(Math.atan2(p.y - this.y, p.x - this.x)).setMagnitude(attractiveForce);
        } else {
            throw new Error("The argument passed to the gravitate function must be a particle");
        }
        this.update();
    }

    gravitateStarCluster(cluster) {
        let gV = new Vector();
        for (let i = 0; i < cluster.length; i++) {
            let star = cluster[i];
            if (Particle.prototype.isPrototypeOf(star)) {
                let v = new Vector();
                const d = Math.sqrt((this.x - star.x) * (this.x - star.x) + (this.y - star.y) * (this.y - star.y));
                const attractiveForce = star.mass * this.mass / (d * d);
                v.setAngle(Math.atan2(star.y - this.y, star.x - this.x)).setMagnitude(attractiveForce);
                gV = gV.add(v);
            } else {
                throw new Error("The argument supplied to the gravitateStarCluster function must be an array of particles");
            }
        }
        this.acc.setAngle(gV.angle).setMagnitude(gV.magnitude);
        this.update();
    }}



class Queue {

    constructor(array) {this.queue = array;}

    getLength() {return this.queue.length;}

    enqueue(element) {this.queue.unshift(element);}

    dequeue() {this.queue.pop();}

    display() {
        for (let i = 0; i < this.getLength; i++) {
            console.log(this.queue[i]);
        }
    }}



//util function to paint entire canvas of specified color
function paintCanvas(color, context) {
    const W = context.canvas.clientWidth;
    const H = context.canvas.clientHeight;
    context.save();
    context.fillStyle = color;
    context.fillRect(0, 0, W, H);
    context.restore();
}

//util function that returns a random number in a given range
function randomInRange(min, max) {
    const result = min + Math.random() * (max - min);
    return result;
}

//////////////////////////////////////
// -- THIS ANIMATION'S VARIABLES -- //
//////////////////////////////////////

//canvas
const trailCanvas = document.getElementById('trails');
const particlesCanvas = document.getElementById('particles');
const trailCtx = trailCanvas.getContext('2d');
const particleCtx = particlesCanvas.getContext('2d');

let cW = particlesCanvas.width = trailCanvas.width = window.innerWidth;
let cH = particlesCanvas.height = trailCanvas.height = window.innerHeight;

//animation constants
const settings = {

    STAR_MASS: 1500,
    PLANET_MASS: 20,
    PLANET_V_X: 2,
    P_TRAIL: true,
    P_MAX_VELOCITY: 8,
    P_MAX_ACC: 0.5,
    P_MIN_VELOCITY: 5,
    PARTICLE_NUM: 70,
    BOUNDS: false,
    TRAIL_LENGTH: 90,
    TRAIL_CNVS: trailCanvas,
    PARTICLE_CNVS: particlesCanvas,
    COLOR: 320,
    TRAIL_CTXT: trailCtx,
    TASTETHERAINBOW: true,
    PARTICLE_CTXT: particleCtx };



window.addEventListener('resize', function () {
    cW = particlesCanvas.width = trailCanvas.width = window.innerWidth;
    cH = particlesCanvas.height = trailCanvas.height = window.innerHeight;
});

//mouse events and stuff
let mX = -1;
let mY = -1;
let draggingStar = false;

document.addEventListener('mousemove', function (e) {
    mX = e.clientX;
    mY = e.clientY;
});

settings.PARTICLE_CNVS.addEventListener('click', function () {
    draggingStar = !draggingStar;
});

//stars and particles
let s = [];
let p = [];

let star = new Particle({
    x: cW / 2,
    y: cH / 2,
    radius: 15,
    color: settings.COLOR,
    tasteTheRainbow: settings.TASTETHERAINBOW,
    mass: settings.STAR_MASS });


for (let i = 0; i < settings.PARTICLE_NUM; i++) {

    const planet = new Planet({
        x: Math.random() * cW,
        y: Math.random() * cH,
        radius: 2,
        mass: settings.PLANET_MASS,
        trail: settings.P_TRAIL,
        trailLength: settings.TRAIL_LENGTH,
        color: settings.COLOR,
        maxV: settings.P_MAX_VELOCITY,
        maxA: settings.P_MAX_ACC,
        tasteTheRainbow: settings.TASTETHERAINBOW,
        v: new Vector(Math.random() < 0.5 ? -settings.P_MIN_VELOCITY : settings.P_MIN_VELOCITY, 0) });


    p.push(planet);

}

//animation function
function animate() {

    settings.PARTICLE_CTXT.clearRect(0, 0, cW, cH);

    settings.TRAIL_CTXT.clearRect(0, 0, cW, cH);
    paintCanvas('black', settings.TRAIL_CTXT);

    star.update();
    star.render(settings.PARTICLE_CTXT);

    for (let i = 0; i < p.length; i++) {
        p[i].gravitate(star);
        if (settings.BOUNDS) {
            if (p[i].x > cW) {p[i].x = cW;}
            if (p[i].x < 0) {p[i].x = 0;}
            if (p[i].y > cH) {p[i].y = cH;}
            if (p[i].y < 0) {p[i].y = 0;}
        }
        if (p[i].isOnScreen()) {
            p[i].render(settings.PARTICLE_CTXT, settings.TRAIL_CTXT);
        }
    }

    if (draggingStar) {
        star.x += (mX - star.x) * 0.1;
        star.y += (mY - star.y) * 0.1;
    }

    requestAnimationFrame(animate);

}

//start loop!

//for debugging without printing stuff 1000000000 times in the console
//window.setInterval(function(){ console.log(); }, 2000);



export const Home = () => {

    useEffect(()=>{
        animate();

//datgui thangs
        const gui = new dat.GUI();
        gui.add(settings, 'STAR_MASS', 500, 10000).name('star mass').onFinishChange(function () {
            star.mass = settings.STAR_MASS;
        });
        gui.add(settings, 'P_TRAIL').name('particle trail').onFinishChange(function () {
            for (let i = 0; i < settings.PARTICLE_NUM; i++) {
                p[i].trail = settings.P_TRAIL;
                p[i].trajPoints = new Queue([]);
            }
        });
        gui.add(settings, 'P_MAX_VELOCITY', 4, 14).name('max velocity').onFinishChange(function () {
            for (let i = 0; i < settings.PARTICLE_NUM; i++) {
                p[i].maxV = settings.P_MAX_VELOCITY;
            }
        });
        gui.add(settings, 'P_MAX_ACC', 0.2, 2).name('max acceleration').onFinishChange(function () {
            for (let i = 0; i < settings.PARTICLE_NUM; i++) {
                p[i].maxA = settings.P_MAX_ACC;
            }
        });
        gui.add(settings, 'PARTICLE_NUM', 1, 250).name('particles number').onFinishChange(function () {
            p = [];
            settings.TRAIL_CTXT.clearRect(0, 0, cW, cH);
            for (let i = 0; i < settings.PARTICLE_NUM; i++) {
                const planet = new Planet({
                    x: Math.random() * cW,
                    y: Math.random() * cH,
                    radius: 2,
                    mass: settings.PLANET_MASS,
                    trail: settings.P_TRAIL,
                    trailLength: settings.TRAIL_LENGTH,
                    color: settings.COLOR,
                    maxV: settings.P_MAX_VELOCITY,
                    maxA: settings.P_MAX_ACC,
                    tasteTheRainbow: settings.TASTETHERAINBOW,
                    v: new Vector(Math.random() < 0.5 ? -settings.P_MIN_VELOCITY : settings.P_MIN_VELOCITY, 0) });

                p.push(planet);
            }
            star.color = settings.COLOR;
        });
        gui.add(settings, 'BOUNDS').name('bounds');
        gui.add(settings, 'TRAIL_LENGTH', 10, 200).name('trail length').onFinishChange(function () {
            settings.TRAIL_CTXT.clearRect(0, 0, cW, cH);
            for (let i = 0; i < settings.PARTICLE_NUM; i++) {
                p[i].trajPoints = new Queue([]);
                p[i].trailLength = settings.TRAIL_LENGTH;
            }
        });

    }, [])

    return (
        <div className="home">
            <div className="home__frame">
                <header>
                    <img src={LogoLineWhite} alt=""/>
                    <a>App Coming Soon</a>
                </header>

                <MediaQuery query='(max-device-width:750px)'>
                    <img src={MobileBG}/>
                </MediaQuery>

                <div className="home__frame__page">
                    <div className="home__frame__page__content">
                        <div className="home__frame__page__content__title">A simple lightweight onchain DeFi derivative
                            protocol
                        </div>
                        <p className="home__frame__page__content__sub_title">Polarized token mechanism with tokenized
                            perpetual derivatives</p>
                        <div className="home__frame__page__content__calc">Value(long)+Value(short)=C</div>

                        <a>App Coming Soon</a>
                    </div>

                    {/*<video*/}
                    {/*    muted*/}
                    {/*    autoPlay='autoPlay'*/}
                    {/*    loop='loop'*/}
                    {/*    controls={null}*/}
                    {/*>*/}
                    {/*    <source src="../assets/animation.mp4"/>*/}
                    {/*</video>*/}


                </div>
            </div>


            <MediaQuery query='(min-device-width:1200px)'>
                <div className="home__frame" style={{
                    backgroundColor: '#EAEAEA',
                    height: 'fit-content',
                    backgroundImage: "url(" + require("../assets/image/block1.svg") + ") "
                }}>
                    <div className="home__frame_blocks">
                        <h2>Protocol Features</h2>
                        <div className="home__frame__block block1">
                            <img src={BlockIcon1}/>
                            <h5>Innovative and </h5>
                            <h5>elegant DeFi </h5>
                            <h5>mechanism</h5>

                            <p style={{marginTop: 5}}>Execute put and call</p>
                            <p>strategies fully</p>
                            <p>on-chain</p>
                        </div>

                        <div className="home__frame__block block2">
                            <img src={BlockIcon2}/>
                            <h5>Auto rebalancing </h5>
                            <h5>polarized token</h5>
                            <h5>mechanism</h5>

                            <p style={{marginTop: 5}}>Funding, fee distribution</p>
                            <p>and rebalancing happens</p>
                            <p>automatically</p>
                        </div>

                        <div className="home__frame__block block3">
                            <img src={BlockIcon3}/>
                            <h5>Cross chain</h5>
                            <h5>compatible</h5>

                            <p style={{marginTop: 5}}>Polkadot/Binance</p>
                            <p>Smart Chain and more</p>
                        </div>

                        <div className="home__frame__block block4">
                            <img src={BlockIcon4}/>
                            <h5>Secondary market</h5>
                            <h5>opportunities</h5>
                            <h5>across products</h5>

                            <p style={{marginTop: 5}}>Market making, arbitrage</p>
                            <p>and passive yield</p>
                            <p>opportunities</p>
                        </div>

                        <div className="home__frame__block block5">
                            <img src={BlockIcon5}/>
                            <h5>Self-sustainable and</h5>
                            <h5>community governed</h5>

                            <p style={{marginTop: 5}}>Fees from products and</p>
                            <p>protocol usage used to</p>
                            <p>buyback MATTER.</p>
                        </div>

                        <div className="home__frame__block block6">
                            <img src={BlockIcon6}/>
                            <h5>Simple and </h5>
                            <h5>intuitive to use</h5>

                            <p style={{marginTop: 5}}>All Antimatter products are</p>
                            <p>perpetual options without expiry</p>
                            <p>dates or added complexity.</p>
                            <p>Built for mass adoption</p>
                            <p></p>
                        </div>
                    </div>
                </div>

                <div className="home__frame" style={{backgroundColor: '#EAEAEA', height: 'fit-content'}}>
                    <h2>Antimatter Contributors</h2>
                    <div className="home__frame__teams" style={{backgroundColor: '#EAEAEA', height: 'fit-content'}}>
                        <div className="bg">
                            <img src={LeftLines}/>
                            <img src={RightLines} style={{marginLeft: -10}}/>
                        </div>
                        <div className="home__frame__teams__team team1">
                            <img src={Comp}/>
                            <h3>Jack Lu</h3>
                            <p style={{marginTop: 20}}>Creator of Bounce.Finance</p>
                        </div>

                        <div className="home__frame__teams__team team2">
                            <img src={Comp}/>
                            <h3>Robert Hu</h3>
                            <p style={{marginTop: 20}}>Creator of Helmet.Insure</p>
                            <p>and UU.Finance</p>

                        </div>
                    </div>
                </div>
            </MediaQuery>
            {/*<MediaQuery query='(min-device-width:1224px)'>*/}
            {/*    <div className="home__frame" style={{height: 'fit-content'}}>*/}
            {/*        <img style={{width: '100%'}} src={Block1}/>*/}
            {/*        <img style={{width: '100%'}} src={Block2}/>*/}
            {/*    </div>*/}
            {/*</MediaQuery>*/}

            <MediaQuery query='(max-device-width:750px)'>
                <div className="home__frame" style={{height: 'fit-content'}}>
                    <img style={{width: '100%'}} src={MobileBlock}/>
                </div>
            </MediaQuery>

            <div className="home__frame" style={{height: 'fit-content'}}>
                <div className="home__frame__bottom">
                    <p>Backed by</p>

                    <div className="home__frame__bottom__backed">
                        <img src={Bottom1}/>
                        <div className="home__frame__bottom__divider"/>
                        <img src={Bottom2}/>
                        <div className="home__frame__bottom__divider"/>
                        <img src={Bottom3}/>
                    </div>

                    <div className="home__frame__bottom__footer">
                        <p>© Antimatter Finance. All rights reserved.</p>
                        <img src={LogoLineBlack}/>
                        <ul>
                            <li>
                                <a
                                    target="_blank"
                                    href="https://github.com/antimatter-finance"
                                >
                                    <svg width="22" height="23" viewBox="0 0 22 23" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M21.8475 11.901C21.8475 16.5671 19.0439 20.5643 15.0635 22.2306C14.053 22.5107 13.1088 21.9727 13.1081 21.0357C13.1081 20.9276 13.1093 20.7383 13.1109 20.4853C13.1142 19.9756 13.1191 19.2071 13.1191 18.323C13.1191 17.4013 12.8174 16.7989 12.4783 16.4928C14.5789 16.2472 16.7873 15.4107 16.7873 11.6143C16.7873 10.5354 16.4216 9.65304 15.8167 8.96056C15.9152 8.71172 16.2387 7.70656 15.7245 6.3445C15.7245 6.3445 14.9336 6.0793 13.1316 7.35786C12.3767 7.13849 11.5686 7.0288 10.7668 7.02553C9.96349 7.0288 9.15701 7.13849 8.40367 7.35786C6.60004 6.0793 5.80763 6.3445 5.80763 6.3445C5.29654 7.70656 5.61851 8.71172 5.71697 8.96056C5.11368 9.65304 4.74483 10.5354 4.74483 11.6143C4.74483 15.4008 6.94857 16.2488 9.04448 16.4993C8.77565 16.7465 8.53027 17.1836 8.44587 17.8221C7.90822 18.0742 6.54221 18.5113 5.69978 17.0003C5.69978 17.0003 5.19964 16.0524 4.2525 15.982C4.2525 15.982 3.33193 15.9689 4.18842 16.5828C4.18842 16.5828 4.80578 16.8873 5.23559 18.03C5.23559 18.03 5.78887 19.7931 8.41617 19.1956C8.41799 19.6756 8.42193 20.14 8.4249 20.491C8.42704 20.7434 8.42868 20.9371 8.42868 21.0357C8.41705 21.8463 7.75058 22.4937 6.77824 22.2282C2.80095 20.5605 0 16.5649 0 11.901C0 5.73816 4.89074 0.742188 10.9238 0.742188C16.9568 0.742188 21.8475 5.73816 21.8475 11.901Z"/>
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a
                                    target="_blank"
                                    href=" https://medium.com/@antimatterdefi"
                                >
                                    <svg width="23" height="23" viewBox="0 0 23 23" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M22.042 3.38473C22.042 1.92627 20.8579 0.742188 19.3994 0.742188H3.12204C1.66358 0.742188 0.479492 1.92627 0.479492 3.38473V19.6621C0.479492 21.1206 1.66358 22.3047 3.12204 22.3047H19.3994C20.8579 22.3047 22.042 21.1206 22.042 19.6621V3.38473ZM12.4208 11.5235C12.4208 14.3635 10.1341 16.6658 7.31358 16.6658C4.49302 16.6658 2.20618 14.3635 2.20618 11.5235C2.20618 8.68351 4.49281 6.38108 7.31358 6.38108C10.1343 6.38108 12.4208 8.68351 12.4208 11.5235ZM18.0236 11.5235C18.0236 14.1968 16.8803 16.3648 15.4699 16.3648C14.0595 16.3648 12.9162 14.1968 12.9162 11.5235C12.9162 8.85028 14.0594 6.68232 15.4697 6.68232C16.8801 6.68232 18.0234 8.84956 18.0234 11.5235H18.0236ZM20.3153 11.5235C20.3153 13.9181 19.9132 15.8605 19.4172 15.8605C18.9211 15.8605 18.5192 13.9186 18.5192 11.5235C18.5192 9.1284 18.9212 7.18655 19.4172 7.18655C19.9131 7.18655 20.3153 9.12823 20.3153 11.5235Z"/>
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a
                                    target="_blank"
                                    href=" https://twitter.com/antimatterdefi"
                                >
                                    <svg width="23" height="18" viewBox="0 0 23 18" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M19.9804 2.81652C20.8942 2.28793 21.5953 1.44976 21.9244 0.451303C21.0688 0.941967 20.1234 1.29681 19.1147 1.48892C18.3098 0.656868 17.1593 0.138062 15.8861 0.138062C13.4434 0.138062 11.464 2.053 11.464 4.41454C11.464 4.74981 11.5007 5.07651 11.5766 5.38853C7.90124 5.20988 4.64225 3.50908 2.45904 0.919942C2.07809 1.55377 1.8604 2.28793 1.8604 3.07103C1.8604 4.55403 2.64129 5.86329 3.82845 6.63171C3.10325 6.60968 2.42107 6.41513 1.8237 6.09699V6.14961C1.8237 8.22239 3.34751 9.95133 5.37378 10.3429C5.00169 10.4432 4.61188 10.4934 4.20687 10.4934C3.92211 10.4934 3.64367 10.4677 3.37536 10.4175C3.9373 12.1159 5.57122 13.3542 7.50763 13.3872C5.99268 14.5349 4.08537 15.2177 2.01354 15.2177C1.65663 15.2177 1.30352 15.1994 0.958008 15.159C2.91593 16.3716 5.24089 17.08 7.73924 17.08C15.8772 17.08 20.3246 10.5631 20.3246 4.91132C20.3246 4.72534 20.3221 4.54057 20.3133 4.35826C21.1777 3.75502 21.9295 3.00129 22.5205 2.14354C21.727 2.4837 20.8739 2.71374 19.9804 2.81652Z"/>
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a
                                    target="_blank"
                                    href="https://t.me/antimatterchat"
                                >
                                    <svg width="22" height="20" viewBox="0 0 22 20" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M16.9544 19.7557C17.2436 19.9726 17.6165 20.0268 17.9489 19.8937C18.2813 19.7595 18.5257 19.4589 18.5994 19.0946C19.3801 15.2095 21.2739 5.37606 21.9846 1.84203C22.0385 1.57566 21.9487 1.29884 21.751 1.12095C21.5534 0.943058 21.2793 0.891689 21.035 0.987769C17.2679 2.46417 5.66664 7.07316 0.924799 8.93102C0.62383 9.04898 0.427975 9.3553 0.437857 9.6911C0.448638 10.0279 0.662462 10.3199 0.970619 10.4179C3.09717 11.0914 5.88855 12.0284 5.88855 12.0284C5.88855 12.0284 7.19306 16.1998 7.87316 18.3212C7.95851 18.5875 8.15526 18.7968 8.4149 18.8691C8.67365 18.9405 8.95036 18.8653 9.14352 18.6722C10.236 17.5801 11.925 15.8916 11.925 15.8916C11.925 15.8916 15.1342 18.383 16.9544 19.7557ZM7.06278 11.5014L8.57123 16.7696L8.90634 13.4335C8.90634 13.4335 14.7344 7.86748 18.0567 4.69494C18.1537 4.60171 18.1672 4.4457 18.0864 4.3363C18.0064 4.2269 17.8591 4.20122 17.7486 4.27542C13.8979 6.87909 7.06278 11.5014 7.06278 11.5014Z"/>
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    )
}

// export const Home = () => {
//     return (<>
//         <div className='wrap'>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//         </div>
//
//         <div className="CardWrap">
//             <div className="Card animate__animated animate__fadeInUp">
//                 <div className="LogoWrap">
//                     <img src={LogoLineWhite} alt=""/>
//                 </div>
//                 <div className="Title">
//                     Antimatter is an innovative lightweight on-chain and cross chain DeFi derivative protocol
//                 </div>
//                 <div className="SocialMediaLinks">
//                     <a hre="">
//                         <i className="fa fa-github"/>
//                     </a>
//                     <a hre="">
//                         <i className="fa fa-telegram"/>
//                     </a>
//                     <a hre="">
//                         <i className="fa fa-twitter"/>
//                     </a>
//                 </div>
//             </div>
//         </div></>)
// }