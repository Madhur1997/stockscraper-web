package main

import (
	"net"

	stk "stock-webapp/stockscraper/stockscraperpb"

	log "github.com/sirupsen/logrus"
	grpc "google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

func main() {
	setLogger()

	log.Info("Starting stockscraper service")

	lis, err := net.Listen("tcp", "0.0.0.0:3001")
	if err != nil {
		log.Fatalf("Failed to listen: ", err)
	}
	s := grpc.NewServer()
	srv := NewStockScraperServer()
	stk.RegisterStockscraperServer(s, srv)
	reflection.Register(s)

	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
