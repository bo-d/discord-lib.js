const Base = require ("./Base");
const collection = require ("../structures/collection");
const Member = require ("./Member");
const Role = require ("./Role");
const Emoji = require ("./Emoji");

class Guild extends Base {
  constructor (data, client) {
    super (data.id);
    
    this.name = data.name;
    this.region = data.region;
    this.icon = data.icon;
    this.shardID = data.shardID;
    this.ownerID = data.owner_id;
    this.description = data.description;
    this.banner = data.banner;
    this.vanityURL = data.vanity_url_code ? `https://discord.gg/${data.vanity_url_code}` : null;
    this.splash = data.splash;
    this.discoverySplash = data.discovery_splash;
    this.memberCount = data.member_count;
    this.embedEnabled = Boolean(data.embed_enabled);
    this.widgetEnabled = Boolean(data.widget_enabled);
    this.large = Boolean(data.large);
    this.available = !data.unavailable;
    this.systemChannelID = data.system_channel_id;
    this.rulesChannelID = data.rules_channel_id;
    this.publicChannelID = data.public_channel_id;
    this.widgetChannelID = data.widget_channel_id;
    this.afkChannelID = data.afk_channelid
    this.afkTimeout = data.afk_timeout;
    this.mfaLevel = data.mfa_level;
    this.verificationLevel = data.verification_level;
    this.features = data.features;
    this.defaultNotifications = data.default_message_notifications == 0 ? "ALL_MESSAGES" : "ONLY_MENTIONS";
    this.explicitContentFilter = data.explicit_content_filter;
    this.premiumBoosts = data.premium_subscription_count;
    this.premiumLevel = data.premium_tier;
    this.applicationID = data.application_id;
    this.shard = client.ws.shards.get(this.shardID);
    this.members = new collection(Member,client);
    this.roles = new collection (Role,client);
    this.emojis = new collection(Emoji,client);
    
    if(data.members) {
     for(const member of data.members) {
       member.id = member.user.id;
       member.shardID = data.shardID;
       this.members.add(member,this)
       client. users.add(member);
     }
    };
    
    if(data.roles) {
      for (const role of data.roles) {
        this.roles.add(role,this);
      }
    };
    
    if(data.emojis) {
    for(const emoji of data.emojis) {
      this.emojis.add(emoji,this);
      client.emojis.add(emoji)
    }
    }
        
  }
  
  
    get owner() {
   return this.members.get(this.ownerID);
    };
  
};
  
module. exports = Guild;