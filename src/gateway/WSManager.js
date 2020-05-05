const Connection = require ("./WSShard");
const Collection = require ("../structures/collection");
const Shard = require ("../managers/Shard");
const EventEmitter = require ("events");
class GatewaySocket extends EventEmitter {
	constructor(client) {
		super();
		this.token = client.token;
		this.maxShards = client.options.maxShards;
		this.shards = new Collection(Shard,this)
		this.lastReady = 0;
    this.client = client;
  
	}

  
	getGatewayInfo() {
		return new Promise((resolve, reject) => {
			require('https').get({
				hostname: 'discordapp.com',
				path: '/api/gateway/bot',
				headers: {
					Authorization: "Bot " + this.token
				}
			}, (res) => {
				let data = '';
				res.on('data', (d) => {
					data += d;
				});
				res.on('end', () => {
					resolve(JSON.parse(data));
				});
			}).on('error', reject);
		});
	}

	async connect(start = 0, end) {
		const { url, shards } = await this.getGatewayInfo();
		this.url = url;
		if (isNaN(this.maxShards)) {
			this.maxShards = shards;
		}
		end = end || this.maxShards
		for (let i = start; i < end; i++) {
			if (this.shards.get(i)) {
				await this.shards.get(i).close();
			};
			const shard = new Connection(this, i,this.client);
      
      this. shards. set (i,shard);
			this.lastReady = (await this.shards.get(i).connect()).timeReady;
		}
	}

	send(data, shard = 0) {
		this.shards.get(shard).send(data);
	}
};

module. exports = GatewaySocket;