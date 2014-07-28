// Generated by IcedCoffeeScript 1.7.1-f
(function() {
  var DataPacket, HeaderPacket, IndexPacket, Packet, iced, make_esc, mpack, pad, __iced_k, __iced_k_noop,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  mpack = require('purepack').mpack;

  make_esc = require('iced-error').make_esc;

  pad = function(buf, len) {
    var diff;
    if ((diff = len - buf.length) < 0) {
      throw new Error("Can't shrink a packet, can only pad it with 0s");
    } else {
      buf = Buffer.concat([
        buf, new Buffer((function() {
          var _i, _results;
          _results = [];
          for (_i = 0; 0 <= diff ? _i < diff : _i > diff; 0 <= diff ? _i++ : _i--) {
            _results.push(0);
          }
          return _results;
        })())
      ]);
    }
    return buf;
  };

  Packet = (function() {
    function Packet(_arg) {
      this.stubs = _arg.stubs;
      this._buf_cache = null;
      this._hmac_cache = null;
    }

    Packet.prototype.reset = function() {
      return this._buf_cache = this._hmac_cache = null;
    };

    Packet.prototype.to_buffer = function(args) {
      var len, obj, packed, packet;
      if (args == null) {
        args = {};
      }
      if (!(this._buf_cache = null)) {
        obj = [this.packet_tag(), this.to_json()];
        packed = mpack(obj);
        if (args != null ? args.len : void 0) {
          packet = pad(packet, args.len);
        }
        len = mpack(packed.length);
        this._buf_cache = Buffer.concat([len, packed]);
      }
      return this._buf_cache;
    };

    Packet.prototype.compte_hmac = function(cb) {
      var err, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      err = null;
      (function(_this) {
        return (function(__iced_k) {
          if (_this.hmac == null) {
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "/Users/max/src/keybase/xlpgp/src/packet.iced",
                funcname: "Packet.compte_hmac"
              });
              _this.stubs.hmac_sha256({
                buf: _this.to_buffer()
              }, __iced_deferrals.defer({
                assign_fn: (function(__slot_1) {
                  return function() {
                    err = arguments[0];
                    return __slot_1.hmac = arguments[1];
                  };
                })(_this),
                lineno: 43
              }));
              __iced_deferrals._fulfill();
            })(__iced_k);
          } else {
            return __iced_k();
          }
        });
      })(this)((function(_this) {
        return function() {
          return cb(err, _this._hmac_cache);
        };
      })(this));
    };

    Packet.prototype.get_hmac = function() {
      return this._hmac_cache;
    };

    return Packet;

  })();

  exports.IndexPacket = IndexPacket = (function(_super) {
    __extends(IndexPacket, _super);

    IndexPacket.prototype.TAG = 0x2;

    function IndexPacket(_arg) {
      var stubs;
      stubs = _arg.stubs, this.index = _arg.index;
      IndexPacket.__super__.constructor.call(this, {
        stubs: stubs
      });
    }

    IndexPacket.prototype.packet_tag = function() {
      return IndexPacket.TAG;
    };

    IndexPacket.prototype.to_json = function() {
      return this.index;
    };

    return IndexPacket;

  })(Packet);

  exports.DataPacket = DataPacket = (function(_super) {
    __extends(DataPacket, _super);

    DataPacket.prototype.TAG = 0x3;

    function DataPacket(_arg) {
      var stubs;
      this.plaintext = _arg.plaintext, stubs = _arg.stubs;
      DataPacket.__super__.constructor.call(this, {
        stubs: stubs
      });
      this.hmac = null;
      this.ciphertext = null;
    }

    DataPacket.prototype.packet_tag = function() {
      return DataPacket.TAG;
    };

    DataPacket.prototype.encrypt = function(cb) {
      var esc, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      esc = make_esc(cb, "DataPacket.encrypt");
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/max/src/keybase/xlpgp/src/packet.iced",
            funcname: "DataPacket.encrypt"
          });
          _this.stubs.aes256ctr_encrypt({
            buf: _this.plaintext
          }, esc(__iced_deferrals.defer({
            assign_fn: (function(__slot_1) {
              return function() {
                return __slot_1.ciphertext = arguments[0];
              };
            })(_this),
            lineno: 83
          })));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/Users/max/src/keybase/xlpgp/src/packet.iced",
              funcname: "DataPacket.encrypt"
            });
            _this.compute_hmac(esc(__iced_deferrals.defer({
              lineno: 84
            })));
            __iced_deferrals._fulfill();
          })(function() {
            return cb(null);
          });
        };
      })(this));
    };

    DataPacket.prototype.to_json = function() {
      return this.ciphertext;
    };

    return DataPacket;

  })(Packet);

  exports.HeaderPacket = HeaderPacket = (function(_super) {
    __extends(HeaderPacket, _super);

    HeaderPacket.prototype.TAG = 0x1;

    function HeaderPacket(_arg) {
      this.pgp = _arg.pgp, this.stubs = _arg.stubs;
      HeaderPacket.__super__.constructor.call(this, {
        stubs: stubs
      });
    }

    HeaderPacket.prototype.packet_tag = function() {
      return HeaderPacket.TAG;
    };

    HeaderPacket.prototype.to_json = function() {
      return this.pgp;
    };

    return HeaderPacket;

  })(Packet);

}).call(this);