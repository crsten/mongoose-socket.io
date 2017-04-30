const flatten = require('array-flatten');
const ObjectId = require('mongoose').Types.ObjectId;

const ResolveRoom = function(doc, options) {
  if(!doc) throw new Error('doc is undefined');
  if(!options) throw new Error('options is undefined');

  return convert(options.room);

  function convert(room) {
    let result = [];
    if(typeof room === 'string') result.push(room);
    else if(typeof room === 'function') result.push(convert(room(doc)));
    else if(room instanceof Array) result.push(room.map(convert));
    else if(room instanceof ObjectId) result.push(room.toString());
    else {
      console.log('Invalid room type');
    }

    return (!result.length) ? [''] : flatten(result);
  }
};

module.exports = ResolveRoom;
