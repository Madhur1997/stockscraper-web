import Home from "./Components/HomeComponent.js"
import LoggedIn from "./Components/LoggedInComponent.js"
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from "./authVars.js"

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

export default App