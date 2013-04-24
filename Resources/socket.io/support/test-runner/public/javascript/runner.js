function load(test, fn) {
    module = {};
    $script("/test/" + test, function() {
        fn(module.exports);
    });
}

function run() {
    function complete() {
        $("body").append("<p>All suites completed</p>");
    }
    var tests = Array.prototype.slice.call(arguments), i = 0;
    if (tests.length) {
        testsList = $('<ul class="test-list">');
        $("body").append(testsList);
        suite(tests[i], function check() {
            tests[++i] ? suite(tests[i], check) : complete();
        });
    } else complete();
}

function keys(obj) {
    if (Object.keys) return Object.keys(obj);
    var keys = [];
    for (var i in obj) obj.hasOwnProperty(i) && keys.push(i);
    return keys;
}

function suite(file, fn) {
    var passed = {}, failed = {};
    currentSuite = file;
    var li = $('<li class="loading">').append($('<span class="name">').append($("<a>").attr("href", "/test/" + file).text(file))).appendTo(testsList);
    load(file, function(suite) {
        function complete() {
            var ok = !keys(failed).length, elapsed = Math.round((new Date() - start) / 1e3);
            li.removeClass("loading");
            li.append('<span class="bullet">&bull;</span>');
            if (ok) li.append(" all passed"); else {
                li.append(" failing test");
                li.addClass("test-failure");
            }
            li.append($('<div class="details">').html("Passed: " + keys(passed).length + " &mdash; Failed: <em>" + keys(failed).length + "</em> &mdash; Elapsed: <em>" + elapsed + "</em> seconds &mdash; ").append($("<a>Show details</a>").attr("href", "#").click(function() {
                li.toggleClass("cases");
                $(this).text(li.hasClass("cases") ? "Hide details" : "Show details");
                return false;
            })));
            var casesUl = $('<ul class="cases">').appendTo(li);
            for (var i = 0, l = cases.length; l > i; i++) {
                var detail = $("<li>").text(cases[i]).addClass(failed[cases[i]] ? "failed" : "").appendTo(casesUl);
                if (failed[cases[i]]) {
                    window.console && console.log && console.log(failed[cases[i]]);
                    detail.append($('<span class="error">').text(String(failed[cases[i]])));
                }
            }
            fn({
                status: ok,
                passed: passed,
                failed: failed
            });
        }
        if (!suite) return;
        var start = new Date();
        var cases = keys(suite), i = 0;
        if (!cases.length) return complete();
        currentCase = cases[i];
        test(suite[cases[i]], function check(err) {
            err ? failed[cases[i]] = err : passed[cases[i]] = true;
            if (cases[++i]) {
                currentCase = cases[i];
                test(suite[cases[i]], check);
            } else complete();
        });
    });
}

function test(testcase, fn) {
    function complete(err) {
        if (complete.run) return;
        timer && clearTimeout(timer);
        complete.run = true;
        window.onerror = null;
        fn(err);
    }
    var timer;
    window.onerror = function(err) {
        complete(err);
    };
    try {
        if (testcase.length > 0) {
            var timer = setTimeout(function() {
                complete(new Error("Timeout"));
            }, 2e3);
            testcase(complete);
        } else {
            testcase();
            complete();
        }
    } catch (e) {
        complete(e);
    }
}

function create(nsp) {
    if (!testsPorts[currentSuite]) throw new Error('No socket server defined for suite "' + currentSuite + '"');
    if (!testsPorts[currentSuite][currentCase]) throw new Error('No socket server defined for suite "' + currentSuite + '" and case "' + currentCase + '"');
    return io.connect(uri() + (nsp || ""));
}

function uri() {
    return document.location.protocol + "//" + document.location.hostname + ":" + testsPorts[currentSuite][currentCase];
}

var currentSuite, currentCase, testsList;