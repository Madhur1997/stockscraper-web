import React from "react"
import { FetchCard, MonitorCard } from "./StockcardComponent.js"

function LoggedInComponent(props) {
    let fetchCardList = []
    for (let idx = props.state.fetchStocks.length - 1; idx >= 0; idx--) {
        let obj = props.state.fetchStocks[idx]
        for (let stockName in obj) {
            fetchCardList.push(< FetchCard
                stockName={stockName}
                price={obj[stockName].stockPrice} />)
        }
    }
    let monitorCardList = []
    for (let stockName in props.state.monitoredStocks) {
        monitorCardList.push(< MonitorCard
            key={stockName}
            stockName={stockName}
            priceList={props.state.monitoredStocks[stockName]} />)
    }
    return (
        <div className="container">
            <div className="input-container">
                <label className="fetch">
                    <input
                        type="text"
                        name="fetchInput"
                        placeholder="Search Stocks"
                        value={props.state.fetchInput}
                        onChange={props.handleChange}
                        onKeyUp={props.handleKeyUp}
                    />
                </label>
                <label className="monitor">
                    <input
                        type="text"
                        name="monitorInput"
                        placeholder="Monitor Stocks"
                        value={props.state.monitorInput}
                        onChange={props.handleChange}
                        onKeyUp={props.handleKeyUp} />
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
                <span className="pull-right"> <button className="btn btn-default" onClick={props.logout}>Log Out</button></span>
            </div>
        </div>
    )
}

export default LoggedInComponent