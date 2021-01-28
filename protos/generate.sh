#!/bin/bash

protoc stockscraper.proto --go_out=plugins=grpc:../stockscraper/stockscraperpb/
protoc stockscraper.proto --js_out=import_style=commonjs,binary:../views/src/ --grpc-web_out=import_style=commonjs,mode=grpcwebtext:../views/src/