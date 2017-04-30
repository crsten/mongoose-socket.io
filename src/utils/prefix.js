const flatten = require('array-flatten');
const ObjectId = require('mongoose').Types.ObjectId;

const ResolvePrefix = function(doc, options) {
  if(!doc) throw new Error('doc is undefined');
  if(!options) throw new Error('options is undefined');

  return convert(options.prefix);

  function convert(prefix) {
    let result = '';
    if(typeof prefix === 'string') result = prefix;
    else if(typeof prefix === 'function') result = convert(prefix(doc));
    else if(prefix instanceof Array) console.error('Prefix does not support arrays');
    else if(prefix instanceof ObjectId) result = prefix.toString();
    else {
      console.log('Invalid prefix type');
    }

    return result;
  }
};

module.exports = ResolvePrefix;
