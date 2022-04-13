(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.window = global.window || {}));
}(this, (function (exports) { 'use strict';

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  /*!
   * GSAP 3.10.2
   * https://greensock.com
   *
   * @license Copyright 2008-2022, GreenSock. All rights reserved.
   * Subject to the terms at https://greensock.com/standard-license or for
   * Club GreenSock members, the agreement issued with that membership.
   * @author: Jack Doyle, jack@greensock.com
  */
  var _config = {
    autoSleep: 120,
    force3D: "auto",
    nullTargetWarn: 1,
    units: {
      lineHeight: ""
    }
  },
      _defaults = {
    duration: .5,
    overwrite: false,
    delay: 0
  },
      _suppressOverwrites,
      _bigNum = 1e8,
      _tinyNum = 1 / _bigNum,
      _2PI = Math.PI * 2,
      _HALF_PI = _2PI / 4,
      _gsID = 0,
      _sqrt = Math.sqrt,
      _cos = Math.cos,
      _sin = Math.sin,
      _isString = function _isString(value) {
    return typeof value === "string";
  },
      _isFunction = function _isFunction(value) {
    return typeof value === "function";
  },
      _isNumber = function _isNumber(value) {
    return typeof value === "number";
  },
      _isUndefined = function _isUndefined(value) {
    return typeof value === "undefined";
  },
      _isObject = function _isObject(value) {
    return typeof value === "object";
  },
      _isNotFalse = function _isNotFalse(value) {
    return value !== false;
  },
      _windowExists = function _windowExists() {
    return typeof window !== "undefined";
  },
      _isFuncOrString = function _isFuncOrString(value) {
    return _isFunction(value) || _isString(value);
  },
      _isTypedArray = typeof ArrayBuffer === "function" && ArrayBuffer.isView || function () {},
      _isArray = Array.isArray,
      _strictNumExp = /(?:-?\.?\d|\.)+/gi,
      _numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,
      _numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g,
      _complexStringNumExp = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,
      _relExp = /[+-]=-?[.\d]+/,
      _delimitedValueExp = /[^,'"\[\]\s]+/gi,
      _unitExp = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,
      _globalTimeline,
      _win,
      _coreInitted,
      _doc,
      _globals = {},
      _installScope = {},
      _coreReady,
      _install = function _install(scope) {
    return (_installScope = _merge(scope, _globals)) && gsap;
  },
      _missingPlugin = function _missingPlugin(property, value) {
    return console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()");
  },
      _warn = function _warn(message, suppress) {
    return !suppress && console.warn(message);
  },
      _addGlobal = function _addGlobal(name, obj) {
    return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals;
  },
      _emptyFunc = function _emptyFunc() {
    return 0;
  },
      _reservedProps = {},
      _lazyTweens = [],
      _lazyLookup = {},
      _lastRenderedFrame,
      _plugins = {},
      _effects = {},
      _nextGCFrame = 30,
      _harnessPlugins = [],
      _callbackNames = "",
      _harness = function _harness(targets) {
    var target = targets[0],
        harnessPlugin,
        i;
    _isObject(target) || _isFunction(target) || (targets = [targets]);

    if (!(harnessPlugin = (target._gsap || {}).harness)) {
      i = _harnessPlugins.length;

      while (i-- && !_harnessPlugins[i].targetTest(target)) {}

      harnessPlugin = _harnessPlugins[i];
    }

    i = targets.length;

    while (i--) {
      targets[i] && (targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin))) || targets.splice(i, 1);
    }

    return targets;
  },
      _getCache = function _getCache(target) {
    return target._gsap || _harness(toArray(target))[0]._gsap;
  },
      _getProperty = function _getProperty(target, property, v) {
    return (v = target[property]) && _isFunction(v) ? target[property]() : _isUndefined(v) && target.getAttribute && target.getAttribute(property) || v;
  },
      _forEachName = function _forEachName(names, func) {
    return (names = names.split(",")).forEach(func) || names;
  },
      _round = function _round(value) {
    return Math.round(value * 100000) / 100000 || 0;
  },
      _roundPrecise = function _roundPrecise(value) {
    return Math.round(value * 10000000) / 10000000 || 0;
  },
      _parseRelative = function _parseRelative(start, value) {
    var operator = value.charAt(0),
        end = parseFloat(value.substr(2));
    start = parseFloat(start);
    return operator === "+" ? start + end : operator === "-" ? start - end : operator === "*" ? start * end : start / end;
  },
      _arrayContainsAny = function _arrayContainsAny(toSearch, toFind) {
    var l = toFind.length,
        i = 0;

    for (; toSearch.indexOf(toFind[i]) < 0 && ++i < l;) {}

    return i < l;
  },
      _lazyRender = function _lazyRender() {
    var l = _lazyTweens.length,
        a = _lazyTweens.slice(0),
        i,
        tween;

    _lazyLookup = {};
    _lazyTweens.length = 0;

    for (i = 0; i < l; i++) {
      tween = a[i];
      tween && tween._lazy && (tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0);
    }
  },
      _lazySafeRender = function _lazySafeRender(animation, time, suppressEvents, force) {
    _lazyTweens.length && _lazyRender();
    animation.render(time, suppressEvents, force);
    _lazyTweens.length && _lazyRender();
  },
      _numericIfPossible = function _numericIfPossible(value) {
    var n = parseFloat(value);
    return (n || n === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n : _isString(value) ? value.trim() : value;
  },
      _passThrough = function _passThrough(p) {
    return p;
  },
      _setDefaults = function _setDefaults(obj, defaults) {
    for (var p in defaults) {
      p in obj || (obj[p] = defaults[p]);
    }

    return obj;
  },
      _setKeyframeDefaults = function _setKeyframeDefaults(excludeDuration) {
    return function (obj, defaults) {
      for (var p in defaults) {
        p in obj || p === "duration" && excludeDuration || p === "ease" || (obj[p] = defaults[p]);
      }
    };
  },
      _merge = function _merge(base, toMerge) {
    for (var p in toMerge) {
      base[p] = toMerge[p];
    }

    return base;
  },
      _mergeDeep = function _mergeDeep(base, toMerge) {
    for (var p in toMerge) {
      p !== "__proto__" && p !== "constructor" && p !== "prototype" && (base[p] = _isObject(toMerge[p]) ? _mergeDeep(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p]);
    }

    return base;
  },
      _copyExcluding = function _copyExcluding(obj, excluding) {
    var copy = {},
        p;

    for (p in obj) {
      p in excluding || (copy[p] = obj[p]);
    }

    return copy;
  },
      _inheritDefaults = function _inheritDefaults(vars) {
    var parent = vars.parent || _globalTimeline,
        func = vars.keyframes ? _setKeyframeDefaults(_isArray(vars.keyframes)) : _setDefaults;

    if (_isNotFalse(vars.inherit)) {
      while (parent) {
        func(vars, parent.vars.defaults);
        parent = parent.parent || parent._dp;
      }
    }

    return vars;
  },
      _arraysMatch = function _arraysMatch(a1, a2) {
    var i = a1.length,
        match = i === a2.length;

    while (match && i-- && a1[i] === a2[i]) {}

    return i < 0;
  },
      _addLinkedListItem = function _addLinkedListItem(parent, child, firstProp, lastProp, sortBy) {
    if (firstProp === void 0) {
      firstProp = "_first";
    }

    if (lastProp === void 0) {
      lastProp = "_last";
    }

    var prev = parent[lastProp],
        t;

    if (sortBy) {
      t = child[sortBy];

      while (prev && prev[sortBy] > t) {
        prev = prev._prev;
      }
    }

    if (prev) {
      child._next = prev._next;
      prev._next = child;
    } else {
      child._next = parent[firstProp];
      parent[firstProp] = child;
    }

    if (child._next) {
      child._next._prev = child;
    } else {
      parent[lastProp] = child;
    }

    child._prev = prev;
    child.parent = child._dp = parent;
    return child;
  },
      _removeLinkedListItem = function _removeLinkedListItem(parent, child, firstProp, lastProp) {
    if (firstProp === void 0) {
      firstProp = "_first";
    }

    if (lastProp === void 0) {
      lastProp = "_last";
    }

    var prev = child._prev,
        next = child._next;

    if (prev) {
      prev._next = next;
    } else if (parent[firstProp] === child) {
      parent[firstProp] = next;
    }

    if (next) {
      next._prev = prev;
    } else if (parent[lastProp] === child) {
      parent[lastProp] = prev;
    }

    child._next = child._prev = child.parent = null;
  },
      _removeFromParent = function _removeFromParent(child, onlyIfParentHasAutoRemove) {
    child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren) && child.parent.remove(child);
    child._act = 0;
  },
      _uncache = function _uncache(animation, child) {
    if (animation && (!child || child._end > animation._dur || child._start < 0)) {
      var a = animation;

      while (a) {
        a._dirty = 1;
        a = a.parent;
      }
    }

    return animation;
  },
      _recacheAncestors = function _recacheAncestors(animation) {
    var parent = animation.parent;

    while (parent && parent.parent) {
      parent._dirty = 1;
      parent.totalDuration();
      parent = parent.parent;
    }

    return animation;
  },
      _hasNoPausedAncestors = function _hasNoPausedAncestors(animation) {
    return !animation || animation._ts && _hasNoPausedAncestors(animation.parent);
  },
      _elapsedCycleDuration = function _elapsedCycleDuration(animation) {
    return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0;
  },
      _animationCycle = function _animationCycle(tTime, cycleDuration) {
    var whole = Math.floor(tTime /= cycleDuration);
    return tTime && whole === tTime ? whole - 1 : whole;
  },
      _parentToChildTotalTime = function _parentToChildTotalTime(parentTime, child) {
    return (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur);
  },
      _setEnd = function _setEnd(animation) {
    return animation._end = _roundPrecise(animation._start + (animation._tDur / Math.abs(animation._ts || animation._rts || _tinyNum) || 0));
  },
      _alignPlayhead = function _alignPlayhead(animation, totalTime) {
    var parent = animation._dp;

    if (parent && parent.smoothChildTiming && animation._ts) {
      animation._start = _roundPrecise(parent._time - (animation._ts > 0 ? totalTime / animation._ts : ((animation._dirty ? animation.totalDuration() : animation._tDur) - totalTime) / -animation._ts));

      _setEnd(animation);

      parent._dirty || _uncache(parent, animation);
    }

    return animation;
  },
      _postAddChecks = function _postAddChecks(timeline, child) {
    var t;

    if (child._time || child._initted && !child._dur) {
      t = _parentToChildTotalTime(timeline.rawTime(), child);

      if (!child._dur || _clamp(0, child.totalDuration(), t) - child._tTime > _tinyNum) {
        child.render(t, true);
      }
    }

    if (_uncache(timeline, child)._dp && timeline._initted && timeline._time >= timeline._dur && timeline._ts) {
      if (timeline._dur < timeline.duration()) {
        t = timeline;

        while (t._dp) {
          t.rawTime() >= 0 && t.totalTime(t._tTime);
          t = t._dp;
        }
      }

      timeline._zTime = -_tinyNum;
    }
  },
      _addToTimeline = function _addToTimeline(timeline, child, position, skipChecks) {
    child.parent && _removeFromParent(child);
    child._start = _roundPrecise((_isNumber(position) ? position : position || timeline !== _globalTimeline ? _parsePosition(timeline, position, child) : timeline._time) + child._delay);
    child._end = _roundPrecise(child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0));

    _addLinkedListItem(timeline, child, "_first", "_last", timeline._sort ? "_start" : 0);

    _isFromOrFromStart(child) || (timeline._recent = child);
    skipChecks || _postAddChecks(timeline, child);
    return timeline;
  },
      _scrollTrigger = function _scrollTrigger(animation, trigger) {
    return (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", trigger)) && _globals.ScrollTrigger.create(trigger, animation);
  },
      _attemptInitTween = function _attemptInitTween(tween, totalTime, force, suppressEvents) {
    _initTween(tween, totalTime);

    if (!tween._initted) {
      return 1;
    }

    if (!force && tween._pt && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
      _lazyTweens.push(tween);

      tween._lazy = [totalTime, suppressEvents];
      return 1;
    }
  },
      _parentPlayheadIsBeforeStart = function _parentPlayheadIsBeforeStart(_ref) {
    var parent = _ref.parent;
    return parent && parent._ts && parent._initted && !parent._lock && (parent.rawTime() < 0 || _parentPlayheadIsBeforeStart(parent));
  },
      _isFromOrFromStart = function _isFromOrFromStart(_ref2) {
    var data = _ref2.data;
    return data === "isFromStart" || data === "isStart";
  },
      _renderZeroDurationTween = function _renderZeroDurationTween(tween, totalTime, suppressEvents, force) {
    var prevRatio = tween.ratio,
        ratio = totalTime < 0 || !totalTime && (!tween._start && _parentPlayheadIsBeforeStart(tween) && !(!tween._initted && _isFromOrFromStart(tween)) || (tween._ts < 0 || tween._dp._ts < 0) && !_isFromOrFromStart(tween)) ? 0 : 1,
        repeatDelay = tween._rDelay,
        tTime = 0,
        pt,
        iteration,
        prevIteration;

    if (repeatDelay && tween._repeat) {
      tTime = _clamp(0, tween._tDur, totalTime);
      iteration = _animationCycle(tTime, repeatDelay);
      tween._yoyo && iteration & 1 && (ratio = 1 - ratio);

      if (iteration !== _animationCycle(tween._tTime, repeatDelay)) {
        prevRatio = 1 - ratio;
        tween.vars.repeatRefresh && tween._initted && tween.invalidate();
      }
    }

    if (ratio !== prevRatio || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
      if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents)) {
        return;
      }

      prevIteration = tween._zTime;
      tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0);
      suppressEvents || (suppressEvents = totalTime && !prevIteration);
      tween.ratio = ratio;
      tween._from && (ratio = 1 - ratio);
      tween._time = 0;
      tween._tTime = tTime;
      pt = tween._pt;

      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }

      tween._startAt && totalTime < 0 && tween._startAt.render(totalTime, true, true);
      tween._onUpdate && !suppressEvents && _callback(tween, "onUpdate");
      tTime && tween._repeat && !suppressEvents && tween.parent && _callback(tween, "onRepeat");

      if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
        ratio && _removeFromParent(tween, 1);

        if (!suppressEvents) {
          _callback(tween, ratio ? "onComplete" : "onReverseComplete", true);

          tween._prom && tween._prom();
        }
      }
    } else if (!tween._zTime) {
      tween._zTime = totalTime;
    }
  },
      _findNextPauseTween = function _findNextPauseTween(animation, prevTime, time) {
    var child;

    if (time > prevTime) {
      child = animation._first;

      while (child && child._start <= time) {
        if (child.data === "isPause" && child._start > prevTime) {
          return child;
        }

        child = child._next;
      }
    } else {
      child = animation._last;

      while (child && child._start >= time) {
        if (child.data === "isPause" && child._start < prevTime) {
          return child;
        }

        child = child._prev;
      }
    }
  },
      _setDuration = function _setDuration(animation, duration, skipUncache, leavePlayhead) {
    var repeat = animation._repeat,
        dur = _roundPrecise(duration) || 0,
        totalProgress = animation._tTime / animation._tDur;
    totalProgress && !leavePlayhead && (animation._time *= dur / animation._dur);
    animation._dur = dur;
    animation._tDur = !repeat ? dur : repeat < 0 ? 1e10 : _roundPrecise(dur * (repeat + 1) + animation._rDelay * repeat);
    totalProgress > 0 && !leavePlayhead ? _alignPlayhead(animation, animation._tTime = animation._tDur * totalProgress) : animation.parent && _setEnd(animation);
    skipUncache || _uncache(animation.parent, animation);
    return animation;
  },
      _onUpdateTotalDuration = function _onUpdateTotalDuration(animation) {
    return animation instanceof Timeline ? _uncache(animation) : _setDuration(animation, animation._dur);
  },
      _zeroPosition = {
    _start: 0,
    endTime: _emptyFunc,
    totalDuration: _emptyFunc
  },
      _parsePosition = function _parsePosition(animation, position, percentAnimation) {
    var labels = animation.labels,
        recent = animation._recent || _zeroPosition,
        clippedDuration = animation.duration() >= _bigNum ? recent.endTime(false) : animation._dur,
        i,
        offset,
        isPercent;

    if (_isString(position) && (isNaN(position) || position in labels)) {
      offset = position.charAt(0);
      isPercent = position.substr(-1) === "%";
      i = position.indexOf("=");

      if (offset === "<" || offset === ">") {
        i >= 0 && (position = position.replace(/=/, ""));
        return (offset === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0) * (isPercent ? (i < 0 ? recent : percentAnimation).totalDuration() / 100 : 1);
      }

      if (i < 0) {
        position in labels || (labels[position] = clippedDuration);
        return labels[position];
      }

      offset = parseFloat(position.charAt(i - 1) + position.substr(i + 1));

      if (isPercent && percentAnimation) {
        offset = offset / 100 * (_isArray(percentAnimation) ? percentAnimation[0] : percentAnimation).totalDuration();
      }

      return i > 1 ? _parsePosition(animation, position.substr(0, i - 1), percentAnimation) + offset : clippedDuration + offset;
    }

    return position == null ? clippedDuration : +position;
  },
      _createTweenType = function _createTweenType(type, params, timeline) {
    var isLegacy = _isNumber(params[1]),
        varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1),
        vars = params[varsIndex],
        irVars,
        parent;

    isLegacy && (vars.duration = params[1]);
    vars.parent = timeline;

    if (type) {
      irVars = vars;
      parent = timeline;

      while (parent && !("immediateRender" in irVars)) {
        irVars = parent.vars.defaults || {};
        parent = _isNotFalse(parent.vars.inherit) && parent.parent;
      }

      vars.immediateRender = _isNotFalse(irVars.immediateRender);
      type < 2 ? vars.runBackwards = 1 : vars.startAt = params[varsIndex - 1];
    }

    return new Tween(params[0], vars, params[varsIndex + 1]);
  },
      _conditionalReturn = function _conditionalReturn(value, func) {
    return value || value === 0 ? func(value) : func;
  },
      _clamp = function _clamp(min, max, value) {
    return value < min ? min : value > max ? max : value;
  },
      getUnit = function getUnit(value, v) {
    return !_isString(value) || !(v = _unitExp.exec(value)) ? "" : v[1];
  },
      clamp = function clamp(min, max, value) {
    return _conditionalReturn(value, function (v) {
      return _clamp(min, max, v);
    });
  },
      _slice = [].slice,
      _isArrayLike = function _isArrayLike(value, nonEmpty) {
    return value && _isObject(value) && "length" in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject(value[0])) && !value.nodeType && value !== _win;
  },
      _flatten = function _flatten(ar, leaveStrings, accumulator) {
    if (accumulator === void 0) {
      accumulator = [];
    }

    return ar.forEach(function (value) {
      var _accumulator;

      return _isString(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray(value)) : accumulator.push(value);
    }) || accumulator;
  },
      toArray = function toArray(value, scope, leaveStrings) {
    return _isString(value) && !leaveStrings && (_coreInitted || !_wake()) ? _slice.call((scope || _doc).querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [];
  },
      selector = function selector(value) {
    value = toArray(value)[0] || _warn("Invalid scope") || {};
    return function (v) {
      var el = value.current || value.nativeElement || value;
      return toArray(v, el.querySelectorAll ? el : el === value ? _warn("Invalid scope") || _doc.createElement("div") : value);
    };
  },
      shuffle = function shuffle(a) {
    return a.sort(function () {
      return .5 - Math.random();
    });
  },
      distribute = function distribute(v) {
    if (_isFunction(v)) {
      return v;
    }

    var vars = _isObject(v) ? v : {
      each: v
    },
        ease = _parseEase(vars.ease),
        from = vars.from || 0,
        base = parseFloat(vars.base) || 0,
        cache = {},
        isDecimal = from > 0 && from < 1,
        ratios = isNaN(from) || isDecimal,
        axis = vars.axis,
        ratioX = from,
        ratioY = from;

    if (_isString(from)) {
      ratioX = ratioY = {
        center: .5,
        edges: .5,
        end: 1
      }[from] || 0;
    } else if (!isDecimal && ratios) {
      ratioX = from[0];
      ratioY = from[1];
    }

    return function (i, target, a) {
      var l = (a || vars).length,
          distances = cache[l],
          originX,
          originY,
          x,
          y,
          d,
          j,
          max,
          min,
          wrapAt;

      if (!distances) {
        wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum])[1];

        if (!wrapAt) {
          max = -_bigNum;

          while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l) {}

          wrapAt--;
        }

        distances = cache[l] = [];
        originX = ratios ? Math.min(wrapAt, l) * ratioX - .5 : from % wrapAt;
        originY = wrapAt === _bigNum ? 0 : ratios ? l * ratioY / wrapAt - .5 : from / wrapAt | 0;
        max = 0;
        min = _bigNum;

        for (j = 0; j < l; j++) {
          x = j % wrapAt - originX;
          y = originY - (j / wrapAt | 0);
          distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);
          d > max && (max = d);
          d < min && (min = d);
        }

        from === "random" && shuffle(distances);
        distances.max = max - min;
        distances.min = min;
        distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt) || 0) * (from === "edges" ? -1 : 1);
        distances.b = l < 0 ? base - l : base;
        distances.u = getUnit(vars.amount || vars.each) || 0;
        ease = ease && l < 0 ? _invertEase(ease) : ease;
      }

      l = (distances[i] - distances.min) / distances.max || 0;
      return _roundPrecise(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u;
    };
  },
      _roundModifier = function _roundModifier(v) {
    var p = Math.pow(10, ((v + "").split(".")[1] || "").length);
    return function (raw) {
      var n = Math.round(parseFloat(raw) / v) * v * p;
      return (n - n % 1) / p + (_isNumber(raw) ? 0 : getUnit(raw));
    };
  },
      snap = function snap(snapTo, value) {
    var isArray = _isArray(snapTo),
        radius,
        is2D;

    if (!isArray && _isObject(snapTo)) {
      radius = isArray = snapTo.radius || _bigNum;

      if (snapTo.values) {
        snapTo = toArray(snapTo.values);

        if (is2D = !_isNumber(snapTo[0])) {
          radius *= radius;
        }
      } else {
        snapTo = _roundModifier(snapTo.increment);
      }
    }

    return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : _isFunction(snapTo) ? function (raw) {
      is2D = snapTo(raw);
      return Math.abs(is2D - raw) <= radius ? is2D : raw;
    } : function (raw) {
      var x = parseFloat(is2D ? raw.x : raw),
          y = parseFloat(is2D ? raw.y : 0),
          min = _bigNum,
          closest = 0,
          i = snapTo.length,
          dx,
          dy;

      while (i--) {
        if (is2D) {
          dx = snapTo[i].x - x;
          dy = snapTo[i].y - y;
          dx = dx * dx + dy * dy;
        } else {
          dx = Math.abs(snapTo[i] - x);
        }

        if (dx < min) {
          min = dx;
          closest = i;
        }
      }

      closest = !radius || min <= radius ? snapTo[closest] : raw;
      return is2D || closest === raw || _isNumber(raw) ? closest : closest + getUnit(raw);
    });
  },
      random = function random(min, max, roundingIncrement, returnFunction) {
    return _conditionalReturn(_isArray(min) ? !max : roundingIncrement === true ? !!(roundingIncrement = 0) : !returnFunction, function () {
      return _isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (roundingIncrement + "").length - 2) : 1) && Math.floor(Math.round((min - roundingIncrement / 2 + Math.random() * (max - min + roundingIncrement * .99)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction;
    });
  },
      pipe = function pipe() {
    for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
      functions[_key] = arguments[_key];
    }

    return function (value) {
      return functions.reduce(function (v, f) {
        return f(v);
      }, value);
    };
  },
      unitize = function unitize(func, unit) {
    return function (value) {
      return func(parseFloat(value)) + (unit || getUnit(value));
    };
  },
      normalize = function normalize(min, max, value) {
    return mapRange(min, max, 0, 1, value);
  },
      _wrapArray = function _wrapArray(a, wrapper, value) {
    return _conditionalReturn(value, function (index) {
      return a[~~wrapper(index)];
    });
  },
      wrap = function wrap(min, max, value) {
    var range = max - min;
    return _isArray(min) ? _wrapArray(min, wrap(0, min.length), max) : _conditionalReturn(value, function (value) {
      return (range + (value - min) % range) % range + min;
    });
  },
      wrapYoyo = function wrapYoyo(min, max, value) {
    var range = max - min,
        total = range * 2;
    return _isArray(min) ? _wrapArray(min, wrapYoyo(0, min.length - 1), max) : _conditionalReturn(value, function (value) {
      value = (total + (value - min) % total) % total || 0;
      return min + (value > range ? total - value : value);
    });
  },
      _replaceRandom = function _replaceRandom(value) {
    var prev = 0,
        s = "",
        i,
        nums,
        end,
        isArray;

    while (~(i = value.indexOf("random(", prev))) {
      end = value.indexOf(")", i);
      isArray = value.charAt(i + 7) === "[";
      nums = value.substr(i + 7, end - i - 7).match(isArray ? _delimitedValueExp : _strictNumExp);
      s += value.substr(prev, i - prev) + random(isArray ? nums : +nums[0], isArray ? 0 : +nums[1], +nums[2] || 1e-5);
      prev = end + 1;
    }

    return s + value.substr(prev, value.length - prev);
  },
      mapRange = function mapRange(inMin, inMax, outMin, outMax, value) {
    var inRange = inMax - inMin,
        outRange = outMax - outMin;
    return _conditionalReturn(value, function (value) {
      return outMin + ((value - inMin) / inRange * outRange || 0);
    });
  },
      interpolate = function interpolate(start, end, progress, mutate) {
    var func = isNaN(start + end) ? 0 : function (p) {
      return (1 - p) * start + p * end;
    };

    if (!func) {
      var isString = _isString(start),
          master = {},
          p,
          i,
          interpolators,
          l,
          il;

      progress === true && (mutate = 1) && (progress = null);

      if (isString) {
        start = {
          p: start
        };
        end = {
          p: end
        };
      } else if (_isArray(start) && !_isArray(end)) {
        interpolators = [];
        l = start.length;
        il = l - 2;

        for (i = 1; i < l; i++) {
          interpolators.push(interpolate(start[i - 1], start[i]));
        }

        l--;

        func = function func(p) {
          p *= l;
          var i = Math.min(il, ~~p);
          return interpolators[i](p - i);
        };

        progress = end;
      } else if (!mutate) {
        start = _merge(_isArray(start) ? [] : {}, start);
      }

      if (!interpolators) {
        for (p in end) {
          _addPropTween.call(master, start, p, "get", end[p]);
        }

        func = function func(p) {
          return _renderPropTweens(p, master) || (isString ? start.p : start);
        };
      }
    }

    return _conditionalReturn(progress, func);
  },
      _getLabelInDirection = function _getLabelInDirection(timeline, fromTime, backward) {
    var labels = timeline.labels,
        min = _bigNum,
        p,
        distance,
        label;

    for (p in labels) {
      distance = labels[p] - fromTime;

      if (distance < 0 === !!backward && distance && min > (distance = Math.abs(distance))) {
        label = p;
        min = distance;
      }
    }

    return label;
  },
      _callback = function _callback(animation, type, executeLazyFirst) {
    var v = animation.vars,
        callback = v[type],
        params,
        scope;

    if (!callback) {
      return;
    }

    params = v[type + "Params"];
    scope = v.callbackScope || animation;
    executeLazyFirst && _lazyTweens.length && _lazyRender();
    return params ? callback.apply(scope, params) : callback.call(scope);
  },
      _interrupt = function _interrupt(animation) {
    _removeFromParent(animation);

    animation.scrollTrigger && animation.scrollTrigger.kill(false);
    animation.progress() < 1 && _callback(animation, "onInterrupt");
    return animation;
  },
      _quickTween,
      _createPlugin = function _createPlugin(config) {
    config = !config.name && config["default"] || config;

    var name = config.name,
        isFunc = _isFunction(config),
        Plugin = name && !isFunc && config.init ? function () {
      this._props = [];
    } : config,
        instanceDefaults = {
      init: _emptyFunc,
      render: _renderPropTweens,
      add: _addPropTween,
      kill: _killPropTweensOf,
      modifier: _addPluginModifier,
      rawVars: 0
    },
        statics = {
      targetTest: 0,
      get: 0,
      getSetter: _getSetter,
      aliases: {},
      register: 0
    };

    _wake();

    if (config !== Plugin) {
      if (_plugins[name]) {
        return;
      }

      _setDefaults(Plugin, _setDefaults(_copyExcluding(config, instanceDefaults), statics));

      _merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config, statics)));

      _plugins[Plugin.prop = name] = Plugin;

      if (config.targetTest) {
        _harnessPlugins.push(Plugin);

        _reservedProps[name] = 1;
      }

      name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin";
    }

    _addGlobal(name, Plugin);

    config.register && config.register(gsap, Plugin, PropTween);
  },
      _255 = 255,
      _colorLookup = {
    aqua: [0, _255, _255],
    lime: [0, _255, 0],
    silver: [192, 192, 192],
    black: [0, 0, 0],
    maroon: [128, 0, 0],
    teal: [0, 128, 128],
    blue: [0, 0, _255],
    navy: [0, 0, 128],
    white: [_255, _255, _255],
    olive: [128, 128, 0],
    yellow: [_255, _255, 0],
    orange: [_255, 165, 0],
    gray: [128, 128, 128],
    purple: [128, 0, 128],
    green: [0, 128, 0],
    red: [_255, 0, 0],
    pink: [_255, 192, 203],
    cyan: [0, _255, _255],
    transparent: [_255, _255, _255, 0]
  },
      _hue = function _hue(h, m1, m2) {
    h += h < 0 ? 1 : h > 1 ? -1 : 0;
    return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < .5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + .5 | 0;
  },
      splitColor = function splitColor(v, toHSL, forceAlpha) {
    var a = !v ? _colorLookup.black : _isNumber(v) ? [v >> 16, v >> 8 & _255, v & _255] : 0,
        r,
        g,
        b,
        h,
        s,
        l,
        max,
        min,
        d,
        wasHSL;

    if (!a) {
      if (v.substr(-1) === ",") {
        v = v.substr(0, v.length - 1);
      }

      if (_colorLookup[v]) {
        a = _colorLookup[v];
      } else if (v.charAt(0) === "#") {
        if (v.length < 6) {
          r = v.charAt(1);
          g = v.charAt(2);
          b = v.charAt(3);
          v = "#" + r + r + g + g + b + b + (v.length === 5 ? v.charAt(4) + v.charAt(4) : "");
        }

        if (v.length === 9) {
          a = parseInt(v.substr(1, 6), 16);
          return [a >> 16, a >> 8 & _255, a & _255, parseInt(v.substr(7), 16) / 255];
        }

        v = parseInt(v.substr(1), 16);
        a = [v >> 16, v >> 8 & _255, v & _255];
      } else if (v.substr(0, 3) === "hsl") {
        a = wasHSL = v.match(_strictNumExp);

        if (!toHSL) {
          h = +a[0] % 360 / 360;
          s = +a[1] / 100;
          l = +a[2] / 100;
          g = l <= .5 ? l * (s + 1) : l + s - l * s;
          r = l * 2 - g;
          a.length > 3 && (a[3] *= 1);
          a[0] = _hue(h + 1 / 3, r, g);
          a[1] = _hue(h, r, g);
          a[2] = _hue(h - 1 / 3, r, g);
        } else if (~v.indexOf("=")) {
          a = v.match(_numExp);
          forceAlpha && a.length < 4 && (a[3] = 1);
          return a;
        }
      } else {
        a = v.match(_strictNumExp) || _colorLookup.transparent;
      }

      a = a.map(Number);
    }

    if (toHSL && !wasHSL) {
      r = a[0] / _255;
      g = a[1] / _255;
      b = a[2] / _255;
      max = Math.max(r, g, b);
      min = Math.min(r, g, b);
      l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
        h *= 60;
      }

      a[0] = ~~(h + .5);
      a[1] = ~~(s * 100 + .5);
      a[2] = ~~(l * 100 + .5);
    }

    forceAlpha && a.length < 4 && (a[3] = 1);
    return a;
  },
      _colorOrderData = function _colorOrderData(v) {
    var values = [],
        c = [],
        i = -1;
    v.split(_colorExp).forEach(function (v) {
      var a = v.match(_numWithUnitExp) || [];
      values.push.apply(values, a);
      c.push(i += a.length + 1);
    });
    values.c = c;
    return values;
  },
      _formatColors = function _formatColors(s, toHSL, orderMatchData) {
    var result = "",
        colors = (s + result).match(_colorExp),
        type = toHSL ? "hsla(" : "rgba(",
        i = 0,
        c,
        shell,
        d,
        l;

    if (!colors) {
      return s;
    }

    colors = colors.map(function (color) {
      return (color = splitColor(color, toHSL, 1)) && type + (toHSL ? color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : color.join(",")) + ")";
    });

    if (orderMatchData) {
      d = _colorOrderData(s);
      c = orderMatchData.c;

      if (c.join(result) !== d.c.join(result)) {
        shell = s.replace(_colorExp, "1").split(_numWithUnitExp);
        l = shell.length - 1;

        for (; i < l; i++) {
          result += shell[i] + (~c.indexOf(i) ? colors.shift() || type + "0,0,0,0)" : (d.length ? d : colors.length ? colors : orderMatchData).shift());
        }
      }
    }

    if (!shell) {
      shell = s.split(_colorExp);
      l = shell.length - 1;

      for (; i < l; i++) {
        result += shell[i] + colors[i];
      }
    }

    return result + shell[l];
  },
      _colorExp = function () {
    var s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",
        p;

    for (p in _colorLookup) {
      s += "|" + p + "\\b";
    }

    return new RegExp(s + ")", "gi");
  }(),
      _hslExp = /hsl[a]?\(/,
      _colorStringFilter = function _colorStringFilter(a) {
    var combined = a.join(" "),
        toHSL;
    _colorExp.lastIndex = 0;

    if (_colorExp.test(combined)) {
      toHSL = _hslExp.test(combined);
      a[1] = _formatColors(a[1], toHSL);
      a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1]));
      return true;
    }
  },
      _tickerActive,
      _ticker = function () {
    var _getTime = Date.now,
        _lagThreshold = 500,
        _adjustedLag = 33,
        _startTime = _getTime(),
        _lastUpdate = _startTime,
        _gap = 1000 / 240,
        _nextTime = _gap,
        _listeners = [],
        _id,
        _req,
        _raf,
        _self,
        _delta,
        _i,
        _tick = function _tick(v) {
      var elapsed = _getTime() - _lastUpdate,
          manual = v === true,
          overlap,
          dispatch,
          time,
          frame;

      elapsed > _lagThreshold && (_startTime += elapsed - _adjustedLag);
      _lastUpdate += elapsed;
      time = _lastUpdate - _startTime;
      overlap = time - _nextTime;

      if (overlap > 0 || manual) {
        frame = ++_self.frame;
        _delta = time - _self.time * 1000;
        _self.time = time = time / 1000;
        _nextTime += overlap + (overlap >= _gap ? 4 : _gap - overlap);
        dispatch = 1;
      }

      manual || (_id = _req(_tick));

      if (dispatch) {
        for (_i = 0; _i < _listeners.length; _i++) {
          _listeners[_i](time, _delta, frame, v);
        }
      }
    };

    _self = {
      time: 0,
      frame: 0,
      tick: function tick() {
        _tick(true);
      },
      deltaRatio: function deltaRatio(fps) {
        return _delta / (1000 / (fps || 60));
      },
      wake: function wake() {
        if (_coreReady) {
          if (!_coreInitted && _windowExists()) {
            _win = _coreInitted = window;
            _doc = _win.document || {};
            _globals.gsap = gsap;
            (_win.gsapVersions || (_win.gsapVersions = [])).push(gsap.version);

            _install(_installScope || _win.GreenSockGlobals || !_win.gsap && _win || {});

            _raf = _win.requestAnimationFrame;
          }

          _id && _self.sleep();

          _req = _raf || function (f) {
            return setTimeout(f, _nextTime - _self.time * 1000 + 1 | 0);
          };

          _tickerActive = 1;

          _tick(2);
        }
      },
      sleep: function sleep() {
        (_raf ? _win.cancelAnimationFrame : clearTimeout)(_id);
        _tickerActive = 0;
        _req = _emptyFunc;
      },
      lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
        _lagThreshold = threshold || 1 / _tinyNum;
        _adjustedLag = Math.min(adjustedLag, _lagThreshold, 0);
      },
      fps: function fps(_fps) {
        _gap = 1000 / (_fps || 240);
        _nextTime = _self.time * 1000 + _gap;
      },
      add: function add(callback, once, prioritize) {
        var func = once ? function (t, d, f, v) {
          callback(t, d, f, v);

          _self.remove(func);
        } : callback;

        _self.remove(callback);

        _listeners[prioritize ? "unshift" : "push"](func);

        _wake();

        return func;
      },
      remove: function remove(callback, i) {
        ~(i = _listeners.indexOf(callback)) && _listeners.splice(i, 1) && _i >= i && _i--;
      },
      _listeners: _listeners
    };
    return _self;
  }(),
      _wake = function _wake() {
    return !_tickerActive && _ticker.wake();
  },
      _easeMap = {},
      _customEaseExp = /^[\d.\-M][\d.\-,\s]/,
      _quotesExp = /["']/g,
      _parseObjectInString = function _parseObjectInString(value) {
    var obj = {},
        split = value.substr(1, value.length - 3).split(":"),
        key = split[0],
        i = 1,
        l = split.length,
        index,
        val,
        parsedVal;

    for (; i < l; i++) {
      val = split[i];
      index = i !== l - 1 ? val.lastIndexOf(",") : val.length;
      parsedVal = val.substr(0, index);
      obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
      key = val.substr(index + 1).trim();
    }

    return obj;
  },
      _valueInParentheses = function _valueInParentheses(value) {
    var open = value.indexOf("(") + 1,
        close = value.indexOf(")"),
        nested = value.indexOf("(", open);
    return value.substring(open, ~nested && nested < close ? value.indexOf(")", close + 1) : close);
  },
      _configEaseFromString = function _configEaseFromString(name) {
    var split = (name + "").split("("),
        ease = _easeMap[split[0]];
    return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _valueInParentheses(name).split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease;
  },
      _invertEase = function _invertEase(ease) {
    return function (p) {
      return 1 - ease(1 - p);
    };
  },
      _propagateYoyoEase = function _propagateYoyoEase(timeline, isYoyo) {
    var child = timeline._first,
        ease;

    while (child) {
      if (child instanceof Timeline) {
        _propagateYoyoEase(child, isYoyo);
      } else if (child.vars.yoyoEase && (!child._yoyo || !child._repeat) && child._yoyo !== isYoyo) {
        if (child.timeline) {
          _propagateYoyoEase(child.timeline, isYoyo);
        } else {
          ease = child._ease;
          child._ease = child._yEase;
          child._yEase = ease;
          child._yoyo = isYoyo;
        }
      }

      child = child._next;
    }
  },
      _parseEase = function _parseEase(ease, defaultEase) {
    return !ease ? defaultEase : (_isFunction(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
  },
      _insertEase = function _insertEase(names, easeIn, easeOut, easeInOut) {
    if (easeOut === void 0) {
      easeOut = function easeOut(p) {
        return 1 - easeIn(1 - p);
      };
    }

    if (easeInOut === void 0) {
      easeInOut = function easeInOut(p) {
        return p < .5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2;
      };
    }

    var ease = {
      easeIn: easeIn,
      easeOut: easeOut,
      easeInOut: easeInOut
    },
        lowercaseName;

    _forEachName(names, function (name) {
      _easeMap[name] = _globals[name] = ease;
      _easeMap[lowercaseName = name.toLowerCase()] = easeOut;

      for (var p in ease) {
        _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p];
      }
    });

    return ease;
  },
      _easeInOutFromOut = function _easeInOutFromOut(easeOut) {
    return function (p) {
      return p < .5 ? (1 - easeOut(1 - p * 2)) / 2 : .5 + easeOut((p - .5) * 2) / 2;
    };
  },
      _configElastic = function _configElastic(type, amplitude, period) {
    var p1 = amplitude >= 1 ? amplitude : 1,
        p2 = (period || (type ? .3 : .45)) / (amplitude < 1 ? amplitude : 1),
        p3 = p2 / _2PI * (Math.asin(1 / p1) || 0),
        easeOut = function easeOut(p) {
      return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1;
    },
        ease = type === "out" ? easeOut : type === "in" ? function (p) {
      return 1 - easeOut(1 - p);
    } : _easeInOutFromOut(easeOut);

    p2 = _2PI / p2;

    ease.config = function (amplitude, period) {
      return _configElastic(type, amplitude, period);
    };

    return ease;
  },
      _configBack = function _configBack(type, overshoot) {
    if (overshoot === void 0) {
      overshoot = 1.70158;
    }

    var easeOut = function easeOut(p) {
      return p ? --p * p * ((overshoot + 1) * p + overshoot) + 1 : 0;
    },
        ease = type === "out" ? easeOut : type === "in" ? function (p) {
      return 1 - easeOut(1 - p);
    } : _easeInOutFromOut(easeOut);

    ease.config = function (overshoot) {
      return _configBack(type, overshoot);
    };

    return ease;
  };

  _forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function (name, i) {
    var power = i < 5 ? i + 1 : i;

    _insertEase(name + ",Power" + (power - 1), i ? function (p) {
      return Math.pow(p, power);
    } : function (p) {
      return p;
    }, function (p) {
      return 1 - Math.pow(1 - p, power);
    }, function (p) {
      return p < .5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2;
    });
  });

  _easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;

  _insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());

  (function (n, c) {
    var n1 = 1 / c,
        n2 = 2 * n1,
        n3 = 2.5 * n1,
        easeOut = function easeOut(p) {
      return p < n1 ? n * p * p : p < n2 ? n * Math.pow(p - 1.5 / c, 2) + .75 : p < n3 ? n * (p -= 2.25 / c) * p + .9375 : n * Math.pow(p - 2.625 / c, 2) + .984375;
    };

    _insertEase("Bounce", function (p) {
      return 1 - easeOut(1 - p);
    }, easeOut);
  })(7.5625, 2.75);

  _insertEase("Expo", function (p) {
    return p ? Math.pow(2, 10 * (p - 1)) : 0;
  });

  _insertEase("Circ", function (p) {
    return -(_sqrt(1 - p * p) - 1);
  });

  _insertEase("Sine", function (p) {
    return p === 1 ? 1 : -_cos(p * _HALF_PI) + 1;
  });

  _insertEase("Back", _configBack("in"), _configBack("out"), _configBack());

  _easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
    config: function config(steps, immediateStart) {
      if (steps === void 0) {
        steps = 1;
      }

      var p1 = 1 / steps,
          p2 = steps + (immediateStart ? 0 : 1),
          p3 = immediateStart ? 1 : 0,
          max = 1 - _tinyNum;
      return function (p) {
        return ((p2 * _clamp(0, max, p) | 0) + p3) * p1;
      };
    }
  };
  _defaults.ease = _easeMap["quad.out"];

  _forEachName("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function (name) {
    return _callbackNames += name + "," + name + "Params,";
  });

  var GSCache = function GSCache(target, harness) {
    this.id = _gsID++;
    target._gsap = this;
    this.target = target;
    this.harness = harness;
    this.get = harness ? harness.get : _getProperty;
    this.set = harness ? harness.getSetter : _getSetter;
  };
  var Animation = function () {
    function Animation(vars) {
      this.vars = vars;
      this._delay = +vars.delay || 0;

      if (this._repeat = vars.repeat === Infinity ? -2 : vars.repeat || 0) {
        this._rDelay = vars.repeatDelay || 0;
        this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
      }

      this._ts = 1;

      _setDuration(this, +vars.duration, 1, 1);

      this.data = vars.data;
      _tickerActive || _ticker.wake();
    }

    var _proto = Animation.prototype;

    _proto.delay = function delay(value) {
      if (value || value === 0) {
        this.parent && this.parent.smoothChildTiming && this.startTime(this._start + value - this._delay);
        this._delay = value;
        return this;
      }

      return this._delay;
    };

    _proto.duration = function duration(value) {
      return arguments.length ? this.totalDuration(this._repeat > 0 ? value + (value + this._rDelay) * this._repeat : value) : this.totalDuration() && this._dur;
    };

    _proto.totalDuration = function totalDuration(value) {
      if (!arguments.length) {
        return this._tDur;
      }

      this._dirty = 0;
      return _setDuration(this, this._repeat < 0 ? value : (value - this._repeat * this._rDelay) / (this._repeat + 1));
    };

    _proto.totalTime = function totalTime(_totalTime, suppressEvents) {
      _wake();

      if (!arguments.length) {
        return this._tTime;
      }

      var parent = this._dp;

      if (parent && parent.smoothChildTiming && this._ts) {
        _alignPlayhead(this, _totalTime);

        !parent._dp || parent.parent || _postAddChecks(parent, this);

        while (parent && parent.parent) {
          if (parent.parent._time !== parent._start + (parent._ts >= 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) {
            parent.totalTime(parent._tTime, true);
          }

          parent = parent.parent;
        }

        if (!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && _totalTime < this._tDur || this._ts < 0 && _totalTime > 0 || !this._tDur && !_totalTime)) {
          _addToTimeline(this._dp, this, this._start - this._delay);
        }
      }

      if (this._tTime !== _totalTime || !this._dur && !suppressEvents || this._initted && Math.abs(this._zTime) === _tinyNum || !_totalTime && !this._initted && (this.add || this._ptLookup)) {
        this._ts || (this._pTime = _totalTime);

        _lazySafeRender(this, _totalTime, suppressEvents);
      }

      return this;
    };

    _proto.time = function time(value, suppressEvents) {
      return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % (this._dur + this._rDelay) || (value ? this._dur : 0), suppressEvents) : this._time;
    };

    _proto.totalProgress = function totalProgress(value, suppressEvents) {
      return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.ratio;
    };

    _proto.progress = function progress(value, suppressEvents) {
      return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? Math.min(1, this._time / this._dur) : this.ratio;
    };

    _proto.iteration = function iteration(value, suppressEvents) {
      var cycleDuration = this.duration() + this._rDelay;

      return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1;
    };

    _proto.timeScale = function timeScale(value) {
      if (!arguments.length) {
        return this._rts === -_tinyNum ? 0 : this._rts;
      }

      if (this._rts === value) {
        return this;
      }

      var tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime;
      this._rts = +value || 0;
      this._ts = this._ps || value === -_tinyNum ? 0 : this._rts;
      this.totalTime(_clamp(-this._delay, this._tDur, tTime), true);

      _setEnd(this);

      return _recacheAncestors(this);
    };

    _proto.paused = function paused(value) {
      if (!arguments.length) {
        return this._ps;
      }

      if (this._ps !== value) {
        this._ps = value;

        if (value) {
          this._pTime = this._tTime || Math.max(-this._delay, this.rawTime());
          this._ts = this._act = 0;
        } else {
          _wake();

          this._ts = this._rts;
          this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== _tinyNum && (this._tTime -= _tinyNum));
        }
      }

      return this;
    };

    _proto.startTime = function startTime(value) {
      if (arguments.length) {
        this._start = value;
        var parent = this.parent || this._dp;
        parent && (parent._sort || !this.parent) && _addToTimeline(parent, this, value - this._delay);
        return this;
      }

      return this._start;
    };

    _proto.endTime = function endTime(includeRepeats) {
      return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
    };

    _proto.rawTime = function rawTime(wrapRepeats) {
      var parent = this.parent || this._dp;
      return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
    };

    _proto.globalTime = function globalTime(rawTime) {
      var animation = this,
          time = arguments.length ? rawTime : animation.rawTime();

      while (animation) {
        time = animation._start + time / (animation._ts || 1);
        animation = animation._dp;
      }

      return time;
    };

    _proto.repeat = function repeat(value) {
      if (arguments.length) {
        this._repeat = value === Infinity ? -2 : value;
        return _onUpdateTotalDuration(this);
      }

      return this._repeat === -2 ? Infinity : this._repeat;
    };

    _proto.repeatDelay = function repeatDelay(value) {
      if (arguments.length) {
        var time = this._time;
        this._rDelay = value;

        _onUpdateTotalDuration(this);

        return time ? this.time(time) : this;
      }

      return this._rDelay;
    };

    _proto.yoyo = function yoyo(value) {
      if (arguments.length) {
        this._yoyo = value;
        return this;
      }

      return this._yoyo;
    };

    _proto.seek = function seek(position, suppressEvents) {
      return this.totalTime(_parsePosition(this, position), _isNotFalse(suppressEvents));
    };

    _proto.restart = function restart(includeDelay, suppressEvents) {
      return this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents));
    };

    _proto.play = function play(from, suppressEvents) {
      from != null && this.seek(from, suppressEvents);
      return this.reversed(false).paused(false);
    };

    _proto.reverse = function reverse(from, suppressEvents) {
      from != null && this.seek(from || this.totalDuration(), suppressEvents);
      return this.reversed(true).paused(false);
    };

    _proto.pause = function pause(atTime, suppressEvents) {
      atTime != null && this.seek(atTime, suppressEvents);
      return this.paused(true);
    };

    _proto.resume = function resume() {
      return this.paused(false);
    };

    _proto.reversed = function reversed(value) {
      if (arguments.length) {
        !!value !== this.reversed() && this.timeScale(-this._rts || (value ? -_tinyNum : 0));
        return this;
      }

      return this._rts < 0;
    };

    _proto.invalidate = function invalidate() {
      this._initted = this._act = 0;
      this._zTime = -_tinyNum;
      return this;
    };

    _proto.isActive = function isActive() {
      var parent = this.parent || this._dp,
          start = this._start,
          rawTime;
      return !!(!parent || this._ts && this._initted && parent.isActive() && (rawTime = parent.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum);
    };

    _proto.eventCallback = function eventCallback(type, callback, params) {
      var vars = this.vars;

      if (arguments.length > 1) {
        if (!callback) {
          delete vars[type];
        } else {
          vars[type] = callback;
          params && (vars[type + "Params"] = params);
          type === "onUpdate" && (this._onUpdate = callback);
        }

        return this;
      }

      return vars[type];
    };

    _proto.then = function then(onFulfilled) {
      var self = this;
      return new Promise(function (resolve) {
        var f = _isFunction(onFulfilled) ? onFulfilled : _passThrough,
            _resolve = function _resolve() {
          var _then = self.then;
          self.then = null;
          _isFunction(f) && (f = f(self)) && (f.then || f === self) && (self.then = _then);
          resolve(f);
          self.then = _then;
        };

        if (self._initted && self.totalProgress() === 1 && self._ts >= 0 || !self._tTime && self._ts < 0) {
          _resolve();
        } else {
          self._prom = _resolve;
        }
      });
    };

    _proto.kill = function kill() {
      _interrupt(this);
    };

    return Animation;
  }();

  _setDefaults(Animation.prototype, {
    _time: 0,
    _start: 0,
    _end: 0,
    _tTime: 0,
    _tDur: 0,
    _dirty: 0,
    _repeat: 0,
    _yoyo: false,
    parent: null,
    _initted: false,
    _rDelay: 0,
    _ts: 1,
    _dp: 0,
    ratio: 0,
    _zTime: -_tinyNum,
    _prom: 0,
    _ps: false,
    _rts: 1
  });

  var Timeline = function (_Animation) {
    _inheritsLoose(Timeline, _Animation);

    function Timeline(vars, position) {
      var _this;

      if (vars === void 0) {
        vars = {};
      }

      _this = _Animation.call(this, vars) || this;
      _this.labels = {};
      _this.smoothChildTiming = !!vars.smoothChildTiming;
      _this.autoRemoveChildren = !!vars.autoRemoveChildren;
      _this._sort = _isNotFalse(vars.sortChildren);
      _globalTimeline && _addToTimeline(vars.parent || _globalTimeline, _assertThisInitialized(_this), position);
      vars.reversed && _this.reverse();
      vars.paused && _this.paused(true);
      vars.scrollTrigger && _scrollTrigger(_assertThisInitialized(_this), vars.scrollTrigger);
      return _this;
    }

    var _proto2 = Timeline.prototype;

    _proto2.to = function to(targets, vars, position) {
      _createTweenType(0, arguments, this);

      return this;
    };

    _proto2.from = function from(targets, vars, position) {
      _createTweenType(1, arguments, this);

      return this;
    };

    _proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
      _createTweenType(2, arguments, this);

      return this;
    };

    _proto2.set = function set(targets, vars, position) {
      vars.duration = 0;
      vars.parent = this;
      _inheritDefaults(vars).repeatDelay || (vars.repeat = 0);
      vars.immediateRender = !!vars.immediateRender;
      new Tween(targets, vars, _parsePosition(this, position), 1);
      return this;
    };

    _proto2.call = function call(callback, params, position) {
      return _addToTimeline(this, Tween.delayedCall(0, callback, params), position);
    };

    _proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
      vars.duration = duration;
      vars.stagger = vars.stagger || stagger;
      vars.onComplete = onCompleteAll;
      vars.onCompleteParams = onCompleteAllParams;
      vars.parent = this;
      new Tween(targets, vars, _parsePosition(this, position));
      return this;
    };

    _proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
      vars.runBackwards = 1;
      _inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender);
      return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
    };

    _proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
      toVars.startAt = fromVars;
      _inheritDefaults(toVars).immediateRender = _isNotFalse(toVars.immediateRender);
      return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
    };

    _proto2.render = function render(totalTime, suppressEvents, force) {
      var prevTime = this._time,
          tDur = this._dirty ? this.totalDuration() : this._tDur,
          dur = this._dur,
          tTime = totalTime <= 0 ? 0 : _roundPrecise(totalTime),
          crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur),
          time,
          child,
          next,
          iteration,
          cycleDuration,
          prevPaused,
          pauseTween,
          timeScale,
          prevStart,
          prevIteration,
          yoyo,
          isYoyo;
      this !== _globalTimeline && tTime > tDur && totalTime >= 0 && (tTime = tDur);

      if (tTime !== this._tTime || force || crossingStart) {
        if (prevTime !== this._time && dur) {
          tTime += this._time - prevTime;
          totalTime += this._time - prevTime;
        }

        time = tTime;
        prevStart = this._start;
        timeScale = this._ts;
        prevPaused = !timeScale;

        if (crossingStart) {
          dur || (prevTime = this._zTime);
          (totalTime || !suppressEvents) && (this._zTime = totalTime);
        }

        if (this._repeat) {
          yoyo = this._yoyo;
          cycleDuration = dur + this._rDelay;

          if (this._repeat < -1 && totalTime < 0) {
            return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
          }

          time = _roundPrecise(tTime % cycleDuration);

          if (tTime === tDur) {
            iteration = this._repeat;
            time = dur;
          } else {
            iteration = ~~(tTime / cycleDuration);

            if (iteration && iteration === tTime / cycleDuration) {
              time = dur;
              iteration--;
            }

            time > dur && (time = dur);
          }

          prevIteration = _animationCycle(this._tTime, cycleDuration);
          !prevTime && this._tTime && prevIteration !== iteration && (prevIteration = iteration);

          if (yoyo && iteration & 1) {
            time = dur - time;
            isYoyo = 1;
          }

          if (iteration !== prevIteration && !this._lock) {
            var rewinding = yoyo && prevIteration & 1,
                doesWrap = rewinding === (yoyo && iteration & 1);
            iteration < prevIteration && (rewinding = !rewinding);
            prevTime = rewinding ? 0 : dur;
            this._lock = 1;
            this.render(prevTime || (isYoyo ? 0 : _roundPrecise(iteration * cycleDuration)), suppressEvents, !dur)._lock = 0;
            this._tTime = tTime;
            !suppressEvents && this.parent && _callback(this, "onRepeat");
            this.vars.repeatRefresh && !isYoyo && (this.invalidate()._lock = 1);

            if (prevTime && prevTime !== this._time || prevPaused !== !this._ts || this.vars.onRepeat && !this.parent && !this._act) {
              return this;
            }

            dur = this._dur;
            tDur = this._tDur;

            if (doesWrap) {
              this._lock = 2;
              prevTime = rewinding ? dur : -0.0001;
              this.render(prevTime, true);
              this.vars.repeatRefresh && !isYoyo && this.invalidate();
            }

            this._lock = 0;

            if (!this._ts && !prevPaused) {
              return this;
            }

            _propagateYoyoEase(this, isYoyo);
          }
        }

        if (this._hasPause && !this._forcing && this._lock < 2) {
          pauseTween = _findNextPauseTween(this, _roundPrecise(prevTime), _roundPrecise(time));

          if (pauseTween) {
            tTime -= time - (time = pauseTween._start);
          }
        }

        this._tTime = tTime;
        this._time = time;
        this._act = !timeScale;

        if (!this._initted) {
          this._onUpdate = this.vars.onUpdate;
          this._initted = 1;
          this._zTime = totalTime;
          prevTime = 0;
        }

        if (!prevTime && time && !suppressEvents) {
          _callback(this, "onStart");

          if (this._tTime !== tTime) {
            return this;
          }
        }

        if (time >= prevTime && totalTime >= 0) {
          child = this._first;

          while (child) {
            next = child._next;

            if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
              if (child.parent !== this) {
                return this.render(totalTime, suppressEvents, force);
              }

              child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);

              if (time !== this._time || !this._ts && !prevPaused) {
                pauseTween = 0;
                next && (tTime += this._zTime = -_tinyNum);
                break;
              }
            }

            child = next;
          }
        } else {
          child = this._last;
          var adjustedTime = totalTime < 0 ? totalTime : time;

          while (child) {
            next = child._prev;

            if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
              if (child.parent !== this) {
                return this.render(totalTime, suppressEvents, force);
              }

              child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force);

              if (time !== this._time || !this._ts && !prevPaused) {
                pauseTween = 0;
                next && (tTime += this._zTime = adjustedTime ? -_tinyNum : _tinyNum);
                break;
              }
            }

            child = next;
          }
        }

        if (pauseTween && !suppressEvents) {
          this.pause();
          pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1;

          if (this._ts) {
            this._start = prevStart;

            _setEnd(this);

            return this.render(totalTime, suppressEvents, force);
          }
        }

        this._onUpdate && !suppressEvents && _callback(this, "onUpdate", true);
        if (tTime === tDur && this._tTime >= this.totalDuration() || !tTime && prevTime) if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) if (!this._lock) {
          (totalTime || !dur) && (tTime === tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);

          if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime || !tDur)) {
            _callback(this, tTime === tDur && totalTime >= 0 ? "onComplete" : "onReverseComplete", true);

            this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
          }
        }
      }

      return this;
    };

    _proto2.add = function add(child, position) {
      var _this2 = this;

      _isNumber(position) || (position = _parsePosition(this, position, child));

      if (!(child instanceof Animation)) {
        if (_isArray(child)) {
          child.forEach(function (obj) {
            return _this2.add(obj, position);
          });
          return this;
        }

        if (_isString(child)) {
          return this.addLabel(child, position);
        }

        if (_isFunction(child)) {
          child = Tween.delayedCall(0, child);
        } else {
          return this;
        }
      }

      return this !== child ? _addToTimeline(this, child, position) : this;
    };

    _proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
      if (nested === void 0) {
        nested = true;
      }

      if (tweens === void 0) {
        tweens = true;
      }

      if (timelines === void 0) {
        timelines = true;
      }

      if (ignoreBeforeTime === void 0) {
        ignoreBeforeTime = -_bigNum;
      }

      var a = [],
          child = this._first;

      while (child) {
        if (child._start >= ignoreBeforeTime) {
          if (child instanceof Tween) {
            tweens && a.push(child);
          } else {
            timelines && a.push(child);
            nested && a.push.apply(a, child.getChildren(true, tweens, timelines));
          }
        }

        child = child._next;
      }

      return a;
    };

    _proto2.getById = function getById(id) {
      var animations = this.getChildren(1, 1, 1),
          i = animations.length;

      while (i--) {
        if (animations[i].vars.id === id) {
          return animations[i];
        }
      }
    };

    _proto2.remove = function remove(child) {
      if (_isString(child)) {
        return this.removeLabel(child);
      }

      if (_isFunction(child)) {
        return this.killTweensOf(child);
      }

      _removeLinkedListItem(this, child);

      if (child === this._recent) {
        this._recent = this._last;
      }

      return _uncache(this);
    };

    _proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
      if (!arguments.length) {
        return this._tTime;
      }

      this._forcing = 1;

      if (!this._dp && this._ts) {
        this._start = _roundPrecise(_ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts));
      }

      _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);

      this._forcing = 0;
      return this;
    };

    _proto2.addLabel = function addLabel(label, position) {
      this.labels[label] = _parsePosition(this, position);
      return this;
    };

    _proto2.removeLabel = function removeLabel(label) {
      delete this.labels[label];
      return this;
    };

    _proto2.addPause = function addPause(position, callback, params) {
      var t = Tween.delayedCall(0, callback || _emptyFunc, params);
      t.data = "isPause";
      this._hasPause = 1;
      return _addToTimeline(this, t, _parsePosition(this, position));
    };

    _proto2.removePause = function removePause(position) {
      var child = this._first;
      position = _parsePosition(this, position);

      while (child) {
        if (child._start === position && child.data === "isPause") {
          _removeFromParent(child);
        }

        child = child._next;
      }
    };

    _proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
      var tweens = this.getTweensOf(targets, onlyActive),
          i = tweens.length;

      while (i--) {
        _overwritingTween !== tweens[i] && tweens[i].kill(targets, props);
      }

      return this;
    };

    _proto2.getTweensOf = function getTweensOf(targets, onlyActive) {
      var a = [],
          parsedTargets = toArray(targets),
          child = this._first,
          isGlobalTime = _isNumber(onlyActive),
          children;

      while (child) {
        if (child instanceof Tween) {
          if (_arrayContainsAny(child._targets, parsedTargets) && (isGlobalTime ? (!_overwritingTween || child._initted && child._ts) && child.globalTime(0) <= onlyActive && child.globalTime(child.totalDuration()) > onlyActive : !onlyActive || child.isActive())) {
            a.push(child);
          }
        } else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) {
          a.push.apply(a, children);
        }

        child = child._next;
      }

      return a;
    };

    _proto2.tweenTo = function tweenTo(position, vars) {
      vars = vars || {};

      var tl = this,
          endTime = _parsePosition(tl, position),
          _vars = vars,
          startAt = _vars.startAt,
          _onStart = _vars.onStart,
          onStartParams = _vars.onStartParams,
          immediateRender = _vars.immediateRender,
          initted,
          tween = Tween.to(tl, _setDefaults({
        ease: vars.ease || "none",
        lazy: false,
        immediateRender: false,
        time: endTime,
        overwrite: "auto",
        duration: vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale()) || _tinyNum,
        onStart: function onStart() {
          tl.pause();

          if (!initted) {
            var duration = vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale());
            tween._dur !== duration && _setDuration(tween, duration, 0, 1).render(tween._time, true, true);
            initted = 1;
          }

          _onStart && _onStart.apply(tween, onStartParams || []);
        }
      }, vars));

      return immediateRender ? tween.render(0) : tween;
    };

    _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
      return this.tweenTo(toPosition, _setDefaults({
        startAt: {
          time: _parsePosition(this, fromPosition)
        }
      }, vars));
    };

    _proto2.recent = function recent() {
      return this._recent;
    };

    _proto2.nextLabel = function nextLabel(afterTime) {
      if (afterTime === void 0) {
        afterTime = this._time;
      }

      return _getLabelInDirection(this, _parsePosition(this, afterTime));
    };

    _proto2.previousLabel = function previousLabel(beforeTime) {
      if (beforeTime === void 0) {
        beforeTime = this._time;
      }

      return _getLabelInDirection(this, _parsePosition(this, beforeTime), 1);
    };

    _proto2.currentLabel = function currentLabel(value) {
      return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum);
    };

    _proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
      if (ignoreBeforeTime === void 0) {
        ignoreBeforeTime = 0;
      }

      var child = this._first,
          labels = this.labels,
          p;

      while (child) {
        if (child._start >= ignoreBeforeTime) {
          child._start += amount;
          child._end += amount;
        }

        child = child._next;
      }

      if (adjustLabels) {
        for (p in labels) {
          if (labels[p] >= ignoreBeforeTime) {
            labels[p] += amount;
          }
        }
      }

      return _uncache(this);
    };

    _proto2.invalidate = function invalidate() {
      var child = this._first;
      this._lock = 0;

      while (child) {
        child.invalidate();
        child = child._next;
      }

      return _Animation.prototype.invalidate.call(this);
    };

    _proto2.clear = function clear(includeLabels) {
      if (includeLabels === void 0) {
        includeLabels = true;
      }

      var child = this._first,
          next;

      while (child) {
        next = child._next;
        this.remove(child);
        child = next;
      }

      this._dp && (this._time = this._tTime = this._pTime = 0);
      includeLabels && (this.labels = {});
      return _uncache(this);
    };

    _proto2.totalDuration = function totalDuration(value) {
      var max = 0,
          self = this,
          child = self._last,
          prevStart = _bigNum,
          prev,
          start,
          parent;

      if (arguments.length) {
        return self.timeScale((self._repeat < 0 ? self.duration() : self.totalDuration()) / (self.reversed() ? -value : value));
      }

      if (self._dirty) {
        parent = self.parent;

        while (child) {
          prev = child._prev;
          child._dirty && child.totalDuration();
          start = child._start;

          if (start > prevStart && self._sort && child._ts && !self._lock) {
            self._lock = 1;
            _addToTimeline(self, child, start - child._delay, 1)._lock = 0;
          } else {
            prevStart = start;
          }

          if (start < 0 && child._ts) {
            max -= start;

            if (!parent && !self._dp || parent && parent.smoothChildTiming) {
              self._start += start / self._ts;
              self._time -= start;
              self._tTime -= start;
            }

            self.shiftChildren(-start, false, -1e999);
            prevStart = 0;
          }

          child._end > max && child._ts && (max = child._end);
          child = prev;
        }

        _setDuration(self, self === _globalTimeline && self._time > max ? self._time : max, 1, 1);

        self._dirty = 0;
      }

      return self._tDur;
    };

    Timeline.updateRoot = function updateRoot(time) {
      if (_globalTimeline._ts) {
        _lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));

        _lastRenderedFrame = _ticker.frame;
      }

      if (_ticker.frame >= _nextGCFrame) {
        _nextGCFrame += _config.autoSleep || 120;
        var child = _globalTimeline._first;
        if (!child || !child._ts) if (_config.autoSleep && _ticker._listeners.length < 2) {
          while (child && !child._ts) {
            child = child._next;
          }

          child || _ticker.sleep();
        }
      }
    };

    return Timeline;
  }(Animation);

  _setDefaults(Timeline.prototype, {
    _lock: 0,
    _hasPause: 0,
    _forcing: 0
  });

  var _addComplexStringPropTween = function _addComplexStringPropTween(target, prop, start, end, setter, stringFilter, funcParam) {
    var pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter),
        index = 0,
        matchIndex = 0,
        result,
        startNums,
        color,
        endNum,
        chunk,
        startNum,
        hasRandom,
        a;
    pt.b = start;
    pt.e = end;
    start += "";
    end += "";

    if (hasRandom = ~end.indexOf("random(")) {
      end = _replaceRandom(end);
    }

    if (stringFilter) {
      a = [start, end];
      stringFilter(a, target, prop);
      start = a[0];
      end = a[1];
    }

    startNums = start.match(_complexStringNumExp) || [];

    while (result = _complexStringNumExp.exec(end)) {
      endNum = result[0];
      chunk = end.substring(index, result.index);

      if (color) {
        color = (color + 1) % 5;
      } else if (chunk.substr(-5) === "rgba(") {
        color = 1;
      }

      if (endNum !== startNums[matchIndex++]) {
        startNum = parseFloat(startNums[matchIndex - 1]) || 0;
        pt._pt = {
          _next: pt._pt,
          p: chunk || matchIndex === 1 ? chunk : ",",
          s: startNum,
          c: endNum.charAt(1) === "=" ? _parseRelative(startNum, endNum) - startNum : parseFloat(endNum) - startNum,
          m: color && color < 4 ? Math.round : 0
        };
        index = _complexStringNumExp.lastIndex;
      }
    }

    pt.c = index < end.length ? end.substring(index, end.length) : "";
    pt.fp = funcParam;

    if (_relExp.test(end) || hasRandom) {
      pt.e = 0;
    }

    this._pt = pt;
    return pt;
  },
      _addPropTween = function _addPropTween(target, prop, start, end, index, targets, modifier, stringFilter, funcParam) {
    _isFunction(end) && (end = end(index || 0, target, targets));
    var currentValue = target[prop],
        parsedStart = start !== "get" ? start : !_isFunction(currentValue) ? currentValue : funcParam ? target[prop.indexOf("set") || !_isFunction(target["get" + prop.substr(3)]) ? prop : "get" + prop.substr(3)](funcParam) : target[prop](),
        setter = !_isFunction(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc,
        pt;

    if (_isString(end)) {
      if (~end.indexOf("random(")) {
        end = _replaceRandom(end);
      }

      if (end.charAt(1) === "=") {
        pt = _parseRelative(parsedStart, end) + (getUnit(parsedStart) || 0);

        if (pt || pt === 0) {
          end = pt;
        }
      }
    }

    if (parsedStart !== end || _forceAllPropTweens) {
      if (!isNaN(parsedStart * end) && end !== "") {
        pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
        funcParam && (pt.fp = funcParam);
        modifier && pt.modifier(modifier, this, target);
        return this._pt = pt;
      }

      !currentValue && !(prop in target) && _missingPlugin(prop, end);
      return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam);
    }
  },
      _processVars = function _processVars(vars, index, target, targets, tween) {
    _isFunction(vars) && (vars = _parseFuncOrString(vars, tween, index, target, targets));

    if (!_isObject(vars) || vars.style && vars.nodeType || _isArray(vars) || _isTypedArray(vars)) {
      return _isString(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars;
    }

    var copy = {},
        p;

    for (p in vars) {
      copy[p] = _parseFuncOrString(vars[p], tween, index, target, targets);
    }

    return copy;
  },
      _checkPlugin = function _checkPlugin(property, vars, tween, index, target, targets) {
    var plugin, pt, ptLookup, i;

    if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== false) {
      tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);

      if (tween !== _quickTween) {
        ptLookup = tween._ptLookup[tween._targets.indexOf(target)];
        i = plugin._props.length;

        while (i--) {
          ptLookup[plugin._props[i]] = pt;
        }
      }
    }

    return plugin;
  },
      _overwritingTween,
      _forceAllPropTweens,
      _initTween = function _initTween(tween, time) {
    var vars = tween.vars,
        ease = vars.ease,
        startAt = vars.startAt,
        immediateRender = vars.immediateRender,
        lazy = vars.lazy,
        onUpdate = vars.onUpdate,
        onUpdateParams = vars.onUpdateParams,
        callbackScope = vars.callbackScope,
        runBackwards = vars.runBackwards,
        yoyoEase = vars.yoyoEase,
        keyframes = vars.keyframes,
        autoRevert = vars.autoRevert,
        dur = tween._dur,
        prevStartAt = tween._startAt,
        targets = tween._targets,
        parent = tween.parent,
        fullTargets = parent && parent.data === "nested" ? parent.parent._targets : targets,
        autoOverwrite = tween._overwrite === "auto" && !_suppressOverwrites,
        tl = tween.timeline,
        cleanVars,
        i,
        p,
        pt,
        target,
        hasPriority,
        gsData,
        harness,
        plugin,
        ptLookup,
        index,
        harnessVars,
        overwritten;
    tl && (!keyframes || !ease) && (ease = "none");
    tween._ease = _parseEase(ease, _defaults.ease);
    tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults.ease)) : 0;

    if (yoyoEase && tween._yoyo && !tween._repeat) {
      yoyoEase = tween._yEase;
      tween._yEase = tween._ease;
      tween._ease = yoyoEase;
    }

    tween._from = !tl && !!vars.runBackwards;

    if (!tl || keyframes && !vars.stagger) {
      harness = targets[0] ? _getCache(targets[0]).harness : 0;
      harnessVars = harness && vars[harness.prop];
      cleanVars = _copyExcluding(vars, _reservedProps);

      if (prevStartAt) {
        _removeFromParent(prevStartAt.render(-1, true));

        prevStartAt._lazy = 0;
      }

      if (startAt) {
        _removeFromParent(tween._startAt = Tween.set(targets, _setDefaults({
          data: "isStart",
          overwrite: false,
          parent: parent,
          immediateRender: true,
          lazy: _isNotFalse(lazy),
          startAt: null,
          delay: 0,
          onUpdate: onUpdate,
          onUpdateParams: onUpdateParams,
          callbackScope: callbackScope,
          stagger: 0
        }, startAt)));

        time < 0 && !immediateRender && !autoRevert && tween._startAt.render(-1, true);

        if (immediateRender) {
          time > 0 && !autoRevert && (tween._startAt = 0);

          if (dur && time <= 0) {
            time && (tween._zTime = time);
            return;
          }
        } else if (autoRevert === false) {
          tween._startAt = 0;
        }
      } else if (runBackwards && dur) {
        if (prevStartAt) {
          !autoRevert && (tween._startAt = 0);
        } else {
          time && (immediateRender = false);
          p = _setDefaults({
            overwrite: false,
            data: "isFromStart",
            lazy: immediateRender && _isNotFalse(lazy),
            immediateRender: immediateRender,
            stagger: 0,
            parent: parent
          }, cleanVars);
          harnessVars && (p[harness.prop] = harnessVars);

          _removeFromParent(tween._startAt = Tween.set(targets, p));

          time < 0 && tween._startAt.render(-1, true);
          tween._zTime = time;

          if (!immediateRender) {
            _initTween(tween._startAt, _tinyNum);
          } else if (!time) {
            return;
          }
        }
      }

      tween._pt = tween._ptCache = 0;
      lazy = dur && _isNotFalse(lazy) || lazy && !dur;

      for (i = 0; i < targets.length; i++) {
        target = targets[i];
        gsData = target._gsap || _harness(targets)[i]._gsap;
        tween._ptLookup[i] = ptLookup = {};
        _lazyLookup[gsData.id] && _lazyTweens.length && _lazyRender();
        index = fullTargets === targets ? i : fullTargets.indexOf(target);

        if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
          tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);

          plugin._props.forEach(function (name) {
            ptLookup[name] = pt;
          });

          plugin.priority && (hasPriority = 1);
        }

        if (!harness || harnessVars) {
          for (p in cleanVars) {
            if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) {
              plugin.priority && (hasPriority = 1);
            } else {
              ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index, fullTargets, 0, vars.stringFilter);
            }
          }
        }

        tween._op && tween._op[i] && tween.kill(target, tween._op[i]);

        if (autoOverwrite && tween._pt) {
          _overwritingTween = tween;

          _globalTimeline.killTweensOf(target, ptLookup, tween.globalTime(time));

          overwritten = !tween.parent;
          _overwritingTween = 0;
        }

        tween._pt && lazy && (_lazyLookup[gsData.id] = 1);
      }

      hasPriority && _sortPropTweensByPriority(tween);
      tween._onInit && tween._onInit(tween);
    }

    tween._onUpdate = onUpdate;
    tween._initted = (!tween._op || tween._pt) && !overwritten;
    keyframes && time <= 0 && tl.render(_bigNum, true, true);
  },
      _updatePropTweens = function _updatePropTweens(tween, property, value, start, startIsRelative, ratio, time) {
    var ptCache = (tween._pt && tween._ptCache || (tween._ptCache = {}))[property],
        pt,
        lookup,
        i;

    if (!ptCache) {
      ptCache = tween._ptCache[property] = [];
      lookup = tween._ptLookup;
      i = tween._targets.length;

      while (i--) {
        pt = lookup[i][property];

        if (pt && pt.d && pt.d._pt) {
          pt = pt.d._pt;

          while (pt && pt.p !== property) {
            pt = pt._next;
          }
        }

        if (!pt) {
          _forceAllPropTweens = 1;
          tween.vars[property] = "+=0";

          _initTween(tween, time);

          _forceAllPropTweens = 0;
          return 1;
        }

        ptCache.push(pt);
      }
    }

    i = ptCache.length;

    while (i--) {
      pt = ptCache[i];
      pt.s = (start || start === 0) && !startIsRelative ? start : pt.s + (start || 0) + ratio * pt.c;
      pt.c = value - pt.s;
      pt.e && (pt.e = _round(value) + getUnit(pt.e));
      pt.b && (pt.b = pt.s + getUnit(pt.b));
    }
  },
      _addAliasesToVars = function _addAliasesToVars(targets, vars) {
    var harness = targets[0] ? _getCache(targets[0]).harness : 0,
        propertyAliases = harness && harness.aliases,
        copy,
        p,
        i,
        aliases;

    if (!propertyAliases) {
      return vars;
    }

    copy = _merge({}, vars);

    for (p in propertyAliases) {
      if (p in copy) {
        aliases = propertyAliases[p].split(",");
        i = aliases.length;

        while (i--) {
          copy[aliases[i]] = copy[p];
        }
      }
    }

    return copy;
  },
      _parseKeyframe = function _parseKeyframe(prop, obj, allProps, easeEach) {
    var ease = obj.ease || easeEach || "power1.inOut",
        p,
        a;

    if (_isArray(obj)) {
      a = allProps[prop] || (allProps[prop] = []);
      obj.forEach(function (value, i) {
        return a.push({
          t: i / (obj.length - 1) * 100,
          v: value,
          e: ease
        });
      });
    } else {
      for (p in obj) {
        a = allProps[p] || (allProps[p] = []);
        p === "ease" || a.push({
          t: parseFloat(prop),
          v: obj[p],
          e: ease
        });
      }
    }
  },
      _parseFuncOrString = function _parseFuncOrString(value, tween, i, target, targets) {
    return _isFunction(value) ? value.call(tween, i, target, targets) : _isString(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value;
  },
      _staggerTweenProps = _callbackNames + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert",
      _staggerPropsToSkip = {};

  _forEachName(_staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger", function (name) {
    return _staggerPropsToSkip[name] = 1;
  });

  var Tween = function (_Animation2) {
    _inheritsLoose(Tween, _Animation2);

    function Tween(targets, vars, position, skipInherit) {
      var _this3;

      if (typeof vars === "number") {
        position.duration = vars;
        vars = position;
        position = null;
      }

      _this3 = _Animation2.call(this, skipInherit ? vars : _inheritDefaults(vars)) || this;
      var _this3$vars = _this3.vars,
          duration = _this3$vars.duration,
          delay = _this3$vars.delay,
          immediateRender = _this3$vars.immediateRender,
          stagger = _this3$vars.stagger,
          overwrite = _this3$vars.overwrite,
          keyframes = _this3$vars.keyframes,
          defaults = _this3$vars.defaults,
          scrollTrigger = _this3$vars.scrollTrigger,
          yoyoEase = _this3$vars.yoyoEase,
          parent = vars.parent || _globalTimeline,
          parsedTargets = (_isArray(targets) || _isTypedArray(targets) ? _isNumber(targets[0]) : "length" in vars) ? [targets] : toArray(targets),
          tl,
          i,
          copy,
          l,
          p,
          curTarget,
          staggerFunc,
          staggerVarsToMerge;
      _this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://greensock.com", !_config.nullTargetWarn) || [];
      _this3._ptLookup = [];
      _this3._overwrite = overwrite;

      if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
        vars = _this3.vars;
        tl = _this3.timeline = new Timeline({
          data: "nested",
          defaults: defaults || {}
        });
        tl.kill();
        tl.parent = tl._dp = _assertThisInitialized(_this3);
        tl._start = 0;

        if (stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
          l = parsedTargets.length;
          staggerFunc = stagger && distribute(stagger);

          if (_isObject(stagger)) {
            for (p in stagger) {
              if (~_staggerTweenProps.indexOf(p)) {
                staggerVarsToMerge || (staggerVarsToMerge = {});
                staggerVarsToMerge[p] = stagger[p];
              }
            }
          }

          for (i = 0; i < l; i++) {
            copy = _copyExcluding(vars, _staggerPropsToSkip);
            copy.stagger = 0;
            yoyoEase && (copy.yoyoEase = yoyoEase);
            staggerVarsToMerge && _merge(copy, staggerVarsToMerge);
            curTarget = parsedTargets[i];
            copy.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this3), i, curTarget, parsedTargets);
            copy.delay = (+_parseFuncOrString(delay, _assertThisInitialized(_this3), i, curTarget, parsedTargets) || 0) - _this3._delay;

            if (!stagger && l === 1 && copy.delay) {
              _this3._delay = delay = copy.delay;
              _this3._start += delay;
              copy.delay = 0;
            }

            tl.to(curTarget, copy, staggerFunc ? staggerFunc(i, curTarget, parsedTargets) : 0);
            tl._ease = _easeMap.none;
          }

          tl.duration() ? duration = delay = 0 : _this3.timeline = 0;
        } else if (keyframes) {
          _inheritDefaults(_setDefaults(tl.vars.defaults, {
            ease: "none"
          }));

          tl._ease = _parseEase(keyframes.ease || vars.ease || "none");
          var time = 0,
              a,
              kf,
              v;

          if (_isArray(keyframes)) {
            keyframes.forEach(function (frame) {
              return tl.to(parsedTargets, frame, ">");
            });
          } else {
            copy = {};

            for (p in keyframes) {
              p === "ease" || p === "easeEach" || _parseKeyframe(p, keyframes[p], copy, keyframes.easeEach);
            }

            for (p in copy) {
              a = copy[p].sort(function (a, b) {
                return a.t - b.t;
              });
              time = 0;

              for (i = 0; i < a.length; i++) {
                kf = a[i];
                v = {
                  ease: kf.e,
                  duration: (kf.t - (i ? a[i - 1].t : 0)) / 100 * duration
                };
                v[p] = kf.v;
                tl.to(parsedTargets, v, time);
                time += v.duration;
              }
            }

            tl.duration() < duration && tl.to({}, {
              duration: duration - tl.duration()
            });
          }
        }

        duration || _this3.duration(duration = tl.duration());
      } else {
        _this3.timeline = 0;
      }

      if (overwrite === true && !_suppressOverwrites) {
        _overwritingTween = _assertThisInitialized(_this3);

        _globalTimeline.killTweensOf(parsedTargets);

        _overwritingTween = 0;
      }

      _addToTimeline(parent, _assertThisInitialized(_this3), position);

      vars.reversed && _this3.reverse();
      vars.paused && _this3.paused(true);

      if (immediateRender || !duration && !keyframes && _this3._start === _roundPrecise(parent._time) && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this3)) && parent.data !== "nested") {
        _this3._tTime = -_tinyNum;

        _this3.render(Math.max(0, -delay));
      }

      scrollTrigger && _scrollTrigger(_assertThisInitialized(_this3), scrollTrigger);
      return _this3;
    }

    var _proto3 = Tween.prototype;

    _proto3.render = function render(totalTime, suppressEvents, force) {
      var prevTime = this._time,
          tDur = this._tDur,
          dur = this._dur,
          tTime = totalTime > tDur - _tinyNum && totalTime >= 0 ? tDur : totalTime < _tinyNum ? 0 : totalTime,
          time,
          pt,
          iteration,
          cycleDuration,
          prevIteration,
          isYoyo,
          ratio,
          timeline,
          yoyoEase;

      if (!dur) {
        _renderZeroDurationTween(this, totalTime, suppressEvents, force);
      } else if (tTime !== this._tTime || !totalTime || force || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== totalTime < 0) {
        time = tTime;
        timeline = this.timeline;

        if (this._repeat) {
          cycleDuration = dur + this._rDelay;

          if (this._repeat < -1 && totalTime < 0) {
            return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
          }

          time = _roundPrecise(tTime % cycleDuration);

          if (tTime === tDur) {
            iteration = this._repeat;
            time = dur;
          } else {
            iteration = ~~(tTime / cycleDuration);

            if (iteration && iteration === tTime / cycleDuration) {
              time = dur;
              iteration--;
            }

            time > dur && (time = dur);
          }

          isYoyo = this._yoyo && iteration & 1;

          if (isYoyo) {
            yoyoEase = this._yEase;
            time = dur - time;
          }

          prevIteration = _animationCycle(this._tTime, cycleDuration);

          if (time === prevTime && !force && this._initted) {
            this._tTime = tTime;
            return this;
          }

          if (iteration !== prevIteration) {
            timeline && this._yEase && _propagateYoyoEase(timeline, isYoyo);

            if (this.vars.repeatRefresh && !isYoyo && !this._lock) {
              this._lock = force = 1;
              this.render(_roundPrecise(cycleDuration * iteration), true).invalidate()._lock = 0;
            }
          }
        }

        if (!this._initted) {
          if (_attemptInitTween(this, totalTime < 0 ? totalTime : time, force, suppressEvents)) {
            this._tTime = 0;
            return this;
          }

          if (prevTime !== this._time) {
            return this;
          }

          if (dur !== this._dur) {
            return this.render(totalTime, suppressEvents, force);
          }
        }

        this._tTime = tTime;
        this._time = time;

        if (!this._act && this._ts) {
          this._act = 1;
          this._lazy = 0;
        }

        this.ratio = ratio = (yoyoEase || this._ease)(time / dur);

        if (this._from) {
          this.ratio = ratio = 1 - ratio;
        }

        if (time && !prevTime && !suppressEvents) {
          _callback(this, "onStart");

          if (this._tTime !== tTime) {
            return this;
          }
        }

        pt = this._pt;

        while (pt) {
          pt.r(ratio, pt.d);
          pt = pt._next;
        }

        timeline && timeline.render(totalTime < 0 ? totalTime : !time && isYoyo ? -_tinyNum : timeline._dur * timeline._ease(time / this._dur), suppressEvents, force) || this._startAt && (this._zTime = totalTime);

        if (this._onUpdate && !suppressEvents) {
          totalTime < 0 && this._startAt && this._startAt.render(totalTime, true, force);

          _callback(this, "onUpdate");
        }

        this._repeat && iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent && _callback(this, "onRepeat");

        if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
          totalTime < 0 && this._startAt && !this._onUpdate && this._startAt.render(totalTime, true, true);
          (totalTime || !dur) && (tTime === this._tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);

          if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime)) {
            _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);

            this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
          }
        }
      }

      return this;
    };

    _proto3.targets = function targets() {
      return this._targets;
    };

    _proto3.invalidate = function invalidate() {
      this._pt = this._op = this._startAt = this._onUpdate = this._lazy = this.ratio = 0;
      this._ptLookup = [];
      this.timeline && this.timeline.invalidate();
      return _Animation2.prototype.invalidate.call(this);
    };

    _proto3.resetTo = function resetTo(property, value, start, startIsRelative) {
      _tickerActive || _ticker.wake();
      this._ts || this.play();
      var time = Math.min(this._dur, (this._dp._time - this._start) * this._ts),
          ratio;
      this._initted || _initTween(this, time);
      ratio = this._ease(time / this._dur);

      if (_updatePropTweens(this, property, value, start, startIsRelative, ratio, time)) {
        return this.resetTo(property, value, start, startIsRelative);
      }

      _alignPlayhead(this, 0);

      this.parent || _addLinkedListItem(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0);
      return this.render(0);
    };

    _proto3.kill = function kill(targets, vars) {
      if (vars === void 0) {
        vars = "all";
      }

      if (!targets && (!vars || vars === "all")) {
        this._lazy = this._pt = 0;
        return this.parent ? _interrupt(this) : this;
      }

      if (this.timeline) {
        var tDur = this.timeline.totalDuration();
        this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true)._first || _interrupt(this);
        this.parent && tDur !== this.timeline.totalDuration() && _setDuration(this, this._dur * this.timeline._tDur / tDur, 0, 1);
        return this;
      }

      var parsedTargets = this._targets,
          killingTargets = targets ? toArray(targets) : parsedTargets,
          propTweenLookup = this._ptLookup,
          firstPT = this._pt,
          overwrittenProps,
          curLookup,
          curOverwriteProps,
          props,
          p,
          pt,
          i;

      if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
        vars === "all" && (this._pt = 0);
        return _interrupt(this);
      }

      overwrittenProps = this._op = this._op || [];

      if (vars !== "all") {
        if (_isString(vars)) {
          p = {};

          _forEachName(vars, function (name) {
            return p[name] = 1;
          });

          vars = p;
        }

        vars = _addAliasesToVars(parsedTargets, vars);
      }

      i = parsedTargets.length;

      while (i--) {
        if (~killingTargets.indexOf(parsedTargets[i])) {
          curLookup = propTweenLookup[i];

          if (vars === "all") {
            overwrittenProps[i] = vars;
            props = curLookup;
            curOverwriteProps = {};
          } else {
            curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {};
            props = vars;
          }

          for (p in props) {
            pt = curLookup && curLookup[p];

            if (pt) {
              if (!("kill" in pt.d) || pt.d.kill(p) === true) {
                _removeLinkedListItem(this, pt, "_pt");
              }

              delete curLookup[p];
            }

            if (curOverwriteProps !== "all") {
              curOverwriteProps[p] = 1;
            }
          }
        }
      }

      this._initted && !this._pt && firstPT && _interrupt(this);
      return this;
    };

    Tween.to = function to(targets, vars) {
      return new Tween(targets, vars, arguments[2]);
    };

    Tween.from = function from(targets, vars) {
      return _createTweenType(1, arguments);
    };

    Tween.delayedCall = function delayedCall(delay, callback, params, scope) {
      return new Tween(callback, 0, {
        immediateRender: false,
        lazy: false,
        overwrite: false,
        delay: delay,
        onComplete: callback,
        onReverseComplete: callback,
        onCompleteParams: params,
        onReverseCompleteParams: params,
        callbackScope: scope
      });
    };

    Tween.fromTo = function fromTo(targets, fromVars, toVars) {
      return _createTweenType(2, arguments);
    };

    Tween.set = function set(targets, vars) {
      vars.duration = 0;
      vars.repeatDelay || (vars.repeat = 0);
      return new Tween(targets, vars);
    };

    Tween.killTweensOf = function killTweensOf(targets, props, onlyActive) {
      return _globalTimeline.killTweensOf(targets, props, onlyActive);
    };

    return Tween;
  }(Animation);

  _setDefaults(Tween.prototype, {
    _targets: [],
    _lazy: 0,
    _startAt: 0,
    _op: 0,
    _onInit: 0
  });

  _forEachName("staggerTo,staggerFrom,staggerFromTo", function (name) {
    Tween[name] = function () {
      var tl = new Timeline(),
          params = _slice.call(arguments, 0);

      params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
      return tl[name].apply(tl, params);
    };
  });

  var _setterPlain = function _setterPlain(target, property, value) {
    return target[property] = value;
  },
      _setterFunc = function _setterFunc(target, property, value) {
    return target[property](value);
  },
      _setterFuncWithParam = function _setterFuncWithParam(target, property, value, data) {
    return target[property](data.fp, value);
  },
      _setterAttribute = function _setterAttribute(target, property, value) {
    return target.setAttribute(property, value);
  },
      _getSetter = function _getSetter(target, property) {
    return _isFunction(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain;
  },
      _renderPlain = function _renderPlain(ratio, data) {
    return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1000000) / 1000000, data);
  },
      _renderBoolean = function _renderBoolean(ratio, data) {
    return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
  },
      _renderComplexString = function _renderComplexString(ratio, data) {
    var pt = data._pt,
        s = "";

    if (!ratio && data.b) {
      s = data.b;
    } else if (ratio === 1 && data.e) {
      s = data.e;
    } else {
      while (pt) {
        s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 10000) / 10000) + s;
        pt = pt._next;
      }

      s += data.c;
    }

    data.set(data.t, data.p, s, data);
  },
      _renderPropTweens = function _renderPropTweens(ratio, data) {
    var pt = data._pt;

    while (pt) {
      pt.r(ratio, pt.d);
      pt = pt._next;
    }
  },
      _addPluginModifier = function _addPluginModifier(modifier, tween, target, property) {
    var pt = this._pt,
        next;

    while (pt) {
      next = pt._next;
      pt.p === property && pt.modifier(modifier, tween, target);
      pt = next;
    }
  },
      _killPropTweensOf = function _killPropTweensOf(property) {
    var pt = this._pt,
        hasNonDependentRemaining,
        next;

    while (pt) {
      next = pt._next;

      if (pt.p === property && !pt.op || pt.op === property) {
        _removeLinkedListItem(this, pt, "_pt");
      } else if (!pt.dep) {
        hasNonDependentRemaining = 1;
      }

      pt = next;
    }

    return !hasNonDependentRemaining;
  },
      _setterWithModifier = function _setterWithModifier(target, property, value, data) {
    data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
  },
      _sortPropTweensByPriority = function _sortPropTweensByPriority(parent) {
    var pt = parent._pt,
        next,
        pt2,
        first,
        last;

    while (pt) {
      next = pt._next;
      pt2 = first;

      while (pt2 && pt2.pr > pt.pr) {
        pt2 = pt2._next;
      }

      if (pt._prev = pt2 ? pt2._prev : last) {
        pt._prev._next = pt;
      } else {
        first = pt;
      }

      if (pt._next = pt2) {
        pt2._prev = pt;
      } else {
        last = pt;
      }

      pt = next;
    }

    parent._pt = first;
  };

  var PropTween = function () {
    function PropTween(next, target, prop, start, change, renderer, data, setter, priority) {
      this.t = target;
      this.s = start;
      this.c = change;
      this.p = prop;
      this.r = renderer || _renderPlain;
      this.d = data || this;
      this.set = setter || _setterPlain;
      this.pr = priority || 0;
      this._next = next;

      if (next) {
        next._prev = this;
      }
    }

    var _proto4 = PropTween.prototype;

    _proto4.modifier = function modifier(func, tween, target) {
      this.mSet = this.mSet || this.set;
      this.set = _setterWithModifier;
      this.m = func;
      this.mt = target;
      this.tween = tween;
    };

    return PropTween;
  }();

  _forEachName(_callbackNames + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function (name) {
    return _reservedProps[name] = 1;
  });

  _globals.TweenMax = _globals.TweenLite = Tween;
  _globals.TimelineLite = _globals.TimelineMax = Timeline;
  _globalTimeline = new Timeline({
    sortChildren: false,
    defaults: _defaults,
    autoRemoveChildren: true,
    id: "root",
    smoothChildTiming: true
  });
  _config.stringFilter = _colorStringFilter;
  var _gsap = {
    registerPlugin: function registerPlugin() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      args.forEach(function (config) {
        return _createPlugin(config);
      });
    },
    timeline: function timeline(vars) {
      return new Timeline(vars);
    },
    getTweensOf: function getTweensOf(targets, onlyActive) {
      return _globalTimeline.getTweensOf(targets, onlyActive);
    },
    getProperty: function getProperty(target, property, unit, uncache) {
      _isString(target) && (target = toArray(target)[0]);

      var getter = _getCache(target || {}).get,
          format = unit ? _passThrough : _numericIfPossible;

      unit === "native" && (unit = "");
      return !target ? target : !property ? function (property, unit, uncache) {
        return format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
      } : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
    },
    quickSetter: function quickSetter(target, property, unit) {
      target = toArray(target);

      if (target.length > 1) {
        var setters = target.map(function (t) {
          return gsap.quickSetter(t, property, unit);
        }),
            l = setters.length;
        return function (value) {
          var i = l;

          while (i--) {
            setters[i](value);
          }
        };
      }

      target = target[0] || {};

      var Plugin = _plugins[property],
          cache = _getCache(target),
          p = cache.harness && (cache.harness.aliases || {})[property] || property,
          setter = Plugin ? function (value) {
        var p = new Plugin();
        _quickTween._pt = 0;
        p.init(target, unit ? value + unit : value, _quickTween, 0, [target]);
        p.render(1, p);
        _quickTween._pt && _renderPropTweens(1, _quickTween);
      } : cache.set(target, p);

      return Plugin ? setter : function (value) {
        return setter(target, p, unit ? value + unit : value, cache, 1);
      };
    },
    quickTo: function quickTo(target, property, vars) {
      var _merge2;

      var tween = gsap.to(target, _merge((_merge2 = {}, _merge2[property] = "+=0.1", _merge2.paused = true, _merge2), vars || {})),
          func = function func(value, start, startIsRelative) {
        return tween.resetTo(property, value, start, startIsRelative);
      };

      func.tween = tween;
      return func;
    },
    isTweening: function isTweening(targets) {
      return _globalTimeline.getTweensOf(targets, true).length > 0;
    },
    defaults: function defaults(value) {
      value && value.ease && (value.ease = _parseEase(value.ease, _defaults.ease));
      return _mergeDeep(_defaults, value || {});
    },
    config: function config(value) {
      return _mergeDeep(_config, value || {});
    },
    registerEffect: function registerEffect(_ref3) {
      var name = _ref3.name,
          effect = _ref3.effect,
          plugins = _ref3.plugins,
          defaults = _ref3.defaults,
          extendTimeline = _ref3.extendTimeline;
      (plugins || "").split(",").forEach(function (pluginName) {
        return pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin.");
      });

      _effects[name] = function (targets, vars, tl) {
        return effect(toArray(targets), _setDefaults(vars || {}, defaults), tl);
      };

      if (extendTimeline) {
        Timeline.prototype[name] = function (targets, vars, position) {
          return this.add(_effects[name](targets, _isObject(vars) ? vars : (position = vars) && {}, this), position);
        };
      }
    },
    registerEase: function registerEase(name, ease) {
      _easeMap[name] = _parseEase(ease);
    },
    parseEase: function parseEase(ease, defaultEase) {
      return arguments.length ? _parseEase(ease, defaultEase) : _easeMap;
    },
    getById: function getById(id) {
      return _globalTimeline.getById(id);
    },
    exportRoot: function exportRoot(vars, includeDelayedCalls) {
      if (vars === void 0) {
        vars = {};
      }

      var tl = new Timeline(vars),
          child,
          next;
      tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);

      _globalTimeline.remove(tl);

      tl._dp = 0;
      tl._time = tl._tTime = _globalTimeline._time;
      child = _globalTimeline._first;

      while (child) {
        next = child._next;

        if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) {
          _addToTimeline(tl, child, child._start - child._delay);
        }

        child = next;
      }

      _addToTimeline(_globalTimeline, tl, 0);

      return tl;
    },
    utils: {
      wrap: wrap,
      wrapYoyo: wrapYoyo,
      distribute: distribute,
      random: random,
      snap: snap,
      normalize: normalize,
      getUnit: getUnit,
      clamp: clamp,
      splitColor: splitColor,
      toArray: toArray,
      selector: selector,
      mapRange: mapRange,
      pipe: pipe,
      unitize: unitize,
      interpolate: interpolate,
      shuffle: shuffle
    },
    install: _install,
    effects: _effects,
    ticker: _ticker,
    updateRoot: Timeline.updateRoot,
    plugins: _plugins,
    globalTimeline: _globalTimeline,
    core: {
      PropTween: PropTween,
      globals: _addGlobal,
      Tween: Tween,
      Timeline: Timeline,
      Animation: Animation,
      getCache: _getCache,
      _removeLinkedListItem: _removeLinkedListItem,
      suppressOverwrites: function suppressOverwrites(value) {
        return _suppressOverwrites = value;
      }
    }
  };

  _forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function (name) {
    return _gsap[name] = Tween[name];
  });

  _ticker.add(Timeline.updateRoot);

  _quickTween = _gsap.to({}, {
    duration: 0
  });

  var _getPluginPropTween = function _getPluginPropTween(plugin, prop) {
    var pt = plugin._pt;

    while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) {
      pt = pt._next;
    }

    return pt;
  },
      _addModifiers = function _addModifiers(tween, modifiers) {
    var targets = tween._targets,
        p,
        i,
        pt;

    for (p in modifiers) {
      i = targets.length;

      while (i--) {
        pt = tween._ptLookup[i][p];

        if (pt && (pt = pt.d)) {
          if (pt._pt) {
            pt = _getPluginPropTween(pt, p);
          }

          pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p);
        }
      }
    }
  },
      _buildModifierPlugin = function _buildModifierPlugin(name, modifier) {
    return {
      name: name,
      rawVars: 1,
      init: function init(target, vars, tween) {
        tween._onInit = function (tween) {
          var temp, p;

          if (_isString(vars)) {
            temp = {};

            _forEachName(vars, function (name) {
              return temp[name] = 1;
            });

            vars = temp;
          }

          if (modifier) {
            temp = {};

            for (p in vars) {
              temp[p] = modifier(vars[p]);
            }

            vars = temp;
          }

          _addModifiers(tween, vars);
        };
      }
    };
  };

  var gsap = _gsap.registerPlugin({
    name: "attr",
    init: function init(target, vars, tween, index, targets) {
      var p, pt;

      for (p in vars) {
        pt = this.add(target, "setAttribute", (target.getAttribute(p) || 0) + "", vars[p], index, targets, 0, 0, p);
        pt && (pt.op = p);

        this._props.push(p);
      }
    }
  }, {
    name: "endArray",
    init: function init(target, value) {
      var i = value.length;

      while (i--) {
        this.add(target, i, target[i] || 0, value[i]);
      }
    }
  }, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap;
  Tween.version = Timeline.version = gsap.version = "3.10.2";
  _coreReady = 1;
  _windowExists() && _wake();
  var Power0 = _easeMap.Power0,
      Power1 = _easeMap.Power1,
      Power2 = _easeMap.Power2,
      Power3 = _easeMap.Power3,
      Power4 = _easeMap.Power4,
      Linear = _easeMap.Linear,
      Quad = _easeMap.Quad,
      Cubic = _easeMap.Cubic,
      Quart = _easeMap.Quart,
      Quint = _easeMap.Quint,
      Strong = _easeMap.Strong,
      Elastic = _easeMap.Elastic,
      Back = _easeMap.Back,
      SteppedEase = _easeMap.SteppedEase,
      Bounce = _easeMap.Bounce,
      Sine = _easeMap.Sine,
      Expo = _easeMap.Expo,
      Circ = _easeMap.Circ;

  var _win$1,
      _doc$1,
      _docElement,
      _pluginInitted,
      _tempDiv,
      _tempDivStyler,
      _recentSetterPlugin,
      _windowExists$1 = function _windowExists() {
    return typeof window !== "undefined";
  },
      _transformProps = {},
      _RAD2DEG = 180 / Math.PI,
      _DEG2RAD = Math.PI / 180,
      _atan2 = Math.atan2,
      _bigNum$1 = 1e8,
      _capsExp = /([A-Z])/g,
      _horizontalExp = /(left|right|width|margin|padding|x)/i,
      _complexExp = /[\s,\(]\S/,
      _propertyAliases = {
    autoAlpha: "opacity,visibility",
    scale: "scaleX,scaleY",
    alpha: "opacity"
  },
      _renderCSSProp = function _renderCSSProp(ratio, data) {
    return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u, data);
  },
      _renderPropWithEnd = function _renderPropWithEnd(ratio, data) {
    return data.set(data.t, data.p, ratio === 1 ? data.e : Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u, data);
  },
      _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning(ratio, data) {
    return data.set(data.t, data.p, ratio ? Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u : data.b, data);
  },
      _renderRoundedCSSProp = function _renderRoundedCSSProp(ratio, data) {
    var value = data.s + data.c * ratio;
    data.set(data.t, data.p, ~~(value + (value < 0 ? -.5 : .5)) + data.u, data);
  },
      _renderNonTweeningValue = function _renderNonTweeningValue(ratio, data) {
    return data.set(data.t, data.p, ratio ? data.e : data.b, data);
  },
      _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd(ratio, data) {
    return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data);
  },
      _setterCSSStyle = function _setterCSSStyle(target, property, value) {
    return target.style[property] = value;
  },
      _setterCSSProp = function _setterCSSProp(target, property, value) {
    return target.style.setProperty(property, value);
  },
      _setterTransform = function _setterTransform(target, property, value) {
    return target._gsap[property] = value;
  },
      _setterScale = function _setterScale(target, property, value) {
    return target._gsap.scaleX = target._gsap.scaleY = value;
  },
      _setterScaleWithRender = function _setterScaleWithRender(target, property, value, data, ratio) {
    var cache = target._gsap;
    cache.scaleX = cache.scaleY = value;
    cache.renderTransform(ratio, cache);
  },
      _setterTransformWithRender = function _setterTransformWithRender(target, property, value, data, ratio) {
    var cache = target._gsap;
    cache[property] = value;
    cache.renderTransform(ratio, cache);
  },
      _transformProp = "transform",
      _transformOriginProp = _transformProp + "Origin",
      _supports3D,
      _createElement = function _createElement(type, ns) {
    var e = _doc$1.createElementNS ? _doc$1.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc$1.createElement(type);
    return e.style ? e : _doc$1.createElement(type);
  },
      _getComputedProperty = function _getComputedProperty(target, property, skipPrefixFallback) {
    var cs = getComputedStyle(target);
    return cs[property] || cs.getPropertyValue(property.replace(_capsExp, "-$1").toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty(target, _checkPropPrefix(property) || property, 1) || "";
  },
      _prefixes = "O,Moz,ms,Ms,Webkit".split(","),
      _checkPropPrefix = function _checkPropPrefix(property, element, preferPrefix) {
    var e = element || _tempDiv,
        s = e.style,
        i = 5;

    if (property in s && !preferPrefix) {
      return property;
    }

    property = property.charAt(0).toUpperCase() + property.substr(1);

    while (i-- && !(_prefixes[i] + property in s)) {}

    return i < 0 ? null : (i === 3 ? "ms" : i >= 0 ? _prefixes[i] : "") + property;
  },
      _initCore = function _initCore() {
    if (_windowExists$1() && window.document) {
      _win$1 = window;
      _doc$1 = _win$1.document;
      _docElement = _doc$1.documentElement;
      _tempDiv = _createElement("div") || {
        style: {}
      };
      _tempDivStyler = _createElement("div");
      _transformProp = _checkPropPrefix(_transformProp);
      _transformOriginProp = _transformProp + "Origin";
      _tempDiv.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0";
      _supports3D = !!_checkPropPrefix("perspective");
      _pluginInitted = 1;
    }
  },
      _getBBoxHack = function _getBBoxHack(swapIfPossible) {
    var svg = _createElement("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
        oldParent = this.parentNode,
        oldSibling = this.nextSibling,
        oldCSS = this.style.cssText,
        bbox;

    _docElement.appendChild(svg);

    svg.appendChild(this);
    this.style.display = "block";

    if (swapIfPossible) {
      try {
        bbox = this.getBBox();
        this._gsapBBox = this.getBBox;
        this.getBBox = _getBBoxHack;
      } catch (e) {}
    } else if (this._gsapBBox) {
      bbox = this._gsapBBox();
    }

    if (oldParent) {
      if (oldSibling) {
        oldParent.insertBefore(this, oldSibling);
      } else {
        oldParent.appendChild(this);
      }
    }

    _docElement.removeChild(svg);

    this.style.cssText = oldCSS;
    return bbox;
  },
      _getAttributeFallbacks = function _getAttributeFallbacks(target, attributesArray) {
    var i = attributesArray.length;

    while (i--) {
      if (target.hasAttribute(attributesArray[i])) {
        return target.getAttribute(attributesArray[i]);
      }
    }
  },
      _getBBox = function _getBBox(target) {
    var bounds;

    try {
      bounds = target.getBBox();
    } catch (error) {
      bounds = _getBBoxHack.call(target, true);
    }

    bounds && (bounds.width || bounds.height) || target.getBBox === _getBBoxHack || (bounds = _getBBoxHack.call(target, true));
    return bounds && !bounds.width && !bounds.x && !bounds.y ? {
      x: +_getAttributeFallbacks(target, ["x", "cx", "x1"]) || 0,
      y: +_getAttributeFallbacks(target, ["y", "cy", "y1"]) || 0,
      width: 0,
      height: 0
    } : bounds;
  },
      _isSVG = function _isSVG(e) {
    return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e));
  },
      _removeProperty = function _removeProperty(target, property) {
    if (property) {
      var style = target.style;

      if (property in _transformProps && property !== _transformOriginProp) {
        property = _transformProp;
      }

      if (style.removeProperty) {
        if (property.substr(0, 2) === "ms" || property.substr(0, 6) === "webkit") {
          property = "-" + property;
        }

        style.removeProperty(property.replace(_capsExp, "-$1").toLowerCase());
      } else {
        style.removeAttribute(property);
      }
    }
  },
      _addNonTweeningPT = function _addNonTweeningPT(plugin, target, property, beginning, end, onlySetAtEnd) {
    var pt = new PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue);
    plugin._pt = pt;
    pt.b = beginning;
    pt.e = end;

    plugin._props.push(property);

    return pt;
  },
      _nonConvertibleUnits = {
    deg: 1,
    rad: 1,
    turn: 1
  },
      _convertToUnit = function _convertToUnit(target, property, value, unit) {
    var curValue = parseFloat(value) || 0,
        curUnit = (value + "").trim().substr((curValue + "").length) || "px",
        style = _tempDiv.style,
        horizontal = _horizontalExp.test(property),
        isRootSVG = target.tagName.toLowerCase() === "svg",
        measureProperty = (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"),
        amount = 100,
        toPixels = unit === "px",
        toPercent = unit === "%",
        px,
        parent,
        cache,
        isSVG;

    if (unit === curUnit || !curValue || _nonConvertibleUnits[unit] || _nonConvertibleUnits[curUnit]) {
      return curValue;
    }

    curUnit !== "px" && !toPixels && (curValue = _convertToUnit(target, property, value, "px"));
    isSVG = target.getCTM && _isSVG(target);

    if ((toPercent || curUnit === "%") && (_transformProps[property] || ~property.indexOf("adius"))) {
      px = isSVG ? target.getBBox()[horizontal ? "width" : "height"] : target[measureProperty];
      return _round(toPercent ? curValue / px * amount : curValue / 100 * px);
    }

    style[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit);
    parent = ~property.indexOf("adius") || unit === "em" && target.appendChild && !isRootSVG ? target : target.parentNode;

    if (isSVG) {
      parent = (target.ownerSVGElement || {}).parentNode;
    }

    if (!parent || parent === _doc$1 || !parent.appendChild) {
      parent = _doc$1.body;
    }

    cache = parent._gsap;

    if (cache && toPercent && cache.width && horizontal && cache.time === _ticker.time) {
      return _round(curValue / cache.width * amount);
    } else {
      (toPercent || curUnit === "%") && (style.position = _getComputedProperty(target, "position"));
      parent === target && (style.position = "static");
      parent.appendChild(_tempDiv);
      px = _tempDiv[measureProperty];
      parent.removeChild(_tempDiv);
      style.position = "absolute";

      if (horizontal && toPercent) {
        cache = _getCache(parent);
        cache.time = _ticker.time;
        cache.width = parent[measureProperty];
      }
    }

    return _round(toPixels ? px * curValue / amount : px && curValue ? amount / px * curValue : 0);
  },
      _get = function _get(target, property, unit, uncache) {
    var value;
    _pluginInitted || _initCore();

    if (property in _propertyAliases && property !== "transform") {
      property = _propertyAliases[property];

      if (~property.indexOf(",")) {
        property = property.split(",")[0];
      }
    }

    if (_transformProps[property] && property !== "transform") {
      value = _parseTransform(target, uncache);
      value = property !== "transformOrigin" ? value[property] : value.svg ? value.origin : _firstTwoOnly(_getComputedProperty(target, _transformOriginProp)) + " " + value.zOrigin + "px";
    } else {
      value = target.style[property];

      if (!value || value === "auto" || uncache || ~(value + "").indexOf("calc(")) {
        value = _specialProps[property] && _specialProps[property](target, property, unit) || _getComputedProperty(target, property) || _getProperty(target, property) || (property === "opacity" ? 1 : 0);
      }
    }

    return unit && !~(value + "").trim().indexOf(" ") ? _convertToUnit(target, property, value, unit) + unit : value;
  },
      _tweenComplexCSSString = function _tweenComplexCSSString(target, prop, start, end) {
    if (!start || start === "none") {
      var p = _checkPropPrefix(prop, target, 1),
          s = p && _getComputedProperty(target, p, 1);

      if (s && s !== start) {
        prop = p;
        start = s;
      } else if (prop === "borderColor") {
        start = _getComputedProperty(target, "borderTopColor");
      }
    }

    var pt = new PropTween(this._pt, target.style, prop, 0, 1, _renderComplexString),
        index = 0,
        matchIndex = 0,
        a,
        result,
        startValues,
        startNum,
        color,
        startValue,
        endValue,
        endNum,
        chunk,
        endUnit,
        startUnit,
        endValues;
    pt.b = start;
    pt.e = end;
    start += "";
    end += "";

    if (end === "auto") {
      target.style[prop] = end;
      end = _getComputedProperty(target, prop) || end;
      target.style[prop] = start;
    }

    a = [start, end];

    _colorStringFilter(a);

    start = a[0];
    end = a[1];
    startValues = start.match(_numWithUnitExp) || [];
    endValues = end.match(_numWithUnitExp) || [];

    if (endValues.length) {
      while (result = _numWithUnitExp.exec(end)) {
        endValue = result[0];
        chunk = end.substring(index, result.index);

        if (color) {
          color = (color + 1) % 5;
        } else if (chunk.substr(-5) === "rgba(" || chunk.substr(-5) === "hsla(") {
          color = 1;
        }

        if (endValue !== (startValue = startValues[matchIndex++] || "")) {
          startNum = parseFloat(startValue) || 0;
          startUnit = startValue.substr((startNum + "").length);
          endValue.charAt(1) === "=" && (endValue = _parseRelative(startNum, endValue) + startUnit);
          endNum = parseFloat(endValue);
          endUnit = endValue.substr((endNum + "").length);
          index = _numWithUnitExp.lastIndex - endUnit.length;

          if (!endUnit) {
            endUnit = endUnit || _config.units[prop] || startUnit;

            if (index === end.length) {
              end += endUnit;
              pt.e += endUnit;
            }
          }

          if (startUnit !== endUnit) {
            startNum = _convertToUnit(target, prop, startValue, endUnit) || 0;
          }

          pt._pt = {
            _next: pt._pt,
            p: chunk || matchIndex === 1 ? chunk : ",",
            s: startNum,
            c: endNum - startNum,
            m: color && color < 4 || prop === "zIndex" ? Math.round : 0
          };
        }
      }

      pt.c = index < end.length ? end.substring(index, end.length) : "";
    } else {
      pt.r = prop === "display" && end === "none" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue;
    }

    _relExp.test(end) && (pt.e = 0);
    this._pt = pt;
    return pt;
  },
      _keywordToPercent = {
    top: "0%",
    bottom: "100%",
    left: "0%",
    right: "100%",
    center: "50%"
  },
      _convertKeywordsToPercentages = function _convertKeywordsToPercentages(value) {
    var split = value.split(" "),
        x = split[0],
        y = split[1] || "50%";

    if (x === "top" || x === "bottom" || y === "left" || y === "right") {
      value = x;
      x = y;
      y = value;
    }

    split[0] = _keywordToPercent[x] || x;
    split[1] = _keywordToPercent[y] || y;
    return split.join(" ");
  },
      _renderClearProps = function _renderClearProps(ratio, data) {
    if (data.tween && data.tween._time === data.tween._dur) {
      var target = data.t,
          style = target.style,
          props = data.u,
          cache = target._gsap,
          prop,
          clearTransforms,
          i;

      if (props === "all" || props === true) {
        style.cssText = "";
        clearTransforms = 1;
      } else {
        props = props.split(",");
        i = props.length;

        while (--i > -1) {
          prop = props[i];

          if (_transformProps[prop]) {
            clearTransforms = 1;
            prop = prop === "transformOrigin" ? _transformOriginProp : _transformProp;
          }

          _removeProperty(target, prop);
        }
      }

      if (clearTransforms) {
        _removeProperty(target, _transformProp);

        if (cache) {
          cache.svg && target.removeAttribute("transform");

          _parseTransform(target, 1);

          cache.uncache = 1;
        }
      }
    }
  },
      _specialProps = {
    clearProps: function clearProps(plugin, target, property, endValue, tween) {
      if (tween.data !== "isFromStart") {
        var pt = plugin._pt = new PropTween(plugin._pt, target, property, 0, 0, _renderClearProps);
        pt.u = endValue;
        pt.pr = -10;
        pt.tween = tween;

        plugin._props.push(property);

        return 1;
      }
    }
  },
      _identity2DMatrix = [1, 0, 0, 1, 0, 0],
      _rotationalProperties = {},
      _isNullTransform = function _isNullTransform(value) {
    return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value;
  },
      _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray(target) {
    var matrixString = _getComputedProperty(target, _transformProp);

    return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_numExp).map(_round);
  },
      _getMatrix = function _getMatrix(target, force2D) {
    var cache = target._gsap || _getCache(target),
        style = target.style,
        matrix = _getComputedTransformMatrixAsArray(target),
        parent,
        nextSibling,
        temp,
        addedToDOM;

    if (cache.svg && target.getAttribute("transform")) {
      temp = target.transform.baseVal.consolidate().matrix;
      matrix = [temp.a, temp.b, temp.c, temp.d, temp.e, temp.f];
      return matrix.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix;
    } else if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache.svg) {
      temp = style.display;
      style.display = "block";
      parent = target.parentNode;

      if (!parent || !target.offsetParent) {
        addedToDOM = 1;
        nextSibling = target.nextSibling;

        _docElement.appendChild(target);
      }

      matrix = _getComputedTransformMatrixAsArray(target);
      temp ? style.display = temp : _removeProperty(target, "display");

      if (addedToDOM) {
        nextSibling ? parent.insertBefore(target, nextSibling) : parent ? parent.appendChild(target) : _docElement.removeChild(target);
      }
    }

    return force2D && matrix.length > 6 ? [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]] : matrix;
  },
      _applySVGOrigin = function _applySVGOrigin(target, origin, originIsAbsolute, smooth, matrixArray, pluginToAddPropTweensTo) {
    var cache = target._gsap,
        matrix = matrixArray || _getMatrix(target, true),
        xOriginOld = cache.xOrigin || 0,
        yOriginOld = cache.yOrigin || 0,
        xOffsetOld = cache.xOffset || 0,
        yOffsetOld = cache.yOffset || 0,
        a = matrix[0],
        b = matrix[1],
        c = matrix[2],
        d = matrix[3],
        tx = matrix[4],
        ty = matrix[5],
        originSplit = origin.split(" "),
        xOrigin = parseFloat(originSplit[0]) || 0,
        yOrigin = parseFloat(originSplit[1]) || 0,
        bounds,
        determinant,
        x,
        y;

    if (!originIsAbsolute) {
      bounds = _getBBox(target);
      xOrigin = bounds.x + (~originSplit[0].indexOf("%") ? xOrigin / 100 * bounds.width : xOrigin);
      yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf("%") ? yOrigin / 100 * bounds.height : yOrigin);
    } else if (matrix !== _identity2DMatrix && (determinant = a * d - b * c)) {
      x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + (c * ty - d * tx) / determinant;
      y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - (a * ty - b * tx) / determinant;
      xOrigin = x;
      yOrigin = y;
    }

    if (smooth || smooth !== false && cache.smooth) {
      tx = xOrigin - xOriginOld;
      ty = yOrigin - yOriginOld;
      cache.xOffset = xOffsetOld + (tx * a + ty * c) - tx;
      cache.yOffset = yOffsetOld + (tx * b + ty * d) - ty;
    } else {
      cache.xOffset = cache.yOffset = 0;
    }

    cache.xOrigin = xOrigin;
    cache.yOrigin = yOrigin;
    cache.smooth = !!smooth;
    cache.origin = origin;
    cache.originIsAbsolute = !!originIsAbsolute;
    target.style[_transformOriginProp] = "0px 0px";

    if (pluginToAddPropTweensTo) {
      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOrigin", xOriginOld, xOrigin);

      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOrigin", yOriginOld, yOrigin);

      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOffset", xOffsetOld, cache.xOffset);

      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOffset", yOffsetOld, cache.yOffset);
    }

    target.setAttribute("data-svg-origin", xOrigin + " " + yOrigin);
  },
      _parseTransform = function _parseTransform(target, uncache) {
    var cache = target._gsap || new GSCache(target);

    if ("x" in cache && !uncache && !cache.uncache) {
      return cache;
    }

    var style = target.style,
        invertedScaleX = cache.scaleX < 0,
        px = "px",
        deg = "deg",
        origin = _getComputedProperty(target, _transformOriginProp) || "0",
        x,
        y,
        z,
        scaleX,
        scaleY,
        rotation,
        rotationX,
        rotationY,
        skewX,
        skewY,
        perspective,
        xOrigin,
        yOrigin,
        matrix,
        angle,
        cos,
        sin,
        a,
        b,
        c,
        d,
        a12,
        a22,
        t1,
        t2,
        t3,
        a13,
        a23,
        a33,
        a42,
        a43,
        a32;
    x = y = z = rotation = rotationX = rotationY = skewX = skewY = perspective = 0;
    scaleX = scaleY = 1;
    cache.svg = !!(target.getCTM && _isSVG(target));
    matrix = _getMatrix(target, cache.svg);

    if (cache.svg) {
      t1 = (!cache.uncache || origin === "0px 0px") && !uncache && target.getAttribute("data-svg-origin");

      _applySVGOrigin(target, t1 || origin, !!t1 || cache.originIsAbsolute, cache.smooth !== false, matrix);
    }

    xOrigin = cache.xOrigin || 0;
    yOrigin = cache.yOrigin || 0;

    if (matrix !== _identity2DMatrix) {
      a = matrix[0];
      b = matrix[1];
      c = matrix[2];
      d = matrix[3];
      x = a12 = matrix[4];
      y = a22 = matrix[5];

      if (matrix.length === 6) {
        scaleX = Math.sqrt(a * a + b * b);
        scaleY = Math.sqrt(d * d + c * c);
        rotation = a || b ? _atan2(b, a) * _RAD2DEG : 0;
        skewX = c || d ? _atan2(c, d) * _RAD2DEG + rotation : 0;
        skewX && (scaleY *= Math.abs(Math.cos(skewX * _DEG2RAD)));

        if (cache.svg) {
          x -= xOrigin - (xOrigin * a + yOrigin * c);
          y -= yOrigin - (xOrigin * b + yOrigin * d);
        }
      } else {
        a32 = matrix[6];
        a42 = matrix[7];
        a13 = matrix[8];
        a23 = matrix[9];
        a33 = matrix[10];
        a43 = matrix[11];
        x = matrix[12];
        y = matrix[13];
        z = matrix[14];
        angle = _atan2(a32, a33);
        rotationX = angle * _RAD2DEG;

        if (angle) {
          cos = Math.cos(-angle);
          sin = Math.sin(-angle);
          t1 = a12 * cos + a13 * sin;
          t2 = a22 * cos + a23 * sin;
          t3 = a32 * cos + a33 * sin;
          a13 = a12 * -sin + a13 * cos;
          a23 = a22 * -sin + a23 * cos;
          a33 = a32 * -sin + a33 * cos;
          a43 = a42 * -sin + a43 * cos;
          a12 = t1;
          a22 = t2;
          a32 = t3;
        }

        angle = _atan2(-c, a33);
        rotationY = angle * _RAD2DEG;

        if (angle) {
          cos = Math.cos(-angle);
          sin = Math.sin(-angle);
          t1 = a * cos - a13 * sin;
          t2 = b * cos - a23 * sin;
          t3 = c * cos - a33 * sin;
          a43 = d * sin + a43 * cos;
          a = t1;
          b = t2;
          c = t3;
        }

        angle = _atan2(b, a);
        rotation = angle * _RAD2DEG;

        if (angle) {
          cos = Math.cos(angle);
          sin = Math.sin(angle);
          t1 = a * cos + b * sin;
          t2 = a12 * cos + a22 * sin;
          b = b * cos - a * sin;
          a22 = a22 * cos - a12 * sin;
          a = t1;
          a12 = t2;
        }

        if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
          rotationX = rotation = 0;
          rotationY = 180 - rotationY;
        }

        scaleX = _round(Math.sqrt(a * a + b * b + c * c));
        scaleY = _round(Math.sqrt(a22 * a22 + a32 * a32));
        angle = _atan2(a12, a22);
        skewX = Math.abs(angle) > 0.0002 ? angle * _RAD2DEG : 0;
        perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
      }

      if (cache.svg) {
        t1 = target.getAttribute("transform");
        cache.forceCSS = target.setAttribute("transform", "") || !_isNullTransform(_getComputedProperty(target, _transformProp));
        t1 && target.setAttribute("transform", t1);
      }
    }

    if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
      if (invertedScaleX) {
        scaleX *= -1;
        skewX += rotation <= 0 ? 180 : -180;
        rotation += rotation <= 0 ? 180 : -180;
      } else {
        scaleY *= -1;
        skewX += skewX <= 0 ? 180 : -180;
      }
    }

    uncache = uncache || cache.uncache;
    cache.x = x - ((cache.xPercent = x && (!uncache && cache.xPercent || (Math.round(target.offsetWidth / 2) === Math.round(-x) ? -50 : 0))) ? target.offsetWidth * cache.xPercent / 100 : 0) + px;
    cache.y = y - ((cache.yPercent = y && (!uncache && cache.yPercent || (Math.round(target.offsetHeight / 2) === Math.round(-y) ? -50 : 0))) ? target.offsetHeight * cache.yPercent / 100 : 0) + px;
    cache.z = z + px;
    cache.scaleX = _round(scaleX);
    cache.scaleY = _round(scaleY);
    cache.rotation = _round(rotation) + deg;
    cache.rotationX = _round(rotationX) + deg;
    cache.rotationY = _round(rotationY) + deg;
    cache.skewX = skewX + deg;
    cache.skewY = skewY + deg;
    cache.transformPerspective = perspective + px;

    if (cache.zOrigin = parseFloat(origin.split(" ")[2]) || 0) {
      style[_transformOriginProp] = _firstTwoOnly(origin);
    }

    cache.xOffset = cache.yOffset = 0;
    cache.force3D = _config.force3D;
    cache.renderTransform = cache.svg ? _renderSVGTransforms : _supports3D ? _renderCSSTransforms : _renderNon3DTransforms;
    cache.uncache = 0;
    return cache;
  },
      _firstTwoOnly = function _firstTwoOnly(value) {
    return (value = value.split(" "))[0] + " " + value[1];
  },
      _addPxTranslate = function _addPxTranslate(target, start, value) {
    var unit = getUnit(start);
    return _round(parseFloat(start) + parseFloat(_convertToUnit(target, "x", value + "px", unit))) + unit;
  },
      _renderNon3DTransforms = function _renderNon3DTransforms(ratio, cache) {
    cache.z = "0px";
    cache.rotationY = cache.rotationX = "0deg";
    cache.force3D = 0;

    _renderCSSTransforms(ratio, cache);
  },
      _zeroDeg = "0deg",
      _zeroPx = "0px",
      _endParenthesis = ") ",
      _renderCSSTransforms = function _renderCSSTransforms(ratio, cache) {
    var _ref = cache || this,
        xPercent = _ref.xPercent,
        yPercent = _ref.yPercent,
        x = _ref.x,
        y = _ref.y,
        z = _ref.z,
        rotation = _ref.rotation,
        rotationY = _ref.rotationY,
        rotationX = _ref.rotationX,
        skewX = _ref.skewX,
        skewY = _ref.skewY,
        scaleX = _ref.scaleX,
        scaleY = _ref.scaleY,
        transformPerspective = _ref.transformPerspective,
        force3D = _ref.force3D,
        target = _ref.target,
        zOrigin = _ref.zOrigin,
        transforms = "",
        use3D = force3D === "auto" && ratio && ratio !== 1 || force3D === true;

    if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
      var angle = parseFloat(rotationY) * _DEG2RAD,
          a13 = Math.sin(angle),
          a33 = Math.cos(angle),
          cos;

      angle = parseFloat(rotationX) * _DEG2RAD;
      cos = Math.cos(angle);
      x = _addPxTranslate(target, x, a13 * cos * -zOrigin);
      y = _addPxTranslate(target, y, -Math.sin(angle) * -zOrigin);
      z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin);
    }

    if (transformPerspective !== _zeroPx) {
      transforms += "perspective(" + transformPerspective + _endParenthesis;
    }

    if (xPercent || yPercent) {
      transforms += "translate(" + xPercent + "%, " + yPercent + "%) ";
    }

    if (use3D || x !== _zeroPx || y !== _zeroPx || z !== _zeroPx) {
      transforms += z !== _zeroPx || use3D ? "translate3d(" + x + ", " + y + ", " + z + ") " : "translate(" + x + ", " + y + _endParenthesis;
    }

    if (rotation !== _zeroDeg) {
      transforms += "rotate(" + rotation + _endParenthesis;
    }

    if (rotationY !== _zeroDeg) {
      transforms += "rotateY(" + rotationY + _endParenthesis;
    }

    if (rotationX !== _zeroDeg) {
      transforms += "rotateX(" + rotationX + _endParenthesis;
    }

    if (skewX !== _zeroDeg || skewY !== _zeroDeg) {
      transforms += "skew(" + skewX + ", " + skewY + _endParenthesis;
    }

    if (scaleX !== 1 || scaleY !== 1) {
      transforms += "scale(" + scaleX + ", " + scaleY + _endParenthesis;
    }

    target.style[_transformProp] = transforms || "translate(0, 0)";
  },
      _renderSVGTransforms = function _renderSVGTransforms(ratio, cache) {
    var _ref2 = cache || this,
        xPercent = _ref2.xPercent,
        yPercent = _ref2.yPercent,
        x = _ref2.x,
        y = _ref2.y,
        rotation = _ref2.rotation,
        skewX = _ref2.skewX,
        skewY = _ref2.skewY,
        scaleX = _ref2.scaleX,
        scaleY = _ref2.scaleY,
        target = _ref2.target,
        xOrigin = _ref2.xOrigin,
        yOrigin = _ref2.yOrigin,
        xOffset = _ref2.xOffset,
        yOffset = _ref2.yOffset,
        forceCSS = _ref2.forceCSS,
        tx = parseFloat(x),
        ty = parseFloat(y),
        a11,
        a21,
        a12,
        a22,
        temp;

    rotation = parseFloat(rotation);
    skewX = parseFloat(skewX);
    skewY = parseFloat(skewY);

    if (skewY) {
      skewY = parseFloat(skewY);
      skewX += skewY;
      rotation += skewY;
    }

    if (rotation || skewX) {
      rotation *= _DEG2RAD;
      skewX *= _DEG2RAD;
      a11 = Math.cos(rotation) * scaleX;
      a21 = Math.sin(rotation) * scaleX;
      a12 = Math.sin(rotation - skewX) * -scaleY;
      a22 = Math.cos(rotation - skewX) * scaleY;

      if (skewX) {
        skewY *= _DEG2RAD;
        temp = Math.tan(skewX - skewY);
        temp = Math.sqrt(1 + temp * temp);
        a12 *= temp;
        a22 *= temp;

        if (skewY) {
          temp = Math.tan(skewY);
          temp = Math.sqrt(1 + temp * temp);
          a11 *= temp;
          a21 *= temp;
        }
      }

      a11 = _round(a11);
      a21 = _round(a21);
      a12 = _round(a12);
      a22 = _round(a22);
    } else {
      a11 = scaleX;
      a22 = scaleY;
      a21 = a12 = 0;
    }

    if (tx && !~(x + "").indexOf("px") || ty && !~(y + "").indexOf("px")) {
      tx = _convertToUnit(target, "x", x, "px");
      ty = _convertToUnit(target, "y", y, "px");
    }

    if (xOrigin || yOrigin || xOffset || yOffset) {
      tx = _round(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
      ty = _round(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
    }

    if (xPercent || yPercent) {
      temp = target.getBBox();
      tx = _round(tx + xPercent / 100 * temp.width);
      ty = _round(ty + yPercent / 100 * temp.height);
    }

    temp = "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")";
    target.setAttribute("transform", temp);
    forceCSS && (target.style[_transformProp] = temp);
  },
      _addRotationalPropTween = function _addRotationalPropTween(plugin, target, property, startNum, endValue) {
    var cap = 360,
        isString = _isString(endValue),
        endNum = parseFloat(endValue) * (isString && ~endValue.indexOf("rad") ? _RAD2DEG : 1),
        change = endNum - startNum,
        finalValue = startNum + change + "deg",
        direction,
        pt;

    if (isString) {
      direction = endValue.split("_")[1];

      if (direction === "short") {
        change %= cap;

        if (change !== change % (cap / 2)) {
          change += change < 0 ? cap : -cap;
        }
      }

      if (direction === "cw" && change < 0) {
        change = (change + cap * _bigNum$1) % cap - ~~(change / cap) * cap;
      } else if (direction === "ccw" && change > 0) {
        change = (change - cap * _bigNum$1) % cap - ~~(change / cap) * cap;
      }
    }

    plugin._pt = pt = new PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd);
    pt.e = finalValue;
    pt.u = "deg";

    plugin._props.push(property);

    return pt;
  },
      _assign = function _assign(target, source) {
    for (var p in source) {
      target[p] = source[p];
    }

    return target;
  },
      _addRawTransformPTs = function _addRawTransformPTs(plugin, transforms, target) {
    var startCache = _assign({}, target._gsap),
        exclude = "perspective,force3D,transformOrigin,svgOrigin",
        style = target.style,
        endCache,
        p,
        startValue,
        endValue,
        startNum,
        endNum,
        startUnit,
        endUnit;

    if (startCache.svg) {
      startValue = target.getAttribute("transform");
      target.setAttribute("transform", "");
      style[_transformProp] = transforms;
      endCache = _parseTransform(target, 1);

      _removeProperty(target, _transformProp);

      target.setAttribute("transform", startValue);
    } else {
      startValue = getComputedStyle(target)[_transformProp];
      style[_transformProp] = transforms;
      endCache = _parseTransform(target, 1);
      style[_transformProp] = startValue;
    }

    for (p in _transformProps) {
      startValue = startCache[p];
      endValue = endCache[p];

      if (startValue !== endValue && exclude.indexOf(p) < 0) {
        startUnit = getUnit(startValue);
        endUnit = getUnit(endValue);
        startNum = startUnit !== endUnit ? _convertToUnit(target, p, startValue, endUnit) : parseFloat(startValue);
        endNum = parseFloat(endValue);
        plugin._pt = new PropTween(plugin._pt, endCache, p, startNum, endNum - startNum, _renderCSSProp);
        plugin._pt.u = endUnit || 0;

        plugin._props.push(p);
      }
    }

    _assign(endCache, startCache);
  };

  _forEachName("padding,margin,Width,Radius", function (name, index) {
    var t = "Top",
        r = "Right",
        b = "Bottom",
        l = "Left",
        props = (index < 3 ? [t, r, b, l] : [t + l, t + r, b + r, b + l]).map(function (side) {
      return index < 2 ? name + side : "border" + side + name;
    });

    _specialProps[index > 1 ? "border" + name : name] = function (plugin, target, property, endValue, tween) {
      var a, vars;

      if (arguments.length < 4) {
        a = props.map(function (prop) {
          return _get(plugin, prop, property);
        });
        vars = a.join(" ");
        return vars.split(a[0]).length === 5 ? a[0] : vars;
      }

      a = (endValue + "").split(" ");
      vars = {};
      props.forEach(function (prop, i) {
        return vars[prop] = a[i] = a[i] || a[(i - 1) / 2 | 0];
      });
      plugin.init(target, vars, tween);
    };
  });

  var CSSPlugin = {
    name: "css",
    register: _initCore,
    targetTest: function targetTest(target) {
      return target.style && target.nodeType;
    },
    init: function init(target, vars, tween, index, targets) {
      var props = this._props,
          style = target.style,
          startAt = tween.vars.startAt,
          startValue,
          endValue,
          endNum,
          startNum,
          type,
          specialProp,
          p,
          startUnit,
          endUnit,
          relative,
          isTransformRelated,
          transformPropTween,
          cache,
          smooth,
          hasPriority;
      _pluginInitted || _initCore();

      for (p in vars) {
        if (p === "autoRound") {
          continue;
        }

        endValue = vars[p];

        if (_plugins[p] && _checkPlugin(p, vars, tween, index, target, targets)) {
          continue;
        }

        type = typeof endValue;
        specialProp = _specialProps[p];

        if (type === "function") {
          endValue = endValue.call(tween, index, target, targets);
          type = typeof endValue;
        }

        if (type === "string" && ~endValue.indexOf("random(")) {
          endValue = _replaceRandom(endValue);
        }

        if (specialProp) {
          specialProp(this, target, p, endValue, tween) && (hasPriority = 1);
        } else if (p.substr(0, 2) === "--") {
          startValue = (getComputedStyle(target).getPropertyValue(p) + "").trim();
          endValue += "";
          _colorExp.lastIndex = 0;

          if (!_colorExp.test(startValue)) {
            startUnit = getUnit(startValue);
            endUnit = getUnit(endValue);
          }

          endUnit ? startUnit !== endUnit && (startValue = _convertToUnit(target, p, startValue, endUnit) + endUnit) : startUnit && (endValue += startUnit);
          this.add(style, "setProperty", startValue, endValue, index, targets, 0, 0, p);
          props.push(p);
        } else if (type !== "undefined") {
          if (startAt && p in startAt) {
            startValue = typeof startAt[p] === "function" ? startAt[p].call(tween, index, target, targets) : startAt[p];
            _isString(startValue) && ~startValue.indexOf("random(") && (startValue = _replaceRandom(startValue));
            getUnit(startValue + "") || (startValue += _config.units[p] || getUnit(_get(target, p)) || "");
            (startValue + "").charAt(1) === "=" && (startValue = _get(target, p));
          } else {
            startValue = _get(target, p);
          }

          startNum = parseFloat(startValue);
          relative = type === "string" && endValue.charAt(1) === "=" && endValue.substr(0, 2);
          relative && (endValue = endValue.substr(2));
          endNum = parseFloat(endValue);

          if (p in _propertyAliases) {
            if (p === "autoAlpha") {
              if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) {
                startNum = 0;
              }

              _addNonTweeningPT(this, style, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum);
            }

            if (p !== "scale" && p !== "transform") {
              p = _propertyAliases[p];
              ~p.indexOf(",") && (p = p.split(",")[0]);
            }
          }

          isTransformRelated = p in _transformProps;

          if (isTransformRelated) {
            if (!transformPropTween) {
              cache = target._gsap;
              cache.renderTransform && !vars.parseTransform || _parseTransform(target, vars.parseTransform);
              smooth = vars.smoothOrigin !== false && cache.smooth;
              transformPropTween = this._pt = new PropTween(this._pt, style, _transformProp, 0, 1, cache.renderTransform, cache, 0, -1);
              transformPropTween.dep = 1;
            }

            if (p === "scale") {
              this._pt = new PropTween(this._pt, cache, "scaleY", cache.scaleY, (relative ? _parseRelative(cache.scaleY, relative + endNum) : endNum) - cache.scaleY || 0);
              props.push("scaleY", p);
              p += "X";
            } else if (p === "transformOrigin") {
              endValue = _convertKeywordsToPercentages(endValue);

              if (cache.svg) {
                _applySVGOrigin(target, endValue, 0, smooth, 0, this);
              } else {
                endUnit = parseFloat(endValue.split(" ")[2]) || 0;
                endUnit !== cache.zOrigin && _addNonTweeningPT(this, cache, "zOrigin", cache.zOrigin, endUnit);

                _addNonTweeningPT(this, style, p, _firstTwoOnly(startValue), _firstTwoOnly(endValue));
              }

              continue;
            } else if (p === "svgOrigin") {
              _applySVGOrigin(target, endValue, 1, smooth, 0, this);

              continue;
            } else if (p in _rotationalProperties) {
              _addRotationalPropTween(this, cache, p, startNum, relative ? _parseRelative(startNum, relative + endValue) : endValue);

              continue;
            } else if (p === "smoothOrigin") {
              _addNonTweeningPT(this, cache, "smooth", cache.smooth, endValue);

              continue;
            } else if (p === "force3D") {
              cache[p] = endValue;
              continue;
            } else if (p === "transform") {
              _addRawTransformPTs(this, endValue, target);

              continue;
            }
          } else if (!(p in style)) {
            p = _checkPropPrefix(p) || p;
          }

          if (isTransformRelated || (endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && p in style) {
            startUnit = (startValue + "").substr((startNum + "").length);
            endNum || (endNum = 0);
            endUnit = getUnit(endValue) || (p in _config.units ? _config.units[p] : startUnit);
            startUnit !== endUnit && (startNum = _convertToUnit(target, p, startValue, endUnit));
            this._pt = new PropTween(this._pt, isTransformRelated ? cache : style, p, startNum, (relative ? _parseRelative(startNum, relative + endNum) : endNum) - startNum, !isTransformRelated && (endUnit === "px" || p === "zIndex") && vars.autoRound !== false ? _renderRoundedCSSProp : _renderCSSProp);
            this._pt.u = endUnit || 0;

            if (startUnit !== endUnit && endUnit !== "%") {
              this._pt.b = startValue;
              this._pt.r = _renderCSSPropWithBeginning;
            }
          } else if (!(p in style)) {
            if (p in target) {
              this.add(target, p, startValue || target[p], relative ? relative + endValue : endValue, index, targets);
            } else {
              _missingPlugin(p, endValue);

              continue;
            }
          } else {
            _tweenComplexCSSString.call(this, target, p, startValue, relative ? relative + endValue : endValue);
          }

          props.push(p);
        }
      }

      hasPriority && _sortPropTweensByPriority(this);
    },
    get: _get,
    aliases: _propertyAliases,
    getSetter: function getSetter(target, property, plugin) {
      var p = _propertyAliases[property];
      p && p.indexOf(",") < 0 && (property = p);
      return property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, "x")) ? plugin && _recentSetterPlugin === plugin ? property === "scale" ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !_isUndefined(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : _getSetter(target, property);
    },
    core: {
      _removeProperty: _removeProperty,
      _getMatrix: _getMatrix
    }
  };
  gsap.utils.checkPrefix = _checkPropPrefix;

  (function (positionAndScale, rotation, others, aliases) {
    var all = _forEachName(positionAndScale + "," + rotation + "," + others, function (name) {
      _transformProps[name] = 1;
    });

    _forEachName(rotation, function (name) {
      _config.units[name] = "deg";
      _rotationalProperties[name] = 1;
    });

    _propertyAliases[all[13]] = positionAndScale + "," + rotation;

    _forEachName(aliases, function (name) {
      var split = name.split(":");
      _propertyAliases[split[1]] = all[split[0]];
    });
  })("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");

  _forEachName("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function (name) {
    _config.units[name] = "px";
  });

  gsap.registerPlugin(CSSPlugin);

  var gsapWithCSS = gsap.registerPlugin(CSSPlugin) || gsap,
      TweenMaxWithCSS = gsapWithCSS.core.Tween;

  exports.Back = Back;
  exports.Bounce = Bounce;
  exports.CSSPlugin = CSSPlugin;
  exports.Circ = Circ;
  exports.Cubic = Cubic;
  exports.Elastic = Elastic;
  exports.Expo = Expo;
  exports.Linear = Linear;
  exports.Power0 = Power0;
  exports.Power1 = Power1;
  exports.Power2 = Power2;
  exports.Power3 = Power3;
  exports.Power4 = Power4;
  exports.Quad = Quad;
  exports.Quart = Quart;
  exports.Quint = Quint;
  exports.Sine = Sine;
  exports.SteppedEase = SteppedEase;
  exports.Strong = Strong;
  exports.TimelineLite = Timeline;
  exports.TimelineMax = Timeline;
  exports.TweenLite = Tween;
  exports.TweenMax = TweenMaxWithCSS;
  exports.default = gsapWithCSS;
  exports.gsap = gsapWithCSS;

  if (typeof(window) === 'undefined' || window !== exports) {Object.defineProperty(exports, '__esModule', { value: true });} else {delete window.default;}

})));

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Gallery =
/** @class */
function () {
  function Gallery(id) {
    this.id = id;
    this.images = [];
  }

  Gallery.prototype.addImage = function (image) {
    this.images.push(image);
  };

  return Gallery;
}();

var _default = Gallery;
exports["default"] = _default;

},{}],3:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var utils = _interopRequireWildcard(require("./utils"));

var _gsap = _interopRequireDefault(require("gsap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var GalleryUI =
/** @class */
function () {
  function GalleryUI() {}

  GalleryUI.prototype.open = function (gallery, initialImage, highResolutionSrc, index) {
    var _this = this;

    this._currentGallery = gallery;
    this._currentIndex = index;
    console.log("Image with index ".concat(index, " opened")); // Crate container

    this._container = document.createElement('div');

    this._container.classList.add('gallery'); // Disbale scrolling


    utils.disableScrolling(); // Create backdrop

    this._backdrop = document.createElement('div');

    this._backdrop.classList.add('gallery-backdrop');

    document.body.appendChild(this._backdrop); // Create topbar

    this.createTopbar();
    this.changeTitle("".concat(index + 1, " / ").concat(gallery.images.length));

    this._container.appendChild(this._topbar); // Add Image Preview


    this._imageViewer = document.createElement('div');

    this._imageViewer.classList.add('gallery__image_viewer');

    this._prevButton = utils.createIconButton('fa-chevron-left');

    this._prevButton.classList.add('gallery__image_viewer__prev');

    this._prevButton.addEventListener('click', function () {
      _this.prevImage();
    });

    if (this._currentIndex === 0) {
      // Primeira image, desabilita o botão de voltar
      this._prevButton.setAttribute('disabled', '');
    }

    this._nextButton = utils.createIconButton('fa-chevron-right');

    this._nextButton.classList.add('gallery__image_viewer__next');

    this._nextButton.addEventListener('click', function () {
      _this.nextImage();
    });

    this._imageViewer.append(this._prevButton, this._nextButton);

    this._imageViewerViewport = document.createElement('div');

    this._imageViewerViewport.classList.add('gallery__image_viewer__viewport');

    gallery.images.forEach(function (_) {
      var imageContainer = document.createElement('div'); // imageContainer.style.backgroundColor = '#FF0000';

      imageContainer.classList.add('gallery__image_viewer__item');

      _this._imageViewerViewport.append(imageContainer);
    });
    this._imageViewerViewport.style.transform = "translateX(-".concat(index * document.body.clientWidth, "px)");

    this._imageViewer.append(this._imageViewerViewport);

    this._container.appendChild(this._imageViewer); // Setup gallery slider


    this._slider = document.createElement('div');

    this._slider.classList.add('gallery__slider');

    var sliderViewport = document.createElement('div');
    sliderViewport.classList.add('gallery__slider__viewport');
    gallery.images.forEach(function (image) {
      var div = document.createElement('div');
      div.classList.add('gallery__slider__item');
      var imageElement = document.createElement('img');
      imageElement.src = image.src;
      div.appendChild(imageElement);
      sliderViewport.appendChild(div);
    });

    this._slider.appendChild(sliderViewport);

    this._container.appendChild(this._slider); // Animation


    _gsap["default"].fromTo([this._container, this._backdrop], {
      opacity: 0
    }, {
      opacity: 1,
      duration: 0.4
    });

    _gsap["default"].fromTo(this._slider, {
      y: 100
    }, {
      y: 0,
      duration: 0.4,
      delay: 0.2
    });

    _gsap["default"].fromTo(this._topbar, {
      y: -60
    }, {
      y: 0,
      duration: 0.4,
      delay: 0.2
    }); // Append container to body


    document.body.appendChild(this._container); // Load prev image if not first

    if (this._currentIndex !== 0) {
      this.loadPrevImage();
    } // Load next image if not last


    if (this._currentIndex < this._currentGallery.images.length - 1) {
      this.loadNextImage();
    }

    this.createImageAnimation(initialImage); // Set current image

    this._originalImage = initialImage;
  };

  GalleryUI.prototype.loadNextImage = function () {
    // Chekc if next slot is empty
    if (this._imageViewerViewport.querySelector("div:nth-child(".concat(this._currentIndex + 2, ")")).childNodes.length === 0) {
      // Load next image into next cell
      var nextImage = document.createElement('img');
      var nextImageElement = this._currentGallery.images[this._currentIndex + 1]; // Fit image to viewport

      var _a = utils.fitToViewport(this._imageViewer, nextImageElement),
          finalWidth = _a.finalWidth,
          finalHeight = _a.finalHeight,
          finalX = _a.finalX;

      _gsap["default"].set(nextImage, {
        height: finalHeight,
        width: finalWidth
      }); // nextImage.style.backgroundColor = '#ff0000';


      nextImage.src = nextImageElement.src;

      this._imageViewerViewport.querySelector("div:nth-child(".concat(this._currentIndex + 2, ")")).append(nextImage);
    }
  };

  GalleryUI.prototype.loadPrevImage = function () {
    // Chekc if previous slot is empty
    if (this._imageViewerViewport.querySelector("div:nth-child(".concat(this._currentIndex, ")")).childNodes.length === 0) {
      // Load next image into next cell
      var prevImage = document.createElement('img');
      var prevImageElement = this._currentGallery.images[this._currentIndex - 1]; // Fit image to viewport

      var _a = utils.fitToViewport(this._imageViewer, prevImageElement),
          finalWidth = _a.finalWidth,
          finalHeight = _a.finalHeight,
          finalX = _a.finalX;

      _gsap["default"].set(prevImage, {
        height: finalHeight,
        width: finalWidth
      }); // nextImage.style.backgroundColor = '#ff0000';


      prevImage.src = prevImageElement.src;

      this._imageViewerViewport.querySelector("div:nth-child(".concat(this._currentIndex, ")")).append(prevImage);
    }
  };

  GalleryUI.prototype.createImageAnimation = function (initialImage) {
    var _this = this; // Create image


    this._currentImage = document.createElement('img');

    this._currentImage.classList.add('gallery_image_preview');

    this._currentImage.style.height = "".concat(initialImage.clientHeight, "px");
    this._currentImage.style.width = "".concat(initialImage.clientWidth, "px");
    this._currentImage.src = initialImage.src; // Set image final size to best fit image viewer

    var _a = utils.fitToViewport(this._imageViewer, initialImage),
        finalWidth = _a.finalWidth,
        finalHeight = _a.finalHeight,
        finalX = _a.finalX,
        finalY = _a.finalY; // Animate image to center with its current height and width to its final size


    _gsap["default"].fromTo(this._currentImage, {
      x: initialImage.offsetLeft,
      y: initialImage.offsetTop - window.scrollY,
      width: initialImage.clientWidth,
      height: initialImage.clientHeight
    }, {
      x: finalX,
      y: finalY,
      height: finalHeight,
      width: finalWidth,
      onComplete: function onComplete() {
        _this._imageViewerViewport.querySelector("div:nth-child(".concat(_this._currentIndex + 1, ")")).append(_this._currentImage);

        _this._currentImage.classList.remove('gallery_image_preview'); // gsap.set(this._currentImage, { y: 0 });


        _this._currentImage.style.transform = ''; // Show prev and next button

        _gsap["default"].to(_this._prevButton, {
          x: 50,
          duration: 0.3
        });

        _gsap["default"].to(_this._nextButton, {
          x: -50,
          duration: 0.3
        });
      }
    });

    document.body.appendChild(this._currentImage);
  };

  GalleryUI.prototype.createTopbar = function () {
    var _this = this;

    this._topbar = document.createElement('div');

    this._topbar.classList.add('gallery__topbar');

    var imageTitle = document.createElement('span');
    var buttons = document.createElement('div');
    buttons.classList.add('gallery__topbar__buttons'); // const downloadButton = utils.createIconButton('fa-download');
    // const shareButton = utils.createIconButton('fa-share-nodes');

    var zoomButton = utils.createIconButton('fa-magnifying-glass-plus');
    zoomButton.addEventListener('click', function () {
      _this.zoom();

      _gsap["default"].to(_this._currentImage, {
        scale: 4.4582
      });
    });
    var closeButton = utils.createIconButton('fa-xmark');
    closeButton.classList.add('gallery__topbar__close');
    closeButton.addEventListener('click', function () {
      _this.close();
    });
    buttons.append(zoomButton, closeButton);

    this._topbar.appendChild(imageTitle);

    this._topbar.appendChild(buttons);
  };

  GalleryUI.prototype.changeTitle = function (newTitle) {
    this._topbar.querySelector('span').innerText = newTitle;
  };

  GalleryUI.prototype.close = function () {
    var _this = this;

    var initialX = this._currentImage.getBoundingClientRect().left;

    var initialY = this._currentImage.getBoundingClientRect().top; // Give back its calss


    this._currentImage.classList.add('gallery_image_preview');

    document.body.appendChild(this._currentImage); // Retract current image to original image position

    _gsap["default"].fromTo(this._currentImage, {
      x: initialX,
      y: initialY,
      width: this._currentImage.clientWidth,
      height: this._currentImage.clientHeight
    }, {
      x: this._originalImage.offsetLeft,
      y: this._originalImage.offsetTop - window.scrollY,
      height: this._originalImage.clientHeight,
      width: this._originalImage.clientWidth,
      duration: 0.3,
      onComplete: function onComplete() {
        _this._currentImage.remove();
      }
    });

    _gsap["default"].to([this._container, this._backdrop], {
      opacity: 0,
      duration: 0.3,
      onComplete: function onComplete() {
        _this._backdrop.remove();

        _this._container.remove();

        utils.enableScrolling();
      }
    });

    _gsap["default"].to(this._slider, {
      y: 100,
      duration: 0.3
    }); // Animate topbar leaving


    _gsap["default"].to(this._topbar, {
      y: -60,
      duration: 0.3
    }); // Animate prev next buttons


    _gsap["default"].to(this._nextButton, {
      x: 0,
      duration: 0.3
    });
  };

  GalleryUI.prototype.prevImage = function () {
    this._currentIndex -= 1;

    _gsap["default"].to(this._imageViewerViewport, {
      x: -(this._currentIndex * document.body.clientWidth),
      duration: 0.4
    });

    this.changeTitle("".concat(this._currentIndex + 1, " / ").concat(this._currentGallery.images.length));
    this._originalImage = this._currentGallery.images[this._currentIndex];
    this._currentImage = this._imageViewerViewport.querySelector("div:nth-child(".concat(this._currentIndex + 1, ") > img")); //If not first image, Load prev image

    if (this._currentIndex !== 0) {
      this.loadPrevImage();

      this._nextButton.removeAttribute('disabled');
    } else {
      this._prevButton.setAttribute('disabled', '');
    }
  };

  GalleryUI.prototype.nextImage = function () {
    this._currentIndex += 1;

    _gsap["default"].to(this._imageViewerViewport, {
      x: -(this._currentIndex * document.body.clientWidth),
      duration: 0.4
    });

    this.changeTitle("".concat(this._currentIndex + 1, " / ").concat(this._currentGallery.images.length));
    this._originalImage = this._currentGallery.images[this._currentIndex];
    this._currentImage = this._imageViewerViewport.querySelector("div:nth-child(".concat(this._currentIndex + 1, ") > img")); //If not last image, Load next image

    if (this._currentIndex < this._currentGallery.images.length - 1) {
      this.loadNextImage();

      this._prevButton.removeAttribute('disabled');
    } else {
      // Disable button
      this._nextButton.setAttribute('disabled', '');
    }
  };

  GalleryUI.prototype.zoom = function () {
    _gsap["default"].to(this._slider, {
      y: 100,
      duration: 0.3
    });
  };

  return GalleryUI;
}();

var _default = GalleryUI;
exports["default"] = _default;

},{"./utils":5,"gsap":1}],4:[function(require,module,exports){
"use strict";

var _Gallery = _interopRequireDefault(require("./Gallery"));

var _GalleryUI = _interopRequireDefault(require("./GalleryUI"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var galleries = [];
var galleryUI = new _GalleryUI["default"](); // Generate Galleries

document.querySelectorAll('a[data-gallery]').forEach(function (galleryItem) {
  var galleryId = galleryItem.getAttribute('data-gallery');
  var image = galleryItem.querySelector('img'); // Check if its gallery already exists

  if (galleries.length > 0) {
    galleries.every(function (gallery) {
      if (gallery.id === galleryId) {
        gallery.addImage(image);
        galleryItem.setAttribute('data-index', (gallery.images.length - 1).toString());
        return false;
      }
    });
  } else {
    // Gallery doesnt exist
    var newGallery = new _Gallery["default"](galleryId);
    newGallery.addImage(image);
    galleries.push(newGallery);
    galleryItem.setAttribute('data-index', (newGallery.images.length - 1).toString());
  } // Attach events


  galleryItem.addEventListener('click', function (event) {
    event.preventDefault();
    var gallery = null;
    galleries.every(function (gal) {
      if (gal.id === event.currentTarget.getAttribute('data-gallery')) {
        gallery = gal;
      }
    });
    galleryUI.open(gallery, event.currentTarget.querySelector('img'), event.currentTarget.getAttribute('data-high-res'), parseInt(event.currentTarget.getAttribute('data-index')));
  });
});

},{"./Gallery":2,"./GalleryUI":3}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createIconButton = createIconButton;
exports.disableScrolling = disableScrolling;
exports.enableScrolling = enableScrolling;
exports.fitToViewport = fitToViewport;
exports.getImageSize = getImageSize;

function getImageSize(image, callback) {
  var _this = this;

  var w, h;
  var poll = setInterval(function () {
    w = image.naturalWidth;
    h = image.naturalHeight;

    if (w && h) {
      clearInterval(poll);
      callback.apply(_this, [w, h]);
    }
  });
}

function disableScrolling() {
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  window.onscroll = function () {
    window.scrollTo(scrollLeft, scrollTop);
  };
}

function enableScrolling() {
  window.onscroll = function () {};
}

function createIconButton(faClass) {
  var button = document.createElement('button');
  button.classList.add('fa-solid', faClass);
  return button;
}

function fitToViewport(imageViewer, initialImage) {
  var ratio = initialImage.naturalWidth / initialImage.naturalHeight;
  var pratio = imageViewer.clientWidth / imageViewer.clientHeight;
  var finalWidth, finalHeight, finalX, finalY;

  if (ratio < pratio) {
    var scaleFactor = imageViewer.clientHeight / initialImage.naturalHeight;
    finalHeight = imageViewer.clientHeight;
    finalWidth = initialImage.naturalWidth * scaleFactor;
    finalX = imageViewer.clientWidth / 2 - finalWidth / 2;
    finalY = imageViewer.offsetTop;
  } else {
    var scaleFactor = imageViewer.clientWidth / initialImage.naturalWidth;
    finalWidth = imageViewer.clientWidth;
    finalHeight = initialImage.naturalHeight * scaleFactor;
    finalX = imageViewer.offsetLeft;
    finalY = imageViewer.clientHeight / 2 - finalHeight / 2 + imageViewer.getBoundingClientRect().top;
  }

  return {
    finalWidth: finalWidth,
    finalHeight: finalHeight,
    finalX: finalX,
    finalY: finalY
  };
}

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZ3NhcC9kaXN0L2dzYXAuanMiLCJzcmMvR2FsbGVyeS50cyIsInNyYy9HYWxsZXJ5VUkudHMiLCJzcmMvbWFpbi50cyIsInNyYy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQzkrSkE7QUFBQTtBQUFBO0FBS0ksbUJBQVksRUFBWixFQUE2QjtBQUN6QixTQUFLLEVBQUwsR0FBVSxFQUFWO0FBQ0EsU0FBSyxNQUFMLEdBQWMsRUFBZDtBQUNIOztBQUVELHlDQUFTLEtBQVQsRUFBZ0M7QUFDNUIsU0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixLQUFqQjtBQUNILEdBRkQ7O0FBR0o7QUFBQyxDQWJEOztlQWVlLE87Ozs7Ozs7Ozs7Ozs7QUNoQmY7O0FBRUE7Ozs7Ozs7O0FBRUE7QUFBQTtBQUFBO0FBY0ksd0JBQWdCOztBQUVoQix1Q0FDSSxPQURKLEVBRUksWUFGSixFQUdJLGlCQUhKLEVBSUksS0FKSixFQUlrQjtBQUpsQjs7QUFNSSxTQUFLLGVBQUwsR0FBdUIsT0FBdkI7QUFDQSxTQUFLLGFBQUwsR0FBcUIsS0FBckI7QUFDQSxXQUFPLENBQUMsR0FBUixDQUFZLDJCQUFvQixLQUFwQixFQUF5QixTQUF6QixDQUFaLEVBSmMsQ0FLZDs7QUFDQSxTQUFLLFVBQUwsR0FBa0IsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBbEI7O0FBQ0EsU0FBSyxVQUFMLENBQWdCLFNBQWhCLENBQTBCLEdBQTFCLENBQThCLFNBQTlCLEVBUGMsQ0FTZDs7O0FBQ0EsU0FBSyxDQUFDLGdCQUFOLEdBVmMsQ0FZZDs7QUFDQSxTQUFLLFNBQUwsR0FBaUIsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBakI7O0FBQ0EsU0FBSyxTQUFMLENBQWUsU0FBZixDQUF5QixHQUF6QixDQUE2QixrQkFBN0I7O0FBQ0EsWUFBUSxDQUFDLElBQVQsQ0FBYyxXQUFkLENBQTBCLEtBQUssU0FBL0IsRUFmYyxDQWlCZDs7QUFDQSxTQUFLLFlBQUw7QUFDQSxTQUFLLFdBQUwsQ0FBaUIsVUFBRyxLQUFLLEdBQUcsQ0FBWCxFQUFZLEtBQVosRUFBWSxNQUFaLENBQWtCLE9BQU8sQ0FBQyxNQUFSLENBQWUsTUFBakMsQ0FBakI7O0FBQ0EsU0FBSyxVQUFMLENBQWdCLFdBQWhCLENBQTRCLEtBQUssT0FBakMsRUFwQmMsQ0FzQmQ7OztBQUNBLFNBQUssWUFBTCxHQUFvQixRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFwQjs7QUFDQSxTQUFLLFlBQUwsQ0FBa0IsU0FBbEIsQ0FBNEIsR0FBNUIsQ0FBZ0MsdUJBQWhDOztBQUVBLFNBQUssV0FBTCxHQUFtQixLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsaUJBQXZCLENBQW5COztBQUNBLFNBQUssV0FBTCxDQUFpQixTQUFqQixDQUEyQixHQUEzQixDQUErQiw2QkFBL0I7O0FBQ0EsU0FBSyxXQUFMLENBQWlCLGdCQUFqQixDQUFrQyxPQUFsQyxFQUEyQztBQUN2QyxXQUFJLENBQUMsU0FBTDtBQUNILEtBRkQ7O0FBR0EsUUFBSSxLQUFLLGFBQUwsS0FBdUIsQ0FBM0IsRUFBOEI7QUFDMUI7QUFDQSxXQUFLLFdBQUwsQ0FBaUIsWUFBakIsQ0FBOEIsVUFBOUIsRUFBMEMsRUFBMUM7QUFDSDs7QUFFRCxTQUFLLFdBQUwsR0FBbUIsS0FBSyxDQUFDLGdCQUFOLENBQXVCLGtCQUF2QixDQUFuQjs7QUFDQSxTQUFLLFdBQUwsQ0FBaUIsU0FBakIsQ0FBMkIsR0FBM0IsQ0FBK0IsNkJBQS9COztBQUNBLFNBQUssV0FBTCxDQUFpQixnQkFBakIsQ0FBa0MsT0FBbEMsRUFBMkM7QUFDdkMsV0FBSSxDQUFDLFNBQUw7QUFDSCxLQUZEOztBQUlBLFNBQUssWUFBTCxDQUFrQixNQUFsQixDQUF5QixLQUFLLFdBQTlCLEVBQTJDLEtBQUssV0FBaEQ7O0FBRUEsU0FBSyxvQkFBTCxHQUE0QixRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUE1Qjs7QUFDQSxTQUFLLG9CQUFMLENBQTBCLFNBQTFCLENBQW9DLEdBQXBDLENBQ0ksaUNBREo7O0FBSUEsV0FBTyxDQUFDLE1BQVIsQ0FBZSxPQUFmLENBQXVCLFVBQUMsQ0FBRCxFQUFFO0FBQ3JCLFVBQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQXZCLENBRHFCLENBRXJCOztBQUNBLG9CQUFjLENBQUMsU0FBZixDQUF5QixHQUF6QixDQUE2Qiw2QkFBN0I7O0FBQ0EsV0FBSSxDQUFDLG9CQUFMLENBQTBCLE1BQTFCLENBQWlDLGNBQWpDO0FBQ0gsS0FMRDtBQU9BLFNBQUssb0JBQUwsQ0FBMEIsS0FBMUIsQ0FBZ0MsU0FBaEMsR0FBNEMsc0JBQ3hDLEtBQUssR0FBRyxRQUFRLENBQUMsSUFBVCxDQUFjLFdBRGtCLEVBQ1AsS0FETyxDQUE1Qzs7QUFJQSxTQUFLLFlBQUwsQ0FBa0IsTUFBbEIsQ0FBeUIsS0FBSyxvQkFBOUI7O0FBRUEsU0FBSyxVQUFMLENBQWdCLFdBQWhCLENBQTRCLEtBQUssWUFBakMsRUE5RGMsQ0FnRWQ7OztBQUNBLFNBQUssT0FBTCxHQUFlLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQWY7O0FBQ0EsU0FBSyxPQUFMLENBQWEsU0FBYixDQUF1QixHQUF2QixDQUEyQixpQkFBM0I7O0FBQ0EsUUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBdkI7QUFDQSxrQkFBYyxDQUFDLFNBQWYsQ0FBeUIsR0FBekIsQ0FBNkIsMkJBQTdCO0FBRUEsV0FBTyxDQUFDLE1BQVIsQ0FBZSxPQUFmLENBQXVCLFVBQUMsS0FBRCxFQUFNO0FBQ3pCLFVBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQVo7QUFDQSxTQUFHLENBQUMsU0FBSixDQUFjLEdBQWQsQ0FBa0IsdUJBQWxCO0FBRUEsVUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBckI7QUFDQSxrQkFBWSxDQUFDLEdBQWIsR0FBbUIsS0FBSyxDQUFDLEdBQXpCO0FBQ0EsU0FBRyxDQUFDLFdBQUosQ0FBZ0IsWUFBaEI7QUFDQSxvQkFBYyxDQUFDLFdBQWYsQ0FBMkIsR0FBM0I7QUFDSCxLQVJEOztBQVVBLFNBQUssT0FBTCxDQUFhLFdBQWIsQ0FBeUIsY0FBekI7O0FBQ0EsU0FBSyxVQUFMLENBQWdCLFdBQWhCLENBQTRCLEtBQUssT0FBakMsRUFqRmMsQ0FtRmQ7OztBQUNBLHFCQUFLLE1BQUwsQ0FDSSxDQUFDLEtBQUssVUFBTixFQUFrQixLQUFLLFNBQXZCLENBREosRUFFSTtBQUFFLGFBQU8sRUFBRTtBQUFYLEtBRkosRUFHSTtBQUFFLGFBQU8sRUFBRSxDQUFYO0FBQWMsY0FBUSxFQUFFO0FBQXhCLEtBSEo7O0FBS0EscUJBQUssTUFBTCxDQUNJLEtBQUssT0FEVCxFQUVJO0FBQUUsT0FBQyxFQUFFO0FBQUwsS0FGSixFQUdJO0FBQUUsT0FBQyxFQUFFLENBQUw7QUFBUSxjQUFRLEVBQUUsR0FBbEI7QUFBdUIsV0FBSyxFQUFFO0FBQTlCLEtBSEo7O0FBS0EscUJBQUssTUFBTCxDQUNJLEtBQUssT0FEVCxFQUVJO0FBQUUsT0FBQyxFQUFFLENBQUM7QUFBTixLQUZKLEVBR0k7QUFBRSxPQUFDLEVBQUUsQ0FBTDtBQUFRLGNBQVEsRUFBRSxHQUFsQjtBQUF1QixXQUFLLEVBQUU7QUFBOUIsS0FISixFQTlGYyxDQW9HZDs7O0FBQ0EsWUFBUSxDQUFDLElBQVQsQ0FBYyxXQUFkLENBQTBCLEtBQUssVUFBL0IsRUFyR2MsQ0F1R2Q7O0FBQ0EsUUFBSSxLQUFLLGFBQUwsS0FBdUIsQ0FBM0IsRUFBOEI7QUFDMUIsV0FBSyxhQUFMO0FBQ0gsS0ExR2EsQ0EyR2Q7OztBQUNBLFFBQUksS0FBSyxhQUFMLEdBQXFCLEtBQUssZUFBTCxDQUFxQixNQUFyQixDQUE0QixNQUE1QixHQUFxQyxDQUE5RCxFQUFpRTtBQUM3RCxXQUFLLGFBQUw7QUFDSDs7QUFDRCxTQUFLLG9CQUFMLENBQTBCLFlBQTFCLEVBL0djLENBaUhkOztBQUNBLFNBQUssY0FBTCxHQUFzQixZQUF0QjtBQUNILEdBdkhEOztBQXlIQTtBQUNJO0FBQ0EsUUFDSSxLQUFLLG9CQUFMLENBQTBCLGFBQTFCLENBQ0ksd0JBQWlCLEtBQUssYUFBTCxHQUFxQixDQUF0QyxFQUF1QyxHQUF2QyxDQURKLEVBRUUsVUFGRixDQUVhLE1BRmIsS0FFd0IsQ0FINUIsRUFJRTtBQUNFO0FBQ0EsVUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBbEI7QUFDQSxVQUFNLGdCQUFnQixHQUNsQixLQUFLLGVBQUwsQ0FBcUIsTUFBckIsQ0FBNEIsS0FBSyxhQUFMLEdBQXFCLENBQWpELENBREosQ0FIRixDQU1FOztBQUNNLGVBQXNDLEtBQUssQ0FBQyxhQUFOLENBQ3hDLEtBQUssWUFEbUMsRUFFeEMsZ0JBRndDLENBQXRDO0FBQUEsVUFBRSxVQUFVLGdCQUFaO0FBQUEsVUFBYyxXQUFXLGlCQUF6QjtBQUFBLFVBQTJCLE1BQU0sWUFBakM7O0FBS04sdUJBQUssR0FBTCxDQUFTLFNBQVQsRUFBb0I7QUFDaEIsY0FBTSxFQUFFLFdBRFE7QUFFaEIsYUFBSyxFQUFFO0FBRlMsT0FBcEIsRUFaRixDQWlCRTs7O0FBQ0EsZUFBUyxDQUFDLEdBQVYsR0FBZ0IsZ0JBQWdCLENBQUMsR0FBakM7O0FBRUEsV0FBSyxvQkFBTCxDQUNLLGFBREwsQ0FDbUIsd0JBQWlCLEtBQUssYUFBTCxHQUFxQixDQUF0QyxFQUF1QyxHQUF2QyxDQURuQixFQUVLLE1BRkwsQ0FFWSxTQUZaO0FBR0g7QUFDSixHQTlCRDs7QUFnQ0E7QUFDSTtBQUNBLFFBQ0ksS0FBSyxvQkFBTCxDQUEwQixhQUExQixDQUNJLHdCQUFpQixLQUFLLGFBQXRCLEVBQW1DLEdBQW5DLENBREosRUFFRSxVQUZGLENBRWEsTUFGYixLQUV3QixDQUg1QixFQUlFO0FBQ0U7QUFDQSxVQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFsQjtBQUNBLFVBQU0sZ0JBQWdCLEdBQ2xCLEtBQUssZUFBTCxDQUFxQixNQUFyQixDQUE0QixLQUFLLGFBQUwsR0FBcUIsQ0FBakQsQ0FESixDQUhGLENBTUU7O0FBQ00sZUFBc0MsS0FBSyxDQUFDLGFBQU4sQ0FDeEMsS0FBSyxZQURtQyxFQUV4QyxnQkFGd0MsQ0FBdEM7QUFBQSxVQUFFLFVBQVUsZ0JBQVo7QUFBQSxVQUFjLFdBQVcsaUJBQXpCO0FBQUEsVUFBMkIsTUFBTSxZQUFqQzs7QUFLTix1QkFBSyxHQUFMLENBQVMsU0FBVCxFQUFvQjtBQUNoQixjQUFNLEVBQUUsV0FEUTtBQUVoQixhQUFLLEVBQUU7QUFGUyxPQUFwQixFQVpGLENBaUJFOzs7QUFDQSxlQUFTLENBQUMsR0FBVixHQUFnQixnQkFBZ0IsQ0FBQyxHQUFqQzs7QUFFQSxXQUFLLG9CQUFMLENBQ0ssYUFETCxDQUNtQix3QkFBaUIsS0FBSyxhQUF0QixFQUFtQyxHQUFuQyxDQURuQixFQUVLLE1BRkwsQ0FFWSxTQUZaO0FBR0g7QUFDSixHQTlCRDs7QUFnQ0EsdURBQXFCLFlBQXJCLEVBQW1EO0FBQW5ELHFCQUFtRCxDQUMvQzs7O0FBQ0EsU0FBSyxhQUFMLEdBQXFCLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQXJCOztBQUNBLFNBQUssYUFBTCxDQUFtQixTQUFuQixDQUE2QixHQUE3QixDQUFpQyx1QkFBakM7O0FBQ0EsU0FBSyxhQUFMLENBQW1CLEtBQW5CLENBQXlCLE1BQXpCLEdBQWtDLFVBQUcsWUFBWSxDQUFDLFlBQWhCLEVBQTRCLElBQTVCLENBQWxDO0FBQ0EsU0FBSyxhQUFMLENBQW1CLEtBQW5CLENBQXlCLEtBQXpCLEdBQWlDLFVBQUcsWUFBWSxDQUFDLFdBQWhCLEVBQTJCLElBQTNCLENBQWpDO0FBQ0EsU0FBSyxhQUFMLENBQW1CLEdBQW5CLEdBQXlCLFlBQVksQ0FBQyxHQUF0QyxDQU4rQyxDQVEvQzs7QUFFTSxhQUE4QyxLQUFLLENBQUMsYUFBTixDQUNoRCxLQUFLLFlBRDJDLEVBRWhELFlBRmdELENBQTlDO0FBQUEsUUFBRSxVQUFVLGdCQUFaO0FBQUEsUUFBYyxXQUFXLGlCQUF6QjtBQUFBLFFBQTJCLE1BQU0sWUFBakM7QUFBQSxRQUFtQyxNQUFNLFlBQXpDLENBVnlDLENBYy9DOzs7QUFDQSxxQkFBSyxNQUFMLENBQ0ksS0FBSyxhQURULEVBRUk7QUFDSSxPQUFDLEVBQUUsWUFBWSxDQUFDLFVBRHBCO0FBRUksT0FBQyxFQUFFLFlBQVksQ0FBQyxTQUFiLEdBQXlCLE1BQU0sQ0FBQyxPQUZ2QztBQUdJLFdBQUssRUFBRSxZQUFZLENBQUMsV0FIeEI7QUFJSSxZQUFNLEVBQUUsWUFBWSxDQUFDO0FBSnpCLEtBRkosRUFRSTtBQUNJLE9BQUMsRUFBRSxNQURQO0FBRUksT0FBQyxFQUFFLE1BRlA7QUFHSSxZQUFNLEVBQUUsV0FIWjtBQUlJLFdBQUssRUFBRSxVQUpYO0FBS0ksZ0JBQVUsRUFBRTtBQUNSLGFBQUksQ0FBQyxvQkFBTCxDQUNLLGFBREwsQ0FFUSx3QkFBaUIsS0FBSSxDQUFDLGFBQUwsR0FBcUIsQ0FBdEMsRUFBdUMsR0FBdkMsQ0FGUixFQUlLLE1BSkwsQ0FJWSxLQUFJLENBQUMsYUFKakI7O0FBS0EsYUFBSSxDQUFDLGFBQUwsQ0FBbUIsU0FBbkIsQ0FBNkIsTUFBN0IsQ0FDSSx1QkFESixFQU5RLENBU1I7OztBQUNBLGFBQUksQ0FBQyxhQUFMLENBQW1CLEtBQW5CLENBQXlCLFNBQXpCLEdBQXFDLEVBQXJDLENBVlEsQ0FZUjs7QUFDQSx5QkFBSyxFQUFMLENBQVEsS0FBSSxDQUFDLFdBQWIsRUFBMEI7QUFBRSxXQUFDLEVBQUUsRUFBTDtBQUFTLGtCQUFRLEVBQUU7QUFBbkIsU0FBMUI7O0FBQ0EseUJBQUssRUFBTCxDQUFRLEtBQUksQ0FBQyxXQUFiLEVBQTBCO0FBQUUsV0FBQyxFQUFFLENBQUMsRUFBTjtBQUFVLGtCQUFRLEVBQUU7QUFBcEIsU0FBMUI7QUFDSDtBQXBCTCxLQVJKOztBQWdDQSxZQUFRLENBQUMsSUFBVCxDQUFjLFdBQWQsQ0FBMEIsS0FBSyxhQUEvQjtBQUNILEdBaEREOztBQWtEQTtBQUFBOztBQUNJLFNBQUssT0FBTCxHQUFlLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQWY7O0FBQ0EsU0FBSyxPQUFMLENBQWEsU0FBYixDQUF1QixHQUF2QixDQUEyQixpQkFBM0I7O0FBRUEsUUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBbkI7QUFFQSxRQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFoQjtBQUNBLFdBQU8sQ0FBQyxTQUFSLENBQWtCLEdBQWxCLENBQXNCLDBCQUF0QixFQVBKLENBU0k7QUFDQTs7QUFDQSxRQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsMEJBQXZCLENBQW5CO0FBQ0EsY0FBVSxDQUFDLGdCQUFYLENBQTRCLE9BQTVCLEVBQXFDO0FBQ2pDLFdBQUksQ0FBQyxJQUFMOztBQUNBLHVCQUFLLEVBQUwsQ0FBUSxLQUFJLENBQUMsYUFBYixFQUE0QjtBQUFFLGFBQUssRUFBRTtBQUFULE9BQTVCO0FBQ0gsS0FIRDtBQUtBLFFBQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxnQkFBTixDQUF1QixVQUF2QixDQUFwQjtBQUNBLGVBQVcsQ0FBQyxTQUFaLENBQXNCLEdBQXRCLENBQTBCLHdCQUExQjtBQUNBLGVBQVcsQ0FBQyxnQkFBWixDQUE2QixPQUE3QixFQUFzQztBQUNsQyxXQUFJLENBQUMsS0FBTDtBQUNILEtBRkQ7QUFJQSxXQUFPLENBQUMsTUFBUixDQUFlLFVBQWYsRUFBMkIsV0FBM0I7O0FBRUEsU0FBSyxPQUFMLENBQWEsV0FBYixDQUF5QixVQUF6Qjs7QUFDQSxTQUFLLE9BQUwsQ0FBYSxXQUFiLENBQXlCLE9BQXpCO0FBQ0gsR0EzQkQ7O0FBNkJBLDhDQUFZLFFBQVosRUFBNEI7QUFDeEIsU0FBSyxPQUFMLENBQWEsYUFBYixDQUEyQixNQUEzQixFQUFtQyxTQUFuQyxHQUErQyxRQUEvQztBQUNILEdBRkQ7O0FBSUE7QUFBQTs7QUFDSSxRQUFNLFFBQVEsR0FBRyxLQUFLLGFBQUwsQ0FBbUIscUJBQW5CLEdBQTJDLElBQTVEOztBQUNBLFFBQU0sUUFBUSxHQUFHLEtBQUssYUFBTCxDQUFtQixxQkFBbkIsR0FBMkMsR0FBNUQsQ0FGSixDQUlJOzs7QUFDQSxTQUFLLGFBQUwsQ0FBbUIsU0FBbkIsQ0FBNkIsR0FBN0IsQ0FBaUMsdUJBQWpDOztBQUNBLFlBQVEsQ0FBQyxJQUFULENBQWMsV0FBZCxDQUEwQixLQUFLLGFBQS9CLEVBTkosQ0FRSTs7QUFDQSxxQkFBSyxNQUFMLENBQ0ksS0FBSyxhQURULEVBRUk7QUFDSSxPQUFDLEVBQUUsUUFEUDtBQUVJLE9BQUMsRUFBRSxRQUZQO0FBR0ksV0FBSyxFQUFFLEtBQUssYUFBTCxDQUFtQixXQUg5QjtBQUlJLFlBQU0sRUFBRSxLQUFLLGFBQUwsQ0FBbUI7QUFKL0IsS0FGSixFQVFJO0FBQ0ksT0FBQyxFQUFFLEtBQUssY0FBTCxDQUFvQixVQUQzQjtBQUVJLE9BQUMsRUFBRSxLQUFLLGNBQUwsQ0FBb0IsU0FBcEIsR0FBZ0MsTUFBTSxDQUFDLE9BRjlDO0FBR0ksWUFBTSxFQUFFLEtBQUssY0FBTCxDQUFvQixZQUhoQztBQUlJLFdBQUssRUFBRSxLQUFLLGNBQUwsQ0FBb0IsV0FKL0I7QUFLSSxjQUFRLEVBQUUsR0FMZDtBQU1JLGdCQUFVLEVBQUU7QUFDUixhQUFJLENBQUMsYUFBTCxDQUFtQixNQUFuQjtBQUNIO0FBUkwsS0FSSjs7QUFvQkEscUJBQUssRUFBTCxDQUFRLENBQUMsS0FBSyxVQUFOLEVBQWtCLEtBQUssU0FBdkIsQ0FBUixFQUEyQztBQUN2QyxhQUFPLEVBQUUsQ0FEOEI7QUFFdkMsY0FBUSxFQUFFLEdBRjZCO0FBR3ZDLGdCQUFVLEVBQUU7QUFDUixhQUFJLENBQUMsU0FBTCxDQUFlLE1BQWY7O0FBQ0EsYUFBSSxDQUFDLFVBQUwsQ0FBZ0IsTUFBaEI7O0FBQ0EsYUFBSyxDQUFDLGVBQU47QUFDSDtBQVBzQyxLQUEzQzs7QUFVQSxxQkFBSyxFQUFMLENBQVEsS0FBSyxPQUFiLEVBQXNCO0FBQ2xCLE9BQUMsRUFBRSxHQURlO0FBRWxCLGNBQVEsRUFBRTtBQUZRLEtBQXRCLEVBdkNKLENBNENJOzs7QUFDQSxxQkFBSyxFQUFMLENBQVEsS0FBSyxPQUFiLEVBQXNCO0FBQ2xCLE9BQUMsRUFBRSxDQUFDLEVBRGM7QUFFbEIsY0FBUSxFQUFFO0FBRlEsS0FBdEIsRUE3Q0osQ0FrREk7OztBQUNBLHFCQUFLLEVBQUwsQ0FBUSxLQUFLLFdBQWIsRUFBMEI7QUFBRSxPQUFDLEVBQUUsQ0FBTDtBQUFRLGNBQVEsRUFBRTtBQUFsQixLQUExQjtBQUNILEdBcEREOztBQXFEQTtBQUNJLFNBQUssYUFBTCxJQUFzQixDQUF0Qjs7QUFFQSxxQkFBSyxFQUFMLENBQVEsS0FBSyxvQkFBYixFQUFtQztBQUMvQixPQUFDLEVBQUUsRUFBRSxLQUFLLGFBQUwsR0FBcUIsUUFBUSxDQUFDLElBQVQsQ0FBYyxXQUFyQyxDQUQ0QjtBQUUvQixjQUFRLEVBQUU7QUFGcUIsS0FBbkM7O0FBS0EsU0FBSyxXQUFMLENBQ0ksVUFBRyxLQUFLLGFBQUwsR0FBcUIsQ0FBeEIsRUFBeUIsS0FBekIsRUFBeUIsTUFBekIsQ0FBK0IsS0FBSyxlQUFMLENBQXFCLE1BQXJCLENBQTRCLE1BQTNELENBREo7QUFJQSxTQUFLLGNBQUwsR0FBc0IsS0FBSyxlQUFMLENBQXFCLE1BQXJCLENBQTRCLEtBQUssYUFBakMsQ0FBdEI7QUFDQSxTQUFLLGFBQUwsR0FBcUIsS0FBSyxvQkFBTCxDQUEwQixhQUExQixDQUNqQix3QkFBaUIsS0FBSyxhQUFMLEdBQXFCLENBQXRDLEVBQXVDLFNBQXZDLENBRGlCLENBQXJCLENBYkosQ0FpQkk7O0FBQ0EsUUFBSSxLQUFLLGFBQUwsS0FBdUIsQ0FBM0IsRUFBOEI7QUFDMUIsV0FBSyxhQUFMOztBQUNBLFdBQUssV0FBTCxDQUFpQixlQUFqQixDQUFpQyxVQUFqQztBQUNILEtBSEQsTUFHTztBQUNILFdBQUssV0FBTCxDQUFpQixZQUFqQixDQUE4QixVQUE5QixFQUEwQyxFQUExQztBQUNIO0FBQ0osR0F4QkQ7O0FBMEJBO0FBQ0ksU0FBSyxhQUFMLElBQXNCLENBQXRCOztBQUVBLHFCQUFLLEVBQUwsQ0FBUSxLQUFLLG9CQUFiLEVBQW1DO0FBQy9CLE9BQUMsRUFBRSxFQUFFLEtBQUssYUFBTCxHQUFxQixRQUFRLENBQUMsSUFBVCxDQUFjLFdBQXJDLENBRDRCO0FBRS9CLGNBQVEsRUFBRTtBQUZxQixLQUFuQzs7QUFLQSxTQUFLLFdBQUwsQ0FDSSxVQUFHLEtBQUssYUFBTCxHQUFxQixDQUF4QixFQUF5QixLQUF6QixFQUF5QixNQUF6QixDQUErQixLQUFLLGVBQUwsQ0FBcUIsTUFBckIsQ0FBNEIsTUFBM0QsQ0FESjtBQUlBLFNBQUssY0FBTCxHQUFzQixLQUFLLGVBQUwsQ0FBcUIsTUFBckIsQ0FBNEIsS0FBSyxhQUFqQyxDQUF0QjtBQUNBLFNBQUssYUFBTCxHQUFxQixLQUFLLG9CQUFMLENBQTBCLGFBQTFCLENBQ2pCLHdCQUFpQixLQUFLLGFBQUwsR0FBcUIsQ0FBdEMsRUFBdUMsU0FBdkMsQ0FEaUIsQ0FBckIsQ0FiSixDQWlCSTs7QUFDQSxRQUFJLEtBQUssYUFBTCxHQUFxQixLQUFLLGVBQUwsQ0FBcUIsTUFBckIsQ0FBNEIsTUFBNUIsR0FBcUMsQ0FBOUQsRUFBaUU7QUFDN0QsV0FBSyxhQUFMOztBQUNBLFdBQUssV0FBTCxDQUFpQixlQUFqQixDQUFpQyxVQUFqQztBQUNILEtBSEQsTUFHTztBQUNIO0FBQ0EsV0FBSyxXQUFMLENBQWlCLFlBQWpCLENBQThCLFVBQTlCLEVBQTBDLEVBQTFDO0FBQ0g7QUFDSixHQXpCRDs7QUEyQkE7QUFDSSxxQkFBSyxFQUFMLENBQVEsS0FBSyxPQUFiLEVBQXNCO0FBQUUsT0FBQyxFQUFFLEdBQUw7QUFBVSxjQUFRLEVBQUU7QUFBcEIsS0FBdEI7QUFDSCxHQUZEOztBQUdKO0FBQUMsQ0F6WUQ7O2VBMlllLFM7Ozs7OztBQ2haZjs7QUFFQTs7OztBQUdBLElBQU0sU0FBUyxHQUFjLEVBQTdCO0FBQ0EsSUFBTSxTQUFTLEdBQWMsSUFBSSxxQkFBSixFQUE3QixDLENBRUE7O0FBQ0EsUUFBUSxDQUFDLGdCQUFULENBQTRDLGlCQUE1QyxFQUErRCxPQUEvRCxDQUF1RSxVQUFDLFdBQUQsRUFBWTtBQUMvRSxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUMsWUFBWixDQUF5QixjQUF6QixDQUFsQjtBQUNBLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxhQUFaLENBQTBCLEtBQTFCLENBQWQsQ0FGK0UsQ0FHL0U7O0FBQ0EsTUFBSSxTQUFTLENBQUMsTUFBVixHQUFtQixDQUF2QixFQUEwQjtBQUN0QixhQUFTLENBQUMsS0FBVixDQUFnQixtQkFBTztBQUNuQixVQUFJLE9BQU8sQ0FBQyxFQUFSLEtBQWUsU0FBbkIsRUFBOEI7QUFDMUIsZUFBTyxDQUFDLFFBQVIsQ0FBaUIsS0FBakI7QUFDQSxtQkFBVyxDQUFDLFlBQVosQ0FBeUIsWUFBekIsRUFBdUMsQ0FBQyxPQUFPLENBQUMsTUFBUixDQUFlLE1BQWYsR0FBd0IsQ0FBekIsRUFBNEIsUUFBNUIsRUFBdkM7QUFDQSxlQUFPLEtBQVA7QUFDSDtBQUNKLEtBTkQ7QUFPSCxHQVJELE1BUU87QUFDSDtBQUNBLFFBQU0sVUFBVSxHQUFHLElBQUksbUJBQUosQ0FBWSxTQUFaLENBQW5CO0FBQ0EsY0FBVSxDQUFDLFFBQVgsQ0FBb0IsS0FBcEI7QUFDQSxhQUFTLENBQUMsSUFBVixDQUFlLFVBQWY7QUFDQSxlQUFXLENBQUMsWUFBWixDQUF5QixZQUF6QixFQUF1QyxDQUFDLFVBQVUsQ0FBQyxNQUFYLENBQWtCLE1BQWxCLEdBQTJCLENBQTVCLEVBQStCLFFBQS9CLEVBQXZDO0FBQ0gsR0FsQjhFLENBb0IvRTs7O0FBQ0EsYUFBVyxDQUFDLGdCQUFaLENBQTZCLE9BQTdCLEVBQXNDLFVBQVMsS0FBVCxFQUE2RDtBQUMvRixTQUFLLENBQUMsY0FBTjtBQUVBLFFBQUksT0FBTyxHQUFHLElBQWQ7QUFFQSxhQUFTLENBQUMsS0FBVixDQUFnQixlQUFHO0FBQ2YsVUFBRyxHQUFHLENBQUMsRUFBSixLQUFXLEtBQUssQ0FBQyxhQUFOLENBQW9CLFlBQXBCLENBQWlDLGNBQWpDLENBQWQsRUFBZ0U7QUFDNUQsZUFBTyxHQUFHLEdBQVY7QUFDSDtBQUNKLEtBSkQ7QUFNQSxhQUFTLENBQUMsSUFBVixDQUFlLE9BQWYsRUFBd0IsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsYUFBcEIsQ0FBa0MsS0FBbEMsQ0FBeEIsRUFBa0UsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsWUFBcEIsQ0FBaUMsZUFBakMsQ0FBbEUsRUFBcUgsUUFBUSxDQUFDLEtBQUssQ0FBQyxhQUFOLENBQW9CLFlBQXBCLENBQWlDLFlBQWpDLENBQUQsQ0FBN0g7QUFDSCxHQVpEO0FBYUgsQ0FsQ0Q7Ozs7Ozs7Ozs7Ozs7O0FDRk0sU0FBVSxZQUFWLENBQ0YsS0FERSxFQUVGLFFBRkUsRUFFZ0I7QUFGdEI7O0FBSUksTUFBSSxDQUFKLEVBQU8sQ0FBUDtBQUNBLE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQztBQUNyQixLQUFDLEdBQUcsS0FBSyxDQUFDLFlBQVY7QUFDQSxLQUFDLEdBQUcsS0FBSyxDQUFDLGFBQVY7O0FBRUEsUUFBSSxDQUFDLElBQUksQ0FBVCxFQUFZO0FBQ1IsbUJBQWEsQ0FBQyxJQUFELENBQWI7QUFDQSxjQUFRLENBQUMsS0FBVCxDQUFlLEtBQWYsRUFBcUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFyQjtBQUNIO0FBQ0osR0FSdUIsQ0FBeEI7QUFTSDs7QUFFSyxTQUFVLGdCQUFWLEdBQTBCO0FBQzVCLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxXQUFQLElBQXNCLFFBQVEsQ0FBQyxlQUFULENBQXlCLFNBQWpFO0FBQ0EsTUFBTSxVQUFVLEdBQ1osTUFBTSxDQUFDLFdBQVAsSUFBc0IsUUFBUSxDQUFDLGVBQVQsQ0FBeUIsVUFEbkQ7O0FBR0EsUUFBTSxDQUFDLFFBQVAsR0FBa0I7QUFDZCxVQUFNLENBQUMsUUFBUCxDQUFnQixVQUFoQixFQUE0QixTQUE1QjtBQUNILEdBRkQ7QUFHSDs7QUFFSyxTQUFVLGVBQVYsR0FBeUI7QUFDM0IsUUFBTSxDQUFDLFFBQVAsR0FBa0IsYUFBYyxDQUFoQztBQUNIOztBQUVLLFNBQVUsZ0JBQVYsQ0FBMkIsT0FBM0IsRUFBMEM7QUFDNUMsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBZjtBQUNBLFFBQU0sQ0FBQyxTQUFQLENBQWlCLEdBQWpCLENBQXFCLFVBQXJCLEVBQWlDLE9BQWpDO0FBQ0EsU0FBTyxNQUFQO0FBQ0g7O0FBRUssU0FBVSxhQUFWLENBQXdCLFdBQXhCLEVBQXFELFlBQXJELEVBQW1GO0FBQ3JGLE1BQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxZQUFiLEdBQTRCLFlBQVksQ0FBQyxhQUF2RDtBQUNBLE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxXQUFaLEdBQTBCLFdBQVcsQ0FBQyxZQUFyRDtBQUVBLE1BQUksVUFBSixFQUFnQixXQUFoQixFQUE2QixNQUE3QixFQUFxQyxNQUFyQzs7QUFFQSxNQUFJLEtBQUssR0FBRyxNQUFaLEVBQW9CO0FBQ2hCLFFBQU0sV0FBVyxHQUNiLFdBQVcsQ0FBQyxZQUFaLEdBQTJCLFlBQVksQ0FBQyxhQUQ1QztBQUVBLGVBQVcsR0FBRyxXQUFXLENBQUMsWUFBMUI7QUFDQSxjQUFVLEdBQUcsWUFBWSxDQUFDLFlBQWIsR0FBNEIsV0FBekM7QUFFQSxVQUFNLEdBQUcsV0FBVyxDQUFDLFdBQVosR0FBMEIsQ0FBMUIsR0FBOEIsVUFBVSxHQUFHLENBQXBEO0FBQ0EsVUFBTSxHQUFHLFdBQVcsQ0FBQyxTQUFyQjtBQUNILEdBUkQsTUFRTztBQUNILFFBQU0sV0FBVyxHQUFHLFdBQVcsQ0FBQyxXQUFaLEdBQTBCLFlBQVksQ0FBQyxZQUEzRDtBQUVBLGNBQVUsR0FBRyxXQUFXLENBQUMsV0FBekI7QUFDQSxlQUFXLEdBQUcsWUFBWSxDQUFDLGFBQWIsR0FBNkIsV0FBM0M7QUFFQSxVQUFNLEdBQUcsV0FBVyxDQUFDLFVBQXJCO0FBQ0EsVUFBTSxHQUFJLFdBQVcsQ0FBQyxZQUFaLEdBQTJCLENBQTNCLEdBQStCLFdBQVcsR0FBRyxDQUE5QyxHQUFtRCxXQUFXLENBQUMscUJBQVosR0FBb0MsR0FBaEc7QUFDSDs7QUFFRCxTQUFPO0FBQ0gsY0FBVSxFQUFFLFVBRFQ7QUFFSCxlQUFXLEVBQUUsV0FGVjtBQUdILFVBQU0sRUFBRSxNQUhMO0FBSUgsVUFBTSxFQUFFO0FBSkwsR0FBUDtBQU1IIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuICAoZ2xvYmFsID0gZ2xvYmFsIHx8IHNlbGYsIGZhY3RvcnkoZ2xvYmFsLndpbmRvdyA9IGdsb2JhbC53aW5kb3cgfHwge30pKTtcbn0odGhpcywgKGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxuICBmdW5jdGlvbiBfaW5oZXJpdHNMb29zZShzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICAgIHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcy5wcm90b3R5cGUpO1xuICAgIHN1YkNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHN1YkNsYXNzO1xuICAgIHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG4gIH1cblxuICBmdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHtcbiAgICBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7XG4gICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGY7XG4gIH1cblxuICAvKiFcbiAgICogR1NBUCAzLjEwLjJcbiAgICogaHR0cHM6Ly9ncmVlbnNvY2suY29tXG4gICAqXG4gICAqIEBsaWNlbnNlIENvcHlyaWdodCAyMDA4LTIwMjIsIEdyZWVuU29jay4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAgICogU3ViamVjdCB0byB0aGUgdGVybXMgYXQgaHR0cHM6Ly9ncmVlbnNvY2suY29tL3N0YW5kYXJkLWxpY2Vuc2Ugb3IgZm9yXG4gICAqIENsdWIgR3JlZW5Tb2NrIG1lbWJlcnMsIHRoZSBhZ3JlZW1lbnQgaXNzdWVkIHdpdGggdGhhdCBtZW1iZXJzaGlwLlxuICAgKiBAYXV0aG9yOiBKYWNrIERveWxlLCBqYWNrQGdyZWVuc29jay5jb21cbiAgKi9cbiAgdmFyIF9jb25maWcgPSB7XG4gICAgYXV0b1NsZWVwOiAxMjAsXG4gICAgZm9yY2UzRDogXCJhdXRvXCIsXG4gICAgbnVsbFRhcmdldFdhcm46IDEsXG4gICAgdW5pdHM6IHtcbiAgICAgIGxpbmVIZWlnaHQ6IFwiXCJcbiAgICB9XG4gIH0sXG4gICAgICBfZGVmYXVsdHMgPSB7XG4gICAgZHVyYXRpb246IC41LFxuICAgIG92ZXJ3cml0ZTogZmFsc2UsXG4gICAgZGVsYXk6IDBcbiAgfSxcbiAgICAgIF9zdXBwcmVzc092ZXJ3cml0ZXMsXG4gICAgICBfYmlnTnVtID0gMWU4LFxuICAgICAgX3RpbnlOdW0gPSAxIC8gX2JpZ051bSxcbiAgICAgIF8yUEkgPSBNYXRoLlBJICogMixcbiAgICAgIF9IQUxGX1BJID0gXzJQSSAvIDQsXG4gICAgICBfZ3NJRCA9IDAsXG4gICAgICBfc3FydCA9IE1hdGguc3FydCxcbiAgICAgIF9jb3MgPSBNYXRoLmNvcyxcbiAgICAgIF9zaW4gPSBNYXRoLnNpbixcbiAgICAgIF9pc1N0cmluZyA9IGZ1bmN0aW9uIF9pc1N0cmluZyh2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCI7XG4gIH0sXG4gICAgICBfaXNGdW5jdGlvbiA9IGZ1bmN0aW9uIF9pc0Z1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiO1xuICB9LFxuICAgICAgX2lzTnVtYmVyID0gZnVuY3Rpb24gX2lzTnVtYmVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJudW1iZXJcIjtcbiAgfSxcbiAgICAgIF9pc1VuZGVmaW5lZCA9IGZ1bmN0aW9uIF9pc1VuZGVmaW5lZCh2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwidW5kZWZpbmVkXCI7XG4gIH0sXG4gICAgICBfaXNPYmplY3QgPSBmdW5jdGlvbiBfaXNPYmplY3QodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiO1xuICB9LFxuICAgICAgX2lzTm90RmFsc2UgPSBmdW5jdGlvbiBfaXNOb3RGYWxzZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAhPT0gZmFsc2U7XG4gIH0sXG4gICAgICBfd2luZG93RXhpc3RzID0gZnVuY3Rpb24gX3dpbmRvd0V4aXN0cygpIHtcbiAgICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgfSxcbiAgICAgIF9pc0Z1bmNPclN0cmluZyA9IGZ1bmN0aW9uIF9pc0Z1bmNPclN0cmluZyh2YWx1ZSkge1xuICAgIHJldHVybiBfaXNGdW5jdGlvbih2YWx1ZSkgfHwgX2lzU3RyaW5nKHZhbHVlKTtcbiAgfSxcbiAgICAgIF9pc1R5cGVkQXJyYXkgPSB0eXBlb2YgQXJyYXlCdWZmZXIgPT09IFwiZnVuY3Rpb25cIiAmJiBBcnJheUJ1ZmZlci5pc1ZpZXcgfHwgZnVuY3Rpb24gKCkge30sXG4gICAgICBfaXNBcnJheSA9IEFycmF5LmlzQXJyYXksXG4gICAgICBfc3RyaWN0TnVtRXhwID0gLyg/Oi0/XFwuP1xcZHxcXC4pKy9naSxcbiAgICAgIF9udW1FeHAgPSAvWy0rPS5dKlxcZCtbLmVcXC0rXSpcXGQqW2VcXC0rXSpcXGQqL2csXG4gICAgICBfbnVtV2l0aFVuaXRFeHAgPSAvWy0rPS5dKlxcZCtbLmUtXSpcXGQqW2EteiVdKi9nLFxuICAgICAgX2NvbXBsZXhTdHJpbmdOdW1FeHAgPSAvWy0rPS5dKlxcZCtcXC4/XFxkKig/OmUtfGVcXCspP1xcZCovZ2ksXG4gICAgICBfcmVsRXhwID0gL1srLV09LT9bLlxcZF0rLyxcbiAgICAgIF9kZWxpbWl0ZWRWYWx1ZUV4cCA9IC9bXiwnXCJcXFtcXF1cXHNdKy9naSxcbiAgICAgIF91bml0RXhwID0gL15bK1xcLT1lXFxzXFxkXSpcXGQrWy5cXGRdKihbYS16XSp8JSlcXHMqJC9pLFxuICAgICAgX2dsb2JhbFRpbWVsaW5lLFxuICAgICAgX3dpbixcbiAgICAgIF9jb3JlSW5pdHRlZCxcbiAgICAgIF9kb2MsXG4gICAgICBfZ2xvYmFscyA9IHt9LFxuICAgICAgX2luc3RhbGxTY29wZSA9IHt9LFxuICAgICAgX2NvcmVSZWFkeSxcbiAgICAgIF9pbnN0YWxsID0gZnVuY3Rpb24gX2luc3RhbGwoc2NvcGUpIHtcbiAgICByZXR1cm4gKF9pbnN0YWxsU2NvcGUgPSBfbWVyZ2Uoc2NvcGUsIF9nbG9iYWxzKSkgJiYgZ3NhcDtcbiAgfSxcbiAgICAgIF9taXNzaW5nUGx1Z2luID0gZnVuY3Rpb24gX21pc3NpbmdQbHVnaW4ocHJvcGVydHksIHZhbHVlKSB7XG4gICAgcmV0dXJuIGNvbnNvbGUud2FybihcIkludmFsaWQgcHJvcGVydHlcIiwgcHJvcGVydHksIFwic2V0IHRvXCIsIHZhbHVlLCBcIk1pc3NpbmcgcGx1Z2luPyBnc2FwLnJlZ2lzdGVyUGx1Z2luKClcIik7XG4gIH0sXG4gICAgICBfd2FybiA9IGZ1bmN0aW9uIF93YXJuKG1lc3NhZ2UsIHN1cHByZXNzKSB7XG4gICAgcmV0dXJuICFzdXBwcmVzcyAmJiBjb25zb2xlLndhcm4obWVzc2FnZSk7XG4gIH0sXG4gICAgICBfYWRkR2xvYmFsID0gZnVuY3Rpb24gX2FkZEdsb2JhbChuYW1lLCBvYmopIHtcbiAgICByZXR1cm4gbmFtZSAmJiAoX2dsb2JhbHNbbmFtZV0gPSBvYmopICYmIF9pbnN0YWxsU2NvcGUgJiYgKF9pbnN0YWxsU2NvcGVbbmFtZV0gPSBvYmopIHx8IF9nbG9iYWxzO1xuICB9LFxuICAgICAgX2VtcHR5RnVuYyA9IGZ1bmN0aW9uIF9lbXB0eUZ1bmMoKSB7XG4gICAgcmV0dXJuIDA7XG4gIH0sXG4gICAgICBfcmVzZXJ2ZWRQcm9wcyA9IHt9LFxuICAgICAgX2xhenlUd2VlbnMgPSBbXSxcbiAgICAgIF9sYXp5TG9va3VwID0ge30sXG4gICAgICBfbGFzdFJlbmRlcmVkRnJhbWUsXG4gICAgICBfcGx1Z2lucyA9IHt9LFxuICAgICAgX2VmZmVjdHMgPSB7fSxcbiAgICAgIF9uZXh0R0NGcmFtZSA9IDMwLFxuICAgICAgX2hhcm5lc3NQbHVnaW5zID0gW10sXG4gICAgICBfY2FsbGJhY2tOYW1lcyA9IFwiXCIsXG4gICAgICBfaGFybmVzcyA9IGZ1bmN0aW9uIF9oYXJuZXNzKHRhcmdldHMpIHtcbiAgICB2YXIgdGFyZ2V0ID0gdGFyZ2V0c1swXSxcbiAgICAgICAgaGFybmVzc1BsdWdpbixcbiAgICAgICAgaTtcbiAgICBfaXNPYmplY3QodGFyZ2V0KSB8fCBfaXNGdW5jdGlvbih0YXJnZXQpIHx8ICh0YXJnZXRzID0gW3RhcmdldHNdKTtcblxuICAgIGlmICghKGhhcm5lc3NQbHVnaW4gPSAodGFyZ2V0Ll9nc2FwIHx8IHt9KS5oYXJuZXNzKSkge1xuICAgICAgaSA9IF9oYXJuZXNzUGx1Z2lucy5sZW5ndGg7XG5cbiAgICAgIHdoaWxlIChpLS0gJiYgIV9oYXJuZXNzUGx1Z2luc1tpXS50YXJnZXRUZXN0KHRhcmdldCkpIHt9XG5cbiAgICAgIGhhcm5lc3NQbHVnaW4gPSBfaGFybmVzc1BsdWdpbnNbaV07XG4gICAgfVxuXG4gICAgaSA9IHRhcmdldHMubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgdGFyZ2V0c1tpXSAmJiAodGFyZ2V0c1tpXS5fZ3NhcCB8fCAodGFyZ2V0c1tpXS5fZ3NhcCA9IG5ldyBHU0NhY2hlKHRhcmdldHNbaV0sIGhhcm5lc3NQbHVnaW4pKSkgfHwgdGFyZ2V0cy5zcGxpY2UoaSwgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldHM7XG4gIH0sXG4gICAgICBfZ2V0Q2FjaGUgPSBmdW5jdGlvbiBfZ2V0Q2FjaGUodGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRhcmdldC5fZ3NhcCB8fCBfaGFybmVzcyh0b0FycmF5KHRhcmdldCkpWzBdLl9nc2FwO1xuICB9LFxuICAgICAgX2dldFByb3BlcnR5ID0gZnVuY3Rpb24gX2dldFByb3BlcnR5KHRhcmdldCwgcHJvcGVydHksIHYpIHtcbiAgICByZXR1cm4gKHYgPSB0YXJnZXRbcHJvcGVydHldKSAmJiBfaXNGdW5jdGlvbih2KSA/IHRhcmdldFtwcm9wZXJ0eV0oKSA6IF9pc1VuZGVmaW5lZCh2KSAmJiB0YXJnZXQuZ2V0QXR0cmlidXRlICYmIHRhcmdldC5nZXRBdHRyaWJ1dGUocHJvcGVydHkpIHx8IHY7XG4gIH0sXG4gICAgICBfZm9yRWFjaE5hbWUgPSBmdW5jdGlvbiBfZm9yRWFjaE5hbWUobmFtZXMsIGZ1bmMpIHtcbiAgICByZXR1cm4gKG5hbWVzID0gbmFtZXMuc3BsaXQoXCIsXCIpKS5mb3JFYWNoKGZ1bmMpIHx8IG5hbWVzO1xuICB9LFxuICAgICAgX3JvdW5kID0gZnVuY3Rpb24gX3JvdW5kKHZhbHVlKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQodmFsdWUgKiAxMDAwMDApIC8gMTAwMDAwIHx8IDA7XG4gIH0sXG4gICAgICBfcm91bmRQcmVjaXNlID0gZnVuY3Rpb24gX3JvdW5kUHJlY2lzZSh2YWx1ZSkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKHZhbHVlICogMTAwMDAwMDApIC8gMTAwMDAwMDAgfHwgMDtcbiAgfSxcbiAgICAgIF9wYXJzZVJlbGF0aXZlID0gZnVuY3Rpb24gX3BhcnNlUmVsYXRpdmUoc3RhcnQsIHZhbHVlKSB7XG4gICAgdmFyIG9wZXJhdG9yID0gdmFsdWUuY2hhckF0KDApLFxuICAgICAgICBlbmQgPSBwYXJzZUZsb2F0KHZhbHVlLnN1YnN0cigyKSk7XG4gICAgc3RhcnQgPSBwYXJzZUZsb2F0KHN0YXJ0KTtcbiAgICByZXR1cm4gb3BlcmF0b3IgPT09IFwiK1wiID8gc3RhcnQgKyBlbmQgOiBvcGVyYXRvciA9PT0gXCItXCIgPyBzdGFydCAtIGVuZCA6IG9wZXJhdG9yID09PSBcIipcIiA/IHN0YXJ0ICogZW5kIDogc3RhcnQgLyBlbmQ7XG4gIH0sXG4gICAgICBfYXJyYXlDb250YWluc0FueSA9IGZ1bmN0aW9uIF9hcnJheUNvbnRhaW5zQW55KHRvU2VhcmNoLCB0b0ZpbmQpIHtcbiAgICB2YXIgbCA9IHRvRmluZC5sZW5ndGgsXG4gICAgICAgIGkgPSAwO1xuXG4gICAgZm9yICg7IHRvU2VhcmNoLmluZGV4T2YodG9GaW5kW2ldKSA8IDAgJiYgKytpIDwgbDspIHt9XG5cbiAgICByZXR1cm4gaSA8IGw7XG4gIH0sXG4gICAgICBfbGF6eVJlbmRlciA9IGZ1bmN0aW9uIF9sYXp5UmVuZGVyKCkge1xuICAgIHZhciBsID0gX2xhenlUd2VlbnMubGVuZ3RoLFxuICAgICAgICBhID0gX2xhenlUd2VlbnMuc2xpY2UoMCksXG4gICAgICAgIGksXG4gICAgICAgIHR3ZWVuO1xuXG4gICAgX2xhenlMb29rdXAgPSB7fTtcbiAgICBfbGF6eVR3ZWVucy5sZW5ndGggPSAwO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgdHdlZW4gPSBhW2ldO1xuICAgICAgdHdlZW4gJiYgdHdlZW4uX2xhenkgJiYgKHR3ZWVuLnJlbmRlcih0d2Vlbi5fbGF6eVswXSwgdHdlZW4uX2xhenlbMV0sIHRydWUpLl9sYXp5ID0gMCk7XG4gICAgfVxuICB9LFxuICAgICAgX2xhenlTYWZlUmVuZGVyID0gZnVuY3Rpb24gX2xhenlTYWZlUmVuZGVyKGFuaW1hdGlvbiwgdGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKSB7XG4gICAgX2xhenlUd2VlbnMubGVuZ3RoICYmIF9sYXp5UmVuZGVyKCk7XG4gICAgYW5pbWF0aW9uLnJlbmRlcih0aW1lLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuICAgIF9sYXp5VHdlZW5zLmxlbmd0aCAmJiBfbGF6eVJlbmRlcigpO1xuICB9LFxuICAgICAgX251bWVyaWNJZlBvc3NpYmxlID0gZnVuY3Rpb24gX251bWVyaWNJZlBvc3NpYmxlKHZhbHVlKSB7XG4gICAgdmFyIG4gPSBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICByZXR1cm4gKG4gfHwgbiA9PT0gMCkgJiYgKHZhbHVlICsgXCJcIikubWF0Y2goX2RlbGltaXRlZFZhbHVlRXhwKS5sZW5ndGggPCAyID8gbiA6IF9pc1N0cmluZyh2YWx1ZSkgPyB2YWx1ZS50cmltKCkgOiB2YWx1ZTtcbiAgfSxcbiAgICAgIF9wYXNzVGhyb3VnaCA9IGZ1bmN0aW9uIF9wYXNzVGhyb3VnaChwKSB7XG4gICAgcmV0dXJuIHA7XG4gIH0sXG4gICAgICBfc2V0RGVmYXVsdHMgPSBmdW5jdGlvbiBfc2V0RGVmYXVsdHMob2JqLCBkZWZhdWx0cykge1xuICAgIGZvciAodmFyIHAgaW4gZGVmYXVsdHMpIHtcbiAgICAgIHAgaW4gb2JqIHx8IChvYmpbcF0gPSBkZWZhdWx0c1twXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbiAgfSxcbiAgICAgIF9zZXRLZXlmcmFtZURlZmF1bHRzID0gZnVuY3Rpb24gX3NldEtleWZyYW1lRGVmYXVsdHMoZXhjbHVkZUR1cmF0aW9uKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvYmosIGRlZmF1bHRzKSB7XG4gICAgICBmb3IgKHZhciBwIGluIGRlZmF1bHRzKSB7XG4gICAgICAgIHAgaW4gb2JqIHx8IHAgPT09IFwiZHVyYXRpb25cIiAmJiBleGNsdWRlRHVyYXRpb24gfHwgcCA9PT0gXCJlYXNlXCIgfHwgKG9ialtwXSA9IGRlZmF1bHRzW3BdKTtcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICAgICAgX21lcmdlID0gZnVuY3Rpb24gX21lcmdlKGJhc2UsIHRvTWVyZ2UpIHtcbiAgICBmb3IgKHZhciBwIGluIHRvTWVyZ2UpIHtcbiAgICAgIGJhc2VbcF0gPSB0b01lcmdlW3BdO1xuICAgIH1cblxuICAgIHJldHVybiBiYXNlO1xuICB9LFxuICAgICAgX21lcmdlRGVlcCA9IGZ1bmN0aW9uIF9tZXJnZURlZXAoYmFzZSwgdG9NZXJnZSkge1xuICAgIGZvciAodmFyIHAgaW4gdG9NZXJnZSkge1xuICAgICAgcCAhPT0gXCJfX3Byb3RvX19cIiAmJiBwICE9PSBcImNvbnN0cnVjdG9yXCIgJiYgcCAhPT0gXCJwcm90b3R5cGVcIiAmJiAoYmFzZVtwXSA9IF9pc09iamVjdCh0b01lcmdlW3BdKSA/IF9tZXJnZURlZXAoYmFzZVtwXSB8fCAoYmFzZVtwXSA9IHt9KSwgdG9NZXJnZVtwXSkgOiB0b01lcmdlW3BdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYmFzZTtcbiAgfSxcbiAgICAgIF9jb3B5RXhjbHVkaW5nID0gZnVuY3Rpb24gX2NvcHlFeGNsdWRpbmcob2JqLCBleGNsdWRpbmcpIHtcbiAgICB2YXIgY29weSA9IHt9LFxuICAgICAgICBwO1xuXG4gICAgZm9yIChwIGluIG9iaikge1xuICAgICAgcCBpbiBleGNsdWRpbmcgfHwgKGNvcHlbcF0gPSBvYmpbcF0pO1xuICAgIH1cblxuICAgIHJldHVybiBjb3B5O1xuICB9LFxuICAgICAgX2luaGVyaXREZWZhdWx0cyA9IGZ1bmN0aW9uIF9pbmhlcml0RGVmYXVsdHModmFycykge1xuICAgIHZhciBwYXJlbnQgPSB2YXJzLnBhcmVudCB8fCBfZ2xvYmFsVGltZWxpbmUsXG4gICAgICAgIGZ1bmMgPSB2YXJzLmtleWZyYW1lcyA/IF9zZXRLZXlmcmFtZURlZmF1bHRzKF9pc0FycmF5KHZhcnMua2V5ZnJhbWVzKSkgOiBfc2V0RGVmYXVsdHM7XG5cbiAgICBpZiAoX2lzTm90RmFsc2UodmFycy5pbmhlcml0KSkge1xuICAgICAgd2hpbGUgKHBhcmVudCkge1xuICAgICAgICBmdW5jKHZhcnMsIHBhcmVudC52YXJzLmRlZmF1bHRzKTtcbiAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudCB8fCBwYXJlbnQuX2RwO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YXJzO1xuICB9LFxuICAgICAgX2FycmF5c01hdGNoID0gZnVuY3Rpb24gX2FycmF5c01hdGNoKGExLCBhMikge1xuICAgIHZhciBpID0gYTEubGVuZ3RoLFxuICAgICAgICBtYXRjaCA9IGkgPT09IGEyLmxlbmd0aDtcblxuICAgIHdoaWxlIChtYXRjaCAmJiBpLS0gJiYgYTFbaV0gPT09IGEyW2ldKSB7fVxuXG4gICAgcmV0dXJuIGkgPCAwO1xuICB9LFxuICAgICAgX2FkZExpbmtlZExpc3RJdGVtID0gZnVuY3Rpb24gX2FkZExpbmtlZExpc3RJdGVtKHBhcmVudCwgY2hpbGQsIGZpcnN0UHJvcCwgbGFzdFByb3AsIHNvcnRCeSkge1xuICAgIGlmIChmaXJzdFByb3AgPT09IHZvaWQgMCkge1xuICAgICAgZmlyc3RQcm9wID0gXCJfZmlyc3RcIjtcbiAgICB9XG5cbiAgICBpZiAobGFzdFByb3AgPT09IHZvaWQgMCkge1xuICAgICAgbGFzdFByb3AgPSBcIl9sYXN0XCI7XG4gICAgfVxuXG4gICAgdmFyIHByZXYgPSBwYXJlbnRbbGFzdFByb3BdLFxuICAgICAgICB0O1xuXG4gICAgaWYgKHNvcnRCeSkge1xuICAgICAgdCA9IGNoaWxkW3NvcnRCeV07XG5cbiAgICAgIHdoaWxlIChwcmV2ICYmIHByZXZbc29ydEJ5XSA+IHQpIHtcbiAgICAgICAgcHJldiA9IHByZXYuX3ByZXY7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHByZXYpIHtcbiAgICAgIGNoaWxkLl9uZXh0ID0gcHJldi5fbmV4dDtcbiAgICAgIHByZXYuX25leHQgPSBjaGlsZDtcbiAgICB9IGVsc2Uge1xuICAgICAgY2hpbGQuX25leHQgPSBwYXJlbnRbZmlyc3RQcm9wXTtcbiAgICAgIHBhcmVudFtmaXJzdFByb3BdID0gY2hpbGQ7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkLl9uZXh0KSB7XG4gICAgICBjaGlsZC5fbmV4dC5fcHJldiA9IGNoaWxkO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnRbbGFzdFByb3BdID0gY2hpbGQ7XG4gICAgfVxuXG4gICAgY2hpbGQuX3ByZXYgPSBwcmV2O1xuICAgIGNoaWxkLnBhcmVudCA9IGNoaWxkLl9kcCA9IHBhcmVudDtcbiAgICByZXR1cm4gY2hpbGQ7XG4gIH0sXG4gICAgICBfcmVtb3ZlTGlua2VkTGlzdEl0ZW0gPSBmdW5jdGlvbiBfcmVtb3ZlTGlua2VkTGlzdEl0ZW0ocGFyZW50LCBjaGlsZCwgZmlyc3RQcm9wLCBsYXN0UHJvcCkge1xuICAgIGlmIChmaXJzdFByb3AgPT09IHZvaWQgMCkge1xuICAgICAgZmlyc3RQcm9wID0gXCJfZmlyc3RcIjtcbiAgICB9XG5cbiAgICBpZiAobGFzdFByb3AgPT09IHZvaWQgMCkge1xuICAgICAgbGFzdFByb3AgPSBcIl9sYXN0XCI7XG4gICAgfVxuXG4gICAgdmFyIHByZXYgPSBjaGlsZC5fcHJldixcbiAgICAgICAgbmV4dCA9IGNoaWxkLl9uZXh0O1xuXG4gICAgaWYgKHByZXYpIHtcbiAgICAgIHByZXYuX25leHQgPSBuZXh0O1xuICAgIH0gZWxzZSBpZiAocGFyZW50W2ZpcnN0UHJvcF0gPT09IGNoaWxkKSB7XG4gICAgICBwYXJlbnRbZmlyc3RQcm9wXSA9IG5leHQ7XG4gICAgfVxuXG4gICAgaWYgKG5leHQpIHtcbiAgICAgIG5leHQuX3ByZXYgPSBwcmV2O1xuICAgIH0gZWxzZSBpZiAocGFyZW50W2xhc3RQcm9wXSA9PT0gY2hpbGQpIHtcbiAgICAgIHBhcmVudFtsYXN0UHJvcF0gPSBwcmV2O1xuICAgIH1cblxuICAgIGNoaWxkLl9uZXh0ID0gY2hpbGQuX3ByZXYgPSBjaGlsZC5wYXJlbnQgPSBudWxsO1xuICB9LFxuICAgICAgX3JlbW92ZUZyb21QYXJlbnQgPSBmdW5jdGlvbiBfcmVtb3ZlRnJvbVBhcmVudChjaGlsZCwgb25seUlmUGFyZW50SGFzQXV0b1JlbW92ZSkge1xuICAgIGNoaWxkLnBhcmVudCAmJiAoIW9ubHlJZlBhcmVudEhhc0F1dG9SZW1vdmUgfHwgY2hpbGQucGFyZW50LmF1dG9SZW1vdmVDaGlsZHJlbikgJiYgY2hpbGQucGFyZW50LnJlbW92ZShjaGlsZCk7XG4gICAgY2hpbGQuX2FjdCA9IDA7XG4gIH0sXG4gICAgICBfdW5jYWNoZSA9IGZ1bmN0aW9uIF91bmNhY2hlKGFuaW1hdGlvbiwgY2hpbGQpIHtcbiAgICBpZiAoYW5pbWF0aW9uICYmICghY2hpbGQgfHwgY2hpbGQuX2VuZCA+IGFuaW1hdGlvbi5fZHVyIHx8IGNoaWxkLl9zdGFydCA8IDApKSB7XG4gICAgICB2YXIgYSA9IGFuaW1hdGlvbjtcblxuICAgICAgd2hpbGUgKGEpIHtcbiAgICAgICAgYS5fZGlydHkgPSAxO1xuICAgICAgICBhID0gYS5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFuaW1hdGlvbjtcbiAgfSxcbiAgICAgIF9yZWNhY2hlQW5jZXN0b3JzID0gZnVuY3Rpb24gX3JlY2FjaGVBbmNlc3RvcnMoYW5pbWF0aW9uKSB7XG4gICAgdmFyIHBhcmVudCA9IGFuaW1hdGlvbi5wYXJlbnQ7XG5cbiAgICB3aGlsZSAocGFyZW50ICYmIHBhcmVudC5wYXJlbnQpIHtcbiAgICAgIHBhcmVudC5fZGlydHkgPSAxO1xuICAgICAgcGFyZW50LnRvdGFsRHVyYXRpb24oKTtcbiAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFuaW1hdGlvbjtcbiAgfSxcbiAgICAgIF9oYXNOb1BhdXNlZEFuY2VzdG9ycyA9IGZ1bmN0aW9uIF9oYXNOb1BhdXNlZEFuY2VzdG9ycyhhbmltYXRpb24pIHtcbiAgICByZXR1cm4gIWFuaW1hdGlvbiB8fCBhbmltYXRpb24uX3RzICYmIF9oYXNOb1BhdXNlZEFuY2VzdG9ycyhhbmltYXRpb24ucGFyZW50KTtcbiAgfSxcbiAgICAgIF9lbGFwc2VkQ3ljbGVEdXJhdGlvbiA9IGZ1bmN0aW9uIF9lbGFwc2VkQ3ljbGVEdXJhdGlvbihhbmltYXRpb24pIHtcbiAgICByZXR1cm4gYW5pbWF0aW9uLl9yZXBlYXQgPyBfYW5pbWF0aW9uQ3ljbGUoYW5pbWF0aW9uLl90VGltZSwgYW5pbWF0aW9uID0gYW5pbWF0aW9uLmR1cmF0aW9uKCkgKyBhbmltYXRpb24uX3JEZWxheSkgKiBhbmltYXRpb24gOiAwO1xuICB9LFxuICAgICAgX2FuaW1hdGlvbkN5Y2xlID0gZnVuY3Rpb24gX2FuaW1hdGlvbkN5Y2xlKHRUaW1lLCBjeWNsZUR1cmF0aW9uKSB7XG4gICAgdmFyIHdob2xlID0gTWF0aC5mbG9vcih0VGltZSAvPSBjeWNsZUR1cmF0aW9uKTtcbiAgICByZXR1cm4gdFRpbWUgJiYgd2hvbGUgPT09IHRUaW1lID8gd2hvbGUgLSAxIDogd2hvbGU7XG4gIH0sXG4gICAgICBfcGFyZW50VG9DaGlsZFRvdGFsVGltZSA9IGZ1bmN0aW9uIF9wYXJlbnRUb0NoaWxkVG90YWxUaW1lKHBhcmVudFRpbWUsIGNoaWxkKSB7XG4gICAgcmV0dXJuIChwYXJlbnRUaW1lIC0gY2hpbGQuX3N0YXJ0KSAqIGNoaWxkLl90cyArIChjaGlsZC5fdHMgPj0gMCA/IDAgOiBjaGlsZC5fZGlydHkgPyBjaGlsZC50b3RhbER1cmF0aW9uKCkgOiBjaGlsZC5fdER1cik7XG4gIH0sXG4gICAgICBfc2V0RW5kID0gZnVuY3Rpb24gX3NldEVuZChhbmltYXRpb24pIHtcbiAgICByZXR1cm4gYW5pbWF0aW9uLl9lbmQgPSBfcm91bmRQcmVjaXNlKGFuaW1hdGlvbi5fc3RhcnQgKyAoYW5pbWF0aW9uLl90RHVyIC8gTWF0aC5hYnMoYW5pbWF0aW9uLl90cyB8fCBhbmltYXRpb24uX3J0cyB8fCBfdGlueU51bSkgfHwgMCkpO1xuICB9LFxuICAgICAgX2FsaWduUGxheWhlYWQgPSBmdW5jdGlvbiBfYWxpZ25QbGF5aGVhZChhbmltYXRpb24sIHRvdGFsVGltZSkge1xuICAgIHZhciBwYXJlbnQgPSBhbmltYXRpb24uX2RwO1xuXG4gICAgaWYgKHBhcmVudCAmJiBwYXJlbnQuc21vb3RoQ2hpbGRUaW1pbmcgJiYgYW5pbWF0aW9uLl90cykge1xuICAgICAgYW5pbWF0aW9uLl9zdGFydCA9IF9yb3VuZFByZWNpc2UocGFyZW50Ll90aW1lIC0gKGFuaW1hdGlvbi5fdHMgPiAwID8gdG90YWxUaW1lIC8gYW5pbWF0aW9uLl90cyA6ICgoYW5pbWF0aW9uLl9kaXJ0eSA/IGFuaW1hdGlvbi50b3RhbER1cmF0aW9uKCkgOiBhbmltYXRpb24uX3REdXIpIC0gdG90YWxUaW1lKSAvIC1hbmltYXRpb24uX3RzKSk7XG5cbiAgICAgIF9zZXRFbmQoYW5pbWF0aW9uKTtcblxuICAgICAgcGFyZW50Ll9kaXJ0eSB8fCBfdW5jYWNoZShwYXJlbnQsIGFuaW1hdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFuaW1hdGlvbjtcbiAgfSxcbiAgICAgIF9wb3N0QWRkQ2hlY2tzID0gZnVuY3Rpb24gX3Bvc3RBZGRDaGVja3ModGltZWxpbmUsIGNoaWxkKSB7XG4gICAgdmFyIHQ7XG5cbiAgICBpZiAoY2hpbGQuX3RpbWUgfHwgY2hpbGQuX2luaXR0ZWQgJiYgIWNoaWxkLl9kdXIpIHtcbiAgICAgIHQgPSBfcGFyZW50VG9DaGlsZFRvdGFsVGltZSh0aW1lbGluZS5yYXdUaW1lKCksIGNoaWxkKTtcblxuICAgICAgaWYgKCFjaGlsZC5fZHVyIHx8IF9jbGFtcCgwLCBjaGlsZC50b3RhbER1cmF0aW9uKCksIHQpIC0gY2hpbGQuX3RUaW1lID4gX3RpbnlOdW0pIHtcbiAgICAgICAgY2hpbGQucmVuZGVyKHQsIHRydWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChfdW5jYWNoZSh0aW1lbGluZSwgY2hpbGQpLl9kcCAmJiB0aW1lbGluZS5faW5pdHRlZCAmJiB0aW1lbGluZS5fdGltZSA+PSB0aW1lbGluZS5fZHVyICYmIHRpbWVsaW5lLl90cykge1xuICAgICAgaWYgKHRpbWVsaW5lLl9kdXIgPCB0aW1lbGluZS5kdXJhdGlvbigpKSB7XG4gICAgICAgIHQgPSB0aW1lbGluZTtcblxuICAgICAgICB3aGlsZSAodC5fZHApIHtcbiAgICAgICAgICB0LnJhd1RpbWUoKSA+PSAwICYmIHQudG90YWxUaW1lKHQuX3RUaW1lKTtcbiAgICAgICAgICB0ID0gdC5fZHA7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGltZWxpbmUuX3pUaW1lID0gLV90aW55TnVtO1xuICAgIH1cbiAgfSxcbiAgICAgIF9hZGRUb1RpbWVsaW5lID0gZnVuY3Rpb24gX2FkZFRvVGltZWxpbmUodGltZWxpbmUsIGNoaWxkLCBwb3NpdGlvbiwgc2tpcENoZWNrcykge1xuICAgIGNoaWxkLnBhcmVudCAmJiBfcmVtb3ZlRnJvbVBhcmVudChjaGlsZCk7XG4gICAgY2hpbGQuX3N0YXJ0ID0gX3JvdW5kUHJlY2lzZSgoX2lzTnVtYmVyKHBvc2l0aW9uKSA/IHBvc2l0aW9uIDogcG9zaXRpb24gfHwgdGltZWxpbmUgIT09IF9nbG9iYWxUaW1lbGluZSA/IF9wYXJzZVBvc2l0aW9uKHRpbWVsaW5lLCBwb3NpdGlvbiwgY2hpbGQpIDogdGltZWxpbmUuX3RpbWUpICsgY2hpbGQuX2RlbGF5KTtcbiAgICBjaGlsZC5fZW5kID0gX3JvdW5kUHJlY2lzZShjaGlsZC5fc3RhcnQgKyAoY2hpbGQudG90YWxEdXJhdGlvbigpIC8gTWF0aC5hYnMoY2hpbGQudGltZVNjYWxlKCkpIHx8IDApKTtcblxuICAgIF9hZGRMaW5rZWRMaXN0SXRlbSh0aW1lbGluZSwgY2hpbGQsIFwiX2ZpcnN0XCIsIFwiX2xhc3RcIiwgdGltZWxpbmUuX3NvcnQgPyBcIl9zdGFydFwiIDogMCk7XG5cbiAgICBfaXNGcm9tT3JGcm9tU3RhcnQoY2hpbGQpIHx8ICh0aW1lbGluZS5fcmVjZW50ID0gY2hpbGQpO1xuICAgIHNraXBDaGVja3MgfHwgX3Bvc3RBZGRDaGVja3ModGltZWxpbmUsIGNoaWxkKTtcbiAgICByZXR1cm4gdGltZWxpbmU7XG4gIH0sXG4gICAgICBfc2Nyb2xsVHJpZ2dlciA9IGZ1bmN0aW9uIF9zY3JvbGxUcmlnZ2VyKGFuaW1hdGlvbiwgdHJpZ2dlcikge1xuICAgIHJldHVybiAoX2dsb2JhbHMuU2Nyb2xsVHJpZ2dlciB8fCBfbWlzc2luZ1BsdWdpbihcInNjcm9sbFRyaWdnZXJcIiwgdHJpZ2dlcikpICYmIF9nbG9iYWxzLlNjcm9sbFRyaWdnZXIuY3JlYXRlKHRyaWdnZXIsIGFuaW1hdGlvbik7XG4gIH0sXG4gICAgICBfYXR0ZW1wdEluaXRUd2VlbiA9IGZ1bmN0aW9uIF9hdHRlbXB0SW5pdFR3ZWVuKHR3ZWVuLCB0b3RhbFRpbWUsIGZvcmNlLCBzdXBwcmVzc0V2ZW50cykge1xuICAgIF9pbml0VHdlZW4odHdlZW4sIHRvdGFsVGltZSk7XG5cbiAgICBpZiAoIXR3ZWVuLl9pbml0dGVkKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICBpZiAoIWZvcmNlICYmIHR3ZWVuLl9wdCAmJiAodHdlZW4uX2R1ciAmJiB0d2Vlbi52YXJzLmxhenkgIT09IGZhbHNlIHx8ICF0d2Vlbi5fZHVyICYmIHR3ZWVuLnZhcnMubGF6eSkgJiYgX2xhc3RSZW5kZXJlZEZyYW1lICE9PSBfdGlja2VyLmZyYW1lKSB7XG4gICAgICBfbGF6eVR3ZWVucy5wdXNoKHR3ZWVuKTtcblxuICAgICAgdHdlZW4uX2xhenkgPSBbdG90YWxUaW1lLCBzdXBwcmVzc0V2ZW50c107XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG4gIH0sXG4gICAgICBfcGFyZW50UGxheWhlYWRJc0JlZm9yZVN0YXJ0ID0gZnVuY3Rpb24gX3BhcmVudFBsYXloZWFkSXNCZWZvcmVTdGFydChfcmVmKSB7XG4gICAgdmFyIHBhcmVudCA9IF9yZWYucGFyZW50O1xuICAgIHJldHVybiBwYXJlbnQgJiYgcGFyZW50Ll90cyAmJiBwYXJlbnQuX2luaXR0ZWQgJiYgIXBhcmVudC5fbG9jayAmJiAocGFyZW50LnJhd1RpbWUoKSA8IDAgfHwgX3BhcmVudFBsYXloZWFkSXNCZWZvcmVTdGFydChwYXJlbnQpKTtcbiAgfSxcbiAgICAgIF9pc0Zyb21PckZyb21TdGFydCA9IGZ1bmN0aW9uIF9pc0Zyb21PckZyb21TdGFydChfcmVmMikge1xuICAgIHZhciBkYXRhID0gX3JlZjIuZGF0YTtcbiAgICByZXR1cm4gZGF0YSA9PT0gXCJpc0Zyb21TdGFydFwiIHx8IGRhdGEgPT09IFwiaXNTdGFydFwiO1xuICB9LFxuICAgICAgX3JlbmRlclplcm9EdXJhdGlvblR3ZWVuID0gZnVuY3Rpb24gX3JlbmRlclplcm9EdXJhdGlvblR3ZWVuKHR3ZWVuLCB0b3RhbFRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSkge1xuICAgIHZhciBwcmV2UmF0aW8gPSB0d2Vlbi5yYXRpbyxcbiAgICAgICAgcmF0aW8gPSB0b3RhbFRpbWUgPCAwIHx8ICF0b3RhbFRpbWUgJiYgKCF0d2Vlbi5fc3RhcnQgJiYgX3BhcmVudFBsYXloZWFkSXNCZWZvcmVTdGFydCh0d2VlbikgJiYgISghdHdlZW4uX2luaXR0ZWQgJiYgX2lzRnJvbU9yRnJvbVN0YXJ0KHR3ZWVuKSkgfHwgKHR3ZWVuLl90cyA8IDAgfHwgdHdlZW4uX2RwLl90cyA8IDApICYmICFfaXNGcm9tT3JGcm9tU3RhcnQodHdlZW4pKSA/IDAgOiAxLFxuICAgICAgICByZXBlYXREZWxheSA9IHR3ZWVuLl9yRGVsYXksXG4gICAgICAgIHRUaW1lID0gMCxcbiAgICAgICAgcHQsXG4gICAgICAgIGl0ZXJhdGlvbixcbiAgICAgICAgcHJldkl0ZXJhdGlvbjtcblxuICAgIGlmIChyZXBlYXREZWxheSAmJiB0d2Vlbi5fcmVwZWF0KSB7XG4gICAgICB0VGltZSA9IF9jbGFtcCgwLCB0d2Vlbi5fdER1ciwgdG90YWxUaW1lKTtcbiAgICAgIGl0ZXJhdGlvbiA9IF9hbmltYXRpb25DeWNsZSh0VGltZSwgcmVwZWF0RGVsYXkpO1xuICAgICAgdHdlZW4uX3lveW8gJiYgaXRlcmF0aW9uICYgMSAmJiAocmF0aW8gPSAxIC0gcmF0aW8pO1xuXG4gICAgICBpZiAoaXRlcmF0aW9uICE9PSBfYW5pbWF0aW9uQ3ljbGUodHdlZW4uX3RUaW1lLCByZXBlYXREZWxheSkpIHtcbiAgICAgICAgcHJldlJhdGlvID0gMSAtIHJhdGlvO1xuICAgICAgICB0d2Vlbi52YXJzLnJlcGVhdFJlZnJlc2ggJiYgdHdlZW4uX2luaXR0ZWQgJiYgdHdlZW4uaW52YWxpZGF0ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyYXRpbyAhPT0gcHJldlJhdGlvIHx8IGZvcmNlIHx8IHR3ZWVuLl96VGltZSA9PT0gX3RpbnlOdW0gfHwgIXRvdGFsVGltZSAmJiB0d2Vlbi5felRpbWUpIHtcbiAgICAgIGlmICghdHdlZW4uX2luaXR0ZWQgJiYgX2F0dGVtcHRJbml0VHdlZW4odHdlZW4sIHRvdGFsVGltZSwgZm9yY2UsIHN1cHByZXNzRXZlbnRzKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHByZXZJdGVyYXRpb24gPSB0d2Vlbi5felRpbWU7XG4gICAgICB0d2Vlbi5felRpbWUgPSB0b3RhbFRpbWUgfHwgKHN1cHByZXNzRXZlbnRzID8gX3RpbnlOdW0gOiAwKTtcbiAgICAgIHN1cHByZXNzRXZlbnRzIHx8IChzdXBwcmVzc0V2ZW50cyA9IHRvdGFsVGltZSAmJiAhcHJldkl0ZXJhdGlvbik7XG4gICAgICB0d2Vlbi5yYXRpbyA9IHJhdGlvO1xuICAgICAgdHdlZW4uX2Zyb20gJiYgKHJhdGlvID0gMSAtIHJhdGlvKTtcbiAgICAgIHR3ZWVuLl90aW1lID0gMDtcbiAgICAgIHR3ZWVuLl90VGltZSA9IHRUaW1lO1xuICAgICAgcHQgPSB0d2Vlbi5fcHQ7XG5cbiAgICAgIHdoaWxlIChwdCkge1xuICAgICAgICBwdC5yKHJhdGlvLCBwdC5kKTtcbiAgICAgICAgcHQgPSBwdC5fbmV4dDtcbiAgICAgIH1cblxuICAgICAgdHdlZW4uX3N0YXJ0QXQgJiYgdG90YWxUaW1lIDwgMCAmJiB0d2Vlbi5fc3RhcnRBdC5yZW5kZXIodG90YWxUaW1lLCB0cnVlLCB0cnVlKTtcbiAgICAgIHR3ZWVuLl9vblVwZGF0ZSAmJiAhc3VwcHJlc3NFdmVudHMgJiYgX2NhbGxiYWNrKHR3ZWVuLCBcIm9uVXBkYXRlXCIpO1xuICAgICAgdFRpbWUgJiYgdHdlZW4uX3JlcGVhdCAmJiAhc3VwcHJlc3NFdmVudHMgJiYgdHdlZW4ucGFyZW50ICYmIF9jYWxsYmFjayh0d2VlbiwgXCJvblJlcGVhdFwiKTtcblxuICAgICAgaWYgKCh0b3RhbFRpbWUgPj0gdHdlZW4uX3REdXIgfHwgdG90YWxUaW1lIDwgMCkgJiYgdHdlZW4ucmF0aW8gPT09IHJhdGlvKSB7XG4gICAgICAgIHJhdGlvICYmIF9yZW1vdmVGcm9tUGFyZW50KHR3ZWVuLCAxKTtcblxuICAgICAgICBpZiAoIXN1cHByZXNzRXZlbnRzKSB7XG4gICAgICAgICAgX2NhbGxiYWNrKHR3ZWVuLCByYXRpbyA/IFwib25Db21wbGV0ZVwiIDogXCJvblJldmVyc2VDb21wbGV0ZVwiLCB0cnVlKTtcblxuICAgICAgICAgIHR3ZWVuLl9wcm9tICYmIHR3ZWVuLl9wcm9tKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCF0d2Vlbi5felRpbWUpIHtcbiAgICAgIHR3ZWVuLl96VGltZSA9IHRvdGFsVGltZTtcbiAgICB9XG4gIH0sXG4gICAgICBfZmluZE5leHRQYXVzZVR3ZWVuID0gZnVuY3Rpb24gX2ZpbmROZXh0UGF1c2VUd2VlbihhbmltYXRpb24sIHByZXZUaW1lLCB0aW1lKSB7XG4gICAgdmFyIGNoaWxkO1xuXG4gICAgaWYgKHRpbWUgPiBwcmV2VGltZSkge1xuICAgICAgY2hpbGQgPSBhbmltYXRpb24uX2ZpcnN0O1xuXG4gICAgICB3aGlsZSAoY2hpbGQgJiYgY2hpbGQuX3N0YXJ0IDw9IHRpbWUpIHtcbiAgICAgICAgaWYgKGNoaWxkLmRhdGEgPT09IFwiaXNQYXVzZVwiICYmIGNoaWxkLl9zdGFydCA+IHByZXZUaW1lKSB7XG4gICAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgICB9XG5cbiAgICAgICAgY2hpbGQgPSBjaGlsZC5fbmV4dDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY2hpbGQgPSBhbmltYXRpb24uX2xhc3Q7XG5cbiAgICAgIHdoaWxlIChjaGlsZCAmJiBjaGlsZC5fc3RhcnQgPj0gdGltZSkge1xuICAgICAgICBpZiAoY2hpbGQuZGF0YSA9PT0gXCJpc1BhdXNlXCIgJiYgY2hpbGQuX3N0YXJ0IDwgcHJldlRpbWUpIHtcbiAgICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgICAgIH1cblxuICAgICAgICBjaGlsZCA9IGNoaWxkLl9wcmV2O1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgICAgIF9zZXREdXJhdGlvbiA9IGZ1bmN0aW9uIF9zZXREdXJhdGlvbihhbmltYXRpb24sIGR1cmF0aW9uLCBza2lwVW5jYWNoZSwgbGVhdmVQbGF5aGVhZCkge1xuICAgIHZhciByZXBlYXQgPSBhbmltYXRpb24uX3JlcGVhdCxcbiAgICAgICAgZHVyID0gX3JvdW5kUHJlY2lzZShkdXJhdGlvbikgfHwgMCxcbiAgICAgICAgdG90YWxQcm9ncmVzcyA9IGFuaW1hdGlvbi5fdFRpbWUgLyBhbmltYXRpb24uX3REdXI7XG4gICAgdG90YWxQcm9ncmVzcyAmJiAhbGVhdmVQbGF5aGVhZCAmJiAoYW5pbWF0aW9uLl90aW1lICo9IGR1ciAvIGFuaW1hdGlvbi5fZHVyKTtcbiAgICBhbmltYXRpb24uX2R1ciA9IGR1cjtcbiAgICBhbmltYXRpb24uX3REdXIgPSAhcmVwZWF0ID8gZHVyIDogcmVwZWF0IDwgMCA/IDFlMTAgOiBfcm91bmRQcmVjaXNlKGR1ciAqIChyZXBlYXQgKyAxKSArIGFuaW1hdGlvbi5fckRlbGF5ICogcmVwZWF0KTtcbiAgICB0b3RhbFByb2dyZXNzID4gMCAmJiAhbGVhdmVQbGF5aGVhZCA/IF9hbGlnblBsYXloZWFkKGFuaW1hdGlvbiwgYW5pbWF0aW9uLl90VGltZSA9IGFuaW1hdGlvbi5fdER1ciAqIHRvdGFsUHJvZ3Jlc3MpIDogYW5pbWF0aW9uLnBhcmVudCAmJiBfc2V0RW5kKGFuaW1hdGlvbik7XG4gICAgc2tpcFVuY2FjaGUgfHwgX3VuY2FjaGUoYW5pbWF0aW9uLnBhcmVudCwgYW5pbWF0aW9uKTtcbiAgICByZXR1cm4gYW5pbWF0aW9uO1xuICB9LFxuICAgICAgX29uVXBkYXRlVG90YWxEdXJhdGlvbiA9IGZ1bmN0aW9uIF9vblVwZGF0ZVRvdGFsRHVyYXRpb24oYW5pbWF0aW9uKSB7XG4gICAgcmV0dXJuIGFuaW1hdGlvbiBpbnN0YW5jZW9mIFRpbWVsaW5lID8gX3VuY2FjaGUoYW5pbWF0aW9uKSA6IF9zZXREdXJhdGlvbihhbmltYXRpb24sIGFuaW1hdGlvbi5fZHVyKTtcbiAgfSxcbiAgICAgIF96ZXJvUG9zaXRpb24gPSB7XG4gICAgX3N0YXJ0OiAwLFxuICAgIGVuZFRpbWU6IF9lbXB0eUZ1bmMsXG4gICAgdG90YWxEdXJhdGlvbjogX2VtcHR5RnVuY1xuICB9LFxuICAgICAgX3BhcnNlUG9zaXRpb24gPSBmdW5jdGlvbiBfcGFyc2VQb3NpdGlvbihhbmltYXRpb24sIHBvc2l0aW9uLCBwZXJjZW50QW5pbWF0aW9uKSB7XG4gICAgdmFyIGxhYmVscyA9IGFuaW1hdGlvbi5sYWJlbHMsXG4gICAgICAgIHJlY2VudCA9IGFuaW1hdGlvbi5fcmVjZW50IHx8IF96ZXJvUG9zaXRpb24sXG4gICAgICAgIGNsaXBwZWREdXJhdGlvbiA9IGFuaW1hdGlvbi5kdXJhdGlvbigpID49IF9iaWdOdW0gPyByZWNlbnQuZW5kVGltZShmYWxzZSkgOiBhbmltYXRpb24uX2R1cixcbiAgICAgICAgaSxcbiAgICAgICAgb2Zmc2V0LFxuICAgICAgICBpc1BlcmNlbnQ7XG5cbiAgICBpZiAoX2lzU3RyaW5nKHBvc2l0aW9uKSAmJiAoaXNOYU4ocG9zaXRpb24pIHx8IHBvc2l0aW9uIGluIGxhYmVscykpIHtcbiAgICAgIG9mZnNldCA9IHBvc2l0aW9uLmNoYXJBdCgwKTtcbiAgICAgIGlzUGVyY2VudCA9IHBvc2l0aW9uLnN1YnN0cigtMSkgPT09IFwiJVwiO1xuICAgICAgaSA9IHBvc2l0aW9uLmluZGV4T2YoXCI9XCIpO1xuXG4gICAgICBpZiAob2Zmc2V0ID09PSBcIjxcIiB8fCBvZmZzZXQgPT09IFwiPlwiKSB7XG4gICAgICAgIGkgPj0gMCAmJiAocG9zaXRpb24gPSBwb3NpdGlvbi5yZXBsYWNlKC89LywgXCJcIikpO1xuICAgICAgICByZXR1cm4gKG9mZnNldCA9PT0gXCI8XCIgPyByZWNlbnQuX3N0YXJ0IDogcmVjZW50LmVuZFRpbWUocmVjZW50Ll9yZXBlYXQgPj0gMCkpICsgKHBhcnNlRmxvYXQocG9zaXRpb24uc3Vic3RyKDEpKSB8fCAwKSAqIChpc1BlcmNlbnQgPyAoaSA8IDAgPyByZWNlbnQgOiBwZXJjZW50QW5pbWF0aW9uKS50b3RhbER1cmF0aW9uKCkgLyAxMDAgOiAxKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGkgPCAwKSB7XG4gICAgICAgIHBvc2l0aW9uIGluIGxhYmVscyB8fCAobGFiZWxzW3Bvc2l0aW9uXSA9IGNsaXBwZWREdXJhdGlvbik7XG4gICAgICAgIHJldHVybiBsYWJlbHNbcG9zaXRpb25dO1xuICAgICAgfVxuXG4gICAgICBvZmZzZXQgPSBwYXJzZUZsb2F0KHBvc2l0aW9uLmNoYXJBdChpIC0gMSkgKyBwb3NpdGlvbi5zdWJzdHIoaSArIDEpKTtcblxuICAgICAgaWYgKGlzUGVyY2VudCAmJiBwZXJjZW50QW5pbWF0aW9uKSB7XG4gICAgICAgIG9mZnNldCA9IG9mZnNldCAvIDEwMCAqIChfaXNBcnJheShwZXJjZW50QW5pbWF0aW9uKSA/IHBlcmNlbnRBbmltYXRpb25bMF0gOiBwZXJjZW50QW5pbWF0aW9uKS50b3RhbER1cmF0aW9uKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpID4gMSA/IF9wYXJzZVBvc2l0aW9uKGFuaW1hdGlvbiwgcG9zaXRpb24uc3Vic3RyKDAsIGkgLSAxKSwgcGVyY2VudEFuaW1hdGlvbikgKyBvZmZzZXQgOiBjbGlwcGVkRHVyYXRpb24gKyBvZmZzZXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBvc2l0aW9uID09IG51bGwgPyBjbGlwcGVkRHVyYXRpb24gOiArcG9zaXRpb247XG4gIH0sXG4gICAgICBfY3JlYXRlVHdlZW5UeXBlID0gZnVuY3Rpb24gX2NyZWF0ZVR3ZWVuVHlwZSh0eXBlLCBwYXJhbXMsIHRpbWVsaW5lKSB7XG4gICAgdmFyIGlzTGVnYWN5ID0gX2lzTnVtYmVyKHBhcmFtc1sxXSksXG4gICAgICAgIHZhcnNJbmRleCA9IChpc0xlZ2FjeSA/IDIgOiAxKSArICh0eXBlIDwgMiA/IDAgOiAxKSxcbiAgICAgICAgdmFycyA9IHBhcmFtc1t2YXJzSW5kZXhdLFxuICAgICAgICBpclZhcnMsXG4gICAgICAgIHBhcmVudDtcblxuICAgIGlzTGVnYWN5ICYmICh2YXJzLmR1cmF0aW9uID0gcGFyYW1zWzFdKTtcbiAgICB2YXJzLnBhcmVudCA9IHRpbWVsaW5lO1xuXG4gICAgaWYgKHR5cGUpIHtcbiAgICAgIGlyVmFycyA9IHZhcnM7XG4gICAgICBwYXJlbnQgPSB0aW1lbGluZTtcblxuICAgICAgd2hpbGUgKHBhcmVudCAmJiAhKFwiaW1tZWRpYXRlUmVuZGVyXCIgaW4gaXJWYXJzKSkge1xuICAgICAgICBpclZhcnMgPSBwYXJlbnQudmFycy5kZWZhdWx0cyB8fCB7fTtcbiAgICAgICAgcGFyZW50ID0gX2lzTm90RmFsc2UocGFyZW50LnZhcnMuaW5oZXJpdCkgJiYgcGFyZW50LnBhcmVudDtcbiAgICAgIH1cblxuICAgICAgdmFycy5pbW1lZGlhdGVSZW5kZXIgPSBfaXNOb3RGYWxzZShpclZhcnMuaW1tZWRpYXRlUmVuZGVyKTtcbiAgICAgIHR5cGUgPCAyID8gdmFycy5ydW5CYWNrd2FyZHMgPSAxIDogdmFycy5zdGFydEF0ID0gcGFyYW1zW3ZhcnNJbmRleCAtIDFdO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgVHdlZW4ocGFyYW1zWzBdLCB2YXJzLCBwYXJhbXNbdmFyc0luZGV4ICsgMV0pO1xuICB9LFxuICAgICAgX2NvbmRpdGlvbmFsUmV0dXJuID0gZnVuY3Rpb24gX2NvbmRpdGlvbmFsUmV0dXJuKHZhbHVlLCBmdW5jKSB7XG4gICAgcmV0dXJuIHZhbHVlIHx8IHZhbHVlID09PSAwID8gZnVuYyh2YWx1ZSkgOiBmdW5jO1xuICB9LFxuICAgICAgX2NsYW1wID0gZnVuY3Rpb24gX2NsYW1wKG1pbiwgbWF4LCB2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA8IG1pbiA/IG1pbiA6IHZhbHVlID4gbWF4ID8gbWF4IDogdmFsdWU7XG4gIH0sXG4gICAgICBnZXRVbml0ID0gZnVuY3Rpb24gZ2V0VW5pdCh2YWx1ZSwgdikge1xuICAgIHJldHVybiAhX2lzU3RyaW5nKHZhbHVlKSB8fCAhKHYgPSBfdW5pdEV4cC5leGVjKHZhbHVlKSkgPyBcIlwiIDogdlsxXTtcbiAgfSxcbiAgICAgIGNsYW1wID0gZnVuY3Rpb24gY2xhbXAobWluLCBtYXgsIHZhbHVlKSB7XG4gICAgcmV0dXJuIF9jb25kaXRpb25hbFJldHVybih2YWx1ZSwgZnVuY3Rpb24gKHYpIHtcbiAgICAgIHJldHVybiBfY2xhbXAobWluLCBtYXgsIHYpO1xuICAgIH0pO1xuICB9LFxuICAgICAgX3NsaWNlID0gW10uc2xpY2UsXG4gICAgICBfaXNBcnJheUxpa2UgPSBmdW5jdGlvbiBfaXNBcnJheUxpa2UodmFsdWUsIG5vbkVtcHR5KSB7XG4gICAgcmV0dXJuIHZhbHVlICYmIF9pc09iamVjdCh2YWx1ZSkgJiYgXCJsZW5ndGhcIiBpbiB2YWx1ZSAmJiAoIW5vbkVtcHR5ICYmICF2YWx1ZS5sZW5ndGggfHwgdmFsdWUubGVuZ3RoIC0gMSBpbiB2YWx1ZSAmJiBfaXNPYmplY3QodmFsdWVbMF0pKSAmJiAhdmFsdWUubm9kZVR5cGUgJiYgdmFsdWUgIT09IF93aW47XG4gIH0sXG4gICAgICBfZmxhdHRlbiA9IGZ1bmN0aW9uIF9mbGF0dGVuKGFyLCBsZWF2ZVN0cmluZ3MsIGFjY3VtdWxhdG9yKSB7XG4gICAgaWYgKGFjY3VtdWxhdG9yID09PSB2b2lkIDApIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIGFyLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICB2YXIgX2FjY3VtdWxhdG9yO1xuXG4gICAgICByZXR1cm4gX2lzU3RyaW5nKHZhbHVlKSAmJiAhbGVhdmVTdHJpbmdzIHx8IF9pc0FycmF5TGlrZSh2YWx1ZSwgMSkgPyAoX2FjY3VtdWxhdG9yID0gYWNjdW11bGF0b3IpLnB1c2guYXBwbHkoX2FjY3VtdWxhdG9yLCB0b0FycmF5KHZhbHVlKSkgOiBhY2N1bXVsYXRvci5wdXNoKHZhbHVlKTtcbiAgICB9KSB8fCBhY2N1bXVsYXRvcjtcbiAgfSxcbiAgICAgIHRvQXJyYXkgPSBmdW5jdGlvbiB0b0FycmF5KHZhbHVlLCBzY29wZSwgbGVhdmVTdHJpbmdzKSB7XG4gICAgcmV0dXJuIF9pc1N0cmluZyh2YWx1ZSkgJiYgIWxlYXZlU3RyaW5ncyAmJiAoX2NvcmVJbml0dGVkIHx8ICFfd2FrZSgpKSA/IF9zbGljZS5jYWxsKChzY29wZSB8fCBfZG9jKS5xdWVyeVNlbGVjdG9yQWxsKHZhbHVlKSwgMCkgOiBfaXNBcnJheSh2YWx1ZSkgPyBfZmxhdHRlbih2YWx1ZSwgbGVhdmVTdHJpbmdzKSA6IF9pc0FycmF5TGlrZSh2YWx1ZSkgPyBfc2xpY2UuY2FsbCh2YWx1ZSwgMCkgOiB2YWx1ZSA/IFt2YWx1ZV0gOiBbXTtcbiAgfSxcbiAgICAgIHNlbGVjdG9yID0gZnVuY3Rpb24gc2VsZWN0b3IodmFsdWUpIHtcbiAgICB2YWx1ZSA9IHRvQXJyYXkodmFsdWUpWzBdIHx8IF93YXJuKFwiSW52YWxpZCBzY29wZVwiKSB8fCB7fTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHYpIHtcbiAgICAgIHZhciBlbCA9IHZhbHVlLmN1cnJlbnQgfHwgdmFsdWUubmF0aXZlRWxlbWVudCB8fCB2YWx1ZTtcbiAgICAgIHJldHVybiB0b0FycmF5KHYsIGVsLnF1ZXJ5U2VsZWN0b3JBbGwgPyBlbCA6IGVsID09PSB2YWx1ZSA/IF93YXJuKFwiSW52YWxpZCBzY29wZVwiKSB8fCBfZG9jLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikgOiB2YWx1ZSk7XG4gICAgfTtcbiAgfSxcbiAgICAgIHNodWZmbGUgPSBmdW5jdGlvbiBzaHVmZmxlKGEpIHtcbiAgICByZXR1cm4gYS5zb3J0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAuNSAtIE1hdGgucmFuZG9tKCk7XG4gICAgfSk7XG4gIH0sXG4gICAgICBkaXN0cmlidXRlID0gZnVuY3Rpb24gZGlzdHJpYnV0ZSh2KSB7XG4gICAgaWYgKF9pc0Z1bmN0aW9uKHYpKSB7XG4gICAgICByZXR1cm4gdjtcbiAgICB9XG5cbiAgICB2YXIgdmFycyA9IF9pc09iamVjdCh2KSA/IHYgOiB7XG4gICAgICBlYWNoOiB2XG4gICAgfSxcbiAgICAgICAgZWFzZSA9IF9wYXJzZUVhc2UodmFycy5lYXNlKSxcbiAgICAgICAgZnJvbSA9IHZhcnMuZnJvbSB8fCAwLFxuICAgICAgICBiYXNlID0gcGFyc2VGbG9hdCh2YXJzLmJhc2UpIHx8IDAsXG4gICAgICAgIGNhY2hlID0ge30sXG4gICAgICAgIGlzRGVjaW1hbCA9IGZyb20gPiAwICYmIGZyb20gPCAxLFxuICAgICAgICByYXRpb3MgPSBpc05hTihmcm9tKSB8fCBpc0RlY2ltYWwsXG4gICAgICAgIGF4aXMgPSB2YXJzLmF4aXMsXG4gICAgICAgIHJhdGlvWCA9IGZyb20sXG4gICAgICAgIHJhdGlvWSA9IGZyb207XG5cbiAgICBpZiAoX2lzU3RyaW5nKGZyb20pKSB7XG4gICAgICByYXRpb1ggPSByYXRpb1kgPSB7XG4gICAgICAgIGNlbnRlcjogLjUsXG4gICAgICAgIGVkZ2VzOiAuNSxcbiAgICAgICAgZW5kOiAxXG4gICAgICB9W2Zyb21dIHx8IDA7XG4gICAgfSBlbHNlIGlmICghaXNEZWNpbWFsICYmIHJhdGlvcykge1xuICAgICAgcmF0aW9YID0gZnJvbVswXTtcbiAgICAgIHJhdGlvWSA9IGZyb21bMV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChpLCB0YXJnZXQsIGEpIHtcbiAgICAgIHZhciBsID0gKGEgfHwgdmFycykubGVuZ3RoLFxuICAgICAgICAgIGRpc3RhbmNlcyA9IGNhY2hlW2xdLFxuICAgICAgICAgIG9yaWdpblgsXG4gICAgICAgICAgb3JpZ2luWSxcbiAgICAgICAgICB4LFxuICAgICAgICAgIHksXG4gICAgICAgICAgZCxcbiAgICAgICAgICBqLFxuICAgICAgICAgIG1heCxcbiAgICAgICAgICBtaW4sXG4gICAgICAgICAgd3JhcEF0O1xuXG4gICAgICBpZiAoIWRpc3RhbmNlcykge1xuICAgICAgICB3cmFwQXQgPSB2YXJzLmdyaWQgPT09IFwiYXV0b1wiID8gMCA6ICh2YXJzLmdyaWQgfHwgWzEsIF9iaWdOdW1dKVsxXTtcblxuICAgICAgICBpZiAoIXdyYXBBdCkge1xuICAgICAgICAgIG1heCA9IC1fYmlnTnVtO1xuXG4gICAgICAgICAgd2hpbGUgKG1heCA8IChtYXggPSBhW3dyYXBBdCsrXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0KSAmJiB3cmFwQXQgPCBsKSB7fVxuXG4gICAgICAgICAgd3JhcEF0LS07XG4gICAgICAgIH1cblxuICAgICAgICBkaXN0YW5jZXMgPSBjYWNoZVtsXSA9IFtdO1xuICAgICAgICBvcmlnaW5YID0gcmF0aW9zID8gTWF0aC5taW4od3JhcEF0LCBsKSAqIHJhdGlvWCAtIC41IDogZnJvbSAlIHdyYXBBdDtcbiAgICAgICAgb3JpZ2luWSA9IHdyYXBBdCA9PT0gX2JpZ051bSA/IDAgOiByYXRpb3MgPyBsICogcmF0aW9ZIC8gd3JhcEF0IC0gLjUgOiBmcm9tIC8gd3JhcEF0IHwgMDtcbiAgICAgICAgbWF4ID0gMDtcbiAgICAgICAgbWluID0gX2JpZ051bTtcblxuICAgICAgICBmb3IgKGogPSAwOyBqIDwgbDsgaisrKSB7XG4gICAgICAgICAgeCA9IGogJSB3cmFwQXQgLSBvcmlnaW5YO1xuICAgICAgICAgIHkgPSBvcmlnaW5ZIC0gKGogLyB3cmFwQXQgfCAwKTtcbiAgICAgICAgICBkaXN0YW5jZXNbal0gPSBkID0gIWF4aXMgPyBfc3FydCh4ICogeCArIHkgKiB5KSA6IE1hdGguYWJzKGF4aXMgPT09IFwieVwiID8geSA6IHgpO1xuICAgICAgICAgIGQgPiBtYXggJiYgKG1heCA9IGQpO1xuICAgICAgICAgIGQgPCBtaW4gJiYgKG1pbiA9IGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnJvbSA9PT0gXCJyYW5kb21cIiAmJiBzaHVmZmxlKGRpc3RhbmNlcyk7XG4gICAgICAgIGRpc3RhbmNlcy5tYXggPSBtYXggLSBtaW47XG4gICAgICAgIGRpc3RhbmNlcy5taW4gPSBtaW47XG4gICAgICAgIGRpc3RhbmNlcy52ID0gbCA9IChwYXJzZUZsb2F0KHZhcnMuYW1vdW50KSB8fCBwYXJzZUZsb2F0KHZhcnMuZWFjaCkgKiAod3JhcEF0ID4gbCA/IGwgLSAxIDogIWF4aXMgPyBNYXRoLm1heCh3cmFwQXQsIGwgLyB3cmFwQXQpIDogYXhpcyA9PT0gXCJ5XCIgPyBsIC8gd3JhcEF0IDogd3JhcEF0KSB8fCAwKSAqIChmcm9tID09PSBcImVkZ2VzXCIgPyAtMSA6IDEpO1xuICAgICAgICBkaXN0YW5jZXMuYiA9IGwgPCAwID8gYmFzZSAtIGwgOiBiYXNlO1xuICAgICAgICBkaXN0YW5jZXMudSA9IGdldFVuaXQodmFycy5hbW91bnQgfHwgdmFycy5lYWNoKSB8fCAwO1xuICAgICAgICBlYXNlID0gZWFzZSAmJiBsIDwgMCA/IF9pbnZlcnRFYXNlKGVhc2UpIDogZWFzZTtcbiAgICAgIH1cblxuICAgICAgbCA9IChkaXN0YW5jZXNbaV0gLSBkaXN0YW5jZXMubWluKSAvIGRpc3RhbmNlcy5tYXggfHwgMDtcbiAgICAgIHJldHVybiBfcm91bmRQcmVjaXNlKGRpc3RhbmNlcy5iICsgKGVhc2UgPyBlYXNlKGwpIDogbCkgKiBkaXN0YW5jZXMudikgKyBkaXN0YW5jZXMudTtcbiAgICB9O1xuICB9LFxuICAgICAgX3JvdW5kTW9kaWZpZXIgPSBmdW5jdGlvbiBfcm91bmRNb2RpZmllcih2KSB7XG4gICAgdmFyIHAgPSBNYXRoLnBvdygxMCwgKCh2ICsgXCJcIikuc3BsaXQoXCIuXCIpWzFdIHx8IFwiXCIpLmxlbmd0aCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChyYXcpIHtcbiAgICAgIHZhciBuID0gTWF0aC5yb3VuZChwYXJzZUZsb2F0KHJhdykgLyB2KSAqIHYgKiBwO1xuICAgICAgcmV0dXJuIChuIC0gbiAlIDEpIC8gcCArIChfaXNOdW1iZXIocmF3KSA/IDAgOiBnZXRVbml0KHJhdykpO1xuICAgIH07XG4gIH0sXG4gICAgICBzbmFwID0gZnVuY3Rpb24gc25hcChzbmFwVG8sIHZhbHVlKSB7XG4gICAgdmFyIGlzQXJyYXkgPSBfaXNBcnJheShzbmFwVG8pLFxuICAgICAgICByYWRpdXMsXG4gICAgICAgIGlzMkQ7XG5cbiAgICBpZiAoIWlzQXJyYXkgJiYgX2lzT2JqZWN0KHNuYXBUbykpIHtcbiAgICAgIHJhZGl1cyA9IGlzQXJyYXkgPSBzbmFwVG8ucmFkaXVzIHx8IF9iaWdOdW07XG5cbiAgICAgIGlmIChzbmFwVG8udmFsdWVzKSB7XG4gICAgICAgIHNuYXBUbyA9IHRvQXJyYXkoc25hcFRvLnZhbHVlcyk7XG5cbiAgICAgICAgaWYgKGlzMkQgPSAhX2lzTnVtYmVyKHNuYXBUb1swXSkpIHtcbiAgICAgICAgICByYWRpdXMgKj0gcmFkaXVzO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzbmFwVG8gPSBfcm91bmRNb2RpZmllcihzbmFwVG8uaW5jcmVtZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gX2NvbmRpdGlvbmFsUmV0dXJuKHZhbHVlLCAhaXNBcnJheSA/IF9yb3VuZE1vZGlmaWVyKHNuYXBUbykgOiBfaXNGdW5jdGlvbihzbmFwVG8pID8gZnVuY3Rpb24gKHJhdykge1xuICAgICAgaXMyRCA9IHNuYXBUbyhyYXcpO1xuICAgICAgcmV0dXJuIE1hdGguYWJzKGlzMkQgLSByYXcpIDw9IHJhZGl1cyA/IGlzMkQgOiByYXc7XG4gICAgfSA6IGZ1bmN0aW9uIChyYXcpIHtcbiAgICAgIHZhciB4ID0gcGFyc2VGbG9hdChpczJEID8gcmF3LnggOiByYXcpLFxuICAgICAgICAgIHkgPSBwYXJzZUZsb2F0KGlzMkQgPyByYXcueSA6IDApLFxuICAgICAgICAgIG1pbiA9IF9iaWdOdW0sXG4gICAgICAgICAgY2xvc2VzdCA9IDAsXG4gICAgICAgICAgaSA9IHNuYXBUby5sZW5ndGgsXG4gICAgICAgICAgZHgsXG4gICAgICAgICAgZHk7XG5cbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgaWYgKGlzMkQpIHtcbiAgICAgICAgICBkeCA9IHNuYXBUb1tpXS54IC0geDtcbiAgICAgICAgICBkeSA9IHNuYXBUb1tpXS55IC0geTtcbiAgICAgICAgICBkeCA9IGR4ICogZHggKyBkeSAqIGR5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGR4ID0gTWF0aC5hYnMoc25hcFRvW2ldIC0geCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZHggPCBtaW4pIHtcbiAgICAgICAgICBtaW4gPSBkeDtcbiAgICAgICAgICBjbG9zZXN0ID0gaTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjbG9zZXN0ID0gIXJhZGl1cyB8fCBtaW4gPD0gcmFkaXVzID8gc25hcFRvW2Nsb3Nlc3RdIDogcmF3O1xuICAgICAgcmV0dXJuIGlzMkQgfHwgY2xvc2VzdCA9PT0gcmF3IHx8IF9pc051bWJlcihyYXcpID8gY2xvc2VzdCA6IGNsb3Nlc3QgKyBnZXRVbml0KHJhdyk7XG4gICAgfSk7XG4gIH0sXG4gICAgICByYW5kb20gPSBmdW5jdGlvbiByYW5kb20obWluLCBtYXgsIHJvdW5kaW5nSW5jcmVtZW50LCByZXR1cm5GdW5jdGlvbikge1xuICAgIHJldHVybiBfY29uZGl0aW9uYWxSZXR1cm4oX2lzQXJyYXkobWluKSA/ICFtYXggOiByb3VuZGluZ0luY3JlbWVudCA9PT0gdHJ1ZSA/ICEhKHJvdW5kaW5nSW5jcmVtZW50ID0gMCkgOiAhcmV0dXJuRnVuY3Rpb24sIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBfaXNBcnJheShtaW4pID8gbWluW35+KE1hdGgucmFuZG9tKCkgKiBtaW4ubGVuZ3RoKV0gOiAocm91bmRpbmdJbmNyZW1lbnQgPSByb3VuZGluZ0luY3JlbWVudCB8fCAxZS01KSAmJiAocmV0dXJuRnVuY3Rpb24gPSByb3VuZGluZ0luY3JlbWVudCA8IDEgPyBNYXRoLnBvdygxMCwgKHJvdW5kaW5nSW5jcmVtZW50ICsgXCJcIikubGVuZ3RoIC0gMikgOiAxKSAmJiBNYXRoLmZsb29yKE1hdGgucm91bmQoKG1pbiAtIHJvdW5kaW5nSW5jcmVtZW50IC8gMiArIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgcm91bmRpbmdJbmNyZW1lbnQgKiAuOTkpKSAvIHJvdW5kaW5nSW5jcmVtZW50KSAqIHJvdW5kaW5nSW5jcmVtZW50ICogcmV0dXJuRnVuY3Rpb24pIC8gcmV0dXJuRnVuY3Rpb247XG4gICAgfSk7XG4gIH0sXG4gICAgICBwaXBlID0gZnVuY3Rpb24gcGlwZSgpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgZnVuY3Rpb25zID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgZnVuY3Rpb25zW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbnMucmVkdWNlKGZ1bmN0aW9uICh2LCBmKSB7XG4gICAgICAgIHJldHVybiBmKHYpO1xuICAgICAgfSwgdmFsdWUpO1xuICAgIH07XG4gIH0sXG4gICAgICB1bml0aXplID0gZnVuY3Rpb24gdW5pdGl6ZShmdW5jLCB1bml0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIGZ1bmMocGFyc2VGbG9hdCh2YWx1ZSkpICsgKHVuaXQgfHwgZ2V0VW5pdCh2YWx1ZSkpO1xuICAgIH07XG4gIH0sXG4gICAgICBub3JtYWxpemUgPSBmdW5jdGlvbiBub3JtYWxpemUobWluLCBtYXgsIHZhbHVlKSB7XG4gICAgcmV0dXJuIG1hcFJhbmdlKG1pbiwgbWF4LCAwLCAxLCB2YWx1ZSk7XG4gIH0sXG4gICAgICBfd3JhcEFycmF5ID0gZnVuY3Rpb24gX3dyYXBBcnJheShhLCB3cmFwcGVyLCB2YWx1ZSkge1xuICAgIHJldHVybiBfY29uZGl0aW9uYWxSZXR1cm4odmFsdWUsIGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgcmV0dXJuIGFbfn53cmFwcGVyKGluZGV4KV07XG4gICAgfSk7XG4gIH0sXG4gICAgICB3cmFwID0gZnVuY3Rpb24gd3JhcChtaW4sIG1heCwgdmFsdWUpIHtcbiAgICB2YXIgcmFuZ2UgPSBtYXggLSBtaW47XG4gICAgcmV0dXJuIF9pc0FycmF5KG1pbikgPyBfd3JhcEFycmF5KG1pbiwgd3JhcCgwLCBtaW4ubGVuZ3RoKSwgbWF4KSA6IF9jb25kaXRpb25hbFJldHVybih2YWx1ZSwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICByZXR1cm4gKHJhbmdlICsgKHZhbHVlIC0gbWluKSAlIHJhbmdlKSAlIHJhbmdlICsgbWluO1xuICAgIH0pO1xuICB9LFxuICAgICAgd3JhcFlveW8gPSBmdW5jdGlvbiB3cmFwWW95byhtaW4sIG1heCwgdmFsdWUpIHtcbiAgICB2YXIgcmFuZ2UgPSBtYXggLSBtaW4sXG4gICAgICAgIHRvdGFsID0gcmFuZ2UgKiAyO1xuICAgIHJldHVybiBfaXNBcnJheShtaW4pID8gX3dyYXBBcnJheShtaW4sIHdyYXBZb3lvKDAsIG1pbi5sZW5ndGggLSAxKSwgbWF4KSA6IF9jb25kaXRpb25hbFJldHVybih2YWx1ZSwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICB2YWx1ZSA9ICh0b3RhbCArICh2YWx1ZSAtIG1pbikgJSB0b3RhbCkgJSB0b3RhbCB8fCAwO1xuICAgICAgcmV0dXJuIG1pbiArICh2YWx1ZSA+IHJhbmdlID8gdG90YWwgLSB2YWx1ZSA6IHZhbHVlKTtcbiAgICB9KTtcbiAgfSxcbiAgICAgIF9yZXBsYWNlUmFuZG9tID0gZnVuY3Rpb24gX3JlcGxhY2VSYW5kb20odmFsdWUpIHtcbiAgICB2YXIgcHJldiA9IDAsXG4gICAgICAgIHMgPSBcIlwiLFxuICAgICAgICBpLFxuICAgICAgICBudW1zLFxuICAgICAgICBlbmQsXG4gICAgICAgIGlzQXJyYXk7XG5cbiAgICB3aGlsZSAofihpID0gdmFsdWUuaW5kZXhPZihcInJhbmRvbShcIiwgcHJldikpKSB7XG4gICAgICBlbmQgPSB2YWx1ZS5pbmRleE9mKFwiKVwiLCBpKTtcbiAgICAgIGlzQXJyYXkgPSB2YWx1ZS5jaGFyQXQoaSArIDcpID09PSBcIltcIjtcbiAgICAgIG51bXMgPSB2YWx1ZS5zdWJzdHIoaSArIDcsIGVuZCAtIGkgLSA3KS5tYXRjaChpc0FycmF5ID8gX2RlbGltaXRlZFZhbHVlRXhwIDogX3N0cmljdE51bUV4cCk7XG4gICAgICBzICs9IHZhbHVlLnN1YnN0cihwcmV2LCBpIC0gcHJldikgKyByYW5kb20oaXNBcnJheSA/IG51bXMgOiArbnVtc1swXSwgaXNBcnJheSA/IDAgOiArbnVtc1sxXSwgK251bXNbMl0gfHwgMWUtNSk7XG4gICAgICBwcmV2ID0gZW5kICsgMTtcbiAgICB9XG5cbiAgICByZXR1cm4gcyArIHZhbHVlLnN1YnN0cihwcmV2LCB2YWx1ZS5sZW5ndGggLSBwcmV2KTtcbiAgfSxcbiAgICAgIG1hcFJhbmdlID0gZnVuY3Rpb24gbWFwUmFuZ2UoaW5NaW4sIGluTWF4LCBvdXRNaW4sIG91dE1heCwgdmFsdWUpIHtcbiAgICB2YXIgaW5SYW5nZSA9IGluTWF4IC0gaW5NaW4sXG4gICAgICAgIG91dFJhbmdlID0gb3V0TWF4IC0gb3V0TWluO1xuICAgIHJldHVybiBfY29uZGl0aW9uYWxSZXR1cm4odmFsdWUsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIG91dE1pbiArICgodmFsdWUgLSBpbk1pbikgLyBpblJhbmdlICogb3V0UmFuZ2UgfHwgMCk7XG4gICAgfSk7XG4gIH0sXG4gICAgICBpbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uIGludGVycG9sYXRlKHN0YXJ0LCBlbmQsIHByb2dyZXNzLCBtdXRhdGUpIHtcbiAgICB2YXIgZnVuYyA9IGlzTmFOKHN0YXJ0ICsgZW5kKSA/IDAgOiBmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuICgxIC0gcCkgKiBzdGFydCArIHAgKiBlbmQ7XG4gICAgfTtcblxuICAgIGlmICghZnVuYykge1xuICAgICAgdmFyIGlzU3RyaW5nID0gX2lzU3RyaW5nKHN0YXJ0KSxcbiAgICAgICAgICBtYXN0ZXIgPSB7fSxcbiAgICAgICAgICBwLFxuICAgICAgICAgIGksXG4gICAgICAgICAgaW50ZXJwb2xhdG9ycyxcbiAgICAgICAgICBsLFxuICAgICAgICAgIGlsO1xuXG4gICAgICBwcm9ncmVzcyA9PT0gdHJ1ZSAmJiAobXV0YXRlID0gMSkgJiYgKHByb2dyZXNzID0gbnVsbCk7XG5cbiAgICAgIGlmIChpc1N0cmluZykge1xuICAgICAgICBzdGFydCA9IHtcbiAgICAgICAgICBwOiBzdGFydFxuICAgICAgICB9O1xuICAgICAgICBlbmQgPSB7XG4gICAgICAgICAgcDogZW5kXG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKF9pc0FycmF5KHN0YXJ0KSAmJiAhX2lzQXJyYXkoZW5kKSkge1xuICAgICAgICBpbnRlcnBvbGF0b3JzID0gW107XG4gICAgICAgIGwgPSBzdGFydC5sZW5ndGg7XG4gICAgICAgIGlsID0gbCAtIDI7XG5cbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIGludGVycG9sYXRvcnMucHVzaChpbnRlcnBvbGF0ZShzdGFydFtpIC0gMV0sIHN0YXJ0W2ldKSk7XG4gICAgICAgIH1cblxuICAgICAgICBsLS07XG5cbiAgICAgICAgZnVuYyA9IGZ1bmN0aW9uIGZ1bmMocCkge1xuICAgICAgICAgIHAgKj0gbDtcbiAgICAgICAgICB2YXIgaSA9IE1hdGgubWluKGlsLCB+fnApO1xuICAgICAgICAgIHJldHVybiBpbnRlcnBvbGF0b3JzW2ldKHAgLSBpKTtcbiAgICAgICAgfTtcblxuICAgICAgICBwcm9ncmVzcyA9IGVuZDtcbiAgICAgIH0gZWxzZSBpZiAoIW11dGF0ZSkge1xuICAgICAgICBzdGFydCA9IF9tZXJnZShfaXNBcnJheShzdGFydCkgPyBbXSA6IHt9LCBzdGFydCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghaW50ZXJwb2xhdG9ycykge1xuICAgICAgICBmb3IgKHAgaW4gZW5kKSB7XG4gICAgICAgICAgX2FkZFByb3BUd2Vlbi5jYWxsKG1hc3Rlciwgc3RhcnQsIHAsIFwiZ2V0XCIsIGVuZFtwXSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jID0gZnVuY3Rpb24gZnVuYyhwKSB7XG4gICAgICAgICAgcmV0dXJuIF9yZW5kZXJQcm9wVHdlZW5zKHAsIG1hc3RlcikgfHwgKGlzU3RyaW5nID8gc3RhcnQucCA6IHN0YXJ0KTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gX2NvbmRpdGlvbmFsUmV0dXJuKHByb2dyZXNzLCBmdW5jKTtcbiAgfSxcbiAgICAgIF9nZXRMYWJlbEluRGlyZWN0aW9uID0gZnVuY3Rpb24gX2dldExhYmVsSW5EaXJlY3Rpb24odGltZWxpbmUsIGZyb21UaW1lLCBiYWNrd2FyZCkge1xuICAgIHZhciBsYWJlbHMgPSB0aW1lbGluZS5sYWJlbHMsXG4gICAgICAgIG1pbiA9IF9iaWdOdW0sXG4gICAgICAgIHAsXG4gICAgICAgIGRpc3RhbmNlLFxuICAgICAgICBsYWJlbDtcblxuICAgIGZvciAocCBpbiBsYWJlbHMpIHtcbiAgICAgIGRpc3RhbmNlID0gbGFiZWxzW3BdIC0gZnJvbVRpbWU7XG5cbiAgICAgIGlmIChkaXN0YW5jZSA8IDAgPT09ICEhYmFja3dhcmQgJiYgZGlzdGFuY2UgJiYgbWluID4gKGRpc3RhbmNlID0gTWF0aC5hYnMoZGlzdGFuY2UpKSkge1xuICAgICAgICBsYWJlbCA9IHA7XG4gICAgICAgIG1pbiA9IGRpc3RhbmNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBsYWJlbDtcbiAgfSxcbiAgICAgIF9jYWxsYmFjayA9IGZ1bmN0aW9uIF9jYWxsYmFjayhhbmltYXRpb24sIHR5cGUsIGV4ZWN1dGVMYXp5Rmlyc3QpIHtcbiAgICB2YXIgdiA9IGFuaW1hdGlvbi52YXJzLFxuICAgICAgICBjYWxsYmFjayA9IHZbdHlwZV0sXG4gICAgICAgIHBhcmFtcyxcbiAgICAgICAgc2NvcGU7XG5cbiAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcGFyYW1zID0gdlt0eXBlICsgXCJQYXJhbXNcIl07XG4gICAgc2NvcGUgPSB2LmNhbGxiYWNrU2NvcGUgfHwgYW5pbWF0aW9uO1xuICAgIGV4ZWN1dGVMYXp5Rmlyc3QgJiYgX2xhenlUd2VlbnMubGVuZ3RoICYmIF9sYXp5UmVuZGVyKCk7XG4gICAgcmV0dXJuIHBhcmFtcyA/IGNhbGxiYWNrLmFwcGx5KHNjb3BlLCBwYXJhbXMpIDogY2FsbGJhY2suY2FsbChzY29wZSk7XG4gIH0sXG4gICAgICBfaW50ZXJydXB0ID0gZnVuY3Rpb24gX2ludGVycnVwdChhbmltYXRpb24pIHtcbiAgICBfcmVtb3ZlRnJvbVBhcmVudChhbmltYXRpb24pO1xuXG4gICAgYW5pbWF0aW9uLnNjcm9sbFRyaWdnZXIgJiYgYW5pbWF0aW9uLnNjcm9sbFRyaWdnZXIua2lsbChmYWxzZSk7XG4gICAgYW5pbWF0aW9uLnByb2dyZXNzKCkgPCAxICYmIF9jYWxsYmFjayhhbmltYXRpb24sIFwib25JbnRlcnJ1cHRcIik7XG4gICAgcmV0dXJuIGFuaW1hdGlvbjtcbiAgfSxcbiAgICAgIF9xdWlja1R3ZWVuLFxuICAgICAgX2NyZWF0ZVBsdWdpbiA9IGZ1bmN0aW9uIF9jcmVhdGVQbHVnaW4oY29uZmlnKSB7XG4gICAgY29uZmlnID0gIWNvbmZpZy5uYW1lICYmIGNvbmZpZ1tcImRlZmF1bHRcIl0gfHwgY29uZmlnO1xuXG4gICAgdmFyIG5hbWUgPSBjb25maWcubmFtZSxcbiAgICAgICAgaXNGdW5jID0gX2lzRnVuY3Rpb24oY29uZmlnKSxcbiAgICAgICAgUGx1Z2luID0gbmFtZSAmJiAhaXNGdW5jICYmIGNvbmZpZy5pbml0ID8gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fcHJvcHMgPSBbXTtcbiAgICB9IDogY29uZmlnLFxuICAgICAgICBpbnN0YW5jZURlZmF1bHRzID0ge1xuICAgICAgaW5pdDogX2VtcHR5RnVuYyxcbiAgICAgIHJlbmRlcjogX3JlbmRlclByb3BUd2VlbnMsXG4gICAgICBhZGQ6IF9hZGRQcm9wVHdlZW4sXG4gICAgICBraWxsOiBfa2lsbFByb3BUd2VlbnNPZixcbiAgICAgIG1vZGlmaWVyOiBfYWRkUGx1Z2luTW9kaWZpZXIsXG4gICAgICByYXdWYXJzOiAwXG4gICAgfSxcbiAgICAgICAgc3RhdGljcyA9IHtcbiAgICAgIHRhcmdldFRlc3Q6IDAsXG4gICAgICBnZXQ6IDAsXG4gICAgICBnZXRTZXR0ZXI6IF9nZXRTZXR0ZXIsXG4gICAgICBhbGlhc2VzOiB7fSxcbiAgICAgIHJlZ2lzdGVyOiAwXG4gICAgfTtcblxuICAgIF93YWtlKCk7XG5cbiAgICBpZiAoY29uZmlnICE9PSBQbHVnaW4pIHtcbiAgICAgIGlmIChfcGx1Z2luc1tuYW1lXSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIF9zZXREZWZhdWx0cyhQbHVnaW4sIF9zZXREZWZhdWx0cyhfY29weUV4Y2x1ZGluZyhjb25maWcsIGluc3RhbmNlRGVmYXVsdHMpLCBzdGF0aWNzKSk7XG5cbiAgICAgIF9tZXJnZShQbHVnaW4ucHJvdG90eXBlLCBfbWVyZ2UoaW5zdGFuY2VEZWZhdWx0cywgX2NvcHlFeGNsdWRpbmcoY29uZmlnLCBzdGF0aWNzKSkpO1xuXG4gICAgICBfcGx1Z2luc1tQbHVnaW4ucHJvcCA9IG5hbWVdID0gUGx1Z2luO1xuXG4gICAgICBpZiAoY29uZmlnLnRhcmdldFRlc3QpIHtcbiAgICAgICAgX2hhcm5lc3NQbHVnaW5zLnB1c2goUGx1Z2luKTtcblxuICAgICAgICBfcmVzZXJ2ZWRQcm9wc1tuYW1lXSA9IDE7XG4gICAgICB9XG5cbiAgICAgIG5hbWUgPSAobmFtZSA9PT0gXCJjc3NcIiA/IFwiQ1NTXCIgOiBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zdWJzdHIoMSkpICsgXCJQbHVnaW5cIjtcbiAgICB9XG5cbiAgICBfYWRkR2xvYmFsKG5hbWUsIFBsdWdpbik7XG5cbiAgICBjb25maWcucmVnaXN0ZXIgJiYgY29uZmlnLnJlZ2lzdGVyKGdzYXAsIFBsdWdpbiwgUHJvcFR3ZWVuKTtcbiAgfSxcbiAgICAgIF8yNTUgPSAyNTUsXG4gICAgICBfY29sb3JMb29rdXAgPSB7XG4gICAgYXF1YTogWzAsIF8yNTUsIF8yNTVdLFxuICAgIGxpbWU6IFswLCBfMjU1LCAwXSxcbiAgICBzaWx2ZXI6IFsxOTIsIDE5MiwgMTkyXSxcbiAgICBibGFjazogWzAsIDAsIDBdLFxuICAgIG1hcm9vbjogWzEyOCwgMCwgMF0sXG4gICAgdGVhbDogWzAsIDEyOCwgMTI4XSxcbiAgICBibHVlOiBbMCwgMCwgXzI1NV0sXG4gICAgbmF2eTogWzAsIDAsIDEyOF0sXG4gICAgd2hpdGU6IFtfMjU1LCBfMjU1LCBfMjU1XSxcbiAgICBvbGl2ZTogWzEyOCwgMTI4LCAwXSxcbiAgICB5ZWxsb3c6IFtfMjU1LCBfMjU1LCAwXSxcbiAgICBvcmFuZ2U6IFtfMjU1LCAxNjUsIDBdLFxuICAgIGdyYXk6IFsxMjgsIDEyOCwgMTI4XSxcbiAgICBwdXJwbGU6IFsxMjgsIDAsIDEyOF0sXG4gICAgZ3JlZW46IFswLCAxMjgsIDBdLFxuICAgIHJlZDogW18yNTUsIDAsIDBdLFxuICAgIHBpbms6IFtfMjU1LCAxOTIsIDIwM10sXG4gICAgY3lhbjogWzAsIF8yNTUsIF8yNTVdLFxuICAgIHRyYW5zcGFyZW50OiBbXzI1NSwgXzI1NSwgXzI1NSwgMF1cbiAgfSxcbiAgICAgIF9odWUgPSBmdW5jdGlvbiBfaHVlKGgsIG0xLCBtMikge1xuICAgIGggKz0gaCA8IDAgPyAxIDogaCA+IDEgPyAtMSA6IDA7XG4gICAgcmV0dXJuIChoICogNiA8IDEgPyBtMSArIChtMiAtIG0xKSAqIGggKiA2IDogaCA8IC41ID8gbTIgOiBoICogMyA8IDIgPyBtMSArIChtMiAtIG0xKSAqICgyIC8gMyAtIGgpICogNiA6IG0xKSAqIF8yNTUgKyAuNSB8IDA7XG4gIH0sXG4gICAgICBzcGxpdENvbG9yID0gZnVuY3Rpb24gc3BsaXRDb2xvcih2LCB0b0hTTCwgZm9yY2VBbHBoYSkge1xuICAgIHZhciBhID0gIXYgPyBfY29sb3JMb29rdXAuYmxhY2sgOiBfaXNOdW1iZXIodikgPyBbdiA+PiAxNiwgdiA+PiA4ICYgXzI1NSwgdiAmIF8yNTVdIDogMCxcbiAgICAgICAgcixcbiAgICAgICAgZyxcbiAgICAgICAgYixcbiAgICAgICAgaCxcbiAgICAgICAgcyxcbiAgICAgICAgbCxcbiAgICAgICAgbWF4LFxuICAgICAgICBtaW4sXG4gICAgICAgIGQsXG4gICAgICAgIHdhc0hTTDtcblxuICAgIGlmICghYSkge1xuICAgICAgaWYgKHYuc3Vic3RyKC0xKSA9PT0gXCIsXCIpIHtcbiAgICAgICAgdiA9IHYuc3Vic3RyKDAsIHYubGVuZ3RoIC0gMSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChfY29sb3JMb29rdXBbdl0pIHtcbiAgICAgICAgYSA9IF9jb2xvckxvb2t1cFt2XTtcbiAgICAgIH0gZWxzZSBpZiAodi5jaGFyQXQoMCkgPT09IFwiI1wiKSB7XG4gICAgICAgIGlmICh2Lmxlbmd0aCA8IDYpIHtcbiAgICAgICAgICByID0gdi5jaGFyQXQoMSk7XG4gICAgICAgICAgZyA9IHYuY2hhckF0KDIpO1xuICAgICAgICAgIGIgPSB2LmNoYXJBdCgzKTtcbiAgICAgICAgICB2ID0gXCIjXCIgKyByICsgciArIGcgKyBnICsgYiArIGIgKyAodi5sZW5ndGggPT09IDUgPyB2LmNoYXJBdCg0KSArIHYuY2hhckF0KDQpIDogXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodi5sZW5ndGggPT09IDkpIHtcbiAgICAgICAgICBhID0gcGFyc2VJbnQodi5zdWJzdHIoMSwgNiksIDE2KTtcbiAgICAgICAgICByZXR1cm4gW2EgPj4gMTYsIGEgPj4gOCAmIF8yNTUsIGEgJiBfMjU1LCBwYXJzZUludCh2LnN1YnN0cig3KSwgMTYpIC8gMjU1XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHYgPSBwYXJzZUludCh2LnN1YnN0cigxKSwgMTYpO1xuICAgICAgICBhID0gW3YgPj4gMTYsIHYgPj4gOCAmIF8yNTUsIHYgJiBfMjU1XTtcbiAgICAgIH0gZWxzZSBpZiAodi5zdWJzdHIoMCwgMykgPT09IFwiaHNsXCIpIHtcbiAgICAgICAgYSA9IHdhc0hTTCA9IHYubWF0Y2goX3N0cmljdE51bUV4cCk7XG5cbiAgICAgICAgaWYgKCF0b0hTTCkge1xuICAgICAgICAgIGggPSArYVswXSAlIDM2MCAvIDM2MDtcbiAgICAgICAgICBzID0gK2FbMV0gLyAxMDA7XG4gICAgICAgICAgbCA9ICthWzJdIC8gMTAwO1xuICAgICAgICAgIGcgPSBsIDw9IC41ID8gbCAqIChzICsgMSkgOiBsICsgcyAtIGwgKiBzO1xuICAgICAgICAgIHIgPSBsICogMiAtIGc7XG4gICAgICAgICAgYS5sZW5ndGggPiAzICYmIChhWzNdICo9IDEpO1xuICAgICAgICAgIGFbMF0gPSBfaHVlKGggKyAxIC8gMywgciwgZyk7XG4gICAgICAgICAgYVsxXSA9IF9odWUoaCwgciwgZyk7XG4gICAgICAgICAgYVsyXSA9IF9odWUoaCAtIDEgLyAzLCByLCBnKTtcbiAgICAgICAgfSBlbHNlIGlmICh+di5pbmRleE9mKFwiPVwiKSkge1xuICAgICAgICAgIGEgPSB2Lm1hdGNoKF9udW1FeHApO1xuICAgICAgICAgIGZvcmNlQWxwaGEgJiYgYS5sZW5ndGggPCA0ICYmIChhWzNdID0gMSk7XG4gICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGEgPSB2Lm1hdGNoKF9zdHJpY3ROdW1FeHApIHx8IF9jb2xvckxvb2t1cC50cmFuc3BhcmVudDtcbiAgICAgIH1cblxuICAgICAgYSA9IGEubWFwKE51bWJlcik7XG4gICAgfVxuXG4gICAgaWYgKHRvSFNMICYmICF3YXNIU0wpIHtcbiAgICAgIHIgPSBhWzBdIC8gXzI1NTtcbiAgICAgIGcgPSBhWzFdIC8gXzI1NTtcbiAgICAgIGIgPSBhWzJdIC8gXzI1NTtcbiAgICAgIG1heCA9IE1hdGgubWF4KHIsIGcsIGIpO1xuICAgICAgbWluID0gTWF0aC5taW4ociwgZywgYik7XG4gICAgICBsID0gKG1heCArIG1pbikgLyAyO1xuXG4gICAgICBpZiAobWF4ID09PSBtaW4pIHtcbiAgICAgICAgaCA9IHMgPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZCA9IG1heCAtIG1pbjtcbiAgICAgICAgcyA9IGwgPiAwLjUgPyBkIC8gKDIgLSBtYXggLSBtaW4pIDogZCAvIChtYXggKyBtaW4pO1xuICAgICAgICBoID0gbWF4ID09PSByID8gKGcgLSBiKSAvIGQgKyAoZyA8IGIgPyA2IDogMCkgOiBtYXggPT09IGcgPyAoYiAtIHIpIC8gZCArIDIgOiAociAtIGcpIC8gZCArIDQ7XG4gICAgICAgIGggKj0gNjA7XG4gICAgICB9XG5cbiAgICAgIGFbMF0gPSB+fihoICsgLjUpO1xuICAgICAgYVsxXSA9IH5+KHMgKiAxMDAgKyAuNSk7XG4gICAgICBhWzJdID0gfn4obCAqIDEwMCArIC41KTtcbiAgICB9XG5cbiAgICBmb3JjZUFscGhhICYmIGEubGVuZ3RoIDwgNCAmJiAoYVszXSA9IDEpO1xuICAgIHJldHVybiBhO1xuICB9LFxuICAgICAgX2NvbG9yT3JkZXJEYXRhID0gZnVuY3Rpb24gX2NvbG9yT3JkZXJEYXRhKHYpIHtcbiAgICB2YXIgdmFsdWVzID0gW10sXG4gICAgICAgIGMgPSBbXSxcbiAgICAgICAgaSA9IC0xO1xuICAgIHYuc3BsaXQoX2NvbG9yRXhwKS5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XG4gICAgICB2YXIgYSA9IHYubWF0Y2goX251bVdpdGhVbml0RXhwKSB8fCBbXTtcbiAgICAgIHZhbHVlcy5wdXNoLmFwcGx5KHZhbHVlcywgYSk7XG4gICAgICBjLnB1c2goaSArPSBhLmxlbmd0aCArIDEpO1xuICAgIH0pO1xuICAgIHZhbHVlcy5jID0gYztcbiAgICByZXR1cm4gdmFsdWVzO1xuICB9LFxuICAgICAgX2Zvcm1hdENvbG9ycyA9IGZ1bmN0aW9uIF9mb3JtYXRDb2xvcnMocywgdG9IU0wsIG9yZGVyTWF0Y2hEYXRhKSB7XG4gICAgdmFyIHJlc3VsdCA9IFwiXCIsXG4gICAgICAgIGNvbG9ycyA9IChzICsgcmVzdWx0KS5tYXRjaChfY29sb3JFeHApLFxuICAgICAgICB0eXBlID0gdG9IU0wgPyBcImhzbGEoXCIgOiBcInJnYmEoXCIsXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBjLFxuICAgICAgICBzaGVsbCxcbiAgICAgICAgZCxcbiAgICAgICAgbDtcblxuICAgIGlmICghY29sb3JzKSB7XG4gICAgICByZXR1cm4gcztcbiAgICB9XG5cbiAgICBjb2xvcnMgPSBjb2xvcnMubWFwKGZ1bmN0aW9uIChjb2xvcikge1xuICAgICAgcmV0dXJuIChjb2xvciA9IHNwbGl0Q29sb3IoY29sb3IsIHRvSFNMLCAxKSkgJiYgdHlwZSArICh0b0hTTCA/IGNvbG9yWzBdICsgXCIsXCIgKyBjb2xvclsxXSArIFwiJSxcIiArIGNvbG9yWzJdICsgXCIlLFwiICsgY29sb3JbM10gOiBjb2xvci5qb2luKFwiLFwiKSkgKyBcIilcIjtcbiAgICB9KTtcblxuICAgIGlmIChvcmRlck1hdGNoRGF0YSkge1xuICAgICAgZCA9IF9jb2xvck9yZGVyRGF0YShzKTtcbiAgICAgIGMgPSBvcmRlck1hdGNoRGF0YS5jO1xuXG4gICAgICBpZiAoYy5qb2luKHJlc3VsdCkgIT09IGQuYy5qb2luKHJlc3VsdCkpIHtcbiAgICAgICAgc2hlbGwgPSBzLnJlcGxhY2UoX2NvbG9yRXhwLCBcIjFcIikuc3BsaXQoX251bVdpdGhVbml0RXhwKTtcbiAgICAgICAgbCA9IHNoZWxsLmxlbmd0aCAtIDE7XG5cbiAgICAgICAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICByZXN1bHQgKz0gc2hlbGxbaV0gKyAofmMuaW5kZXhPZihpKSA/IGNvbG9ycy5zaGlmdCgpIHx8IHR5cGUgKyBcIjAsMCwwLDApXCIgOiAoZC5sZW5ndGggPyBkIDogY29sb3JzLmxlbmd0aCA/IGNvbG9ycyA6IG9yZGVyTWF0Y2hEYXRhKS5zaGlmdCgpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghc2hlbGwpIHtcbiAgICAgIHNoZWxsID0gcy5zcGxpdChfY29sb3JFeHApO1xuICAgICAgbCA9IHNoZWxsLmxlbmd0aCAtIDE7XG5cbiAgICAgIGZvciAoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHJlc3VsdCArPSBzaGVsbFtpXSArIGNvbG9yc1tpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0ICsgc2hlbGxbbF07XG4gIH0sXG4gICAgICBfY29sb3JFeHAgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHMgPSBcIig/OlxcXFxiKD86KD86cmdifHJnYmF8aHNsfGhzbGEpXFxcXCguKz9cXFxcKSl8XFxcXEIjKD86WzAtOWEtZl17Myw0fSl7MSwyfVxcXFxiXCIsXG4gICAgICAgIHA7XG5cbiAgICBmb3IgKHAgaW4gX2NvbG9yTG9va3VwKSB7XG4gICAgICBzICs9IFwifFwiICsgcCArIFwiXFxcXGJcIjtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlZ0V4cChzICsgXCIpXCIsIFwiZ2lcIik7XG4gIH0oKSxcbiAgICAgIF9oc2xFeHAgPSAvaHNsW2FdP1xcKC8sXG4gICAgICBfY29sb3JTdHJpbmdGaWx0ZXIgPSBmdW5jdGlvbiBfY29sb3JTdHJpbmdGaWx0ZXIoYSkge1xuICAgIHZhciBjb21iaW5lZCA9IGEuam9pbihcIiBcIiksXG4gICAgICAgIHRvSFNMO1xuICAgIF9jb2xvckV4cC5sYXN0SW5kZXggPSAwO1xuXG4gICAgaWYgKF9jb2xvckV4cC50ZXN0KGNvbWJpbmVkKSkge1xuICAgICAgdG9IU0wgPSBfaHNsRXhwLnRlc3QoY29tYmluZWQpO1xuICAgICAgYVsxXSA9IF9mb3JtYXRDb2xvcnMoYVsxXSwgdG9IU0wpO1xuICAgICAgYVswXSA9IF9mb3JtYXRDb2xvcnMoYVswXSwgdG9IU0wsIF9jb2xvck9yZGVyRGF0YShhWzFdKSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0sXG4gICAgICBfdGlja2VyQWN0aXZlLFxuICAgICAgX3RpY2tlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2dldFRpbWUgPSBEYXRlLm5vdyxcbiAgICAgICAgX2xhZ1RocmVzaG9sZCA9IDUwMCxcbiAgICAgICAgX2FkanVzdGVkTGFnID0gMzMsXG4gICAgICAgIF9zdGFydFRpbWUgPSBfZ2V0VGltZSgpLFxuICAgICAgICBfbGFzdFVwZGF0ZSA9IF9zdGFydFRpbWUsXG4gICAgICAgIF9nYXAgPSAxMDAwIC8gMjQwLFxuICAgICAgICBfbmV4dFRpbWUgPSBfZ2FwLFxuICAgICAgICBfbGlzdGVuZXJzID0gW10sXG4gICAgICAgIF9pZCxcbiAgICAgICAgX3JlcSxcbiAgICAgICAgX3JhZixcbiAgICAgICAgX3NlbGYsXG4gICAgICAgIF9kZWx0YSxcbiAgICAgICAgX2ksXG4gICAgICAgIF90aWNrID0gZnVuY3Rpb24gX3RpY2sodikge1xuICAgICAgdmFyIGVsYXBzZWQgPSBfZ2V0VGltZSgpIC0gX2xhc3RVcGRhdGUsXG4gICAgICAgICAgbWFudWFsID0gdiA9PT0gdHJ1ZSxcbiAgICAgICAgICBvdmVybGFwLFxuICAgICAgICAgIGRpc3BhdGNoLFxuICAgICAgICAgIHRpbWUsXG4gICAgICAgICAgZnJhbWU7XG5cbiAgICAgIGVsYXBzZWQgPiBfbGFnVGhyZXNob2xkICYmIChfc3RhcnRUaW1lICs9IGVsYXBzZWQgLSBfYWRqdXN0ZWRMYWcpO1xuICAgICAgX2xhc3RVcGRhdGUgKz0gZWxhcHNlZDtcbiAgICAgIHRpbWUgPSBfbGFzdFVwZGF0ZSAtIF9zdGFydFRpbWU7XG4gICAgICBvdmVybGFwID0gdGltZSAtIF9uZXh0VGltZTtcblxuICAgICAgaWYgKG92ZXJsYXAgPiAwIHx8IG1hbnVhbCkge1xuICAgICAgICBmcmFtZSA9ICsrX3NlbGYuZnJhbWU7XG4gICAgICAgIF9kZWx0YSA9IHRpbWUgLSBfc2VsZi50aW1lICogMTAwMDtcbiAgICAgICAgX3NlbGYudGltZSA9IHRpbWUgPSB0aW1lIC8gMTAwMDtcbiAgICAgICAgX25leHRUaW1lICs9IG92ZXJsYXAgKyAob3ZlcmxhcCA+PSBfZ2FwID8gNCA6IF9nYXAgLSBvdmVybGFwKTtcbiAgICAgICAgZGlzcGF0Y2ggPSAxO1xuICAgICAgfVxuXG4gICAgICBtYW51YWwgfHwgKF9pZCA9IF9yZXEoX3RpY2spKTtcblxuICAgICAgaWYgKGRpc3BhdGNoKSB7XG4gICAgICAgIGZvciAoX2kgPSAwOyBfaSA8IF9saXN0ZW5lcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgX2xpc3RlbmVyc1tfaV0odGltZSwgX2RlbHRhLCBmcmFtZSwgdik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3NlbGYgPSB7XG4gICAgICB0aW1lOiAwLFxuICAgICAgZnJhbWU6IDAsXG4gICAgICB0aWNrOiBmdW5jdGlvbiB0aWNrKCkge1xuICAgICAgICBfdGljayh0cnVlKTtcbiAgICAgIH0sXG4gICAgICBkZWx0YVJhdGlvOiBmdW5jdGlvbiBkZWx0YVJhdGlvKGZwcykge1xuICAgICAgICByZXR1cm4gX2RlbHRhIC8gKDEwMDAgLyAoZnBzIHx8IDYwKSk7XG4gICAgICB9LFxuICAgICAgd2FrZTogZnVuY3Rpb24gd2FrZSgpIHtcbiAgICAgICAgaWYgKF9jb3JlUmVhZHkpIHtcbiAgICAgICAgICBpZiAoIV9jb3JlSW5pdHRlZCAmJiBfd2luZG93RXhpc3RzKCkpIHtcbiAgICAgICAgICAgIF93aW4gPSBfY29yZUluaXR0ZWQgPSB3aW5kb3c7XG4gICAgICAgICAgICBfZG9jID0gX3dpbi5kb2N1bWVudCB8fCB7fTtcbiAgICAgICAgICAgIF9nbG9iYWxzLmdzYXAgPSBnc2FwO1xuICAgICAgICAgICAgKF93aW4uZ3NhcFZlcnNpb25zIHx8IChfd2luLmdzYXBWZXJzaW9ucyA9IFtdKSkucHVzaChnc2FwLnZlcnNpb24pO1xuXG4gICAgICAgICAgICBfaW5zdGFsbChfaW5zdGFsbFNjb3BlIHx8IF93aW4uR3JlZW5Tb2NrR2xvYmFscyB8fCAhX3dpbi5nc2FwICYmIF93aW4gfHwge30pO1xuXG4gICAgICAgICAgICBfcmFmID0gX3dpbi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgX2lkICYmIF9zZWxmLnNsZWVwKCk7XG5cbiAgICAgICAgICBfcmVxID0gX3JhZiB8fCBmdW5jdGlvbiAoZikge1xuICAgICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZiwgX25leHRUaW1lIC0gX3NlbGYudGltZSAqIDEwMDAgKyAxIHwgMCk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIF90aWNrZXJBY3RpdmUgPSAxO1xuXG4gICAgICAgICAgX3RpY2soMik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBzbGVlcDogZnVuY3Rpb24gc2xlZXAoKSB7XG4gICAgICAgIChfcmFmID8gX3dpbi5jYW5jZWxBbmltYXRpb25GcmFtZSA6IGNsZWFyVGltZW91dCkoX2lkKTtcbiAgICAgICAgX3RpY2tlckFjdGl2ZSA9IDA7XG4gICAgICAgIF9yZXEgPSBfZW1wdHlGdW5jO1xuICAgICAgfSxcbiAgICAgIGxhZ1Ntb290aGluZzogZnVuY3Rpb24gbGFnU21vb3RoaW5nKHRocmVzaG9sZCwgYWRqdXN0ZWRMYWcpIHtcbiAgICAgICAgX2xhZ1RocmVzaG9sZCA9IHRocmVzaG9sZCB8fCAxIC8gX3RpbnlOdW07XG4gICAgICAgIF9hZGp1c3RlZExhZyA9IE1hdGgubWluKGFkanVzdGVkTGFnLCBfbGFnVGhyZXNob2xkLCAwKTtcbiAgICAgIH0sXG4gICAgICBmcHM6IGZ1bmN0aW9uIGZwcyhfZnBzKSB7XG4gICAgICAgIF9nYXAgPSAxMDAwIC8gKF9mcHMgfHwgMjQwKTtcbiAgICAgICAgX25leHRUaW1lID0gX3NlbGYudGltZSAqIDEwMDAgKyBfZ2FwO1xuICAgICAgfSxcbiAgICAgIGFkZDogZnVuY3Rpb24gYWRkKGNhbGxiYWNrLCBvbmNlLCBwcmlvcml0aXplKSB7XG4gICAgICAgIHZhciBmdW5jID0gb25jZSA/IGZ1bmN0aW9uICh0LCBkLCBmLCB2KSB7XG4gICAgICAgICAgY2FsbGJhY2sodCwgZCwgZiwgdik7XG5cbiAgICAgICAgICBfc2VsZi5yZW1vdmUoZnVuYyk7XG4gICAgICAgIH0gOiBjYWxsYmFjaztcblxuICAgICAgICBfc2VsZi5yZW1vdmUoY2FsbGJhY2spO1xuXG4gICAgICAgIF9saXN0ZW5lcnNbcHJpb3JpdGl6ZSA/IFwidW5zaGlmdFwiIDogXCJwdXNoXCJdKGZ1bmMpO1xuXG4gICAgICAgIF93YWtlKCk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmM7XG4gICAgICB9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoY2FsbGJhY2ssIGkpIHtcbiAgICAgICAgfihpID0gX2xpc3RlbmVycy5pbmRleE9mKGNhbGxiYWNrKSkgJiYgX2xpc3RlbmVycy5zcGxpY2UoaSwgMSkgJiYgX2kgPj0gaSAmJiBfaS0tO1xuICAgICAgfSxcbiAgICAgIF9saXN0ZW5lcnM6IF9saXN0ZW5lcnNcbiAgICB9O1xuICAgIHJldHVybiBfc2VsZjtcbiAgfSgpLFxuICAgICAgX3dha2UgPSBmdW5jdGlvbiBfd2FrZSgpIHtcbiAgICByZXR1cm4gIV90aWNrZXJBY3RpdmUgJiYgX3RpY2tlci53YWtlKCk7XG4gIH0sXG4gICAgICBfZWFzZU1hcCA9IHt9LFxuICAgICAgX2N1c3RvbUVhc2VFeHAgPSAvXltcXGQuXFwtTV1bXFxkLlxcLSxcXHNdLyxcbiAgICAgIF9xdW90ZXNFeHAgPSAvW1wiJ10vZyxcbiAgICAgIF9wYXJzZU9iamVjdEluU3RyaW5nID0gZnVuY3Rpb24gX3BhcnNlT2JqZWN0SW5TdHJpbmcodmFsdWUpIHtcbiAgICB2YXIgb2JqID0ge30sXG4gICAgICAgIHNwbGl0ID0gdmFsdWUuc3Vic3RyKDEsIHZhbHVlLmxlbmd0aCAtIDMpLnNwbGl0KFwiOlwiKSxcbiAgICAgICAga2V5ID0gc3BsaXRbMF0sXG4gICAgICAgIGkgPSAxLFxuICAgICAgICBsID0gc3BsaXQubGVuZ3RoLFxuICAgICAgICBpbmRleCxcbiAgICAgICAgdmFsLFxuICAgICAgICBwYXJzZWRWYWw7XG5cbiAgICBmb3IgKDsgaSA8IGw7IGkrKykge1xuICAgICAgdmFsID0gc3BsaXRbaV07XG4gICAgICBpbmRleCA9IGkgIT09IGwgLSAxID8gdmFsLmxhc3RJbmRleE9mKFwiLFwiKSA6IHZhbC5sZW5ndGg7XG4gICAgICBwYXJzZWRWYWwgPSB2YWwuc3Vic3RyKDAsIGluZGV4KTtcbiAgICAgIG9ialtrZXldID0gaXNOYU4ocGFyc2VkVmFsKSA/IHBhcnNlZFZhbC5yZXBsYWNlKF9xdW90ZXNFeHAsIFwiXCIpLnRyaW0oKSA6ICtwYXJzZWRWYWw7XG4gICAgICBrZXkgPSB2YWwuc3Vic3RyKGluZGV4ICsgMSkudHJpbSgpO1xuICAgIH1cblxuICAgIHJldHVybiBvYmo7XG4gIH0sXG4gICAgICBfdmFsdWVJblBhcmVudGhlc2VzID0gZnVuY3Rpb24gX3ZhbHVlSW5QYXJlbnRoZXNlcyh2YWx1ZSkge1xuICAgIHZhciBvcGVuID0gdmFsdWUuaW5kZXhPZihcIihcIikgKyAxLFxuICAgICAgICBjbG9zZSA9IHZhbHVlLmluZGV4T2YoXCIpXCIpLFxuICAgICAgICBuZXN0ZWQgPSB2YWx1ZS5pbmRleE9mKFwiKFwiLCBvcGVuKTtcbiAgICByZXR1cm4gdmFsdWUuc3Vic3RyaW5nKG9wZW4sIH5uZXN0ZWQgJiYgbmVzdGVkIDwgY2xvc2UgPyB2YWx1ZS5pbmRleE9mKFwiKVwiLCBjbG9zZSArIDEpIDogY2xvc2UpO1xuICB9LFxuICAgICAgX2NvbmZpZ0Vhc2VGcm9tU3RyaW5nID0gZnVuY3Rpb24gX2NvbmZpZ0Vhc2VGcm9tU3RyaW5nKG5hbWUpIHtcbiAgICB2YXIgc3BsaXQgPSAobmFtZSArIFwiXCIpLnNwbGl0KFwiKFwiKSxcbiAgICAgICAgZWFzZSA9IF9lYXNlTWFwW3NwbGl0WzBdXTtcbiAgICByZXR1cm4gZWFzZSAmJiBzcGxpdC5sZW5ndGggPiAxICYmIGVhc2UuY29uZmlnID8gZWFzZS5jb25maWcuYXBwbHkobnVsbCwgfm5hbWUuaW5kZXhPZihcIntcIikgPyBbX3BhcnNlT2JqZWN0SW5TdHJpbmcoc3BsaXRbMV0pXSA6IF92YWx1ZUluUGFyZW50aGVzZXMobmFtZSkuc3BsaXQoXCIsXCIpLm1hcChfbnVtZXJpY0lmUG9zc2libGUpKSA6IF9lYXNlTWFwLl9DRSAmJiBfY3VzdG9tRWFzZUV4cC50ZXN0KG5hbWUpID8gX2Vhc2VNYXAuX0NFKFwiXCIsIG5hbWUpIDogZWFzZTtcbiAgfSxcbiAgICAgIF9pbnZlcnRFYXNlID0gZnVuY3Rpb24gX2ludmVydEVhc2UoZWFzZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIDEgLSBlYXNlKDEgLSBwKTtcbiAgICB9O1xuICB9LFxuICAgICAgX3Byb3BhZ2F0ZVlveW9FYXNlID0gZnVuY3Rpb24gX3Byb3BhZ2F0ZVlveW9FYXNlKHRpbWVsaW5lLCBpc1lveW8pIHtcbiAgICB2YXIgY2hpbGQgPSB0aW1lbGluZS5fZmlyc3QsXG4gICAgICAgIGVhc2U7XG5cbiAgICB3aGlsZSAoY2hpbGQpIHtcbiAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFRpbWVsaW5lKSB7XG4gICAgICAgIF9wcm9wYWdhdGVZb3lvRWFzZShjaGlsZCwgaXNZb3lvKTtcbiAgICAgIH0gZWxzZSBpZiAoY2hpbGQudmFycy55b3lvRWFzZSAmJiAoIWNoaWxkLl95b3lvIHx8ICFjaGlsZC5fcmVwZWF0KSAmJiBjaGlsZC5feW95byAhPT0gaXNZb3lvKSB7XG4gICAgICAgIGlmIChjaGlsZC50aW1lbGluZSkge1xuICAgICAgICAgIF9wcm9wYWdhdGVZb3lvRWFzZShjaGlsZC50aW1lbGluZSwgaXNZb3lvKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlYXNlID0gY2hpbGQuX2Vhc2U7XG4gICAgICAgICAgY2hpbGQuX2Vhc2UgPSBjaGlsZC5feUVhc2U7XG4gICAgICAgICAgY2hpbGQuX3lFYXNlID0gZWFzZTtcbiAgICAgICAgICBjaGlsZC5feW95byA9IGlzWW95bztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjaGlsZCA9IGNoaWxkLl9uZXh0O1xuICAgIH1cbiAgfSxcbiAgICAgIF9wYXJzZUVhc2UgPSBmdW5jdGlvbiBfcGFyc2VFYXNlKGVhc2UsIGRlZmF1bHRFYXNlKSB7XG4gICAgcmV0dXJuICFlYXNlID8gZGVmYXVsdEVhc2UgOiAoX2lzRnVuY3Rpb24oZWFzZSkgPyBlYXNlIDogX2Vhc2VNYXBbZWFzZV0gfHwgX2NvbmZpZ0Vhc2VGcm9tU3RyaW5nKGVhc2UpKSB8fCBkZWZhdWx0RWFzZTtcbiAgfSxcbiAgICAgIF9pbnNlcnRFYXNlID0gZnVuY3Rpb24gX2luc2VydEVhc2UobmFtZXMsIGVhc2VJbiwgZWFzZU91dCwgZWFzZUluT3V0KSB7XG4gICAgaWYgKGVhc2VPdXQgPT09IHZvaWQgMCkge1xuICAgICAgZWFzZU91dCA9IGZ1bmN0aW9uIGVhc2VPdXQocCkge1xuICAgICAgICByZXR1cm4gMSAtIGVhc2VJbigxIC0gcCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmIChlYXNlSW5PdXQgPT09IHZvaWQgMCkge1xuICAgICAgZWFzZUluT3V0ID0gZnVuY3Rpb24gZWFzZUluT3V0KHApIHtcbiAgICAgICAgcmV0dXJuIHAgPCAuNSA/IGVhc2VJbihwICogMikgLyAyIDogMSAtIGVhc2VJbigoMSAtIHApICogMikgLyAyO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgZWFzZSA9IHtcbiAgICAgIGVhc2VJbjogZWFzZUluLFxuICAgICAgZWFzZU91dDogZWFzZU91dCxcbiAgICAgIGVhc2VJbk91dDogZWFzZUluT3V0XG4gICAgfSxcbiAgICAgICAgbG93ZXJjYXNlTmFtZTtcblxuICAgIF9mb3JFYWNoTmFtZShuYW1lcywgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIF9lYXNlTWFwW25hbWVdID0gX2dsb2JhbHNbbmFtZV0gPSBlYXNlO1xuICAgICAgX2Vhc2VNYXBbbG93ZXJjYXNlTmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKV0gPSBlYXNlT3V0O1xuXG4gICAgICBmb3IgKHZhciBwIGluIGVhc2UpIHtcbiAgICAgICAgX2Vhc2VNYXBbbG93ZXJjYXNlTmFtZSArIChwID09PSBcImVhc2VJblwiID8gXCIuaW5cIiA6IHAgPT09IFwiZWFzZU91dFwiID8gXCIub3V0XCIgOiBcIi5pbk91dFwiKV0gPSBfZWFzZU1hcFtuYW1lICsgXCIuXCIgKyBwXSA9IGVhc2VbcF07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZWFzZTtcbiAgfSxcbiAgICAgIF9lYXNlSW5PdXRGcm9tT3V0ID0gZnVuY3Rpb24gX2Vhc2VJbk91dEZyb21PdXQoZWFzZU91dCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIHAgPCAuNSA/ICgxIC0gZWFzZU91dCgxIC0gcCAqIDIpKSAvIDIgOiAuNSArIGVhc2VPdXQoKHAgLSAuNSkgKiAyKSAvIDI7XG4gICAgfTtcbiAgfSxcbiAgICAgIF9jb25maWdFbGFzdGljID0gZnVuY3Rpb24gX2NvbmZpZ0VsYXN0aWModHlwZSwgYW1wbGl0dWRlLCBwZXJpb2QpIHtcbiAgICB2YXIgcDEgPSBhbXBsaXR1ZGUgPj0gMSA/IGFtcGxpdHVkZSA6IDEsXG4gICAgICAgIHAyID0gKHBlcmlvZCB8fCAodHlwZSA/IC4zIDogLjQ1KSkgLyAoYW1wbGl0dWRlIDwgMSA/IGFtcGxpdHVkZSA6IDEpLFxuICAgICAgICBwMyA9IHAyIC8gXzJQSSAqIChNYXRoLmFzaW4oMSAvIHAxKSB8fCAwKSxcbiAgICAgICAgZWFzZU91dCA9IGZ1bmN0aW9uIGVhc2VPdXQocCkge1xuICAgICAgcmV0dXJuIHAgPT09IDEgPyAxIDogcDEgKiBNYXRoLnBvdygyLCAtMTAgKiBwKSAqIF9zaW4oKHAgLSBwMykgKiBwMikgKyAxO1xuICAgIH0sXG4gICAgICAgIGVhc2UgPSB0eXBlID09PSBcIm91dFwiID8gZWFzZU91dCA6IHR5cGUgPT09IFwiaW5cIiA/IGZ1bmN0aW9uIChwKSB7XG4gICAgICByZXR1cm4gMSAtIGVhc2VPdXQoMSAtIHApO1xuICAgIH0gOiBfZWFzZUluT3V0RnJvbU91dChlYXNlT3V0KTtcblxuICAgIHAyID0gXzJQSSAvIHAyO1xuXG4gICAgZWFzZS5jb25maWcgPSBmdW5jdGlvbiAoYW1wbGl0dWRlLCBwZXJpb2QpIHtcbiAgICAgIHJldHVybiBfY29uZmlnRWxhc3RpYyh0eXBlLCBhbXBsaXR1ZGUsIHBlcmlvZCk7XG4gICAgfTtcblxuICAgIHJldHVybiBlYXNlO1xuICB9LFxuICAgICAgX2NvbmZpZ0JhY2sgPSBmdW5jdGlvbiBfY29uZmlnQmFjayh0eXBlLCBvdmVyc2hvb3QpIHtcbiAgICBpZiAob3ZlcnNob290ID09PSB2b2lkIDApIHtcbiAgICAgIG92ZXJzaG9vdCA9IDEuNzAxNTg7XG4gICAgfVxuXG4gICAgdmFyIGVhc2VPdXQgPSBmdW5jdGlvbiBlYXNlT3V0KHApIHtcbiAgICAgIHJldHVybiBwID8gLS1wICogcCAqICgob3ZlcnNob290ICsgMSkgKiBwICsgb3ZlcnNob290KSArIDEgOiAwO1xuICAgIH0sXG4gICAgICAgIGVhc2UgPSB0eXBlID09PSBcIm91dFwiID8gZWFzZU91dCA6IHR5cGUgPT09IFwiaW5cIiA/IGZ1bmN0aW9uIChwKSB7XG4gICAgICByZXR1cm4gMSAtIGVhc2VPdXQoMSAtIHApO1xuICAgIH0gOiBfZWFzZUluT3V0RnJvbU91dChlYXNlT3V0KTtcblxuICAgIGVhc2UuY29uZmlnID0gZnVuY3Rpb24gKG92ZXJzaG9vdCkge1xuICAgICAgcmV0dXJuIF9jb25maWdCYWNrKHR5cGUsIG92ZXJzaG9vdCk7XG4gICAgfTtcblxuICAgIHJldHVybiBlYXNlO1xuICB9O1xuXG4gIF9mb3JFYWNoTmFtZShcIkxpbmVhcixRdWFkLEN1YmljLFF1YXJ0LFF1aW50LFN0cm9uZ1wiLCBmdW5jdGlvbiAobmFtZSwgaSkge1xuICAgIHZhciBwb3dlciA9IGkgPCA1ID8gaSArIDEgOiBpO1xuXG4gICAgX2luc2VydEVhc2UobmFtZSArIFwiLFBvd2VyXCIgKyAocG93ZXIgLSAxKSwgaSA/IGZ1bmN0aW9uIChwKSB7XG4gICAgICByZXR1cm4gTWF0aC5wb3cocCwgcG93ZXIpO1xuICAgIH0gOiBmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIHA7XG4gICAgfSwgZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiAxIC0gTWF0aC5wb3coMSAtIHAsIHBvd2VyKTtcbiAgICB9LCBmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIHAgPCAuNSA/IE1hdGgucG93KHAgKiAyLCBwb3dlcikgLyAyIDogMSAtIE1hdGgucG93KCgxIC0gcCkgKiAyLCBwb3dlcikgLyAyO1xuICAgIH0pO1xuICB9KTtcblxuICBfZWFzZU1hcC5MaW5lYXIuZWFzZU5vbmUgPSBfZWFzZU1hcC5ub25lID0gX2Vhc2VNYXAuTGluZWFyLmVhc2VJbjtcblxuICBfaW5zZXJ0RWFzZShcIkVsYXN0aWNcIiwgX2NvbmZpZ0VsYXN0aWMoXCJpblwiKSwgX2NvbmZpZ0VsYXN0aWMoXCJvdXRcIiksIF9jb25maWdFbGFzdGljKCkpO1xuXG4gIChmdW5jdGlvbiAobiwgYykge1xuICAgIHZhciBuMSA9IDEgLyBjLFxuICAgICAgICBuMiA9IDIgKiBuMSxcbiAgICAgICAgbjMgPSAyLjUgKiBuMSxcbiAgICAgICAgZWFzZU91dCA9IGZ1bmN0aW9uIGVhc2VPdXQocCkge1xuICAgICAgcmV0dXJuIHAgPCBuMSA/IG4gKiBwICogcCA6IHAgPCBuMiA/IG4gKiBNYXRoLnBvdyhwIC0gMS41IC8gYywgMikgKyAuNzUgOiBwIDwgbjMgPyBuICogKHAgLT0gMi4yNSAvIGMpICogcCArIC45Mzc1IDogbiAqIE1hdGgucG93KHAgLSAyLjYyNSAvIGMsIDIpICsgLjk4NDM3NTtcbiAgICB9O1xuXG4gICAgX2luc2VydEVhc2UoXCJCb3VuY2VcIiwgZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiAxIC0gZWFzZU91dCgxIC0gcCk7XG4gICAgfSwgZWFzZU91dCk7XG4gIH0pKDcuNTYyNSwgMi43NSk7XG5cbiAgX2luc2VydEVhc2UoXCJFeHBvXCIsIGZ1bmN0aW9uIChwKSB7XG4gICAgcmV0dXJuIHAgPyBNYXRoLnBvdygyLCAxMCAqIChwIC0gMSkpIDogMDtcbiAgfSk7XG5cbiAgX2luc2VydEVhc2UoXCJDaXJjXCIsIGZ1bmN0aW9uIChwKSB7XG4gICAgcmV0dXJuIC0oX3NxcnQoMSAtIHAgKiBwKSAtIDEpO1xuICB9KTtcblxuICBfaW5zZXJ0RWFzZShcIlNpbmVcIiwgZnVuY3Rpb24gKHApIHtcbiAgICByZXR1cm4gcCA9PT0gMSA/IDEgOiAtX2NvcyhwICogX0hBTEZfUEkpICsgMTtcbiAgfSk7XG5cbiAgX2luc2VydEVhc2UoXCJCYWNrXCIsIF9jb25maWdCYWNrKFwiaW5cIiksIF9jb25maWdCYWNrKFwib3V0XCIpLCBfY29uZmlnQmFjaygpKTtcblxuICBfZWFzZU1hcC5TdGVwcGVkRWFzZSA9IF9lYXNlTWFwLnN0ZXBzID0gX2dsb2JhbHMuU3RlcHBlZEVhc2UgPSB7XG4gICAgY29uZmlnOiBmdW5jdGlvbiBjb25maWcoc3RlcHMsIGltbWVkaWF0ZVN0YXJ0KSB7XG4gICAgICBpZiAoc3RlcHMgPT09IHZvaWQgMCkge1xuICAgICAgICBzdGVwcyA9IDE7XG4gICAgICB9XG5cbiAgICAgIHZhciBwMSA9IDEgLyBzdGVwcyxcbiAgICAgICAgICBwMiA9IHN0ZXBzICsgKGltbWVkaWF0ZVN0YXJ0ID8gMCA6IDEpLFxuICAgICAgICAgIHAzID0gaW1tZWRpYXRlU3RhcnQgPyAxIDogMCxcbiAgICAgICAgICBtYXggPSAxIC0gX3RpbnlOdW07XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKHApIHtcbiAgICAgICAgcmV0dXJuICgocDIgKiBfY2xhbXAoMCwgbWF4LCBwKSB8IDApICsgcDMpICogcDE7XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbiAgX2RlZmF1bHRzLmVhc2UgPSBfZWFzZU1hcFtcInF1YWQub3V0XCJdO1xuXG4gIF9mb3JFYWNoTmFtZShcIm9uQ29tcGxldGUsb25VcGRhdGUsb25TdGFydCxvblJlcGVhdCxvblJldmVyc2VDb21wbGV0ZSxvbkludGVycnVwdFwiLCBmdW5jdGlvbiAobmFtZSkge1xuICAgIHJldHVybiBfY2FsbGJhY2tOYW1lcyArPSBuYW1lICsgXCIsXCIgKyBuYW1lICsgXCJQYXJhbXMsXCI7XG4gIH0pO1xuXG4gIHZhciBHU0NhY2hlID0gZnVuY3Rpb24gR1NDYWNoZSh0YXJnZXQsIGhhcm5lc3MpIHtcbiAgICB0aGlzLmlkID0gX2dzSUQrKztcbiAgICB0YXJnZXQuX2dzYXAgPSB0aGlzO1xuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHRoaXMuaGFybmVzcyA9IGhhcm5lc3M7XG4gICAgdGhpcy5nZXQgPSBoYXJuZXNzID8gaGFybmVzcy5nZXQgOiBfZ2V0UHJvcGVydHk7XG4gICAgdGhpcy5zZXQgPSBoYXJuZXNzID8gaGFybmVzcy5nZXRTZXR0ZXIgOiBfZ2V0U2V0dGVyO1xuICB9O1xuICB2YXIgQW5pbWF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEFuaW1hdGlvbih2YXJzKSB7XG4gICAgICB0aGlzLnZhcnMgPSB2YXJzO1xuICAgICAgdGhpcy5fZGVsYXkgPSArdmFycy5kZWxheSB8fCAwO1xuXG4gICAgICBpZiAodGhpcy5fcmVwZWF0ID0gdmFycy5yZXBlYXQgPT09IEluZmluaXR5ID8gLTIgOiB2YXJzLnJlcGVhdCB8fCAwKSB7XG4gICAgICAgIHRoaXMuX3JEZWxheSA9IHZhcnMucmVwZWF0RGVsYXkgfHwgMDtcbiAgICAgICAgdGhpcy5feW95byA9ICEhdmFycy55b3lvIHx8ICEhdmFycy55b3lvRWFzZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdHMgPSAxO1xuXG4gICAgICBfc2V0RHVyYXRpb24odGhpcywgK3ZhcnMuZHVyYXRpb24sIDEsIDEpO1xuXG4gICAgICB0aGlzLmRhdGEgPSB2YXJzLmRhdGE7XG4gICAgICBfdGlja2VyQWN0aXZlIHx8IF90aWNrZXIud2FrZSgpO1xuICAgIH1cblxuICAgIHZhciBfcHJvdG8gPSBBbmltYXRpb24ucHJvdG90eXBlO1xuXG4gICAgX3Byb3RvLmRlbGF5ID0gZnVuY3Rpb24gZGVsYXkodmFsdWUpIHtcbiAgICAgIGlmICh2YWx1ZSB8fCB2YWx1ZSA9PT0gMCkge1xuICAgICAgICB0aGlzLnBhcmVudCAmJiB0aGlzLnBhcmVudC5zbW9vdGhDaGlsZFRpbWluZyAmJiB0aGlzLnN0YXJ0VGltZSh0aGlzLl9zdGFydCArIHZhbHVlIC0gdGhpcy5fZGVsYXkpO1xuICAgICAgICB0aGlzLl9kZWxheSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX2RlbGF5O1xuICAgIH07XG5cbiAgICBfcHJvdG8uZHVyYXRpb24gPSBmdW5jdGlvbiBkdXJhdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyB0aGlzLnRvdGFsRHVyYXRpb24odGhpcy5fcmVwZWF0ID4gMCA/IHZhbHVlICsgKHZhbHVlICsgdGhpcy5fckRlbGF5KSAqIHRoaXMuX3JlcGVhdCA6IHZhbHVlKSA6IHRoaXMudG90YWxEdXJhdGlvbigpICYmIHRoaXMuX2R1cjtcbiAgICB9O1xuXG4gICAgX3Byb3RvLnRvdGFsRHVyYXRpb24gPSBmdW5jdGlvbiB0b3RhbER1cmF0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3REdXI7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2RpcnR5ID0gMDtcbiAgICAgIHJldHVybiBfc2V0RHVyYXRpb24odGhpcywgdGhpcy5fcmVwZWF0IDwgMCA/IHZhbHVlIDogKHZhbHVlIC0gdGhpcy5fcmVwZWF0ICogdGhpcy5fckRlbGF5KSAvICh0aGlzLl9yZXBlYXQgKyAxKSk7XG4gICAgfTtcblxuICAgIF9wcm90by50b3RhbFRpbWUgPSBmdW5jdGlvbiB0b3RhbFRpbWUoX3RvdGFsVGltZSwgc3VwcHJlc3NFdmVudHMpIHtcbiAgICAgIF93YWtlKCk7XG5cbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdFRpbWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBwYXJlbnQgPSB0aGlzLl9kcDtcblxuICAgICAgaWYgKHBhcmVudCAmJiBwYXJlbnQuc21vb3RoQ2hpbGRUaW1pbmcgJiYgdGhpcy5fdHMpIHtcbiAgICAgICAgX2FsaWduUGxheWhlYWQodGhpcywgX3RvdGFsVGltZSk7XG5cbiAgICAgICAgIXBhcmVudC5fZHAgfHwgcGFyZW50LnBhcmVudCB8fCBfcG9zdEFkZENoZWNrcyhwYXJlbnQsIHRoaXMpO1xuXG4gICAgICAgIHdoaWxlIChwYXJlbnQgJiYgcGFyZW50LnBhcmVudCkge1xuICAgICAgICAgIGlmIChwYXJlbnQucGFyZW50Ll90aW1lICE9PSBwYXJlbnQuX3N0YXJ0ICsgKHBhcmVudC5fdHMgPj0gMCA/IHBhcmVudC5fdFRpbWUgLyBwYXJlbnQuX3RzIDogKHBhcmVudC50b3RhbER1cmF0aW9uKCkgLSBwYXJlbnQuX3RUaW1lKSAvIC1wYXJlbnQuX3RzKSkge1xuICAgICAgICAgICAgcGFyZW50LnRvdGFsVGltZShwYXJlbnQuX3RUaW1lLCB0cnVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnBhcmVudCAmJiB0aGlzLl9kcC5hdXRvUmVtb3ZlQ2hpbGRyZW4gJiYgKHRoaXMuX3RzID4gMCAmJiBfdG90YWxUaW1lIDwgdGhpcy5fdER1ciB8fCB0aGlzLl90cyA8IDAgJiYgX3RvdGFsVGltZSA+IDAgfHwgIXRoaXMuX3REdXIgJiYgIV90b3RhbFRpbWUpKSB7XG4gICAgICAgICAgX2FkZFRvVGltZWxpbmUodGhpcy5fZHAsIHRoaXMsIHRoaXMuX3N0YXJ0IC0gdGhpcy5fZGVsYXkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl90VGltZSAhPT0gX3RvdGFsVGltZSB8fCAhdGhpcy5fZHVyICYmICFzdXBwcmVzc0V2ZW50cyB8fCB0aGlzLl9pbml0dGVkICYmIE1hdGguYWJzKHRoaXMuX3pUaW1lKSA9PT0gX3RpbnlOdW0gfHwgIV90b3RhbFRpbWUgJiYgIXRoaXMuX2luaXR0ZWQgJiYgKHRoaXMuYWRkIHx8IHRoaXMuX3B0TG9va3VwKSkge1xuICAgICAgICB0aGlzLl90cyB8fCAodGhpcy5fcFRpbWUgPSBfdG90YWxUaW1lKTtcblxuICAgICAgICBfbGF6eVNhZmVSZW5kZXIodGhpcywgX3RvdGFsVGltZSwgc3VwcHJlc3NFdmVudHMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgX3Byb3RvLnRpbWUgPSBmdW5jdGlvbiB0aW1lKHZhbHVlLCBzdXBwcmVzc0V2ZW50cykge1xuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyB0aGlzLnRvdGFsVGltZShNYXRoLm1pbih0aGlzLnRvdGFsRHVyYXRpb24oKSwgdmFsdWUgKyBfZWxhcHNlZEN5Y2xlRHVyYXRpb24odGhpcykpICUgKHRoaXMuX2R1ciArIHRoaXMuX3JEZWxheSkgfHwgKHZhbHVlID8gdGhpcy5fZHVyIDogMCksIHN1cHByZXNzRXZlbnRzKSA6IHRoaXMuX3RpbWU7XG4gICAgfTtcblxuICAgIF9wcm90by50b3RhbFByb2dyZXNzID0gZnVuY3Rpb24gdG90YWxQcm9ncmVzcyh2YWx1ZSwgc3VwcHJlc3NFdmVudHMpIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gdGhpcy50b3RhbFRpbWUodGhpcy50b3RhbER1cmF0aW9uKCkgKiB2YWx1ZSwgc3VwcHJlc3NFdmVudHMpIDogdGhpcy50b3RhbER1cmF0aW9uKCkgPyBNYXRoLm1pbigxLCB0aGlzLl90VGltZSAvIHRoaXMuX3REdXIpIDogdGhpcy5yYXRpbztcbiAgICB9O1xuXG4gICAgX3Byb3RvLnByb2dyZXNzID0gZnVuY3Rpb24gcHJvZ3Jlc3ModmFsdWUsIHN1cHByZXNzRXZlbnRzKSB7XG4gICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IHRoaXMudG90YWxUaW1lKHRoaXMuZHVyYXRpb24oKSAqICh0aGlzLl95b3lvICYmICEodGhpcy5pdGVyYXRpb24oKSAmIDEpID8gMSAtIHZhbHVlIDogdmFsdWUpICsgX2VsYXBzZWRDeWNsZUR1cmF0aW9uKHRoaXMpLCBzdXBwcmVzc0V2ZW50cykgOiB0aGlzLmR1cmF0aW9uKCkgPyBNYXRoLm1pbigxLCB0aGlzLl90aW1lIC8gdGhpcy5fZHVyKSA6IHRoaXMucmF0aW87XG4gICAgfTtcblxuICAgIF9wcm90by5pdGVyYXRpb24gPSBmdW5jdGlvbiBpdGVyYXRpb24odmFsdWUsIHN1cHByZXNzRXZlbnRzKSB7XG4gICAgICB2YXIgY3ljbGVEdXJhdGlvbiA9IHRoaXMuZHVyYXRpb24oKSArIHRoaXMuX3JEZWxheTtcblxuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyB0aGlzLnRvdGFsVGltZSh0aGlzLl90aW1lICsgKHZhbHVlIC0gMSkgKiBjeWNsZUR1cmF0aW9uLCBzdXBwcmVzc0V2ZW50cykgOiB0aGlzLl9yZXBlYXQgPyBfYW5pbWF0aW9uQ3ljbGUodGhpcy5fdFRpbWUsIGN5Y2xlRHVyYXRpb24pICsgMSA6IDE7XG4gICAgfTtcblxuICAgIF9wcm90by50aW1lU2NhbGUgPSBmdW5jdGlvbiB0aW1lU2NhbGUodmFsdWUpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcnRzID09PSAtX3RpbnlOdW0gPyAwIDogdGhpcy5fcnRzO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fcnRzID09PSB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgdmFyIHRUaW1lID0gdGhpcy5wYXJlbnQgJiYgdGhpcy5fdHMgPyBfcGFyZW50VG9DaGlsZFRvdGFsVGltZSh0aGlzLnBhcmVudC5fdGltZSwgdGhpcykgOiB0aGlzLl90VGltZTtcbiAgICAgIHRoaXMuX3J0cyA9ICt2YWx1ZSB8fCAwO1xuICAgICAgdGhpcy5fdHMgPSB0aGlzLl9wcyB8fCB2YWx1ZSA9PT0gLV90aW55TnVtID8gMCA6IHRoaXMuX3J0cztcbiAgICAgIHRoaXMudG90YWxUaW1lKF9jbGFtcCgtdGhpcy5fZGVsYXksIHRoaXMuX3REdXIsIHRUaW1lKSwgdHJ1ZSk7XG5cbiAgICAgIF9zZXRFbmQodGhpcyk7XG5cbiAgICAgIHJldHVybiBfcmVjYWNoZUFuY2VzdG9ycyh0aGlzKTtcbiAgICB9O1xuXG4gICAgX3Byb3RvLnBhdXNlZCA9IGZ1bmN0aW9uIHBhdXNlZCh2YWx1ZSkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcztcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX3BzICE9PSB2YWx1ZSkge1xuICAgICAgICB0aGlzLl9wcyA9IHZhbHVlO1xuXG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgIHRoaXMuX3BUaW1lID0gdGhpcy5fdFRpbWUgfHwgTWF0aC5tYXgoLXRoaXMuX2RlbGF5LCB0aGlzLnJhd1RpbWUoKSk7XG4gICAgICAgICAgdGhpcy5fdHMgPSB0aGlzLl9hY3QgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF93YWtlKCk7XG5cbiAgICAgICAgICB0aGlzLl90cyA9IHRoaXMuX3J0cztcbiAgICAgICAgICB0aGlzLnRvdGFsVGltZSh0aGlzLnBhcmVudCAmJiAhdGhpcy5wYXJlbnQuc21vb3RoQ2hpbGRUaW1pbmcgPyB0aGlzLnJhd1RpbWUoKSA6IHRoaXMuX3RUaW1lIHx8IHRoaXMuX3BUaW1lLCB0aGlzLnByb2dyZXNzKCkgPT09IDEgJiYgTWF0aC5hYnModGhpcy5felRpbWUpICE9PSBfdGlueU51bSAmJiAodGhpcy5fdFRpbWUgLT0gX3RpbnlOdW0pKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgX3Byb3RvLnN0YXJ0VGltZSA9IGZ1bmN0aW9uIHN0YXJ0VGltZSh2YWx1ZSkge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5fc3RhcnQgPSB2YWx1ZTtcbiAgICAgICAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50IHx8IHRoaXMuX2RwO1xuICAgICAgICBwYXJlbnQgJiYgKHBhcmVudC5fc29ydCB8fCAhdGhpcy5wYXJlbnQpICYmIF9hZGRUb1RpbWVsaW5lKHBhcmVudCwgdGhpcywgdmFsdWUgLSB0aGlzLl9kZWxheSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5fc3RhcnQ7XG4gICAgfTtcblxuICAgIF9wcm90by5lbmRUaW1lID0gZnVuY3Rpb24gZW5kVGltZShpbmNsdWRlUmVwZWF0cykge1xuICAgICAgcmV0dXJuIHRoaXMuX3N0YXJ0ICsgKF9pc05vdEZhbHNlKGluY2x1ZGVSZXBlYXRzKSA/IHRoaXMudG90YWxEdXJhdGlvbigpIDogdGhpcy5kdXJhdGlvbigpKSAvIE1hdGguYWJzKHRoaXMuX3RzIHx8IDEpO1xuICAgIH07XG5cbiAgICBfcHJvdG8ucmF3VGltZSA9IGZ1bmN0aW9uIHJhd1RpbWUod3JhcFJlcGVhdHMpIHtcbiAgICAgIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudCB8fCB0aGlzLl9kcDtcbiAgICAgIHJldHVybiAhcGFyZW50ID8gdGhpcy5fdFRpbWUgOiB3cmFwUmVwZWF0cyAmJiAoIXRoaXMuX3RzIHx8IHRoaXMuX3JlcGVhdCAmJiB0aGlzLl90aW1lICYmIHRoaXMudG90YWxQcm9ncmVzcygpIDwgMSkgPyB0aGlzLl90VGltZSAlICh0aGlzLl9kdXIgKyB0aGlzLl9yRGVsYXkpIDogIXRoaXMuX3RzID8gdGhpcy5fdFRpbWUgOiBfcGFyZW50VG9DaGlsZFRvdGFsVGltZShwYXJlbnQucmF3VGltZSh3cmFwUmVwZWF0cyksIHRoaXMpO1xuICAgIH07XG5cbiAgICBfcHJvdG8uZ2xvYmFsVGltZSA9IGZ1bmN0aW9uIGdsb2JhbFRpbWUocmF3VGltZSkge1xuICAgICAgdmFyIGFuaW1hdGlvbiA9IHRoaXMsXG4gICAgICAgICAgdGltZSA9IGFyZ3VtZW50cy5sZW5ndGggPyByYXdUaW1lIDogYW5pbWF0aW9uLnJhd1RpbWUoKTtcblxuICAgICAgd2hpbGUgKGFuaW1hdGlvbikge1xuICAgICAgICB0aW1lID0gYW5pbWF0aW9uLl9zdGFydCArIHRpbWUgLyAoYW5pbWF0aW9uLl90cyB8fCAxKTtcbiAgICAgICAgYW5pbWF0aW9uID0gYW5pbWF0aW9uLl9kcDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRpbWU7XG4gICAgfTtcblxuICAgIF9wcm90by5yZXBlYXQgPSBmdW5jdGlvbiByZXBlYXQodmFsdWUpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX3JlcGVhdCA9IHZhbHVlID09PSBJbmZpbml0eSA/IC0yIDogdmFsdWU7XG4gICAgICAgIHJldHVybiBfb25VcGRhdGVUb3RhbER1cmF0aW9uKHRoaXMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5fcmVwZWF0ID09PSAtMiA/IEluZmluaXR5IDogdGhpcy5fcmVwZWF0O1xuICAgIH07XG5cbiAgICBfcHJvdG8ucmVwZWF0RGVsYXkgPSBmdW5jdGlvbiByZXBlYXREZWxheSh2YWx1ZSkge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIHRpbWUgPSB0aGlzLl90aW1lO1xuICAgICAgICB0aGlzLl9yRGVsYXkgPSB2YWx1ZTtcblxuICAgICAgICBfb25VcGRhdGVUb3RhbER1cmF0aW9uKHRoaXMpO1xuXG4gICAgICAgIHJldHVybiB0aW1lID8gdGhpcy50aW1lKHRpbWUpIDogdGhpcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX3JEZWxheTtcbiAgICB9O1xuXG4gICAgX3Byb3RvLnlveW8gPSBmdW5jdGlvbiB5b3lvKHZhbHVlKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl95b3lvID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5feW95bztcbiAgICB9O1xuXG4gICAgX3Byb3RvLnNlZWsgPSBmdW5jdGlvbiBzZWVrKHBvc2l0aW9uLCBzdXBwcmVzc0V2ZW50cykge1xuICAgICAgcmV0dXJuIHRoaXMudG90YWxUaW1lKF9wYXJzZVBvc2l0aW9uKHRoaXMsIHBvc2l0aW9uKSwgX2lzTm90RmFsc2Uoc3VwcHJlc3NFdmVudHMpKTtcbiAgICB9O1xuXG4gICAgX3Byb3RvLnJlc3RhcnQgPSBmdW5jdGlvbiByZXN0YXJ0KGluY2x1ZGVEZWxheSwgc3VwcHJlc3NFdmVudHMpIHtcbiAgICAgIHJldHVybiB0aGlzLnBsYXkoKS50b3RhbFRpbWUoaW5jbHVkZURlbGF5ID8gLXRoaXMuX2RlbGF5IDogMCwgX2lzTm90RmFsc2Uoc3VwcHJlc3NFdmVudHMpKTtcbiAgICB9O1xuXG4gICAgX3Byb3RvLnBsYXkgPSBmdW5jdGlvbiBwbGF5KGZyb20sIHN1cHByZXNzRXZlbnRzKSB7XG4gICAgICBmcm9tICE9IG51bGwgJiYgdGhpcy5zZWVrKGZyb20sIHN1cHByZXNzRXZlbnRzKTtcbiAgICAgIHJldHVybiB0aGlzLnJldmVyc2VkKGZhbHNlKS5wYXVzZWQoZmFsc2UpO1xuICAgIH07XG5cbiAgICBfcHJvdG8ucmV2ZXJzZSA9IGZ1bmN0aW9uIHJldmVyc2UoZnJvbSwgc3VwcHJlc3NFdmVudHMpIHtcbiAgICAgIGZyb20gIT0gbnVsbCAmJiB0aGlzLnNlZWsoZnJvbSB8fCB0aGlzLnRvdGFsRHVyYXRpb24oKSwgc3VwcHJlc3NFdmVudHMpO1xuICAgICAgcmV0dXJuIHRoaXMucmV2ZXJzZWQodHJ1ZSkucGF1c2VkKGZhbHNlKTtcbiAgICB9O1xuXG4gICAgX3Byb3RvLnBhdXNlID0gZnVuY3Rpb24gcGF1c2UoYXRUaW1lLCBzdXBwcmVzc0V2ZW50cykge1xuICAgICAgYXRUaW1lICE9IG51bGwgJiYgdGhpcy5zZWVrKGF0VGltZSwgc3VwcHJlc3NFdmVudHMpO1xuICAgICAgcmV0dXJuIHRoaXMucGF1c2VkKHRydWUpO1xuICAgIH07XG5cbiAgICBfcHJvdG8ucmVzdW1lID0gZnVuY3Rpb24gcmVzdW1lKCkge1xuICAgICAgcmV0dXJuIHRoaXMucGF1c2VkKGZhbHNlKTtcbiAgICB9O1xuXG4gICAgX3Byb3RvLnJldmVyc2VkID0gZnVuY3Rpb24gcmV2ZXJzZWQodmFsdWUpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICEhdmFsdWUgIT09IHRoaXMucmV2ZXJzZWQoKSAmJiB0aGlzLnRpbWVTY2FsZSgtdGhpcy5fcnRzIHx8ICh2YWx1ZSA/IC1fdGlueU51bSA6IDApKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLl9ydHMgPCAwO1xuICAgIH07XG5cbiAgICBfcHJvdG8uaW52YWxpZGF0ZSA9IGZ1bmN0aW9uIGludmFsaWRhdGUoKSB7XG4gICAgICB0aGlzLl9pbml0dGVkID0gdGhpcy5fYWN0ID0gMDtcbiAgICAgIHRoaXMuX3pUaW1lID0gLV90aW55TnVtO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIF9wcm90by5pc0FjdGl2ZSA9IGZ1bmN0aW9uIGlzQWN0aXZlKCkge1xuICAgICAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50IHx8IHRoaXMuX2RwLFxuICAgICAgICAgIHN0YXJ0ID0gdGhpcy5fc3RhcnQsXG4gICAgICAgICAgcmF3VGltZTtcbiAgICAgIHJldHVybiAhISghcGFyZW50IHx8IHRoaXMuX3RzICYmIHRoaXMuX2luaXR0ZWQgJiYgcGFyZW50LmlzQWN0aXZlKCkgJiYgKHJhd1RpbWUgPSBwYXJlbnQucmF3VGltZSh0cnVlKSkgPj0gc3RhcnQgJiYgcmF3VGltZSA8IHRoaXMuZW5kVGltZSh0cnVlKSAtIF90aW55TnVtKTtcbiAgICB9O1xuXG4gICAgX3Byb3RvLmV2ZW50Q2FsbGJhY2sgPSBmdW5jdGlvbiBldmVudENhbGxiYWNrKHR5cGUsIGNhbGxiYWNrLCBwYXJhbXMpIHtcbiAgICAgIHZhciB2YXJzID0gdGhpcy52YXJzO1xuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgIGRlbGV0ZSB2YXJzW3R5cGVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhcnNbdHlwZV0gPSBjYWxsYmFjaztcbiAgICAgICAgICBwYXJhbXMgJiYgKHZhcnNbdHlwZSArIFwiUGFyYW1zXCJdID0gcGFyYW1zKTtcbiAgICAgICAgICB0eXBlID09PSBcIm9uVXBkYXRlXCIgJiYgKHRoaXMuX29uVXBkYXRlID0gY2FsbGJhY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YXJzW3R5cGVdO1xuICAgIH07XG5cbiAgICBfcHJvdG8udGhlbiA9IGZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsZWQpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICB2YXIgZiA9IF9pc0Z1bmN0aW9uKG9uRnVsZmlsbGVkKSA/IG9uRnVsZmlsbGVkIDogX3Bhc3NUaHJvdWdoLFxuICAgICAgICAgICAgX3Jlc29sdmUgPSBmdW5jdGlvbiBfcmVzb2x2ZSgpIHtcbiAgICAgICAgICB2YXIgX3RoZW4gPSBzZWxmLnRoZW47XG4gICAgICAgICAgc2VsZi50aGVuID0gbnVsbDtcbiAgICAgICAgICBfaXNGdW5jdGlvbihmKSAmJiAoZiA9IGYoc2VsZikpICYmIChmLnRoZW4gfHwgZiA9PT0gc2VsZikgJiYgKHNlbGYudGhlbiA9IF90aGVuKTtcbiAgICAgICAgICByZXNvbHZlKGYpO1xuICAgICAgICAgIHNlbGYudGhlbiA9IF90aGVuO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChzZWxmLl9pbml0dGVkICYmIHNlbGYudG90YWxQcm9ncmVzcygpID09PSAxICYmIHNlbGYuX3RzID49IDAgfHwgIXNlbGYuX3RUaW1lICYmIHNlbGYuX3RzIDwgMCkge1xuICAgICAgICAgIF9yZXNvbHZlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5fcHJvbSA9IF9yZXNvbHZlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgX3Byb3RvLmtpbGwgPSBmdW5jdGlvbiBraWxsKCkge1xuICAgICAgX2ludGVycnVwdCh0aGlzKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEFuaW1hdGlvbjtcbiAgfSgpO1xuXG4gIF9zZXREZWZhdWx0cyhBbmltYXRpb24ucHJvdG90eXBlLCB7XG4gICAgX3RpbWU6IDAsXG4gICAgX3N0YXJ0OiAwLFxuICAgIF9lbmQ6IDAsXG4gICAgX3RUaW1lOiAwLFxuICAgIF90RHVyOiAwLFxuICAgIF9kaXJ0eTogMCxcbiAgICBfcmVwZWF0OiAwLFxuICAgIF95b3lvOiBmYWxzZSxcbiAgICBwYXJlbnQ6IG51bGwsXG4gICAgX2luaXR0ZWQ6IGZhbHNlLFxuICAgIF9yRGVsYXk6IDAsXG4gICAgX3RzOiAxLFxuICAgIF9kcDogMCxcbiAgICByYXRpbzogMCxcbiAgICBfelRpbWU6IC1fdGlueU51bSxcbiAgICBfcHJvbTogMCxcbiAgICBfcHM6IGZhbHNlLFxuICAgIF9ydHM6IDFcbiAgfSk7XG5cbiAgdmFyIFRpbWVsaW5lID0gZnVuY3Rpb24gKF9BbmltYXRpb24pIHtcbiAgICBfaW5oZXJpdHNMb29zZShUaW1lbGluZSwgX0FuaW1hdGlvbik7XG5cbiAgICBmdW5jdGlvbiBUaW1lbGluZSh2YXJzLCBwb3NpdGlvbikge1xuICAgICAgdmFyIF90aGlzO1xuXG4gICAgICBpZiAodmFycyA9PT0gdm9pZCAwKSB7XG4gICAgICAgIHZhcnMgPSB7fTtcbiAgICAgIH1cblxuICAgICAgX3RoaXMgPSBfQW5pbWF0aW9uLmNhbGwodGhpcywgdmFycykgfHwgdGhpcztcbiAgICAgIF90aGlzLmxhYmVscyA9IHt9O1xuICAgICAgX3RoaXMuc21vb3RoQ2hpbGRUaW1pbmcgPSAhIXZhcnMuc21vb3RoQ2hpbGRUaW1pbmc7XG4gICAgICBfdGhpcy5hdXRvUmVtb3ZlQ2hpbGRyZW4gPSAhIXZhcnMuYXV0b1JlbW92ZUNoaWxkcmVuO1xuICAgICAgX3RoaXMuX3NvcnQgPSBfaXNOb3RGYWxzZSh2YXJzLnNvcnRDaGlsZHJlbik7XG4gICAgICBfZ2xvYmFsVGltZWxpbmUgJiYgX2FkZFRvVGltZWxpbmUodmFycy5wYXJlbnQgfHwgX2dsb2JhbFRpbWVsaW5lLCBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgcG9zaXRpb24pO1xuICAgICAgdmFycy5yZXZlcnNlZCAmJiBfdGhpcy5yZXZlcnNlKCk7XG4gICAgICB2YXJzLnBhdXNlZCAmJiBfdGhpcy5wYXVzZWQodHJ1ZSk7XG4gICAgICB2YXJzLnNjcm9sbFRyaWdnZXIgJiYgX3Njcm9sbFRyaWdnZXIoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIHZhcnMuc2Nyb2xsVHJpZ2dlcik7XG4gICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuXG4gICAgdmFyIF9wcm90bzIgPSBUaW1lbGluZS5wcm90b3R5cGU7XG5cbiAgICBfcHJvdG8yLnRvID0gZnVuY3Rpb24gdG8odGFyZ2V0cywgdmFycywgcG9zaXRpb24pIHtcbiAgICAgIF9jcmVhdGVUd2VlblR5cGUoMCwgYXJndW1lbnRzLCB0aGlzKTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIF9wcm90bzIuZnJvbSA9IGZ1bmN0aW9uIGZyb20odGFyZ2V0cywgdmFycywgcG9zaXRpb24pIHtcbiAgICAgIF9jcmVhdGVUd2VlblR5cGUoMSwgYXJndW1lbnRzLCB0aGlzKTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIF9wcm90bzIuZnJvbVRvID0gZnVuY3Rpb24gZnJvbVRvKHRhcmdldHMsIGZyb21WYXJzLCB0b1ZhcnMsIHBvc2l0aW9uKSB7XG4gICAgICBfY3JlYXRlVHdlZW5UeXBlKDIsIGFyZ3VtZW50cywgdGhpcyk7XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBfcHJvdG8yLnNldCA9IGZ1bmN0aW9uIHNldCh0YXJnZXRzLCB2YXJzLCBwb3NpdGlvbikge1xuICAgICAgdmFycy5kdXJhdGlvbiA9IDA7XG4gICAgICB2YXJzLnBhcmVudCA9IHRoaXM7XG4gICAgICBfaW5oZXJpdERlZmF1bHRzKHZhcnMpLnJlcGVhdERlbGF5IHx8ICh2YXJzLnJlcGVhdCA9IDApO1xuICAgICAgdmFycy5pbW1lZGlhdGVSZW5kZXIgPSAhIXZhcnMuaW1tZWRpYXRlUmVuZGVyO1xuICAgICAgbmV3IFR3ZWVuKHRhcmdldHMsIHZhcnMsIF9wYXJzZVBvc2l0aW9uKHRoaXMsIHBvc2l0aW9uKSwgMSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgX3Byb3RvMi5jYWxsID0gZnVuY3Rpb24gY2FsbChjYWxsYmFjaywgcGFyYW1zLCBwb3NpdGlvbikge1xuICAgICAgcmV0dXJuIF9hZGRUb1RpbWVsaW5lKHRoaXMsIFR3ZWVuLmRlbGF5ZWRDYWxsKDAsIGNhbGxiYWNrLCBwYXJhbXMpLCBwb3NpdGlvbik7XG4gICAgfTtcblxuICAgIF9wcm90bzIuc3RhZ2dlclRvID0gZnVuY3Rpb24gc3RhZ2dlclRvKHRhcmdldHMsIGR1cmF0aW9uLCB2YXJzLCBzdGFnZ2VyLCBwb3NpdGlvbiwgb25Db21wbGV0ZUFsbCwgb25Db21wbGV0ZUFsbFBhcmFtcykge1xuICAgICAgdmFycy5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuICAgICAgdmFycy5zdGFnZ2VyID0gdmFycy5zdGFnZ2VyIHx8IHN0YWdnZXI7XG4gICAgICB2YXJzLm9uQ29tcGxldGUgPSBvbkNvbXBsZXRlQWxsO1xuICAgICAgdmFycy5vbkNvbXBsZXRlUGFyYW1zID0gb25Db21wbGV0ZUFsbFBhcmFtcztcbiAgICAgIHZhcnMucGFyZW50ID0gdGhpcztcbiAgICAgIG5ldyBUd2Vlbih0YXJnZXRzLCB2YXJzLCBfcGFyc2VQb3NpdGlvbih0aGlzLCBwb3NpdGlvbikpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIF9wcm90bzIuc3RhZ2dlckZyb20gPSBmdW5jdGlvbiBzdGFnZ2VyRnJvbSh0YXJnZXRzLCBkdXJhdGlvbiwgdmFycywgc3RhZ2dlciwgcG9zaXRpb24sIG9uQ29tcGxldGVBbGwsIG9uQ29tcGxldGVBbGxQYXJhbXMpIHtcbiAgICAgIHZhcnMucnVuQmFja3dhcmRzID0gMTtcbiAgICAgIF9pbmhlcml0RGVmYXVsdHModmFycykuaW1tZWRpYXRlUmVuZGVyID0gX2lzTm90RmFsc2UodmFycy5pbW1lZGlhdGVSZW5kZXIpO1xuICAgICAgcmV0dXJuIHRoaXMuc3RhZ2dlclRvKHRhcmdldHMsIGR1cmF0aW9uLCB2YXJzLCBzdGFnZ2VyLCBwb3NpdGlvbiwgb25Db21wbGV0ZUFsbCwgb25Db21wbGV0ZUFsbFBhcmFtcyk7XG4gICAgfTtcblxuICAgIF9wcm90bzIuc3RhZ2dlckZyb21UbyA9IGZ1bmN0aW9uIHN0YWdnZXJGcm9tVG8odGFyZ2V0cywgZHVyYXRpb24sIGZyb21WYXJzLCB0b1ZhcnMsIHN0YWdnZXIsIHBvc2l0aW9uLCBvbkNvbXBsZXRlQWxsLCBvbkNvbXBsZXRlQWxsUGFyYW1zKSB7XG4gICAgICB0b1ZhcnMuc3RhcnRBdCA9IGZyb21WYXJzO1xuICAgICAgX2luaGVyaXREZWZhdWx0cyh0b1ZhcnMpLmltbWVkaWF0ZVJlbmRlciA9IF9pc05vdEZhbHNlKHRvVmFycy5pbW1lZGlhdGVSZW5kZXIpO1xuICAgICAgcmV0dXJuIHRoaXMuc3RhZ2dlclRvKHRhcmdldHMsIGR1cmF0aW9uLCB0b1ZhcnMsIHN0YWdnZXIsIHBvc2l0aW9uLCBvbkNvbXBsZXRlQWxsLCBvbkNvbXBsZXRlQWxsUGFyYW1zKTtcbiAgICB9O1xuXG4gICAgX3Byb3RvMi5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIodG90YWxUaW1lLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpIHtcbiAgICAgIHZhciBwcmV2VGltZSA9IHRoaXMuX3RpbWUsXG4gICAgICAgICAgdER1ciA9IHRoaXMuX2RpcnR5ID8gdGhpcy50b3RhbER1cmF0aW9uKCkgOiB0aGlzLl90RHVyLFxuICAgICAgICAgIGR1ciA9IHRoaXMuX2R1cixcbiAgICAgICAgICB0VGltZSA9IHRvdGFsVGltZSA8PSAwID8gMCA6IF9yb3VuZFByZWNpc2UodG90YWxUaW1lKSxcbiAgICAgICAgICBjcm9zc2luZ1N0YXJ0ID0gdGhpcy5felRpbWUgPCAwICE9PSB0b3RhbFRpbWUgPCAwICYmICh0aGlzLl9pbml0dGVkIHx8ICFkdXIpLFxuICAgICAgICAgIHRpbWUsXG4gICAgICAgICAgY2hpbGQsXG4gICAgICAgICAgbmV4dCxcbiAgICAgICAgICBpdGVyYXRpb24sXG4gICAgICAgICAgY3ljbGVEdXJhdGlvbixcbiAgICAgICAgICBwcmV2UGF1c2VkLFxuICAgICAgICAgIHBhdXNlVHdlZW4sXG4gICAgICAgICAgdGltZVNjYWxlLFxuICAgICAgICAgIHByZXZTdGFydCxcbiAgICAgICAgICBwcmV2SXRlcmF0aW9uLFxuICAgICAgICAgIHlveW8sXG4gICAgICAgICAgaXNZb3lvO1xuICAgICAgdGhpcyAhPT0gX2dsb2JhbFRpbWVsaW5lICYmIHRUaW1lID4gdER1ciAmJiB0b3RhbFRpbWUgPj0gMCAmJiAodFRpbWUgPSB0RHVyKTtcblxuICAgICAgaWYgKHRUaW1lICE9PSB0aGlzLl90VGltZSB8fCBmb3JjZSB8fCBjcm9zc2luZ1N0YXJ0KSB7XG4gICAgICAgIGlmIChwcmV2VGltZSAhPT0gdGhpcy5fdGltZSAmJiBkdXIpIHtcbiAgICAgICAgICB0VGltZSArPSB0aGlzLl90aW1lIC0gcHJldlRpbWU7XG4gICAgICAgICAgdG90YWxUaW1lICs9IHRoaXMuX3RpbWUgLSBwcmV2VGltZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRpbWUgPSB0VGltZTtcbiAgICAgICAgcHJldlN0YXJ0ID0gdGhpcy5fc3RhcnQ7XG4gICAgICAgIHRpbWVTY2FsZSA9IHRoaXMuX3RzO1xuICAgICAgICBwcmV2UGF1c2VkID0gIXRpbWVTY2FsZTtcblxuICAgICAgICBpZiAoY3Jvc3NpbmdTdGFydCkge1xuICAgICAgICAgIGR1ciB8fCAocHJldlRpbWUgPSB0aGlzLl96VGltZSk7XG4gICAgICAgICAgKHRvdGFsVGltZSB8fCAhc3VwcHJlc3NFdmVudHMpICYmICh0aGlzLl96VGltZSA9IHRvdGFsVGltZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fcmVwZWF0KSB7XG4gICAgICAgICAgeW95byA9IHRoaXMuX3lveW87XG4gICAgICAgICAgY3ljbGVEdXJhdGlvbiA9IGR1ciArIHRoaXMuX3JEZWxheTtcblxuICAgICAgICAgIGlmICh0aGlzLl9yZXBlYXQgPCAtMSAmJiB0b3RhbFRpbWUgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b3RhbFRpbWUoY3ljbGVEdXJhdGlvbiAqIDEwMCArIHRvdGFsVGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aW1lID0gX3JvdW5kUHJlY2lzZSh0VGltZSAlIGN5Y2xlRHVyYXRpb24pO1xuXG4gICAgICAgICAgaWYgKHRUaW1lID09PSB0RHVyKSB7XG4gICAgICAgICAgICBpdGVyYXRpb24gPSB0aGlzLl9yZXBlYXQ7XG4gICAgICAgICAgICB0aW1lID0gZHVyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdGVyYXRpb24gPSB+fih0VGltZSAvIGN5Y2xlRHVyYXRpb24pO1xuXG4gICAgICAgICAgICBpZiAoaXRlcmF0aW9uICYmIGl0ZXJhdGlvbiA9PT0gdFRpbWUgLyBjeWNsZUR1cmF0aW9uKSB7XG4gICAgICAgICAgICAgIHRpbWUgPSBkdXI7XG4gICAgICAgICAgICAgIGl0ZXJhdGlvbi0tO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aW1lID4gZHVyICYmICh0aW1lID0gZHVyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBwcmV2SXRlcmF0aW9uID0gX2FuaW1hdGlvbkN5Y2xlKHRoaXMuX3RUaW1lLCBjeWNsZUR1cmF0aW9uKTtcbiAgICAgICAgICAhcHJldlRpbWUgJiYgdGhpcy5fdFRpbWUgJiYgcHJldkl0ZXJhdGlvbiAhPT0gaXRlcmF0aW9uICYmIChwcmV2SXRlcmF0aW9uID0gaXRlcmF0aW9uKTtcblxuICAgICAgICAgIGlmICh5b3lvICYmIGl0ZXJhdGlvbiAmIDEpIHtcbiAgICAgICAgICAgIHRpbWUgPSBkdXIgLSB0aW1lO1xuICAgICAgICAgICAgaXNZb3lvID0gMTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaXRlcmF0aW9uICE9PSBwcmV2SXRlcmF0aW9uICYmICF0aGlzLl9sb2NrKSB7XG4gICAgICAgICAgICB2YXIgcmV3aW5kaW5nID0geW95byAmJiBwcmV2SXRlcmF0aW9uICYgMSxcbiAgICAgICAgICAgICAgICBkb2VzV3JhcCA9IHJld2luZGluZyA9PT0gKHlveW8gJiYgaXRlcmF0aW9uICYgMSk7XG4gICAgICAgICAgICBpdGVyYXRpb24gPCBwcmV2SXRlcmF0aW9uICYmIChyZXdpbmRpbmcgPSAhcmV3aW5kaW5nKTtcbiAgICAgICAgICAgIHByZXZUaW1lID0gcmV3aW5kaW5nID8gMCA6IGR1cjtcbiAgICAgICAgICAgIHRoaXMuX2xvY2sgPSAxO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXIocHJldlRpbWUgfHwgKGlzWW95byA/IDAgOiBfcm91bmRQcmVjaXNlKGl0ZXJhdGlvbiAqIGN5Y2xlRHVyYXRpb24pKSwgc3VwcHJlc3NFdmVudHMsICFkdXIpLl9sb2NrID0gMDtcbiAgICAgICAgICAgIHRoaXMuX3RUaW1lID0gdFRpbWU7XG4gICAgICAgICAgICAhc3VwcHJlc3NFdmVudHMgJiYgdGhpcy5wYXJlbnQgJiYgX2NhbGxiYWNrKHRoaXMsIFwib25SZXBlYXRcIik7XG4gICAgICAgICAgICB0aGlzLnZhcnMucmVwZWF0UmVmcmVzaCAmJiAhaXNZb3lvICYmICh0aGlzLmludmFsaWRhdGUoKS5fbG9jayA9IDEpO1xuXG4gICAgICAgICAgICBpZiAocHJldlRpbWUgJiYgcHJldlRpbWUgIT09IHRoaXMuX3RpbWUgfHwgcHJldlBhdXNlZCAhPT0gIXRoaXMuX3RzIHx8IHRoaXMudmFycy5vblJlcGVhdCAmJiAhdGhpcy5wYXJlbnQgJiYgIXRoaXMuX2FjdCkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZHVyID0gdGhpcy5fZHVyO1xuICAgICAgICAgICAgdER1ciA9IHRoaXMuX3REdXI7XG5cbiAgICAgICAgICAgIGlmIChkb2VzV3JhcCkge1xuICAgICAgICAgICAgICB0aGlzLl9sb2NrID0gMjtcbiAgICAgICAgICAgICAgcHJldlRpbWUgPSByZXdpbmRpbmcgPyBkdXIgOiAtMC4wMDAxO1xuICAgICAgICAgICAgICB0aGlzLnJlbmRlcihwcmV2VGltZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgIHRoaXMudmFycy5yZXBlYXRSZWZyZXNoICYmICFpc1lveW8gJiYgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2xvY2sgPSAwO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3RzICYmICFwcmV2UGF1c2VkKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfcHJvcGFnYXRlWW95b0Vhc2UodGhpcywgaXNZb3lvKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5faGFzUGF1c2UgJiYgIXRoaXMuX2ZvcmNpbmcgJiYgdGhpcy5fbG9jayA8IDIpIHtcbiAgICAgICAgICBwYXVzZVR3ZWVuID0gX2ZpbmROZXh0UGF1c2VUd2Vlbih0aGlzLCBfcm91bmRQcmVjaXNlKHByZXZUaW1lKSwgX3JvdW5kUHJlY2lzZSh0aW1lKSk7XG5cbiAgICAgICAgICBpZiAocGF1c2VUd2Vlbikge1xuICAgICAgICAgICAgdFRpbWUgLT0gdGltZSAtICh0aW1lID0gcGF1c2VUd2Vlbi5fc3RhcnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3RUaW1lID0gdFRpbWU7XG4gICAgICAgIHRoaXMuX3RpbWUgPSB0aW1lO1xuICAgICAgICB0aGlzLl9hY3QgPSAhdGltZVNjYWxlO1xuXG4gICAgICAgIGlmICghdGhpcy5faW5pdHRlZCkge1xuICAgICAgICAgIHRoaXMuX29uVXBkYXRlID0gdGhpcy52YXJzLm9uVXBkYXRlO1xuICAgICAgICAgIHRoaXMuX2luaXR0ZWQgPSAxO1xuICAgICAgICAgIHRoaXMuX3pUaW1lID0gdG90YWxUaW1lO1xuICAgICAgICAgIHByZXZUaW1lID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcHJldlRpbWUgJiYgdGltZSAmJiAhc3VwcHJlc3NFdmVudHMpIHtcbiAgICAgICAgICBfY2FsbGJhY2sodGhpcywgXCJvblN0YXJ0XCIpO1xuXG4gICAgICAgICAgaWYgKHRoaXMuX3RUaW1lICE9PSB0VGltZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRpbWUgPj0gcHJldlRpbWUgJiYgdG90YWxUaW1lID49IDApIHtcbiAgICAgICAgICBjaGlsZCA9IHRoaXMuX2ZpcnN0O1xuXG4gICAgICAgICAgd2hpbGUgKGNoaWxkKSB7XG4gICAgICAgICAgICBuZXh0ID0gY2hpbGQuX25leHQ7XG5cbiAgICAgICAgICAgIGlmICgoY2hpbGQuX2FjdCB8fCB0aW1lID49IGNoaWxkLl9zdGFydCkgJiYgY2hpbGQuX3RzICYmIHBhdXNlVHdlZW4gIT09IGNoaWxkKSB7XG4gICAgICAgICAgICAgIGlmIChjaGlsZC5wYXJlbnQgIT09IHRoaXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIodG90YWxUaW1lLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY2hpbGQucmVuZGVyKGNoaWxkLl90cyA+IDAgPyAodGltZSAtIGNoaWxkLl9zdGFydCkgKiBjaGlsZC5fdHMgOiAoY2hpbGQuX2RpcnR5ID8gY2hpbGQudG90YWxEdXJhdGlvbigpIDogY2hpbGQuX3REdXIpICsgKHRpbWUgLSBjaGlsZC5fc3RhcnQpICogY2hpbGQuX3RzLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuXG4gICAgICAgICAgICAgIGlmICh0aW1lICE9PSB0aGlzLl90aW1lIHx8ICF0aGlzLl90cyAmJiAhcHJldlBhdXNlZCkge1xuICAgICAgICAgICAgICAgIHBhdXNlVHdlZW4gPSAwO1xuICAgICAgICAgICAgICAgIG5leHQgJiYgKHRUaW1lICs9IHRoaXMuX3pUaW1lID0gLV90aW55TnVtKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjaGlsZCA9IG5leHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNoaWxkID0gdGhpcy5fbGFzdDtcbiAgICAgICAgICB2YXIgYWRqdXN0ZWRUaW1lID0gdG90YWxUaW1lIDwgMCA/IHRvdGFsVGltZSA6IHRpbWU7XG5cbiAgICAgICAgICB3aGlsZSAoY2hpbGQpIHtcbiAgICAgICAgICAgIG5leHQgPSBjaGlsZC5fcHJldjtcblxuICAgICAgICAgICAgaWYgKChjaGlsZC5fYWN0IHx8IGFkanVzdGVkVGltZSA8PSBjaGlsZC5fZW5kKSAmJiBjaGlsZC5fdHMgJiYgcGF1c2VUd2VlbiAhPT0gY2hpbGQpIHtcbiAgICAgICAgICAgICAgaWYgKGNoaWxkLnBhcmVudCAhPT0gdGhpcykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcih0b3RhbFRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjaGlsZC5yZW5kZXIoY2hpbGQuX3RzID4gMCA/IChhZGp1c3RlZFRpbWUgLSBjaGlsZC5fc3RhcnQpICogY2hpbGQuX3RzIDogKGNoaWxkLl9kaXJ0eSA/IGNoaWxkLnRvdGFsRHVyYXRpb24oKSA6IGNoaWxkLl90RHVyKSArIChhZGp1c3RlZFRpbWUgLSBjaGlsZC5fc3RhcnQpICogY2hpbGQuX3RzLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuXG4gICAgICAgICAgICAgIGlmICh0aW1lICE9PSB0aGlzLl90aW1lIHx8ICF0aGlzLl90cyAmJiAhcHJldlBhdXNlZCkge1xuICAgICAgICAgICAgICAgIHBhdXNlVHdlZW4gPSAwO1xuICAgICAgICAgICAgICAgIG5leHQgJiYgKHRUaW1lICs9IHRoaXMuX3pUaW1lID0gYWRqdXN0ZWRUaW1lID8gLV90aW55TnVtIDogX3RpbnlOdW0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNoaWxkID0gbmV4dDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGF1c2VUd2VlbiAmJiAhc3VwcHJlc3NFdmVudHMpIHtcbiAgICAgICAgICB0aGlzLnBhdXNlKCk7XG4gICAgICAgICAgcGF1c2VUd2Vlbi5yZW5kZXIodGltZSA+PSBwcmV2VGltZSA/IDAgOiAtX3RpbnlOdW0pLl96VGltZSA9IHRpbWUgPj0gcHJldlRpbWUgPyAxIDogLTE7XG5cbiAgICAgICAgICBpZiAodGhpcy5fdHMpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0ID0gcHJldlN0YXJ0O1xuXG4gICAgICAgICAgICBfc2V0RW5kKHRoaXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIodG90YWxUaW1lLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX29uVXBkYXRlICYmICFzdXBwcmVzc0V2ZW50cyAmJiBfY2FsbGJhY2sodGhpcywgXCJvblVwZGF0ZVwiLCB0cnVlKTtcbiAgICAgICAgaWYgKHRUaW1lID09PSB0RHVyICYmIHRoaXMuX3RUaW1lID49IHRoaXMudG90YWxEdXJhdGlvbigpIHx8ICF0VGltZSAmJiBwcmV2VGltZSkgaWYgKHByZXZTdGFydCA9PT0gdGhpcy5fc3RhcnQgfHwgTWF0aC5hYnModGltZVNjYWxlKSAhPT0gTWF0aC5hYnModGhpcy5fdHMpKSBpZiAoIXRoaXMuX2xvY2spIHtcbiAgICAgICAgICAodG90YWxUaW1lIHx8ICFkdXIpICYmICh0VGltZSA9PT0gdER1ciAmJiB0aGlzLl90cyA+IDAgfHwgIXRUaW1lICYmIHRoaXMuX3RzIDwgMCkgJiYgX3JlbW92ZUZyb21QYXJlbnQodGhpcywgMSk7XG5cbiAgICAgICAgICBpZiAoIXN1cHByZXNzRXZlbnRzICYmICEodG90YWxUaW1lIDwgMCAmJiAhcHJldlRpbWUpICYmICh0VGltZSB8fCBwcmV2VGltZSB8fCAhdER1cikpIHtcbiAgICAgICAgICAgIF9jYWxsYmFjayh0aGlzLCB0VGltZSA9PT0gdER1ciAmJiB0b3RhbFRpbWUgPj0gMCA/IFwib25Db21wbGV0ZVwiIDogXCJvblJldmVyc2VDb21wbGV0ZVwiLCB0cnVlKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvbSAmJiAhKHRUaW1lIDwgdER1ciAmJiB0aGlzLnRpbWVTY2FsZSgpID4gMCkgJiYgdGhpcy5fcHJvbSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgX3Byb3RvMi5hZGQgPSBmdW5jdGlvbiBhZGQoY2hpbGQsIHBvc2l0aW9uKSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgX2lzTnVtYmVyKHBvc2l0aW9uKSB8fCAocG9zaXRpb24gPSBfcGFyc2VQb3NpdGlvbih0aGlzLCBwb3NpdGlvbiwgY2hpbGQpKTtcblxuICAgICAgaWYgKCEoY2hpbGQgaW5zdGFuY2VvZiBBbmltYXRpb24pKSB7XG4gICAgICAgIGlmIChfaXNBcnJheShjaGlsZCkpIHtcbiAgICAgICAgICBjaGlsZC5mb3JFYWNoKGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpczIuYWRkKG9iaiwgcG9zaXRpb24pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF9pc1N0cmluZyhjaGlsZCkpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5hZGRMYWJlbChjaGlsZCwgcG9zaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF9pc0Z1bmN0aW9uKGNoaWxkKSkge1xuICAgICAgICAgIGNoaWxkID0gVHdlZW4uZGVsYXllZENhbGwoMCwgY2hpbGQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzICE9PSBjaGlsZCA/IF9hZGRUb1RpbWVsaW5lKHRoaXMsIGNoaWxkLCBwb3NpdGlvbikgOiB0aGlzO1xuICAgIH07XG5cbiAgICBfcHJvdG8yLmdldENoaWxkcmVuID0gZnVuY3Rpb24gZ2V0Q2hpbGRyZW4obmVzdGVkLCB0d2VlbnMsIHRpbWVsaW5lcywgaWdub3JlQmVmb3JlVGltZSkge1xuICAgICAgaWYgKG5lc3RlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgIG5lc3RlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh0d2VlbnMgPT09IHZvaWQgMCkge1xuICAgICAgICB0d2VlbnMgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodGltZWxpbmVzID09PSB2b2lkIDApIHtcbiAgICAgICAgdGltZWxpbmVzID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlnbm9yZUJlZm9yZVRpbWUgPT09IHZvaWQgMCkge1xuICAgICAgICBpZ25vcmVCZWZvcmVUaW1lID0gLV9iaWdOdW07XG4gICAgICB9XG5cbiAgICAgIHZhciBhID0gW10sXG4gICAgICAgICAgY2hpbGQgPSB0aGlzLl9maXJzdDtcblxuICAgICAgd2hpbGUgKGNoaWxkKSB7XG4gICAgICAgIGlmIChjaGlsZC5fc3RhcnQgPj0gaWdub3JlQmVmb3JlVGltZSkge1xuICAgICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFR3ZWVuKSB7XG4gICAgICAgICAgICB0d2VlbnMgJiYgYS5wdXNoKGNoaWxkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGltZWxpbmVzICYmIGEucHVzaChjaGlsZCk7XG4gICAgICAgICAgICBuZXN0ZWQgJiYgYS5wdXNoLmFwcGx5KGEsIGNoaWxkLmdldENoaWxkcmVuKHRydWUsIHR3ZWVucywgdGltZWxpbmVzKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2hpbGQgPSBjaGlsZC5fbmV4dDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGE7XG4gICAgfTtcblxuICAgIF9wcm90bzIuZ2V0QnlJZCA9IGZ1bmN0aW9uIGdldEJ5SWQoaWQpIHtcbiAgICAgIHZhciBhbmltYXRpb25zID0gdGhpcy5nZXRDaGlsZHJlbigxLCAxLCAxKSxcbiAgICAgICAgICBpID0gYW5pbWF0aW9ucy5sZW5ndGg7XG5cbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvbnNbaV0udmFycy5pZCA9PT0gaWQpIHtcbiAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uc1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBfcHJvdG8yLnJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZShjaGlsZCkge1xuICAgICAgaWYgKF9pc1N0cmluZyhjaGlsZCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlTGFiZWwoY2hpbGQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoX2lzRnVuY3Rpb24oY2hpbGQpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmtpbGxUd2VlbnNPZihjaGlsZCk7XG4gICAgICB9XG5cbiAgICAgIF9yZW1vdmVMaW5rZWRMaXN0SXRlbSh0aGlzLCBjaGlsZCk7XG5cbiAgICAgIGlmIChjaGlsZCA9PT0gdGhpcy5fcmVjZW50KSB7XG4gICAgICAgIHRoaXMuX3JlY2VudCA9IHRoaXMuX2xhc3Q7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfdW5jYWNoZSh0aGlzKTtcbiAgICB9O1xuXG4gICAgX3Byb3RvMi50b3RhbFRpbWUgPSBmdW5jdGlvbiB0b3RhbFRpbWUoX3RvdGFsVGltZTIsIHN1cHByZXNzRXZlbnRzKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RUaW1lO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9mb3JjaW5nID0gMTtcblxuICAgICAgaWYgKCF0aGlzLl9kcCAmJiB0aGlzLl90cykge1xuICAgICAgICB0aGlzLl9zdGFydCA9IF9yb3VuZFByZWNpc2UoX3RpY2tlci50aW1lIC0gKHRoaXMuX3RzID4gMCA/IF90b3RhbFRpbWUyIC8gdGhpcy5fdHMgOiAodGhpcy50b3RhbER1cmF0aW9uKCkgLSBfdG90YWxUaW1lMikgLyAtdGhpcy5fdHMpKTtcbiAgICAgIH1cblxuICAgICAgX0FuaW1hdGlvbi5wcm90b3R5cGUudG90YWxUaW1lLmNhbGwodGhpcywgX3RvdGFsVGltZTIsIHN1cHByZXNzRXZlbnRzKTtcblxuICAgICAgdGhpcy5fZm9yY2luZyA9IDA7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgX3Byb3RvMi5hZGRMYWJlbCA9IGZ1bmN0aW9uIGFkZExhYmVsKGxhYmVsLCBwb3NpdGlvbikge1xuICAgICAgdGhpcy5sYWJlbHNbbGFiZWxdID0gX3BhcnNlUG9zaXRpb24odGhpcywgcG9zaXRpb24pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIF9wcm90bzIucmVtb3ZlTGFiZWwgPSBmdW5jdGlvbiByZW1vdmVMYWJlbChsYWJlbCkge1xuICAgICAgZGVsZXRlIHRoaXMubGFiZWxzW2xhYmVsXTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBfcHJvdG8yLmFkZFBhdXNlID0gZnVuY3Rpb24gYWRkUGF1c2UocG9zaXRpb24sIGNhbGxiYWNrLCBwYXJhbXMpIHtcbiAgICAgIHZhciB0ID0gVHdlZW4uZGVsYXllZENhbGwoMCwgY2FsbGJhY2sgfHwgX2VtcHR5RnVuYywgcGFyYW1zKTtcbiAgICAgIHQuZGF0YSA9IFwiaXNQYXVzZVwiO1xuICAgICAgdGhpcy5faGFzUGF1c2UgPSAxO1xuICAgICAgcmV0dXJuIF9hZGRUb1RpbWVsaW5lKHRoaXMsIHQsIF9wYXJzZVBvc2l0aW9uKHRoaXMsIHBvc2l0aW9uKSk7XG4gICAgfTtcblxuICAgIF9wcm90bzIucmVtb3ZlUGF1c2UgPSBmdW5jdGlvbiByZW1vdmVQYXVzZShwb3NpdGlvbikge1xuICAgICAgdmFyIGNoaWxkID0gdGhpcy5fZmlyc3Q7XG4gICAgICBwb3NpdGlvbiA9IF9wYXJzZVBvc2l0aW9uKHRoaXMsIHBvc2l0aW9uKTtcblxuICAgICAgd2hpbGUgKGNoaWxkKSB7XG4gICAgICAgIGlmIChjaGlsZC5fc3RhcnQgPT09IHBvc2l0aW9uICYmIGNoaWxkLmRhdGEgPT09IFwiaXNQYXVzZVwiKSB7XG4gICAgICAgICAgX3JlbW92ZUZyb21QYXJlbnQoY2hpbGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2hpbGQgPSBjaGlsZC5fbmV4dDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3Byb3RvMi5raWxsVHdlZW5zT2YgPSBmdW5jdGlvbiBraWxsVHdlZW5zT2YodGFyZ2V0cywgcHJvcHMsIG9ubHlBY3RpdmUpIHtcbiAgICAgIHZhciB0d2VlbnMgPSB0aGlzLmdldFR3ZWVuc09mKHRhcmdldHMsIG9ubHlBY3RpdmUpLFxuICAgICAgICAgIGkgPSB0d2VlbnMubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIF9vdmVyd3JpdGluZ1R3ZWVuICE9PSB0d2VlbnNbaV0gJiYgdHdlZW5zW2ldLmtpbGwodGFyZ2V0cywgcHJvcHMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgX3Byb3RvMi5nZXRUd2VlbnNPZiA9IGZ1bmN0aW9uIGdldFR3ZWVuc09mKHRhcmdldHMsIG9ubHlBY3RpdmUpIHtcbiAgICAgIHZhciBhID0gW10sXG4gICAgICAgICAgcGFyc2VkVGFyZ2V0cyA9IHRvQXJyYXkodGFyZ2V0cyksXG4gICAgICAgICAgY2hpbGQgPSB0aGlzLl9maXJzdCxcbiAgICAgICAgICBpc0dsb2JhbFRpbWUgPSBfaXNOdW1iZXIob25seUFjdGl2ZSksXG4gICAgICAgICAgY2hpbGRyZW47XG5cbiAgICAgIHdoaWxlIChjaGlsZCkge1xuICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBUd2Vlbikge1xuICAgICAgICAgIGlmIChfYXJyYXlDb250YWluc0FueShjaGlsZC5fdGFyZ2V0cywgcGFyc2VkVGFyZ2V0cykgJiYgKGlzR2xvYmFsVGltZSA/ICghX292ZXJ3cml0aW5nVHdlZW4gfHwgY2hpbGQuX2luaXR0ZWQgJiYgY2hpbGQuX3RzKSAmJiBjaGlsZC5nbG9iYWxUaW1lKDApIDw9IG9ubHlBY3RpdmUgJiYgY2hpbGQuZ2xvYmFsVGltZShjaGlsZC50b3RhbER1cmF0aW9uKCkpID4gb25seUFjdGl2ZSA6ICFvbmx5QWN0aXZlIHx8IGNoaWxkLmlzQWN0aXZlKCkpKSB7XG4gICAgICAgICAgICBhLnB1c2goY2hpbGQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgoY2hpbGRyZW4gPSBjaGlsZC5nZXRUd2VlbnNPZihwYXJzZWRUYXJnZXRzLCBvbmx5QWN0aXZlKSkubGVuZ3RoKSB7XG4gICAgICAgICAgYS5wdXNoLmFwcGx5KGEsIGNoaWxkcmVuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoaWxkID0gY2hpbGQuX25leHQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhO1xuICAgIH07XG5cbiAgICBfcHJvdG8yLnR3ZWVuVG8gPSBmdW5jdGlvbiB0d2VlblRvKHBvc2l0aW9uLCB2YXJzKSB7XG4gICAgICB2YXJzID0gdmFycyB8fCB7fTtcblxuICAgICAgdmFyIHRsID0gdGhpcyxcbiAgICAgICAgICBlbmRUaW1lID0gX3BhcnNlUG9zaXRpb24odGwsIHBvc2l0aW9uKSxcbiAgICAgICAgICBfdmFycyA9IHZhcnMsXG4gICAgICAgICAgc3RhcnRBdCA9IF92YXJzLnN0YXJ0QXQsXG4gICAgICAgICAgX29uU3RhcnQgPSBfdmFycy5vblN0YXJ0LFxuICAgICAgICAgIG9uU3RhcnRQYXJhbXMgPSBfdmFycy5vblN0YXJ0UGFyYW1zLFxuICAgICAgICAgIGltbWVkaWF0ZVJlbmRlciA9IF92YXJzLmltbWVkaWF0ZVJlbmRlcixcbiAgICAgICAgICBpbml0dGVkLFxuICAgICAgICAgIHR3ZWVuID0gVHdlZW4udG8odGwsIF9zZXREZWZhdWx0cyh7XG4gICAgICAgIGVhc2U6IHZhcnMuZWFzZSB8fCBcIm5vbmVcIixcbiAgICAgICAgbGF6eTogZmFsc2UsXG4gICAgICAgIGltbWVkaWF0ZVJlbmRlcjogZmFsc2UsXG4gICAgICAgIHRpbWU6IGVuZFRpbWUsXG4gICAgICAgIG92ZXJ3cml0ZTogXCJhdXRvXCIsXG4gICAgICAgIGR1cmF0aW9uOiB2YXJzLmR1cmF0aW9uIHx8IE1hdGguYWJzKChlbmRUaW1lIC0gKHN0YXJ0QXQgJiYgXCJ0aW1lXCIgaW4gc3RhcnRBdCA/IHN0YXJ0QXQudGltZSA6IHRsLl90aW1lKSkgLyB0bC50aW1lU2NhbGUoKSkgfHwgX3RpbnlOdW0sXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uIG9uU3RhcnQoKSB7XG4gICAgICAgICAgdGwucGF1c2UoKTtcblxuICAgICAgICAgIGlmICghaW5pdHRlZCkge1xuICAgICAgICAgICAgdmFyIGR1cmF0aW9uID0gdmFycy5kdXJhdGlvbiB8fCBNYXRoLmFicygoZW5kVGltZSAtIChzdGFydEF0ICYmIFwidGltZVwiIGluIHN0YXJ0QXQgPyBzdGFydEF0LnRpbWUgOiB0bC5fdGltZSkpIC8gdGwudGltZVNjYWxlKCkpO1xuICAgICAgICAgICAgdHdlZW4uX2R1ciAhPT0gZHVyYXRpb24gJiYgX3NldER1cmF0aW9uKHR3ZWVuLCBkdXJhdGlvbiwgMCwgMSkucmVuZGVyKHR3ZWVuLl90aW1lLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICAgIGluaXR0ZWQgPSAxO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIF9vblN0YXJ0ICYmIF9vblN0YXJ0LmFwcGx5KHR3ZWVuLCBvblN0YXJ0UGFyYW1zIHx8IFtdKTtcbiAgICAgICAgfVxuICAgICAgfSwgdmFycykpO1xuXG4gICAgICByZXR1cm4gaW1tZWRpYXRlUmVuZGVyID8gdHdlZW4ucmVuZGVyKDApIDogdHdlZW47XG4gICAgfTtcblxuICAgIF9wcm90bzIudHdlZW5Gcm9tVG8gPSBmdW5jdGlvbiB0d2VlbkZyb21Ubyhmcm9tUG9zaXRpb24sIHRvUG9zaXRpb24sIHZhcnMpIHtcbiAgICAgIHJldHVybiB0aGlzLnR3ZWVuVG8odG9Qb3NpdGlvbiwgX3NldERlZmF1bHRzKHtcbiAgICAgICAgc3RhcnRBdDoge1xuICAgICAgICAgIHRpbWU6IF9wYXJzZVBvc2l0aW9uKHRoaXMsIGZyb21Qb3NpdGlvbilcbiAgICAgICAgfVxuICAgICAgfSwgdmFycykpO1xuICAgIH07XG5cbiAgICBfcHJvdG8yLnJlY2VudCA9IGZ1bmN0aW9uIHJlY2VudCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZWNlbnQ7XG4gICAgfTtcblxuICAgIF9wcm90bzIubmV4dExhYmVsID0gZnVuY3Rpb24gbmV4dExhYmVsKGFmdGVyVGltZSkge1xuICAgICAgaWYgKGFmdGVyVGltZSA9PT0gdm9pZCAwKSB7XG4gICAgICAgIGFmdGVyVGltZSA9IHRoaXMuX3RpbWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfZ2V0TGFiZWxJbkRpcmVjdGlvbih0aGlzLCBfcGFyc2VQb3NpdGlvbih0aGlzLCBhZnRlclRpbWUpKTtcbiAgICB9O1xuXG4gICAgX3Byb3RvMi5wcmV2aW91c0xhYmVsID0gZnVuY3Rpb24gcHJldmlvdXNMYWJlbChiZWZvcmVUaW1lKSB7XG4gICAgICBpZiAoYmVmb3JlVGltZSA9PT0gdm9pZCAwKSB7XG4gICAgICAgIGJlZm9yZVRpbWUgPSB0aGlzLl90aW1lO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gX2dldExhYmVsSW5EaXJlY3Rpb24odGhpcywgX3BhcnNlUG9zaXRpb24odGhpcywgYmVmb3JlVGltZSksIDEpO1xuICAgIH07XG5cbiAgICBfcHJvdG8yLmN1cnJlbnRMYWJlbCA9IGZ1bmN0aW9uIGN1cnJlbnRMYWJlbCh2YWx1ZSkge1xuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyB0aGlzLnNlZWsodmFsdWUsIHRydWUpIDogdGhpcy5wcmV2aW91c0xhYmVsKHRoaXMuX3RpbWUgKyBfdGlueU51bSk7XG4gICAgfTtcblxuICAgIF9wcm90bzIuc2hpZnRDaGlsZHJlbiA9IGZ1bmN0aW9uIHNoaWZ0Q2hpbGRyZW4oYW1vdW50LCBhZGp1c3RMYWJlbHMsIGlnbm9yZUJlZm9yZVRpbWUpIHtcbiAgICAgIGlmIChpZ25vcmVCZWZvcmVUaW1lID09PSB2b2lkIDApIHtcbiAgICAgICAgaWdub3JlQmVmb3JlVGltZSA9IDA7XG4gICAgICB9XG5cbiAgICAgIHZhciBjaGlsZCA9IHRoaXMuX2ZpcnN0LFxuICAgICAgICAgIGxhYmVscyA9IHRoaXMubGFiZWxzLFxuICAgICAgICAgIHA7XG5cbiAgICAgIHdoaWxlIChjaGlsZCkge1xuICAgICAgICBpZiAoY2hpbGQuX3N0YXJ0ID49IGlnbm9yZUJlZm9yZVRpbWUpIHtcbiAgICAgICAgICBjaGlsZC5fc3RhcnQgKz0gYW1vdW50O1xuICAgICAgICAgIGNoaWxkLl9lbmQgKz0gYW1vdW50O1xuICAgICAgICB9XG5cbiAgICAgICAgY2hpbGQgPSBjaGlsZC5fbmV4dDtcbiAgICAgIH1cblxuICAgICAgaWYgKGFkanVzdExhYmVscykge1xuICAgICAgICBmb3IgKHAgaW4gbGFiZWxzKSB7XG4gICAgICAgICAgaWYgKGxhYmVsc1twXSA+PSBpZ25vcmVCZWZvcmVUaW1lKSB7XG4gICAgICAgICAgICBsYWJlbHNbcF0gKz0gYW1vdW50O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gX3VuY2FjaGUodGhpcyk7XG4gICAgfTtcblxuICAgIF9wcm90bzIuaW52YWxpZGF0ZSA9IGZ1bmN0aW9uIGludmFsaWRhdGUoKSB7XG4gICAgICB2YXIgY2hpbGQgPSB0aGlzLl9maXJzdDtcbiAgICAgIHRoaXMuX2xvY2sgPSAwO1xuXG4gICAgICB3aGlsZSAoY2hpbGQpIHtcbiAgICAgICAgY2hpbGQuaW52YWxpZGF0ZSgpO1xuICAgICAgICBjaGlsZCA9IGNoaWxkLl9uZXh0O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gX0FuaW1hdGlvbi5wcm90b3R5cGUuaW52YWxpZGF0ZS5jYWxsKHRoaXMpO1xuICAgIH07XG5cbiAgICBfcHJvdG8yLmNsZWFyID0gZnVuY3Rpb24gY2xlYXIoaW5jbHVkZUxhYmVscykge1xuICAgICAgaWYgKGluY2x1ZGVMYWJlbHMgPT09IHZvaWQgMCkge1xuICAgICAgICBpbmNsdWRlTGFiZWxzID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNoaWxkID0gdGhpcy5fZmlyc3QsXG4gICAgICAgICAgbmV4dDtcblxuICAgICAgd2hpbGUgKGNoaWxkKSB7XG4gICAgICAgIG5leHQgPSBjaGlsZC5fbmV4dDtcbiAgICAgICAgdGhpcy5yZW1vdmUoY2hpbGQpO1xuICAgICAgICBjaGlsZCA9IG5leHQ7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2RwICYmICh0aGlzLl90aW1lID0gdGhpcy5fdFRpbWUgPSB0aGlzLl9wVGltZSA9IDApO1xuICAgICAgaW5jbHVkZUxhYmVscyAmJiAodGhpcy5sYWJlbHMgPSB7fSk7XG4gICAgICByZXR1cm4gX3VuY2FjaGUodGhpcyk7XG4gICAgfTtcblxuICAgIF9wcm90bzIudG90YWxEdXJhdGlvbiA9IGZ1bmN0aW9uIHRvdGFsRHVyYXRpb24odmFsdWUpIHtcbiAgICAgIHZhciBtYXggPSAwLFxuICAgICAgICAgIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIGNoaWxkID0gc2VsZi5fbGFzdCxcbiAgICAgICAgICBwcmV2U3RhcnQgPSBfYmlnTnVtLFxuICAgICAgICAgIHByZXYsXG4gICAgICAgICAgc3RhcnQsXG4gICAgICAgICAgcGFyZW50O1xuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gc2VsZi50aW1lU2NhbGUoKHNlbGYuX3JlcGVhdCA8IDAgPyBzZWxmLmR1cmF0aW9uKCkgOiBzZWxmLnRvdGFsRHVyYXRpb24oKSkgLyAoc2VsZi5yZXZlcnNlZCgpID8gLXZhbHVlIDogdmFsdWUpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNlbGYuX2RpcnR5KSB7XG4gICAgICAgIHBhcmVudCA9IHNlbGYucGFyZW50O1xuXG4gICAgICAgIHdoaWxlIChjaGlsZCkge1xuICAgICAgICAgIHByZXYgPSBjaGlsZC5fcHJldjtcbiAgICAgICAgICBjaGlsZC5fZGlydHkgJiYgY2hpbGQudG90YWxEdXJhdGlvbigpO1xuICAgICAgICAgIHN0YXJ0ID0gY2hpbGQuX3N0YXJ0O1xuXG4gICAgICAgICAgaWYgKHN0YXJ0ID4gcHJldlN0YXJ0ICYmIHNlbGYuX3NvcnQgJiYgY2hpbGQuX3RzICYmICFzZWxmLl9sb2NrKSB7XG4gICAgICAgICAgICBzZWxmLl9sb2NrID0gMTtcbiAgICAgICAgICAgIF9hZGRUb1RpbWVsaW5lKHNlbGYsIGNoaWxkLCBzdGFydCAtIGNoaWxkLl9kZWxheSwgMSkuX2xvY2sgPSAwO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcmV2U3RhcnQgPSBzdGFydDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc3RhcnQgPCAwICYmIGNoaWxkLl90cykge1xuICAgICAgICAgICAgbWF4IC09IHN0YXJ0O1xuXG4gICAgICAgICAgICBpZiAoIXBhcmVudCAmJiAhc2VsZi5fZHAgfHwgcGFyZW50ICYmIHBhcmVudC5zbW9vdGhDaGlsZFRpbWluZykge1xuICAgICAgICAgICAgICBzZWxmLl9zdGFydCArPSBzdGFydCAvIHNlbGYuX3RzO1xuICAgICAgICAgICAgICBzZWxmLl90aW1lIC09IHN0YXJ0O1xuICAgICAgICAgICAgICBzZWxmLl90VGltZSAtPSBzdGFydDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5zaGlmdENoaWxkcmVuKC1zdGFydCwgZmFsc2UsIC0xZTk5OSk7XG4gICAgICAgICAgICBwcmV2U3RhcnQgPSAwO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNoaWxkLl9lbmQgPiBtYXggJiYgY2hpbGQuX3RzICYmIChtYXggPSBjaGlsZC5fZW5kKTtcbiAgICAgICAgICBjaGlsZCA9IHByZXY7XG4gICAgICAgIH1cblxuICAgICAgICBfc2V0RHVyYXRpb24oc2VsZiwgc2VsZiA9PT0gX2dsb2JhbFRpbWVsaW5lICYmIHNlbGYuX3RpbWUgPiBtYXggPyBzZWxmLl90aW1lIDogbWF4LCAxLCAxKTtcblxuICAgICAgICBzZWxmLl9kaXJ0eSA9IDA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzZWxmLl90RHVyO1xuICAgIH07XG5cbiAgICBUaW1lbGluZS51cGRhdGVSb290ID0gZnVuY3Rpb24gdXBkYXRlUm9vdCh0aW1lKSB7XG4gICAgICBpZiAoX2dsb2JhbFRpbWVsaW5lLl90cykge1xuICAgICAgICBfbGF6eVNhZmVSZW5kZXIoX2dsb2JhbFRpbWVsaW5lLCBfcGFyZW50VG9DaGlsZFRvdGFsVGltZSh0aW1lLCBfZ2xvYmFsVGltZWxpbmUpKTtcblxuICAgICAgICBfbGFzdFJlbmRlcmVkRnJhbWUgPSBfdGlja2VyLmZyYW1lO1xuICAgICAgfVxuXG4gICAgICBpZiAoX3RpY2tlci5mcmFtZSA+PSBfbmV4dEdDRnJhbWUpIHtcbiAgICAgICAgX25leHRHQ0ZyYW1lICs9IF9jb25maWcuYXV0b1NsZWVwIHx8IDEyMDtcbiAgICAgICAgdmFyIGNoaWxkID0gX2dsb2JhbFRpbWVsaW5lLl9maXJzdDtcbiAgICAgICAgaWYgKCFjaGlsZCB8fCAhY2hpbGQuX3RzKSBpZiAoX2NvbmZpZy5hdXRvU2xlZXAgJiYgX3RpY2tlci5fbGlzdGVuZXJzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICB3aGlsZSAoY2hpbGQgJiYgIWNoaWxkLl90cykge1xuICAgICAgICAgICAgY2hpbGQgPSBjaGlsZC5fbmV4dDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjaGlsZCB8fCBfdGlja2VyLnNsZWVwKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIFRpbWVsaW5lO1xuICB9KEFuaW1hdGlvbik7XG5cbiAgX3NldERlZmF1bHRzKFRpbWVsaW5lLnByb3RvdHlwZSwge1xuICAgIF9sb2NrOiAwLFxuICAgIF9oYXNQYXVzZTogMCxcbiAgICBfZm9yY2luZzogMFxuICB9KTtcblxuICB2YXIgX2FkZENvbXBsZXhTdHJpbmdQcm9wVHdlZW4gPSBmdW5jdGlvbiBfYWRkQ29tcGxleFN0cmluZ1Byb3BUd2Vlbih0YXJnZXQsIHByb3AsIHN0YXJ0LCBlbmQsIHNldHRlciwgc3RyaW5nRmlsdGVyLCBmdW5jUGFyYW0pIHtcbiAgICB2YXIgcHQgPSBuZXcgUHJvcFR3ZWVuKHRoaXMuX3B0LCB0YXJnZXQsIHByb3AsIDAsIDEsIF9yZW5kZXJDb21wbGV4U3RyaW5nLCBudWxsLCBzZXR0ZXIpLFxuICAgICAgICBpbmRleCA9IDAsXG4gICAgICAgIG1hdGNoSW5kZXggPSAwLFxuICAgICAgICByZXN1bHQsXG4gICAgICAgIHN0YXJ0TnVtcyxcbiAgICAgICAgY29sb3IsXG4gICAgICAgIGVuZE51bSxcbiAgICAgICAgY2h1bmssXG4gICAgICAgIHN0YXJ0TnVtLFxuICAgICAgICBoYXNSYW5kb20sXG4gICAgICAgIGE7XG4gICAgcHQuYiA9IHN0YXJ0O1xuICAgIHB0LmUgPSBlbmQ7XG4gICAgc3RhcnQgKz0gXCJcIjtcbiAgICBlbmQgKz0gXCJcIjtcblxuICAgIGlmIChoYXNSYW5kb20gPSB+ZW5kLmluZGV4T2YoXCJyYW5kb20oXCIpKSB7XG4gICAgICBlbmQgPSBfcmVwbGFjZVJhbmRvbShlbmQpO1xuICAgIH1cblxuICAgIGlmIChzdHJpbmdGaWx0ZXIpIHtcbiAgICAgIGEgPSBbc3RhcnQsIGVuZF07XG4gICAgICBzdHJpbmdGaWx0ZXIoYSwgdGFyZ2V0LCBwcm9wKTtcbiAgICAgIHN0YXJ0ID0gYVswXTtcbiAgICAgIGVuZCA9IGFbMV07XG4gICAgfVxuXG4gICAgc3RhcnROdW1zID0gc3RhcnQubWF0Y2goX2NvbXBsZXhTdHJpbmdOdW1FeHApIHx8IFtdO1xuXG4gICAgd2hpbGUgKHJlc3VsdCA9IF9jb21wbGV4U3RyaW5nTnVtRXhwLmV4ZWMoZW5kKSkge1xuICAgICAgZW5kTnVtID0gcmVzdWx0WzBdO1xuICAgICAgY2h1bmsgPSBlbmQuc3Vic3RyaW5nKGluZGV4LCByZXN1bHQuaW5kZXgpO1xuXG4gICAgICBpZiAoY29sb3IpIHtcbiAgICAgICAgY29sb3IgPSAoY29sb3IgKyAxKSAlIDU7XG4gICAgICB9IGVsc2UgaWYgKGNodW5rLnN1YnN0cigtNSkgPT09IFwicmdiYShcIikge1xuICAgICAgICBjb2xvciA9IDE7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbmROdW0gIT09IHN0YXJ0TnVtc1ttYXRjaEluZGV4KytdKSB7XG4gICAgICAgIHN0YXJ0TnVtID0gcGFyc2VGbG9hdChzdGFydE51bXNbbWF0Y2hJbmRleCAtIDFdKSB8fCAwO1xuICAgICAgICBwdC5fcHQgPSB7XG4gICAgICAgICAgX25leHQ6IHB0Ll9wdCxcbiAgICAgICAgICBwOiBjaHVuayB8fCBtYXRjaEluZGV4ID09PSAxID8gY2h1bmsgOiBcIixcIixcbiAgICAgICAgICBzOiBzdGFydE51bSxcbiAgICAgICAgICBjOiBlbmROdW0uY2hhckF0KDEpID09PSBcIj1cIiA/IF9wYXJzZVJlbGF0aXZlKHN0YXJ0TnVtLCBlbmROdW0pIC0gc3RhcnROdW0gOiBwYXJzZUZsb2F0KGVuZE51bSkgLSBzdGFydE51bSxcbiAgICAgICAgICBtOiBjb2xvciAmJiBjb2xvciA8IDQgPyBNYXRoLnJvdW5kIDogMFxuICAgICAgICB9O1xuICAgICAgICBpbmRleCA9IF9jb21wbGV4U3RyaW5nTnVtRXhwLmxhc3RJbmRleDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwdC5jID0gaW5kZXggPCBlbmQubGVuZ3RoID8gZW5kLnN1YnN0cmluZyhpbmRleCwgZW5kLmxlbmd0aCkgOiBcIlwiO1xuICAgIHB0LmZwID0gZnVuY1BhcmFtO1xuXG4gICAgaWYgKF9yZWxFeHAudGVzdChlbmQpIHx8IGhhc1JhbmRvbSkge1xuICAgICAgcHQuZSA9IDA7XG4gICAgfVxuXG4gICAgdGhpcy5fcHQgPSBwdDtcbiAgICByZXR1cm4gcHQ7XG4gIH0sXG4gICAgICBfYWRkUHJvcFR3ZWVuID0gZnVuY3Rpb24gX2FkZFByb3BUd2Vlbih0YXJnZXQsIHByb3AsIHN0YXJ0LCBlbmQsIGluZGV4LCB0YXJnZXRzLCBtb2RpZmllciwgc3RyaW5nRmlsdGVyLCBmdW5jUGFyYW0pIHtcbiAgICBfaXNGdW5jdGlvbihlbmQpICYmIChlbmQgPSBlbmQoaW5kZXggfHwgMCwgdGFyZ2V0LCB0YXJnZXRzKSk7XG4gICAgdmFyIGN1cnJlbnRWYWx1ZSA9IHRhcmdldFtwcm9wXSxcbiAgICAgICAgcGFyc2VkU3RhcnQgPSBzdGFydCAhPT0gXCJnZXRcIiA/IHN0YXJ0IDogIV9pc0Z1bmN0aW9uKGN1cnJlbnRWYWx1ZSkgPyBjdXJyZW50VmFsdWUgOiBmdW5jUGFyYW0gPyB0YXJnZXRbcHJvcC5pbmRleE9mKFwic2V0XCIpIHx8ICFfaXNGdW5jdGlvbih0YXJnZXRbXCJnZXRcIiArIHByb3Auc3Vic3RyKDMpXSkgPyBwcm9wIDogXCJnZXRcIiArIHByb3Auc3Vic3RyKDMpXShmdW5jUGFyYW0pIDogdGFyZ2V0W3Byb3BdKCksXG4gICAgICAgIHNldHRlciA9ICFfaXNGdW5jdGlvbihjdXJyZW50VmFsdWUpID8gX3NldHRlclBsYWluIDogZnVuY1BhcmFtID8gX3NldHRlckZ1bmNXaXRoUGFyYW0gOiBfc2V0dGVyRnVuYyxcbiAgICAgICAgcHQ7XG5cbiAgICBpZiAoX2lzU3RyaW5nKGVuZCkpIHtcbiAgICAgIGlmICh+ZW5kLmluZGV4T2YoXCJyYW5kb20oXCIpKSB7XG4gICAgICAgIGVuZCA9IF9yZXBsYWNlUmFuZG9tKGVuZCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbmQuY2hhckF0KDEpID09PSBcIj1cIikge1xuICAgICAgICBwdCA9IF9wYXJzZVJlbGF0aXZlKHBhcnNlZFN0YXJ0LCBlbmQpICsgKGdldFVuaXQocGFyc2VkU3RhcnQpIHx8IDApO1xuXG4gICAgICAgIGlmIChwdCB8fCBwdCA9PT0gMCkge1xuICAgICAgICAgIGVuZCA9IHB0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBhcnNlZFN0YXJ0ICE9PSBlbmQgfHwgX2ZvcmNlQWxsUHJvcFR3ZWVucykge1xuICAgICAgaWYgKCFpc05hTihwYXJzZWRTdGFydCAqIGVuZCkgJiYgZW5kICE9PSBcIlwiKSB7XG4gICAgICAgIHB0ID0gbmV3IFByb3BUd2Vlbih0aGlzLl9wdCwgdGFyZ2V0LCBwcm9wLCArcGFyc2VkU3RhcnQgfHwgMCwgZW5kIC0gKHBhcnNlZFN0YXJ0IHx8IDApLCB0eXBlb2YgY3VycmVudFZhbHVlID09PSBcImJvb2xlYW5cIiA/IF9yZW5kZXJCb29sZWFuIDogX3JlbmRlclBsYWluLCAwLCBzZXR0ZXIpO1xuICAgICAgICBmdW5jUGFyYW0gJiYgKHB0LmZwID0gZnVuY1BhcmFtKTtcbiAgICAgICAgbW9kaWZpZXIgJiYgcHQubW9kaWZpZXIobW9kaWZpZXIsIHRoaXMsIHRhcmdldCk7XG4gICAgICAgIHJldHVybiB0aGlzLl9wdCA9IHB0O1xuICAgICAgfVxuXG4gICAgICAhY3VycmVudFZhbHVlICYmICEocHJvcCBpbiB0YXJnZXQpICYmIF9taXNzaW5nUGx1Z2luKHByb3AsIGVuZCk7XG4gICAgICByZXR1cm4gX2FkZENvbXBsZXhTdHJpbmdQcm9wVHdlZW4uY2FsbCh0aGlzLCB0YXJnZXQsIHByb3AsIHBhcnNlZFN0YXJ0LCBlbmQsIHNldHRlciwgc3RyaW5nRmlsdGVyIHx8IF9jb25maWcuc3RyaW5nRmlsdGVyLCBmdW5jUGFyYW0pO1xuICAgIH1cbiAgfSxcbiAgICAgIF9wcm9jZXNzVmFycyA9IGZ1bmN0aW9uIF9wcm9jZXNzVmFycyh2YXJzLCBpbmRleCwgdGFyZ2V0LCB0YXJnZXRzLCB0d2Vlbikge1xuICAgIF9pc0Z1bmN0aW9uKHZhcnMpICYmICh2YXJzID0gX3BhcnNlRnVuY09yU3RyaW5nKHZhcnMsIHR3ZWVuLCBpbmRleCwgdGFyZ2V0LCB0YXJnZXRzKSk7XG5cbiAgICBpZiAoIV9pc09iamVjdCh2YXJzKSB8fCB2YXJzLnN0eWxlICYmIHZhcnMubm9kZVR5cGUgfHwgX2lzQXJyYXkodmFycykgfHwgX2lzVHlwZWRBcnJheSh2YXJzKSkge1xuICAgICAgcmV0dXJuIF9pc1N0cmluZyh2YXJzKSA/IF9wYXJzZUZ1bmNPclN0cmluZyh2YXJzLCB0d2VlbiwgaW5kZXgsIHRhcmdldCwgdGFyZ2V0cykgOiB2YXJzO1xuICAgIH1cblxuICAgIHZhciBjb3B5ID0ge30sXG4gICAgICAgIHA7XG5cbiAgICBmb3IgKHAgaW4gdmFycykge1xuICAgICAgY29weVtwXSA9IF9wYXJzZUZ1bmNPclN0cmluZyh2YXJzW3BdLCB0d2VlbiwgaW5kZXgsIHRhcmdldCwgdGFyZ2V0cyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvcHk7XG4gIH0sXG4gICAgICBfY2hlY2tQbHVnaW4gPSBmdW5jdGlvbiBfY2hlY2tQbHVnaW4ocHJvcGVydHksIHZhcnMsIHR3ZWVuLCBpbmRleCwgdGFyZ2V0LCB0YXJnZXRzKSB7XG4gICAgdmFyIHBsdWdpbiwgcHQsIHB0TG9va3VwLCBpO1xuXG4gICAgaWYgKF9wbHVnaW5zW3Byb3BlcnR5XSAmJiAocGx1Z2luID0gbmV3IF9wbHVnaW5zW3Byb3BlcnR5XSgpKS5pbml0KHRhcmdldCwgcGx1Z2luLnJhd1ZhcnMgPyB2YXJzW3Byb3BlcnR5XSA6IF9wcm9jZXNzVmFycyh2YXJzW3Byb3BlcnR5XSwgaW5kZXgsIHRhcmdldCwgdGFyZ2V0cywgdHdlZW4pLCB0d2VlbiwgaW5kZXgsIHRhcmdldHMpICE9PSBmYWxzZSkge1xuICAgICAgdHdlZW4uX3B0ID0gcHQgPSBuZXcgUHJvcFR3ZWVuKHR3ZWVuLl9wdCwgdGFyZ2V0LCBwcm9wZXJ0eSwgMCwgMSwgcGx1Z2luLnJlbmRlciwgcGx1Z2luLCAwLCBwbHVnaW4ucHJpb3JpdHkpO1xuXG4gICAgICBpZiAodHdlZW4gIT09IF9xdWlja1R3ZWVuKSB7XG4gICAgICAgIHB0TG9va3VwID0gdHdlZW4uX3B0TG9va3VwW3R3ZWVuLl90YXJnZXRzLmluZGV4T2YodGFyZ2V0KV07XG4gICAgICAgIGkgPSBwbHVnaW4uX3Byb3BzLmxlbmd0aDtcblxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgcHRMb29rdXBbcGx1Z2luLl9wcm9wc1tpXV0gPSBwdDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwbHVnaW47XG4gIH0sXG4gICAgICBfb3ZlcndyaXRpbmdUd2VlbixcbiAgICAgIF9mb3JjZUFsbFByb3BUd2VlbnMsXG4gICAgICBfaW5pdFR3ZWVuID0gZnVuY3Rpb24gX2luaXRUd2Vlbih0d2VlbiwgdGltZSkge1xuICAgIHZhciB2YXJzID0gdHdlZW4udmFycyxcbiAgICAgICAgZWFzZSA9IHZhcnMuZWFzZSxcbiAgICAgICAgc3RhcnRBdCA9IHZhcnMuc3RhcnRBdCxcbiAgICAgICAgaW1tZWRpYXRlUmVuZGVyID0gdmFycy5pbW1lZGlhdGVSZW5kZXIsXG4gICAgICAgIGxhenkgPSB2YXJzLmxhenksXG4gICAgICAgIG9uVXBkYXRlID0gdmFycy5vblVwZGF0ZSxcbiAgICAgICAgb25VcGRhdGVQYXJhbXMgPSB2YXJzLm9uVXBkYXRlUGFyYW1zLFxuICAgICAgICBjYWxsYmFja1Njb3BlID0gdmFycy5jYWxsYmFja1Njb3BlLFxuICAgICAgICBydW5CYWNrd2FyZHMgPSB2YXJzLnJ1bkJhY2t3YXJkcyxcbiAgICAgICAgeW95b0Vhc2UgPSB2YXJzLnlveW9FYXNlLFxuICAgICAgICBrZXlmcmFtZXMgPSB2YXJzLmtleWZyYW1lcyxcbiAgICAgICAgYXV0b1JldmVydCA9IHZhcnMuYXV0b1JldmVydCxcbiAgICAgICAgZHVyID0gdHdlZW4uX2R1cixcbiAgICAgICAgcHJldlN0YXJ0QXQgPSB0d2Vlbi5fc3RhcnRBdCxcbiAgICAgICAgdGFyZ2V0cyA9IHR3ZWVuLl90YXJnZXRzLFxuICAgICAgICBwYXJlbnQgPSB0d2Vlbi5wYXJlbnQsXG4gICAgICAgIGZ1bGxUYXJnZXRzID0gcGFyZW50ICYmIHBhcmVudC5kYXRhID09PSBcIm5lc3RlZFwiID8gcGFyZW50LnBhcmVudC5fdGFyZ2V0cyA6IHRhcmdldHMsXG4gICAgICAgIGF1dG9PdmVyd3JpdGUgPSB0d2Vlbi5fb3ZlcndyaXRlID09PSBcImF1dG9cIiAmJiAhX3N1cHByZXNzT3ZlcndyaXRlcyxcbiAgICAgICAgdGwgPSB0d2Vlbi50aW1lbGluZSxcbiAgICAgICAgY2xlYW5WYXJzLFxuICAgICAgICBpLFxuICAgICAgICBwLFxuICAgICAgICBwdCxcbiAgICAgICAgdGFyZ2V0LFxuICAgICAgICBoYXNQcmlvcml0eSxcbiAgICAgICAgZ3NEYXRhLFxuICAgICAgICBoYXJuZXNzLFxuICAgICAgICBwbHVnaW4sXG4gICAgICAgIHB0TG9va3VwLFxuICAgICAgICBpbmRleCxcbiAgICAgICAgaGFybmVzc1ZhcnMsXG4gICAgICAgIG92ZXJ3cml0dGVuO1xuICAgIHRsICYmICgha2V5ZnJhbWVzIHx8ICFlYXNlKSAmJiAoZWFzZSA9IFwibm9uZVwiKTtcbiAgICB0d2Vlbi5fZWFzZSA9IF9wYXJzZUVhc2UoZWFzZSwgX2RlZmF1bHRzLmVhc2UpO1xuICAgIHR3ZWVuLl95RWFzZSA9IHlveW9FYXNlID8gX2ludmVydEVhc2UoX3BhcnNlRWFzZSh5b3lvRWFzZSA9PT0gdHJ1ZSA/IGVhc2UgOiB5b3lvRWFzZSwgX2RlZmF1bHRzLmVhc2UpKSA6IDA7XG5cbiAgICBpZiAoeW95b0Vhc2UgJiYgdHdlZW4uX3lveW8gJiYgIXR3ZWVuLl9yZXBlYXQpIHtcbiAgICAgIHlveW9FYXNlID0gdHdlZW4uX3lFYXNlO1xuICAgICAgdHdlZW4uX3lFYXNlID0gdHdlZW4uX2Vhc2U7XG4gICAgICB0d2Vlbi5fZWFzZSA9IHlveW9FYXNlO1xuICAgIH1cblxuICAgIHR3ZWVuLl9mcm9tID0gIXRsICYmICEhdmFycy5ydW5CYWNrd2FyZHM7XG5cbiAgICBpZiAoIXRsIHx8IGtleWZyYW1lcyAmJiAhdmFycy5zdGFnZ2VyKSB7XG4gICAgICBoYXJuZXNzID0gdGFyZ2V0c1swXSA/IF9nZXRDYWNoZSh0YXJnZXRzWzBdKS5oYXJuZXNzIDogMDtcbiAgICAgIGhhcm5lc3NWYXJzID0gaGFybmVzcyAmJiB2YXJzW2hhcm5lc3MucHJvcF07XG4gICAgICBjbGVhblZhcnMgPSBfY29weUV4Y2x1ZGluZyh2YXJzLCBfcmVzZXJ2ZWRQcm9wcyk7XG5cbiAgICAgIGlmIChwcmV2U3RhcnRBdCkge1xuICAgICAgICBfcmVtb3ZlRnJvbVBhcmVudChwcmV2U3RhcnRBdC5yZW5kZXIoLTEsIHRydWUpKTtcblxuICAgICAgICBwcmV2U3RhcnRBdC5fbGF6eSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGFydEF0KSB7XG4gICAgICAgIF9yZW1vdmVGcm9tUGFyZW50KHR3ZWVuLl9zdGFydEF0ID0gVHdlZW4uc2V0KHRhcmdldHMsIF9zZXREZWZhdWx0cyh7XG4gICAgICAgICAgZGF0YTogXCJpc1N0YXJ0XCIsXG4gICAgICAgICAgb3ZlcndyaXRlOiBmYWxzZSxcbiAgICAgICAgICBwYXJlbnQ6IHBhcmVudCxcbiAgICAgICAgICBpbW1lZGlhdGVSZW5kZXI6IHRydWUsXG4gICAgICAgICAgbGF6eTogX2lzTm90RmFsc2UobGF6eSksXG4gICAgICAgICAgc3RhcnRBdDogbnVsbCxcbiAgICAgICAgICBkZWxheTogMCxcbiAgICAgICAgICBvblVwZGF0ZTogb25VcGRhdGUsXG4gICAgICAgICAgb25VcGRhdGVQYXJhbXM6IG9uVXBkYXRlUGFyYW1zLFxuICAgICAgICAgIGNhbGxiYWNrU2NvcGU6IGNhbGxiYWNrU2NvcGUsXG4gICAgICAgICAgc3RhZ2dlcjogMFxuICAgICAgICB9LCBzdGFydEF0KSkpO1xuXG4gICAgICAgIHRpbWUgPCAwICYmICFpbW1lZGlhdGVSZW5kZXIgJiYgIWF1dG9SZXZlcnQgJiYgdHdlZW4uX3N0YXJ0QXQucmVuZGVyKC0xLCB0cnVlKTtcblxuICAgICAgICBpZiAoaW1tZWRpYXRlUmVuZGVyKSB7XG4gICAgICAgICAgdGltZSA+IDAgJiYgIWF1dG9SZXZlcnQgJiYgKHR3ZWVuLl9zdGFydEF0ID0gMCk7XG5cbiAgICAgICAgICBpZiAoZHVyICYmIHRpbWUgPD0gMCkge1xuICAgICAgICAgICAgdGltZSAmJiAodHdlZW4uX3pUaW1lID0gdGltZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGF1dG9SZXZlcnQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgdHdlZW4uX3N0YXJ0QXQgPSAwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHJ1bkJhY2t3YXJkcyAmJiBkdXIpIHtcbiAgICAgICAgaWYgKHByZXZTdGFydEF0KSB7XG4gICAgICAgICAgIWF1dG9SZXZlcnQgJiYgKHR3ZWVuLl9zdGFydEF0ID0gMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGltZSAmJiAoaW1tZWRpYXRlUmVuZGVyID0gZmFsc2UpO1xuICAgICAgICAgIHAgPSBfc2V0RGVmYXVsdHMoe1xuICAgICAgICAgICAgb3ZlcndyaXRlOiBmYWxzZSxcbiAgICAgICAgICAgIGRhdGE6IFwiaXNGcm9tU3RhcnRcIixcbiAgICAgICAgICAgIGxhenk6IGltbWVkaWF0ZVJlbmRlciAmJiBfaXNOb3RGYWxzZShsYXp5KSxcbiAgICAgICAgICAgIGltbWVkaWF0ZVJlbmRlcjogaW1tZWRpYXRlUmVuZGVyLFxuICAgICAgICAgICAgc3RhZ2dlcjogMCxcbiAgICAgICAgICAgIHBhcmVudDogcGFyZW50XG4gICAgICAgICAgfSwgY2xlYW5WYXJzKTtcbiAgICAgICAgICBoYXJuZXNzVmFycyAmJiAocFtoYXJuZXNzLnByb3BdID0gaGFybmVzc1ZhcnMpO1xuXG4gICAgICAgICAgX3JlbW92ZUZyb21QYXJlbnQodHdlZW4uX3N0YXJ0QXQgPSBUd2Vlbi5zZXQodGFyZ2V0cywgcCkpO1xuXG4gICAgICAgICAgdGltZSA8IDAgJiYgdHdlZW4uX3N0YXJ0QXQucmVuZGVyKC0xLCB0cnVlKTtcbiAgICAgICAgICB0d2Vlbi5felRpbWUgPSB0aW1lO1xuXG4gICAgICAgICAgaWYgKCFpbW1lZGlhdGVSZW5kZXIpIHtcbiAgICAgICAgICAgIF9pbml0VHdlZW4odHdlZW4uX3N0YXJ0QXQsIF90aW55TnVtKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCF0aW1lKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHR3ZWVuLl9wdCA9IHR3ZWVuLl9wdENhY2hlID0gMDtcbiAgICAgIGxhenkgPSBkdXIgJiYgX2lzTm90RmFsc2UobGF6eSkgfHwgbGF6eSAmJiAhZHVyO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgdGFyZ2V0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0YXJnZXQgPSB0YXJnZXRzW2ldO1xuICAgICAgICBnc0RhdGEgPSB0YXJnZXQuX2dzYXAgfHwgX2hhcm5lc3ModGFyZ2V0cylbaV0uX2dzYXA7XG4gICAgICAgIHR3ZWVuLl9wdExvb2t1cFtpXSA9IHB0TG9va3VwID0ge307XG4gICAgICAgIF9sYXp5TG9va3VwW2dzRGF0YS5pZF0gJiYgX2xhenlUd2VlbnMubGVuZ3RoICYmIF9sYXp5UmVuZGVyKCk7XG4gICAgICAgIGluZGV4ID0gZnVsbFRhcmdldHMgPT09IHRhcmdldHMgPyBpIDogZnVsbFRhcmdldHMuaW5kZXhPZih0YXJnZXQpO1xuXG4gICAgICAgIGlmIChoYXJuZXNzICYmIChwbHVnaW4gPSBuZXcgaGFybmVzcygpKS5pbml0KHRhcmdldCwgaGFybmVzc1ZhcnMgfHwgY2xlYW5WYXJzLCB0d2VlbiwgaW5kZXgsIGZ1bGxUYXJnZXRzKSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICB0d2Vlbi5fcHQgPSBwdCA9IG5ldyBQcm9wVHdlZW4odHdlZW4uX3B0LCB0YXJnZXQsIHBsdWdpbi5uYW1lLCAwLCAxLCBwbHVnaW4ucmVuZGVyLCBwbHVnaW4sIDAsIHBsdWdpbi5wcmlvcml0eSk7XG5cbiAgICAgICAgICBwbHVnaW4uX3Byb3BzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHB0TG9va3VwW25hbWVdID0gcHQ7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBwbHVnaW4ucHJpb3JpdHkgJiYgKGhhc1ByaW9yaXR5ID0gMSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWhhcm5lc3MgfHwgaGFybmVzc1ZhcnMpIHtcbiAgICAgICAgICBmb3IgKHAgaW4gY2xlYW5WYXJzKSB7XG4gICAgICAgICAgICBpZiAoX3BsdWdpbnNbcF0gJiYgKHBsdWdpbiA9IF9jaGVja1BsdWdpbihwLCBjbGVhblZhcnMsIHR3ZWVuLCBpbmRleCwgdGFyZ2V0LCBmdWxsVGFyZ2V0cykpKSB7XG4gICAgICAgICAgICAgIHBsdWdpbi5wcmlvcml0eSAmJiAoaGFzUHJpb3JpdHkgPSAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHB0TG9va3VwW3BdID0gcHQgPSBfYWRkUHJvcFR3ZWVuLmNhbGwodHdlZW4sIHRhcmdldCwgcCwgXCJnZXRcIiwgY2xlYW5WYXJzW3BdLCBpbmRleCwgZnVsbFRhcmdldHMsIDAsIHZhcnMuc3RyaW5nRmlsdGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0d2Vlbi5fb3AgJiYgdHdlZW4uX29wW2ldICYmIHR3ZWVuLmtpbGwodGFyZ2V0LCB0d2Vlbi5fb3BbaV0pO1xuXG4gICAgICAgIGlmIChhdXRvT3ZlcndyaXRlICYmIHR3ZWVuLl9wdCkge1xuICAgICAgICAgIF9vdmVyd3JpdGluZ1R3ZWVuID0gdHdlZW47XG5cbiAgICAgICAgICBfZ2xvYmFsVGltZWxpbmUua2lsbFR3ZWVuc09mKHRhcmdldCwgcHRMb29rdXAsIHR3ZWVuLmdsb2JhbFRpbWUodGltZSkpO1xuXG4gICAgICAgICAgb3ZlcndyaXR0ZW4gPSAhdHdlZW4ucGFyZW50O1xuICAgICAgICAgIF9vdmVyd3JpdGluZ1R3ZWVuID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHR3ZWVuLl9wdCAmJiBsYXp5ICYmIChfbGF6eUxvb2t1cFtnc0RhdGEuaWRdID0gMSk7XG4gICAgICB9XG5cbiAgICAgIGhhc1ByaW9yaXR5ICYmIF9zb3J0UHJvcFR3ZWVuc0J5UHJpb3JpdHkodHdlZW4pO1xuICAgICAgdHdlZW4uX29uSW5pdCAmJiB0d2Vlbi5fb25Jbml0KHR3ZWVuKTtcbiAgICB9XG5cbiAgICB0d2Vlbi5fb25VcGRhdGUgPSBvblVwZGF0ZTtcbiAgICB0d2Vlbi5faW5pdHRlZCA9ICghdHdlZW4uX29wIHx8IHR3ZWVuLl9wdCkgJiYgIW92ZXJ3cml0dGVuO1xuICAgIGtleWZyYW1lcyAmJiB0aW1lIDw9IDAgJiYgdGwucmVuZGVyKF9iaWdOdW0sIHRydWUsIHRydWUpO1xuICB9LFxuICAgICAgX3VwZGF0ZVByb3BUd2VlbnMgPSBmdW5jdGlvbiBfdXBkYXRlUHJvcFR3ZWVucyh0d2VlbiwgcHJvcGVydHksIHZhbHVlLCBzdGFydCwgc3RhcnRJc1JlbGF0aXZlLCByYXRpbywgdGltZSkge1xuICAgIHZhciBwdENhY2hlID0gKHR3ZWVuLl9wdCAmJiB0d2Vlbi5fcHRDYWNoZSB8fCAodHdlZW4uX3B0Q2FjaGUgPSB7fSkpW3Byb3BlcnR5XSxcbiAgICAgICAgcHQsXG4gICAgICAgIGxvb2t1cCxcbiAgICAgICAgaTtcblxuICAgIGlmICghcHRDYWNoZSkge1xuICAgICAgcHRDYWNoZSA9IHR3ZWVuLl9wdENhY2hlW3Byb3BlcnR5XSA9IFtdO1xuICAgICAgbG9va3VwID0gdHdlZW4uX3B0TG9va3VwO1xuICAgICAgaSA9IHR3ZWVuLl90YXJnZXRzLmxlbmd0aDtcblxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICBwdCA9IGxvb2t1cFtpXVtwcm9wZXJ0eV07XG5cbiAgICAgICAgaWYgKHB0ICYmIHB0LmQgJiYgcHQuZC5fcHQpIHtcbiAgICAgICAgICBwdCA9IHB0LmQuX3B0O1xuXG4gICAgICAgICAgd2hpbGUgKHB0ICYmIHB0LnAgIT09IHByb3BlcnR5KSB7XG4gICAgICAgICAgICBwdCA9IHB0Ll9uZXh0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcHQpIHtcbiAgICAgICAgICBfZm9yY2VBbGxQcm9wVHdlZW5zID0gMTtcbiAgICAgICAgICB0d2Vlbi52YXJzW3Byb3BlcnR5XSA9IFwiKz0wXCI7XG5cbiAgICAgICAgICBfaW5pdFR3ZWVuKHR3ZWVuLCB0aW1lKTtcblxuICAgICAgICAgIF9mb3JjZUFsbFByb3BUd2VlbnMgPSAwO1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcHRDYWNoZS5wdXNoKHB0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpID0gcHRDYWNoZS5sZW5ndGg7XG5cbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBwdCA9IHB0Q2FjaGVbaV07XG4gICAgICBwdC5zID0gKHN0YXJ0IHx8IHN0YXJ0ID09PSAwKSAmJiAhc3RhcnRJc1JlbGF0aXZlID8gc3RhcnQgOiBwdC5zICsgKHN0YXJ0IHx8IDApICsgcmF0aW8gKiBwdC5jO1xuICAgICAgcHQuYyA9IHZhbHVlIC0gcHQucztcbiAgICAgIHB0LmUgJiYgKHB0LmUgPSBfcm91bmQodmFsdWUpICsgZ2V0VW5pdChwdC5lKSk7XG4gICAgICBwdC5iICYmIChwdC5iID0gcHQucyArIGdldFVuaXQocHQuYikpO1xuICAgIH1cbiAgfSxcbiAgICAgIF9hZGRBbGlhc2VzVG9WYXJzID0gZnVuY3Rpb24gX2FkZEFsaWFzZXNUb1ZhcnModGFyZ2V0cywgdmFycykge1xuICAgIHZhciBoYXJuZXNzID0gdGFyZ2V0c1swXSA/IF9nZXRDYWNoZSh0YXJnZXRzWzBdKS5oYXJuZXNzIDogMCxcbiAgICAgICAgcHJvcGVydHlBbGlhc2VzID0gaGFybmVzcyAmJiBoYXJuZXNzLmFsaWFzZXMsXG4gICAgICAgIGNvcHksXG4gICAgICAgIHAsXG4gICAgICAgIGksXG4gICAgICAgIGFsaWFzZXM7XG5cbiAgICBpZiAoIXByb3BlcnR5QWxpYXNlcykge1xuICAgICAgcmV0dXJuIHZhcnM7XG4gICAgfVxuXG4gICAgY29weSA9IF9tZXJnZSh7fSwgdmFycyk7XG5cbiAgICBmb3IgKHAgaW4gcHJvcGVydHlBbGlhc2VzKSB7XG4gICAgICBpZiAocCBpbiBjb3B5KSB7XG4gICAgICAgIGFsaWFzZXMgPSBwcm9wZXJ0eUFsaWFzZXNbcF0uc3BsaXQoXCIsXCIpO1xuICAgICAgICBpID0gYWxpYXNlcy5sZW5ndGg7XG5cbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgIGNvcHlbYWxpYXNlc1tpXV0gPSBjb3B5W3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvcHk7XG4gIH0sXG4gICAgICBfcGFyc2VLZXlmcmFtZSA9IGZ1bmN0aW9uIF9wYXJzZUtleWZyYW1lKHByb3AsIG9iaiwgYWxsUHJvcHMsIGVhc2VFYWNoKSB7XG4gICAgdmFyIGVhc2UgPSBvYmouZWFzZSB8fCBlYXNlRWFjaCB8fCBcInBvd2VyMS5pbk91dFwiLFxuICAgICAgICBwLFxuICAgICAgICBhO1xuXG4gICAgaWYgKF9pc0FycmF5KG9iaikpIHtcbiAgICAgIGEgPSBhbGxQcm9wc1twcm9wXSB8fCAoYWxsUHJvcHNbcHJvcF0gPSBbXSk7XG4gICAgICBvYmouZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGkpIHtcbiAgICAgICAgcmV0dXJuIGEucHVzaCh7XG4gICAgICAgICAgdDogaSAvIChvYmoubGVuZ3RoIC0gMSkgKiAxMDAsXG4gICAgICAgICAgdjogdmFsdWUsXG4gICAgICAgICAgZTogZWFzZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHAgaW4gb2JqKSB7XG4gICAgICAgIGEgPSBhbGxQcm9wc1twXSB8fCAoYWxsUHJvcHNbcF0gPSBbXSk7XG4gICAgICAgIHAgPT09IFwiZWFzZVwiIHx8IGEucHVzaCh7XG4gICAgICAgICAgdDogcGFyc2VGbG9hdChwcm9wKSxcbiAgICAgICAgICB2OiBvYmpbcF0sXG4gICAgICAgICAgZTogZWFzZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gICAgICBfcGFyc2VGdW5jT3JTdHJpbmcgPSBmdW5jdGlvbiBfcGFyc2VGdW5jT3JTdHJpbmcodmFsdWUsIHR3ZWVuLCBpLCB0YXJnZXQsIHRhcmdldHMpIHtcbiAgICByZXR1cm4gX2lzRnVuY3Rpb24odmFsdWUpID8gdmFsdWUuY2FsbCh0d2VlbiwgaSwgdGFyZ2V0LCB0YXJnZXRzKSA6IF9pc1N0cmluZyh2YWx1ZSkgJiYgfnZhbHVlLmluZGV4T2YoXCJyYW5kb20oXCIpID8gX3JlcGxhY2VSYW5kb20odmFsdWUpIDogdmFsdWU7XG4gIH0sXG4gICAgICBfc3RhZ2dlclR3ZWVuUHJvcHMgPSBfY2FsbGJhY2tOYW1lcyArIFwicmVwZWF0LHJlcGVhdERlbGF5LHlveW8scmVwZWF0UmVmcmVzaCx5b3lvRWFzZSxhdXRvUmV2ZXJ0XCIsXG4gICAgICBfc3RhZ2dlclByb3BzVG9Ta2lwID0ge307XG5cbiAgX2ZvckVhY2hOYW1lKF9zdGFnZ2VyVHdlZW5Qcm9wcyArIFwiLGlkLHN0YWdnZXIsZGVsYXksZHVyYXRpb24scGF1c2VkLHNjcm9sbFRyaWdnZXJcIiwgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICByZXR1cm4gX3N0YWdnZXJQcm9wc1RvU2tpcFtuYW1lXSA9IDE7XG4gIH0pO1xuXG4gIHZhciBUd2VlbiA9IGZ1bmN0aW9uIChfQW5pbWF0aW9uMikge1xuICAgIF9pbmhlcml0c0xvb3NlKFR3ZWVuLCBfQW5pbWF0aW9uMik7XG5cbiAgICBmdW5jdGlvbiBUd2Vlbih0YXJnZXRzLCB2YXJzLCBwb3NpdGlvbiwgc2tpcEluaGVyaXQpIHtcbiAgICAgIHZhciBfdGhpczM7XG5cbiAgICAgIGlmICh0eXBlb2YgdmFycyA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICBwb3NpdGlvbi5kdXJhdGlvbiA9IHZhcnM7XG4gICAgICAgIHZhcnMgPSBwb3NpdGlvbjtcbiAgICAgICAgcG9zaXRpb24gPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBfdGhpczMgPSBfQW5pbWF0aW9uMi5jYWxsKHRoaXMsIHNraXBJbmhlcml0ID8gdmFycyA6IF9pbmhlcml0RGVmYXVsdHModmFycykpIHx8IHRoaXM7XG4gICAgICB2YXIgX3RoaXMzJHZhcnMgPSBfdGhpczMudmFycyxcbiAgICAgICAgICBkdXJhdGlvbiA9IF90aGlzMyR2YXJzLmR1cmF0aW9uLFxuICAgICAgICAgIGRlbGF5ID0gX3RoaXMzJHZhcnMuZGVsYXksXG4gICAgICAgICAgaW1tZWRpYXRlUmVuZGVyID0gX3RoaXMzJHZhcnMuaW1tZWRpYXRlUmVuZGVyLFxuICAgICAgICAgIHN0YWdnZXIgPSBfdGhpczMkdmFycy5zdGFnZ2VyLFxuICAgICAgICAgIG92ZXJ3cml0ZSA9IF90aGlzMyR2YXJzLm92ZXJ3cml0ZSxcbiAgICAgICAgICBrZXlmcmFtZXMgPSBfdGhpczMkdmFycy5rZXlmcmFtZXMsXG4gICAgICAgICAgZGVmYXVsdHMgPSBfdGhpczMkdmFycy5kZWZhdWx0cyxcbiAgICAgICAgICBzY3JvbGxUcmlnZ2VyID0gX3RoaXMzJHZhcnMuc2Nyb2xsVHJpZ2dlcixcbiAgICAgICAgICB5b3lvRWFzZSA9IF90aGlzMyR2YXJzLnlveW9FYXNlLFxuICAgICAgICAgIHBhcmVudCA9IHZhcnMucGFyZW50IHx8IF9nbG9iYWxUaW1lbGluZSxcbiAgICAgICAgICBwYXJzZWRUYXJnZXRzID0gKF9pc0FycmF5KHRhcmdldHMpIHx8IF9pc1R5cGVkQXJyYXkodGFyZ2V0cykgPyBfaXNOdW1iZXIodGFyZ2V0c1swXSkgOiBcImxlbmd0aFwiIGluIHZhcnMpID8gW3RhcmdldHNdIDogdG9BcnJheSh0YXJnZXRzKSxcbiAgICAgICAgICB0bCxcbiAgICAgICAgICBpLFxuICAgICAgICAgIGNvcHksXG4gICAgICAgICAgbCxcbiAgICAgICAgICBwLFxuICAgICAgICAgIGN1clRhcmdldCxcbiAgICAgICAgICBzdGFnZ2VyRnVuYyxcbiAgICAgICAgICBzdGFnZ2VyVmFyc1RvTWVyZ2U7XG4gICAgICBfdGhpczMuX3RhcmdldHMgPSBwYXJzZWRUYXJnZXRzLmxlbmd0aCA/IF9oYXJuZXNzKHBhcnNlZFRhcmdldHMpIDogX3dhcm4oXCJHU0FQIHRhcmdldCBcIiArIHRhcmdldHMgKyBcIiBub3QgZm91bmQuIGh0dHBzOi8vZ3JlZW5zb2NrLmNvbVwiLCAhX2NvbmZpZy5udWxsVGFyZ2V0V2FybikgfHwgW107XG4gICAgICBfdGhpczMuX3B0TG9va3VwID0gW107XG4gICAgICBfdGhpczMuX292ZXJ3cml0ZSA9IG92ZXJ3cml0ZTtcblxuICAgICAgaWYgKGtleWZyYW1lcyB8fCBzdGFnZ2VyIHx8IF9pc0Z1bmNPclN0cmluZyhkdXJhdGlvbikgfHwgX2lzRnVuY09yU3RyaW5nKGRlbGF5KSkge1xuICAgICAgICB2YXJzID0gX3RoaXMzLnZhcnM7XG4gICAgICAgIHRsID0gX3RoaXMzLnRpbWVsaW5lID0gbmV3IFRpbWVsaW5lKHtcbiAgICAgICAgICBkYXRhOiBcIm5lc3RlZFwiLFxuICAgICAgICAgIGRlZmF1bHRzOiBkZWZhdWx0cyB8fCB7fVxuICAgICAgICB9KTtcbiAgICAgICAgdGwua2lsbCgpO1xuICAgICAgICB0bC5wYXJlbnQgPSB0bC5fZHAgPSBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzMyk7XG4gICAgICAgIHRsLl9zdGFydCA9IDA7XG5cbiAgICAgICAgaWYgKHN0YWdnZXIgfHwgX2lzRnVuY09yU3RyaW5nKGR1cmF0aW9uKSB8fCBfaXNGdW5jT3JTdHJpbmcoZGVsYXkpKSB7XG4gICAgICAgICAgbCA9IHBhcnNlZFRhcmdldHMubGVuZ3RoO1xuICAgICAgICAgIHN0YWdnZXJGdW5jID0gc3RhZ2dlciAmJiBkaXN0cmlidXRlKHN0YWdnZXIpO1xuXG4gICAgICAgICAgaWYgKF9pc09iamVjdChzdGFnZ2VyKSkge1xuICAgICAgICAgICAgZm9yIChwIGluIHN0YWdnZXIpIHtcbiAgICAgICAgICAgICAgaWYgKH5fc3RhZ2dlclR3ZWVuUHJvcHMuaW5kZXhPZihwKSkge1xuICAgICAgICAgICAgICAgIHN0YWdnZXJWYXJzVG9NZXJnZSB8fCAoc3RhZ2dlclZhcnNUb01lcmdlID0ge30pO1xuICAgICAgICAgICAgICAgIHN0YWdnZXJWYXJzVG9NZXJnZVtwXSA9IHN0YWdnZXJbcF07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBjb3B5ID0gX2NvcHlFeGNsdWRpbmcodmFycywgX3N0YWdnZXJQcm9wc1RvU2tpcCk7XG4gICAgICAgICAgICBjb3B5LnN0YWdnZXIgPSAwO1xuICAgICAgICAgICAgeW95b0Vhc2UgJiYgKGNvcHkueW95b0Vhc2UgPSB5b3lvRWFzZSk7XG4gICAgICAgICAgICBzdGFnZ2VyVmFyc1RvTWVyZ2UgJiYgX21lcmdlKGNvcHksIHN0YWdnZXJWYXJzVG9NZXJnZSk7XG4gICAgICAgICAgICBjdXJUYXJnZXQgPSBwYXJzZWRUYXJnZXRzW2ldO1xuICAgICAgICAgICAgY29weS5kdXJhdGlvbiA9ICtfcGFyc2VGdW5jT3JTdHJpbmcoZHVyYXRpb24sIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMzKSwgaSwgY3VyVGFyZ2V0LCBwYXJzZWRUYXJnZXRzKTtcbiAgICAgICAgICAgIGNvcHkuZGVsYXkgPSAoK19wYXJzZUZ1bmNPclN0cmluZyhkZWxheSwgX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpczMpLCBpLCBjdXJUYXJnZXQsIHBhcnNlZFRhcmdldHMpIHx8IDApIC0gX3RoaXMzLl9kZWxheTtcblxuICAgICAgICAgICAgaWYgKCFzdGFnZ2VyICYmIGwgPT09IDEgJiYgY29weS5kZWxheSkge1xuICAgICAgICAgICAgICBfdGhpczMuX2RlbGF5ID0gZGVsYXkgPSBjb3B5LmRlbGF5O1xuICAgICAgICAgICAgICBfdGhpczMuX3N0YXJ0ICs9IGRlbGF5O1xuICAgICAgICAgICAgICBjb3B5LmRlbGF5ID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGwudG8oY3VyVGFyZ2V0LCBjb3B5LCBzdGFnZ2VyRnVuYyA/IHN0YWdnZXJGdW5jKGksIGN1clRhcmdldCwgcGFyc2VkVGFyZ2V0cykgOiAwKTtcbiAgICAgICAgICAgIHRsLl9lYXNlID0gX2Vhc2VNYXAubm9uZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0bC5kdXJhdGlvbigpID8gZHVyYXRpb24gPSBkZWxheSA9IDAgOiBfdGhpczMudGltZWxpbmUgPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKGtleWZyYW1lcykge1xuICAgICAgICAgIF9pbmhlcml0RGVmYXVsdHMoX3NldERlZmF1bHRzKHRsLnZhcnMuZGVmYXVsdHMsIHtcbiAgICAgICAgICAgIGVhc2U6IFwibm9uZVwiXG4gICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgdGwuX2Vhc2UgPSBfcGFyc2VFYXNlKGtleWZyYW1lcy5lYXNlIHx8IHZhcnMuZWFzZSB8fCBcIm5vbmVcIik7XG4gICAgICAgICAgdmFyIHRpbWUgPSAwLFxuICAgICAgICAgICAgICBhLFxuICAgICAgICAgICAgICBrZixcbiAgICAgICAgICAgICAgdjtcblxuICAgICAgICAgIGlmIChfaXNBcnJheShrZXlmcmFtZXMpKSB7XG4gICAgICAgICAgICBrZXlmcmFtZXMuZm9yRWFjaChmdW5jdGlvbiAoZnJhbWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRsLnRvKHBhcnNlZFRhcmdldHMsIGZyYW1lLCBcIj5cIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29weSA9IHt9O1xuXG4gICAgICAgICAgICBmb3IgKHAgaW4ga2V5ZnJhbWVzKSB7XG4gICAgICAgICAgICAgIHAgPT09IFwiZWFzZVwiIHx8IHAgPT09IFwiZWFzZUVhY2hcIiB8fCBfcGFyc2VLZXlmcmFtZShwLCBrZXlmcmFtZXNbcF0sIGNvcHksIGtleWZyYW1lcy5lYXNlRWFjaCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAocCBpbiBjb3B5KSB7XG4gICAgICAgICAgICAgIGEgPSBjb3B5W3BdLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS50IC0gYi50O1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgdGltZSA9IDA7XG5cbiAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBrZiA9IGFbaV07XG4gICAgICAgICAgICAgICAgdiA9IHtcbiAgICAgICAgICAgICAgICAgIGVhc2U6IGtmLmUsXG4gICAgICAgICAgICAgICAgICBkdXJhdGlvbjogKGtmLnQgLSAoaSA/IGFbaSAtIDFdLnQgOiAwKSkgLyAxMDAgKiBkdXJhdGlvblxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdltwXSA9IGtmLnY7XG4gICAgICAgICAgICAgICAgdGwudG8ocGFyc2VkVGFyZ2V0cywgdiwgdGltZSk7XG4gICAgICAgICAgICAgICAgdGltZSArPSB2LmR1cmF0aW9uO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRsLmR1cmF0aW9uKCkgPCBkdXJhdGlvbiAmJiB0bC50byh7fSwge1xuICAgICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24gLSB0bC5kdXJhdGlvbigpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBkdXJhdGlvbiB8fCBfdGhpczMuZHVyYXRpb24oZHVyYXRpb24gPSB0bC5kdXJhdGlvbigpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF90aGlzMy50aW1lbGluZSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChvdmVyd3JpdGUgPT09IHRydWUgJiYgIV9zdXBwcmVzc092ZXJ3cml0ZXMpIHtcbiAgICAgICAgX292ZXJ3cml0aW5nVHdlZW4gPSBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzMyk7XG5cbiAgICAgICAgX2dsb2JhbFRpbWVsaW5lLmtpbGxUd2VlbnNPZihwYXJzZWRUYXJnZXRzKTtcblxuICAgICAgICBfb3ZlcndyaXRpbmdUd2VlbiA9IDA7XG4gICAgICB9XG5cbiAgICAgIF9hZGRUb1RpbWVsaW5lKHBhcmVudCwgX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpczMpLCBwb3NpdGlvbik7XG5cbiAgICAgIHZhcnMucmV2ZXJzZWQgJiYgX3RoaXMzLnJldmVyc2UoKTtcbiAgICAgIHZhcnMucGF1c2VkICYmIF90aGlzMy5wYXVzZWQodHJ1ZSk7XG5cbiAgICAgIGlmIChpbW1lZGlhdGVSZW5kZXIgfHwgIWR1cmF0aW9uICYmICFrZXlmcmFtZXMgJiYgX3RoaXMzLl9zdGFydCA9PT0gX3JvdW5kUHJlY2lzZShwYXJlbnQuX3RpbWUpICYmIF9pc05vdEZhbHNlKGltbWVkaWF0ZVJlbmRlcikgJiYgX2hhc05vUGF1c2VkQW5jZXN0b3JzKF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMzKSkgJiYgcGFyZW50LmRhdGEgIT09IFwibmVzdGVkXCIpIHtcbiAgICAgICAgX3RoaXMzLl90VGltZSA9IC1fdGlueU51bTtcblxuICAgICAgICBfdGhpczMucmVuZGVyKE1hdGgubWF4KDAsIC1kZWxheSkpO1xuICAgICAgfVxuXG4gICAgICBzY3JvbGxUcmlnZ2VyICYmIF9zY3JvbGxUcmlnZ2VyKF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMzKSwgc2Nyb2xsVHJpZ2dlcik7XG4gICAgICByZXR1cm4gX3RoaXMzO1xuICAgIH1cblxuICAgIHZhciBfcHJvdG8zID0gVHdlZW4ucHJvdG90eXBlO1xuXG4gICAgX3Byb3RvMy5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIodG90YWxUaW1lLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpIHtcbiAgICAgIHZhciBwcmV2VGltZSA9IHRoaXMuX3RpbWUsXG4gICAgICAgICAgdER1ciA9IHRoaXMuX3REdXIsXG4gICAgICAgICAgZHVyID0gdGhpcy5fZHVyLFxuICAgICAgICAgIHRUaW1lID0gdG90YWxUaW1lID4gdER1ciAtIF90aW55TnVtICYmIHRvdGFsVGltZSA+PSAwID8gdER1ciA6IHRvdGFsVGltZSA8IF90aW55TnVtID8gMCA6IHRvdGFsVGltZSxcbiAgICAgICAgICB0aW1lLFxuICAgICAgICAgIHB0LFxuICAgICAgICAgIGl0ZXJhdGlvbixcbiAgICAgICAgICBjeWNsZUR1cmF0aW9uLFxuICAgICAgICAgIHByZXZJdGVyYXRpb24sXG4gICAgICAgICAgaXNZb3lvLFxuICAgICAgICAgIHJhdGlvLFxuICAgICAgICAgIHRpbWVsaW5lLFxuICAgICAgICAgIHlveW9FYXNlO1xuXG4gICAgICBpZiAoIWR1cikge1xuICAgICAgICBfcmVuZGVyWmVyb0R1cmF0aW9uVHdlZW4odGhpcywgdG90YWxUaW1lLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuICAgICAgfSBlbHNlIGlmICh0VGltZSAhPT0gdGhpcy5fdFRpbWUgfHwgIXRvdGFsVGltZSB8fCBmb3JjZSB8fCAhdGhpcy5faW5pdHRlZCAmJiB0aGlzLl90VGltZSB8fCB0aGlzLl9zdGFydEF0ICYmIHRoaXMuX3pUaW1lIDwgMCAhPT0gdG90YWxUaW1lIDwgMCkge1xuICAgICAgICB0aW1lID0gdFRpbWU7XG4gICAgICAgIHRpbWVsaW5lID0gdGhpcy50aW1lbGluZTtcblxuICAgICAgICBpZiAodGhpcy5fcmVwZWF0KSB7XG4gICAgICAgICAgY3ljbGVEdXJhdGlvbiA9IGR1ciArIHRoaXMuX3JEZWxheTtcblxuICAgICAgICAgIGlmICh0aGlzLl9yZXBlYXQgPCAtMSAmJiB0b3RhbFRpbWUgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b3RhbFRpbWUoY3ljbGVEdXJhdGlvbiAqIDEwMCArIHRvdGFsVGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aW1lID0gX3JvdW5kUHJlY2lzZSh0VGltZSAlIGN5Y2xlRHVyYXRpb24pO1xuXG4gICAgICAgICAgaWYgKHRUaW1lID09PSB0RHVyKSB7XG4gICAgICAgICAgICBpdGVyYXRpb24gPSB0aGlzLl9yZXBlYXQ7XG4gICAgICAgICAgICB0aW1lID0gZHVyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdGVyYXRpb24gPSB+fih0VGltZSAvIGN5Y2xlRHVyYXRpb24pO1xuXG4gICAgICAgICAgICBpZiAoaXRlcmF0aW9uICYmIGl0ZXJhdGlvbiA9PT0gdFRpbWUgLyBjeWNsZUR1cmF0aW9uKSB7XG4gICAgICAgICAgICAgIHRpbWUgPSBkdXI7XG4gICAgICAgICAgICAgIGl0ZXJhdGlvbi0tO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aW1lID4gZHVyICYmICh0aW1lID0gZHVyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpc1lveW8gPSB0aGlzLl95b3lvICYmIGl0ZXJhdGlvbiAmIDE7XG5cbiAgICAgICAgICBpZiAoaXNZb3lvKSB7XG4gICAgICAgICAgICB5b3lvRWFzZSA9IHRoaXMuX3lFYXNlO1xuICAgICAgICAgICAgdGltZSA9IGR1ciAtIHRpbWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcHJldkl0ZXJhdGlvbiA9IF9hbmltYXRpb25DeWNsZSh0aGlzLl90VGltZSwgY3ljbGVEdXJhdGlvbik7XG5cbiAgICAgICAgICBpZiAodGltZSA9PT0gcHJldlRpbWUgJiYgIWZvcmNlICYmIHRoaXMuX2luaXR0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3RUaW1lID0gdFRpbWU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaXRlcmF0aW9uICE9PSBwcmV2SXRlcmF0aW9uKSB7XG4gICAgICAgICAgICB0aW1lbGluZSAmJiB0aGlzLl95RWFzZSAmJiBfcHJvcGFnYXRlWW95b0Vhc2UodGltZWxpbmUsIGlzWW95byk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnZhcnMucmVwZWF0UmVmcmVzaCAmJiAhaXNZb3lvICYmICF0aGlzLl9sb2NrKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2xvY2sgPSBmb3JjZSA9IDE7XG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyKF9yb3VuZFByZWNpc2UoY3ljbGVEdXJhdGlvbiAqIGl0ZXJhdGlvbiksIHRydWUpLmludmFsaWRhdGUoKS5fbG9jayA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLl9pbml0dGVkKSB7XG4gICAgICAgICAgaWYgKF9hdHRlbXB0SW5pdFR3ZWVuKHRoaXMsIHRvdGFsVGltZSA8IDAgPyB0b3RhbFRpbWUgOiB0aW1lLCBmb3JjZSwgc3VwcHJlc3NFdmVudHMpKSB7XG4gICAgICAgICAgICB0aGlzLl90VGltZSA9IDA7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocHJldlRpbWUgIT09IHRoaXMuX3RpbWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChkdXIgIT09IHRoaXMuX2R1cikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKHRvdGFsVGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl90VGltZSA9IHRUaW1lO1xuICAgICAgICB0aGlzLl90aW1lID0gdGltZTtcblxuICAgICAgICBpZiAoIXRoaXMuX2FjdCAmJiB0aGlzLl90cykge1xuICAgICAgICAgIHRoaXMuX2FjdCA9IDE7XG4gICAgICAgICAgdGhpcy5fbGF6eSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJhdGlvID0gcmF0aW8gPSAoeW95b0Vhc2UgfHwgdGhpcy5fZWFzZSkodGltZSAvIGR1cik7XG5cbiAgICAgICAgaWYgKHRoaXMuX2Zyb20pIHtcbiAgICAgICAgICB0aGlzLnJhdGlvID0gcmF0aW8gPSAxIC0gcmF0aW87XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGltZSAmJiAhcHJldlRpbWUgJiYgIXN1cHByZXNzRXZlbnRzKSB7XG4gICAgICAgICAgX2NhbGxiYWNrKHRoaXMsIFwib25TdGFydFwiKTtcblxuICAgICAgICAgIGlmICh0aGlzLl90VGltZSAhPT0gdFRpbWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB0ID0gdGhpcy5fcHQ7XG5cbiAgICAgICAgd2hpbGUgKHB0KSB7XG4gICAgICAgICAgcHQucihyYXRpbywgcHQuZCk7XG4gICAgICAgICAgcHQgPSBwdC5fbmV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRpbWVsaW5lICYmIHRpbWVsaW5lLnJlbmRlcih0b3RhbFRpbWUgPCAwID8gdG90YWxUaW1lIDogIXRpbWUgJiYgaXNZb3lvID8gLV90aW55TnVtIDogdGltZWxpbmUuX2R1ciAqIHRpbWVsaW5lLl9lYXNlKHRpbWUgLyB0aGlzLl9kdXIpLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpIHx8IHRoaXMuX3N0YXJ0QXQgJiYgKHRoaXMuX3pUaW1lID0gdG90YWxUaW1lKTtcblxuICAgICAgICBpZiAodGhpcy5fb25VcGRhdGUgJiYgIXN1cHByZXNzRXZlbnRzKSB7XG4gICAgICAgICAgdG90YWxUaW1lIDwgMCAmJiB0aGlzLl9zdGFydEF0ICYmIHRoaXMuX3N0YXJ0QXQucmVuZGVyKHRvdGFsVGltZSwgdHJ1ZSwgZm9yY2UpO1xuXG4gICAgICAgICAgX2NhbGxiYWNrKHRoaXMsIFwib25VcGRhdGVcIik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9yZXBlYXQgJiYgaXRlcmF0aW9uICE9PSBwcmV2SXRlcmF0aW9uICYmIHRoaXMudmFycy5vblJlcGVhdCAmJiAhc3VwcHJlc3NFdmVudHMgJiYgdGhpcy5wYXJlbnQgJiYgX2NhbGxiYWNrKHRoaXMsIFwib25SZXBlYXRcIik7XG5cbiAgICAgICAgaWYgKCh0VGltZSA9PT0gdGhpcy5fdER1ciB8fCAhdFRpbWUpICYmIHRoaXMuX3RUaW1lID09PSB0VGltZSkge1xuICAgICAgICAgIHRvdGFsVGltZSA8IDAgJiYgdGhpcy5fc3RhcnRBdCAmJiAhdGhpcy5fb25VcGRhdGUgJiYgdGhpcy5fc3RhcnRBdC5yZW5kZXIodG90YWxUaW1lLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICAodG90YWxUaW1lIHx8ICFkdXIpICYmICh0VGltZSA9PT0gdGhpcy5fdER1ciAmJiB0aGlzLl90cyA+IDAgfHwgIXRUaW1lICYmIHRoaXMuX3RzIDwgMCkgJiYgX3JlbW92ZUZyb21QYXJlbnQodGhpcywgMSk7XG5cbiAgICAgICAgICBpZiAoIXN1cHByZXNzRXZlbnRzICYmICEodG90YWxUaW1lIDwgMCAmJiAhcHJldlRpbWUpICYmICh0VGltZSB8fCBwcmV2VGltZSkpIHtcbiAgICAgICAgICAgIF9jYWxsYmFjayh0aGlzLCB0VGltZSA9PT0gdER1ciA/IFwib25Db21wbGV0ZVwiIDogXCJvblJldmVyc2VDb21wbGV0ZVwiLCB0cnVlKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvbSAmJiAhKHRUaW1lIDwgdER1ciAmJiB0aGlzLnRpbWVTY2FsZSgpID4gMCkgJiYgdGhpcy5fcHJvbSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgX3Byb3RvMy50YXJnZXRzID0gZnVuY3Rpb24gdGFyZ2V0cygpIHtcbiAgICAgIHJldHVybiB0aGlzLl90YXJnZXRzO1xuICAgIH07XG5cbiAgICBfcHJvdG8zLmludmFsaWRhdGUgPSBmdW5jdGlvbiBpbnZhbGlkYXRlKCkge1xuICAgICAgdGhpcy5fcHQgPSB0aGlzLl9vcCA9IHRoaXMuX3N0YXJ0QXQgPSB0aGlzLl9vblVwZGF0ZSA9IHRoaXMuX2xhenkgPSB0aGlzLnJhdGlvID0gMDtcbiAgICAgIHRoaXMuX3B0TG9va3VwID0gW107XG4gICAgICB0aGlzLnRpbWVsaW5lICYmIHRoaXMudGltZWxpbmUuaW52YWxpZGF0ZSgpO1xuICAgICAgcmV0dXJuIF9BbmltYXRpb24yLnByb3RvdHlwZS5pbnZhbGlkYXRlLmNhbGwodGhpcyk7XG4gICAgfTtcblxuICAgIF9wcm90bzMucmVzZXRUbyA9IGZ1bmN0aW9uIHJlc2V0VG8ocHJvcGVydHksIHZhbHVlLCBzdGFydCwgc3RhcnRJc1JlbGF0aXZlKSB7XG4gICAgICBfdGlja2VyQWN0aXZlIHx8IF90aWNrZXIud2FrZSgpO1xuICAgICAgdGhpcy5fdHMgfHwgdGhpcy5wbGF5KCk7XG4gICAgICB2YXIgdGltZSA9IE1hdGgubWluKHRoaXMuX2R1ciwgKHRoaXMuX2RwLl90aW1lIC0gdGhpcy5fc3RhcnQpICogdGhpcy5fdHMpLFxuICAgICAgICAgIHJhdGlvO1xuICAgICAgdGhpcy5faW5pdHRlZCB8fCBfaW5pdFR3ZWVuKHRoaXMsIHRpbWUpO1xuICAgICAgcmF0aW8gPSB0aGlzLl9lYXNlKHRpbWUgLyB0aGlzLl9kdXIpO1xuXG4gICAgICBpZiAoX3VwZGF0ZVByb3BUd2VlbnModGhpcywgcHJvcGVydHksIHZhbHVlLCBzdGFydCwgc3RhcnRJc1JlbGF0aXZlLCByYXRpbywgdGltZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzZXRUbyhwcm9wZXJ0eSwgdmFsdWUsIHN0YXJ0LCBzdGFydElzUmVsYXRpdmUpO1xuICAgICAgfVxuXG4gICAgICBfYWxpZ25QbGF5aGVhZCh0aGlzLCAwKTtcblxuICAgICAgdGhpcy5wYXJlbnQgfHwgX2FkZExpbmtlZExpc3RJdGVtKHRoaXMuX2RwLCB0aGlzLCBcIl9maXJzdFwiLCBcIl9sYXN0XCIsIHRoaXMuX2RwLl9zb3J0ID8gXCJfc3RhcnRcIiA6IDApO1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKDApO1xuICAgIH07XG5cbiAgICBfcHJvdG8zLmtpbGwgPSBmdW5jdGlvbiBraWxsKHRhcmdldHMsIHZhcnMpIHtcbiAgICAgIGlmICh2YXJzID09PSB2b2lkIDApIHtcbiAgICAgICAgdmFycyA9IFwiYWxsXCI7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGFyZ2V0cyAmJiAoIXZhcnMgfHwgdmFycyA9PT0gXCJhbGxcIikpIHtcbiAgICAgICAgdGhpcy5fbGF6eSA9IHRoaXMuX3B0ID0gMDtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50ID8gX2ludGVycnVwdCh0aGlzKSA6IHRoaXM7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnRpbWVsaW5lKSB7XG4gICAgICAgIHZhciB0RHVyID0gdGhpcy50aW1lbGluZS50b3RhbER1cmF0aW9uKCk7XG4gICAgICAgIHRoaXMudGltZWxpbmUua2lsbFR3ZWVuc09mKHRhcmdldHMsIHZhcnMsIF9vdmVyd3JpdGluZ1R3ZWVuICYmIF9vdmVyd3JpdGluZ1R3ZWVuLnZhcnMub3ZlcndyaXRlICE9PSB0cnVlKS5fZmlyc3QgfHwgX2ludGVycnVwdCh0aGlzKTtcbiAgICAgICAgdGhpcy5wYXJlbnQgJiYgdER1ciAhPT0gdGhpcy50aW1lbGluZS50b3RhbER1cmF0aW9uKCkgJiYgX3NldER1cmF0aW9uKHRoaXMsIHRoaXMuX2R1ciAqIHRoaXMudGltZWxpbmUuX3REdXIgLyB0RHVyLCAwLCAxKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIHZhciBwYXJzZWRUYXJnZXRzID0gdGhpcy5fdGFyZ2V0cyxcbiAgICAgICAgICBraWxsaW5nVGFyZ2V0cyA9IHRhcmdldHMgPyB0b0FycmF5KHRhcmdldHMpIDogcGFyc2VkVGFyZ2V0cyxcbiAgICAgICAgICBwcm9wVHdlZW5Mb29rdXAgPSB0aGlzLl9wdExvb2t1cCxcbiAgICAgICAgICBmaXJzdFBUID0gdGhpcy5fcHQsXG4gICAgICAgICAgb3ZlcndyaXR0ZW5Qcm9wcyxcbiAgICAgICAgICBjdXJMb29rdXAsXG4gICAgICAgICAgY3VyT3ZlcndyaXRlUHJvcHMsXG4gICAgICAgICAgcHJvcHMsXG4gICAgICAgICAgcCxcbiAgICAgICAgICBwdCxcbiAgICAgICAgICBpO1xuXG4gICAgICBpZiAoKCF2YXJzIHx8IHZhcnMgPT09IFwiYWxsXCIpICYmIF9hcnJheXNNYXRjaChwYXJzZWRUYXJnZXRzLCBraWxsaW5nVGFyZ2V0cykpIHtcbiAgICAgICAgdmFycyA9PT0gXCJhbGxcIiAmJiAodGhpcy5fcHQgPSAwKTtcbiAgICAgICAgcmV0dXJuIF9pbnRlcnJ1cHQodGhpcyk7XG4gICAgICB9XG5cbiAgICAgIG92ZXJ3cml0dGVuUHJvcHMgPSB0aGlzLl9vcCA9IHRoaXMuX29wIHx8IFtdO1xuXG4gICAgICBpZiAodmFycyAhPT0gXCJhbGxcIikge1xuICAgICAgICBpZiAoX2lzU3RyaW5nKHZhcnMpKSB7XG4gICAgICAgICAgcCA9IHt9O1xuXG4gICAgICAgICAgX2ZvckVhY2hOYW1lKHZhcnMsIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gcFtuYW1lXSA9IDE7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB2YXJzID0gcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhcnMgPSBfYWRkQWxpYXNlc1RvVmFycyhwYXJzZWRUYXJnZXRzLCB2YXJzKTtcbiAgICAgIH1cblxuICAgICAgaSA9IHBhcnNlZFRhcmdldHMubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGlmICh+a2lsbGluZ1RhcmdldHMuaW5kZXhPZihwYXJzZWRUYXJnZXRzW2ldKSkge1xuICAgICAgICAgIGN1ckxvb2t1cCA9IHByb3BUd2Vlbkxvb2t1cFtpXTtcblxuICAgICAgICAgIGlmICh2YXJzID09PSBcImFsbFwiKSB7XG4gICAgICAgICAgICBvdmVyd3JpdHRlblByb3BzW2ldID0gdmFycztcbiAgICAgICAgICAgIHByb3BzID0gY3VyTG9va3VwO1xuICAgICAgICAgICAgY3VyT3ZlcndyaXRlUHJvcHMgPSB7fTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VyT3ZlcndyaXRlUHJvcHMgPSBvdmVyd3JpdHRlblByb3BzW2ldID0gb3ZlcndyaXR0ZW5Qcm9wc1tpXSB8fCB7fTtcbiAgICAgICAgICAgIHByb3BzID0gdmFycztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKHAgaW4gcHJvcHMpIHtcbiAgICAgICAgICAgIHB0ID0gY3VyTG9va3VwICYmIGN1ckxvb2t1cFtwXTtcblxuICAgICAgICAgICAgaWYgKHB0KSB7XG4gICAgICAgICAgICAgIGlmICghKFwia2lsbFwiIGluIHB0LmQpIHx8IHB0LmQua2lsbChwKSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIF9yZW1vdmVMaW5rZWRMaXN0SXRlbSh0aGlzLCBwdCwgXCJfcHRcIik7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBkZWxldGUgY3VyTG9va3VwW3BdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY3VyT3ZlcndyaXRlUHJvcHMgIT09IFwiYWxsXCIpIHtcbiAgICAgICAgICAgICAgY3VyT3ZlcndyaXRlUHJvcHNbcF0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9pbml0dGVkICYmICF0aGlzLl9wdCAmJiBmaXJzdFBUICYmIF9pbnRlcnJ1cHQodGhpcyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgVHdlZW4udG8gPSBmdW5jdGlvbiB0byh0YXJnZXRzLCB2YXJzKSB7XG4gICAgICByZXR1cm4gbmV3IFR3ZWVuKHRhcmdldHMsIHZhcnMsIGFyZ3VtZW50c1syXSk7XG4gICAgfTtcblxuICAgIFR3ZWVuLmZyb20gPSBmdW5jdGlvbiBmcm9tKHRhcmdldHMsIHZhcnMpIHtcbiAgICAgIHJldHVybiBfY3JlYXRlVHdlZW5UeXBlKDEsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIFR3ZWVuLmRlbGF5ZWRDYWxsID0gZnVuY3Rpb24gZGVsYXllZENhbGwoZGVsYXksIGNhbGxiYWNrLCBwYXJhbXMsIHNjb3BlKSB7XG4gICAgICByZXR1cm4gbmV3IFR3ZWVuKGNhbGxiYWNrLCAwLCB7XG4gICAgICAgIGltbWVkaWF0ZVJlbmRlcjogZmFsc2UsXG4gICAgICAgIGxhenk6IGZhbHNlLFxuICAgICAgICBvdmVyd3JpdGU6IGZhbHNlLFxuICAgICAgICBkZWxheTogZGVsYXksXG4gICAgICAgIG9uQ29tcGxldGU6IGNhbGxiYWNrLFxuICAgICAgICBvblJldmVyc2VDb21wbGV0ZTogY2FsbGJhY2ssXG4gICAgICAgIG9uQ29tcGxldGVQYXJhbXM6IHBhcmFtcyxcbiAgICAgICAgb25SZXZlcnNlQ29tcGxldGVQYXJhbXM6IHBhcmFtcyxcbiAgICAgICAgY2FsbGJhY2tTY29wZTogc2NvcGVcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBUd2Vlbi5mcm9tVG8gPSBmdW5jdGlvbiBmcm9tVG8odGFyZ2V0cywgZnJvbVZhcnMsIHRvVmFycykge1xuICAgICAgcmV0dXJuIF9jcmVhdGVUd2VlblR5cGUoMiwgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgVHdlZW4uc2V0ID0gZnVuY3Rpb24gc2V0KHRhcmdldHMsIHZhcnMpIHtcbiAgICAgIHZhcnMuZHVyYXRpb24gPSAwO1xuICAgICAgdmFycy5yZXBlYXREZWxheSB8fCAodmFycy5yZXBlYXQgPSAwKTtcbiAgICAgIHJldHVybiBuZXcgVHdlZW4odGFyZ2V0cywgdmFycyk7XG4gICAgfTtcblxuICAgIFR3ZWVuLmtpbGxUd2VlbnNPZiA9IGZ1bmN0aW9uIGtpbGxUd2VlbnNPZih0YXJnZXRzLCBwcm9wcywgb25seUFjdGl2ZSkge1xuICAgICAgcmV0dXJuIF9nbG9iYWxUaW1lbGluZS5raWxsVHdlZW5zT2YodGFyZ2V0cywgcHJvcHMsIG9ubHlBY3RpdmUpO1xuICAgIH07XG5cbiAgICByZXR1cm4gVHdlZW47XG4gIH0oQW5pbWF0aW9uKTtcblxuICBfc2V0RGVmYXVsdHMoVHdlZW4ucHJvdG90eXBlLCB7XG4gICAgX3RhcmdldHM6IFtdLFxuICAgIF9sYXp5OiAwLFxuICAgIF9zdGFydEF0OiAwLFxuICAgIF9vcDogMCxcbiAgICBfb25Jbml0OiAwXG4gIH0pO1xuXG4gIF9mb3JFYWNoTmFtZShcInN0YWdnZXJUbyxzdGFnZ2VyRnJvbSxzdGFnZ2VyRnJvbVRvXCIsIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgVHdlZW5bbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdGwgPSBuZXcgVGltZWxpbmUoKSxcbiAgICAgICAgICBwYXJhbXMgPSBfc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICBwYXJhbXMuc3BsaWNlKG5hbWUgPT09IFwic3RhZ2dlckZyb21Ub1wiID8gNSA6IDQsIDAsIDApO1xuICAgICAgcmV0dXJuIHRsW25hbWVdLmFwcGx5KHRsLCBwYXJhbXMpO1xuICAgIH07XG4gIH0pO1xuXG4gIHZhciBfc2V0dGVyUGxhaW4gPSBmdW5jdGlvbiBfc2V0dGVyUGxhaW4odGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGFyZ2V0W3Byb3BlcnR5XSA9IHZhbHVlO1xuICB9LFxuICAgICAgX3NldHRlckZ1bmMgPSBmdW5jdGlvbiBfc2V0dGVyRnVuYyh0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSkge1xuICAgIHJldHVybiB0YXJnZXRbcHJvcGVydHldKHZhbHVlKTtcbiAgfSxcbiAgICAgIF9zZXR0ZXJGdW5jV2l0aFBhcmFtID0gZnVuY3Rpb24gX3NldHRlckZ1bmNXaXRoUGFyYW0odGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUsIGRhdGEpIHtcbiAgICByZXR1cm4gdGFyZ2V0W3Byb3BlcnR5XShkYXRhLmZwLCB2YWx1ZSk7XG4gIH0sXG4gICAgICBfc2V0dGVyQXR0cmlidXRlID0gZnVuY3Rpb24gX3NldHRlckF0dHJpYnV0ZSh0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSkge1xuICAgIHJldHVybiB0YXJnZXQuc2V0QXR0cmlidXRlKHByb3BlcnR5LCB2YWx1ZSk7XG4gIH0sXG4gICAgICBfZ2V0U2V0dGVyID0gZnVuY3Rpb24gX2dldFNldHRlcih0YXJnZXQsIHByb3BlcnR5KSB7XG4gICAgcmV0dXJuIF9pc0Z1bmN0aW9uKHRhcmdldFtwcm9wZXJ0eV0pID8gX3NldHRlckZ1bmMgOiBfaXNVbmRlZmluZWQodGFyZ2V0W3Byb3BlcnR5XSkgJiYgdGFyZ2V0LnNldEF0dHJpYnV0ZSA/IF9zZXR0ZXJBdHRyaWJ1dGUgOiBfc2V0dGVyUGxhaW47XG4gIH0sXG4gICAgICBfcmVuZGVyUGxhaW4gPSBmdW5jdGlvbiBfcmVuZGVyUGxhaW4ocmF0aW8sIGRhdGEpIHtcbiAgICByZXR1cm4gZGF0YS5zZXQoZGF0YS50LCBkYXRhLnAsIE1hdGgucm91bmQoKGRhdGEucyArIGRhdGEuYyAqIHJhdGlvKSAqIDEwMDAwMDApIC8gMTAwMDAwMCwgZGF0YSk7XG4gIH0sXG4gICAgICBfcmVuZGVyQm9vbGVhbiA9IGZ1bmN0aW9uIF9yZW5kZXJCb29sZWFuKHJhdGlvLCBkYXRhKSB7XG4gICAgcmV0dXJuIGRhdGEuc2V0KGRhdGEudCwgZGF0YS5wLCAhIShkYXRhLnMgKyBkYXRhLmMgKiByYXRpbyksIGRhdGEpO1xuICB9LFxuICAgICAgX3JlbmRlckNvbXBsZXhTdHJpbmcgPSBmdW5jdGlvbiBfcmVuZGVyQ29tcGxleFN0cmluZyhyYXRpbywgZGF0YSkge1xuICAgIHZhciBwdCA9IGRhdGEuX3B0LFxuICAgICAgICBzID0gXCJcIjtcblxuICAgIGlmICghcmF0aW8gJiYgZGF0YS5iKSB7XG4gICAgICBzID0gZGF0YS5iO1xuICAgIH0gZWxzZSBpZiAocmF0aW8gPT09IDEgJiYgZGF0YS5lKSB7XG4gICAgICBzID0gZGF0YS5lO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAocHQpIHtcbiAgICAgICAgcyA9IHB0LnAgKyAocHQubSA/IHB0Lm0ocHQucyArIHB0LmMgKiByYXRpbykgOiBNYXRoLnJvdW5kKChwdC5zICsgcHQuYyAqIHJhdGlvKSAqIDEwMDAwKSAvIDEwMDAwKSArIHM7XG4gICAgICAgIHB0ID0gcHQuX25leHQ7XG4gICAgICB9XG5cbiAgICAgIHMgKz0gZGF0YS5jO1xuICAgIH1cblxuICAgIGRhdGEuc2V0KGRhdGEudCwgZGF0YS5wLCBzLCBkYXRhKTtcbiAgfSxcbiAgICAgIF9yZW5kZXJQcm9wVHdlZW5zID0gZnVuY3Rpb24gX3JlbmRlclByb3BUd2VlbnMocmF0aW8sIGRhdGEpIHtcbiAgICB2YXIgcHQgPSBkYXRhLl9wdDtcblxuICAgIHdoaWxlIChwdCkge1xuICAgICAgcHQucihyYXRpbywgcHQuZCk7XG4gICAgICBwdCA9IHB0Ll9uZXh0O1xuICAgIH1cbiAgfSxcbiAgICAgIF9hZGRQbHVnaW5Nb2RpZmllciA9IGZ1bmN0aW9uIF9hZGRQbHVnaW5Nb2RpZmllcihtb2RpZmllciwgdHdlZW4sIHRhcmdldCwgcHJvcGVydHkpIHtcbiAgICB2YXIgcHQgPSB0aGlzLl9wdCxcbiAgICAgICAgbmV4dDtcblxuICAgIHdoaWxlIChwdCkge1xuICAgICAgbmV4dCA9IHB0Ll9uZXh0O1xuICAgICAgcHQucCA9PT0gcHJvcGVydHkgJiYgcHQubW9kaWZpZXIobW9kaWZpZXIsIHR3ZWVuLCB0YXJnZXQpO1xuICAgICAgcHQgPSBuZXh0O1xuICAgIH1cbiAgfSxcbiAgICAgIF9raWxsUHJvcFR3ZWVuc09mID0gZnVuY3Rpb24gX2tpbGxQcm9wVHdlZW5zT2YocHJvcGVydHkpIHtcbiAgICB2YXIgcHQgPSB0aGlzLl9wdCxcbiAgICAgICAgaGFzTm9uRGVwZW5kZW50UmVtYWluaW5nLFxuICAgICAgICBuZXh0O1xuXG4gICAgd2hpbGUgKHB0KSB7XG4gICAgICBuZXh0ID0gcHQuX25leHQ7XG5cbiAgICAgIGlmIChwdC5wID09PSBwcm9wZXJ0eSAmJiAhcHQub3AgfHwgcHQub3AgPT09IHByb3BlcnR5KSB7XG4gICAgICAgIF9yZW1vdmVMaW5rZWRMaXN0SXRlbSh0aGlzLCBwdCwgXCJfcHRcIik7XG4gICAgICB9IGVsc2UgaWYgKCFwdC5kZXApIHtcbiAgICAgICAgaGFzTm9uRGVwZW5kZW50UmVtYWluaW5nID0gMTtcbiAgICAgIH1cblxuICAgICAgcHQgPSBuZXh0O1xuICAgIH1cblxuICAgIHJldHVybiAhaGFzTm9uRGVwZW5kZW50UmVtYWluaW5nO1xuICB9LFxuICAgICAgX3NldHRlcldpdGhNb2RpZmllciA9IGZ1bmN0aW9uIF9zZXR0ZXJXaXRoTW9kaWZpZXIodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUsIGRhdGEpIHtcbiAgICBkYXRhLm1TZXQodGFyZ2V0LCBwcm9wZXJ0eSwgZGF0YS5tLmNhbGwoZGF0YS50d2VlbiwgdmFsdWUsIGRhdGEubXQpLCBkYXRhKTtcbiAgfSxcbiAgICAgIF9zb3J0UHJvcFR3ZWVuc0J5UHJpb3JpdHkgPSBmdW5jdGlvbiBfc29ydFByb3BUd2VlbnNCeVByaW9yaXR5KHBhcmVudCkge1xuICAgIHZhciBwdCA9IHBhcmVudC5fcHQsXG4gICAgICAgIG5leHQsXG4gICAgICAgIHB0MixcbiAgICAgICAgZmlyc3QsXG4gICAgICAgIGxhc3Q7XG5cbiAgICB3aGlsZSAocHQpIHtcbiAgICAgIG5leHQgPSBwdC5fbmV4dDtcbiAgICAgIHB0MiA9IGZpcnN0O1xuXG4gICAgICB3aGlsZSAocHQyICYmIHB0Mi5wciA+IHB0LnByKSB7XG4gICAgICAgIHB0MiA9IHB0Mi5fbmV4dDtcbiAgICAgIH1cblxuICAgICAgaWYgKHB0Ll9wcmV2ID0gcHQyID8gcHQyLl9wcmV2IDogbGFzdCkge1xuICAgICAgICBwdC5fcHJldi5fbmV4dCA9IHB0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmlyc3QgPSBwdDtcbiAgICAgIH1cblxuICAgICAgaWYgKHB0Ll9uZXh0ID0gcHQyKSB7XG4gICAgICAgIHB0Mi5fcHJldiA9IHB0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGFzdCA9IHB0O1xuICAgICAgfVxuXG4gICAgICBwdCA9IG5leHQ7XG4gICAgfVxuXG4gICAgcGFyZW50Ll9wdCA9IGZpcnN0O1xuICB9O1xuXG4gIHZhciBQcm9wVHdlZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUHJvcFR3ZWVuKG5leHQsIHRhcmdldCwgcHJvcCwgc3RhcnQsIGNoYW5nZSwgcmVuZGVyZXIsIGRhdGEsIHNldHRlciwgcHJpb3JpdHkpIHtcbiAgICAgIHRoaXMudCA9IHRhcmdldDtcbiAgICAgIHRoaXMucyA9IHN0YXJ0O1xuICAgICAgdGhpcy5jID0gY2hhbmdlO1xuICAgICAgdGhpcy5wID0gcHJvcDtcbiAgICAgIHRoaXMuciA9IHJlbmRlcmVyIHx8IF9yZW5kZXJQbGFpbjtcbiAgICAgIHRoaXMuZCA9IGRhdGEgfHwgdGhpcztcbiAgICAgIHRoaXMuc2V0ID0gc2V0dGVyIHx8IF9zZXR0ZXJQbGFpbjtcbiAgICAgIHRoaXMucHIgPSBwcmlvcml0eSB8fCAwO1xuICAgICAgdGhpcy5fbmV4dCA9IG5leHQ7XG5cbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIG5leHQuX3ByZXYgPSB0aGlzO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBfcHJvdG80ID0gUHJvcFR3ZWVuLnByb3RvdHlwZTtcblxuICAgIF9wcm90bzQubW9kaWZpZXIgPSBmdW5jdGlvbiBtb2RpZmllcihmdW5jLCB0d2VlbiwgdGFyZ2V0KSB7XG4gICAgICB0aGlzLm1TZXQgPSB0aGlzLm1TZXQgfHwgdGhpcy5zZXQ7XG4gICAgICB0aGlzLnNldCA9IF9zZXR0ZXJXaXRoTW9kaWZpZXI7XG4gICAgICB0aGlzLm0gPSBmdW5jO1xuICAgICAgdGhpcy5tdCA9IHRhcmdldDtcbiAgICAgIHRoaXMudHdlZW4gPSB0d2VlbjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFByb3BUd2VlbjtcbiAgfSgpO1xuXG4gIF9mb3JFYWNoTmFtZShfY2FsbGJhY2tOYW1lcyArIFwicGFyZW50LGR1cmF0aW9uLGVhc2UsZGVsYXksb3ZlcndyaXRlLHJ1bkJhY2t3YXJkcyxzdGFydEF0LHlveW8saW1tZWRpYXRlUmVuZGVyLHJlcGVhdCxyZXBlYXREZWxheSxkYXRhLHBhdXNlZCxyZXZlcnNlZCxsYXp5LGNhbGxiYWNrU2NvcGUsc3RyaW5nRmlsdGVyLGlkLHlveW9FYXNlLHN0YWdnZXIsaW5oZXJpdCxyZXBlYXRSZWZyZXNoLGtleWZyYW1lcyxhdXRvUmV2ZXJ0LHNjcm9sbFRyaWdnZXJcIiwgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICByZXR1cm4gX3Jlc2VydmVkUHJvcHNbbmFtZV0gPSAxO1xuICB9KTtcblxuICBfZ2xvYmFscy5Ud2Vlbk1heCA9IF9nbG9iYWxzLlR3ZWVuTGl0ZSA9IFR3ZWVuO1xuICBfZ2xvYmFscy5UaW1lbGluZUxpdGUgPSBfZ2xvYmFscy5UaW1lbGluZU1heCA9IFRpbWVsaW5lO1xuICBfZ2xvYmFsVGltZWxpbmUgPSBuZXcgVGltZWxpbmUoe1xuICAgIHNvcnRDaGlsZHJlbjogZmFsc2UsXG4gICAgZGVmYXVsdHM6IF9kZWZhdWx0cyxcbiAgICBhdXRvUmVtb3ZlQ2hpbGRyZW46IHRydWUsXG4gICAgaWQ6IFwicm9vdFwiLFxuICAgIHNtb290aENoaWxkVGltaW5nOiB0cnVlXG4gIH0pO1xuICBfY29uZmlnLnN0cmluZ0ZpbHRlciA9IF9jb2xvclN0cmluZ0ZpbHRlcjtcbiAgdmFyIF9nc2FwID0ge1xuICAgIHJlZ2lzdGVyUGx1Z2luOiBmdW5jdGlvbiByZWdpc3RlclBsdWdpbigpIHtcbiAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuMiksIF9rZXkyID0gMDsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgICBhcmdzW19rZXkyXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgICB9XG5cbiAgICAgIGFyZ3MuZm9yRWFjaChmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgIHJldHVybiBfY3JlYXRlUGx1Z2luKGNvbmZpZyk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHRpbWVsaW5lOiBmdW5jdGlvbiB0aW1lbGluZSh2YXJzKSB7XG4gICAgICByZXR1cm4gbmV3IFRpbWVsaW5lKHZhcnMpO1xuICAgIH0sXG4gICAgZ2V0VHdlZW5zT2Y6IGZ1bmN0aW9uIGdldFR3ZWVuc09mKHRhcmdldHMsIG9ubHlBY3RpdmUpIHtcbiAgICAgIHJldHVybiBfZ2xvYmFsVGltZWxpbmUuZ2V0VHdlZW5zT2YodGFyZ2V0cywgb25seUFjdGl2ZSk7XG4gICAgfSxcbiAgICBnZXRQcm9wZXJ0eTogZnVuY3Rpb24gZ2V0UHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eSwgdW5pdCwgdW5jYWNoZSkge1xuICAgICAgX2lzU3RyaW5nKHRhcmdldCkgJiYgKHRhcmdldCA9IHRvQXJyYXkodGFyZ2V0KVswXSk7XG5cbiAgICAgIHZhciBnZXR0ZXIgPSBfZ2V0Q2FjaGUodGFyZ2V0IHx8IHt9KS5nZXQsXG4gICAgICAgICAgZm9ybWF0ID0gdW5pdCA/IF9wYXNzVGhyb3VnaCA6IF9udW1lcmljSWZQb3NzaWJsZTtcblxuICAgICAgdW5pdCA9PT0gXCJuYXRpdmVcIiAmJiAodW5pdCA9IFwiXCIpO1xuICAgICAgcmV0dXJuICF0YXJnZXQgPyB0YXJnZXQgOiAhcHJvcGVydHkgPyBmdW5jdGlvbiAocHJvcGVydHksIHVuaXQsIHVuY2FjaGUpIHtcbiAgICAgICAgcmV0dXJuIGZvcm1hdCgoX3BsdWdpbnNbcHJvcGVydHldICYmIF9wbHVnaW5zW3Byb3BlcnR5XS5nZXQgfHwgZ2V0dGVyKSh0YXJnZXQsIHByb3BlcnR5LCB1bml0LCB1bmNhY2hlKSk7XG4gICAgICB9IDogZm9ybWF0KChfcGx1Z2luc1twcm9wZXJ0eV0gJiYgX3BsdWdpbnNbcHJvcGVydHldLmdldCB8fCBnZXR0ZXIpKHRhcmdldCwgcHJvcGVydHksIHVuaXQsIHVuY2FjaGUpKTtcbiAgICB9LFxuICAgIHF1aWNrU2V0dGVyOiBmdW5jdGlvbiBxdWlja1NldHRlcih0YXJnZXQsIHByb3BlcnR5LCB1bml0KSB7XG4gICAgICB0YXJnZXQgPSB0b0FycmF5KHRhcmdldCk7XG5cbiAgICAgIGlmICh0YXJnZXQubGVuZ3RoID4gMSkge1xuICAgICAgICB2YXIgc2V0dGVycyA9IHRhcmdldC5tYXAoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICByZXR1cm4gZ3NhcC5xdWlja1NldHRlcih0LCBwcm9wZXJ0eSwgdW5pdCk7XG4gICAgICAgIH0pLFxuICAgICAgICAgICAgbCA9IHNldHRlcnMubGVuZ3RoO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgdmFyIGkgPSBsO1xuXG4gICAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgc2V0dGVyc1tpXSh2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICB0YXJnZXQgPSB0YXJnZXRbMF0gfHwge307XG5cbiAgICAgIHZhciBQbHVnaW4gPSBfcGx1Z2luc1twcm9wZXJ0eV0sXG4gICAgICAgICAgY2FjaGUgPSBfZ2V0Q2FjaGUodGFyZ2V0KSxcbiAgICAgICAgICBwID0gY2FjaGUuaGFybmVzcyAmJiAoY2FjaGUuaGFybmVzcy5hbGlhc2VzIHx8IHt9KVtwcm9wZXJ0eV0gfHwgcHJvcGVydHksXG4gICAgICAgICAgc2V0dGVyID0gUGx1Z2luID8gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciBwID0gbmV3IFBsdWdpbigpO1xuICAgICAgICBfcXVpY2tUd2Vlbi5fcHQgPSAwO1xuICAgICAgICBwLmluaXQodGFyZ2V0LCB1bml0ID8gdmFsdWUgKyB1bml0IDogdmFsdWUsIF9xdWlja1R3ZWVuLCAwLCBbdGFyZ2V0XSk7XG4gICAgICAgIHAucmVuZGVyKDEsIHApO1xuICAgICAgICBfcXVpY2tUd2Vlbi5fcHQgJiYgX3JlbmRlclByb3BUd2VlbnMoMSwgX3F1aWNrVHdlZW4pO1xuICAgICAgfSA6IGNhY2hlLnNldCh0YXJnZXQsIHApO1xuXG4gICAgICByZXR1cm4gUGx1Z2luID8gc2V0dGVyIDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBzZXR0ZXIodGFyZ2V0LCBwLCB1bml0ID8gdmFsdWUgKyB1bml0IDogdmFsdWUsIGNhY2hlLCAxKTtcbiAgICAgIH07XG4gICAgfSxcbiAgICBxdWlja1RvOiBmdW5jdGlvbiBxdWlja1RvKHRhcmdldCwgcHJvcGVydHksIHZhcnMpIHtcbiAgICAgIHZhciBfbWVyZ2UyO1xuXG4gICAgICB2YXIgdHdlZW4gPSBnc2FwLnRvKHRhcmdldCwgX21lcmdlKChfbWVyZ2UyID0ge30sIF9tZXJnZTJbcHJvcGVydHldID0gXCIrPTAuMVwiLCBfbWVyZ2UyLnBhdXNlZCA9IHRydWUsIF9tZXJnZTIpLCB2YXJzIHx8IHt9KSksXG4gICAgICAgICAgZnVuYyA9IGZ1bmN0aW9uIGZ1bmModmFsdWUsIHN0YXJ0LCBzdGFydElzUmVsYXRpdmUpIHtcbiAgICAgICAgcmV0dXJuIHR3ZWVuLnJlc2V0VG8ocHJvcGVydHksIHZhbHVlLCBzdGFydCwgc3RhcnRJc1JlbGF0aXZlKTtcbiAgICAgIH07XG5cbiAgICAgIGZ1bmMudHdlZW4gPSB0d2VlbjtcbiAgICAgIHJldHVybiBmdW5jO1xuICAgIH0sXG4gICAgaXNUd2VlbmluZzogZnVuY3Rpb24gaXNUd2VlbmluZyh0YXJnZXRzKSB7XG4gICAgICByZXR1cm4gX2dsb2JhbFRpbWVsaW5lLmdldFR3ZWVuc09mKHRhcmdldHMsIHRydWUpLmxlbmd0aCA+IDA7XG4gICAgfSxcbiAgICBkZWZhdWx0czogZnVuY3Rpb24gZGVmYXVsdHModmFsdWUpIHtcbiAgICAgIHZhbHVlICYmIHZhbHVlLmVhc2UgJiYgKHZhbHVlLmVhc2UgPSBfcGFyc2VFYXNlKHZhbHVlLmVhc2UsIF9kZWZhdWx0cy5lYXNlKSk7XG4gICAgICByZXR1cm4gX21lcmdlRGVlcChfZGVmYXVsdHMsIHZhbHVlIHx8IHt9KTtcbiAgICB9LFxuICAgIGNvbmZpZzogZnVuY3Rpb24gY29uZmlnKHZhbHVlKSB7XG4gICAgICByZXR1cm4gX21lcmdlRGVlcChfY29uZmlnLCB2YWx1ZSB8fCB7fSk7XG4gICAgfSxcbiAgICByZWdpc3RlckVmZmVjdDogZnVuY3Rpb24gcmVnaXN0ZXJFZmZlY3QoX3JlZjMpIHtcbiAgICAgIHZhciBuYW1lID0gX3JlZjMubmFtZSxcbiAgICAgICAgICBlZmZlY3QgPSBfcmVmMy5lZmZlY3QsXG4gICAgICAgICAgcGx1Z2lucyA9IF9yZWYzLnBsdWdpbnMsXG4gICAgICAgICAgZGVmYXVsdHMgPSBfcmVmMy5kZWZhdWx0cyxcbiAgICAgICAgICBleHRlbmRUaW1lbGluZSA9IF9yZWYzLmV4dGVuZFRpbWVsaW5lO1xuICAgICAgKHBsdWdpbnMgfHwgXCJcIikuc3BsaXQoXCIsXCIpLmZvckVhY2goZnVuY3Rpb24gKHBsdWdpbk5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHBsdWdpbk5hbWUgJiYgIV9wbHVnaW5zW3BsdWdpbk5hbWVdICYmICFfZ2xvYmFsc1twbHVnaW5OYW1lXSAmJiBfd2FybihuYW1lICsgXCIgZWZmZWN0IHJlcXVpcmVzIFwiICsgcGx1Z2luTmFtZSArIFwiIHBsdWdpbi5cIik7XG4gICAgICB9KTtcblxuICAgICAgX2VmZmVjdHNbbmFtZV0gPSBmdW5jdGlvbiAodGFyZ2V0cywgdmFycywgdGwpIHtcbiAgICAgICAgcmV0dXJuIGVmZmVjdCh0b0FycmF5KHRhcmdldHMpLCBfc2V0RGVmYXVsdHModmFycyB8fCB7fSwgZGVmYXVsdHMpLCB0bCk7XG4gICAgICB9O1xuXG4gICAgICBpZiAoZXh0ZW5kVGltZWxpbmUpIHtcbiAgICAgICAgVGltZWxpbmUucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24gKHRhcmdldHMsIHZhcnMsIHBvc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYWRkKF9lZmZlY3RzW25hbWVdKHRhcmdldHMsIF9pc09iamVjdCh2YXJzKSA/IHZhcnMgOiAocG9zaXRpb24gPSB2YXJzKSAmJiB7fSwgdGhpcyksIHBvc2l0aW9uKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlZ2lzdGVyRWFzZTogZnVuY3Rpb24gcmVnaXN0ZXJFYXNlKG5hbWUsIGVhc2UpIHtcbiAgICAgIF9lYXNlTWFwW25hbWVdID0gX3BhcnNlRWFzZShlYXNlKTtcbiAgICB9LFxuICAgIHBhcnNlRWFzZTogZnVuY3Rpb24gcGFyc2VFYXNlKGVhc2UsIGRlZmF1bHRFYXNlKSB7XG4gICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IF9wYXJzZUVhc2UoZWFzZSwgZGVmYXVsdEVhc2UpIDogX2Vhc2VNYXA7XG4gICAgfSxcbiAgICBnZXRCeUlkOiBmdW5jdGlvbiBnZXRCeUlkKGlkKSB7XG4gICAgICByZXR1cm4gX2dsb2JhbFRpbWVsaW5lLmdldEJ5SWQoaWQpO1xuICAgIH0sXG4gICAgZXhwb3J0Um9vdDogZnVuY3Rpb24gZXhwb3J0Um9vdCh2YXJzLCBpbmNsdWRlRGVsYXllZENhbGxzKSB7XG4gICAgICBpZiAodmFycyA9PT0gdm9pZCAwKSB7XG4gICAgICAgIHZhcnMgPSB7fTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRsID0gbmV3IFRpbWVsaW5lKHZhcnMpLFxuICAgICAgICAgIGNoaWxkLFxuICAgICAgICAgIG5leHQ7XG4gICAgICB0bC5zbW9vdGhDaGlsZFRpbWluZyA9IF9pc05vdEZhbHNlKHZhcnMuc21vb3RoQ2hpbGRUaW1pbmcpO1xuXG4gICAgICBfZ2xvYmFsVGltZWxpbmUucmVtb3ZlKHRsKTtcblxuICAgICAgdGwuX2RwID0gMDtcbiAgICAgIHRsLl90aW1lID0gdGwuX3RUaW1lID0gX2dsb2JhbFRpbWVsaW5lLl90aW1lO1xuICAgICAgY2hpbGQgPSBfZ2xvYmFsVGltZWxpbmUuX2ZpcnN0O1xuXG4gICAgICB3aGlsZSAoY2hpbGQpIHtcbiAgICAgICAgbmV4dCA9IGNoaWxkLl9uZXh0O1xuXG4gICAgICAgIGlmIChpbmNsdWRlRGVsYXllZENhbGxzIHx8ICEoIWNoaWxkLl9kdXIgJiYgY2hpbGQgaW5zdGFuY2VvZiBUd2VlbiAmJiBjaGlsZC52YXJzLm9uQ29tcGxldGUgPT09IGNoaWxkLl90YXJnZXRzWzBdKSkge1xuICAgICAgICAgIF9hZGRUb1RpbWVsaW5lKHRsLCBjaGlsZCwgY2hpbGQuX3N0YXJ0IC0gY2hpbGQuX2RlbGF5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoaWxkID0gbmV4dDtcbiAgICAgIH1cblxuICAgICAgX2FkZFRvVGltZWxpbmUoX2dsb2JhbFRpbWVsaW5lLCB0bCwgMCk7XG5cbiAgICAgIHJldHVybiB0bDtcbiAgICB9LFxuICAgIHV0aWxzOiB7XG4gICAgICB3cmFwOiB3cmFwLFxuICAgICAgd3JhcFlveW86IHdyYXBZb3lvLFxuICAgICAgZGlzdHJpYnV0ZTogZGlzdHJpYnV0ZSxcbiAgICAgIHJhbmRvbTogcmFuZG9tLFxuICAgICAgc25hcDogc25hcCxcbiAgICAgIG5vcm1hbGl6ZTogbm9ybWFsaXplLFxuICAgICAgZ2V0VW5pdDogZ2V0VW5pdCxcbiAgICAgIGNsYW1wOiBjbGFtcCxcbiAgICAgIHNwbGl0Q29sb3I6IHNwbGl0Q29sb3IsXG4gICAgICB0b0FycmF5OiB0b0FycmF5LFxuICAgICAgc2VsZWN0b3I6IHNlbGVjdG9yLFxuICAgICAgbWFwUmFuZ2U6IG1hcFJhbmdlLFxuICAgICAgcGlwZTogcGlwZSxcbiAgICAgIHVuaXRpemU6IHVuaXRpemUsXG4gICAgICBpbnRlcnBvbGF0ZTogaW50ZXJwb2xhdGUsXG4gICAgICBzaHVmZmxlOiBzaHVmZmxlXG4gICAgfSxcbiAgICBpbnN0YWxsOiBfaW5zdGFsbCxcbiAgICBlZmZlY3RzOiBfZWZmZWN0cyxcbiAgICB0aWNrZXI6IF90aWNrZXIsXG4gICAgdXBkYXRlUm9vdDogVGltZWxpbmUudXBkYXRlUm9vdCxcbiAgICBwbHVnaW5zOiBfcGx1Z2lucyxcbiAgICBnbG9iYWxUaW1lbGluZTogX2dsb2JhbFRpbWVsaW5lLFxuICAgIGNvcmU6IHtcbiAgICAgIFByb3BUd2VlbjogUHJvcFR3ZWVuLFxuICAgICAgZ2xvYmFsczogX2FkZEdsb2JhbCxcbiAgICAgIFR3ZWVuOiBUd2VlbixcbiAgICAgIFRpbWVsaW5lOiBUaW1lbGluZSxcbiAgICAgIEFuaW1hdGlvbjogQW5pbWF0aW9uLFxuICAgICAgZ2V0Q2FjaGU6IF9nZXRDYWNoZSxcbiAgICAgIF9yZW1vdmVMaW5rZWRMaXN0SXRlbTogX3JlbW92ZUxpbmtlZExpc3RJdGVtLFxuICAgICAgc3VwcHJlc3NPdmVyd3JpdGVzOiBmdW5jdGlvbiBzdXBwcmVzc092ZXJ3cml0ZXModmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBwcmVzc092ZXJ3cml0ZXMgPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgX2ZvckVhY2hOYW1lKFwidG8sZnJvbSxmcm9tVG8sZGVsYXllZENhbGwsc2V0LGtpbGxUd2VlbnNPZlwiLCBmdW5jdGlvbiAobmFtZSkge1xuICAgIHJldHVybiBfZ3NhcFtuYW1lXSA9IFR3ZWVuW25hbWVdO1xuICB9KTtcblxuICBfdGlja2VyLmFkZChUaW1lbGluZS51cGRhdGVSb290KTtcblxuICBfcXVpY2tUd2VlbiA9IF9nc2FwLnRvKHt9LCB7XG4gICAgZHVyYXRpb246IDBcbiAgfSk7XG5cbiAgdmFyIF9nZXRQbHVnaW5Qcm9wVHdlZW4gPSBmdW5jdGlvbiBfZ2V0UGx1Z2luUHJvcFR3ZWVuKHBsdWdpbiwgcHJvcCkge1xuICAgIHZhciBwdCA9IHBsdWdpbi5fcHQ7XG5cbiAgICB3aGlsZSAocHQgJiYgcHQucCAhPT0gcHJvcCAmJiBwdC5vcCAhPT0gcHJvcCAmJiBwdC5mcCAhPT0gcHJvcCkge1xuICAgICAgcHQgPSBwdC5fbmV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gcHQ7XG4gIH0sXG4gICAgICBfYWRkTW9kaWZpZXJzID0gZnVuY3Rpb24gX2FkZE1vZGlmaWVycyh0d2VlbiwgbW9kaWZpZXJzKSB7XG4gICAgdmFyIHRhcmdldHMgPSB0d2Vlbi5fdGFyZ2V0cyxcbiAgICAgICAgcCxcbiAgICAgICAgaSxcbiAgICAgICAgcHQ7XG5cbiAgICBmb3IgKHAgaW4gbW9kaWZpZXJzKSB7XG4gICAgICBpID0gdGFyZ2V0cy5sZW5ndGg7XG5cbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgcHQgPSB0d2Vlbi5fcHRMb29rdXBbaV1bcF07XG5cbiAgICAgICAgaWYgKHB0ICYmIChwdCA9IHB0LmQpKSB7XG4gICAgICAgICAgaWYgKHB0Ll9wdCkge1xuICAgICAgICAgICAgcHQgPSBfZ2V0UGx1Z2luUHJvcFR3ZWVuKHB0LCBwKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBwdCAmJiBwdC5tb2RpZmllciAmJiBwdC5tb2RpZmllcihtb2RpZmllcnNbcF0sIHR3ZWVuLCB0YXJnZXRzW2ldLCBwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgICAgIF9idWlsZE1vZGlmaWVyUGx1Z2luID0gZnVuY3Rpb24gX2J1aWxkTW9kaWZpZXJQbHVnaW4obmFtZSwgbW9kaWZpZXIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHJhd1ZhcnM6IDEsXG4gICAgICBpbml0OiBmdW5jdGlvbiBpbml0KHRhcmdldCwgdmFycywgdHdlZW4pIHtcbiAgICAgICAgdHdlZW4uX29uSW5pdCA9IGZ1bmN0aW9uICh0d2Vlbikge1xuICAgICAgICAgIHZhciB0ZW1wLCBwO1xuXG4gICAgICAgICAgaWYgKF9pc1N0cmluZyh2YXJzKSkge1xuICAgICAgICAgICAgdGVtcCA9IHt9O1xuXG4gICAgICAgICAgICBfZm9yRWFjaE5hbWUodmFycywgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRlbXBbbmFtZV0gPSAxO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhcnMgPSB0ZW1wO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChtb2RpZmllcikge1xuICAgICAgICAgICAgdGVtcCA9IHt9O1xuXG4gICAgICAgICAgICBmb3IgKHAgaW4gdmFycykge1xuICAgICAgICAgICAgICB0ZW1wW3BdID0gbW9kaWZpZXIodmFyc1twXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhcnMgPSB0ZW1wO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIF9hZGRNb2RpZmllcnModHdlZW4sIHZhcnMpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgdmFyIGdzYXAgPSBfZ3NhcC5yZWdpc3RlclBsdWdpbih7XG4gICAgbmFtZTogXCJhdHRyXCIsXG4gICAgaW5pdDogZnVuY3Rpb24gaW5pdCh0YXJnZXQsIHZhcnMsIHR3ZWVuLCBpbmRleCwgdGFyZ2V0cykge1xuICAgICAgdmFyIHAsIHB0O1xuXG4gICAgICBmb3IgKHAgaW4gdmFycykge1xuICAgICAgICBwdCA9IHRoaXMuYWRkKHRhcmdldCwgXCJzZXRBdHRyaWJ1dGVcIiwgKHRhcmdldC5nZXRBdHRyaWJ1dGUocCkgfHwgMCkgKyBcIlwiLCB2YXJzW3BdLCBpbmRleCwgdGFyZ2V0cywgMCwgMCwgcCk7XG4gICAgICAgIHB0ICYmIChwdC5vcCA9IHApO1xuXG4gICAgICAgIHRoaXMuX3Byb3BzLnB1c2gocCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAgbmFtZTogXCJlbmRBcnJheVwiLFxuICAgIGluaXQ6IGZ1bmN0aW9uIGluaXQodGFyZ2V0LCB2YWx1ZSkge1xuICAgICAgdmFyIGkgPSB2YWx1ZS5sZW5ndGg7XG5cbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgdGhpcy5hZGQodGFyZ2V0LCBpLCB0YXJnZXRbaV0gfHwgMCwgdmFsdWVbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgfSwgX2J1aWxkTW9kaWZpZXJQbHVnaW4oXCJyb3VuZFByb3BzXCIsIF9yb3VuZE1vZGlmaWVyKSwgX2J1aWxkTW9kaWZpZXJQbHVnaW4oXCJtb2RpZmllcnNcIiksIF9idWlsZE1vZGlmaWVyUGx1Z2luKFwic25hcFwiLCBzbmFwKSkgfHwgX2dzYXA7XG4gIFR3ZWVuLnZlcnNpb24gPSBUaW1lbGluZS52ZXJzaW9uID0gZ3NhcC52ZXJzaW9uID0gXCIzLjEwLjJcIjtcbiAgX2NvcmVSZWFkeSA9IDE7XG4gIF93aW5kb3dFeGlzdHMoKSAmJiBfd2FrZSgpO1xuICB2YXIgUG93ZXIwID0gX2Vhc2VNYXAuUG93ZXIwLFxuICAgICAgUG93ZXIxID0gX2Vhc2VNYXAuUG93ZXIxLFxuICAgICAgUG93ZXIyID0gX2Vhc2VNYXAuUG93ZXIyLFxuICAgICAgUG93ZXIzID0gX2Vhc2VNYXAuUG93ZXIzLFxuICAgICAgUG93ZXI0ID0gX2Vhc2VNYXAuUG93ZXI0LFxuICAgICAgTGluZWFyID0gX2Vhc2VNYXAuTGluZWFyLFxuICAgICAgUXVhZCA9IF9lYXNlTWFwLlF1YWQsXG4gICAgICBDdWJpYyA9IF9lYXNlTWFwLkN1YmljLFxuICAgICAgUXVhcnQgPSBfZWFzZU1hcC5RdWFydCxcbiAgICAgIFF1aW50ID0gX2Vhc2VNYXAuUXVpbnQsXG4gICAgICBTdHJvbmcgPSBfZWFzZU1hcC5TdHJvbmcsXG4gICAgICBFbGFzdGljID0gX2Vhc2VNYXAuRWxhc3RpYyxcbiAgICAgIEJhY2sgPSBfZWFzZU1hcC5CYWNrLFxuICAgICAgU3RlcHBlZEVhc2UgPSBfZWFzZU1hcC5TdGVwcGVkRWFzZSxcbiAgICAgIEJvdW5jZSA9IF9lYXNlTWFwLkJvdW5jZSxcbiAgICAgIFNpbmUgPSBfZWFzZU1hcC5TaW5lLFxuICAgICAgRXhwbyA9IF9lYXNlTWFwLkV4cG8sXG4gICAgICBDaXJjID0gX2Vhc2VNYXAuQ2lyYztcblxuICB2YXIgX3dpbiQxLFxuICAgICAgX2RvYyQxLFxuICAgICAgX2RvY0VsZW1lbnQsXG4gICAgICBfcGx1Z2luSW5pdHRlZCxcbiAgICAgIF90ZW1wRGl2LFxuICAgICAgX3RlbXBEaXZTdHlsZXIsXG4gICAgICBfcmVjZW50U2V0dGVyUGx1Z2luLFxuICAgICAgX3dpbmRvd0V4aXN0cyQxID0gZnVuY3Rpb24gX3dpbmRvd0V4aXN0cygpIHtcbiAgICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgfSxcbiAgICAgIF90cmFuc2Zvcm1Qcm9wcyA9IHt9LFxuICAgICAgX1JBRDJERUcgPSAxODAgLyBNYXRoLlBJLFxuICAgICAgX0RFRzJSQUQgPSBNYXRoLlBJIC8gMTgwLFxuICAgICAgX2F0YW4yID0gTWF0aC5hdGFuMixcbiAgICAgIF9iaWdOdW0kMSA9IDFlOCxcbiAgICAgIF9jYXBzRXhwID0gLyhbQS1aXSkvZyxcbiAgICAgIF9ob3Jpem9udGFsRXhwID0gLyhsZWZ0fHJpZ2h0fHdpZHRofG1hcmdpbnxwYWRkaW5nfHgpL2ksXG4gICAgICBfY29tcGxleEV4cCA9IC9bXFxzLFxcKF1cXFMvLFxuICAgICAgX3Byb3BlcnR5QWxpYXNlcyA9IHtcbiAgICBhdXRvQWxwaGE6IFwib3BhY2l0eSx2aXNpYmlsaXR5XCIsXG4gICAgc2NhbGU6IFwic2NhbGVYLHNjYWxlWVwiLFxuICAgIGFscGhhOiBcIm9wYWNpdHlcIlxuICB9LFxuICAgICAgX3JlbmRlckNTU1Byb3AgPSBmdW5jdGlvbiBfcmVuZGVyQ1NTUHJvcChyYXRpbywgZGF0YSkge1xuICAgIHJldHVybiBkYXRhLnNldChkYXRhLnQsIGRhdGEucCwgTWF0aC5yb3VuZCgoZGF0YS5zICsgZGF0YS5jICogcmF0aW8pICogMTAwMDApIC8gMTAwMDAgKyBkYXRhLnUsIGRhdGEpO1xuICB9LFxuICAgICAgX3JlbmRlclByb3BXaXRoRW5kID0gZnVuY3Rpb24gX3JlbmRlclByb3BXaXRoRW5kKHJhdGlvLCBkYXRhKSB7XG4gICAgcmV0dXJuIGRhdGEuc2V0KGRhdGEudCwgZGF0YS5wLCByYXRpbyA9PT0gMSA/IGRhdGEuZSA6IE1hdGgucm91bmQoKGRhdGEucyArIGRhdGEuYyAqIHJhdGlvKSAqIDEwMDAwKSAvIDEwMDAwICsgZGF0YS51LCBkYXRhKTtcbiAgfSxcbiAgICAgIF9yZW5kZXJDU1NQcm9wV2l0aEJlZ2lubmluZyA9IGZ1bmN0aW9uIF9yZW5kZXJDU1NQcm9wV2l0aEJlZ2lubmluZyhyYXRpbywgZGF0YSkge1xuICAgIHJldHVybiBkYXRhLnNldChkYXRhLnQsIGRhdGEucCwgcmF0aW8gPyBNYXRoLnJvdW5kKChkYXRhLnMgKyBkYXRhLmMgKiByYXRpbykgKiAxMDAwMCkgLyAxMDAwMCArIGRhdGEudSA6IGRhdGEuYiwgZGF0YSk7XG4gIH0sXG4gICAgICBfcmVuZGVyUm91bmRlZENTU1Byb3AgPSBmdW5jdGlvbiBfcmVuZGVyUm91bmRlZENTU1Byb3AocmF0aW8sIGRhdGEpIHtcbiAgICB2YXIgdmFsdWUgPSBkYXRhLnMgKyBkYXRhLmMgKiByYXRpbztcbiAgICBkYXRhLnNldChkYXRhLnQsIGRhdGEucCwgfn4odmFsdWUgKyAodmFsdWUgPCAwID8gLS41IDogLjUpKSArIGRhdGEudSwgZGF0YSk7XG4gIH0sXG4gICAgICBfcmVuZGVyTm9uVHdlZW5pbmdWYWx1ZSA9IGZ1bmN0aW9uIF9yZW5kZXJOb25Ud2VlbmluZ1ZhbHVlKHJhdGlvLCBkYXRhKSB7XG4gICAgcmV0dXJuIGRhdGEuc2V0KGRhdGEudCwgZGF0YS5wLCByYXRpbyA/IGRhdGEuZSA6IGRhdGEuYiwgZGF0YSk7XG4gIH0sXG4gICAgICBfcmVuZGVyTm9uVHdlZW5pbmdWYWx1ZU9ubHlBdEVuZCA9IGZ1bmN0aW9uIF9yZW5kZXJOb25Ud2VlbmluZ1ZhbHVlT25seUF0RW5kKHJhdGlvLCBkYXRhKSB7XG4gICAgcmV0dXJuIGRhdGEuc2V0KGRhdGEudCwgZGF0YS5wLCByYXRpbyAhPT0gMSA/IGRhdGEuYiA6IGRhdGEuZSwgZGF0YSk7XG4gIH0sXG4gICAgICBfc2V0dGVyQ1NTU3R5bGUgPSBmdW5jdGlvbiBfc2V0dGVyQ1NTU3R5bGUodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGFyZ2V0LnN0eWxlW3Byb3BlcnR5XSA9IHZhbHVlO1xuICB9LFxuICAgICAgX3NldHRlckNTU1Byb3AgPSBmdW5jdGlvbiBfc2V0dGVyQ1NTUHJvcCh0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSkge1xuICAgIHJldHVybiB0YXJnZXQuc3R5bGUuc2V0UHJvcGVydHkocHJvcGVydHksIHZhbHVlKTtcbiAgfSxcbiAgICAgIF9zZXR0ZXJUcmFuc2Zvcm0gPSBmdW5jdGlvbiBfc2V0dGVyVHJhbnNmb3JtKHRhcmdldCwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRhcmdldC5fZ3NhcFtwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgfSxcbiAgICAgIF9zZXR0ZXJTY2FsZSA9IGZ1bmN0aW9uIF9zZXR0ZXJTY2FsZSh0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSkge1xuICAgIHJldHVybiB0YXJnZXQuX2dzYXAuc2NhbGVYID0gdGFyZ2V0Ll9nc2FwLnNjYWxlWSA9IHZhbHVlO1xuICB9LFxuICAgICAgX3NldHRlclNjYWxlV2l0aFJlbmRlciA9IGZ1bmN0aW9uIF9zZXR0ZXJTY2FsZVdpdGhSZW5kZXIodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUsIGRhdGEsIHJhdGlvKSB7XG4gICAgdmFyIGNhY2hlID0gdGFyZ2V0Ll9nc2FwO1xuICAgIGNhY2hlLnNjYWxlWCA9IGNhY2hlLnNjYWxlWSA9IHZhbHVlO1xuICAgIGNhY2hlLnJlbmRlclRyYW5zZm9ybShyYXRpbywgY2FjaGUpO1xuICB9LFxuICAgICAgX3NldHRlclRyYW5zZm9ybVdpdGhSZW5kZXIgPSBmdW5jdGlvbiBfc2V0dGVyVHJhbnNmb3JtV2l0aFJlbmRlcih0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSwgZGF0YSwgcmF0aW8pIHtcbiAgICB2YXIgY2FjaGUgPSB0YXJnZXQuX2dzYXA7XG4gICAgY2FjaGVbcHJvcGVydHldID0gdmFsdWU7XG4gICAgY2FjaGUucmVuZGVyVHJhbnNmb3JtKHJhdGlvLCBjYWNoZSk7XG4gIH0sXG4gICAgICBfdHJhbnNmb3JtUHJvcCA9IFwidHJhbnNmb3JtXCIsXG4gICAgICBfdHJhbnNmb3JtT3JpZ2luUHJvcCA9IF90cmFuc2Zvcm1Qcm9wICsgXCJPcmlnaW5cIixcbiAgICAgIF9zdXBwb3J0czNELFxuICAgICAgX2NyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiBfY3JlYXRlRWxlbWVudCh0eXBlLCBucykge1xuICAgIHZhciBlID0gX2RvYyQxLmNyZWF0ZUVsZW1lbnROUyA/IF9kb2MkMS5jcmVhdGVFbGVtZW50TlMoKG5zIHx8IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiKS5yZXBsYWNlKC9eaHR0cHMvLCBcImh0dHBcIiksIHR5cGUpIDogX2RvYyQxLmNyZWF0ZUVsZW1lbnQodHlwZSk7XG4gICAgcmV0dXJuIGUuc3R5bGUgPyBlIDogX2RvYyQxLmNyZWF0ZUVsZW1lbnQodHlwZSk7XG4gIH0sXG4gICAgICBfZ2V0Q29tcHV0ZWRQcm9wZXJ0eSA9IGZ1bmN0aW9uIF9nZXRDb21wdXRlZFByb3BlcnR5KHRhcmdldCwgcHJvcGVydHksIHNraXBQcmVmaXhGYWxsYmFjaykge1xuICAgIHZhciBjcyA9IGdldENvbXB1dGVkU3R5bGUodGFyZ2V0KTtcbiAgICByZXR1cm4gY3NbcHJvcGVydHldIHx8IGNzLmdldFByb3BlcnR5VmFsdWUocHJvcGVydHkucmVwbGFjZShfY2Fwc0V4cCwgXCItJDFcIikudG9Mb3dlckNhc2UoKSkgfHwgY3MuZ2V0UHJvcGVydHlWYWx1ZShwcm9wZXJ0eSkgfHwgIXNraXBQcmVmaXhGYWxsYmFjayAmJiBfZ2V0Q29tcHV0ZWRQcm9wZXJ0eSh0YXJnZXQsIF9jaGVja1Byb3BQcmVmaXgocHJvcGVydHkpIHx8IHByb3BlcnR5LCAxKSB8fCBcIlwiO1xuICB9LFxuICAgICAgX3ByZWZpeGVzID0gXCJPLE1veixtcyxNcyxXZWJraXRcIi5zcGxpdChcIixcIiksXG4gICAgICBfY2hlY2tQcm9wUHJlZml4ID0gZnVuY3Rpb24gX2NoZWNrUHJvcFByZWZpeChwcm9wZXJ0eSwgZWxlbWVudCwgcHJlZmVyUHJlZml4KSB7XG4gICAgdmFyIGUgPSBlbGVtZW50IHx8IF90ZW1wRGl2LFxuICAgICAgICBzID0gZS5zdHlsZSxcbiAgICAgICAgaSA9IDU7XG5cbiAgICBpZiAocHJvcGVydHkgaW4gcyAmJiAhcHJlZmVyUHJlZml4KSB7XG4gICAgICByZXR1cm4gcHJvcGVydHk7XG4gICAgfVxuXG4gICAgcHJvcGVydHkgPSBwcm9wZXJ0eS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3BlcnR5LnN1YnN0cigxKTtcblxuICAgIHdoaWxlIChpLS0gJiYgIShfcHJlZml4ZXNbaV0gKyBwcm9wZXJ0eSBpbiBzKSkge31cblxuICAgIHJldHVybiBpIDwgMCA/IG51bGwgOiAoaSA9PT0gMyA/IFwibXNcIiA6IGkgPj0gMCA/IF9wcmVmaXhlc1tpXSA6IFwiXCIpICsgcHJvcGVydHk7XG4gIH0sXG4gICAgICBfaW5pdENvcmUgPSBmdW5jdGlvbiBfaW5pdENvcmUoKSB7XG4gICAgaWYgKF93aW5kb3dFeGlzdHMkMSgpICYmIHdpbmRvdy5kb2N1bWVudCkge1xuICAgICAgX3dpbiQxID0gd2luZG93O1xuICAgICAgX2RvYyQxID0gX3dpbiQxLmRvY3VtZW50O1xuICAgICAgX2RvY0VsZW1lbnQgPSBfZG9jJDEuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgX3RlbXBEaXYgPSBfY3JlYXRlRWxlbWVudChcImRpdlwiKSB8fCB7XG4gICAgICAgIHN0eWxlOiB7fVxuICAgICAgfTtcbiAgICAgIF90ZW1wRGl2U3R5bGVyID0gX2NyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBfdHJhbnNmb3JtUHJvcCA9IF9jaGVja1Byb3BQcmVmaXgoX3RyYW5zZm9ybVByb3ApO1xuICAgICAgX3RyYW5zZm9ybU9yaWdpblByb3AgPSBfdHJhbnNmb3JtUHJvcCArIFwiT3JpZ2luXCI7XG4gICAgICBfdGVtcERpdi5zdHlsZS5jc3NUZXh0ID0gXCJib3JkZXItd2lkdGg6MDtsaW5lLWhlaWdodDowO3Bvc2l0aW9uOmFic29sdXRlO3BhZGRpbmc6MFwiO1xuICAgICAgX3N1cHBvcnRzM0QgPSAhIV9jaGVja1Byb3BQcmVmaXgoXCJwZXJzcGVjdGl2ZVwiKTtcbiAgICAgIF9wbHVnaW5Jbml0dGVkID0gMTtcbiAgICB9XG4gIH0sXG4gICAgICBfZ2V0QkJveEhhY2sgPSBmdW5jdGlvbiBfZ2V0QkJveEhhY2soc3dhcElmUG9zc2libGUpIHtcbiAgICB2YXIgc3ZnID0gX2NyZWF0ZUVsZW1lbnQoXCJzdmdcIiwgdGhpcy5vd25lclNWR0VsZW1lbnQgJiYgdGhpcy5vd25lclNWR0VsZW1lbnQuZ2V0QXR0cmlidXRlKFwieG1sbnNcIikgfHwgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiKSxcbiAgICAgICAgb2xkUGFyZW50ID0gdGhpcy5wYXJlbnROb2RlLFxuICAgICAgICBvbGRTaWJsaW5nID0gdGhpcy5uZXh0U2libGluZyxcbiAgICAgICAgb2xkQ1NTID0gdGhpcy5zdHlsZS5jc3NUZXh0LFxuICAgICAgICBiYm94O1xuXG4gICAgX2RvY0VsZW1lbnQuYXBwZW5kQ2hpbGQoc3ZnKTtcblxuICAgIHN2Zy5hcHBlbmRDaGlsZCh0aGlzKTtcbiAgICB0aGlzLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG5cbiAgICBpZiAoc3dhcElmUG9zc2libGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGJib3ggPSB0aGlzLmdldEJCb3goKTtcbiAgICAgICAgdGhpcy5fZ3NhcEJCb3ggPSB0aGlzLmdldEJCb3g7XG4gICAgICAgIHRoaXMuZ2V0QkJveCA9IF9nZXRCQm94SGFjaztcbiAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfSBlbHNlIGlmICh0aGlzLl9nc2FwQkJveCkge1xuICAgICAgYmJveCA9IHRoaXMuX2dzYXBCQm94KCk7XG4gICAgfVxuXG4gICAgaWYgKG9sZFBhcmVudCkge1xuICAgICAgaWYgKG9sZFNpYmxpbmcpIHtcbiAgICAgICAgb2xkUGFyZW50Lmluc2VydEJlZm9yZSh0aGlzLCBvbGRTaWJsaW5nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9sZFBhcmVudC5hcHBlbmRDaGlsZCh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfZG9jRWxlbWVudC5yZW1vdmVDaGlsZChzdmcpO1xuXG4gICAgdGhpcy5zdHlsZS5jc3NUZXh0ID0gb2xkQ1NTO1xuICAgIHJldHVybiBiYm94O1xuICB9LFxuICAgICAgX2dldEF0dHJpYnV0ZUZhbGxiYWNrcyA9IGZ1bmN0aW9uIF9nZXRBdHRyaWJ1dGVGYWxsYmFja3ModGFyZ2V0LCBhdHRyaWJ1dGVzQXJyYXkpIHtcbiAgICB2YXIgaSA9IGF0dHJpYnV0ZXNBcnJheS5sZW5ndGg7XG5cbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBpZiAodGFyZ2V0Lmhhc0F0dHJpYnV0ZShhdHRyaWJ1dGVzQXJyYXlbaV0pKSB7XG4gICAgICAgIHJldHVybiB0YXJnZXQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZXNBcnJheVtpXSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICAgICAgX2dldEJCb3ggPSBmdW5jdGlvbiBfZ2V0QkJveCh0YXJnZXQpIHtcbiAgICB2YXIgYm91bmRzO1xuXG4gICAgdHJ5IHtcbiAgICAgIGJvdW5kcyA9IHRhcmdldC5nZXRCQm94KCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGJvdW5kcyA9IF9nZXRCQm94SGFjay5jYWxsKHRhcmdldCwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgYm91bmRzICYmIChib3VuZHMud2lkdGggfHwgYm91bmRzLmhlaWdodCkgfHwgdGFyZ2V0LmdldEJCb3ggPT09IF9nZXRCQm94SGFjayB8fCAoYm91bmRzID0gX2dldEJCb3hIYWNrLmNhbGwodGFyZ2V0LCB0cnVlKSk7XG4gICAgcmV0dXJuIGJvdW5kcyAmJiAhYm91bmRzLndpZHRoICYmICFib3VuZHMueCAmJiAhYm91bmRzLnkgPyB7XG4gICAgICB4OiArX2dldEF0dHJpYnV0ZUZhbGxiYWNrcyh0YXJnZXQsIFtcInhcIiwgXCJjeFwiLCBcIngxXCJdKSB8fCAwLFxuICAgICAgeTogK19nZXRBdHRyaWJ1dGVGYWxsYmFja3ModGFyZ2V0LCBbXCJ5XCIsIFwiY3lcIiwgXCJ5MVwiXSkgfHwgMCxcbiAgICAgIHdpZHRoOiAwLFxuICAgICAgaGVpZ2h0OiAwXG4gICAgfSA6IGJvdW5kcztcbiAgfSxcbiAgICAgIF9pc1NWRyA9IGZ1bmN0aW9uIF9pc1NWRyhlKSB7XG4gICAgcmV0dXJuICEhKGUuZ2V0Q1RNICYmICghZS5wYXJlbnROb2RlIHx8IGUub3duZXJTVkdFbGVtZW50KSAmJiBfZ2V0QkJveChlKSk7XG4gIH0sXG4gICAgICBfcmVtb3ZlUHJvcGVydHkgPSBmdW5jdGlvbiBfcmVtb3ZlUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eSkge1xuICAgIGlmIChwcm9wZXJ0eSkge1xuICAgICAgdmFyIHN0eWxlID0gdGFyZ2V0LnN0eWxlO1xuXG4gICAgICBpZiAocHJvcGVydHkgaW4gX3RyYW5zZm9ybVByb3BzICYmIHByb3BlcnR5ICE9PSBfdHJhbnNmb3JtT3JpZ2luUHJvcCkge1xuICAgICAgICBwcm9wZXJ0eSA9IF90cmFuc2Zvcm1Qcm9wO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3R5bGUucmVtb3ZlUHJvcGVydHkpIHtcbiAgICAgICAgaWYgKHByb3BlcnR5LnN1YnN0cigwLCAyKSA9PT0gXCJtc1wiIHx8IHByb3BlcnR5LnN1YnN0cigwLCA2KSA9PT0gXCJ3ZWJraXRcIikge1xuICAgICAgICAgIHByb3BlcnR5ID0gXCItXCIgKyBwcm9wZXJ0eTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0eWxlLnJlbW92ZVByb3BlcnR5KHByb3BlcnR5LnJlcGxhY2UoX2NhcHNFeHAsIFwiLSQxXCIpLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3R5bGUucmVtb3ZlQXR0cmlidXRlKHByb3BlcnR5KTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gICAgICBfYWRkTm9uVHdlZW5pbmdQVCA9IGZ1bmN0aW9uIF9hZGROb25Ud2VlbmluZ1BUKHBsdWdpbiwgdGFyZ2V0LCBwcm9wZXJ0eSwgYmVnaW5uaW5nLCBlbmQsIG9ubHlTZXRBdEVuZCkge1xuICAgIHZhciBwdCA9IG5ldyBQcm9wVHdlZW4ocGx1Z2luLl9wdCwgdGFyZ2V0LCBwcm9wZXJ0eSwgMCwgMSwgb25seVNldEF0RW5kID8gX3JlbmRlck5vblR3ZWVuaW5nVmFsdWVPbmx5QXRFbmQgOiBfcmVuZGVyTm9uVHdlZW5pbmdWYWx1ZSk7XG4gICAgcGx1Z2luLl9wdCA9IHB0O1xuICAgIHB0LmIgPSBiZWdpbm5pbmc7XG4gICAgcHQuZSA9IGVuZDtcblxuICAgIHBsdWdpbi5fcHJvcHMucHVzaChwcm9wZXJ0eSk7XG5cbiAgICByZXR1cm4gcHQ7XG4gIH0sXG4gICAgICBfbm9uQ29udmVydGlibGVVbml0cyA9IHtcbiAgICBkZWc6IDEsXG4gICAgcmFkOiAxLFxuICAgIHR1cm46IDFcbiAgfSxcbiAgICAgIF9jb252ZXJ0VG9Vbml0ID0gZnVuY3Rpb24gX2NvbnZlcnRUb1VuaXQodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUsIHVuaXQpIHtcbiAgICB2YXIgY3VyVmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlKSB8fCAwLFxuICAgICAgICBjdXJVbml0ID0gKHZhbHVlICsgXCJcIikudHJpbSgpLnN1YnN0cigoY3VyVmFsdWUgKyBcIlwiKS5sZW5ndGgpIHx8IFwicHhcIixcbiAgICAgICAgc3R5bGUgPSBfdGVtcERpdi5zdHlsZSxcbiAgICAgICAgaG9yaXpvbnRhbCA9IF9ob3Jpem9udGFsRXhwLnRlc3QocHJvcGVydHkpLFxuICAgICAgICBpc1Jvb3RTVkcgPSB0YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcInN2Z1wiLFxuICAgICAgICBtZWFzdXJlUHJvcGVydHkgPSAoaXNSb290U1ZHID8gXCJjbGllbnRcIiA6IFwib2Zmc2V0XCIpICsgKGhvcml6b250YWwgPyBcIldpZHRoXCIgOiBcIkhlaWdodFwiKSxcbiAgICAgICAgYW1vdW50ID0gMTAwLFxuICAgICAgICB0b1BpeGVscyA9IHVuaXQgPT09IFwicHhcIixcbiAgICAgICAgdG9QZXJjZW50ID0gdW5pdCA9PT0gXCIlXCIsXG4gICAgICAgIHB4LFxuICAgICAgICBwYXJlbnQsXG4gICAgICAgIGNhY2hlLFxuICAgICAgICBpc1NWRztcblxuICAgIGlmICh1bml0ID09PSBjdXJVbml0IHx8ICFjdXJWYWx1ZSB8fCBfbm9uQ29udmVydGlibGVVbml0c1t1bml0XSB8fCBfbm9uQ29udmVydGlibGVVbml0c1tjdXJVbml0XSkge1xuICAgICAgcmV0dXJuIGN1clZhbHVlO1xuICAgIH1cblxuICAgIGN1clVuaXQgIT09IFwicHhcIiAmJiAhdG9QaXhlbHMgJiYgKGN1clZhbHVlID0gX2NvbnZlcnRUb1VuaXQodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUsIFwicHhcIikpO1xuICAgIGlzU1ZHID0gdGFyZ2V0LmdldENUTSAmJiBfaXNTVkcodGFyZ2V0KTtcblxuICAgIGlmICgodG9QZXJjZW50IHx8IGN1clVuaXQgPT09IFwiJVwiKSAmJiAoX3RyYW5zZm9ybVByb3BzW3Byb3BlcnR5XSB8fCB+cHJvcGVydHkuaW5kZXhPZihcImFkaXVzXCIpKSkge1xuICAgICAgcHggPSBpc1NWRyA/IHRhcmdldC5nZXRCQm94KClbaG9yaXpvbnRhbCA/IFwid2lkdGhcIiA6IFwiaGVpZ2h0XCJdIDogdGFyZ2V0W21lYXN1cmVQcm9wZXJ0eV07XG4gICAgICByZXR1cm4gX3JvdW5kKHRvUGVyY2VudCA/IGN1clZhbHVlIC8gcHggKiBhbW91bnQgOiBjdXJWYWx1ZSAvIDEwMCAqIHB4KTtcbiAgICB9XG5cbiAgICBzdHlsZVtob3Jpem9udGFsID8gXCJ3aWR0aFwiIDogXCJoZWlnaHRcIl0gPSBhbW91bnQgKyAodG9QaXhlbHMgPyBjdXJVbml0IDogdW5pdCk7XG4gICAgcGFyZW50ID0gfnByb3BlcnR5LmluZGV4T2YoXCJhZGl1c1wiKSB8fCB1bml0ID09PSBcImVtXCIgJiYgdGFyZ2V0LmFwcGVuZENoaWxkICYmICFpc1Jvb3RTVkcgPyB0YXJnZXQgOiB0YXJnZXQucGFyZW50Tm9kZTtcblxuICAgIGlmIChpc1NWRykge1xuICAgICAgcGFyZW50ID0gKHRhcmdldC5vd25lclNWR0VsZW1lbnQgfHwge30pLnBhcmVudE5vZGU7XG4gICAgfVxuXG4gICAgaWYgKCFwYXJlbnQgfHwgcGFyZW50ID09PSBfZG9jJDEgfHwgIXBhcmVudC5hcHBlbmRDaGlsZCkge1xuICAgICAgcGFyZW50ID0gX2RvYyQxLmJvZHk7XG4gICAgfVxuXG4gICAgY2FjaGUgPSBwYXJlbnQuX2dzYXA7XG5cbiAgICBpZiAoY2FjaGUgJiYgdG9QZXJjZW50ICYmIGNhY2hlLndpZHRoICYmIGhvcml6b250YWwgJiYgY2FjaGUudGltZSA9PT0gX3RpY2tlci50aW1lKSB7XG4gICAgICByZXR1cm4gX3JvdW5kKGN1clZhbHVlIC8gY2FjaGUud2lkdGggKiBhbW91bnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAodG9QZXJjZW50IHx8IGN1clVuaXQgPT09IFwiJVwiKSAmJiAoc3R5bGUucG9zaXRpb24gPSBfZ2V0Q29tcHV0ZWRQcm9wZXJ0eSh0YXJnZXQsIFwicG9zaXRpb25cIikpO1xuICAgICAgcGFyZW50ID09PSB0YXJnZXQgJiYgKHN0eWxlLnBvc2l0aW9uID0gXCJzdGF0aWNcIik7XG4gICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoX3RlbXBEaXYpO1xuICAgICAgcHggPSBfdGVtcERpdlttZWFzdXJlUHJvcGVydHldO1xuICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKF90ZW1wRGl2KTtcbiAgICAgIHN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuXG4gICAgICBpZiAoaG9yaXpvbnRhbCAmJiB0b1BlcmNlbnQpIHtcbiAgICAgICAgY2FjaGUgPSBfZ2V0Q2FjaGUocGFyZW50KTtcbiAgICAgICAgY2FjaGUudGltZSA9IF90aWNrZXIudGltZTtcbiAgICAgICAgY2FjaGUud2lkdGggPSBwYXJlbnRbbWVhc3VyZVByb3BlcnR5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gX3JvdW5kKHRvUGl4ZWxzID8gcHggKiBjdXJWYWx1ZSAvIGFtb3VudCA6IHB4ICYmIGN1clZhbHVlID8gYW1vdW50IC8gcHggKiBjdXJWYWx1ZSA6IDApO1xuICB9LFxuICAgICAgX2dldCA9IGZ1bmN0aW9uIF9nZXQodGFyZ2V0LCBwcm9wZXJ0eSwgdW5pdCwgdW5jYWNoZSkge1xuICAgIHZhciB2YWx1ZTtcbiAgICBfcGx1Z2luSW5pdHRlZCB8fCBfaW5pdENvcmUoKTtcblxuICAgIGlmIChwcm9wZXJ0eSBpbiBfcHJvcGVydHlBbGlhc2VzICYmIHByb3BlcnR5ICE9PSBcInRyYW5zZm9ybVwiKSB7XG4gICAgICBwcm9wZXJ0eSA9IF9wcm9wZXJ0eUFsaWFzZXNbcHJvcGVydHldO1xuXG4gICAgICBpZiAofnByb3BlcnR5LmluZGV4T2YoXCIsXCIpKSB7XG4gICAgICAgIHByb3BlcnR5ID0gcHJvcGVydHkuc3BsaXQoXCIsXCIpWzBdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChfdHJhbnNmb3JtUHJvcHNbcHJvcGVydHldICYmIHByb3BlcnR5ICE9PSBcInRyYW5zZm9ybVwiKSB7XG4gICAgICB2YWx1ZSA9IF9wYXJzZVRyYW5zZm9ybSh0YXJnZXQsIHVuY2FjaGUpO1xuICAgICAgdmFsdWUgPSBwcm9wZXJ0eSAhPT0gXCJ0cmFuc2Zvcm1PcmlnaW5cIiA/IHZhbHVlW3Byb3BlcnR5XSA6IHZhbHVlLnN2ZyA/IHZhbHVlLm9yaWdpbiA6IF9maXJzdFR3b09ubHkoX2dldENvbXB1dGVkUHJvcGVydHkodGFyZ2V0LCBfdHJhbnNmb3JtT3JpZ2luUHJvcCkpICsgXCIgXCIgKyB2YWx1ZS56T3JpZ2luICsgXCJweFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IHRhcmdldC5zdHlsZVtwcm9wZXJ0eV07XG5cbiAgICAgIGlmICghdmFsdWUgfHwgdmFsdWUgPT09IFwiYXV0b1wiIHx8IHVuY2FjaGUgfHwgfih2YWx1ZSArIFwiXCIpLmluZGV4T2YoXCJjYWxjKFwiKSkge1xuICAgICAgICB2YWx1ZSA9IF9zcGVjaWFsUHJvcHNbcHJvcGVydHldICYmIF9zcGVjaWFsUHJvcHNbcHJvcGVydHldKHRhcmdldCwgcHJvcGVydHksIHVuaXQpIHx8IF9nZXRDb21wdXRlZFByb3BlcnR5KHRhcmdldCwgcHJvcGVydHkpIHx8IF9nZXRQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5KSB8fCAocHJvcGVydHkgPT09IFwib3BhY2l0eVwiID8gMSA6IDApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB1bml0ICYmICF+KHZhbHVlICsgXCJcIikudHJpbSgpLmluZGV4T2YoXCIgXCIpID8gX2NvbnZlcnRUb1VuaXQodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUsIHVuaXQpICsgdW5pdCA6IHZhbHVlO1xuICB9LFxuICAgICAgX3R3ZWVuQ29tcGxleENTU1N0cmluZyA9IGZ1bmN0aW9uIF90d2VlbkNvbXBsZXhDU1NTdHJpbmcodGFyZ2V0LCBwcm9wLCBzdGFydCwgZW5kKSB7XG4gICAgaWYgKCFzdGFydCB8fCBzdGFydCA9PT0gXCJub25lXCIpIHtcbiAgICAgIHZhciBwID0gX2NoZWNrUHJvcFByZWZpeChwcm9wLCB0YXJnZXQsIDEpLFxuICAgICAgICAgIHMgPSBwICYmIF9nZXRDb21wdXRlZFByb3BlcnR5KHRhcmdldCwgcCwgMSk7XG5cbiAgICAgIGlmIChzICYmIHMgIT09IHN0YXJ0KSB7XG4gICAgICAgIHByb3AgPSBwO1xuICAgICAgICBzdGFydCA9IHM7XG4gICAgICB9IGVsc2UgaWYgKHByb3AgPT09IFwiYm9yZGVyQ29sb3JcIikge1xuICAgICAgICBzdGFydCA9IF9nZXRDb21wdXRlZFByb3BlcnR5KHRhcmdldCwgXCJib3JkZXJUb3BDb2xvclwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHQgPSBuZXcgUHJvcFR3ZWVuKHRoaXMuX3B0LCB0YXJnZXQuc3R5bGUsIHByb3AsIDAsIDEsIF9yZW5kZXJDb21wbGV4U3RyaW5nKSxcbiAgICAgICAgaW5kZXggPSAwLFxuICAgICAgICBtYXRjaEluZGV4ID0gMCxcbiAgICAgICAgYSxcbiAgICAgICAgcmVzdWx0LFxuICAgICAgICBzdGFydFZhbHVlcyxcbiAgICAgICAgc3RhcnROdW0sXG4gICAgICAgIGNvbG9yLFxuICAgICAgICBzdGFydFZhbHVlLFxuICAgICAgICBlbmRWYWx1ZSxcbiAgICAgICAgZW5kTnVtLFxuICAgICAgICBjaHVuayxcbiAgICAgICAgZW5kVW5pdCxcbiAgICAgICAgc3RhcnRVbml0LFxuICAgICAgICBlbmRWYWx1ZXM7XG4gICAgcHQuYiA9IHN0YXJ0O1xuICAgIHB0LmUgPSBlbmQ7XG4gICAgc3RhcnQgKz0gXCJcIjtcbiAgICBlbmQgKz0gXCJcIjtcblxuICAgIGlmIChlbmQgPT09IFwiYXV0b1wiKSB7XG4gICAgICB0YXJnZXQuc3R5bGVbcHJvcF0gPSBlbmQ7XG4gICAgICBlbmQgPSBfZ2V0Q29tcHV0ZWRQcm9wZXJ0eSh0YXJnZXQsIHByb3ApIHx8IGVuZDtcbiAgICAgIHRhcmdldC5zdHlsZVtwcm9wXSA9IHN0YXJ0O1xuICAgIH1cblxuICAgIGEgPSBbc3RhcnQsIGVuZF07XG5cbiAgICBfY29sb3JTdHJpbmdGaWx0ZXIoYSk7XG5cbiAgICBzdGFydCA9IGFbMF07XG4gICAgZW5kID0gYVsxXTtcbiAgICBzdGFydFZhbHVlcyA9IHN0YXJ0Lm1hdGNoKF9udW1XaXRoVW5pdEV4cCkgfHwgW107XG4gICAgZW5kVmFsdWVzID0gZW5kLm1hdGNoKF9udW1XaXRoVW5pdEV4cCkgfHwgW107XG5cbiAgICBpZiAoZW5kVmFsdWVzLmxlbmd0aCkge1xuICAgICAgd2hpbGUgKHJlc3VsdCA9IF9udW1XaXRoVW5pdEV4cC5leGVjKGVuZCkpIHtcbiAgICAgICAgZW5kVmFsdWUgPSByZXN1bHRbMF07XG4gICAgICAgIGNodW5rID0gZW5kLnN1YnN0cmluZyhpbmRleCwgcmVzdWx0LmluZGV4KTtcblxuICAgICAgICBpZiAoY29sb3IpIHtcbiAgICAgICAgICBjb2xvciA9IChjb2xvciArIDEpICUgNTtcbiAgICAgICAgfSBlbHNlIGlmIChjaHVuay5zdWJzdHIoLTUpID09PSBcInJnYmEoXCIgfHwgY2h1bmsuc3Vic3RyKC01KSA9PT0gXCJoc2xhKFwiKSB7XG4gICAgICAgICAgY29sb3IgPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZFZhbHVlICE9PSAoc3RhcnRWYWx1ZSA9IHN0YXJ0VmFsdWVzW21hdGNoSW5kZXgrK10gfHwgXCJcIikpIHtcbiAgICAgICAgICBzdGFydE51bSA9IHBhcnNlRmxvYXQoc3RhcnRWYWx1ZSkgfHwgMDtcbiAgICAgICAgICBzdGFydFVuaXQgPSBzdGFydFZhbHVlLnN1YnN0cigoc3RhcnROdW0gKyBcIlwiKS5sZW5ndGgpO1xuICAgICAgICAgIGVuZFZhbHVlLmNoYXJBdCgxKSA9PT0gXCI9XCIgJiYgKGVuZFZhbHVlID0gX3BhcnNlUmVsYXRpdmUoc3RhcnROdW0sIGVuZFZhbHVlKSArIHN0YXJ0VW5pdCk7XG4gICAgICAgICAgZW5kTnVtID0gcGFyc2VGbG9hdChlbmRWYWx1ZSk7XG4gICAgICAgICAgZW5kVW5pdCA9IGVuZFZhbHVlLnN1YnN0cigoZW5kTnVtICsgXCJcIikubGVuZ3RoKTtcbiAgICAgICAgICBpbmRleCA9IF9udW1XaXRoVW5pdEV4cC5sYXN0SW5kZXggLSBlbmRVbml0Lmxlbmd0aDtcblxuICAgICAgICAgIGlmICghZW5kVW5pdCkge1xuICAgICAgICAgICAgZW5kVW5pdCA9IGVuZFVuaXQgfHwgX2NvbmZpZy51bml0c1twcm9wXSB8fCBzdGFydFVuaXQ7XG5cbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gZW5kLmxlbmd0aCkge1xuICAgICAgICAgICAgICBlbmQgKz0gZW5kVW5pdDtcbiAgICAgICAgICAgICAgcHQuZSArPSBlbmRVbml0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzdGFydFVuaXQgIT09IGVuZFVuaXQpIHtcbiAgICAgICAgICAgIHN0YXJ0TnVtID0gX2NvbnZlcnRUb1VuaXQodGFyZ2V0LCBwcm9wLCBzdGFydFZhbHVlLCBlbmRVbml0KSB8fCAwO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHB0Ll9wdCA9IHtcbiAgICAgICAgICAgIF9uZXh0OiBwdC5fcHQsXG4gICAgICAgICAgICBwOiBjaHVuayB8fCBtYXRjaEluZGV4ID09PSAxID8gY2h1bmsgOiBcIixcIixcbiAgICAgICAgICAgIHM6IHN0YXJ0TnVtLFxuICAgICAgICAgICAgYzogZW5kTnVtIC0gc3RhcnROdW0sXG4gICAgICAgICAgICBtOiBjb2xvciAmJiBjb2xvciA8IDQgfHwgcHJvcCA9PT0gXCJ6SW5kZXhcIiA/IE1hdGgucm91bmQgOiAwXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBwdC5jID0gaW5kZXggPCBlbmQubGVuZ3RoID8gZW5kLnN1YnN0cmluZyhpbmRleCwgZW5kLmxlbmd0aCkgOiBcIlwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBwdC5yID0gcHJvcCA9PT0gXCJkaXNwbGF5XCIgJiYgZW5kID09PSBcIm5vbmVcIiA/IF9yZW5kZXJOb25Ud2VlbmluZ1ZhbHVlT25seUF0RW5kIDogX3JlbmRlck5vblR3ZWVuaW5nVmFsdWU7XG4gICAgfVxuXG4gICAgX3JlbEV4cC50ZXN0KGVuZCkgJiYgKHB0LmUgPSAwKTtcbiAgICB0aGlzLl9wdCA9IHB0O1xuICAgIHJldHVybiBwdDtcbiAgfSxcbiAgICAgIF9rZXl3b3JkVG9QZXJjZW50ID0ge1xuICAgIHRvcDogXCIwJVwiLFxuICAgIGJvdHRvbTogXCIxMDAlXCIsXG4gICAgbGVmdDogXCIwJVwiLFxuICAgIHJpZ2h0OiBcIjEwMCVcIixcbiAgICBjZW50ZXI6IFwiNTAlXCJcbiAgfSxcbiAgICAgIF9jb252ZXJ0S2V5d29yZHNUb1BlcmNlbnRhZ2VzID0gZnVuY3Rpb24gX2NvbnZlcnRLZXl3b3Jkc1RvUGVyY2VudGFnZXModmFsdWUpIHtcbiAgICB2YXIgc3BsaXQgPSB2YWx1ZS5zcGxpdChcIiBcIiksXG4gICAgICAgIHggPSBzcGxpdFswXSxcbiAgICAgICAgeSA9IHNwbGl0WzFdIHx8IFwiNTAlXCI7XG5cbiAgICBpZiAoeCA9PT0gXCJ0b3BcIiB8fCB4ID09PSBcImJvdHRvbVwiIHx8IHkgPT09IFwibGVmdFwiIHx8IHkgPT09IFwicmlnaHRcIikge1xuICAgICAgdmFsdWUgPSB4O1xuICAgICAgeCA9IHk7XG4gICAgICB5ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgc3BsaXRbMF0gPSBfa2V5d29yZFRvUGVyY2VudFt4XSB8fCB4O1xuICAgIHNwbGl0WzFdID0gX2tleXdvcmRUb1BlcmNlbnRbeV0gfHwgeTtcbiAgICByZXR1cm4gc3BsaXQuam9pbihcIiBcIik7XG4gIH0sXG4gICAgICBfcmVuZGVyQ2xlYXJQcm9wcyA9IGZ1bmN0aW9uIF9yZW5kZXJDbGVhclByb3BzKHJhdGlvLCBkYXRhKSB7XG4gICAgaWYgKGRhdGEudHdlZW4gJiYgZGF0YS50d2Vlbi5fdGltZSA9PT0gZGF0YS50d2Vlbi5fZHVyKSB7XG4gICAgICB2YXIgdGFyZ2V0ID0gZGF0YS50LFxuICAgICAgICAgIHN0eWxlID0gdGFyZ2V0LnN0eWxlLFxuICAgICAgICAgIHByb3BzID0gZGF0YS51LFxuICAgICAgICAgIGNhY2hlID0gdGFyZ2V0Ll9nc2FwLFxuICAgICAgICAgIHByb3AsXG4gICAgICAgICAgY2xlYXJUcmFuc2Zvcm1zLFxuICAgICAgICAgIGk7XG5cbiAgICAgIGlmIChwcm9wcyA9PT0gXCJhbGxcIiB8fCBwcm9wcyA9PT0gdHJ1ZSkge1xuICAgICAgICBzdHlsZS5jc3NUZXh0ID0gXCJcIjtcbiAgICAgICAgY2xlYXJUcmFuc2Zvcm1zID0gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb3BzID0gcHJvcHMuc3BsaXQoXCIsXCIpO1xuICAgICAgICBpID0gcHJvcHMubGVuZ3RoO1xuXG4gICAgICAgIHdoaWxlICgtLWkgPiAtMSkge1xuICAgICAgICAgIHByb3AgPSBwcm9wc1tpXTtcblxuICAgICAgICAgIGlmIChfdHJhbnNmb3JtUHJvcHNbcHJvcF0pIHtcbiAgICAgICAgICAgIGNsZWFyVHJhbnNmb3JtcyA9IDE7XG4gICAgICAgICAgICBwcm9wID0gcHJvcCA9PT0gXCJ0cmFuc2Zvcm1PcmlnaW5cIiA/IF90cmFuc2Zvcm1PcmlnaW5Qcm9wIDogX3RyYW5zZm9ybVByb3A7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgX3JlbW92ZVByb3BlcnR5KHRhcmdldCwgcHJvcCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGNsZWFyVHJhbnNmb3Jtcykge1xuICAgICAgICBfcmVtb3ZlUHJvcGVydHkodGFyZ2V0LCBfdHJhbnNmb3JtUHJvcCk7XG5cbiAgICAgICAgaWYgKGNhY2hlKSB7XG4gICAgICAgICAgY2FjaGUuc3ZnICYmIHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIik7XG5cbiAgICAgICAgICBfcGFyc2VUcmFuc2Zvcm0odGFyZ2V0LCAxKTtcblxuICAgICAgICAgIGNhY2hlLnVuY2FjaGUgPSAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICAgICAgX3NwZWNpYWxQcm9wcyA9IHtcbiAgICBjbGVhclByb3BzOiBmdW5jdGlvbiBjbGVhclByb3BzKHBsdWdpbiwgdGFyZ2V0LCBwcm9wZXJ0eSwgZW5kVmFsdWUsIHR3ZWVuKSB7XG4gICAgICBpZiAodHdlZW4uZGF0YSAhPT0gXCJpc0Zyb21TdGFydFwiKSB7XG4gICAgICAgIHZhciBwdCA9IHBsdWdpbi5fcHQgPSBuZXcgUHJvcFR3ZWVuKHBsdWdpbi5fcHQsIHRhcmdldCwgcHJvcGVydHksIDAsIDAsIF9yZW5kZXJDbGVhclByb3BzKTtcbiAgICAgICAgcHQudSA9IGVuZFZhbHVlO1xuICAgICAgICBwdC5wciA9IC0xMDtcbiAgICAgICAgcHQudHdlZW4gPSB0d2VlbjtcblxuICAgICAgICBwbHVnaW4uX3Byb3BzLnB1c2gocHJvcGVydHkpO1xuXG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgICAgIF9pZGVudGl0eTJETWF0cml4ID0gWzEsIDAsIDAsIDEsIDAsIDBdLFxuICAgICAgX3JvdGF0aW9uYWxQcm9wZXJ0aWVzID0ge30sXG4gICAgICBfaXNOdWxsVHJhbnNmb3JtID0gZnVuY3Rpb24gX2lzTnVsbFRyYW5zZm9ybSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gXCJtYXRyaXgoMSwgMCwgMCwgMSwgMCwgMClcIiB8fCB2YWx1ZSA9PT0gXCJub25lXCIgfHwgIXZhbHVlO1xuICB9LFxuICAgICAgX2dldENvbXB1dGVkVHJhbnNmb3JtTWF0cml4QXNBcnJheSA9IGZ1bmN0aW9uIF9nZXRDb21wdXRlZFRyYW5zZm9ybU1hdHJpeEFzQXJyYXkodGFyZ2V0KSB7XG4gICAgdmFyIG1hdHJpeFN0cmluZyA9IF9nZXRDb21wdXRlZFByb3BlcnR5KHRhcmdldCwgX3RyYW5zZm9ybVByb3ApO1xuXG4gICAgcmV0dXJuIF9pc051bGxUcmFuc2Zvcm0obWF0cml4U3RyaW5nKSA/IF9pZGVudGl0eTJETWF0cml4IDogbWF0cml4U3RyaW5nLnN1YnN0cig3KS5tYXRjaChfbnVtRXhwKS5tYXAoX3JvdW5kKTtcbiAgfSxcbiAgICAgIF9nZXRNYXRyaXggPSBmdW5jdGlvbiBfZ2V0TWF0cml4KHRhcmdldCwgZm9yY2UyRCkge1xuICAgIHZhciBjYWNoZSA9IHRhcmdldC5fZ3NhcCB8fCBfZ2V0Q2FjaGUodGFyZ2V0KSxcbiAgICAgICAgc3R5bGUgPSB0YXJnZXQuc3R5bGUsXG4gICAgICAgIG1hdHJpeCA9IF9nZXRDb21wdXRlZFRyYW5zZm9ybU1hdHJpeEFzQXJyYXkodGFyZ2V0KSxcbiAgICAgICAgcGFyZW50LFxuICAgICAgICBuZXh0U2libGluZyxcbiAgICAgICAgdGVtcCxcbiAgICAgICAgYWRkZWRUb0RPTTtcblxuICAgIGlmIChjYWNoZS5zdmcgJiYgdGFyZ2V0LmdldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiKSkge1xuICAgICAgdGVtcCA9IHRhcmdldC50cmFuc2Zvcm0uYmFzZVZhbC5jb25zb2xpZGF0ZSgpLm1hdHJpeDtcbiAgICAgIG1hdHJpeCA9IFt0ZW1wLmEsIHRlbXAuYiwgdGVtcC5jLCB0ZW1wLmQsIHRlbXAuZSwgdGVtcC5mXTtcbiAgICAgIHJldHVybiBtYXRyaXguam9pbihcIixcIikgPT09IFwiMSwwLDAsMSwwLDBcIiA/IF9pZGVudGl0eTJETWF0cml4IDogbWF0cml4O1xuICAgIH0gZWxzZSBpZiAobWF0cml4ID09PSBfaWRlbnRpdHkyRE1hdHJpeCAmJiAhdGFyZ2V0Lm9mZnNldFBhcmVudCAmJiB0YXJnZXQgIT09IF9kb2NFbGVtZW50ICYmICFjYWNoZS5zdmcpIHtcbiAgICAgIHRlbXAgPSBzdHlsZS5kaXNwbGF5O1xuICAgICAgc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgIHBhcmVudCA9IHRhcmdldC5wYXJlbnROb2RlO1xuXG4gICAgICBpZiAoIXBhcmVudCB8fCAhdGFyZ2V0Lm9mZnNldFBhcmVudCkge1xuICAgICAgICBhZGRlZFRvRE9NID0gMTtcbiAgICAgICAgbmV4dFNpYmxpbmcgPSB0YXJnZXQubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgX2RvY0VsZW1lbnQuYXBwZW5kQ2hpbGQodGFyZ2V0KTtcbiAgICAgIH1cblxuICAgICAgbWF0cml4ID0gX2dldENvbXB1dGVkVHJhbnNmb3JtTWF0cml4QXNBcnJheSh0YXJnZXQpO1xuICAgICAgdGVtcCA/IHN0eWxlLmRpc3BsYXkgPSB0ZW1wIDogX3JlbW92ZVByb3BlcnR5KHRhcmdldCwgXCJkaXNwbGF5XCIpO1xuXG4gICAgICBpZiAoYWRkZWRUb0RPTSkge1xuICAgICAgICBuZXh0U2libGluZyA/IHBhcmVudC5pbnNlcnRCZWZvcmUodGFyZ2V0LCBuZXh0U2libGluZykgOiBwYXJlbnQgPyBwYXJlbnQuYXBwZW5kQ2hpbGQodGFyZ2V0KSA6IF9kb2NFbGVtZW50LnJlbW92ZUNoaWxkKHRhcmdldCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZvcmNlMkQgJiYgbWF0cml4Lmxlbmd0aCA+IDYgPyBbbWF0cml4WzBdLCBtYXRyaXhbMV0sIG1hdHJpeFs0XSwgbWF0cml4WzVdLCBtYXRyaXhbMTJdLCBtYXRyaXhbMTNdXSA6IG1hdHJpeDtcbiAgfSxcbiAgICAgIF9hcHBseVNWR09yaWdpbiA9IGZ1bmN0aW9uIF9hcHBseVNWR09yaWdpbih0YXJnZXQsIG9yaWdpbiwgb3JpZ2luSXNBYnNvbHV0ZSwgc21vb3RoLCBtYXRyaXhBcnJheSwgcGx1Z2luVG9BZGRQcm9wVHdlZW5zVG8pIHtcbiAgICB2YXIgY2FjaGUgPSB0YXJnZXQuX2dzYXAsXG4gICAgICAgIG1hdHJpeCA9IG1hdHJpeEFycmF5IHx8IF9nZXRNYXRyaXgodGFyZ2V0LCB0cnVlKSxcbiAgICAgICAgeE9yaWdpbk9sZCA9IGNhY2hlLnhPcmlnaW4gfHwgMCxcbiAgICAgICAgeU9yaWdpbk9sZCA9IGNhY2hlLnlPcmlnaW4gfHwgMCxcbiAgICAgICAgeE9mZnNldE9sZCA9IGNhY2hlLnhPZmZzZXQgfHwgMCxcbiAgICAgICAgeU9mZnNldE9sZCA9IGNhY2hlLnlPZmZzZXQgfHwgMCxcbiAgICAgICAgYSA9IG1hdHJpeFswXSxcbiAgICAgICAgYiA9IG1hdHJpeFsxXSxcbiAgICAgICAgYyA9IG1hdHJpeFsyXSxcbiAgICAgICAgZCA9IG1hdHJpeFszXSxcbiAgICAgICAgdHggPSBtYXRyaXhbNF0sXG4gICAgICAgIHR5ID0gbWF0cml4WzVdLFxuICAgICAgICBvcmlnaW5TcGxpdCA9IG9yaWdpbi5zcGxpdChcIiBcIiksXG4gICAgICAgIHhPcmlnaW4gPSBwYXJzZUZsb2F0KG9yaWdpblNwbGl0WzBdKSB8fCAwLFxuICAgICAgICB5T3JpZ2luID0gcGFyc2VGbG9hdChvcmlnaW5TcGxpdFsxXSkgfHwgMCxcbiAgICAgICAgYm91bmRzLFxuICAgICAgICBkZXRlcm1pbmFudCxcbiAgICAgICAgeCxcbiAgICAgICAgeTtcblxuICAgIGlmICghb3JpZ2luSXNBYnNvbHV0ZSkge1xuICAgICAgYm91bmRzID0gX2dldEJCb3godGFyZ2V0KTtcbiAgICAgIHhPcmlnaW4gPSBib3VuZHMueCArICh+b3JpZ2luU3BsaXRbMF0uaW5kZXhPZihcIiVcIikgPyB4T3JpZ2luIC8gMTAwICogYm91bmRzLndpZHRoIDogeE9yaWdpbik7XG4gICAgICB5T3JpZ2luID0gYm91bmRzLnkgKyAofihvcmlnaW5TcGxpdFsxXSB8fCBvcmlnaW5TcGxpdFswXSkuaW5kZXhPZihcIiVcIikgPyB5T3JpZ2luIC8gMTAwICogYm91bmRzLmhlaWdodCA6IHlPcmlnaW4pO1xuICAgIH0gZWxzZSBpZiAobWF0cml4ICE9PSBfaWRlbnRpdHkyRE1hdHJpeCAmJiAoZGV0ZXJtaW5hbnQgPSBhICogZCAtIGIgKiBjKSkge1xuICAgICAgeCA9IHhPcmlnaW4gKiAoZCAvIGRldGVybWluYW50KSArIHlPcmlnaW4gKiAoLWMgLyBkZXRlcm1pbmFudCkgKyAoYyAqIHR5IC0gZCAqIHR4KSAvIGRldGVybWluYW50O1xuICAgICAgeSA9IHhPcmlnaW4gKiAoLWIgLyBkZXRlcm1pbmFudCkgKyB5T3JpZ2luICogKGEgLyBkZXRlcm1pbmFudCkgLSAoYSAqIHR5IC0gYiAqIHR4KSAvIGRldGVybWluYW50O1xuICAgICAgeE9yaWdpbiA9IHg7XG4gICAgICB5T3JpZ2luID0geTtcbiAgICB9XG5cbiAgICBpZiAoc21vb3RoIHx8IHNtb290aCAhPT0gZmFsc2UgJiYgY2FjaGUuc21vb3RoKSB7XG4gICAgICB0eCA9IHhPcmlnaW4gLSB4T3JpZ2luT2xkO1xuICAgICAgdHkgPSB5T3JpZ2luIC0geU9yaWdpbk9sZDtcbiAgICAgIGNhY2hlLnhPZmZzZXQgPSB4T2Zmc2V0T2xkICsgKHR4ICogYSArIHR5ICogYykgLSB0eDtcbiAgICAgIGNhY2hlLnlPZmZzZXQgPSB5T2Zmc2V0T2xkICsgKHR4ICogYiArIHR5ICogZCkgLSB0eTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FjaGUueE9mZnNldCA9IGNhY2hlLnlPZmZzZXQgPSAwO1xuICAgIH1cblxuICAgIGNhY2hlLnhPcmlnaW4gPSB4T3JpZ2luO1xuICAgIGNhY2hlLnlPcmlnaW4gPSB5T3JpZ2luO1xuICAgIGNhY2hlLnNtb290aCA9ICEhc21vb3RoO1xuICAgIGNhY2hlLm9yaWdpbiA9IG9yaWdpbjtcbiAgICBjYWNoZS5vcmlnaW5Jc0Fic29sdXRlID0gISFvcmlnaW5Jc0Fic29sdXRlO1xuICAgIHRhcmdldC5zdHlsZVtfdHJhbnNmb3JtT3JpZ2luUHJvcF0gPSBcIjBweCAwcHhcIjtcblxuICAgIGlmIChwbHVnaW5Ub0FkZFByb3BUd2VlbnNUbykge1xuICAgICAgX2FkZE5vblR3ZWVuaW5nUFQocGx1Z2luVG9BZGRQcm9wVHdlZW5zVG8sIGNhY2hlLCBcInhPcmlnaW5cIiwgeE9yaWdpbk9sZCwgeE9yaWdpbik7XG5cbiAgICAgIF9hZGROb25Ud2VlbmluZ1BUKHBsdWdpblRvQWRkUHJvcFR3ZWVuc1RvLCBjYWNoZSwgXCJ5T3JpZ2luXCIsIHlPcmlnaW5PbGQsIHlPcmlnaW4pO1xuXG4gICAgICBfYWRkTm9uVHdlZW5pbmdQVChwbHVnaW5Ub0FkZFByb3BUd2VlbnNUbywgY2FjaGUsIFwieE9mZnNldFwiLCB4T2Zmc2V0T2xkLCBjYWNoZS54T2Zmc2V0KTtcblxuICAgICAgX2FkZE5vblR3ZWVuaW5nUFQocGx1Z2luVG9BZGRQcm9wVHdlZW5zVG8sIGNhY2hlLCBcInlPZmZzZXRcIiwgeU9mZnNldE9sZCwgY2FjaGUueU9mZnNldCk7XG4gICAgfVxuXG4gICAgdGFyZ2V0LnNldEF0dHJpYnV0ZShcImRhdGEtc3ZnLW9yaWdpblwiLCB4T3JpZ2luICsgXCIgXCIgKyB5T3JpZ2luKTtcbiAgfSxcbiAgICAgIF9wYXJzZVRyYW5zZm9ybSA9IGZ1bmN0aW9uIF9wYXJzZVRyYW5zZm9ybSh0YXJnZXQsIHVuY2FjaGUpIHtcbiAgICB2YXIgY2FjaGUgPSB0YXJnZXQuX2dzYXAgfHwgbmV3IEdTQ2FjaGUodGFyZ2V0KTtcblxuICAgIGlmIChcInhcIiBpbiBjYWNoZSAmJiAhdW5jYWNoZSAmJiAhY2FjaGUudW5jYWNoZSkge1xuICAgICAgcmV0dXJuIGNhY2hlO1xuICAgIH1cblxuICAgIHZhciBzdHlsZSA9IHRhcmdldC5zdHlsZSxcbiAgICAgICAgaW52ZXJ0ZWRTY2FsZVggPSBjYWNoZS5zY2FsZVggPCAwLFxuICAgICAgICBweCA9IFwicHhcIixcbiAgICAgICAgZGVnID0gXCJkZWdcIixcbiAgICAgICAgb3JpZ2luID0gX2dldENvbXB1dGVkUHJvcGVydHkodGFyZ2V0LCBfdHJhbnNmb3JtT3JpZ2luUHJvcCkgfHwgXCIwXCIsXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHosXG4gICAgICAgIHNjYWxlWCxcbiAgICAgICAgc2NhbGVZLFxuICAgICAgICByb3RhdGlvbixcbiAgICAgICAgcm90YXRpb25YLFxuICAgICAgICByb3RhdGlvblksXG4gICAgICAgIHNrZXdYLFxuICAgICAgICBza2V3WSxcbiAgICAgICAgcGVyc3BlY3RpdmUsXG4gICAgICAgIHhPcmlnaW4sXG4gICAgICAgIHlPcmlnaW4sXG4gICAgICAgIG1hdHJpeCxcbiAgICAgICAgYW5nbGUsXG4gICAgICAgIGNvcyxcbiAgICAgICAgc2luLFxuICAgICAgICBhLFxuICAgICAgICBiLFxuICAgICAgICBjLFxuICAgICAgICBkLFxuICAgICAgICBhMTIsXG4gICAgICAgIGEyMixcbiAgICAgICAgdDEsXG4gICAgICAgIHQyLFxuICAgICAgICB0MyxcbiAgICAgICAgYTEzLFxuICAgICAgICBhMjMsXG4gICAgICAgIGEzMyxcbiAgICAgICAgYTQyLFxuICAgICAgICBhNDMsXG4gICAgICAgIGEzMjtcbiAgICB4ID0geSA9IHogPSByb3RhdGlvbiA9IHJvdGF0aW9uWCA9IHJvdGF0aW9uWSA9IHNrZXdYID0gc2tld1kgPSBwZXJzcGVjdGl2ZSA9IDA7XG4gICAgc2NhbGVYID0gc2NhbGVZID0gMTtcbiAgICBjYWNoZS5zdmcgPSAhISh0YXJnZXQuZ2V0Q1RNICYmIF9pc1NWRyh0YXJnZXQpKTtcbiAgICBtYXRyaXggPSBfZ2V0TWF0cml4KHRhcmdldCwgY2FjaGUuc3ZnKTtcblxuICAgIGlmIChjYWNoZS5zdmcpIHtcbiAgICAgIHQxID0gKCFjYWNoZS51bmNhY2hlIHx8IG9yaWdpbiA9PT0gXCIwcHggMHB4XCIpICYmICF1bmNhY2hlICYmIHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN2Zy1vcmlnaW5cIik7XG5cbiAgICAgIF9hcHBseVNWR09yaWdpbih0YXJnZXQsIHQxIHx8IG9yaWdpbiwgISF0MSB8fCBjYWNoZS5vcmlnaW5Jc0Fic29sdXRlLCBjYWNoZS5zbW9vdGggIT09IGZhbHNlLCBtYXRyaXgpO1xuICAgIH1cblxuICAgIHhPcmlnaW4gPSBjYWNoZS54T3JpZ2luIHx8IDA7XG4gICAgeU9yaWdpbiA9IGNhY2hlLnlPcmlnaW4gfHwgMDtcblxuICAgIGlmIChtYXRyaXggIT09IF9pZGVudGl0eTJETWF0cml4KSB7XG4gICAgICBhID0gbWF0cml4WzBdO1xuICAgICAgYiA9IG1hdHJpeFsxXTtcbiAgICAgIGMgPSBtYXRyaXhbMl07XG4gICAgICBkID0gbWF0cml4WzNdO1xuICAgICAgeCA9IGExMiA9IG1hdHJpeFs0XTtcbiAgICAgIHkgPSBhMjIgPSBtYXRyaXhbNV07XG5cbiAgICAgIGlmIChtYXRyaXgubGVuZ3RoID09PSA2KSB7XG4gICAgICAgIHNjYWxlWCA9IE1hdGguc3FydChhICogYSArIGIgKiBiKTtcbiAgICAgICAgc2NhbGVZID0gTWF0aC5zcXJ0KGQgKiBkICsgYyAqIGMpO1xuICAgICAgICByb3RhdGlvbiA9IGEgfHwgYiA/IF9hdGFuMihiLCBhKSAqIF9SQUQyREVHIDogMDtcbiAgICAgICAgc2tld1ggPSBjIHx8IGQgPyBfYXRhbjIoYywgZCkgKiBfUkFEMkRFRyArIHJvdGF0aW9uIDogMDtcbiAgICAgICAgc2tld1ggJiYgKHNjYWxlWSAqPSBNYXRoLmFicyhNYXRoLmNvcyhza2V3WCAqIF9ERUcyUkFEKSkpO1xuXG4gICAgICAgIGlmIChjYWNoZS5zdmcpIHtcbiAgICAgICAgICB4IC09IHhPcmlnaW4gLSAoeE9yaWdpbiAqIGEgKyB5T3JpZ2luICogYyk7XG4gICAgICAgICAgeSAtPSB5T3JpZ2luIC0gKHhPcmlnaW4gKiBiICsgeU9yaWdpbiAqIGQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhMzIgPSBtYXRyaXhbNl07XG4gICAgICAgIGE0MiA9IG1hdHJpeFs3XTtcbiAgICAgICAgYTEzID0gbWF0cml4WzhdO1xuICAgICAgICBhMjMgPSBtYXRyaXhbOV07XG4gICAgICAgIGEzMyA9IG1hdHJpeFsxMF07XG4gICAgICAgIGE0MyA9IG1hdHJpeFsxMV07XG4gICAgICAgIHggPSBtYXRyaXhbMTJdO1xuICAgICAgICB5ID0gbWF0cml4WzEzXTtcbiAgICAgICAgeiA9IG1hdHJpeFsxNF07XG4gICAgICAgIGFuZ2xlID0gX2F0YW4yKGEzMiwgYTMzKTtcbiAgICAgICAgcm90YXRpb25YID0gYW5nbGUgKiBfUkFEMkRFRztcblxuICAgICAgICBpZiAoYW5nbGUpIHtcbiAgICAgICAgICBjb3MgPSBNYXRoLmNvcygtYW5nbGUpO1xuICAgICAgICAgIHNpbiA9IE1hdGguc2luKC1hbmdsZSk7XG4gICAgICAgICAgdDEgPSBhMTIgKiBjb3MgKyBhMTMgKiBzaW47XG4gICAgICAgICAgdDIgPSBhMjIgKiBjb3MgKyBhMjMgKiBzaW47XG4gICAgICAgICAgdDMgPSBhMzIgKiBjb3MgKyBhMzMgKiBzaW47XG4gICAgICAgICAgYTEzID0gYTEyICogLXNpbiArIGExMyAqIGNvcztcbiAgICAgICAgICBhMjMgPSBhMjIgKiAtc2luICsgYTIzICogY29zO1xuICAgICAgICAgIGEzMyA9IGEzMiAqIC1zaW4gKyBhMzMgKiBjb3M7XG4gICAgICAgICAgYTQzID0gYTQyICogLXNpbiArIGE0MyAqIGNvcztcbiAgICAgICAgICBhMTIgPSB0MTtcbiAgICAgICAgICBhMjIgPSB0MjtcbiAgICAgICAgICBhMzIgPSB0MztcbiAgICAgICAgfVxuXG4gICAgICAgIGFuZ2xlID0gX2F0YW4yKC1jLCBhMzMpO1xuICAgICAgICByb3RhdGlvblkgPSBhbmdsZSAqIF9SQUQyREVHO1xuXG4gICAgICAgIGlmIChhbmdsZSkge1xuICAgICAgICAgIGNvcyA9IE1hdGguY29zKC1hbmdsZSk7XG4gICAgICAgICAgc2luID0gTWF0aC5zaW4oLWFuZ2xlKTtcbiAgICAgICAgICB0MSA9IGEgKiBjb3MgLSBhMTMgKiBzaW47XG4gICAgICAgICAgdDIgPSBiICogY29zIC0gYTIzICogc2luO1xuICAgICAgICAgIHQzID0gYyAqIGNvcyAtIGEzMyAqIHNpbjtcbiAgICAgICAgICBhNDMgPSBkICogc2luICsgYTQzICogY29zO1xuICAgICAgICAgIGEgPSB0MTtcbiAgICAgICAgICBiID0gdDI7XG4gICAgICAgICAgYyA9IHQzO1xuICAgICAgICB9XG5cbiAgICAgICAgYW5nbGUgPSBfYXRhbjIoYiwgYSk7XG4gICAgICAgIHJvdGF0aW9uID0gYW5nbGUgKiBfUkFEMkRFRztcblxuICAgICAgICBpZiAoYW5nbGUpIHtcbiAgICAgICAgICBjb3MgPSBNYXRoLmNvcyhhbmdsZSk7XG4gICAgICAgICAgc2luID0gTWF0aC5zaW4oYW5nbGUpO1xuICAgICAgICAgIHQxID0gYSAqIGNvcyArIGIgKiBzaW47XG4gICAgICAgICAgdDIgPSBhMTIgKiBjb3MgKyBhMjIgKiBzaW47XG4gICAgICAgICAgYiA9IGIgKiBjb3MgLSBhICogc2luO1xuICAgICAgICAgIGEyMiA9IGEyMiAqIGNvcyAtIGExMiAqIHNpbjtcbiAgICAgICAgICBhID0gdDE7XG4gICAgICAgICAgYTEyID0gdDI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocm90YXRpb25YICYmIE1hdGguYWJzKHJvdGF0aW9uWCkgKyBNYXRoLmFicyhyb3RhdGlvbikgPiAzNTkuOSkge1xuICAgICAgICAgIHJvdGF0aW9uWCA9IHJvdGF0aW9uID0gMDtcbiAgICAgICAgICByb3RhdGlvblkgPSAxODAgLSByb3RhdGlvblk7XG4gICAgICAgIH1cblxuICAgICAgICBzY2FsZVggPSBfcm91bmQoTWF0aC5zcXJ0KGEgKiBhICsgYiAqIGIgKyBjICogYykpO1xuICAgICAgICBzY2FsZVkgPSBfcm91bmQoTWF0aC5zcXJ0KGEyMiAqIGEyMiArIGEzMiAqIGEzMikpO1xuICAgICAgICBhbmdsZSA9IF9hdGFuMihhMTIsIGEyMik7XG4gICAgICAgIHNrZXdYID0gTWF0aC5hYnMoYW5nbGUpID4gMC4wMDAyID8gYW5nbGUgKiBfUkFEMkRFRyA6IDA7XG4gICAgICAgIHBlcnNwZWN0aXZlID0gYTQzID8gMSAvIChhNDMgPCAwID8gLWE0MyA6IGE0MykgOiAwO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2FjaGUuc3ZnKSB7XG4gICAgICAgIHQxID0gdGFyZ2V0LmdldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiKTtcbiAgICAgICAgY2FjaGUuZm9yY2VDU1MgPSB0YXJnZXQuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwiXCIpIHx8ICFfaXNOdWxsVHJhbnNmb3JtKF9nZXRDb21wdXRlZFByb3BlcnR5KHRhcmdldCwgX3RyYW5zZm9ybVByb3ApKTtcbiAgICAgICAgdDEgJiYgdGFyZ2V0LnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCB0MSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKE1hdGguYWJzKHNrZXdYKSA+IDkwICYmIE1hdGguYWJzKHNrZXdYKSA8IDI3MCkge1xuICAgICAgaWYgKGludmVydGVkU2NhbGVYKSB7XG4gICAgICAgIHNjYWxlWCAqPSAtMTtcbiAgICAgICAgc2tld1ggKz0gcm90YXRpb24gPD0gMCA/IDE4MCA6IC0xODA7XG4gICAgICAgIHJvdGF0aW9uICs9IHJvdGF0aW9uIDw9IDAgPyAxODAgOiAtMTgwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2NhbGVZICo9IC0xO1xuICAgICAgICBza2V3WCArPSBza2V3WCA8PSAwID8gMTgwIDogLTE4MDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB1bmNhY2hlID0gdW5jYWNoZSB8fCBjYWNoZS51bmNhY2hlO1xuICAgIGNhY2hlLnggPSB4IC0gKChjYWNoZS54UGVyY2VudCA9IHggJiYgKCF1bmNhY2hlICYmIGNhY2hlLnhQZXJjZW50IHx8IChNYXRoLnJvdW5kKHRhcmdldC5vZmZzZXRXaWR0aCAvIDIpID09PSBNYXRoLnJvdW5kKC14KSA/IC01MCA6IDApKSkgPyB0YXJnZXQub2Zmc2V0V2lkdGggKiBjYWNoZS54UGVyY2VudCAvIDEwMCA6IDApICsgcHg7XG4gICAgY2FjaGUueSA9IHkgLSAoKGNhY2hlLnlQZXJjZW50ID0geSAmJiAoIXVuY2FjaGUgJiYgY2FjaGUueVBlcmNlbnQgfHwgKE1hdGgucm91bmQodGFyZ2V0Lm9mZnNldEhlaWdodCAvIDIpID09PSBNYXRoLnJvdW5kKC15KSA/IC01MCA6IDApKSkgPyB0YXJnZXQub2Zmc2V0SGVpZ2h0ICogY2FjaGUueVBlcmNlbnQgLyAxMDAgOiAwKSArIHB4O1xuICAgIGNhY2hlLnogPSB6ICsgcHg7XG4gICAgY2FjaGUuc2NhbGVYID0gX3JvdW5kKHNjYWxlWCk7XG4gICAgY2FjaGUuc2NhbGVZID0gX3JvdW5kKHNjYWxlWSk7XG4gICAgY2FjaGUucm90YXRpb24gPSBfcm91bmQocm90YXRpb24pICsgZGVnO1xuICAgIGNhY2hlLnJvdGF0aW9uWCA9IF9yb3VuZChyb3RhdGlvblgpICsgZGVnO1xuICAgIGNhY2hlLnJvdGF0aW9uWSA9IF9yb3VuZChyb3RhdGlvblkpICsgZGVnO1xuICAgIGNhY2hlLnNrZXdYID0gc2tld1ggKyBkZWc7XG4gICAgY2FjaGUuc2tld1kgPSBza2V3WSArIGRlZztcbiAgICBjYWNoZS50cmFuc2Zvcm1QZXJzcGVjdGl2ZSA9IHBlcnNwZWN0aXZlICsgcHg7XG5cbiAgICBpZiAoY2FjaGUuek9yaWdpbiA9IHBhcnNlRmxvYXQob3JpZ2luLnNwbGl0KFwiIFwiKVsyXSkgfHwgMCkge1xuICAgICAgc3R5bGVbX3RyYW5zZm9ybU9yaWdpblByb3BdID0gX2ZpcnN0VHdvT25seShvcmlnaW4pO1xuICAgIH1cblxuICAgIGNhY2hlLnhPZmZzZXQgPSBjYWNoZS55T2Zmc2V0ID0gMDtcbiAgICBjYWNoZS5mb3JjZTNEID0gX2NvbmZpZy5mb3JjZTNEO1xuICAgIGNhY2hlLnJlbmRlclRyYW5zZm9ybSA9IGNhY2hlLnN2ZyA/IF9yZW5kZXJTVkdUcmFuc2Zvcm1zIDogX3N1cHBvcnRzM0QgPyBfcmVuZGVyQ1NTVHJhbnNmb3JtcyA6IF9yZW5kZXJOb24zRFRyYW5zZm9ybXM7XG4gICAgY2FjaGUudW5jYWNoZSA9IDA7XG4gICAgcmV0dXJuIGNhY2hlO1xuICB9LFxuICAgICAgX2ZpcnN0VHdvT25seSA9IGZ1bmN0aW9uIF9maXJzdFR3b09ubHkodmFsdWUpIHtcbiAgICByZXR1cm4gKHZhbHVlID0gdmFsdWUuc3BsaXQoXCIgXCIpKVswXSArIFwiIFwiICsgdmFsdWVbMV07XG4gIH0sXG4gICAgICBfYWRkUHhUcmFuc2xhdGUgPSBmdW5jdGlvbiBfYWRkUHhUcmFuc2xhdGUodGFyZ2V0LCBzdGFydCwgdmFsdWUpIHtcbiAgICB2YXIgdW5pdCA9IGdldFVuaXQoc3RhcnQpO1xuICAgIHJldHVybiBfcm91bmQocGFyc2VGbG9hdChzdGFydCkgKyBwYXJzZUZsb2F0KF9jb252ZXJ0VG9Vbml0KHRhcmdldCwgXCJ4XCIsIHZhbHVlICsgXCJweFwiLCB1bml0KSkpICsgdW5pdDtcbiAgfSxcbiAgICAgIF9yZW5kZXJOb24zRFRyYW5zZm9ybXMgPSBmdW5jdGlvbiBfcmVuZGVyTm9uM0RUcmFuc2Zvcm1zKHJhdGlvLCBjYWNoZSkge1xuICAgIGNhY2hlLnogPSBcIjBweFwiO1xuICAgIGNhY2hlLnJvdGF0aW9uWSA9IGNhY2hlLnJvdGF0aW9uWCA9IFwiMGRlZ1wiO1xuICAgIGNhY2hlLmZvcmNlM0QgPSAwO1xuXG4gICAgX3JlbmRlckNTU1RyYW5zZm9ybXMocmF0aW8sIGNhY2hlKTtcbiAgfSxcbiAgICAgIF96ZXJvRGVnID0gXCIwZGVnXCIsXG4gICAgICBfemVyb1B4ID0gXCIwcHhcIixcbiAgICAgIF9lbmRQYXJlbnRoZXNpcyA9IFwiKSBcIixcbiAgICAgIF9yZW5kZXJDU1NUcmFuc2Zvcm1zID0gZnVuY3Rpb24gX3JlbmRlckNTU1RyYW5zZm9ybXMocmF0aW8sIGNhY2hlKSB7XG4gICAgdmFyIF9yZWYgPSBjYWNoZSB8fCB0aGlzLFxuICAgICAgICB4UGVyY2VudCA9IF9yZWYueFBlcmNlbnQsXG4gICAgICAgIHlQZXJjZW50ID0gX3JlZi55UGVyY2VudCxcbiAgICAgICAgeCA9IF9yZWYueCxcbiAgICAgICAgeSA9IF9yZWYueSxcbiAgICAgICAgeiA9IF9yZWYueixcbiAgICAgICAgcm90YXRpb24gPSBfcmVmLnJvdGF0aW9uLFxuICAgICAgICByb3RhdGlvblkgPSBfcmVmLnJvdGF0aW9uWSxcbiAgICAgICAgcm90YXRpb25YID0gX3JlZi5yb3RhdGlvblgsXG4gICAgICAgIHNrZXdYID0gX3JlZi5za2V3WCxcbiAgICAgICAgc2tld1kgPSBfcmVmLnNrZXdZLFxuICAgICAgICBzY2FsZVggPSBfcmVmLnNjYWxlWCxcbiAgICAgICAgc2NhbGVZID0gX3JlZi5zY2FsZVksXG4gICAgICAgIHRyYW5zZm9ybVBlcnNwZWN0aXZlID0gX3JlZi50cmFuc2Zvcm1QZXJzcGVjdGl2ZSxcbiAgICAgICAgZm9yY2UzRCA9IF9yZWYuZm9yY2UzRCxcbiAgICAgICAgdGFyZ2V0ID0gX3JlZi50YXJnZXQsXG4gICAgICAgIHpPcmlnaW4gPSBfcmVmLnpPcmlnaW4sXG4gICAgICAgIHRyYW5zZm9ybXMgPSBcIlwiLFxuICAgICAgICB1c2UzRCA9IGZvcmNlM0QgPT09IFwiYXV0b1wiICYmIHJhdGlvICYmIHJhdGlvICE9PSAxIHx8IGZvcmNlM0QgPT09IHRydWU7XG5cbiAgICBpZiAoek9yaWdpbiAmJiAocm90YXRpb25YICE9PSBfemVyb0RlZyB8fCByb3RhdGlvblkgIT09IF96ZXJvRGVnKSkge1xuICAgICAgdmFyIGFuZ2xlID0gcGFyc2VGbG9hdChyb3RhdGlvblkpICogX0RFRzJSQUQsXG4gICAgICAgICAgYTEzID0gTWF0aC5zaW4oYW5nbGUpLFxuICAgICAgICAgIGEzMyA9IE1hdGguY29zKGFuZ2xlKSxcbiAgICAgICAgICBjb3M7XG5cbiAgICAgIGFuZ2xlID0gcGFyc2VGbG9hdChyb3RhdGlvblgpICogX0RFRzJSQUQ7XG4gICAgICBjb3MgPSBNYXRoLmNvcyhhbmdsZSk7XG4gICAgICB4ID0gX2FkZFB4VHJhbnNsYXRlKHRhcmdldCwgeCwgYTEzICogY29zICogLXpPcmlnaW4pO1xuICAgICAgeSA9IF9hZGRQeFRyYW5zbGF0ZSh0YXJnZXQsIHksIC1NYXRoLnNpbihhbmdsZSkgKiAtek9yaWdpbik7XG4gICAgICB6ID0gX2FkZFB4VHJhbnNsYXRlKHRhcmdldCwgeiwgYTMzICogY29zICogLXpPcmlnaW4gKyB6T3JpZ2luKTtcbiAgICB9XG5cbiAgICBpZiAodHJhbnNmb3JtUGVyc3BlY3RpdmUgIT09IF96ZXJvUHgpIHtcbiAgICAgIHRyYW5zZm9ybXMgKz0gXCJwZXJzcGVjdGl2ZShcIiArIHRyYW5zZm9ybVBlcnNwZWN0aXZlICsgX2VuZFBhcmVudGhlc2lzO1xuICAgIH1cblxuICAgIGlmICh4UGVyY2VudCB8fCB5UGVyY2VudCkge1xuICAgICAgdHJhbnNmb3JtcyArPSBcInRyYW5zbGF0ZShcIiArIHhQZXJjZW50ICsgXCIlLCBcIiArIHlQZXJjZW50ICsgXCIlKSBcIjtcbiAgICB9XG5cbiAgICBpZiAodXNlM0QgfHwgeCAhPT0gX3plcm9QeCB8fCB5ICE9PSBfemVyb1B4IHx8IHogIT09IF96ZXJvUHgpIHtcbiAgICAgIHRyYW5zZm9ybXMgKz0geiAhPT0gX3plcm9QeCB8fCB1c2UzRCA/IFwidHJhbnNsYXRlM2QoXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiLCBcIiArIHogKyBcIikgXCIgOiBcInRyYW5zbGF0ZShcIiArIHggKyBcIiwgXCIgKyB5ICsgX2VuZFBhcmVudGhlc2lzO1xuICAgIH1cblxuICAgIGlmIChyb3RhdGlvbiAhPT0gX3plcm9EZWcpIHtcbiAgICAgIHRyYW5zZm9ybXMgKz0gXCJyb3RhdGUoXCIgKyByb3RhdGlvbiArIF9lbmRQYXJlbnRoZXNpcztcbiAgICB9XG5cbiAgICBpZiAocm90YXRpb25ZICE9PSBfemVyb0RlZykge1xuICAgICAgdHJhbnNmb3JtcyArPSBcInJvdGF0ZVkoXCIgKyByb3RhdGlvblkgKyBfZW5kUGFyZW50aGVzaXM7XG4gICAgfVxuXG4gICAgaWYgKHJvdGF0aW9uWCAhPT0gX3plcm9EZWcpIHtcbiAgICAgIHRyYW5zZm9ybXMgKz0gXCJyb3RhdGVYKFwiICsgcm90YXRpb25YICsgX2VuZFBhcmVudGhlc2lzO1xuICAgIH1cblxuICAgIGlmIChza2V3WCAhPT0gX3plcm9EZWcgfHwgc2tld1kgIT09IF96ZXJvRGVnKSB7XG4gICAgICB0cmFuc2Zvcm1zICs9IFwic2tldyhcIiArIHNrZXdYICsgXCIsIFwiICsgc2tld1kgKyBfZW5kUGFyZW50aGVzaXM7XG4gICAgfVxuXG4gICAgaWYgKHNjYWxlWCAhPT0gMSB8fCBzY2FsZVkgIT09IDEpIHtcbiAgICAgIHRyYW5zZm9ybXMgKz0gXCJzY2FsZShcIiArIHNjYWxlWCArIFwiLCBcIiArIHNjYWxlWSArIF9lbmRQYXJlbnRoZXNpcztcbiAgICB9XG5cbiAgICB0YXJnZXQuc3R5bGVbX3RyYW5zZm9ybVByb3BdID0gdHJhbnNmb3JtcyB8fCBcInRyYW5zbGF0ZSgwLCAwKVwiO1xuICB9LFxuICAgICAgX3JlbmRlclNWR1RyYW5zZm9ybXMgPSBmdW5jdGlvbiBfcmVuZGVyU1ZHVHJhbnNmb3JtcyhyYXRpbywgY2FjaGUpIHtcbiAgICB2YXIgX3JlZjIgPSBjYWNoZSB8fCB0aGlzLFxuICAgICAgICB4UGVyY2VudCA9IF9yZWYyLnhQZXJjZW50LFxuICAgICAgICB5UGVyY2VudCA9IF9yZWYyLnlQZXJjZW50LFxuICAgICAgICB4ID0gX3JlZjIueCxcbiAgICAgICAgeSA9IF9yZWYyLnksXG4gICAgICAgIHJvdGF0aW9uID0gX3JlZjIucm90YXRpb24sXG4gICAgICAgIHNrZXdYID0gX3JlZjIuc2tld1gsXG4gICAgICAgIHNrZXdZID0gX3JlZjIuc2tld1ksXG4gICAgICAgIHNjYWxlWCA9IF9yZWYyLnNjYWxlWCxcbiAgICAgICAgc2NhbGVZID0gX3JlZjIuc2NhbGVZLFxuICAgICAgICB0YXJnZXQgPSBfcmVmMi50YXJnZXQsXG4gICAgICAgIHhPcmlnaW4gPSBfcmVmMi54T3JpZ2luLFxuICAgICAgICB5T3JpZ2luID0gX3JlZjIueU9yaWdpbixcbiAgICAgICAgeE9mZnNldCA9IF9yZWYyLnhPZmZzZXQsXG4gICAgICAgIHlPZmZzZXQgPSBfcmVmMi55T2Zmc2V0LFxuICAgICAgICBmb3JjZUNTUyA9IF9yZWYyLmZvcmNlQ1NTLFxuICAgICAgICB0eCA9IHBhcnNlRmxvYXQoeCksXG4gICAgICAgIHR5ID0gcGFyc2VGbG9hdCh5KSxcbiAgICAgICAgYTExLFxuICAgICAgICBhMjEsXG4gICAgICAgIGExMixcbiAgICAgICAgYTIyLFxuICAgICAgICB0ZW1wO1xuXG4gICAgcm90YXRpb24gPSBwYXJzZUZsb2F0KHJvdGF0aW9uKTtcbiAgICBza2V3WCA9IHBhcnNlRmxvYXQoc2tld1gpO1xuICAgIHNrZXdZID0gcGFyc2VGbG9hdChza2V3WSk7XG5cbiAgICBpZiAoc2tld1kpIHtcbiAgICAgIHNrZXdZID0gcGFyc2VGbG9hdChza2V3WSk7XG4gICAgICBza2V3WCArPSBza2V3WTtcbiAgICAgIHJvdGF0aW9uICs9IHNrZXdZO1xuICAgIH1cblxuICAgIGlmIChyb3RhdGlvbiB8fCBza2V3WCkge1xuICAgICAgcm90YXRpb24gKj0gX0RFRzJSQUQ7XG4gICAgICBza2V3WCAqPSBfREVHMlJBRDtcbiAgICAgIGExMSA9IE1hdGguY29zKHJvdGF0aW9uKSAqIHNjYWxlWDtcbiAgICAgIGEyMSA9IE1hdGguc2luKHJvdGF0aW9uKSAqIHNjYWxlWDtcbiAgICAgIGExMiA9IE1hdGguc2luKHJvdGF0aW9uIC0gc2tld1gpICogLXNjYWxlWTtcbiAgICAgIGEyMiA9IE1hdGguY29zKHJvdGF0aW9uIC0gc2tld1gpICogc2NhbGVZO1xuXG4gICAgICBpZiAoc2tld1gpIHtcbiAgICAgICAgc2tld1kgKj0gX0RFRzJSQUQ7XG4gICAgICAgIHRlbXAgPSBNYXRoLnRhbihza2V3WCAtIHNrZXdZKTtcbiAgICAgICAgdGVtcCA9IE1hdGguc3FydCgxICsgdGVtcCAqIHRlbXApO1xuICAgICAgICBhMTIgKj0gdGVtcDtcbiAgICAgICAgYTIyICo9IHRlbXA7XG5cbiAgICAgICAgaWYgKHNrZXdZKSB7XG4gICAgICAgICAgdGVtcCA9IE1hdGgudGFuKHNrZXdZKTtcbiAgICAgICAgICB0ZW1wID0gTWF0aC5zcXJ0KDEgKyB0ZW1wICogdGVtcCk7XG4gICAgICAgICAgYTExICo9IHRlbXA7XG4gICAgICAgICAgYTIxICo9IHRlbXA7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYTExID0gX3JvdW5kKGExMSk7XG4gICAgICBhMjEgPSBfcm91bmQoYTIxKTtcbiAgICAgIGExMiA9IF9yb3VuZChhMTIpO1xuICAgICAgYTIyID0gX3JvdW5kKGEyMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGExMSA9IHNjYWxlWDtcbiAgICAgIGEyMiA9IHNjYWxlWTtcbiAgICAgIGEyMSA9IGExMiA9IDA7XG4gICAgfVxuXG4gICAgaWYgKHR4ICYmICF+KHggKyBcIlwiKS5pbmRleE9mKFwicHhcIikgfHwgdHkgJiYgIX4oeSArIFwiXCIpLmluZGV4T2YoXCJweFwiKSkge1xuICAgICAgdHggPSBfY29udmVydFRvVW5pdCh0YXJnZXQsIFwieFwiLCB4LCBcInB4XCIpO1xuICAgICAgdHkgPSBfY29udmVydFRvVW5pdCh0YXJnZXQsIFwieVwiLCB5LCBcInB4XCIpO1xuICAgIH1cblxuICAgIGlmICh4T3JpZ2luIHx8IHlPcmlnaW4gfHwgeE9mZnNldCB8fCB5T2Zmc2V0KSB7XG4gICAgICB0eCA9IF9yb3VuZCh0eCArIHhPcmlnaW4gLSAoeE9yaWdpbiAqIGExMSArIHlPcmlnaW4gKiBhMTIpICsgeE9mZnNldCk7XG4gICAgICB0eSA9IF9yb3VuZCh0eSArIHlPcmlnaW4gLSAoeE9yaWdpbiAqIGEyMSArIHlPcmlnaW4gKiBhMjIpICsgeU9mZnNldCk7XG4gICAgfVxuXG4gICAgaWYgKHhQZXJjZW50IHx8IHlQZXJjZW50KSB7XG4gICAgICB0ZW1wID0gdGFyZ2V0LmdldEJCb3goKTtcbiAgICAgIHR4ID0gX3JvdW5kKHR4ICsgeFBlcmNlbnQgLyAxMDAgKiB0ZW1wLndpZHRoKTtcbiAgICAgIHR5ID0gX3JvdW5kKHR5ICsgeVBlcmNlbnQgLyAxMDAgKiB0ZW1wLmhlaWdodCk7XG4gICAgfVxuXG4gICAgdGVtcCA9IFwibWF0cml4KFwiICsgYTExICsgXCIsXCIgKyBhMjEgKyBcIixcIiArIGExMiArIFwiLFwiICsgYTIyICsgXCIsXCIgKyB0eCArIFwiLFwiICsgdHkgKyBcIilcIjtcbiAgICB0YXJnZXQuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIHRlbXApO1xuICAgIGZvcmNlQ1NTICYmICh0YXJnZXQuc3R5bGVbX3RyYW5zZm9ybVByb3BdID0gdGVtcCk7XG4gIH0sXG4gICAgICBfYWRkUm90YXRpb25hbFByb3BUd2VlbiA9IGZ1bmN0aW9uIF9hZGRSb3RhdGlvbmFsUHJvcFR3ZWVuKHBsdWdpbiwgdGFyZ2V0LCBwcm9wZXJ0eSwgc3RhcnROdW0sIGVuZFZhbHVlKSB7XG4gICAgdmFyIGNhcCA9IDM2MCxcbiAgICAgICAgaXNTdHJpbmcgPSBfaXNTdHJpbmcoZW5kVmFsdWUpLFxuICAgICAgICBlbmROdW0gPSBwYXJzZUZsb2F0KGVuZFZhbHVlKSAqIChpc1N0cmluZyAmJiB+ZW5kVmFsdWUuaW5kZXhPZihcInJhZFwiKSA/IF9SQUQyREVHIDogMSksXG4gICAgICAgIGNoYW5nZSA9IGVuZE51bSAtIHN0YXJ0TnVtLFxuICAgICAgICBmaW5hbFZhbHVlID0gc3RhcnROdW0gKyBjaGFuZ2UgKyBcImRlZ1wiLFxuICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgIHB0O1xuXG4gICAgaWYgKGlzU3RyaW5nKSB7XG4gICAgICBkaXJlY3Rpb24gPSBlbmRWYWx1ZS5zcGxpdChcIl9cIilbMV07XG5cbiAgICAgIGlmIChkaXJlY3Rpb24gPT09IFwic2hvcnRcIikge1xuICAgICAgICBjaGFuZ2UgJT0gY2FwO1xuXG4gICAgICAgIGlmIChjaGFuZ2UgIT09IGNoYW5nZSAlIChjYXAgLyAyKSkge1xuICAgICAgICAgIGNoYW5nZSArPSBjaGFuZ2UgPCAwID8gY2FwIDogLWNhcDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZGlyZWN0aW9uID09PSBcImN3XCIgJiYgY2hhbmdlIDwgMCkge1xuICAgICAgICBjaGFuZ2UgPSAoY2hhbmdlICsgY2FwICogX2JpZ051bSQxKSAlIGNhcCAtIH5+KGNoYW5nZSAvIGNhcCkgKiBjYXA7XG4gICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gXCJjY3dcIiAmJiBjaGFuZ2UgPiAwKSB7XG4gICAgICAgIGNoYW5nZSA9IChjaGFuZ2UgLSBjYXAgKiBfYmlnTnVtJDEpICUgY2FwIC0gfn4oY2hhbmdlIC8gY2FwKSAqIGNhcDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwbHVnaW4uX3B0ID0gcHQgPSBuZXcgUHJvcFR3ZWVuKHBsdWdpbi5fcHQsIHRhcmdldCwgcHJvcGVydHksIHN0YXJ0TnVtLCBjaGFuZ2UsIF9yZW5kZXJQcm9wV2l0aEVuZCk7XG4gICAgcHQuZSA9IGZpbmFsVmFsdWU7XG4gICAgcHQudSA9IFwiZGVnXCI7XG5cbiAgICBwbHVnaW4uX3Byb3BzLnB1c2gocHJvcGVydHkpO1xuXG4gICAgcmV0dXJuIHB0O1xuICB9LFxuICAgICAgX2Fzc2lnbiA9IGZ1bmN0aW9uIF9hc3NpZ24odGFyZ2V0LCBzb3VyY2UpIHtcbiAgICBmb3IgKHZhciBwIGluIHNvdXJjZSkge1xuICAgICAgdGFyZ2V0W3BdID0gc291cmNlW3BdO1xuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH0sXG4gICAgICBfYWRkUmF3VHJhbnNmb3JtUFRzID0gZnVuY3Rpb24gX2FkZFJhd1RyYW5zZm9ybVBUcyhwbHVnaW4sIHRyYW5zZm9ybXMsIHRhcmdldCkge1xuICAgIHZhciBzdGFydENhY2hlID0gX2Fzc2lnbih7fSwgdGFyZ2V0Ll9nc2FwKSxcbiAgICAgICAgZXhjbHVkZSA9IFwicGVyc3BlY3RpdmUsZm9yY2UzRCx0cmFuc2Zvcm1PcmlnaW4sc3ZnT3JpZ2luXCIsXG4gICAgICAgIHN0eWxlID0gdGFyZ2V0LnN0eWxlLFxuICAgICAgICBlbmRDYWNoZSxcbiAgICAgICAgcCxcbiAgICAgICAgc3RhcnRWYWx1ZSxcbiAgICAgICAgZW5kVmFsdWUsXG4gICAgICAgIHN0YXJ0TnVtLFxuICAgICAgICBlbmROdW0sXG4gICAgICAgIHN0YXJ0VW5pdCxcbiAgICAgICAgZW5kVW5pdDtcblxuICAgIGlmIChzdGFydENhY2hlLnN2Zykge1xuICAgICAgc3RhcnRWYWx1ZSA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIik7XG4gICAgICB0YXJnZXQuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwiXCIpO1xuICAgICAgc3R5bGVbX3RyYW5zZm9ybVByb3BdID0gdHJhbnNmb3JtcztcbiAgICAgIGVuZENhY2hlID0gX3BhcnNlVHJhbnNmb3JtKHRhcmdldCwgMSk7XG5cbiAgICAgIF9yZW1vdmVQcm9wZXJ0eSh0YXJnZXQsIF90cmFuc2Zvcm1Qcm9wKTtcblxuICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBzdGFydFZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhcnRWYWx1ZSA9IGdldENvbXB1dGVkU3R5bGUodGFyZ2V0KVtfdHJhbnNmb3JtUHJvcF07XG4gICAgICBzdHlsZVtfdHJhbnNmb3JtUHJvcF0gPSB0cmFuc2Zvcm1zO1xuICAgICAgZW5kQ2FjaGUgPSBfcGFyc2VUcmFuc2Zvcm0odGFyZ2V0LCAxKTtcbiAgICAgIHN0eWxlW190cmFuc2Zvcm1Qcm9wXSA9IHN0YXJ0VmFsdWU7XG4gICAgfVxuXG4gICAgZm9yIChwIGluIF90cmFuc2Zvcm1Qcm9wcykge1xuICAgICAgc3RhcnRWYWx1ZSA9IHN0YXJ0Q2FjaGVbcF07XG4gICAgICBlbmRWYWx1ZSA9IGVuZENhY2hlW3BdO1xuXG4gICAgICBpZiAoc3RhcnRWYWx1ZSAhPT0gZW5kVmFsdWUgJiYgZXhjbHVkZS5pbmRleE9mKHApIDwgMCkge1xuICAgICAgICBzdGFydFVuaXQgPSBnZXRVbml0KHN0YXJ0VmFsdWUpO1xuICAgICAgICBlbmRVbml0ID0gZ2V0VW5pdChlbmRWYWx1ZSk7XG4gICAgICAgIHN0YXJ0TnVtID0gc3RhcnRVbml0ICE9PSBlbmRVbml0ID8gX2NvbnZlcnRUb1VuaXQodGFyZ2V0LCBwLCBzdGFydFZhbHVlLCBlbmRVbml0KSA6IHBhcnNlRmxvYXQoc3RhcnRWYWx1ZSk7XG4gICAgICAgIGVuZE51bSA9IHBhcnNlRmxvYXQoZW5kVmFsdWUpO1xuICAgICAgICBwbHVnaW4uX3B0ID0gbmV3IFByb3BUd2VlbihwbHVnaW4uX3B0LCBlbmRDYWNoZSwgcCwgc3RhcnROdW0sIGVuZE51bSAtIHN0YXJ0TnVtLCBfcmVuZGVyQ1NTUHJvcCk7XG4gICAgICAgIHBsdWdpbi5fcHQudSA9IGVuZFVuaXQgfHwgMDtcblxuICAgICAgICBwbHVnaW4uX3Byb3BzLnB1c2gocCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2Fzc2lnbihlbmRDYWNoZSwgc3RhcnRDYWNoZSk7XG4gIH07XG5cbiAgX2ZvckVhY2hOYW1lKFwicGFkZGluZyxtYXJnaW4sV2lkdGgsUmFkaXVzXCIsIGZ1bmN0aW9uIChuYW1lLCBpbmRleCkge1xuICAgIHZhciB0ID0gXCJUb3BcIixcbiAgICAgICAgciA9IFwiUmlnaHRcIixcbiAgICAgICAgYiA9IFwiQm90dG9tXCIsXG4gICAgICAgIGwgPSBcIkxlZnRcIixcbiAgICAgICAgcHJvcHMgPSAoaW5kZXggPCAzID8gW3QsIHIsIGIsIGxdIDogW3QgKyBsLCB0ICsgciwgYiArIHIsIGIgKyBsXSkubWFwKGZ1bmN0aW9uIChzaWRlKSB7XG4gICAgICByZXR1cm4gaW5kZXggPCAyID8gbmFtZSArIHNpZGUgOiBcImJvcmRlclwiICsgc2lkZSArIG5hbWU7XG4gICAgfSk7XG5cbiAgICBfc3BlY2lhbFByb3BzW2luZGV4ID4gMSA/IFwiYm9yZGVyXCIgKyBuYW1lIDogbmFtZV0gPSBmdW5jdGlvbiAocGx1Z2luLCB0YXJnZXQsIHByb3BlcnR5LCBlbmRWYWx1ZSwgdHdlZW4pIHtcbiAgICAgIHZhciBhLCB2YXJzO1xuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDQpIHtcbiAgICAgICAgYSA9IHByb3BzLm1hcChmdW5jdGlvbiAocHJvcCkge1xuICAgICAgICAgIHJldHVybiBfZ2V0KHBsdWdpbiwgcHJvcCwgcHJvcGVydHkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFycyA9IGEuam9pbihcIiBcIik7XG4gICAgICAgIHJldHVybiB2YXJzLnNwbGl0KGFbMF0pLmxlbmd0aCA9PT0gNSA/IGFbMF0gOiB2YXJzO1xuICAgICAgfVxuXG4gICAgICBhID0gKGVuZFZhbHVlICsgXCJcIikuc3BsaXQoXCIgXCIpO1xuICAgICAgdmFycyA9IHt9O1xuICAgICAgcHJvcHMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCwgaSkge1xuICAgICAgICByZXR1cm4gdmFyc1twcm9wXSA9IGFbaV0gPSBhW2ldIHx8IGFbKGkgLSAxKSAvIDIgfCAwXTtcbiAgICAgIH0pO1xuICAgICAgcGx1Z2luLmluaXQodGFyZ2V0LCB2YXJzLCB0d2Vlbik7XG4gICAgfTtcbiAgfSk7XG5cbiAgdmFyIENTU1BsdWdpbiA9IHtcbiAgICBuYW1lOiBcImNzc1wiLFxuICAgIHJlZ2lzdGVyOiBfaW5pdENvcmUsXG4gICAgdGFyZ2V0VGVzdDogZnVuY3Rpb24gdGFyZ2V0VGVzdCh0YXJnZXQpIHtcbiAgICAgIHJldHVybiB0YXJnZXQuc3R5bGUgJiYgdGFyZ2V0Lm5vZGVUeXBlO1xuICAgIH0sXG4gICAgaW5pdDogZnVuY3Rpb24gaW5pdCh0YXJnZXQsIHZhcnMsIHR3ZWVuLCBpbmRleCwgdGFyZ2V0cykge1xuICAgICAgdmFyIHByb3BzID0gdGhpcy5fcHJvcHMsXG4gICAgICAgICAgc3R5bGUgPSB0YXJnZXQuc3R5bGUsXG4gICAgICAgICAgc3RhcnRBdCA9IHR3ZWVuLnZhcnMuc3RhcnRBdCxcbiAgICAgICAgICBzdGFydFZhbHVlLFxuICAgICAgICAgIGVuZFZhbHVlLFxuICAgICAgICAgIGVuZE51bSxcbiAgICAgICAgICBzdGFydE51bSxcbiAgICAgICAgICB0eXBlLFxuICAgICAgICAgIHNwZWNpYWxQcm9wLFxuICAgICAgICAgIHAsXG4gICAgICAgICAgc3RhcnRVbml0LFxuICAgICAgICAgIGVuZFVuaXQsXG4gICAgICAgICAgcmVsYXRpdmUsXG4gICAgICAgICAgaXNUcmFuc2Zvcm1SZWxhdGVkLFxuICAgICAgICAgIHRyYW5zZm9ybVByb3BUd2VlbixcbiAgICAgICAgICBjYWNoZSxcbiAgICAgICAgICBzbW9vdGgsXG4gICAgICAgICAgaGFzUHJpb3JpdHk7XG4gICAgICBfcGx1Z2luSW5pdHRlZCB8fCBfaW5pdENvcmUoKTtcblxuICAgICAgZm9yIChwIGluIHZhcnMpIHtcbiAgICAgICAgaWYgKHAgPT09IFwiYXV0b1JvdW5kXCIpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVuZFZhbHVlID0gdmFyc1twXTtcblxuICAgICAgICBpZiAoX3BsdWdpbnNbcF0gJiYgX2NoZWNrUGx1Z2luKHAsIHZhcnMsIHR3ZWVuLCBpbmRleCwgdGFyZ2V0LCB0YXJnZXRzKSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdHlwZSA9IHR5cGVvZiBlbmRWYWx1ZTtcbiAgICAgICAgc3BlY2lhbFByb3AgPSBfc3BlY2lhbFByb3BzW3BdO1xuXG4gICAgICAgIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBlbmRWYWx1ZSA9IGVuZFZhbHVlLmNhbGwodHdlZW4sIGluZGV4LCB0YXJnZXQsIHRhcmdldHMpO1xuICAgICAgICAgIHR5cGUgPSB0eXBlb2YgZW5kVmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZSA9PT0gXCJzdHJpbmdcIiAmJiB+ZW5kVmFsdWUuaW5kZXhPZihcInJhbmRvbShcIikpIHtcbiAgICAgICAgICBlbmRWYWx1ZSA9IF9yZXBsYWNlUmFuZG9tKGVuZFZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzcGVjaWFsUHJvcCkge1xuICAgICAgICAgIHNwZWNpYWxQcm9wKHRoaXMsIHRhcmdldCwgcCwgZW5kVmFsdWUsIHR3ZWVuKSAmJiAoaGFzUHJpb3JpdHkgPSAxKTtcbiAgICAgICAgfSBlbHNlIGlmIChwLnN1YnN0cigwLCAyKSA9PT0gXCItLVwiKSB7XG4gICAgICAgICAgc3RhcnRWYWx1ZSA9IChnZXRDb21wdXRlZFN0eWxlKHRhcmdldCkuZ2V0UHJvcGVydHlWYWx1ZShwKSArIFwiXCIpLnRyaW0oKTtcbiAgICAgICAgICBlbmRWYWx1ZSArPSBcIlwiO1xuICAgICAgICAgIF9jb2xvckV4cC5sYXN0SW5kZXggPSAwO1xuXG4gICAgICAgICAgaWYgKCFfY29sb3JFeHAudGVzdChzdGFydFZhbHVlKSkge1xuICAgICAgICAgICAgc3RhcnRVbml0ID0gZ2V0VW5pdChzdGFydFZhbHVlKTtcbiAgICAgICAgICAgIGVuZFVuaXQgPSBnZXRVbml0KGVuZFZhbHVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBlbmRVbml0ID8gc3RhcnRVbml0ICE9PSBlbmRVbml0ICYmIChzdGFydFZhbHVlID0gX2NvbnZlcnRUb1VuaXQodGFyZ2V0LCBwLCBzdGFydFZhbHVlLCBlbmRVbml0KSArIGVuZFVuaXQpIDogc3RhcnRVbml0ICYmIChlbmRWYWx1ZSArPSBzdGFydFVuaXQpO1xuICAgICAgICAgIHRoaXMuYWRkKHN0eWxlLCBcInNldFByb3BlcnR5XCIsIHN0YXJ0VmFsdWUsIGVuZFZhbHVlLCBpbmRleCwgdGFyZ2V0cywgMCwgMCwgcCk7XG4gICAgICAgICAgcHJvcHMucHVzaChwKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaWYgKHN0YXJ0QXQgJiYgcCBpbiBzdGFydEF0KSB7XG4gICAgICAgICAgICBzdGFydFZhbHVlID0gdHlwZW9mIHN0YXJ0QXRbcF0gPT09IFwiZnVuY3Rpb25cIiA/IHN0YXJ0QXRbcF0uY2FsbCh0d2VlbiwgaW5kZXgsIHRhcmdldCwgdGFyZ2V0cykgOiBzdGFydEF0W3BdO1xuICAgICAgICAgICAgX2lzU3RyaW5nKHN0YXJ0VmFsdWUpICYmIH5zdGFydFZhbHVlLmluZGV4T2YoXCJyYW5kb20oXCIpICYmIChzdGFydFZhbHVlID0gX3JlcGxhY2VSYW5kb20oc3RhcnRWYWx1ZSkpO1xuICAgICAgICAgICAgZ2V0VW5pdChzdGFydFZhbHVlICsgXCJcIikgfHwgKHN0YXJ0VmFsdWUgKz0gX2NvbmZpZy51bml0c1twXSB8fCBnZXRVbml0KF9nZXQodGFyZ2V0LCBwKSkgfHwgXCJcIik7XG4gICAgICAgICAgICAoc3RhcnRWYWx1ZSArIFwiXCIpLmNoYXJBdCgxKSA9PT0gXCI9XCIgJiYgKHN0YXJ0VmFsdWUgPSBfZ2V0KHRhcmdldCwgcCkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGFydFZhbHVlID0gX2dldCh0YXJnZXQsIHApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHN0YXJ0TnVtID0gcGFyc2VGbG9hdChzdGFydFZhbHVlKTtcbiAgICAgICAgICByZWxhdGl2ZSA9IHR5cGUgPT09IFwic3RyaW5nXCIgJiYgZW5kVmFsdWUuY2hhckF0KDEpID09PSBcIj1cIiAmJiBlbmRWYWx1ZS5zdWJzdHIoMCwgMik7XG4gICAgICAgICAgcmVsYXRpdmUgJiYgKGVuZFZhbHVlID0gZW5kVmFsdWUuc3Vic3RyKDIpKTtcbiAgICAgICAgICBlbmROdW0gPSBwYXJzZUZsb2F0KGVuZFZhbHVlKTtcblxuICAgICAgICAgIGlmIChwIGluIF9wcm9wZXJ0eUFsaWFzZXMpIHtcbiAgICAgICAgICAgIGlmIChwID09PSBcImF1dG9BbHBoYVwiKSB7XG4gICAgICAgICAgICAgIGlmIChzdGFydE51bSA9PT0gMSAmJiBfZ2V0KHRhcmdldCwgXCJ2aXNpYmlsaXR5XCIpID09PSBcImhpZGRlblwiICYmIGVuZE51bSkge1xuICAgICAgICAgICAgICAgIHN0YXJ0TnVtID0gMDtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIF9hZGROb25Ud2VlbmluZ1BUKHRoaXMsIHN0eWxlLCBcInZpc2liaWxpdHlcIiwgc3RhcnROdW0gPyBcImluaGVyaXRcIiA6IFwiaGlkZGVuXCIsIGVuZE51bSA/IFwiaW5oZXJpdFwiIDogXCJoaWRkZW5cIiwgIWVuZE51bSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwICE9PSBcInNjYWxlXCIgJiYgcCAhPT0gXCJ0cmFuc2Zvcm1cIikge1xuICAgICAgICAgICAgICBwID0gX3Byb3BlcnR5QWxpYXNlc1twXTtcbiAgICAgICAgICAgICAgfnAuaW5kZXhPZihcIixcIikgJiYgKHAgPSBwLnNwbGl0KFwiLFwiKVswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaXNUcmFuc2Zvcm1SZWxhdGVkID0gcCBpbiBfdHJhbnNmb3JtUHJvcHM7XG5cbiAgICAgICAgICBpZiAoaXNUcmFuc2Zvcm1SZWxhdGVkKSB7XG4gICAgICAgICAgICBpZiAoIXRyYW5zZm9ybVByb3BUd2Vlbikge1xuICAgICAgICAgICAgICBjYWNoZSA9IHRhcmdldC5fZ3NhcDtcbiAgICAgICAgICAgICAgY2FjaGUucmVuZGVyVHJhbnNmb3JtICYmICF2YXJzLnBhcnNlVHJhbnNmb3JtIHx8IF9wYXJzZVRyYW5zZm9ybSh0YXJnZXQsIHZhcnMucGFyc2VUcmFuc2Zvcm0pO1xuICAgICAgICAgICAgICBzbW9vdGggPSB2YXJzLnNtb290aE9yaWdpbiAhPT0gZmFsc2UgJiYgY2FjaGUuc21vb3RoO1xuICAgICAgICAgICAgICB0cmFuc2Zvcm1Qcm9wVHdlZW4gPSB0aGlzLl9wdCA9IG5ldyBQcm9wVHdlZW4odGhpcy5fcHQsIHN0eWxlLCBfdHJhbnNmb3JtUHJvcCwgMCwgMSwgY2FjaGUucmVuZGVyVHJhbnNmb3JtLCBjYWNoZSwgMCwgLTEpO1xuICAgICAgICAgICAgICB0cmFuc2Zvcm1Qcm9wVHdlZW4uZGVwID0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHAgPT09IFwic2NhbGVcIikge1xuICAgICAgICAgICAgICB0aGlzLl9wdCA9IG5ldyBQcm9wVHdlZW4odGhpcy5fcHQsIGNhY2hlLCBcInNjYWxlWVwiLCBjYWNoZS5zY2FsZVksIChyZWxhdGl2ZSA/IF9wYXJzZVJlbGF0aXZlKGNhY2hlLnNjYWxlWSwgcmVsYXRpdmUgKyBlbmROdW0pIDogZW5kTnVtKSAtIGNhY2hlLnNjYWxlWSB8fCAwKTtcbiAgICAgICAgICAgICAgcHJvcHMucHVzaChcInNjYWxlWVwiLCBwKTtcbiAgICAgICAgICAgICAgcCArPSBcIlhcIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocCA9PT0gXCJ0cmFuc2Zvcm1PcmlnaW5cIikge1xuICAgICAgICAgICAgICBlbmRWYWx1ZSA9IF9jb252ZXJ0S2V5d29yZHNUb1BlcmNlbnRhZ2VzKGVuZFZhbHVlKTtcblxuICAgICAgICAgICAgICBpZiAoY2FjaGUuc3ZnKSB7XG4gICAgICAgICAgICAgICAgX2FwcGx5U1ZHT3JpZ2luKHRhcmdldCwgZW5kVmFsdWUsIDAsIHNtb290aCwgMCwgdGhpcyk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZW5kVW5pdCA9IHBhcnNlRmxvYXQoZW5kVmFsdWUuc3BsaXQoXCIgXCIpWzJdKSB8fCAwO1xuICAgICAgICAgICAgICAgIGVuZFVuaXQgIT09IGNhY2hlLnpPcmlnaW4gJiYgX2FkZE5vblR3ZWVuaW5nUFQodGhpcywgY2FjaGUsIFwiek9yaWdpblwiLCBjYWNoZS56T3JpZ2luLCBlbmRVbml0KTtcblxuICAgICAgICAgICAgICAgIF9hZGROb25Ud2VlbmluZ1BUKHRoaXMsIHN0eWxlLCBwLCBfZmlyc3RUd29Pbmx5KHN0YXJ0VmFsdWUpLCBfZmlyc3RUd29Pbmx5KGVuZFZhbHVlKSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocCA9PT0gXCJzdmdPcmlnaW5cIikge1xuICAgICAgICAgICAgICBfYXBwbHlTVkdPcmlnaW4odGFyZ2V0LCBlbmRWYWx1ZSwgMSwgc21vb3RoLCAwLCB0aGlzKTtcblxuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocCBpbiBfcm90YXRpb25hbFByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgX2FkZFJvdGF0aW9uYWxQcm9wVHdlZW4odGhpcywgY2FjaGUsIHAsIHN0YXJ0TnVtLCByZWxhdGl2ZSA/IF9wYXJzZVJlbGF0aXZlKHN0YXJ0TnVtLCByZWxhdGl2ZSArIGVuZFZhbHVlKSA6IGVuZFZhbHVlKTtcblxuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocCA9PT0gXCJzbW9vdGhPcmlnaW5cIikge1xuICAgICAgICAgICAgICBfYWRkTm9uVHdlZW5pbmdQVCh0aGlzLCBjYWNoZSwgXCJzbW9vdGhcIiwgY2FjaGUuc21vb3RoLCBlbmRWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHAgPT09IFwiZm9yY2UzRFwiKSB7XG4gICAgICAgICAgICAgIGNhY2hlW3BdID0gZW5kVmFsdWU7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwID09PSBcInRyYW5zZm9ybVwiKSB7XG4gICAgICAgICAgICAgIF9hZGRSYXdUcmFuc2Zvcm1QVHModGhpcywgZW5kVmFsdWUsIHRhcmdldCk7XG5cbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICghKHAgaW4gc3R5bGUpKSB7XG4gICAgICAgICAgICBwID0gX2NoZWNrUHJvcFByZWZpeChwKSB8fCBwO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpc1RyYW5zZm9ybVJlbGF0ZWQgfHwgKGVuZE51bSB8fCBlbmROdW0gPT09IDApICYmIChzdGFydE51bSB8fCBzdGFydE51bSA9PT0gMCkgJiYgIV9jb21wbGV4RXhwLnRlc3QoZW5kVmFsdWUpICYmIHAgaW4gc3R5bGUpIHtcbiAgICAgICAgICAgIHN0YXJ0VW5pdCA9IChzdGFydFZhbHVlICsgXCJcIikuc3Vic3RyKChzdGFydE51bSArIFwiXCIpLmxlbmd0aCk7XG4gICAgICAgICAgICBlbmROdW0gfHwgKGVuZE51bSA9IDApO1xuICAgICAgICAgICAgZW5kVW5pdCA9IGdldFVuaXQoZW5kVmFsdWUpIHx8IChwIGluIF9jb25maWcudW5pdHMgPyBfY29uZmlnLnVuaXRzW3BdIDogc3RhcnRVbml0KTtcbiAgICAgICAgICAgIHN0YXJ0VW5pdCAhPT0gZW5kVW5pdCAmJiAoc3RhcnROdW0gPSBfY29udmVydFRvVW5pdCh0YXJnZXQsIHAsIHN0YXJ0VmFsdWUsIGVuZFVuaXQpKTtcbiAgICAgICAgICAgIHRoaXMuX3B0ID0gbmV3IFByb3BUd2Vlbih0aGlzLl9wdCwgaXNUcmFuc2Zvcm1SZWxhdGVkID8gY2FjaGUgOiBzdHlsZSwgcCwgc3RhcnROdW0sIChyZWxhdGl2ZSA/IF9wYXJzZVJlbGF0aXZlKHN0YXJ0TnVtLCByZWxhdGl2ZSArIGVuZE51bSkgOiBlbmROdW0pIC0gc3RhcnROdW0sICFpc1RyYW5zZm9ybVJlbGF0ZWQgJiYgKGVuZFVuaXQgPT09IFwicHhcIiB8fCBwID09PSBcInpJbmRleFwiKSAmJiB2YXJzLmF1dG9Sb3VuZCAhPT0gZmFsc2UgPyBfcmVuZGVyUm91bmRlZENTU1Byb3AgOiBfcmVuZGVyQ1NTUHJvcCk7XG4gICAgICAgICAgICB0aGlzLl9wdC51ID0gZW5kVW5pdCB8fCAwO1xuXG4gICAgICAgICAgICBpZiAoc3RhcnRVbml0ICE9PSBlbmRVbml0ICYmIGVuZFVuaXQgIT09IFwiJVwiKSB7XG4gICAgICAgICAgICAgIHRoaXMuX3B0LmIgPSBzdGFydFZhbHVlO1xuICAgICAgICAgICAgICB0aGlzLl9wdC5yID0gX3JlbmRlckNTU1Byb3BXaXRoQmVnaW5uaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoIShwIGluIHN0eWxlKSkge1xuICAgICAgICAgICAgaWYgKHAgaW4gdGFyZ2V0KSB7XG4gICAgICAgICAgICAgIHRoaXMuYWRkKHRhcmdldCwgcCwgc3RhcnRWYWx1ZSB8fCB0YXJnZXRbcF0sIHJlbGF0aXZlID8gcmVsYXRpdmUgKyBlbmRWYWx1ZSA6IGVuZFZhbHVlLCBpbmRleCwgdGFyZ2V0cyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfbWlzc2luZ1BsdWdpbihwLCBlbmRWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF90d2VlbkNvbXBsZXhDU1NTdHJpbmcuY2FsbCh0aGlzLCB0YXJnZXQsIHAsIHN0YXJ0VmFsdWUsIHJlbGF0aXZlID8gcmVsYXRpdmUgKyBlbmRWYWx1ZSA6IGVuZFZhbHVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBwcm9wcy5wdXNoKHApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGhhc1ByaW9yaXR5ICYmIF9zb3J0UHJvcFR3ZWVuc0J5UHJpb3JpdHkodGhpcyk7XG4gICAgfSxcbiAgICBnZXQ6IF9nZXQsXG4gICAgYWxpYXNlczogX3Byb3BlcnR5QWxpYXNlcyxcbiAgICBnZXRTZXR0ZXI6IGZ1bmN0aW9uIGdldFNldHRlcih0YXJnZXQsIHByb3BlcnR5LCBwbHVnaW4pIHtcbiAgICAgIHZhciBwID0gX3Byb3BlcnR5QWxpYXNlc1twcm9wZXJ0eV07XG4gICAgICBwICYmIHAuaW5kZXhPZihcIixcIikgPCAwICYmIChwcm9wZXJ0eSA9IHApO1xuICAgICAgcmV0dXJuIHByb3BlcnR5IGluIF90cmFuc2Zvcm1Qcm9wcyAmJiBwcm9wZXJ0eSAhPT0gX3RyYW5zZm9ybU9yaWdpblByb3AgJiYgKHRhcmdldC5fZ3NhcC54IHx8IF9nZXQodGFyZ2V0LCBcInhcIikpID8gcGx1Z2luICYmIF9yZWNlbnRTZXR0ZXJQbHVnaW4gPT09IHBsdWdpbiA/IHByb3BlcnR5ID09PSBcInNjYWxlXCIgPyBfc2V0dGVyU2NhbGUgOiBfc2V0dGVyVHJhbnNmb3JtIDogKF9yZWNlbnRTZXR0ZXJQbHVnaW4gPSBwbHVnaW4gfHwge30pICYmIChwcm9wZXJ0eSA9PT0gXCJzY2FsZVwiID8gX3NldHRlclNjYWxlV2l0aFJlbmRlciA6IF9zZXR0ZXJUcmFuc2Zvcm1XaXRoUmVuZGVyKSA6IHRhcmdldC5zdHlsZSAmJiAhX2lzVW5kZWZpbmVkKHRhcmdldC5zdHlsZVtwcm9wZXJ0eV0pID8gX3NldHRlckNTU1N0eWxlIDogfnByb3BlcnR5LmluZGV4T2YoXCItXCIpID8gX3NldHRlckNTU1Byb3AgOiBfZ2V0U2V0dGVyKHRhcmdldCwgcHJvcGVydHkpO1xuICAgIH0sXG4gICAgY29yZToge1xuICAgICAgX3JlbW92ZVByb3BlcnR5OiBfcmVtb3ZlUHJvcGVydHksXG4gICAgICBfZ2V0TWF0cml4OiBfZ2V0TWF0cml4XG4gICAgfVxuICB9O1xuICBnc2FwLnV0aWxzLmNoZWNrUHJlZml4ID0gX2NoZWNrUHJvcFByZWZpeDtcblxuICAoZnVuY3Rpb24gKHBvc2l0aW9uQW5kU2NhbGUsIHJvdGF0aW9uLCBvdGhlcnMsIGFsaWFzZXMpIHtcbiAgICB2YXIgYWxsID0gX2ZvckVhY2hOYW1lKHBvc2l0aW9uQW5kU2NhbGUgKyBcIixcIiArIHJvdGF0aW9uICsgXCIsXCIgKyBvdGhlcnMsIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICBfdHJhbnNmb3JtUHJvcHNbbmFtZV0gPSAxO1xuICAgIH0pO1xuXG4gICAgX2ZvckVhY2hOYW1lKHJvdGF0aW9uLCBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgX2NvbmZpZy51bml0c1tuYW1lXSA9IFwiZGVnXCI7XG4gICAgICBfcm90YXRpb25hbFByb3BlcnRpZXNbbmFtZV0gPSAxO1xuICAgIH0pO1xuXG4gICAgX3Byb3BlcnR5QWxpYXNlc1thbGxbMTNdXSA9IHBvc2l0aW9uQW5kU2NhbGUgKyBcIixcIiArIHJvdGF0aW9uO1xuXG4gICAgX2ZvckVhY2hOYW1lKGFsaWFzZXMsIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB2YXIgc3BsaXQgPSBuYW1lLnNwbGl0KFwiOlwiKTtcbiAgICAgIF9wcm9wZXJ0eUFsaWFzZXNbc3BsaXRbMV1dID0gYWxsW3NwbGl0WzBdXTtcbiAgICB9KTtcbiAgfSkoXCJ4LHkseixzY2FsZSxzY2FsZVgsc2NhbGVZLHhQZXJjZW50LHlQZXJjZW50XCIsIFwicm90YXRpb24scm90YXRpb25YLHJvdGF0aW9uWSxza2V3WCxza2V3WVwiLCBcInRyYW5zZm9ybSx0cmFuc2Zvcm1PcmlnaW4sc3ZnT3JpZ2luLGZvcmNlM0Qsc21vb3RoT3JpZ2luLHRyYW5zZm9ybVBlcnNwZWN0aXZlXCIsIFwiMDp0cmFuc2xhdGVYLDE6dHJhbnNsYXRlWSwyOnRyYW5zbGF0ZVosODpyb3RhdGUsODpyb3RhdGlvblosODpyb3RhdGVaLDk6cm90YXRlWCwxMDpyb3RhdGVZXCIpO1xuXG4gIF9mb3JFYWNoTmFtZShcIngseSx6LHRvcCxyaWdodCxib3R0b20sbGVmdCx3aWR0aCxoZWlnaHQsZm9udFNpemUscGFkZGluZyxtYXJnaW4scGVyc3BlY3RpdmVcIiwgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBfY29uZmlnLnVuaXRzW25hbWVdID0gXCJweFwiO1xuICB9KTtcblxuICBnc2FwLnJlZ2lzdGVyUGx1Z2luKENTU1BsdWdpbik7XG5cbiAgdmFyIGdzYXBXaXRoQ1NTID0gZ3NhcC5yZWdpc3RlclBsdWdpbihDU1NQbHVnaW4pIHx8IGdzYXAsXG4gICAgICBUd2Vlbk1heFdpdGhDU1MgPSBnc2FwV2l0aENTUy5jb3JlLlR3ZWVuO1xuXG4gIGV4cG9ydHMuQmFjayA9IEJhY2s7XG4gIGV4cG9ydHMuQm91bmNlID0gQm91bmNlO1xuICBleHBvcnRzLkNTU1BsdWdpbiA9IENTU1BsdWdpbjtcbiAgZXhwb3J0cy5DaXJjID0gQ2lyYztcbiAgZXhwb3J0cy5DdWJpYyA9IEN1YmljO1xuICBleHBvcnRzLkVsYXN0aWMgPSBFbGFzdGljO1xuICBleHBvcnRzLkV4cG8gPSBFeHBvO1xuICBleHBvcnRzLkxpbmVhciA9IExpbmVhcjtcbiAgZXhwb3J0cy5Qb3dlcjAgPSBQb3dlcjA7XG4gIGV4cG9ydHMuUG93ZXIxID0gUG93ZXIxO1xuICBleHBvcnRzLlBvd2VyMiA9IFBvd2VyMjtcbiAgZXhwb3J0cy5Qb3dlcjMgPSBQb3dlcjM7XG4gIGV4cG9ydHMuUG93ZXI0ID0gUG93ZXI0O1xuICBleHBvcnRzLlF1YWQgPSBRdWFkO1xuICBleHBvcnRzLlF1YXJ0ID0gUXVhcnQ7XG4gIGV4cG9ydHMuUXVpbnQgPSBRdWludDtcbiAgZXhwb3J0cy5TaW5lID0gU2luZTtcbiAgZXhwb3J0cy5TdGVwcGVkRWFzZSA9IFN0ZXBwZWRFYXNlO1xuICBleHBvcnRzLlN0cm9uZyA9IFN0cm9uZztcbiAgZXhwb3J0cy5UaW1lbGluZUxpdGUgPSBUaW1lbGluZTtcbiAgZXhwb3J0cy5UaW1lbGluZU1heCA9IFRpbWVsaW5lO1xuICBleHBvcnRzLlR3ZWVuTGl0ZSA9IFR3ZWVuO1xuICBleHBvcnRzLlR3ZWVuTWF4ID0gVHdlZW5NYXhXaXRoQ1NTO1xuICBleHBvcnRzLmRlZmF1bHQgPSBnc2FwV2l0aENTUztcbiAgZXhwb3J0cy5nc2FwID0gZ3NhcFdpdGhDU1M7XG5cbiAgaWYgKHR5cGVvZih3aW5kb3cpID09PSAndW5kZWZpbmVkJyB8fCB3aW5kb3cgIT09IGV4cG9ydHMpIHtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO30gZWxzZSB7ZGVsZXRlIHdpbmRvdy5kZWZhdWx0O31cblxufSkpKTtcbiIsImltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4vdXRpbHMnO1xyXG5cclxuY2xhc3MgR2FsbGVyeSB7XHJcbiAgICBpZDogc3RyaW5nIHwgbnVsbDtcclxuICAgIGltYWdlczogSFRNTEltYWdlRWxlbWVudFtdO1xyXG4gICAgdG9vbGJhclRpdGxlOiBIVE1MU3BhbkVsZW1lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZyB8IG51bGwpe1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLmltYWdlcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEltYWdlKGltYWdlOiBIVE1MSW1hZ2VFbGVtZW50KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pbWFnZXMucHVzaChpbWFnZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEdhbGxlcnk7IiwiaW1wb3J0IEdhbGxlcnkgZnJvbSAnLi9HYWxsZXJ5JztcclxuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi91dGlscyc7XHJcblxyXG5pbXBvcnQgZ3NhcCBmcm9tICdnc2FwJztcclxuXHJcbmNsYXNzIEdhbGxlcnlVSSB7XHJcbiAgICBwcml2YXRlIF9jdXJyZW50R2FsbGVyeTogR2FsbGVyeTtcclxuICAgIHByaXZhdGUgX2NvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIF90b3BiYXI6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBfYmFja2Ryb3A6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBfb3JpZ2luYWxJbWFnZTogSFRNTEltYWdlRWxlbWVudDtcclxuICAgIHByaXZhdGUgX2N1cnJlbnRJbWFnZTogSFRNTEltYWdlRWxlbWVudDtcclxuICAgIHByaXZhdGUgX3NsaWRlcjogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIF9pbWFnZVZpZXdlcjogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIF9pbWFnZVZpZXdlclZpZXdwb3J0OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIHByaXZhdGUgX2N1cnJlbnRJbmRleDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfbmV4dEJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIF9wcmV2QnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gICAgb3BlbihcclxuICAgICAgICBnYWxsZXJ5OiBHYWxsZXJ5LFxyXG4gICAgICAgIGluaXRpYWxJbWFnZTogSFRNTEltYWdlRWxlbWVudCxcclxuICAgICAgICBoaWdoUmVzb2x1dGlvblNyYz86IHN0cmluZyxcclxuICAgICAgICBpbmRleD86IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5fY3VycmVudEdhbGxlcnkgPSBnYWxsZXJ5O1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbmRleCA9IGluZGV4O1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBJbWFnZSB3aXRoIGluZGV4ICR7aW5kZXh9IG9wZW5lZGApO1xyXG4gICAgICAgIC8vIENyYXRlIGNvbnRhaW5lclxyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdnYWxsZXJ5Jyk7XHJcblxyXG4gICAgICAgIC8vIERpc2JhbGUgc2Nyb2xsaW5nXHJcbiAgICAgICAgdXRpbHMuZGlzYWJsZVNjcm9sbGluZygpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgYmFja2Ryb3BcclxuICAgICAgICB0aGlzLl9iYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMuX2JhY2tkcm9wLmNsYXNzTGlzdC5hZGQoJ2dhbGxlcnktYmFja2Ryb3AnKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuX2JhY2tkcm9wKTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRvcGJhclxyXG4gICAgICAgIHRoaXMuY3JlYXRlVG9wYmFyKCk7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VUaXRsZShgJHtpbmRleCArIDF9IC8gJHtnYWxsZXJ5LmltYWdlcy5sZW5ndGh9YCk7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuX3RvcGJhcik7XHJcblxyXG4gICAgICAgIC8vIEFkZCBJbWFnZSBQcmV2aWV3XHJcbiAgICAgICAgdGhpcy5faW1hZ2VWaWV3ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB0aGlzLl9pbWFnZVZpZXdlci5jbGFzc0xpc3QuYWRkKCdnYWxsZXJ5X19pbWFnZV92aWV3ZXInKTtcclxuXHJcbiAgICAgICAgdGhpcy5fcHJldkJ1dHRvbiA9IHV0aWxzLmNyZWF0ZUljb25CdXR0b24oJ2ZhLWNoZXZyb24tbGVmdCcpO1xyXG4gICAgICAgIHRoaXMuX3ByZXZCdXR0b24uY2xhc3NMaXN0LmFkZCgnZ2FsbGVyeV9faW1hZ2Vfdmlld2VyX19wcmV2Jyk7XHJcbiAgICAgICAgdGhpcy5fcHJldkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wcmV2SW1hZ2UoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAodGhpcy5fY3VycmVudEluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICAgIC8vIFByaW1laXJhIGltYWdlLCBkZXNhYmlsaXRhIG8gYm90w6NvIGRlIHZvbHRhclxyXG4gICAgICAgICAgICB0aGlzLl9wcmV2QnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9uZXh0QnV0dG9uID0gdXRpbHMuY3JlYXRlSWNvbkJ1dHRvbignZmEtY2hldnJvbi1yaWdodCcpO1xyXG4gICAgICAgIHRoaXMuX25leHRCdXR0b24uY2xhc3NMaXN0LmFkZCgnZ2FsbGVyeV9faW1hZ2Vfdmlld2VyX19uZXh0Jyk7XHJcbiAgICAgICAgdGhpcy5fbmV4dEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5uZXh0SW1hZ2UoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5faW1hZ2VWaWV3ZXIuYXBwZW5kKHRoaXMuX3ByZXZCdXR0b24sIHRoaXMuX25leHRCdXR0b24pO1xyXG5cclxuICAgICAgICB0aGlzLl9pbWFnZVZpZXdlclZpZXdwb3J0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdGhpcy5faW1hZ2VWaWV3ZXJWaWV3cG9ydC5jbGFzc0xpc3QuYWRkKFxyXG4gICAgICAgICAgICAnZ2FsbGVyeV9faW1hZ2Vfdmlld2VyX192aWV3cG9ydCdcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBnYWxsZXJ5LmltYWdlcy5mb3JFYWNoKChfKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGltYWdlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIC8vIGltYWdlQ29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjRkYwMDAwJztcclxuICAgICAgICAgICAgaW1hZ2VDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnZ2FsbGVyeV9faW1hZ2Vfdmlld2VyX19pdGVtJyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2ltYWdlVmlld2VyVmlld3BvcnQuYXBwZW5kKGltYWdlQ29udGFpbmVyKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5faW1hZ2VWaWV3ZXJWaWV3cG9ydC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgtJHtcclxuICAgICAgICAgICAgaW5kZXggKiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoXHJcbiAgICAgICAgfXB4KWA7XHJcblxyXG4gICAgICAgIHRoaXMuX2ltYWdlVmlld2VyLmFwcGVuZCh0aGlzLl9pbWFnZVZpZXdlclZpZXdwb3J0KTtcclxuXHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuX2ltYWdlVmlld2VyKTtcclxuXHJcbiAgICAgICAgLy8gU2V0dXAgZ2FsbGVyeSBzbGlkZXJcclxuICAgICAgICB0aGlzLl9zbGlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB0aGlzLl9zbGlkZXIuY2xhc3NMaXN0LmFkZCgnZ2FsbGVyeV9fc2xpZGVyJyk7XHJcbiAgICAgICAgY29uc3Qgc2xpZGVyVmlld3BvcnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBzbGlkZXJWaWV3cG9ydC5jbGFzc0xpc3QuYWRkKCdnYWxsZXJ5X19zbGlkZXJfX3ZpZXdwb3J0Jyk7XHJcblxyXG4gICAgICAgIGdhbGxlcnkuaW1hZ2VzLmZvckVhY2goKGltYWdlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnZ2FsbGVyeV9fc2xpZGVyX19pdGVtJyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpbWFnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuICAgICAgICAgICAgaW1hZ2VFbGVtZW50LnNyYyA9IGltYWdlLnNyYztcclxuICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKGltYWdlRWxlbWVudCk7XHJcbiAgICAgICAgICAgIHNsaWRlclZpZXdwb3J0LmFwcGVuZENoaWxkKGRpdik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX3NsaWRlci5hcHBlbmRDaGlsZChzbGlkZXJWaWV3cG9ydCk7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuX3NsaWRlcik7XHJcblxyXG4gICAgICAgIC8vIEFuaW1hdGlvblxyXG4gICAgICAgIGdzYXAuZnJvbVRvKFxyXG4gICAgICAgICAgICBbdGhpcy5fY29udGFpbmVyLCB0aGlzLl9iYWNrZHJvcF0sXHJcbiAgICAgICAgICAgIHsgb3BhY2l0eTogMCB9LFxyXG4gICAgICAgICAgICB7IG9wYWNpdHk6IDEsIGR1cmF0aW9uOiAwLjQgfVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgZ3NhcC5mcm9tVG8oXHJcbiAgICAgICAgICAgIHRoaXMuX3NsaWRlcixcclxuICAgICAgICAgICAgeyB5OiAxMDAgfSxcclxuICAgICAgICAgICAgeyB5OiAwLCBkdXJhdGlvbjogMC40LCBkZWxheTogMC4yIH1cclxuICAgICAgICApO1xyXG4gICAgICAgIGdzYXAuZnJvbVRvKFxyXG4gICAgICAgICAgICB0aGlzLl90b3BiYXIsXHJcbiAgICAgICAgICAgIHsgeTogLTYwIH0sXHJcbiAgICAgICAgICAgIHsgeTogMCwgZHVyYXRpb246IDAuNCwgZGVsYXk6IDAuMiB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gQXBwZW5kIGNvbnRhaW5lciB0byBib2R5XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLl9jb250YWluZXIpO1xyXG5cclxuICAgICAgICAvLyBMb2FkIHByZXYgaW1hZ2UgaWYgbm90IGZpcnN0XHJcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRJbmRleCAhPT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRQcmV2SW1hZ2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gTG9hZCBuZXh0IGltYWdlIGlmIG5vdCBsYXN0XHJcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRJbmRleCA8IHRoaXMuX2N1cnJlbnRHYWxsZXJ5LmltYWdlcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZE5leHRJbWFnZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNyZWF0ZUltYWdlQW5pbWF0aW9uKGluaXRpYWxJbWFnZSk7XHJcblxyXG4gICAgICAgIC8vIFNldCBjdXJyZW50IGltYWdlXHJcbiAgICAgICAgdGhpcy5fb3JpZ2luYWxJbWFnZSA9IGluaXRpYWxJbWFnZTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkTmV4dEltYWdlKCkge1xyXG4gICAgICAgIC8vIENoZWtjIGlmIG5leHQgc2xvdCBpcyBlbXB0eVxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgdGhpcy5faW1hZ2VWaWV3ZXJWaWV3cG9ydC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgICAgICAgICAgYGRpdjpudGgtY2hpbGQoJHt0aGlzLl9jdXJyZW50SW5kZXggKyAyfSlgXHJcbiAgICAgICAgICAgICkuY2hpbGROb2Rlcy5sZW5ndGggPT09IDBcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgLy8gTG9hZCBuZXh0IGltYWdlIGludG8gbmV4dCBjZWxsXHJcbiAgICAgICAgICAgIGNvbnN0IG5leHRJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgICAgICAgICBjb25zdCBuZXh0SW1hZ2VFbGVtZW50ID1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRHYWxsZXJ5LmltYWdlc1t0aGlzLl9jdXJyZW50SW5kZXggKyAxXTtcclxuXHJcbiAgICAgICAgICAgIC8vIEZpdCBpbWFnZSB0byB2aWV3cG9ydFxyXG4gICAgICAgICAgICBjb25zdCB7IGZpbmFsV2lkdGgsIGZpbmFsSGVpZ2h0LCBmaW5hbFggfSA9IHV0aWxzLmZpdFRvVmlld3BvcnQoXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pbWFnZVZpZXdlcixcclxuICAgICAgICAgICAgICAgIG5leHRJbWFnZUVsZW1lbnRcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGdzYXAuc2V0KG5leHRJbWFnZSwge1xyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBmaW5hbEhlaWdodCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBmaW5hbFdpZHRoLFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIG5leHRJbWFnZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2ZmMDAwMCc7XHJcbiAgICAgICAgICAgIG5leHRJbWFnZS5zcmMgPSBuZXh0SW1hZ2VFbGVtZW50LnNyYztcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2ltYWdlVmlld2VyVmlld3BvcnRcclxuICAgICAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKGBkaXY6bnRoLWNoaWxkKCR7dGhpcy5fY3VycmVudEluZGV4ICsgMn0pYClcclxuICAgICAgICAgICAgICAgIC5hcHBlbmQobmV4dEltYWdlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFByZXZJbWFnZSgpIHtcclxuICAgICAgICAvLyBDaGVrYyBpZiBwcmV2aW91cyBzbG90IGlzIGVtcHR5XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICB0aGlzLl9pbWFnZVZpZXdlclZpZXdwb3J0LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgICAgICAgICBgZGl2Om50aC1jaGlsZCgke3RoaXMuX2N1cnJlbnRJbmRleH0pYFxyXG4gICAgICAgICAgICApLmNoaWxkTm9kZXMubGVuZ3RoID09PSAwXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIC8vIExvYWQgbmV4dCBpbWFnZSBpbnRvIG5leHQgY2VsbFxyXG4gICAgICAgICAgICBjb25zdCBwcmV2SW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuICAgICAgICAgICAgY29uc3QgcHJldkltYWdlRWxlbWVudCA9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50R2FsbGVyeS5pbWFnZXNbdGhpcy5fY3VycmVudEluZGV4IC0gMV07XHJcblxyXG4gICAgICAgICAgICAvLyBGaXQgaW1hZ2UgdG8gdmlld3BvcnRcclxuICAgICAgICAgICAgY29uc3QgeyBmaW5hbFdpZHRoLCBmaW5hbEhlaWdodCwgZmluYWxYIH0gPSB1dGlscy5maXRUb1ZpZXdwb3J0KFxyXG4gICAgICAgICAgICAgICAgdGhpcy5faW1hZ2VWaWV3ZXIsXHJcbiAgICAgICAgICAgICAgICBwcmV2SW1hZ2VFbGVtZW50XHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBnc2FwLnNldChwcmV2SW1hZ2UsIHtcclxuICAgICAgICAgICAgICAgIGhlaWdodDogZmluYWxIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogZmluYWxXaWR0aCxcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBuZXh0SW1hZ2Uuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmZjAwMDAnO1xyXG4gICAgICAgICAgICBwcmV2SW1hZ2Uuc3JjID0gcHJldkltYWdlRWxlbWVudC5zcmM7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9pbWFnZVZpZXdlclZpZXdwb3J0XHJcbiAgICAgICAgICAgICAgICAucXVlcnlTZWxlY3RvcihgZGl2Om50aC1jaGlsZCgke3RoaXMuX2N1cnJlbnRJbmRleH0pYClcclxuICAgICAgICAgICAgICAgIC5hcHBlbmQocHJldkltYWdlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlSW1hZ2VBbmltYXRpb24oaW5pdGlhbEltYWdlOiBIVE1MSW1hZ2VFbGVtZW50KSB7XHJcbiAgICAgICAgLy8gQ3JlYXRlIGltYWdlXHJcbiAgICAgICAgdGhpcy5fY3VycmVudEltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICAgICAgdGhpcy5fY3VycmVudEltYWdlLmNsYXNzTGlzdC5hZGQoJ2dhbGxlcnlfaW1hZ2VfcHJldmlldycpO1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbWFnZS5zdHlsZS5oZWlnaHQgPSBgJHtpbml0aWFsSW1hZ2UuY2xpZW50SGVpZ2h0fXB4YDtcclxuICAgICAgICB0aGlzLl9jdXJyZW50SW1hZ2Uuc3R5bGUud2lkdGggPSBgJHtpbml0aWFsSW1hZ2UuY2xpZW50V2lkdGh9cHhgO1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbWFnZS5zcmMgPSBpbml0aWFsSW1hZ2Uuc3JjO1xyXG5cclxuICAgICAgICAvLyBTZXQgaW1hZ2UgZmluYWwgc2l6ZSB0byBiZXN0IGZpdCBpbWFnZSB2aWV3ZXJcclxuXHJcbiAgICAgICAgY29uc3QgeyBmaW5hbFdpZHRoLCBmaW5hbEhlaWdodCwgZmluYWxYLCBmaW5hbFkgfSA9IHV0aWxzLmZpdFRvVmlld3BvcnQoXHJcbiAgICAgICAgICAgIHRoaXMuX2ltYWdlVmlld2VyLFxyXG4gICAgICAgICAgICBpbml0aWFsSW1hZ2VcclxuICAgICAgICApO1xyXG4gICAgICAgIC8vIEFuaW1hdGUgaW1hZ2UgdG8gY2VudGVyIHdpdGggaXRzIGN1cnJlbnQgaGVpZ2h0IGFuZCB3aWR0aCB0byBpdHMgZmluYWwgc2l6ZVxyXG4gICAgICAgIGdzYXAuZnJvbVRvKFxyXG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50SW1hZ2UsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHg6IGluaXRpYWxJbWFnZS5vZmZzZXRMZWZ0LFxyXG4gICAgICAgICAgICAgICAgeTogaW5pdGlhbEltYWdlLm9mZnNldFRvcCAtIHdpbmRvdy5zY3JvbGxZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IGluaXRpYWxJbWFnZS5jbGllbnRXaWR0aCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogaW5pdGlhbEltYWdlLmNsaWVudEhlaWdodCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeDogZmluYWxYLFxyXG4gICAgICAgICAgICAgICAgeTogZmluYWxZLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBmaW5hbEhlaWdodCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBmaW5hbFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ltYWdlVmlld2VyVmlld3BvcnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgZGl2Om50aC1jaGlsZCgke3RoaXMuX2N1cnJlbnRJbmRleCArIDF9KWBcclxuICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKHRoaXMuX2N1cnJlbnRJbWFnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudEltYWdlLmNsYXNzTGlzdC5yZW1vdmUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdnYWxsZXJ5X2ltYWdlX3ByZXZpZXcnXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBnc2FwLnNldCh0aGlzLl9jdXJyZW50SW1hZ2UsIHsgeTogMCB9KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50SW1hZ2Uuc3R5bGUudHJhbnNmb3JtID0gJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFNob3cgcHJldiBhbmQgbmV4dCBidXR0b25cclxuICAgICAgICAgICAgICAgICAgICBnc2FwLnRvKHRoaXMuX3ByZXZCdXR0b24sIHsgeDogNTAsIGR1cmF0aW9uOiAwLjMgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3NhcC50byh0aGlzLl9uZXh0QnV0dG9uLCB7IHg6IC01MCwgZHVyYXRpb246IDAuMyB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuX2N1cnJlbnRJbWFnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlVG9wYmFyKCkge1xyXG4gICAgICAgIHRoaXMuX3RvcGJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMuX3RvcGJhci5jbGFzc0xpc3QuYWRkKCdnYWxsZXJ5X190b3BiYXInKTtcclxuXHJcbiAgICAgICAgY29uc3QgaW1hZ2VUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuXHJcbiAgICAgICAgY29uc3QgYnV0dG9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGJ1dHRvbnMuY2xhc3NMaXN0LmFkZCgnZ2FsbGVyeV9fdG9wYmFyX19idXR0b25zJyk7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0IGRvd25sb2FkQnV0dG9uID0gdXRpbHMuY3JlYXRlSWNvbkJ1dHRvbignZmEtZG93bmxvYWQnKTtcclxuICAgICAgICAvLyBjb25zdCBzaGFyZUJ1dHRvbiA9IHV0aWxzLmNyZWF0ZUljb25CdXR0b24oJ2ZhLXNoYXJlLW5vZGVzJyk7XHJcbiAgICAgICAgY29uc3Qgem9vbUJ1dHRvbiA9IHV0aWxzLmNyZWF0ZUljb25CdXR0b24oJ2ZhLW1hZ25pZnlpbmctZ2xhc3MtcGx1cycpO1xyXG4gICAgICAgIHpvb21CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuem9vbSgpO1xyXG4gICAgICAgICAgICBnc2FwLnRvKHRoaXMuX2N1cnJlbnRJbWFnZSwgeyBzY2FsZTogNC40NTgyIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBjbG9zZUJ1dHRvbiA9IHV0aWxzLmNyZWF0ZUljb25CdXR0b24oJ2ZhLXhtYXJrJyk7XHJcbiAgICAgICAgY2xvc2VCdXR0b24uY2xhc3NMaXN0LmFkZCgnZ2FsbGVyeV9fdG9wYmFyX19jbG9zZScpO1xyXG4gICAgICAgIGNsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGJ1dHRvbnMuYXBwZW5kKHpvb21CdXR0b24sIGNsb3NlQnV0dG9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5fdG9wYmFyLmFwcGVuZENoaWxkKGltYWdlVGl0bGUpO1xyXG4gICAgICAgIHRoaXMuX3RvcGJhci5hcHBlbmRDaGlsZChidXR0b25zKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VUaXRsZShuZXdUaXRsZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fdG9wYmFyLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKS5pbm5lclRleHQgPSBuZXdUaXRsZTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICBjb25zdCBpbml0aWFsWCA9IHRoaXMuX2N1cnJlbnRJbWFnZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xyXG4gICAgICAgIGNvbnN0IGluaXRpYWxZID0gdGhpcy5fY3VycmVudEltYWdlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcclxuXHJcbiAgICAgICAgLy8gR2l2ZSBiYWNrIGl0cyBjYWxzc1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbWFnZS5jbGFzc0xpc3QuYWRkKCdnYWxsZXJ5X2ltYWdlX3ByZXZpZXcnKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuX2N1cnJlbnRJbWFnZSk7XHJcblxyXG4gICAgICAgIC8vIFJldHJhY3QgY3VycmVudCBpbWFnZSB0byBvcmlnaW5hbCBpbWFnZSBwb3NpdGlvblxyXG4gICAgICAgIGdzYXAuZnJvbVRvKFxyXG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50SW1hZ2UsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHg6IGluaXRpYWxYLFxyXG4gICAgICAgICAgICAgICAgeTogaW5pdGlhbFksXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5fY3VycmVudEltYWdlLmNsaWVudFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLl9jdXJyZW50SW1hZ2UuY2xpZW50SGVpZ2h0LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4OiB0aGlzLl9vcmlnaW5hbEltYWdlLm9mZnNldExlZnQsXHJcbiAgICAgICAgICAgICAgICB5OiB0aGlzLl9vcmlnaW5hbEltYWdlLm9mZnNldFRvcCAtIHdpbmRvdy5zY3JvbGxZLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLl9vcmlnaW5hbEltYWdlLmNsaWVudEhlaWdodCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLl9vcmlnaW5hbEltYWdlLmNsaWVudFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDAuMyxcclxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50SW1hZ2UucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgZ3NhcC50byhbdGhpcy5fY29udGFpbmVyLCB0aGlzLl9iYWNrZHJvcF0sIHtcclxuICAgICAgICAgICAgb3BhY2l0eTogMCxcclxuICAgICAgICAgICAgZHVyYXRpb246IDAuMyxcclxuICAgICAgICAgICAgb25Db21wbGV0ZTogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFja2Ryb3AucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250YWluZXIucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB1dGlscy5lbmFibGVTY3JvbGxpbmcoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZ3NhcC50byh0aGlzLl9zbGlkZXIsIHtcclxuICAgICAgICAgICAgeTogMTAwLFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogMC4zLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBBbmltYXRlIHRvcGJhciBsZWF2aW5nXHJcbiAgICAgICAgZ3NhcC50byh0aGlzLl90b3BiYXIsIHtcclxuICAgICAgICAgICAgeTogLTYwLFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogMC4zLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBBbmltYXRlIHByZXYgbmV4dCBidXR0b25zXHJcbiAgICAgICAgZ3NhcC50byh0aGlzLl9uZXh0QnV0dG9uLCB7IHg6IDAsIGR1cmF0aW9uOiAwLjMgfSk7XHJcbiAgICB9XHJcbiAgICBwcmV2SW1hZ2UoKSB7XHJcbiAgICAgICAgdGhpcy5fY3VycmVudEluZGV4IC09IDE7XHJcblxyXG4gICAgICAgIGdzYXAudG8odGhpcy5faW1hZ2VWaWV3ZXJWaWV3cG9ydCwge1xyXG4gICAgICAgICAgICB4OiAtKHRoaXMuX2N1cnJlbnRJbmRleCAqIGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGgpLFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogMC40LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNoYW5nZVRpdGxlKFxyXG4gICAgICAgICAgICBgJHt0aGlzLl9jdXJyZW50SW5kZXggKyAxfSAvICR7dGhpcy5fY3VycmVudEdhbGxlcnkuaW1hZ2VzLmxlbmd0aH1gXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5fb3JpZ2luYWxJbWFnZSA9IHRoaXMuX2N1cnJlbnRHYWxsZXJ5LmltYWdlc1t0aGlzLl9jdXJyZW50SW5kZXhdO1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbWFnZSA9IHRoaXMuX2ltYWdlVmlld2VyVmlld3BvcnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgICAgICAgYGRpdjpudGgtY2hpbGQoJHt0aGlzLl9jdXJyZW50SW5kZXggKyAxfSkgPiBpbWdgXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy9JZiBub3QgZmlyc3QgaW1hZ2UsIExvYWQgcHJldiBpbWFnZVxyXG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50SW5kZXggIT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5sb2FkUHJldkltYWdlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX25leHRCdXR0b24ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ByZXZCdXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbmV4dEltYWdlKCkge1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbmRleCArPSAxO1xyXG5cclxuICAgICAgICBnc2FwLnRvKHRoaXMuX2ltYWdlVmlld2VyVmlld3BvcnQsIHtcclxuICAgICAgICAgICAgeDogLSh0aGlzLl9jdXJyZW50SW5kZXggKiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoKSxcclxuICAgICAgICAgICAgZHVyYXRpb246IDAuNCxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jaGFuZ2VUaXRsZShcclxuICAgICAgICAgICAgYCR7dGhpcy5fY3VycmVudEluZGV4ICsgMX0gLyAke3RoaXMuX2N1cnJlbnRHYWxsZXJ5LmltYWdlcy5sZW5ndGh9YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMuX29yaWdpbmFsSW1hZ2UgPSB0aGlzLl9jdXJyZW50R2FsbGVyeS5pbWFnZXNbdGhpcy5fY3VycmVudEluZGV4XTtcclxuICAgICAgICB0aGlzLl9jdXJyZW50SW1hZ2UgPSB0aGlzLl9pbWFnZVZpZXdlclZpZXdwb3J0LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgICAgIGBkaXY6bnRoLWNoaWxkKCR7dGhpcy5fY3VycmVudEluZGV4ICsgMX0pID4gaW1nYFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vSWYgbm90IGxhc3QgaW1hZ2UsIExvYWQgbmV4dCBpbWFnZVxyXG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50SW5kZXggPCB0aGlzLl9jdXJyZW50R2FsbGVyeS5pbWFnZXMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvYWROZXh0SW1hZ2UoKTtcclxuICAgICAgICAgICAgdGhpcy5fcHJldkJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gRGlzYWJsZSBidXR0b25cclxuICAgICAgICAgICAgdGhpcy5fbmV4dEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJycpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB6b29tKCkge1xyXG4gICAgICAgIGdzYXAudG8odGhpcy5fc2xpZGVyLCB7IHk6IDEwMCwgZHVyYXRpb246IDAuMyB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgR2FsbGVyeVVJO1xyXG4iLCJpbXBvcnQgR2FsbGVyeSBmcm9tICcuL0dhbGxlcnknO1xyXG5pbXBvcnQgZ3NhcCBmcm9tICdnc2FwJztcclxuaW1wb3J0IEdhbGxlcnlVSSBmcm9tICcuL0dhbGxlcnlVSSc7XHJcblxyXG5cclxuY29uc3QgZ2FsbGVyaWVzOiBHYWxsZXJ5W10gPSBbXTtcclxuY29uc3QgZ2FsbGVyeVVJOiBHYWxsZXJ5VUkgPSBuZXcgR2FsbGVyeVVJKCk7XHJcblxyXG4vLyBHZW5lcmF0ZSBHYWxsZXJpZXNcclxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MSW1hZ2VFbGVtZW50PignYVtkYXRhLWdhbGxlcnldJykuZm9yRWFjaCgoZ2FsbGVyeUl0ZW0pID0+IHtcclxuICAgIGNvbnN0IGdhbGxlcnlJZCA9IGdhbGxlcnlJdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1nYWxsZXJ5Jyk7XHJcbiAgICBjb25zdCBpbWFnZSA9IGdhbGxlcnlJdGVtLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpO1xyXG4gICAgLy8gQ2hlY2sgaWYgaXRzIGdhbGxlcnkgYWxyZWFkeSBleGlzdHNcclxuICAgIGlmIChnYWxsZXJpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGdhbGxlcmllcy5ldmVyeShnYWxsZXJ5ID0+IHtcclxuICAgICAgICAgICAgaWYgKGdhbGxlcnkuaWQgPT09IGdhbGxlcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgZ2FsbGVyeS5hZGRJbWFnZShpbWFnZSk7XHJcbiAgICAgICAgICAgICAgICBnYWxsZXJ5SXRlbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnLCAoZ2FsbGVyeS5pbWFnZXMubGVuZ3RoIC0gMSkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gR2FsbGVyeSBkb2VzbnQgZXhpc3RcclxuICAgICAgICBjb25zdCBuZXdHYWxsZXJ5ID0gbmV3IEdhbGxlcnkoZ2FsbGVyeUlkKTtcclxuICAgICAgICBuZXdHYWxsZXJ5LmFkZEltYWdlKGltYWdlKTtcclxuICAgICAgICBnYWxsZXJpZXMucHVzaChuZXdHYWxsZXJ5KTtcclxuICAgICAgICBnYWxsZXJ5SXRlbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnLCAobmV3R2FsbGVyeS5pbWFnZXMubGVuZ3RoIC0gMSkudG9TdHJpbmcoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQXR0YWNoIGV2ZW50c1xyXG4gICAgZ2FsbGVyeUl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudDogTW91c2VFdmVudCAmIHtjdXJyZW50VGFyZ2V0OiBIVE1MTGlua0VsZW1lbnR9KXtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBsZXQgZ2FsbGVyeSA9IG51bGw7XHJcblxyXG4gICAgICAgIGdhbGxlcmllcy5ldmVyeShnYWwgPT4ge1xyXG4gICAgICAgICAgICBpZihnYWwuaWQgPT09IGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWdhbGxlcnknKSkge1xyXG4gICAgICAgICAgICAgICAgZ2FsbGVyeSA9IGdhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBnYWxsZXJ5VUkub3BlbihnYWxsZXJ5LCBldmVudC5jdXJyZW50VGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ2ltZycpLCBldmVudC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1oaWdoLXJlcycpLCBwYXJzZUludChldmVudC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcpKSk7XHJcbiAgICB9KTtcclxufSk7XHJcblxyXG4iLCJleHBvcnQgdHlwZSBJbWFnZSA9IHtcclxuICAgIGZpbmFsWDogbnVtYmVyLFxyXG4gICAgZmluYWxZOiBudW1iZXIsXHJcbiAgICBmaW5hbFdpZHRoOiBudW1iZXIsXHJcbiAgICBmaW5hbEhlaWdodDogbnVtYmVyLFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW1hZ2VTaXplKFxyXG4gICAgaW1hZ2U6IEhUTUxJbWFnZUVsZW1lbnQsXHJcbiAgICBjYWxsYmFjazogRnVuY3Rpb25cclxuKTogdm9pZCB7XHJcbiAgICBsZXQgdywgaDogbnVtYmVyO1xyXG4gICAgY29uc3QgcG9sbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICB3ID0gaW1hZ2UubmF0dXJhbFdpZHRoO1xyXG4gICAgICAgIGggPSBpbWFnZS5uYXR1cmFsSGVpZ2h0O1xyXG5cclxuICAgICAgICBpZiAodyAmJiBoKSB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwocG9sbCk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIFt3LCBoXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXNhYmxlU2Nyb2xsaW5nKCkge1xyXG4gICAgY29uc3Qgc2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XHJcbiAgICBjb25zdCBzY3JvbGxMZWZ0ID1cclxuICAgICAgICB3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQ7XHJcblxyXG4gICAgd2luZG93Lm9uc2Nyb2xsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbyhzY3JvbGxMZWZ0LCBzY3JvbGxUb3ApO1xyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGVuYWJsZVNjcm9sbGluZygpIHtcclxuICAgIHdpbmRvdy5vbnNjcm9sbCA9IGZ1bmN0aW9uICgpIHt9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSWNvbkJ1dHRvbihmYUNsYXNzOiBzdHJpbmcpOiBIVE1MQnV0dG9uRWxlbWVudCB7XHJcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdmYS1zb2xpZCcsIGZhQ2xhc3MpO1xyXG4gICAgcmV0dXJuIGJ1dHRvbjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZpdFRvVmlld3BvcnQoaW1hZ2VWaWV3ZXI6IEhUTUxEaXZFbGVtZW50LCBpbml0aWFsSW1hZ2U6IEhUTUxJbWFnZUVsZW1lbnQpOiBJbWFnZSB7XHJcbiAgICBjb25zdCByYXRpbyA9IGluaXRpYWxJbWFnZS5uYXR1cmFsV2lkdGggLyBpbml0aWFsSW1hZ2UubmF0dXJhbEhlaWdodDtcclxuICAgIGNvbnN0IHByYXRpbyA9IGltYWdlVmlld2VyLmNsaWVudFdpZHRoIC8gaW1hZ2VWaWV3ZXIuY2xpZW50SGVpZ2h0O1xyXG5cclxuICAgIGxldCBmaW5hbFdpZHRoLCBmaW5hbEhlaWdodCwgZmluYWxYLCBmaW5hbFk6IG51bWJlcjtcclxuXHJcbiAgICBpZiAocmF0aW8gPCBwcmF0aW8pIHtcclxuICAgICAgICBjb25zdCBzY2FsZUZhY3RvciA9XHJcbiAgICAgICAgICAgIGltYWdlVmlld2VyLmNsaWVudEhlaWdodCAvIGluaXRpYWxJbWFnZS5uYXR1cmFsSGVpZ2h0O1xyXG4gICAgICAgIGZpbmFsSGVpZ2h0ID0gaW1hZ2VWaWV3ZXIuY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgIGZpbmFsV2lkdGggPSBpbml0aWFsSW1hZ2UubmF0dXJhbFdpZHRoICogc2NhbGVGYWN0b3I7XHJcblxyXG4gICAgICAgIGZpbmFsWCA9IGltYWdlVmlld2VyLmNsaWVudFdpZHRoIC8gMiAtIGZpbmFsV2lkdGggLyAyO1xyXG4gICAgICAgIGZpbmFsWSA9IGltYWdlVmlld2VyLm9mZnNldFRvcDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3Qgc2NhbGVGYWN0b3IgPSBpbWFnZVZpZXdlci5jbGllbnRXaWR0aCAvIGluaXRpYWxJbWFnZS5uYXR1cmFsV2lkdGg7XHJcblxyXG4gICAgICAgIGZpbmFsV2lkdGggPSBpbWFnZVZpZXdlci5jbGllbnRXaWR0aDtcclxuICAgICAgICBmaW5hbEhlaWdodCA9IGluaXRpYWxJbWFnZS5uYXR1cmFsSGVpZ2h0ICogc2NhbGVGYWN0b3I7XHJcblxyXG4gICAgICAgIGZpbmFsWCA9IGltYWdlVmlld2VyLm9mZnNldExlZnQ7XHJcbiAgICAgICAgZmluYWxZID0gKGltYWdlVmlld2VyLmNsaWVudEhlaWdodCAvIDIgLSBmaW5hbEhlaWdodCAvIDIpICsgaW1hZ2VWaWV3ZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZmluYWxXaWR0aDogZmluYWxXaWR0aCxcclxuICAgICAgICBmaW5hbEhlaWdodDogZmluYWxIZWlnaHQsXHJcbiAgICAgICAgZmluYWxYOiBmaW5hbFgsXHJcbiAgICAgICAgZmluYWxZOiBmaW5hbFlcclxuICAgIH07XHJcbn1cclxuIl19
