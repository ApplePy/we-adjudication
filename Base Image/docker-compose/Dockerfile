FROM debian:latest

# Install docker
RUN apt-get update -y && \
	apt-get install -y --no-install-recommends curl ca-certificates && \
	curl https://get.docker.com/ | bash && \
	curl -L "https://github.com/docker/compose/releases/download/1.10.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && \
	chmod +x /usr/local/bin/docker-compose && \
	apt-get purge -y curl && \
	apt-get autoremove --purge -y && \
	apt-get clean