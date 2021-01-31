import React from "react"
import { StockscraperClient } from "../stockscraper_grpc_web_pb"
import { FetchRequest, MonitorRequest } from "../stockscraper_pb"

// Request to the envoy proxy
var client = new StockscraperClient('http://localhost:3002')

function fetchRequest(stockName) {
    let request = new FetchRequest()
    request.setName(stockName)

    client.fetch(request, {}, (err, response) => {
        console.log("Stock price: ", response.getPrice())
    })
}

function monitorRequest(stockName, duration) {
    let request = new MonitorRequest()
    request.setName(stockName)
    request.setDuration(duration)

    let stream = client.monitor(request, {})

    stream.on('data', function (response) {
        console.log("Stock price : ", response.getPrice())
    })
}

class LoggedIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchInput: "",
            monitorInput: "",
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
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
        console.log("Hello")
        const keyCode = event.keyCode
        const { name } = event.target
        console.log(keyCode)
        // "13" is the Enter key
        if (keyCode === 13) {
            event.preventDefault()
            let stockName = this.state[name]
            console.log(stockName)
            if (name === "fetchInput") {
                fetchRequest(stockName)
            } else {
                monitorRequest(stockName, 60)
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
                <div className="stock-container"></div>
                <div className="col-lg-12">
                    <br />
                    <span className="pull-right"> <button className="btn btn-default" onClick={this.logout}>Log Out</button></span>
                </div>
            </div>
        )
    }
}

export default LoggedIn
