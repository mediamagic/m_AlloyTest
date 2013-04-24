function handler(req, res) {
    fs.readFile(__dirname + "/../../dist/socket.io.js", "utf8", function(err, b) {
        if (err) {
            res.writeHead(404);
            res.end("Error");
            return;
        }
        res.writeHead(200, {
            "Content-Type": "application/javascript"
        });
        res.end(b);
    });
}

function suite(name, fn) {
    currentSuite = testsPorts[name] = {};
    fn();
}

function server(name, fn) {
    currentSuite[name] = port;
    var io = sio.listen(port);
    io.configure(function() {
        io.set("transports", [ transport ]);
    });
    fn(io);
    port++;
}

var express = require("express"), stylus = require("stylus"), sio = require("socket.io"), path = require("path"), fs = require("fs");

var app = express.createServer();

var port = 3e3;

var args = process.argv.slice(2), transport = args.length ? args[0] : "xhr-polling";

var testsPorts = {};

app.configure(function() {
    app.use(stylus.middleware({
        src: __dirname + "/public"
    }));
    app.use(express.static(__dirname + "/public"));
    app.use("/test", express.static(__dirname + "/../../test"));
    app.set("views", __dirname);
    app.set("view engine", "jade");
});

app.get("/", function(req, res) {
    res.render("index", {
        layout: false,
        testsPorts: testsPorts,
        transport: transport
    });
});

app.listen(port++, function() {
    var addr = app.address();
    console.error("   listening on http://" + addr.address + ":" + addr.port);
});

var io = sio.listen(app);

io.configure(function() {
    io.set("browser client handler", handler);
    io.set("transports", [ transport ]);
});

var currentSuite;

suite("socket.test.js", function() {
    server("test connecting the socket and disconnecting", function(io) {
        io.sockets.on("connection", function() {});
    });
    server("test receiving messages", function(io) {
        io.sockets.on("connection", function(socket) {
            var messages = 0;
            var interval = setInterval(function() {
                socket.send(++messages);
                if (3 == messages) {
                    clearInterval(interval);
                    setTimeout(function() {
                        socket.disconnect();
                    }, 500);
                }
            }, 50);
        });
    });
    server("test sending messages", function(io) {
        io.sockets.on("connection", function(socket) {
            socket.on("message", function(msg) {
                socket.send(msg);
            });
        });
    });
    server("test acks sent from client", function(io) {
        io.sockets.on("connection", function(socket) {
            socket.send("tobi", function() {
                socket.send("tobi 2");
            });
        });
    });
    server("test acks sent from server", function(io) {
        io.sockets.on("connection", function() {});
    });
    server("test connecting to namespaces", function(io) {
        io.of("/woot").on("connection", function(socket) {
            socket.send("connected to woot");
        });
        io.of("/chat").on("connection", function(socket) {
            socket.send("connected to chat");
        });
    });
    server("test disconnecting from namespaces", function(io) {
        io.of("/a").on("connection", function() {});
        io.of("/b").on("connection", function() {});
    });
    server("test authorizing for namespaces", function(io) {
        io.of("/a").authorization(function(data, fn) {
            fn(null, false);
        }).on("connection", function() {});
    });
    server("test sending json from server", function(io) {
        io.sockets.on("connection", function() {
            io.sockets.json.send(3141592);
        });
    });
    server("test sending json from client", function(io) {
        io.sockets.on("connection", function(socket) {
            socket.on("message", function(arr) {
                Array.isArray(arr) && 3 == arr.length && socket.send("echo");
            });
        });
    });
    server("test emitting an event from server", function(io) {
        io.sockets.on("connection", function(socket) {
            socket.emit("woot");
        });
    });
    server("test emitting multiple events at once to the server", function(io) {
        io.sockets.on("connection", function(socket) {
            var messages = [];
            socket.on("print", function(msg) {
                messages.indexOf(msg) >= 0 && console.error("duplicate message");
                messages.push(msg);
                2 == messages.length && socket.emit("done");
            });
        });
    });
    server("test emitting an event to server", function(io) {
        io.sockets.on("connection", function(socket) {
            socket.on("woot", function() {
                socket.emit("echo");
            });
        });
    });
    server("test emitting an event from server and sending back data", function(io) {
        io.sockets.on("connection", function(socket) {
            socket.emit("woot", 1, function(a) {
                "test" === a && socket.emit("done");
            });
        });
    });
    server("test emitting an event to server and sending back data", function(io) {
        io.sockets.on("connection", function(socket) {
            socket.on("tobi", function(a, b, fn) {
                1 === a && 2 === b && fn({
                    hello: "world"
                });
            });
        });
    });
    server("test encoding a payload", function(io) {
        io.of("/woot").on("connection", function(socket) {
            var count = 0;
            socket.on("message", function(a) {
                "ñ" == a && 4 == ++count && socket.emit("done");
            });
        });
    });
    server("test sending query strings to the server", function(io) {
        io.sockets.on("connection", function(socket) {
            socket.json.send(socket.handshake);
        });
    });
    server("test sending newline", function(io) {
        io.sockets.on("connection", function(socket) {
            socket.on("message", function(msg) {
                "\n" == msg && socket.emit("done");
            });
        });
    });
    server("test sending unicode", function(io) {
        io.sockets.on("connection", function(socket) {
            socket.on("message", function(msg) {
                "☃" == msg.test && socket.emit("done");
            });
        });
    });
    server("test webworker connection", function(io) {
        io.sockets.on("connection", function(socket) {
            socket.on("message", function(msg) {
                "woot" == msg && socket.emit("done");
            });
        });
    });
});