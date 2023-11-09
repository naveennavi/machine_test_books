
process.env.NODE_ENV = "test";
process.env.MONGODB_URL = "mongodb+srv://naveenworks:0WnBPBeoA8M320x2@cluster0.gkykg.mongodb.net/MacBooks";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();
chai.use(chaiHttp);

module.exports = {
	chai: chai,
	server: server,
	should: should
};