var MersenneTwister = require('mersennetwister');

module.exports = function(seed){
  var mt = new MersenneTwister(seed);

  this.range = function(from, to){
    if(typeof to === 'undefined'){
      to = from;
      from = 0;
    }
    var range = to - from;
    return from + (mt.int() % range);
  };

  this.isOneIn = function(all){
    return (mt.int() % (all + 1)) === 0;
  };
};
