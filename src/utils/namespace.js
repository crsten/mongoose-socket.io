const flatten = require('array-flatten');

const ResolveNamespace = function(doc, options) {
  if(!doc) throw new Error('doc is undefined');
  if(!options) throw new Error('options is undefined');

  return convert(options.namespace);

  function convert(namespace) {
    let result = [];
    if(typeof namespace === 'string') result.push(namespace);
    if(typeof namespace === 'function') result.push(convert(namespace(doc)));
    if(namespace instanceof Array) result.push(namespace.map(convert));

    return flatten(result);
  }
};

module.exports = ResolveNamespace;
