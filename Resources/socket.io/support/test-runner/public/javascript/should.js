(function(should) {
    function Assertion(obj) {
        if (void 0 !== obj) {
            this.obj = obj;
            this.flags = {};
            var $flags = keys(flags);
            for (var i = 0, l = $flags.length; l > i; i++) this[$flags[i]] = new FlaggedAssertion(this, $flags[i]);
        }
    }
    function FlaggedAssertion(parent, flag) {
        this.parent = parent;
        this.obj = parent.obj;
        this.flag = flag;
        this.flags = {};
        this.flags[flag] = true;
        for (var i in parent.flags) parent.flags.hasOwnProperty(i) && (this.flags[i] = true);
        var $flags = flags[flag];
        for (var i = 0, l = $flags.length; l > i; i++) this[$flags[i]] = new FlaggedAssertion(this, $flags[i]);
    }
    function every(arr, fn, thisObj) {
        var scope = thisObj || window;
        for (var i = 0, j = arr.length; j > i; ++i) if (!fn.call(scope, arr[i], i, arr)) return false;
        return true;
    }
    function indexOf(arr, o, i) {
        if (Array.prototype.indexOf) return Array.prototype.indexOf.call(arr, o, i);
        for (var j = arr.length, i = 0 > i ? 0 > i + j ? 0 : i + j : i || 0; j > i && arr[i] !== o; i++) ;
        return i >= j ? -1 : i;
    }
    function i(obj, showHidden, depth) {
        function stylize(str) {
            return str;
        }
        function format(value, recurseTimes) {
            if (value && "function" == typeof value.inspect && value !== exports && !(value.constructor && value.constructor.prototype === value)) return value.inspect(recurseTimes);
            switch (typeof value) {
              case "undefined":
                return stylize("undefined", "undefined");

              case "string":
                var simple = "'" + json.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                return stylize(simple, "string");

              case "number":
                return stylize("" + value, "number");

              case "boolean":
                return stylize("" + value, "boolean");
            }
            if (null === value) return stylize("null", "null");
            var visible_keys = keys(value);
            var $keys = showHidden ? Object.getOwnPropertyNames(value) : visible_keys;
            if ("function" == typeof value && 0 === $keys.length) {
                if (isRegExp(value)) return stylize("" + value, "regexp");
                var name = value.name ? ": " + value.name : "";
                return stylize("[Function" + name + "]", "special");
            }
            if (isDate(value) && 0 === $keys.length) return stylize(value.toUTCString(), "date");
            var base, type, braces;
            if (isArray(value)) {
                type = "Array";
                braces = [ "[", "]" ];
            } else {
                type = "Object";
                braces = [ "{", "}" ];
            }
            if ("function" == typeof value) {
                var n = value.name ? ": " + value.name : "";
                base = isRegExp(value) ? " " + value : " [Function" + n + "]";
            } else base = "";
            isDate(value) && (base = " " + value.toUTCString());
            if (0 === $keys.length) return braces[0] + base + braces[1];
            if (0 > recurseTimes) return isRegExp(value) ? stylize("" + value, "regexp") : stylize("[Object]", "special");
            seen.push(value);
            var output = map($keys, function(key) {
                var name, str;
                value.__lookupGetter__ && (value.__lookupGetter__(key) ? str = value.__lookupSetter__(key) ? stylize("[Getter/Setter]", "special") : stylize("[Getter]", "special") : value.__lookupSetter__(key) && (str = stylize("[Setter]", "special")));
                0 > indexOf(visible_keys, key) && (name = "[" + key + "]");
                if (!str) if (0 > indexOf(seen, value[key])) {
                    str = null === recurseTimes ? format(value[key]) : format(value[key], recurseTimes - 1);
                    str.indexOf("\n") > -1 && (str = isArray(value) ? map(str.split("\n"), function(line) {
                        return "  " + line;
                    }).join("\n").substr(2) : "\n" + map(str.split("\n"), function(line) {
                        return "   " + line;
                    }).join("\n"));
                } else str = stylize("[Circular]", "special");
                if ("undefined" == typeof name) {
                    if ("Array" === type && key.match(/^\d+$/)) return str;
                    name = json.stringify("" + key);
                    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                        name = name.substr(1, name.length - 2);
                        name = stylize(name, "name");
                    } else {
                        name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
                        name = stylize(name, "string");
                    }
                }
                return name + ": " + str;
            });
            seen.pop();
            var numLinesEst = 0;
            var length = reduce(output, function(prev, cur) {
                numLinesEst++;
                indexOf(cur, "\n") >= 0 && numLinesEst++;
                return prev + cur.length + 1;
            }, 0);
            output = length > 50 ? braces[0] + ("" === base ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1] : braces[0] + base + " " + output.join(", ") + " " + braces[1];
            return output;
        }
        var seen = [];
        return format(obj, "undefined" == typeof depth ? 2 : depth);
    }
    function isArray(ar) {
        return ar instanceof Array || "[object Array]" == Object.prototype.toString.call(ar);
    }
    function isRegExp(re) {
        var s = "" + re;
        return re instanceof RegExp || "function" == typeof re && "RegExp" === re.constructor.name && re.compile && re.test && re.exec && s.match(/^\/.*\/[gim]{0,3}$/);
    }
    function isDate(d) {
        if (d instanceof Date) return true;
        return false;
    }
    function keys(obj) {
        if (Object.keys) return Object.keys(obj);
        var keys = [];
        for (var i in obj) obj.hasOwnProperty(i) && keys.push(i);
        return keys;
    }
    function map(arr, mapper, that) {
        if (Array.prototype.map) return Array.prototype.map.call(arr, mapper, that);
        var other = new Array(arr.length);
        for (var i = 0, n = arr.length; n > i; i++) i in arr && (other[i] = mapper.call(that, arr[i], i, arr));
        return other;
    }
    function reduce(arr, fun) {
        if (Array.prototype.reduce) return Array.prototype.reduce.apply(arr, Array.prototype.slice.call(arguments, 1));
        var len = +this.length;
        if ("function" != typeof fun) throw new TypeError();
        if (0 === len && 1 === arguments.length) throw new TypeError();
        var i = 0;
        if (arguments.length >= 2) var rv = arguments[1]; else do {
            if (i in this) {
                rv = this[i++];
                break;
            }
            if (++i >= len) throw new TypeError();
        } while (true);
        for (;len > i; i++) i in this && (rv = fun.call(null, rv, this[i], i, this));
        return rv;
    }
    function isUndefinedOrNull(value) {
        return null === value || void 0 === value;
    }
    function isArguments(object) {
        return "[object Arguments]" == Object.prototype.toString.call(object);
    }
    function objEquiv(a, b) {
        if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) return false;
        if (a.prototype !== b.prototype) return false;
        if (isArguments(a)) {
            if (!isArguments(b)) return false;
            a = pSlice.call(a);
            b = pSlice.call(b);
            return should.eql(a, b);
        }
        try {
            var key, i, ka = keys(a), kb = keys(b);
        } catch (e) {
            return false;
        }
        if (ka.length != kb.length) return false;
        ka.sort();
        kb.sort();
        for (i = ka.length - 1; i >= 0; i--) if (ka[i] != kb[i]) return false;
        for (i = ka.length - 1; i >= 0; i--) {
            key = ka[i];
            if (!should.eql(a[key], b[key])) return false;
        }
        return true;
    }
    "undefined" != typeof exports && (module.exports = exports = should = require("assert"));
    should.Assertion = Assertion;
    var flags = {
        not: [ "be", "have", "include" ],
        an: [ "instance" ],
        and: [ "be", "have", "include", "an" ],
        be: [ "an" ],
        have: [ "an", "own" ],
        include: [ "an" ],
        not: [ "include", "have", "be" ],
        own: [],
        instance: []
    };
    "object" == typeof process ? Object.defineProperty(Object.prototype, "should", {
        get: function() {
            var self = this.valueOf(), fn = function() {
                return new Assertion(self);
            };
            if ("undefined" != typeof exports) {
                fn.__proto__ = exports;
                fn.exports = exports;
            }
            return fn;
        },
        enumerable: false
    }) : Object.prototype.should = function() {
        return new Assertion(this.valueOf());
    };
    Assertion.prototype.assert = function(truth, msg, error) {
        var msg = this.flags.not ? error : msg, ok = this.flags.not ? !truth : truth;
        if (!ok) throw new Error(msg);
        this.flags = {};
    };
    Assertion.prototype.be_true = function() {
        this.assert(true === this.obj, "expected " + i(this.obj) + " to be true", "expected " + i(this.obj) + " to not be true");
        return this;
    };
    Assertion.prototype.be_false = function() {
        this.assert(false === this.obj, "expected " + i(this.obj) + " to be false", "expected " + i(this.obj) + " to not be false");
        return this;
    };
    Assertion.prototype.ok = function() {
        this.assert(true == this.obj, "expected " + i(this.obj) + " to be true", "expected " + i(this.obj) + " to not be true");
    };
    Assertion.prototype.empty = function() {
        this.obj.should().have.property("length");
        this.assert(0 === this.obj.length, "expected " + i(this.obj) + " to be empty", "expected " + i(this.obj) + " to not be empty");
        return this;
    };
    Assertion.prototype.arguments = function() {
        this.assert("[object Arguments]" == Object.prototype.toString.call(this.obj), "expected " + i(this.obj) + " to be arguments", "expected " + i(this.obj) + " to not be arguments");
        return this;
    };
    Assertion.prototype.equal = function(obj) {
        this.assert(obj === this.obj, "expected " + i(this.obj) + " to equal " + i(obj), "expected " + i(this.obj) + " to not equal " + i(obj));
        return this;
    };
    Assertion.prototype.eql = function(obj) {
        this.assert(should.eql(obj, this.obj), "expected " + i(this.obj) + " to sort of equal " + i(obj), "expected " + i(this.obj) + " to sort of not equal " + i(obj));
        return this;
    };
    Assertion.prototype.within = function(start, finish) {
        var range = start + ".." + finish;
        this.assert(this.obj >= start && finish >= this.obj, "expected " + i(this.obj) + " to be within " + range, "expected " + i(this.obj) + " to not be within " + range);
        return this;
    };
    Assertion.prototype.a = function(type) {
        this.assert(type == typeof this.obj, "expected " + i(this.obj) + " to be a " + type, "expected " + i(this.obj) + " not to be a " + type);
        return this;
    };
    Assertion.prototype.of = function(constructor) {
        var name = constructor.name;
        this.assert(this.obj instanceof constructor, "expected " + i(this.obj) + " to be an instance of " + name, "expected " + i(this.obj) + " not to be an instance of " + name);
        return this;
    };
    Assertion.prototype.greaterThan = Assertion.prototype.above = function(n) {
        this.assert(this.obj > n, "expected " + i(this.obj) + " to be above " + n, "expected " + i(this.obj) + " to be below " + n);
        return this;
    };
    Assertion.prototype.lessThan = Assertion.prototype.below = function(n) {
        this.assert(n > this.obj, "expected " + i(this.obj) + " to be below " + n, "expected " + i(this.obj) + " to be above " + n);
        return this;
    };
    Assertion.prototype.match = function(regexp) {
        this.assert(regexp.exec(this.obj), "expected " + i(this.obj) + " to match " + regexp, "expected " + i(this.obj) + " not to match " + regexp);
        return this;
    };
    Assertion.prototype.length = function(n) {
        this.obj.should().have.property("length");
        var len = this.obj.length;
        this.assert(n == len, "expected " + i(this.obj) + " to have a length of " + n + " but got " + len, "expected " + i(this.obj) + " to not have a length of " + len);
        return this;
    };
    Assertion.prototype.string = function(str) {
        this.obj.should().be.a("string");
        this.assert(~this.obj.indexOf(str), "expected " + i(this.obj) + " to include " + i(str), "expected " + i(this.obj) + " to not include " + i(str));
        return this;
    };
    Assertion.prototype.object = function(obj) {
        this.obj.should().be.a("object");
        var included = true;
        for (var key in obj) if (obj.hasOwnProperty(key) && !should.eql(obj[key], this.obj[key])) {
            included = false;
            break;
        }
        this.assert(included, "expected " + i(this.obj) + " to include " + i(obj), "expected " + i(this.obj) + " to not include " + i(obj));
        return this;
    };
    Assertion.prototype.property = function(name, val) {
        if (this.flags.own) {
            this.assert(this.obj.hasOwnProperty(name), "expected " + i(this.obj) + " to have own property " + i(name), "expected " + i(this.obj) + " to not have own property " + i(name));
            return this;
        }
        if (this.flags.not && void 0 !== val) {
            if (void 0 === this.obj[name]) throw new Error(i(this.obj) + " has no property " + i(name));
        } else this.assert(void 0 !== this.obj[name], "expected " + i(this.obj) + " to have a property " + i(name), "expected " + i(this.obj) + " to not have a property " + i(name));
        void 0 !== val && this.assert(val === this.obj[name], "expected " + i(this.obj) + " to have a property " + i(name) + " of " + i(val) + ", but got " + i(this.obj[name]), "expected " + i(this.obj) + " to not have a property " + i(name) + " of " + i(val));
        this.obj = this.obj[name];
        return this;
    };
    Assertion.prototype.contain = function(obj) {
        this.obj.should().be.an.instance.of(Array);
        this.assert(~indexOf(this.obj, obj), "expected " + i(this.obj) + " to contain " + i(obj), "expected " + i(this.obj) + " to not contain " + i(obj));
        return this;
    };
    Assertion.prototype.key = Assertion.prototype.keys = function(keys) {
        var str, ok = true;
        keys = keys instanceof Array ? keys : Array.prototype.slice.call(arguments);
        if (!keys.length) throw new Error("keys required");
        var actual = keys(this.obj), len = keys.length;
        ok = every(keys, function(key) {
            return ~indexOf(actual, key);
        });
        this.flags.not || this.flags.include || (ok = ok && keys.length == actual.length);
        if (len > 1) {
            keys = map(keys, function(key) {
                return i(key);
            });
            var last = keys.pop();
            str = keys.join(", ") + ", and " + last;
        } else str = i(keys[0]);
        str = (len > 1 ? "keys " : "key ") + str;
        str = (this.flag.include ? "include " : "have ") + str;
        this.assert(ok, "expected " + i(this.obj) + " to " + str, "expected " + i(this.obj) + " to not " + str);
        return this;
    };
    FlaggedAssertion.prototype = new Assertion();
    should.equal = function(a, b) {
        a !== b && should.fail("expected " + i(a) + " to equal " + i(b));
    };
    should.fail = function(msg) {
        throw new Error(msg);
    };
    should.eql = function eql(actual, expected) {
        if (actual === expected) return true;
        if ("undefined" != typeof Buffer && Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
            if (actual.length != expected.length) return false;
            for (var i = 0; actual.length > i; i++) if (actual[i] !== expected[i]) return false;
            return true;
        }
        return actual instanceof Date && expected instanceof Date ? actual.getTime() === expected.getTime() : "object" != typeof actual && "object" != typeof expected ? actual == expected : objEquiv(actual, expected);
    };
    var json = function() {
        "use strict";
        function f(n) {
            return 10 > n ? "0" + n : n;
        }
        function date(d) {
            return isFinite(d.valueOf()) ? d.getUTCFullYear() + "-" + f(d.getUTCMonth() + 1) + "-" + f(d.getUTCDate()) + "T" + f(d.getUTCHours()) + ":" + f(d.getUTCMinutes()) + ":" + f(d.getUTCSeconds()) + "Z" : null;
        }
        function quote(string) {
            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
                var c = meta[a];
                return "string" == typeof c ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        }
        function str(key, holder) {
            var i, k, v, length, partial, mind = gap, value = holder[key];
            value instanceof Date && (value = date(key));
            "function" == typeof rep && (value = rep.call(holder, key, value));
            switch (typeof value) {
              case "string":
                return quote(value);

              case "number":
                return isFinite(value) ? String(value) : "null";

              case "boolean":
              case "null":
                return String(value);

              case "object":
                if (!value) return "null";
                gap += indent;
                partial = [];
                if ("[object Array]" === Object.prototype.toString.apply(value)) {
                    length = value.length;
                    for (i = 0; length > i; i += 1) partial[i] = str(i, value) || "null";
                    v = 0 === partial.length ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                    gap = mind;
                    return v;
                }
                if (rep && "object" == typeof rep) {
                    length = rep.length;
                    for (i = 0; length > i; i += 1) if ("string" == typeof rep[i]) {
                        k = rep[i];
                        v = str(k, value);
                        v && partial.push(quote(k) + (gap ? ": " : ":") + v);
                    }
                } else for (k in value) if (Object.prototype.hasOwnProperty.call(value, k)) {
                    v = str(k, value);
                    v && partial.push(quote(k) + (gap ? ": " : ":") + v);
                }
                v = 0 === partial.length ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
                gap = mind;
                return v;
            }
        }
        if ("object" == typeof JSON && JSON.parse && JSON.stringify) return {
            parse: nativeJSON.parse,
            stringify: nativeJSON.stringify
        };
        var JSON = {};
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
            "\b": "\\b",
            "	": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        }, rep;
        JSON.stringify = function(value, replacer, space) {
            var i;
            gap = "";
            indent = "";
            if ("number" == typeof space) for (i = 0; space > i; i += 1) indent += " "; else "string" == typeof space && (indent = space);
            rep = replacer;
            if (replacer && "function" != typeof replacer && ("object" != typeof replacer || "number" != typeof replacer.length)) throw new Error("JSON.stringify");
            return str("", {
                "": value
            });
        };
        JSON.parse = function(text, reviver) {
            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && "object" == typeof value) for (k in value) if (Object.prototype.hasOwnProperty.call(value, k)) {
                    v = walk(value, k);
                    void 0 !== v ? value[k] = v : delete value[k];
                }
                return reviver.call(holder, key, value);
            }
            var j;
            text = String(text);
            cx.lastIndex = 0;
            cx.test(text) && (text = text.replace(cx, function(a) {
                return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }));
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                j = eval("(" + text + ")");
                return "function" == typeof reviver ? walk({
                    "": j
                }, "") : j;
            }
            throw new SyntaxError("JSON.parse");
        };
        return JSON;
    }();
})("undefined" != typeof exports ? exports : should = {});