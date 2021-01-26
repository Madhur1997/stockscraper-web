package main

import (
	"os"

	log "github.com/sirupsen/logrus"
)

func setLogger() {

	if _, ok := os.LookupEnv("DEV"); ok {
		log.SetLevel(log.DebugLevel)
	}
	customFormatter := new(log.TextFormatter)
	customFormatter.TimestampFormat = "2006-01-02 15:04:05"
	customFormatter.FullTimestamp = true
	log.SetFormatter(customFormatter)
}
