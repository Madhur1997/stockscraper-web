import React from "react"

class LoggedIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    logout = () => {
        localStorage.removeItem("id_token")
        localStorage.removeItem("access_token")
        localStorage.removeItem("profile")
        location.reload()
    }
    componentDidMount() {
    }
    render() {
        return (
            <div className="container">
                <div className="col-lg-12">
                    <br />
                    <span className="pull-right"> <button className="btn btn-default" onClick={this.logout}>Log Out</button></span>
                    <h2>2</h2>
                    <p>Let's feed you with some funny Jokes!!!</p>
                </div>
            </div>
        )
    }
}

export default LoggedIn
