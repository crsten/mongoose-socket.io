const flatten = require('array-flatten');

const ResolveRoom = function(doc, options) {
  if(!doc) throw new Error('doc is undefined');
  if(!options) throw new Error('options is undefined');

  return convert(options.room);

  function convert(room) {
    let result = [];
    if(typeof room === 'string') result.push(room);
    if(typeof room === 'function') result.push(convert(room(doc)));
    if(room instanceof Array) result.push(room.map(convert));

    return (!result.length) ? [''] : flatten(result);
  }
};

module.exports = ResolveRoom;
