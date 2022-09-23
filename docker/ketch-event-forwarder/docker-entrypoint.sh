#!/usr/bin/env sh

KETCH_VERBOSE=${KETCH_VERBOSE:-false}
KETCH_PORT=${KETCH_PORT:-3000}
KETCH_TLS_CERT=${KETCH_TLS_CERT:-/tls/server.crt}
KETCH_TLS_FILE=${KETCH_TLS_FILE:-/tls/server.key}

KETCH_ARGS="$@"

if [ "$KETCH_VERBOSE" = "true" ]; then
  KETCH_ARGS="$KETCH_ARGS -v"
fi

KETCH_ARGS="$KETCH_ARGS --port $KETCH_PORT"
KETCH_ARGS="$KETCH_ARGS --tls-cert $KETCH_TLS_CERT"
KETCH_ARGS="$KETCH_ARGS --tls-key $KETCH_TLS_FILE"

node ketch-event-forwarder.js $KETCH_ARGS
