const cli = require('cli-color');

module.exports = function Log(options) {
  console.log(
    cli.blackBright('[Emitting] -> Namespace('),
    cli.cyanBright(options.namespace || cli.italic('default')),
    cli.blackBright(') -> Room('),
    cli.magentaBright(options.room || cli.italic('no room')),
    cli.blackBright(') -> Event('),
    cli.greenBright(options.eventName),
    cli.blackBright(`) [${new Date().toLocaleTimeString()}]`)
  )
}
