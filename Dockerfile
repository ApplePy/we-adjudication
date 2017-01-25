# Build off of ubuntu xenial 16.04
FROM library/ubuntu:16.04

# Update base image
RUN apt-get update -y && \
	apt-get dist-upgrade -y --no-install-recommends && \
	apt-get clean

# Install build tools for native npm packages
RUN apt-get update -y && \
	apt-get install -y --no-install-recommends build-essential && \
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

# Install mongodb
#RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6 && echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.4.list && apt-get -y update && apt-get install -y mongodb-org && echo "\
##!/bin/sh\n\
##\n\
## init.d script with LSB support.\n#\
##\n\
## Copyright (c) 2007 Javier Fernandez-Sanguino <jfs@debian.org>\n\
##\n\
## This is free software; you may redistribute it and/or modify\n\
## it under the terms of the GNU General Public License as\n\
## published by the Free Software Foundation; either version 2,\n\
## or (at your option) any later version.\n\
##\n\
## This is distributed in the hope that it will be useful, but\n\
## WITHOUT ANY WARRANTY; without even the implied warranty of\n\
## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n\
## GNU General Public License for more details.\n\
##\n\
## You should have received a copy of the GNU General Public License with\n\
## the Debian operating system, in /usr/share/common-licenses/GPL;  if\n\
## not, write to the Free Software Foundation, Inc., 59 Temple Place,\n\
## Suite 330, Boston, MA 02111-1307 USA\n\
##\n\
#### BEGIN INIT INFO\n\
## Provides:          mongod\n\
## Required-Start:    $network $local_fs $remote_fs\n\
## Required-Stop:     $network $local_fs $remote_fs\n\
## Should-Start:      $named\n\
## Should-Stop:\n\
## Default-Start:     2 3 4 5\n\
## Default-Stop:      0 1 6\n\
## Short-Description: An object/document-oriented database\n\
## Description:       MongoDB is a high-performance, open source, schema-free\n\
##                    document-oriented data store that's easy to deploy, manage\n\
##                    and use. It's network accessible, written in C++ and offers\n\
##                    the following features:\n\
##\n\
##                       * Collection oriented storage - easy storage of object-\n\
##                         style data\n\
##                       * Full index support, including on inner objects\n\
##                       * Query profiling\n\
##                       * Replication and fail-over support\n\
##                       * Efficient storage of binary data including large\n\
##                         objects (e.g. videos)\n\
##                       * Automatic partitioning for cloud-level scalability\n\
##\n\
##                    High performance, scalability, and reasonable depth of\n\
##                    functionality are the goals for the project.\n\
#### END INIT INFO\n\
#\n\
#PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin\n\
#DAEMON=/usr/bin/mongod\n\
#DESC=database\n\
#\n\
#NAME=mongod\n\
## Defaults.  Can be overridden by the /etc/default/$NAME\n\
## Other configuration options are located in $CONF file. See here for more:\n\
## http://dochub.mongodb.org/core/configurationoptions\n\
#CONF=/etc/mongod.conf\n\
#PIDFILE=/var/run/$NAME.pid\n\
#ENABLE_MONGOD=yes\n\
#\n\
## Include mongodb defaults if available.\n\
## All variables set before this point can be overridden by users, by\n\
## setting them directly in the defaults file. Use this to explicitly\n\
## override these values, at your own risk.\n\
#if [ -f /etc/default/$NAME ] ; then\n\
#        . /etc/default/$NAME\n\
#fi\n\
#\n\
## Handle NUMA access to CPUs (SERVER-3574)\n\
## This verifies the existence of numactl as well as testing that the command works\n\
#NUMACTL_ARGS=\"--interleave=all\"\n\
#if which numactl >/dev/null 2>/dev/null && numactl $NUMACTL_ARGS ls / >/dev/null 2>/dev/null\n\
#then\n\
#    NUMACTL=\"`which numactl` -- $NUMACTL_ARGS\"\n\
#    DAEMON_OPTS=${DAEMON_OPTS:-\"--config $CONF\"}\n\
#else\n\
#    NUMACTL=\"\"\n\
#    DAEMON_OPTS=\"-- \"${DAEMON_OPTS:-\"--config $CONF\"}\n\
#fi\n\
#\n\
#\n\
#if test ! -x $DAEMON; then\n\
#    echo \"Could not find $DAEMON\"\n\
#    exit 0\n\
#fi\n\
#\n\
#if test \"x$ENABLE_MONGOD\" != \"xyes\"; then\n\
#    exit 0\n\
#fi\n\
#\n\
#. /lib/lsb/init-functions\n\
#\n\
#STARTTIME=1\n\
#DIETIME=10                  # Time to wait for the server to die, in seconds\n\
#                            # If this value is set too low you might not\n\
#                            # let some servers to die gracefully and\n\
#                            # 'restart' will not work\n\
#\n\
#DAEMONUSER=${DAEMONUSER:-mongodb}\n\
#DAEMONGROUP=${DAEMONGROUP:-mongodb}\n\
#\n\
#set -e\n\
#\n\
#running_pid() {\n\
## Check if a given process pid's cmdline matches a given name\n\
#    pid=$1\n\
#    name=$2\n\
#    [ -z \"$pid\" ] && return 1\n\
#    [ ! -d /proc/$pid ] &&  return 1\n\
#    cmd=`cat /proc/$pid/cmdline | tr \"\000\" \"\n\"|head -n 1 |cut -d : -f 1`\n\
#    # Is this the expected server\n\
#    [ \"$cmd\" != \"$name\" ] &&  return 1\n\
#    return 0\n\
#}\n\
#\n\
#running() {\n\
## Check if the process is running looking at /proc\n\
## (works for all users)\n\
#\n\
#    # No pidfile, probably no daemon present\n\
#    [ ! -f \"$PIDFILE\" ] && return 1\n\
#    pid=`cat $PIDFILE`\n\
#    running_pid $pid $DAEMON || return 1\n\
#    return 0\n\
#}\n\
#\n\
#start_server() {\n\
#            # Recommended ulimit values for mongod or mongos\n\
#            # See http://docs.mongodb.org/manual/reference/ulimit/#recommended-settings\n\
#            #\n\
#            ulimit -f unlimited\n\
#            ulimit -t unlimited\n\
#            ulimit -v unlimited\n\
#            ulimit -n 64000\n\
#            ulimit -m unlimited\n\
#\n\
#            # In dash, ulimit takes -p for maximum user processes\n\
#            # In bash, it's -u\n\
#            if readlink /proc/$$/exe | grep -q dash\n\
#            then\n\
#                    ulimit -p 64000\n\
#            else\n\
#                    ulimit -u 64000\n\
#            fi\n\
#\n\
#            # Start the process using the wrapper\n\
#            start-stop-daemon --background --start --quiet --pidfile $PIDFILE \\n\
#                        --make-pidfile --chuid $DAEMONUSER:$DAEMONGROUP \\n\
#                        --exec $NUMACTL $DAEMON $DAEMON_OPTS\n\
#            errcode=$?\n\
#        return $errcode\n\
#}\n\
#\n\
#stop_server() {\n\
#\# Stop the process using the wrapper\n\
#            start-stop-daemon --stop --quiet --pidfile $PIDFILE \\n\
#                        --retry 300 \\n\
#                        --user $DAEMONUSER \\n\
#                        --exec $DAEMON\n\
#            errcode=$?\n\
#        return $errcode\n\
#}\n\
#\n\
#force_stop() {\n\
#\# Force the process to die killing it manually\n\
#        [ ! -e \"$PIDFILE\" ] && return\n\
#        if running ; then\n\
#                kill -15 $pid\n\
#        # Is it really dead?\n\
#                sleep \"$DIETIME\"s\n\
#                if running ; then\n\
#                        kill -9 $pid\n\
#                        sleep \"$DIETIME\"s\n\
#                        if running ; then\n\
#                                echo \"Cannot kill $NAME (pid=$pid)!\"\n\
#                                exit 1\n\
#                        fi\n\
#                fi\n\
#        fi\n\
#        rm -f $PIDFILE\n\
#}\n\
#\n\
#\n\
#case \"$1\" in\n\
#  start)\n\
#        log_daemon_msg \"Starting $DESC\" \"$NAME\"\n\
#        # Check if it's running first\n\
#        if running ;  then\n\
#            log_progress_msg \"apparently already running\"\n\
#            log_end_msg 0\n\
#            exit 0\n\
#        fi\n\
#        if start_server ; then\n\
#            # NOTE: Some servers might die some time after they start,\n\
#            # this code will detect this issue if STARTTIME is set\n\
#            # to a reasonable value\n\
#            [ -n \"$STARTTIME\" ] && sleep $STARTTIME # Wait some time\n\
#            if  running ;  then\n\
#                # It's ok, the server started and is running\n\
#                log_end_msg 0\n\
#            else\n\
#                # It is not running after we did start\n\
#                log_end_msg 1\n\
#            fi\n\
#        else\n\
#            # Either we could not start it\n\
#            log_end_msg 1\n\
#        fi\n\
#        ;;\n\
#  stop)\n\
#        log_daemon_msg \"Stopping $DESC\" \"$NAME\"\n\
#        if running ; then\n\
#            # Only stop the server if we see it running\n\
#                        errcode=0\n\
#            stop_server || errcode=$?\n\
#            log_end_msg $errcode\n\
#        else\n\
#            # If it's not running don't do anything\n\
#            log_progress_msg \"apparently not running\"\n\
#            log_end_msg 0\n\
#            exit 0\n\
#        fi\n\
#        ;;\n\
#  force-stop)\n\
#        # First try to stop gracefully the program\n\
#        $0 stop\n\
#        if running; then\n\
#            # If it's still running try to kill it more forcefully\n\
#            log_daemon_msg \"Stopping (force) $DESC\" \"$NAME\"\n\
#                        errcode=0\n\
#            force_stop || errcode=$?\n\
#            log_end_msg $errcode\n\
#        fi\n\
#        ;;\n\
#  restart|force-reload)\n\
#        log_daemon_msg \"Restarting $DESC\" \"$NAME\"\n\
#                errcode=0\n\
#        stop_server || errcode=$?\n\
#        # Wait some sensible amount, some server need this\n\
#        [ -n \"$DIETIME\" ] && sleep $DIETIME\n\
#        start_server || errcode=$?\n\
#        [ -n \"$STARTTIME\" ] && sleep $STARTTIME\n\
#        running || errcode=$?\n\
#        log_end_msg $errcode\n\
#        ;;\n\
#  status)\n\
#\n\
#        log_daemon_msg \"Checking status of $DESC\" \"$NAME\"\n\
#        if running ;  then\n\
#            log_progress_msg \"running\"\n\
#            log_end_msg 0\n\
#        else\n\
#            log_progress_msg \"apparently not running\"\n\
#            log_end_msg 1\n\
#            exit 1\n\
#        fi\n\
#        ;;\n\
#  # MongoDB can't reload its configuration.\n\
#  reload)\n\
#        log_warning_msg \"Reloading $NAME daemon: not implemented, as the daemon\"\n\
#        log_warning_msg \"cannot re-read the config file (use restart).\"\n\
#        ;;\n\
#\n\
#  *)\n\
#        N=/etc/init.d/$NAME\n\
#        echo \"Usage: $N {start|stop|force-stop|restart|force-reload|status}\" >&2\n\
#        exit 1\n\
#        ;;\n\
#esac\n\
#\n\
#exit 0" > /etc/init.d/mongod && ln -s /etc/init.d/mongod /etc/rc3.d/mongod


# Install nodejs 6.x
RUN apt-get update -y && \
	apt-get install -y --no-install-recommends curl && \
	curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
	apt-get install -y nodejs --no-install-recommends && \
	apt-get clean

# Install nodemon, express, bower, and ember
RUN export USER=root && \
	npm install -g nodemon express bower ember-cli && \
	npm cache clean

