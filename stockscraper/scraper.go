package main

import (
	"context"
	"strings"
	"time"

	"github.com/chromedp/chromedp"
	log "github.com/sirupsen/logrus"
)

// FetchPrice is a utility function to scrap the stock price.
func FetchPrice(q string, res chan<- string) {

	log.WithFields(log.Fields{
		"Stock": q,
	}).Debug("Fetch stock price")

	url := "https://www.google.com"
	inQ := q + " stock price"
	inTextSel := `//input[@name='q']`
	btnSel := `input[name="btnK"]`
	outTextSel := `//span[@jsname="vWLAgc"]`

	// create context
	ctx, cancel := chromedp.NewContext(context.Background())
	defer cancel()
	// Wait for timeout.
	timeoutContext, _ := context.WithTimeout(ctx, 30*time.Second)

	// run task list
	var result string
	err := chromedp.Run(
		timeoutContext,
		chromedp.Navigate(url),
		chromedp.WaitVisible(inTextSel),
		chromedp.SendKeys(inTextSel, inQ),
		chromedp.Click(btnSel, chromedp.ByQuery),
		chromedp.WaitVisible(outTextSel),
		chromedp.Text(outTextSel, &result),
	)

	if err != nil {
		log.WithFields(log.Fields{
			"Stock": strings.Title(q),
			"Error": err,
		}).Error("Error scrapping stock price")
		res <- ""
		return
	}

	res <- result
}
