import React, {Component, useEffect } from 'react';
import axios from 'axios';
import i18n from '../utils/i18n';

class Automation extends Component {

    constructor() {
        super();
        this.state = { controls: [], loading: true };
        this.timer = null;
        this.getAutomationEntities = this.getAutomationEntities.bind(this);
    }

    componentDidMount() {
        this.getAutomationEntities();
        this.timer = setInterval(this.getAutomationEntities, 5000);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    getAutomationEntities() {
        axios.get(`/api/automation`).then(controls => {
            this.setState({ controls: [], loading: false })
            this.setState({ controls: controls.data, loading: false })
        })
    }

    triggerAction(id, state) {
        axios.post(`/api/automation/trigger`, {'id':id,'state':state}).then(data => {
            if(data.data.result) {
                this.getAutomationEntities();
            }
        });
    }

    render() {

        const getBulb = (state) => {
            if(state) {
                return(
                    <i className="fa fa-5x fa-lightbulb light-on"></i>
                );
            } else {
                return(
                    <i className="fa fa-5x fa-lightbulb-o"></i>
                );
            }
        }

        const loading = this.state.loading;

        if(loading) {
            return(
                <div className="calendar">
                    <h2 className="text-center">
                        {i18n.t('msg.please_wait')}
                    </h2>
                </div>
            );
        }

        if(this.state.controls.length === 0) {
            return(
                <div className="automation">
                    <h2 className="text-center">
                        {i18n.t('msg.no_automations_found')}
                    </h2>
                </div>
            );
        }

        return(
            <div className="automation">
                <div className="row control-panel">
                    { this.state.controls.map(control =>
                        <div className="col-4" key={control.id}>
                            <button className="control-btn" onClick={() => this.triggerAction(control.id, !control.state)}>
                                {getBulb(control.state)}
                                <p>{control.friendly_name}</p>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )
    }

}

export default Automation;