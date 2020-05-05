const request = require("./util/requests");
const Event = require ("events");
const Guild = require ("./managers/Guild");
const User = require ("./managers/User");
const Emoji = require ("./managers/Emoji");
const collection = require ("./structures/collection");
const ShardingManager = require ("./gateway/WSManager");
module.exports = class client extends Event {
  constructor (token,options = {}){
  super (token,options);
    this.token = token;
    if(!options.maxShards) options.maxShards = "auto";
    this.options = options;
    this.gateway = null;
    let r = new request(this.token);
    this.api = r.request;
    this.presence = {
      game:null,
      status:"offline"
    };
    this.ws = new ShardingManager(this);
    this.guilds = new collection(Guild,this);
    this.users = new collection(User,this);
    this.emojis = new collection (Emoji,this);
  };

  
  async connect () {
    const data = await this.getGateway ();
    if(!data) throw new Error ("Couldn't fetch gateway info From the api");
    this.gateway = data.url;
    if(this.options.maxShards == "auto") this.options.maxShards = data.shards;
    this.ws.connect();
  };
  
  getGateway() {
  return this.api("get","/gateway/bot");
  };
  
  
  
  
  

  };
