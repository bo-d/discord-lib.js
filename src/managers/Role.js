const Base = require ("./Base");

class Role extends Base {
  constructor (data,client,guild) {
  super (data.id);
    this.name = data. name;
    this.color = data.color;
    this.hoisted = Boolean(data.hoist);
    this.position = data.position;
    this.mentionable = data.mentionable;
    this.managed = data.managed
  }
  
};

module. exports = Role;