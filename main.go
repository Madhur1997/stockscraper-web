package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"

	jwtmiddleware "github.com/auth0/go-jwt-middleware"
	jwt "github.com/form3tech-oss/jwt-go"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

type Jwks struct {
	Keys []JSONWebKeys `json:"keys"`
}

type JSONWebKeys struct {
	Kty string   `json:"kty"`
	Kid string   `json:"kid"`
	Use string   `json:"use"`
	N   string   `json"n"`
	E   string   `json:"e"`
	X5c []string `json:"x5c"`
}

var jwtMiddleWare *jwtmiddleware.JWTMiddleware

func main() {
	jwtMiddleware := jwtmiddleware.New(jwtmiddleware.Options{
		ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {

			iss := os.Getenv("AUTH0_DOMAIN")
			checkIss := token.Claims.(jwt.MapClaims).VerifyIssuer(iss, false)
			if !checkIss {
				return token, errors.New("Invalid Issuer")
			}

			cert, err := getPemCert(token)
			if err != nil {
				log.Fatalf("could not get cert: %+v", err)
			}

			result, _ := jwt.ParseRSAPublicKeyFromPEM([]byte(cert))

			return result, nil
		},
		SigningMethod: jwt.SigningMethodRS256,
	})

	jwtMiddleWare = jwtMiddleware

	router := gin.Default()
	router.Use(static.Serve("/", static.LocalFile("./views", true)))
	router.Run(":3000")
}

func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		err := jwtMiddleWare.CheckJWT(c.Writer, c.Request)
		if err != nil {
			fmt.Println(err)
			c.Abort()
			c.Writer.WriteHeader(http.StatusUnauthorized)
			c.Writer.Write([]byte("Unauthorized"))
			return
		}
	}
}

func getPemCert(token *jwt.Token) (string, error) {
	cert := ""
	resp, err := http.Get(os.Getenv("AUTH0_DOMAIN") + ".well-known/jwks.json")
	if err != nil {
		return cert, err
	}
	defer resp.Body.Close()

	var jwks = Jwks{}
	err = json.NewDecoder(resp.Body).Decode(&jwks)

	if err != nil {
		return cert, err
	}

	x5c := jwks.Keys[0].X5c
	for k, v := range x5c {
		if token.Header["kid"] == jwks.Keys[k].Kid {
			cert = "-----BEGIN CERTIFICATE-----\n" + v + "\n-----END CERTIFICATE-----"
		}
	}

	if cert == "" {
		return cert, errors.New("unable to find appropriate key")
	}

	return cert, nil
}
