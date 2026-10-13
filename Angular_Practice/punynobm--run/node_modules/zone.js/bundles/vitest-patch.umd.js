'use strict';
/**
 * @license Angular
 * (c) 2010-2026 Google LLC. https://angular.dev/
 * License: MIT
 */ (function (g, f) { if (typeof define == "function" && define.amd) {
    define(f);
}
else if (typeof exports == "object" && typeof module < "u") {
    module.exports = f();
}
else {
    var m = f();
    for (var i in m)
        g[i] = m[i];
} }(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : this, function () {
    var exports = {};
    var __exports = exports;
    var module = { exports: exports };
    // packages/zone.js/lib/vitest/vitest.js
    var DIRECT_MODIFIER_NAMES = [
        "skip",
        "only",
        "concurrent",
        "sequential",
        "shuffle",
        "todo"
    ];
    var CURRIED_MODIFIER_NAMES = ["skipIf", "runIf", "each", "for"];
    function patchVitest(Zone2) {
        Zone2.__load_patch("vitest", function (context, Zone3) {
            var vitestGlobal = context["vitest"];
            if (typeof vitestGlobal === "undefined" || vitestGlobal["__zone_patch__"]) {
                return;
            }
            vitestGlobal["__zone_patch__"] = true;
            if (!Zone3.ProxyZoneSpec) {
                throw new Error("Missing ProxyZoneSpec");
            }
            if (!Zone3.SyncTestZoneSpec) {
                throw new Error("Missing SyncTestZoneSpec");
            }
            var rootZone = Zone3.current;
            var syncZone = rootZone.fork(new Zone3.SyncTestZoneSpec("vitest.describe"));
            var proxyZone = rootZone.fork(new Zone3.ProxyZoneSpec());
            function wrapDescribeInZone(describeBody) {
                if (typeof describeBody !== "function") {
                    return describeBody;
                }
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return syncZone.run(describeBody, this, args);
                };
            }
            function wrapTestInZone(testBody) {
                if (typeof testBody !== "function") {
                    return testBody;
                }
                var wrappedFunc = function () {
                    return proxyZone.run(testBody, null, arguments);
                };
                Object.defineProperty(wrappedFunc, "length", {
                    configurable: true,
                    writable: true,
                    enumerable: false
                });
                wrappedFunc.length = testBody.length;
                return wrappedFunc;
            }
            function patchFnWithModifiers(methodName, wrapFn) {
                var originalVitestFn = context[methodName];
                if (context[Zone3.__symbol__(methodName)]) {
                    return;
                }
                context[Zone3.__symbol__(methodName)] = originalVitestFn;
                context[methodName] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    args[1] = wrapFn(args[1]);
                    return originalVitestFn.apply(this, args);
                };
                var _loop_1 = function (modifierName) {
                    context[methodName][modifierName] = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        args[1] = wrapFn(args[1]);
                        return originalVitestFn[modifierName].apply(this, args);
                    };
                };
                for (var _i = 0, DIRECT_MODIFIER_NAMES_1 = DIRECT_MODIFIER_NAMES; _i < DIRECT_MODIFIER_NAMES_1.length; _i++) {
                    var modifierName = DIRECT_MODIFIER_NAMES_1[_i];
                    _loop_1(modifierName);
                }
                var _loop_2 = function (modifierName) {
                    context[methodName][modifierName] = function () {
                        var modifierArgs = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            modifierArgs[_i] = arguments[_i];
                        }
                        var originalFn = originalVitestFn[modifierName].apply(originalVitestFn, modifierArgs);
                        return function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            args[1] = wrapFn(args[1]);
                            return originalFn.apply(this, args);
                        };
                    };
                };
                for (var _a = 0, CURRIED_MODIFIER_NAMES_1 = CURRIED_MODIFIER_NAMES; _a < CURRIED_MODIFIER_NAMES_1.length; _a++) {
                    var modifierName = CURRIED_MODIFIER_NAMES_1[_a];
                    _loop_2(modifierName);
                }
            }
            ["suite", "describe"].forEach(function (methodName) { return patchFnWithModifiers(methodName, wrapDescribeInZone); });
            ["it", "test"].forEach(function (methodName) { return patchFnWithModifiers(methodName, wrapTestInZone); });
            ["beforeEach", "afterEach", "beforeAll", "afterAll"].forEach(function (methodName) {
                var originalVitestFn = context[methodName];
                if (context[Zone3.__symbol__(methodName)]) {
                    return;
                }
                context[Zone3.__symbol__(methodName)] = originalVitestFn;
                context[methodName] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    args[0] = wrapTestInZone(args[0]);
                    return originalVitestFn.apply(this, args);
                };
            });
        });
    }
    // packages/zone.js/lib/vitest/rollup-vitest.js
    patchVitest(Zone);
    if (__exports != exports)
        module.exports = exports;
    return module.exports;
}));
