import React, {Component} from 'react';
import axios from 'axios';
import i18n from '../utils/i18n';

class Calendar extends Component {

    constructor() {
        super();
        this.state = { events: [], loading: true };
        this.timer = null;
        this.getEvents = this.getEvents.bind(this);
    }

    componentDidMount() {
        this.getEvents();
        this.timer = setInterval(this.getEvents, 5000);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    getEvents() {
        axios.get(`/api/events`).then(events => {
            this.setState({ events: [], loading: false})
            this.setState({ events: events.data, loading: false})
        })
    }

    render() {
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

        if(this.state.events.length === 0) {
            return(
                <div className="calendar">
                    <h2 className="text-center">
                        {i18n.t('msg.no_events_found')}
                    </h2>
                </div>
            );
        }

        return(
            <div className="calendar">
                <table className="table table-events">
                    <tbody>
                        { this.state.events.map(event =>
                            <tr key={event.id}>
                                <td>
                                    {!event.same_day && event.start_date || <span>{event.start_date} - {event.end_date}</span>}
                                    <p className="event-sub">{event.full_day && <span>(Ganztägig)</span> || <span>({event.start_time} - {event.end_time})</span>}</p>
                                </td>
                                <td>{event.summary}</td>
                                <td>{event.description}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }

}

export default Calendar;