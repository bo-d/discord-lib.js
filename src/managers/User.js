const Base = require ("./Base");
module. exports = class User extends Base {
  constructor (data,client) {
    super (data.id)
    this.username = data.username;
    this.discriminator = data.discriminator;
    this.tag = this.getTag();
    this.bot = Boolean(data.bot);
    this.avatar = data.avatar;
    if(data.mfa_enabled) this.mfaEnabled = Boolean(data.mfa_enabled);
    if(data.system) this.system = Boolean(data.system);
    this.createdAt = super.createdAt();
    this.createdTimestamp = super.createdTimestamp();
    this.client = client;
  };

    getTag() {
      return `${this.username}#${this.discriminator}`
    };
  
    avatarURL(options = {type:"auto",size:null}) {
      let type = ["png","jpg","jpeg","gif","auto"].includes(options.type) ? options.type : "auto";
     if(type == "auto") this.avatar.startsWith("a_") ? type = "gif" : type = "png";
      let url = `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${type}`;
      if(options.size) url += `?size=${options.size}`;
      return url;
    };
 
};