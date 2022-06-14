const stylus = require('stylus');

var plugin = function(){
  return function(style){

    style.define('extract-min-from-minmax', function(a, b) {
      if(a.name === 'minmax') {
        return a.args.nodes[0].nodes[0];
      } else {
        throw new Error('must be minmax')
      }
    });

    style.define('convert-props-to-hash', a => {
      const obj = new stylus.nodes.Object()
      a.nodes.forEach(node => obj.set(node.name, node.expr));
      return obj
    });

    style.define('builtin-fn-names', function() {
      const fns = [];
      for (const fn in stylus.functions) fns.push(fn)
      return fns;
    });

    style.define('debug', function(a, b) {
      console.log(JSON.stringify(a, null, 2));
    });

  };
};
module.exports = plugin;
