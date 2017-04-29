const flatten = require('array-flatten');

const ResolvePrefix = function(doc, options) {
  if(!doc) throw new Error('doc is undefined');
  if(!options) throw new Error('options is undefined');

  return convert(options.prefix);

  function convert(prefix) {
    let result = '';
    if(typeof prefix === 'string') result = prefix;
    if(typeof prefix === 'function') result = convert(prefix(doc));
    if(prefix instanceof Array) console.error('Prefix does not support arrays');

    return result;
  }
};

module.exports = ResolvePrefix;
