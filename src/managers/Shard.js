const Base = require ("./Base")
class Shard extends Base {
  constructor(data,client,main) {
    super (data.id);
    this.status = data.status;
    this.ping = data.ping;
    this.guilds = data.guilds;
    this.users = data.users;
    this.sequence = data.s;
    this.sessionID = data.session;
    this.heartbeat = data.hbtimer;
    this.lastReady = data.lastReady;
    this.connect = data. connect;
    this.send = data.send;
    this.main = main;
    this.client = client;
    this.identify = data. identify;
    this.send = data. send;
    this.heartbeat = data. heartbeat;
    this. close = data. close;
    this. connect = data. connect;
    this. acknowledge = data. acknowledge;
    this. resume = data. resume;
    this. beat = data. beat;
    
  };

};

module. exports = Shard;