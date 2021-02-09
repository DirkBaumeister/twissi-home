import React, {Component, useEffect } from 'react';
import axios from 'axios';
import i18n from '../utils/i18n';

class Surveillance extends Component {

    constructor() {
        super();
        this.state = { loading: false, cam_speed: 20 };
        this.doCameraStop = this.doCameraStop.bind(this);
    }


    componentDidMount() {
        if(true === window.surveillanceExternal) {
            this.triggerCamera('start_cam');
        }
    }

    componentWillUnmount() {
        if(true === window.surveillanceExternal) {
            this.triggerCamera('stop_cam');
        }
    }

    getImage() {
        document.getElementById("cam-img").src = "/cam?time=" + Date.now();
    }

    triggerCamera(cmd) {
        axios.post(`http://localhost:9999`, {'cmd':cmd}).then(data => {
        })
    }

    doCameraMove(action) {
        axios.get('/cam/control/' + action + '/' + this.state.cam_speed);
    }

    doCameraPreset(number) {
        axios.get('/cam/preset/' + number);
    }

    doCameraStop() {
        this.doCameraMove('stop');
    }

    getImageElement() {

        if(true === window.surveillanceExternal) {
            return (
                <div className="lds-roller">
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                </div>
            )
        } else {

            return (
                <img src="/cam" id="cam-img" onLoad={this.getImage} />
            )
        }
    }

    render() {

        const loading = this.state.loading;

        if(loading) {
            return(
                <div className="surveilance">
                    <h2 className="text-center">
                        {i18n.t('msg.please_wait')}
                    </h2>
                </div>
            );
        }

        return(
            <div className="surveilance">
                {this.getImageElement()}
                <div className="controls-left">
                    <button className="btn btn-primary" onTouchStart={() => this.doCameraMove('up')} onTouchEnd={() => this.doCameraMove('stop')}><i className="fa fa-arrow-up"></i></button>
                    <button className="btn btn-primary" onTouchStart={() => this.doCameraMove('left')} onTouchEnd={() => this.doCameraMove('stop')}><i className="fa fa-arrow-left"></i></button>
                    <button className="btn btn-primary" onTouchStart={() => this.doCameraMove('right')} onTouchEnd={() => this.doCameraMove('stop')}><i className="fa fa-arrow-right"></i></button>
                    <button className="btn btn-primary" onTouchStart={() => this.doCameraMove('down')} onTouchEnd={() => this.doCameraMove('stop')}><i className="fa fa-arrow-down"></i></button>
                    <button className="btn btn-primary" onTouchStart={() => this.doCameraMove('zoomin')} onTouchEnd={() => this.doCameraMove('stop')}><i className="fa fa-plus"></i></button>
                    <button className="btn btn-primary" onTouchStart={() => this.doCameraMove('zoomout')} onTouchEnd={() => this.doCameraMove('stop')}><i className="fa fa-minus"></i></button>
                </div>
                <div className="controls-right">
                    <button className="btn btn-primary" onClick={() => this.doCameraPreset(0)}>1</button>
                    <button className="btn btn-primary" onClick={() => this.doCameraPreset(1)}>2</button>
                    <button className="btn btn-primary" onClick={() => this.doCameraPreset(2)}>3</button>
                    <button className="btn btn-primary" onClick={() => this.doCameraPreset(3)}>4</button>
                    <button className="btn btn-primary" onClick={() => this.doCameraPreset(4)}>5</button>
                    <button className="btn btn-primary" onClick={() => this.doCameraPreset(5)}>6</button>
                    <button className="btn btn-danger" onClick={() => this.doCameraMove('stop')}><i className="fa fa-times"></i></button>
                </div>
            </div>
        )
    }

}

export default Surveillance;