import React, {Component, useEffect, useState} from 'react';
import Clock from 'react-clock';
import ReactWeather from 'react-open-weather';
import i18n from '../utils/i18n';
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
        this.state = { time: new Date(), reloadWeather: false };
        this.timer = null;
        this.timer2 = null;
        this.setTime = this.setTime.bind(this);
        this.updateWeather = this.updateWeather.bind(this);
    }

    componentDidMount() {
        this.timer = setInterval(this.setTime, 1000);
        this.timer2 = setInterval(this.updateWeather, 900000);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
        clearTimeout(this.timer2);
    }

    setTime() {
        this.setState({ time: new Date(), reloadWeather: false });
    }

    updateWeather() {
        this.setState({ time: this.state.time, reloadWeather: true });
        this.setState({ time: this.state.time, reloadWeather: false });
    }

    render() {

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
                            </div>
                        </div>
                    </div>
                    <div className="col-8">
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
            </div>
        )
    }

}

export default Overview;