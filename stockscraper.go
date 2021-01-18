package main

import (
	"context"

	stk "github.com/Madhur1997/stock-webapp/stockscraperpb"
	"google.golang.org/grpc"
)

type server struct {

}

func (_ *server) stk.Fetch(ctx context.Context, req *stk.FetchRequest) {

}

func (_ *server) stk.Fetch(ctx context.Context, req *stk.MonitorRequest) {

}
