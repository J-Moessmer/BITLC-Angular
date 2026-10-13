'use strict';
/**
 * @license Angular
 * (c) 2010-2026 Google LLC. https://angular.dev/
 * License: MIT
 */

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
  Zone2.__load_patch("vitest", (context, Zone3) => {
    const vitestGlobal = context["vitest"];
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
    const rootZone = Zone3.current;
    const syncZone = rootZone.fork(new Zone3.SyncTestZoneSpec("vitest.describe"));
    const proxyZone = rootZone.fork(new Zone3.ProxyZoneSpec());
    function wrapDescribeInZone(describeBody) {
      if (typeof describeBody !== "function") {
        return describeBody;
      }
      return function(...args) {
        return syncZone.run(describeBody, this, args);
      };
    }
    function wrapTestInZone(testBody) {
      if (typeof testBody !== "function") {
        return testBody;
      }
      const wrappedFunc = function() {
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
      const originalVitestFn = context[methodName];
      if (context[Zone3.__symbol__(methodName)]) {
        return;
      }
      context[Zone3.__symbol__(methodName)] = originalVitestFn;
      context[methodName] = function(...args) {
        args[1] = wrapFn(args[1]);
        return originalVitestFn.apply(this, args);
      };
      for (const modifierName of DIRECT_MODIFIER_NAMES) {
        context[methodName][modifierName] = function(...args) {
          args[1] = wrapFn(args[1]);
          return originalVitestFn[modifierName].apply(this, args);
        };
      }
      for (const modifierName of CURRIED_MODIFIER_NAMES) {
        context[methodName][modifierName] = function(...modifierArgs) {
          const originalFn = originalVitestFn[modifierName].apply(originalVitestFn, modifierArgs);
          return function(...args) {
            args[1] = wrapFn(args[1]);
            return originalFn.apply(this, args);
          };
        };
      }
    }
    ["suite", "describe"].forEach((methodName) => patchFnWithModifiers(methodName, wrapDescribeInZone));
    ["it", "test"].forEach((methodName) => patchFnWithModifiers(methodName, wrapTestInZone));
    ["beforeEach", "afterEach", "beforeAll", "afterAll"].forEach((methodName) => {
      const originalVitestFn = context[methodName];
      if (context[Zone3.__symbol__(methodName)]) {
        return;
      }
      context[Zone3.__symbol__(methodName)] = originalVitestFn;
      context[methodName] = function(...args) {
        args[0] = wrapTestInZone(args[0]);
        return originalVitestFn.apply(this, args);
      };
    });
  });
}

// packages/zone.js/lib/vitest/rollup-vitest.js
patchVitest(Zone);
