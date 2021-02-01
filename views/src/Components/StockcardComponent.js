import React from "react"

class MonitorCard extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="monitor-card">
                <h3>{this.props.stockName}</h3>
                <ul>{this.props.priceList.map(price => <li>Price: {price}</li>)}</ul>
            </div>
        )
    }
}

class FetchCard extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="fetch-card">
                <h3>{this.props.stockName}</h3>
                <ul>
                    <li>Price: {this.props.price}</li>
                </ul>
            </div>
        )
    }
}

export {
    FetchCard,
    MonitorCard,
}