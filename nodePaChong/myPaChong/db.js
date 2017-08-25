
var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;

module.exports = new MongoClient(new Server('localhost', 27017),{native_parser: true});
