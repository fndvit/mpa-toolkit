var plugin = function(){
  return function(style){
    style.define('extract-min-from-minmax', function(a, b) {
      if(a.name === 'minmax') {
        return a.args.nodes[0].nodes[0];
      } else {
        throw new Error('must be minmax')
      }
    });
  };
};
module.exports = plugin;
