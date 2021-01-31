import React from "react"

class Stockcard extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <h3>{this.props.stockName}</h3>
                <span>{this.props.stockPrice}</span>
            </div>
        )
    }
}