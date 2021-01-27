const AUTH0_DOMAIN = "dev-3ulgmk2c.us.auth0.com"
const AUTH0_CALLBACK_URL = "http://localhost:3000"
const AUTH0_CLIENT_ID = "tDIpSYooIrPeTODfO14ythGLR4OnOElR"
const AUTH0_API_AUDIENCE = "localhost:3000/"
// Request to the envoy proxy
var client = new StockscraperClient('http://localhost:3002')
var request = new FetchRequest()

request.setName("ashok leyland")

client.Fetch(request, {}, (err, response) => {
	    console.log(err)
	    console.log("Stock price: ", response.getPrice())
})

class LoggedIn extends React.Component {
    render() {
        return (
            <div>LoggedIn</div>
        )
    }
}

class App extends React.Component {
    parseHash() {
        this.auth0 = new auth0.WebAuth({
            domain: AUTH0_DOMAIN,
            clientID: AUTH0_CLIENT_ID
        })
        this.auth0.parseHash(window.location.hash, (err, authResult) => {
            if (err) {
                return console.log(err)
            }
            if (
                authResult !== null &&
                authResult.accessToken !== null &&
                authResult.idToken !== null
            ) {
                localStorage.setItem("access_token", authResult.accessToken);
                localStorage.setItem("id_token", authResult.idToken);
                localStorage.setItem(
                    "profile",
                    JSON.stringify(authResult.idTokenPayload)
                );
                window.location = window.location.href.substr(
                    0,
                    window.location.href.indexOf("#")
                );
            }
        })
    }
    setup() {
        $.ajaxSetup({
            beforeSend: (r) => {
                if (localStorage.getItem("access_token")) {
                    r.setRequestHeader(
                        "Authorization",
                        "Bearer " + localStorage.getItem("access_token")
                    )
                }
            }
        })
    }
    setLogin() {
        if (localStorage.getItem("id_token")) {
            this.loggedIn = true
        } else {
            this.loggedIn = false
        }
    }
    render() {
        if (this.loggedIn) {
            return (<LoggedIn />)
        } else {
            return (<Home />)
        }
    }
    constructor() {
        super()
        this.parseHash()
        this.setup()
        this.setLogin()
    }
}

class Home extends React.Component {
    constructor() {
        super()
        this.authenticate = this.authenticate.bind(this)
    }
    authenticate() {
        this.WebAuth = new auth0.WebAuth({
            domain: AUTH0_DOMAIN,
            clientID: AUTH0_CLIENT_ID,
            scope: "openid profile",
            audience: AUTH0_API_AUDIENCE,
            responseType: "token id_token",
            redirectUri: AUTH0_CALLBACK_URL
        })
        this.WebAuth.authorize()
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-8 col-xs-offset-2 jumbotron text-center">
                        <h1>Stock Manager</h1>
                        <p>Your very own stock manager</p>
                        <p>Sign in to get access</p>
                        <a onClick={this.authenticate} className="btn btn-primary btn-lg btn-login btn-block">Sign In</a>
                    </div>
                </div>
            </div>
        )
    }
}
