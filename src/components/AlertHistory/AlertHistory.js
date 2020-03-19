import React from 'react';

function AlertHistory(props) {
    return (
        <div className="">
            <ul>
                {props.alerts.map(alert => (
                    <li>
                        <span>marker id:</span>
                        <b>{alert.draw_id}</b>;

                        <span>coords:</span>
                        <b>{alert.coords}</b>;
                    </li>
                ))}
            </ul>

            <div>
                <button onClick={props.update}>
                    update
                </button>
            </div>
        </div>
    )
}

export default AlertHistory;
