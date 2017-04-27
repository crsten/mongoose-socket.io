const Logger = require('./utils/logger');

module.exports = function Emitter(data, options, io){
  let emitter = io;

  if(options.namespace) emitter = emitter.of(`${options.namespace}`);
  if(options.room) emitter = emitter.in(options.room);

  emitter.emit(options.eventName, data);
  if(options.debug) Logger({
    namespace: options.namespace,
    room: options.room,
    eventName: options.eventName
  });
}
