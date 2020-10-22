import React, {Component, useEffect } from 'react';
import axios from 'axios';
import i18n from '../utils/i18n';

class Settings extends Component {

    constructor() {
        super();
        this.state = { data: {temperature: 0, cpu_usage: 0, ram_free: 0, ram_used: 0, ram_total: 0}, loading: true, failure: false };
        this.timer = null;
        this.getSettingsData = this.getSettingsData.bind(this);
    }

    componentDidMount() {
        this.getSettingsData();
        this.timer = setInterval(this.getSettingsData, 5000);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    getSettingsData() {
        axios.get(`http://localhost:9999`, {timeout: 3000}).then(data => {
            this.setState({ data: data.data, loading: false, failure: false })
        }).catch(error => {
            this.setState({ data: this.state.data, loading: false, failure: true })
        });
    }

    triggerSettingsAction(cmd) {
        axios.post(`http://localhost:9999`, {'cmd':cmd}).then(data => {
        })
    }

    reloadPage() {
        window.location.reload();
    }

    render() {

        const loading = this.state.loading;
        const failure = this.state.failure;

        const getControlPanel = () => {

            if(loading) {
                return (
                    <h2 className="text-center mr-3 ml-3">
                        {i18n.t('msg.please_wait')}
                    </h2>
                )
            }

            if(failure) {
                return (
                    <h2 className="text-center alert alert-danger mr-3 ml-3">
                        {i18n.t('msg.loading_error')}
                    </h2>
                )
            }

            return (
                <table className="table table-striped table-dark mr-3 ml-3" >
                    <tbody>
                    <tr>
                        <td className="text-center"><i className="fa fa-thermometer-three-quarters" /></td><th>Temperatur</th><td>{(this.state.data.temperature).toFixed(2).replace('.',',')} &deg;C</td>
                    </tr>
                    <tr style={{background: 'linear-gradient(270deg, rgba(0,100,0,1) 0%, rgba(0,100,0,1) ' + this.state.data.cpu_usage + '%, #454d55 ' + this.state.data.cpu_usage + '%, #454d55 100%)'}}>
                        <td className="text-center"><i className="fa fa-microchip" /></td><th>CPU Auslastung</th><td>{(this.state.data.cpu_usage).toFixed(2).replace('.',',')} %</td>
                    </tr>
                    <tr style={{background: 'linear-gradient(270deg, rgba(0,100,0,1) 0%, rgba(0,100,0,1) ' + (100 / this.state.data.ram_total * this.state.data.ram_used) + '%, rgba(255, 255, 255, 0.05) ' + (100 / this.state.data.ram_total * this.state.data.ram_used) + '%, rgba(255, 255, 255, 0.05) 100%)'}}>
                        <td className="text-center"><i className="fa fa-memory" /></td><th>Speicher Auslastung</th><td>{(100 / this.state.data.ram_total * this.state.data.ram_used).toFixed(2).replace('.',',')} %</td>
                    </tr>
                    </tbody>
                </table>
            )

        }

        return(
            <div className="settings">
                <h2 className="text-center mt-4">{i18n.t('heading.settings')}</h2>
                <div className="row mt-4">
                    <div className="col-6">
                        {getControlPanel()}
                    </div>
                    <div className="col-6">
                        <div className="text-center mr-3 ml-3">
                            <button className="btn btn-danger btn-lg d-block w-100" onClick={() => this.triggerSettingsAction('reboot')}>{i18n.t('settings.reboot_system')}</button>
                            <button className="btn btn-warning btn-lg d-block w-100 mt-3" onClick={() => this.triggerSettingsAction('restart')}>{i18n.t('settings.restart_app')}</button>
                            <button className="btn btn-secondary btn-lg d-block w-100 mt-3" onClick={this.reloadPage}>{i18n.t('settings.reload_system')}</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default Settings;