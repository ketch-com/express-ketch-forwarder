# express-ketch-forwarder

This repository contain a Node/Express reference implementation of the Ketch Forwarder.

## Getting

To get the source code, use the following:

```shell
git clone git@github.com:ketch-com/express-ketch-forwarder.git
cd express-ketch-forwarder
```

## Building

To build the code, use the following:

```shell
npm run all
```

This will compile the TypeScript code to JavaScript, run prettifier and eslint and then bundle the code into a single `index.js`.

## Debugging

To debug locally, use the following:

```shell
npm run dev
```

This will run the TypeScript code directly under `nodemon` and reload it whenever the source code changes.

## Testing

There are several sample requests in `test/requests`. You can run those requests (in IntelliJ) to simulate valid and
invalid incoming requests.

## Running in Docker Compose

To run locally in Docker Compose, use the following:

```shell
npm run build
docker compose up --build
```

## Distributing

To build the production docker container, use the following:

```shell
npm run build
docker build -f docker/ketch-event-forwarder/Dockerfile --tag ketch-event-forwarder:latest .
```

Now, you can run the container:

```shell
docker run -d -p 3000:3000 -v $PWD/certs:/tls -e KETCH_USER_NAME=user1 -e KETCH_USER_PASSWORD=password1 ketch-event-forwarder:latest
```

You will now have a running event forwarder listening on port 3000.

## Configuring

To change the configuration of the docker container, there are several environment variables you can set:

| Variable              | Default           | Description                                                                                                              |
|-----------------------|-------------------|--------------------------------------------------------------------------------------------------------------------------|
| `KETCH_USER_NAME`     | None              | Username required for basic authentication. If not supplied, the server starts unauthenticated for development purposes. |
| `KETCH_USER_PASSWORD` | None              | Password required for basic authentication. If not supplied, the server starts unauthenticated for development purposes. |
| `KETCH_VERBOSE`       | `false`           | Set to `true` to turn on verbose logging. Can also pass `-v` to the `command`                                            |
| `KETCH_PORT`          | `3000`            | Port to listen on. Can also pass `--port PORT` to the `command`                                                          |
| `KETCH_TLS_CERT`      | `/tls/server.crt` | Location of the TLS certificate file. Can also pass `--tls-cert FILE` to the `command`                                   |
| `KETCH_TLS_FILE`      | `/tls/server.key` | Location of the TLS private key file. Can also pass `--tls-key FILE` to the `command`                                    |

## Extending

Given this is a reference implementation, the only "implementation" provided is logging the incoming request. We recommend
you update `src/handle.ts` and provide an actual implementation of the `handle` function. The default implementation is:

```typescript
export function handle(req: Request): ResponseBody {
  console.log(JSON.stringify(req))

  // TODO - insert your implementation here

  return {
    status: RequestStatus.Completed
  }
}
```
