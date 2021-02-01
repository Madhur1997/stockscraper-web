import React from "react"

class Stockcard extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <h3>{this.props.stockName}</h3>
                <ul>{this.props.priceList.map(price => <li>{price}</li>)}</ul>
            </div>
        )
    }
}

export default Stockcard