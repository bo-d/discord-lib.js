const fetch = require("node-fetch");
const {api} = require ("./constants");
const agent = "12";
const Req = class Request {
  constructor (token){
    this. token = token;
  };
  request (method,path,body,type) {
 return new Promise(async (resolve,reject) => {
   const options = {
     headers: {},
     method: method,
    "User-Agent":`DiscordBot (https://b-o-d.cf,${agent})`
   };
    options.headers.Authorization = `Bot ${this.token}`;
   if(!type) { 
     options. headers["Content-type"] = "application/json" } else {
     options. headers["Content-type"] = type; };
   if(body) options.body = JSON.stringify(body);
   fetch (api+path,options).then(q => q.json())
   . then(data => resolve(data))
   . catch(err => reject(err));
   
 });
 }
  

};

module. exports = Req;

