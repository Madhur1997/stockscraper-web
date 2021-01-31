.PHONY: run
run: ## Clear any pre existing containers.
	./script clean_containers
	./script start_containers
	./script start_http_server

.PHONY: build
build: ## Only build images
	./script build_images

.PHONY: clean
clean: ## Clear out the stale containers and images
	./script clean_containers
	./script clean_images
	./script stop_http_server
