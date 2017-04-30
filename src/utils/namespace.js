const flatten = require('array-flatten');
const ObjectId = require('mongoose').Types.ObjectId;

const ResolveNamespace = function(doc, options) {
  if(!doc) throw new Error('doc is undefined');
  if(!options) throw new Error('options is undefined');

  return convert(options.namespace);

  function convert(namespace) {
    let result = [];
    if(typeof namespace === 'string') result.push(namespace);
    else if(typeof namespace === 'function') result.push(convert(namespace(doc)));
    else if(namespace instanceof Array) result.push(namespace.map(convert));
    else if(namespace instanceof ObjectId) result.push(namespace.toString());
    else {
      console.log('Invalid namespace type');
    }

    return (!result.length) ? ['/'] : flatten(result);
  }
};

module.exports = ResolveNamespace;
