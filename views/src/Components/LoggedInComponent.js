import React from "react"
import { StockscraperClient } from "../stockscraper_grpc_web_pb"
import { FetchRequest, MonitorRequest } from "../stockscraper_pb"
import { FetchCard, MonitorCard } from "./StockcardComponent"

// Request to the envoy proxy
var client = new StockscraperClient('http://localhost:3002')

class LoggedIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchInput: "",
            monitorInput: "",
            fetchStocks: [
                {
                    "motherson sumi": {
                        stockPrice: 153.5,
                    }
                }
            ],
            monitoredStocks: {},
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.fetchRequest = this.fetchRequest.bind(this)
        this.monitorRequest = this.monitorRequest.bind(this)
        this.fetchCallback = this.fetchCallback.bind(this)
        this.monitorCallback = this.monitorCallback.bind(this)
    }

    fetchCallback(stockName, price) {
        console.log("Stock name, price: ", stockName, price)

        let arr = this.state.fetchStocks
        arr.push({
            [stockName]: {
                stockPrice: price
            }
        })
        this.setState({
            fetchStocks: arr
        })
    }

    fetchRequest(stockName) {
        let request = new FetchRequest()
        request.setName(stockName)

        const fn = this.fetchCallback
        client.fetch(request, {}, (err, response) => {
            // Handle error
            let price = response.getPrice()
            fn(stockName, price)
        })
    }

    monitorCallback(stockName, price) {
        console.log("Stock name, price : ", stockName, price)

        let obj = this.state.monitoredStocks
        //console.log(obj.hasOwnProperty(stockName))
        if (obj.hasOwnProperty(stockName) == false) {
            obj[stockName] = []
        }
        obj[stockName].push(price)
        this.setState({
            monitoredStocks: obj
        })
    }

    monitorRequest(stockName, duration) {
        let request = new MonitorRequest()
        request.setName(stockName)
        request.setDuration(duration)

        let stream = client.monitor(request, {})
        const fn = this.monitorCallback

        stream.on('data', function (response) {
            let price = response.getPrice()
            fn(stockName, price)
        })
        stream.on('error', function (err) {
            console.log(err)
        })
    }

    logout = () => {
        localStorage.removeItem("id_token")
        localStorage.removeItem("access_token")
        localStorage.removeItem("profile")
        location.reload()
    }

    componentDidMount() {
    }

    handleKeyUp(event) {
        const keyCode = event.keyCode
        const { name } = event.target
        // "13" is the Enter key
        if (keyCode === 13) {
            event.preventDefault()
            let stockName = this.state[name]
            console.log(stockName)
            if (name === "fetchInput") {
                this.fetchRequest(stockName)
            } else {
                this.monitorRequest(stockName, 60)
            }
        }
    }

    handleChange(event) {
        const { name, value } = event.target
        // Update the display value in the input bars.
        this.setState({
            [name]: value
        })
    }

    render() {
        let fetchCardList = []
        for (let idx = this.state.fetchStocks.length - 1; idx >= 0; idx--) {
            let obj = this.state.fetchStocks[idx]
            for (let stockName in obj) {
                console.log(stockName)
                console.log(obj[stockName].stockPrice)
                fetchCardList.push(< FetchCard
                    stockName={stockName}
                    price={obj[stockName].stockPrice} />)
            }
        }
        let monitorCardList = []
        for (let stockName in this.state.monitoredStocks) {
            monitorCardList.push(< MonitorCard
                key={stockName}
                stockName={stockName}
                priceList={this.state.monitoredStocks[stockName]} />)
        }
        return (
            <div className="container">
                <div className="input-container">
                    <label className="fetch">
                        <input
                            type="text"
                            name="fetchInput"
                            placeholder="Search Stocks"
                            value={this.state.fetchInput}
                            onChange={this.handleChange}
                            onKeyUp={this.handleKeyUp}
                        />
                    </label>
                    <label className="monitor">
                        <input
                            type="text"
                            name="monitorInput"
                            placeholder="Monitor Stocks"
                            value={this.state.monitorInput}
                            onChange={this.handleChange}
                            onKeyUp={this.handleKeyUp} />
                    </label>
                </div>
                <div className="stock-container">
                    <div className="fetch-container">
                        {fetchCardList}
                    </div>
                    <div className="monitor-container">
                        {monitorCardList}
                    </div>
                </div>
                <div className="col-lg-12">
                    <br />
                    <span className="pull-right"> <button className="btn btn-default" onClick={this.logout}>Log Out</button></span>
                </div>
            </div>
        )
    }
}

export default LoggedIn
