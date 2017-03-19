# Build off of ubuntu xenial 16.04
FROM library/ubuntu:16.04

# Update base image
RUN apt-get update -y && \
	apt-get dist-upgrade -y --no-install-recommends && \
	apt-get clean

# Install build tools for native npm packages and mongodb client tools
RUN apt-get update -y && \
	apt-get install -y --no-install-recommends build-essential mongodb-clients && \
	apt-get clean

# Install Python2, Python3, Pip, and then update all pip packages
RUN apt-get update -y && \
	apt-get install -y --no-install-recommends python python3 python3-pip python-pip && \
	pip install -U pip && \
	pip list --outdated --format=freeze | grep -Po "(.*?)(?===)" | xargs pip install -U && \
	pip3 install -U pip && \
	pip3 list --outdated --format=freeze | grep -Po "(.*?)(?===)" | xargs pip3 install -U && \
	apt-get clean

# Install latest Git
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv E1DF1F24 && \
	echo "deb http://ppa.launchpad.net/git-core/ppa/ubuntu xenial main" | tee /etc/apt/sources.list.d/git-core-ppa.list && \
	apt-get -y update && \
	apt-get install -y --no-install-recommends git && \
	apt-get clean

# Install nodejs 6.x
RUN apt-get update -y && \
	apt-get install -y --no-install-recommends curl && \
	curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
	apt-get install -y nodejs libfontconfig --no-install-recommends && \
	apt-get clean
	
# Install watchman
RUN apt-get update && \
	apt-get install -y --no-install-recommends autotools-dev automake python-dev libtool pkg-config libssl-dev && \
	git clone https://github.com/facebook/watchman.git && \
	cd watchman && \
	./autogen.sh && \
	./configure && \
	make && \
	make install && \
	cd .. && \
	rm -rf watchman && \
	apt-get purge -y autotools-dev automake python-dev libtool pkg-config libssl-dev && \
	apt-get autoremove --purge -y && \
	apt-get clean

# Install nodemon, express, bower, and ember
RUN export USER=root && \
	npm install -g jshint nodemon express bower ember-cli phantomjs-prebuilt mocha istanbul && \
	npm cache clean
