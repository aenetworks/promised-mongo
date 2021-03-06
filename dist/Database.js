'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongodbCore = require('mongodb-core');

var _mongodbCore2 = _interopRequireDefault(_mongodbCore);

var _parseMongoUrl = require('parse-mongo-url');

var _parseMongoUrl2 = _interopRequireDefault(_parseMongoUrl);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Collection = require('./Collection');

var _Collection2 = _interopRequireDefault(_Collection);

var _Cursor = require('./Cursor');

var _Cursor2 = _interopRequireDefault(_Cursor);

var Server = _mongodbCore2['default'].Server;
var ReplSet = _mongodbCore2['default'].ReplSet;
var MongoCR = _mongodbCore2['default'].MongoCR;

var Database = (function () {
  function Database(connectionString, options, collections) {
    _classCallCheck(this, Database);

    var self = this;

    if (Array.isArray(options)) {
      collections = options;
      options = {};
    }

    self.options = options || {};

    if (typeof connectionString === 'string') {
      self.config = (0, _parseMongoUrl2['default'])(connectionString);
    } else {
      self.config = connectionString;
    }

    var db_options = self.config.db_options;
    var writeConcern = { w: 1 };

    if (db_options) {
      writeConcern = _lodash2['default'].pick(db_options, ['w', 'j', 'fsync', 'wtimeout']);

      if (!writeConcern.w) {
        writeConcern.w = 1;
      }
    }

    Object.defineProperty(self, 'writeConcern', {
      writable: false,
      value: writeConcern
    });

    if (collections) {
      collections.forEach(function (collection) {
        self[collection] = self.collection(collection);

        // set up members to enable db.foo.bar.collection
        var parts = collection.split('.');
        var last = parts.pop();
        var parent = parts.reduce(function (parent, currentPart) {
          return parent[currentPart] = parent[currentPart] || {};
        }, self);

        parent[last] = self.collection(last);
      });
    }
  }

  _createClass(Database, [{
    key: 'addUser',
    value: function addUser(user) {
      return _regeneratorRuntime.async(function addUser$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(createUser(user));

          case 2:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 3:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'close',
    value: function close() {
      var self;
      return _regeneratorRuntime.async(function close$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            self = this;

            if (!self._serverPromise) {
              context$2$0.next = 6;
              break;
            }

            context$2$0.next = 4;
            return _regeneratorRuntime.awrap(self._serverPromise);

          case 4:
            context$2$0.sent.destroy();

            self._serverPromise = null;

          case 6:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'collection',
    value: function collection(collectionName) {
      return new _Collection2['default'](this, collectionName);
    }
  }, {
    key: 'connect',
    value: function connect() {
      var self = this;

      // only connect once
      if (self._serverPromise) {
        return self._serverPromise;
      } else {
        return self._serverPromise = new _bluebird2['default'](function (resolve, reject) {
          var options = null,
              server = null;
          var config = self.config;

          // create server connection for single server or replica set
          if (config.servers.length === 1) {
            options = config.server_options;
            options.host = config.servers[0].host || 'localhost';
            options.port = config.servers[0].port || 27017;
            options.reconnect = true;
            options.reconnectInterval = 50;
            // values specified in self.options override everything else
            options = _lodash2['default'].extend({}, options, self.options);
            server = new Server(options);
          } else {
            options = config.rs_options;
            options.setName = options.rs_name;
            options.reconnect = true;
            options.reconnectInterval = 50;
            options = _lodash2['default'].extend({}, options, self.options);
            server = new ReplSet(config.servers, options);
          }

          if (config.auth) {
            server.addAuthProvider('mongocr', new MongoCR());
            // authenticate on connect
            server.on('connect', function (server) {
              server.auth('mongocr', config.dbName, config.auth.user, config.auth.password, function (error, server) {
                if (error) {
                  reject(error);
                } else {
                  resolve(server);
                }
              });
            });
          } else {
            server.on('connect', function (server) {
              resolve(server);
            });
          }

          server.on('error', function (error) {
            reject(error);
          });

          server.on('timeout', function (error) {
            reject(error);
          });

          server.connect();
        });
      }
    }
  }, {
    key: 'createCollection',
    value: function createCollection(name, options) {
      var cmd;
      return _regeneratorRuntime.async(function createCollection$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            cmd = _lodash2['default'].extend({ create: name }, options || {});
            context$2$0.next = 3;
            return _regeneratorRuntime.awrap(this.runCommand(cmd));

          case 3:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 4:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'createUser',
    value: function createUser(user) {
      var cmd;
      return _regeneratorRuntime.async(function createUser$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (!(typeof user !== 'object')) {
              context$2$0.next = 2;
              break;
            }

            throw new Error('user param should be an object');

          case 2:
            cmd = _lodash2['default'].extend({ createUser: user.user }, user);

            delete cmd.user;
            context$2$0.next = 6;
            return _regeneratorRuntime.awrap(this.runCommand(cmd));

          case 6:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 7:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'dropDatabase',
    value: function dropDatabase() {
      return _regeneratorRuntime.async(function dropDatabase$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(this.runCommand('dropDatabase'));

          case 2:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 3:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'dropUser',
    value: function dropUser(username) {
      return _regeneratorRuntime.async(function dropUser$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(this.runCommand({ dropUser: username }));

          case 2:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 3:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'getCollectionNames',
    value: function getCollectionNames() {
      var collection, names;
      return _regeneratorRuntime.async(function getCollectionNames$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            collection = this.collection('system.namespaces');
            context$2$0.next = 3;
            return _regeneratorRuntime.awrap(collection.find({ name: /^((?!\$).)*$/ }).toArray());

          case 3:
            names = context$2$0.sent;
            return context$2$0.abrupt('return', names.map(function (name) {
              // trim dbname from front of collection name
              return name.name.substr(name.name.indexOf('.') + 1);
            }));

          case 5:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'getLastError',
    value: function getLastError() {
      return _regeneratorRuntime.async(function getLastError$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(this.runCommand('getLastError'));

          case 2:
            return context$2$0.abrupt('return', context$2$0.sent.err);

          case 3:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'getLastErrorObj',
    value: function getLastErrorObj() {
      return _regeneratorRuntime.async(function getLastErrorObj$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(this.getLastError());

          case 2:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 3:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'removeUser',
    value: function removeUser(username) {
      return _regeneratorRuntime.async(function removeUser$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(this.dropUser(username));

          case 2:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 3:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'getSiblingDb',
    value: function getSiblingDb(dbName, collections) {
      var db2;
      return _regeneratorRuntime.async(function getSiblingDb$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            db2 = new Database(_lodash2['default'].assign({}, this.config, { dbName: dbName }), collections);
            context$2$0.next = 3;
            return _regeneratorRuntime.awrap(this.connect());

          case 3:
            db2._serverPromise = context$2$0.sent;
            return context$2$0.abrupt('return', db2);

          case 5:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'runCommand',
    value: function runCommand(options) {
      var self, cmd, server;
      return _regeneratorRuntime.async(function runCommand$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            self = this;

            if (typeof options === 'string') {
              cmd = options;

              options = {};
              options[cmd] = 1;
            }

            context$2$0.next = 4;
            return _regeneratorRuntime.awrap(self.connect());

          case 4:
            server = context$2$0.sent;
            context$2$0.next = 7;
            return _regeneratorRuntime.awrap(new _bluebird2['default'](function (resolve, reject) {
              server.command(self.config.dbName + '.$cmd', options, function (error, result) {
                if (error) {
                  reject(error);
                } else {
                  resolve(result.result);
                }
              });
            }));

          case 7:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 8:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'runCommandCursor',
    value: function runCommandCursor(command, options) {
      if (!options) {
        options = {};
        options[command] = 1;
      }
      var ns = '$cmd.' + command;
      var collection = new _Collection2['default'](this, ns);
      return new _Cursor2['default'](collection, this.config.dbName + '.' + ns, options);
    }
  }, {
    key: 'stats',
    value: function stats(scale) {
      return _regeneratorRuntime.async(function stats$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (scale === undefined) {
              scale = 1;
            }
            context$2$0.next = 3;
            return _regeneratorRuntime.awrap(this.runCommand({ dbStats: 1, scale: scale }));

          case 3:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 4:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return _regeneratorRuntime.async(function toString$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.abrupt('return', this.config.dbName);

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }]);

  return Database;
})();

exports['default'] = Database;
;
module.exports = exports['default'];

// don't open a connection just to close it again

// sanity check args
