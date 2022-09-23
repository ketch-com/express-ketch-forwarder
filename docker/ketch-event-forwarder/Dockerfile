FROM alpine
RUN apk update && apk --no-cache upgrade && apk add --update nodejs && mkdir /docker-entrypoint-initdb.d /app
COPY docker/ketch-event-forwarder/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
COPY dist/ketch-event-forwarder/index.js /app/ketch-event-forwarder.js
WORKDIR /app
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
