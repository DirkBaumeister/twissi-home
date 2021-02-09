import React, {Component} from 'react';
import {NavLink, Route, Switch} from 'react-router-dom';
import Calendar from './Calendar';
import Automation from "./Automation";
import Overview from "./Overview";
import Surveillance from "./Surveillance";
import Settings from "./Settings";
import axios from 'axios';
import i18n from '../utils/i18n';

class Home extends Component {

    constructor() {
        super();
        this.state = { time: new Date(), photo: null };
        this.screensaverTimer = null;
        this.screensaverTimer1 = null;
        this.screensaverTimer2 = null;
        this.screensaverTimer3 = null;
        this.screensaverMode = null;
        this.screensaverStarted = false;
        this.resetScreenSaverTimeout();
        this.setTime = this.setTime.bind(this);
        this.showScreenSaver = this.showScreenSaver.bind(this);
        this.repositionTimeStart = this.repositionTimeStart.bind(this);
        this.getRandomPhoto = this.getRandomPhoto.bind(this);
    }

    componentDidMount() {
        this.setTheme();
        setInterval(this.setTime, 1000);
    }

    hideScreenSaver() {
        if(true === this.screensaverStarted && true === window.screensaverWhileCam) {
            axios.post(`http://localhost:9999`, {'cmd':'start_cam'}).then(data => {
            })
        }
        this.screensaverStarted = false;
        document.getElementById('screensaver').classList.remove('show');
        this.resetScreenSaverTimeout();
    }

    showScreenSaver() {
        this.screensaverStarted = true;
        if(true === window.screensaverWhileCam) {
            axios.post(`http://localhost:9999`, {'cmd':'stop_cam'}).then(data => {
            })
        }
        document.getElementById('screensaver').classList.add('show');
        console.log(this.screensaverMode);
        if('only_time' === this.screensaverMode) {
            document.getElementById('screensaver-photo').classList.remove('show');
            document.getElementById('screensaver-time').classList.add('show');
            this.screensaverTimer1 = setInterval(this.repositionTimeStart, 60000);
        }
        if('image' === this.screensaverMode) {
            document.getElementById('screensaver-time').classList.remove('show');
            document.getElementById('screensaver-photo').classList.add('show');
            this.getRandomPhoto();
            this.screensaverTimer2 = setInterval(this.getRandomPhoto.bind(this), window.screensaverPhotoDuration);
            this.screensaverTimer3 = setInterval(this.switchTimePositionInImageMode, 60000);
        }
    }

    setTheme() {
        if(window.localStorage.getItem('theme')) {
            if(window.theme !== window.localStorage.getItem('theme')) {
                var e = document.getElementById('main-body');
                if(e.classList.contains('theme-' + window.theme)) {
                    e.classList.remove('theme-' + window.theme);
                }
                window.theme = window.localStorage.getItem('theme');
                e.classList.add('theme-' + window.theme);
            }
        }
    }

    setTime() {
        this.setState({ time: new Date(), photo: this.state.photo });
        var hours = this.state.time.getHours();
        var firstRun = false;
        if(null === this.screensaverMode) {
            firstRun = true;
        }
        if(hours >= window.screensaverToNightModeHour || hours <= window.screensaverToDayModeHour) {
            if(this.screensaverMode !== 'only_time') {
                this.screensaverMode = 'only_time';
                if(false === firstRun) {
                    this.instantResetScreenSaverTimeout();
                }
            }
        } else {
            if(this.screensaverMode !== 'image') {
                this.screensaverMode = 'image';
                if(false === firstRun) {
                    this.instantResetScreenSaverTimeout();
                }
            }
        }
    }

    getRandomPhoto() {
        axios.get(`/api/photos`).then(data => {
            var photo = data.data[Math.floor(Math.random() * Math.floor(data.data.length))];
            if(this.state.photo !== photo) {
                document.getElementById('screensaver-photo-img').classList.remove('show');
                setTimeout(function() {
                    this.setState({ time: this.state.time, photo: photo })
                }.bind(this), 2500);
            } else {
                this.setState({ time: this.state.time, photo: photo })
            }
        })
    }

    fadeInPhoto() {
        document.getElementById('screensaver-photo-img').classList.add('show');
    }

    switchTimePositionInImageMode() {
        var e = document.getElementById('screensaver-photo-time');
        if(e.classList.contains('left')) {
            e.classList.remove('left');
        } else {
            e.classList.add('left');
        }
    }

    repositionTimeStart() {
        document.getElementById('screensaver-time').classList.add('hide');
        setTimeout(function() {
            var rand1 = Math.floor(Math.random()*400) + 1;
            var rand2 = Math.floor(Math.random()*400) + 1;
            var rand3 = Math.floor(Math.random()*400) + 1;
            var rand4 = Math.floor(Math.random()*400) + 1;
            document.getElementById('screensaver-time').style.padding = rand1 + 'px ' + rand2 + 'px ' + rand3 + 'px ' + rand4 + 'px';
            setTimeout(function() {
                document.getElementById('screensaver-time').classList.remove('hide');
            }, 100);
        }, 3500);
    }

    instantResetScreenSaverTimeout() {
        clearTimeout(this.screensaverTimer);
        clearTimeout(this.screensaverTimer1);
        clearTimeout(this.screensaverTimer2);
        clearTimeout(this.screensaverTimer3);
        this.showScreenSaver();
    }

    resetScreenSaverTimeout() {
        clearTimeout(this.screensaverTimer);
        clearTimeout(this.screensaverTimer1);
        clearTimeout(this.screensaverTimer2);
        clearTimeout(this.screensaverTimer3);
        this.screensaverTimer = setTimeout(this.showScreenSaver.bind(this), window.screensaverTimeout);
    }

    render() {

        return (
            <div onClick={() => this.hideScreenSaver()}>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <ul className="navbar-nav row w-100 text-center">
                        <li className="nav-item col">
                            <NavLink exact activeClassName={"active"} className={"nav-link"} to={"/"}> {i18n.t('nav.overview')} </NavLink>
                        </li>
                        <li className="nav-item col">
                            <NavLink activeClassName={"active"} className={"nav-link"} to={"/events"}> {i18n.t('nav.events')} </NavLink>
                        </li>
                        <li className="nav-item col">
                            <NavLink activeClassName={"active"} className={"nav-link"} to={"/automation"}> {i18n.t('nav.control')} </NavLink>
                        </li>
                        <li className="nav-item col">
                            <NavLink activeClassName={"active"} className={"nav-link"} to={"/surveillance"}> {i18n.t('nav.surveilance')} </NavLink>
                        </li>
                        <li className="nav-item col-1">
                            <NavLink activeClassName={"active"} className={"nav-link"} to={"/settings"}><i className="fa fa-wrench" /></NavLink>
                        </li>
                    </ul>
                </nav>
                <hr/>
                <div className="outer">
                    <Switch>
                        <Route path="/events" component={Calendar} />
                        <Route path="/automation" component={Automation} />
                        <Route path="/surveillance" component={Surveillance} />
                        <Route path="/settings" component={Settings} />
                        <Route path="/" component={Overview} />
                    </Switch>
                </div>
                <div id="screensaver" className="screensaver">
                    <div id="screensaver-time" className="screensaver-time">
                        {new Intl.DateTimeFormat("en-GB", {
                            hour: "numeric",
                            minute: "numeric"
                        }).format(this.state.time)}
                    </div>
                    <div id="screensaver-photo" className="screensaver-photo">
                        <img src={this.state.photo} className="img-fluid" id="screensaver-photo-img" onLoad={this.fadeInPhoto} />
                        <div className="screensaver-photo-time" id="screensaver-photo-time">
                            {new Intl.DateTimeFormat("en-GB", {
                                hour: "numeric",
                                minute: "numeric"
                            }).format(this.state.time)}
                        </div>
                    </div>
                </div>
            </div>
    )
    }

    reloadPage() {
        window.location.reload(false);
    }

}

export default Home;