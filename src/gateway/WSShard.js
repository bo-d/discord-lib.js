const WebSocket = require('ws');
const EventEmitter = require('events');

let p = (func) => {
	return (data) => {
		func(JSON.parse(data));
	}
}
let e = JSON.stringify;
let encoding = 'json';
try {
	const erlpack = require('erlpack');
	p = (func) => {
		return (data) => {
			func(erlpack.unpack(data));
		}
	}
	e = erlpack.pack;
	encoding = 'etf';
} catch (e) {
}

class WebSocketShard {
	constructor(main, shard) {
    this.id = shard;
		this.socket = null;
    this.client = main.client;
		this.hbinterval = null;
		this.hbfunc = null;
		this.hbtimer = null;
		this.s = -1;
		this.session = -1;
		this.shard = shard;
		this.main = main;
    this.recieved = 1;
    this. sent = 1;
    console.log(this. client);
	}
  get ping() {
    return this. recieved - this.sent;
  };
get guilds () {
  return this. client. guilds. filter (u => u. shardID == this. shard);
};
get users () {
  return this. client. users.filter(u => u.shardID == this.shard);
};
	acknowledge() {
    this. recieved = new Date (). getTime ();
		this.client.emit('debug', this.shard, 'hb acknowledged');
		this.hbfunc = this.beat;
	}

	beat() {
    this. sent = new Date ().getTime();
		this.client.emit('debug', this.shard, 'sending hb');
		this.socket.send(e({
			op: 1,
			d: this.s
		}));
		this.hbfunc = this.resume;
	}

	resume() {
		this.client.emit('debug', this.shard, 'attempting resume');
		this.close().then(() =>
			this.connect()
		).then(() => {
			this.client.emit('debug', this.shard, 'sent resume packet');
			this.socket.send(e({
				op: 6,
				d: {
					token: this.main.token,
					session_id: this.session,
					seq: this.s
				}
			}));
		});
	}

	close() {
		this.client.emit('debug', this.shard, 'client attempting to close connection');
		if (this.hbtimer) {
			clearInterval(this.hbtimer);
		}
		return new Promise((resolve, reject) => {
			if (this.socket.readyState !== 3) {
				this.socket.close(1001, 'cya later alligator');
				this.socket.removeAllListeners('close');
				this.socket.once('close', () => {
					this.client.emit('debug', this.shard, 'client closed connection');
					resolve();
				});
			} else {
				resolve();
			}
		});
	}

	connect(cb) {
this.client.emit('debug', this.shard, 'starting connection packet');
		return new Promise((resolve, reject) => {
			this.socket = new WebSocket(this.main.url + '?encoding=' + encoding);
			this.socket.once('open', () => {
				this.client.emit('debug', this.shard, 'opened connection');
				this.socket.once('message', p((payload) => {
					this.client.emit('debug', this.shard, 'recieved heartbeat info ' + JSON.stringify(payload.d));
					this.hbinterval = payload.d.heartbeat_interval;
					this.hbfunc = this.beat;
					if (this.hbtimer) {
						clearInterval(this.hbtimer);
					}
					this.hbtimer = setInterval(() => this.hbfunc(), this.hbinterval);
					if (!cb) {
						setTimeout(() => resolve(this.identify()), 5000 - Date.now() + this.main.lastReady);
					} else {
						resolve(cb());
					}
				}));
			});
			this.socket.once('close', (code, reason) => {
				this.client.emit('debug', this.shard, 'server closed connection. code: ' + code + ', reason: ' + reason + ' reconnecting in 10');
				setTimeout(() => this.close().then(() => this.connect()), 10000);
			});
			this.socket.once('error', () => {
				this.client.emit('debug', this.shard, 'recieved error ' + e.message + ', reconnecting in 5');
				setTimeout(() => this.close().then(() => this.connect()), 5000);
			});
		});
	}

	send(data) {
		this.socket.send(e(data));
	}

	identify() {
		return new Promise((resolve, reject) => {
			this.client.emit('debug', this.shard, 'sent identify packet');
  
			this.socket.send(e({
				op: 2,
				d: {
					token: this.main.token,
					properties: {},
					shard: [this.shard, this.main.maxShards],
					compress: false,
					large_threshold: 250,
					presence: {}
				}
			}));
			this.socket.on('message', p((payload) => {
				this.s = payload.s;
				this.client.emit('packets', this.shard, payload);
				if (payload.op === 11) {
					this.acknowledge();
				} else if (payload.t === 'RESUMED') {
					this.client.emit('debug', this.shard, 'successfully resumed');
				} else if (payload.op === 0) {
					this.client.emit(payload.t, this.shard, payload.d);
				}
			}));
			this.socket.once('message', p((payload) => {
				if (payload.t === 'READY') {
          console.log(payload.d);
					this.session = payload.d.session_id;
					this.client.emit('debug', this.shard, 'is ready');
					resolve({ timeReady: Date.now(), socket: this });
				} else if (payload.op === 9) {
					this.client.emit('debug', this.shard, 'invalid session, reconnecting in 5');
					setTimeout(() => this.close().then(() => this.connect()), 5000);
				}
			}));
		});
	}
};

module. exports = WebSocketShard;