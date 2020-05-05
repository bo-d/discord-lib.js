const {toTimestamp} = require ("../util/functions");
module. exports = class Base {
  constructor (id) {
    this.id = id
  }
  
    createdAt() {
      const timestamp = toTimestamp(this.id);
      return new Date(timestamp);
    };
      
    createdTimestamp() {
      return toTimestamp(this.id)
    };
  
};