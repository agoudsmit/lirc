#! /bin/sh
### BEGIN INIT INFO
# Provides:          shutdown
# Required-Start:
# Required-Stop:
# Should-Start:      
# Default-Start:     S
# Default-Stop:
# Short-Description: Show custom shutdown
# Description:       Show custom shutdown
### END INIT INFO

do_start () {
    echo "* timed shutdown 4h * "
    sudo shutdown -h 180 &
     exit 0 }


case "$1" in
  start|"")
    do_start
    ;;
  restart|reload|force-reload)
    echo "Error: argument '$1' not supported" >&2
    exit 3
    ;;
  stop)
    # No-op
    echo "* stopping timed shutdown 4h"
    sudo shutdown -c
    ;;
  status)
    exit 0
    ;;
  *)
    echo "Usage: shutdown [start|stop]" >&2
    exit 3
    ;;
esac

exit 0