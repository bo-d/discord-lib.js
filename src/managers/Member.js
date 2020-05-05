const collection = require ("../structures/collection");
const Base = require ("./Base");
const User = require ("./User");
class Member extends Base {
  constructor (data,client,guild) {
  super (data.id);
    this.nickname = data.nick;
    this.deafened = Boolean(data.deaf);
    this.muted = Boolean(data.mute);
    this.roles = data.roles;
    this.hoistedRole = data.hoisted_role;
    this.joinedAt = data.joined_at;
    this.guild = guild;
    this.user = null;
    if(!this.user) this.user = new User(data.user);
   
  }
};

module. exports = Member;