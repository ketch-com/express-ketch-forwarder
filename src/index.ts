import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'
import {serve} from './server'

const argv = yargs(hideBin(process.argv))
  .scriptName('ketch-event-forwarder')
  .usage('$0 [--verbose] [--port number] --tls-cert file --tls-key file')
  .options({
    verbose: {
      type: 'boolean',
      default: false,
      description: 'run with verbose logging',
      alias: 'v'
    },
    port: {
      type: 'number',
      default: 3000,
      description: 'port to bind on',
      alias: 'p'
    },
    'tls-cert': {
      type: 'string',
      description: 'location of TLS certificate file',
      demandOption: true
    },
    'tls-key': {
      type: 'string',
      description: 'location of TLS private key file',
      demandOption: true
    }
  })
  .strict()
  .help()
  .exitProcess(true)
  .parseSync()

if (argv.verbose) {
  console.info(`⚡️ Ketch Event Forwarder listening on port ${argv.port}`)
}

serve(argv.port, argv.tlsCert, argv.tlsKey)
