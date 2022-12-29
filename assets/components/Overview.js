import React, {Component, useEffect, useState} from 'react';
import Clock from 'react-clock';
import ReactWeather from 'react-open-weather';
import i18n from '../utils/i18n';
import CurrencyFormat from 'react-currency-format';
import axios from "axios";
import Gauge from 'react-svg-gauge';
const mqtt = require('mqtt')
var dateFormat = require('dateformat');
dateFormat.i18n = {
    dayNames: [
        i18n.t('date.sunday_short'),
        i18n.t('date.monday_short'),
        i18n.t('date.tuesday_short'),
        i18n.t('date.wednesday_short'),
        i18n.t('date.thursday_short'),
        i18n.t('date.friday_short'),
        i18n.t('date.saturday_short'),
        i18n.t('date.sunday_long'),
        i18n.t('date.monday_long'),
        i18n.t('date.tuesday_long'),
        i18n.t('date.wednesday_long'),
        i18n.t('date.thursday_long'),
        i18n.t('date.friday_long'),
        i18n.t('date.saturday_long')
    ],
    monthNames: [
        i18n.t('date.january_short'),
        i18n.t('date.february_short'),
        i18n.t('date.march_short'),
        i18n.t('date.april_short'),
        i18n.t('date.may_short'),
        i18n.t('date.june_short'),
        i18n.t('date.july_short'),
        i18n.t('date.august_short'),
        i18n.t('date.september_short'),
        i18n.t('date.october_short'),
        i18n.t('date.november_short'),
        i18n.t('date.december_short'),
        i18n.t('date.january_long'),
        i18n.t('date.february_long'),
        i18n.t('date.march_long'),
        i18n.t('date.april_long'),
        i18n.t('date.may_long'),
        i18n.t('date.june_long'),
        i18n.t('date.july_long'),
        i18n.t('date.august_long'),
        i18n.t('date.september_long'),
        i18n.t('date.october_long'),
        i18n.t('date.november_long'),
        i18n.t('date.december_long')
    ],
    timeNames: [
        'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
    ]
};
class Overview extends Component {

    constructor() {
        super();
        this.state = { time: new Date(), reloadWeather: false, fuel: {status: null, diesel: 0, gasoline: 0, time: -1}, showForecast: false, gaugeValue: null };
        this.timer = null;
        this.timer2 = null;
        this.timer3 = null;
        this.mqttClient = null;
        this.setTime = this.setTime.bind(this);
        this.updateWeather = this.updateWeather.bind(this);
        this.getGasolinePrices = this.getGasolinePrices.bind(this);
        this.toggleForecastFrame = this.toggleForecastFrame.bind(this);
    }

    componentDidMount() {
        this.timer = setInterval(this.setTime, 1000);
        this.timer2 = setInterval(this.updateWeather, 900000);
        this.getGasolinePrices();
        this.timer3 = setInterval(this.getGasolinePrices, 60000);
        this.startMqttGaugeListener();
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
        clearTimeout(this.timer2);
        clearTimeout(this.timer3);
        this.stopMqttGaugeListener();
    }

    getGasolinePrices() {
        axios.get(`/api/gasoline`, {timeout: 3000}).then(data => {
            if(typeof data.data.status != "undefined") {
                this.setState({ time: this.state.time, reloadWeather: this.state.reloadWeather, fuel: {status: null, diesel: 0, gasoline: 0, time: -1}, showForecast: this.state.showForecast });
                this.setState({ time: this.state.time, reloadWeather: this.state.reloadWeather, fuel: data.data, showForecast: this.state.showForecast });
            }
        })
    }

    setTime() {
        this.setState({ time: new Date(), reloadWeather: false, fuel: this.state.fuel, showForecast: this.state.showForecast });
    }

    updateWeather() {
        this.setState({ time: this.state.time, reloadWeather: true, fuel: this.state.fuel, showForecast: this.state.showForecast });
        this.setState({ time: this.state.time, reloadWeather: false, fuel: this.state.fuel, showForecast: this.state.showForecast });
    }

    renderCurrency(value) {
        if(0 === value) {
            return "-";
        }
        return (
            <CurrencyFormat value={value} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} decimalScale={3} fixedDecimalScale={true} suffix={' €'} />
        )
    }

    renderForecast() {
        if('' === window.weatherForecastUrl) {
            return;
        }
        return (
            <div>
                <div className="forecast-btn" onClick={this.toggleForecastFrame}><i className="fa fa-chart-bar" /></div>
                {this.renderForecastFrame()}
            </div>
        )
    }

    renderForecastFrame() {
        if(false === this.state.showForecast) {
            return;
        }
        return (
            <iframe src={window.weatherForecastUrl} className="forecast-frame" />
        )
    }

    toggleForecastFrame() {
        this.setState({ showForecast: !this.state.showForecast });
    }

    startMqttGaugeListener() {
        if(window.gaugeMqttBroker && window.gaugeMqttTopic) {
            this.mqttClient = mqtt.connect('mqtt://' + window.gaugeMqttBroker);
            const e = this;
            this.mqttClient.on('connect', function () {
                e.mqttClient.subscribe(window.gaugeMqttTopic);
            })
            this.mqttClient.on('message', function (topic, message) {
                const m = message.toString();
                e.setState({ gaugeValue : m.length > 0 ? parseFloat(m) : null })
            })
        }
    }

    stopMqttGaugeListener() {
        if(null !== this.mqttClient) {
            this.mqttClient.end();
        }
    }

    render() {

        const renderFuelPrices = (data) => {

            if(null === data.status) {
                return;
            }

            return (
                <div>
                    <i className={"fa fa-gas-pump " + (data.status ? "text-success" : "text-danger")} />&nbsp;
                    <span>{i18n.t('msg.diesel')}: {this.renderCurrency(data.diesel)}</span>&nbsp;
                    <span>{i18n.t('msg.petrol')}: {this.renderCurrency(data.petrol)}</span>
                    <br />
                    <small>{i18n.t('msg.last_updated')}: {dateFormat(new Date(data.time * 1000), 'HH:MM, dd.mm.yyyy')}</small>
                </div>
            )
        }

        const renderGauge = (data) => {

            if(null === data) {
                return;
            }

            return (
                <div id="co2-chart">
                    <Gauge label={""} value={this.state.gaugeValue} color={"#0ff"} backgroundColor={"#222"} width={150} height={150} />
                </div>
            )

        }

        return(
            <div className="overview">
                <div className="row">
                    <div className="col-4">
                        <div className="clock-place">
                            <div className="clock-inner">
                                <div className="clock-box">
                                    <Clock value={this.state.time} renderNumbers={true} size={200} />
                                </div>
                                <h2 className="text-center">{dateFormat(this.state.time, 'HH:MM')} {i18n.t('date.time_suffix')}</h2>
                                <h2 className="text-center">{dateFormat(this.state.time, 'd. mmmm yyyy')}</h2>
                                <h2 className="text-center">{dateFormat(this.state.time, 'dddd')}</h2>
                                <h2 className="mt-2 text-center">
                                    {renderFuelPrices(this.state.fuel)}
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-8">
                        {renderGauge(this.state.gaugeValue)}
                        <ReactWeather
                            forecast="5days"
                            apikey="-"
                            type="city"
                            city="-"
                            lang={window.locale}
                            doUpdate={this.state.reloadWeather}
                        />
                    </div>
                </div>
                {this.renderForecast()}
            </div>
        )
    }

}

export default Overview;
