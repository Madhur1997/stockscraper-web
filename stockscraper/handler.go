package main

import (
	"context"
	"fmt"
	"strconv"
	"time"

	stk "stockscraper/stockscraperpb"

	log "github.com/sirupsen/logrus"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// StockScraper implements the StockScraperService interface
type StockScraper struct {
}

// NewStockScraperServer returns a new StockScraper instance.
func NewStockScraperServer() *StockScraper {
	srv := new(StockScraper)
	return srv
}

// Fetch handler.
func (*StockScraper) Fetch(ctx context.Context, req *stk.FetchRequest) (*stk.FetchResponse, error) {
	stock := req.GetName()

	log.WithFields(log.Fields{
		"Stock": stock,
	}).Info("Fetch Price")

	result := make(chan string)
	go FetchPrice(stock, result)

	select {
	case val := <-result:
		retVal, _ := strconv.ParseFloat(val, 32)
		if val != "" {
			return &stk.FetchResponse{
				Price: float32(retVal),
			}, nil
		}
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Internal error"))
	}
}

// Monitor handler.
func (*StockScraper) Monitor(req *stk.MonitorRequest, stream stk.Stockscraper_MonitorServer) error {
	stock := req.GetName()
	duration := req.GetDuration()

	log.WithFields(log.Fields{
		"Stock": stock,
	}).Info("Monitor Stock")

	minTicker := time.NewTicker(time.Minute)
	durationTicker := time.NewTicker(time.Minute * time.Duration(duration))

	log.WithFields(log.Fields{
		"Tick at": minTicker,
	}).Debug("Fetch price")

	result := make(chan string)
	go FetchPrice(stock, result)

	select {
	case val := <-result:
		if val != "" {
			// Valid value received, send it to react client.
			retVal, _ := strconv.ParseFloat(val, 64)
			res := &stk.MonitorResponse{
				Price: float32(retVal),
			}
			stream.Send(res)
		}
	}

	for {
		select {
		case <-minTicker.C:
			log.WithFields(log.Fields{
				"Tick at": minTicker,
			}).Debug("Fetch price")
			go FetchPrice(stock, result)

			select {
			case val := <-result:
				if val != "" {
					// Valid value received, send it to react client.
					retVal, _ := strconv.ParseFloat(val, 64)
					res := &stk.MonitorResponse{
						Price: float32(retVal),
					}
					stream.Send(res)
				}
			}
		case <-durationTicker.C:
			// Close stream and return nil.
			return nil
		}
	}
}
