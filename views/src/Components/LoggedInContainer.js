import React from "react"
import { StockscraperClient } from "../stockscraper_grpc_web_pb"
import { FetchRequest, MonitorRequest } from "../stockscraper_pb"
import LoggedInComponent from "./LoggedInComponent.js"

// Request to the envoy proxy
var client = new StockscraperClient('http://localhost:3002')

let isError = function (e) {
    return e && e.stack && e.message && typeof e.stack === 'string'
        && typeof e.message === 'string'
}

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
}

class LoggedInContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchInput: "",
            monitorInput: "",
            fetchStocks: [],
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
        console.log("Stock name, price:", stockName, price)

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
            if (isError(err)) {
                console.log(err)
                return
            }

            // 2 Decimal places.
            let price = response.getPrice().toFixed(2)
            fn(stockName, price)
        })
    }

    monitorCallback(stockName, price) {
        console.log("Stock name, price:", stockName, price)

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
            // 2 Decimal places.
            let price = response.getPrice().toFixed(2)
            fn(stockName, price)
        })
        stream.on('error', function (err) {
            console.log("Error:", err)
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
            let stockName = titleCase(this.state[name])

            if (name === "fetchInput") {
                this.fetchRequest(stockName)
                console.log("Fetch", stockName)
            } else {
                this.monitorRequest(stockName, 60)
                console.log("Monitor", stockName)
            }
            // Clear out the input boxes on "Enter"
            this.setState({
                [name]: "",
            })
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
        return (
            < LoggedInComponent state={this.state} logout={this.logout} handleChange={this.handleChange} handleKeyUp={this.handleKeyUp} />
        )
    }
}

export default LoggedInContainer
