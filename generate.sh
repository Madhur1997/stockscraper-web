#!/bin/bash

protoc stockscraperpb/stockscraper.proto --go_out=plugins=grpc:.