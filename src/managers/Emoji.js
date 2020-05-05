const Base = require ("./Base");

class Emoji extends Base {
  constructor (data,client) {
    super (data.id);
    
    this.name =  data.name;
    this.animated = data.animated;
    this.available = data.available;
    this.managed = data.managed;
    if(data.require_colons) this.requireColons = data.require_colons;
  }
  
};

module.exports = Emoji;