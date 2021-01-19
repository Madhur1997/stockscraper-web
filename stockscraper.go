package main

import (
	"context"
	"time"

	"github.com/Madhur1997/stock-webapp/scraper"
	stk "github.com/Madhur1997/stock-webapp/stockscraperpb"
	log "github.com/sirupsen/logrus"
)

type server struct {
}

func NewServer() *server {
	srv := new(server)
	return srv
}

func (_ *server) Fetch(ctx context.Context, req *stk.FetchRequest) (*stk.FetchResponse, error) {
	stock := req.GetName()

	log.WithFields(log.Fields{
		"Stock": stock,
	}).Info("Fetch Price")

	result := make(chan string)
	go scraper.FetchPrice(stock, result)

	select {
	case val := <-result:
			if val != "" {
				return &stk.FetchReponse{
					Price: strconv.ParseFloat(val),
				}, nil
			}
			return nil, status.Errorf(codes.Internal, fmt.Sprintf("Internal error"))
		}
	}
}

func (_ *server) Monitor(req *stk.MonitorRequest, stream stk.Stockscraper_MonitorServer) error {
	stock := req.GetName()
	duration := req.GetDuration()

	log.WithFields(log.Fields{
		"Stock": stock,
	}).Info("Monitor Stock")

	minTicker := time.NewTicker(time.Minute)
	durationTicker := time.NewTicker(time.Minute * duration)

	for {
		select {
		case <-minTicker.C:
			log.WithFields(log.Fields{
				"Tick at": minTicker,
			}).Debug("Fetch price")

			result := make(chan string)
			go scraper.FetchPrice(stock, result)

			select {
				case val := <-result:
					if val != "" {
						// Valid value received, send it to react client.
						res := &stk.FetchResponse{
							Price: strconv.ParseFloat(val),
						}
						stream.Send(res)
					} else {
						// Error encountered, close stream and return the error.
						return status.Errorf(codes.Internal, fmt.Sprintf("Internal error"))
					}
				}
			}
		}
		case <-durationTicker.C:
			// Close stream and return nil
			return nil
		}
	}
}
