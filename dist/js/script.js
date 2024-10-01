(function () {
  'use strict';

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  /*!
   * GSAP 3.12.5
   * https://gsap.com
   *
   * @license Copyright 2008-2024, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license or for
   * Club GSAP members, the agreement issued with that membership.
   * @author: Jack Doyle, jack@greensock.com
  */

  /* eslint-disable */
  var _config = {
      autoSleep: 120,
      force3D: "auto",
      nullTargetWarn: 1,
      units: {
        lineHeight: ""
      }
    },
    _defaults$1 = {
      duration: .5,
      overwrite: false,
      delay: 0
    },
    _suppressOverwrites$1,
    _reverting$1,
    _context$3,
    _bigNum$2 = 1e8,
    _tinyNum = 1 / _bigNum$2,
    _2PI$1 = Math.PI * 2,
    _HALF_PI = _2PI$1 / 4,
    _gsID = 0,
    _sqrt$2 = Math.sqrt,
    _cos$2 = Math.cos,
    _sin$2 = Math.sin,
    _isString$2 = function _isString(value) {
      return typeof value === "string";
    },
    _isFunction$2 = function _isFunction(value) {
      return typeof value === "function";
    },
    _isNumber$2 = function _isNumber(value) {
      return typeof value === "number";
    },
    _isUndefined = function _isUndefined(value) {
      return typeof value === "undefined";
    },
    _isObject$1 = function _isObject(value) {
      return typeof value === "object";
    },
    _isNotFalse = function _isNotFalse(value) {
      return value !== false;
    },
    _windowExists$2 = function _windowExists() {
      return typeof window !== "undefined";
    },
    _isFuncOrString = function _isFuncOrString(value) {
      return _isFunction$2(value) || _isString$2(value);
    },
    _isTypedArray = typeof ArrayBuffer === "function" && ArrayBuffer.isView || function () {},
    // note: IE10 has ArrayBuffer, but NOT ArrayBuffer.isView().
    _isArray = Array.isArray,
    _strictNumExp = /(?:-?\.?\d|\.)+/gi,
    //only numbers (including negatives and decimals) but NOT relative values.
    _numExp$1 = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,
    //finds any numbers, including ones that start with += or -=, negative numbers, and ones in scientific notation like 1e-8.
    _numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g,
    _complexStringNumExp = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,
    //duplicate so that while we're looping through matches from exec(), it doesn't contaminate the lastIndex of _numExp which we use to search for colors too.
    _relExp = /[+-]=-?[.\d]+/,
    _delimitedValueExp = /[^,'"\[\]\s]+/gi,
    // previously /[#\-+.]*\b[a-z\d\-=+%.]+/gi but didn't catch special characters.
    _unitExp = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,
    _globalTimeline,
    _win$4,
    _coreInitted$4,
    _doc$4,
    _globals = {},
    _installScope = {},
    _coreReady,
    _install = function _install(scope) {
      return (_installScope = _merge(scope, _globals)) && gsap$4;
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
    _startAtRevertConfig = {
      suppressEvents: true,
      isStart: true,
      kill: false
    },
    _revertConfigNoKill = {
      suppressEvents: true,
      kill: false
    },
    _revertConfig = {
      suppressEvents: true
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
      _isObject$1(target) || _isFunction$2(target) || (targets = [targets]);
      if (!(harnessPlugin = (target._gsap || {}).harness)) {
        // find the first target with a harness. We assume targets passed into an animation will be of similar type, meaning the same kind of harness can be used for them all (performance optimization)
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
      return target._gsap || _harness(toArray$3(target))[0]._gsap;
    },
    _getProperty = function _getProperty(target, property, v) {
      return (v = target[property]) && _isFunction$2(v) ? target[property]() : _isUndefined(v) && target.getAttribute && target.getAttribute(property) || v;
    },
    _forEachName = function _forEachName(names, func) {
      return (names = names.split(",")).forEach(func) || names;
    },
    //split a comma-delimited list of names into an array, then run a forEach() function and return the split array (this is just a way to consolidate/shorten some code).
    _round$2 = function _round(value) {
      return Math.round(value * 100000) / 100000 || 0;
    },
    _roundPrecise = function _roundPrecise(value) {
      return Math.round(value * 10000000) / 10000000 || 0;
    },
    // increased precision mostly for timing values.
    _parseRelative = function _parseRelative(start, value) {
      var operator = value.charAt(0),
        end = parseFloat(value.substr(2));
      start = parseFloat(start);
      return operator === "+" ? start + end : operator === "-" ? start - end : operator === "*" ? start * end : start / end;
    },
    _arrayContainsAny = function _arrayContainsAny(toSearch, toFind) {
      //searches one array to find matches for any of the items in the toFind array. As soon as one is found, it returns true. It does NOT return all the matches; it's simply a boolean search.
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
      _lazyTweens.length && !_reverting$1 && _lazyRender();
      animation.render(time, suppressEvents, force || _reverting$1 && time < 0 && (animation._initted || animation._startAt));
      _lazyTweens.length && !_reverting$1 && _lazyRender(); //in case rendering caused any tweens to lazy-init, we should render them because typically when someone calls seek() or time() or progress(), they expect an immediate render.
    },
    _numericIfPossible = function _numericIfPossible(value) {
      var n = parseFloat(value);
      return (n || n === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n : _isString$2(value) ? value.trim() : value;
    },
    _passThrough$1 = function _passThrough(p) {
      return p;
    },
    _setDefaults$1 = function _setDefaults(obj, defaults) {
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
        p !== "__proto__" && p !== "constructor" && p !== "prototype" && (base[p] = _isObject$1(toMerge[p]) ? _mergeDeep(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p]);
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
        func = vars.keyframes ? _setKeyframeDefaults(_isArray(vars.keyframes)) : _setDefaults$1;
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
      child._next = child._prev = child.parent = null; // don't delete the _dp just so we can revert if necessary. But parent should be null to indicate the item isn't in a linked list.
    },
    _removeFromParent = function _removeFromParent(child, onlyIfParentHasAutoRemove) {
      child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren) && child.parent.remove && child.parent.remove(child);
      child._act = 0;
    },
    _uncache = function _uncache(animation, child) {
      if (animation && (!child || child._end > animation._dur || child._start < 0)) {
        // performance optimization: if a child animation is passed in we should only uncache if that child EXTENDS the animation (its end time is beyond the end)
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
        //sometimes we must force a re-sort of all children and update the duration/totalDuration of all ancestor timelines immediately in case, for example, in the middle of a render loop, one tween alters another tween's timeScale which shoves its startTime before 0, forcing the parent timeline to shift around and shiftChildren() which could affect that next tween's render (startTime). Doesn't matter for the root timeline though.
        parent._dirty = 1;
        parent.totalDuration();
        parent = parent.parent;
      }
      return animation;
    },
    _rewindStartAt = function _rewindStartAt(tween, totalTime, suppressEvents, force) {
      return tween._startAt && (_reverting$1 ? tween._startAt.revert(_revertConfigNoKill) : tween.vars.immediateRender && !tween.vars.autoRevert || tween._startAt.render(totalTime, true, force));
    },
    _hasNoPausedAncestors = function _hasNoPausedAncestors(animation) {
      return !animation || animation._ts && _hasNoPausedAncestors(animation.parent);
    },
    _elapsedCycleDuration = function _elapsedCycleDuration(animation) {
      return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0;
    },
    // feed in the totalTime and cycleDuration and it'll return the cycle (iteration minus 1) and if the playhead is exactly at the very END, it will NOT bump up to the next cycle.
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
      // adjusts the animation's _start and _end according to the provided totalTime (only if the parent's smoothChildTiming is true and the animation isn't paused). It doesn't do any rendering or forcing things back into parent timelines, etc. - that's what totalTime() is for.
      var parent = animation._dp;
      if (parent && parent.smoothChildTiming && animation._ts) {
        animation._start = _roundPrecise(parent._time - (animation._ts > 0 ? totalTime / animation._ts : ((animation._dirty ? animation.totalDuration() : animation._tDur) - totalTime) / -animation._ts));
        _setEnd(animation);
        parent._dirty || _uncache(parent, animation); //for performance improvement. If the parent's cache is already dirty, it already took care of marking the ancestors as dirty too, so skip the function call here.
      }

      return animation;
    },
    /*
    _totalTimeToTime = (clampedTotalTime, duration, repeat, repeatDelay, yoyo) => {
    	let cycleDuration = duration + repeatDelay,
    		time = _round(clampedTotalTime % cycleDuration);
    	if (time > duration) {
    		time = duration;
    	}
    	return (yoyo && (~~(clampedTotalTime / cycleDuration) & 1)) ? duration - time : time;
    },
    */
    _postAddChecks = function _postAddChecks(timeline, child) {
      var t;
      if (child._time || !child._dur && child._initted || child._start < timeline._time && (child._dur || !child.add)) {
        // in case, for example, the _start is moved on a tween that has already rendered, or if it's being inserted into a timeline BEFORE where the playhead is currently. Imagine it's at its end state, then the startTime is moved WAY later (after the end of this timeline), it should render at its beginning. Special case: if it's a timeline (has .add() method) and no duration, we can skip rendering because the user may be populating it AFTER adding it to a parent timeline (unconventional, but possible, and we wouldn't want it to get removed if the parent's autoRemoveChildren is true).
        t = _parentToChildTotalTime(timeline.rawTime(), child);
        if (!child._dur || _clamp$1(0, child.totalDuration(), t) - child._tTime > _tinyNum) {
          child.render(t, true);
        }
      } //if the timeline has already ended but the inserted tween/timeline extends the duration, we should enable this timeline again so that it renders properly. We should also align the playhead with the parent timeline's when appropriate.

      if (_uncache(timeline, child)._dp && timeline._initted && timeline._time >= timeline._dur && timeline._ts) {
        //in case any of the ancestors had completed but should now be enabled...
        if (timeline._dur < timeline.duration()) {
          t = timeline;
          while (t._dp) {
            t.rawTime() >= 0 && t.totalTime(t._tTime); //moves the timeline (shifts its startTime) if necessary, and also enables it. If it's currently zero, though, it may not be scheduled to render until later so there's no need to force it to align with the current playhead position. Only move to catch up with the playhead.

            t = t._dp;
          }
        }
        timeline._zTime = -_tinyNum; // helps ensure that the next render() will be forced (crossingStart = true in render()), even if the duration hasn't changed (we're adding a child which would need to get rendered). Definitely an edge case. Note: we MUST do this AFTER the loop above where the totalTime() might trigger a render() because this _addToTimeline() method gets called from the Animation constructor, BEFORE tweens even record their targets, etc. so we wouldn't want things to get triggered in the wrong order.
      }
    },
    _addToTimeline = function _addToTimeline(timeline, child, position, skipChecks) {
      child.parent && _removeFromParent(child);
      child._start = _roundPrecise((_isNumber$2(position) ? position : position || timeline !== _globalTimeline ? _parsePosition$1(timeline, position, child) : timeline._time) + child._delay);
      child._end = _roundPrecise(child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0));
      _addLinkedListItem(timeline, child, "_first", "_last", timeline._sort ? "_start" : 0);
      _isFromOrFromStart(child) || (timeline._recent = child);
      skipChecks || _postAddChecks(timeline, child);
      timeline._ts < 0 && _alignPlayhead(timeline, timeline._tTime); // if the timeline is reversed and the new child makes it longer, we may need to adjust the parent's _start (push it back)

      return timeline;
    },
    _scrollTrigger = function _scrollTrigger(animation, trigger) {
      return (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", trigger)) && _globals.ScrollTrigger.create(trigger, animation);
    },
    _attemptInitTween = function _attemptInitTween(tween, time, force, suppressEvents, tTime) {
      _initTween(tween, time, tTime);
      if (!tween._initted) {
        return 1;
      }
      if (!force && tween._pt && !_reverting$1 && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
        _lazyTweens.push(tween);
        tween._lazy = [tTime, suppressEvents];
        return 1;
      }
    },
    _parentPlayheadIsBeforeStart = function _parentPlayheadIsBeforeStart(_ref) {
      var parent = _ref.parent;
      return parent && parent._ts && parent._initted && !parent._lock && (parent.rawTime() < 0 || _parentPlayheadIsBeforeStart(parent));
    },
    // check parent's _lock because when a timeline repeats/yoyos and does its artificial wrapping, we shouldn't force the ratio back to 0
    _isFromOrFromStart = function _isFromOrFromStart(_ref2) {
      var data = _ref2.data;
      return data === "isFromStart" || data === "isStart";
    },
    _renderZeroDurationTween = function _renderZeroDurationTween(tween, totalTime, suppressEvents, force) {
      var prevRatio = tween.ratio,
        ratio = totalTime < 0 || !totalTime && (!tween._start && _parentPlayheadIsBeforeStart(tween) && !(!tween._initted && _isFromOrFromStart(tween)) || (tween._ts < 0 || tween._dp._ts < 0) && !_isFromOrFromStart(tween)) ? 0 : 1,
        // if the tween or its parent is reversed and the totalTime is 0, we should go to a ratio of 0. Edge case: if a from() or fromTo() stagger tween is placed later in a timeline, the "startAt" zero-duration tween could initially render at a time when the parent timeline's playhead is technically BEFORE where this tween is, so make sure that any "from" and "fromTo" startAt tweens are rendered the first time at a ratio of 1.
        repeatDelay = tween._rDelay,
        tTime = 0,
        pt,
        iteration,
        prevIteration;
      if (repeatDelay && tween._repeat) {
        // in case there's a zero-duration tween that has a repeat with a repeatDelay
        tTime = _clamp$1(0, tween._tDur, totalTime);
        iteration = _animationCycle(tTime, repeatDelay);
        tween._yoyo && iteration & 1 && (ratio = 1 - ratio);
        if (iteration !== _animationCycle(tween._tTime, repeatDelay)) {
          // if iteration changed
          prevRatio = 1 - ratio;
          tween.vars.repeatRefresh && tween._initted && tween.invalidate();
        }
      }
      if (ratio !== prevRatio || _reverting$1 || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
        if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents, tTime)) {
          // if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
          return;
        }
        prevIteration = tween._zTime;
        tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0); // when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect.

        suppressEvents || (suppressEvents = totalTime && !prevIteration); // if it was rendered previously at exactly 0 (_zTime) and now the playhead is moving away, DON'T fire callbacks otherwise they'll seem like duplicates.

        tween.ratio = ratio;
        tween._from && (ratio = 1 - ratio);
        tween._time = 0;
        tween._tTime = tTime;
        pt = tween._pt;
        while (pt) {
          pt.r(ratio, pt.d);
          pt = pt._next;
        }
        totalTime < 0 && _rewindStartAt(tween, totalTime, suppressEvents, true);
        tween._onUpdate && !suppressEvents && _callback$1(tween, "onUpdate");
        tTime && tween._repeat && !suppressEvents && tween.parent && _callback$1(tween, "onRepeat");
        if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
          ratio && _removeFromParent(tween, 1);
          if (!suppressEvents && !_reverting$1) {
            _callback$1(tween, ratio ? "onComplete" : "onReverseComplete", true);
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
      totalProgress > 0 && !leavePlayhead && _alignPlayhead(animation, animation._tTime = animation._tDur * totalProgress);
      animation.parent && _setEnd(animation);
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
    _parsePosition$1 = function _parsePosition(animation, position, percentAnimation) {
      var labels = animation.labels,
        recent = animation._recent || _zeroPosition,
        clippedDuration = animation.duration() >= _bigNum$2 ? recent.endTime(false) : animation._dur,
        //in case there's a child that infinitely repeats, users almost never intend for the insertion point of a new child to be based on a SUPER long value like that so we clip it and assume the most recently-added child's endTime should be used instead.
        i,
        offset,
        isPercent;
      if (_isString$2(position) && (isNaN(position) || position in labels)) {
        //if the string is a number like "1", check to see if there's a label with that name, otherwise interpret it as a number (absolute value).
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
      var isLegacy = _isNumber$2(params[1]),
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
          // inheritance hasn't happened yet, but someone may have set a default in an ancestor timeline. We could do vars.immediateRender = _isNotFalse(_inheritDefaults(vars).immediateRender) but that'd exact a slight performance penalty because _inheritDefaults() also runs in the Tween constructor. We're paying a small kb price here to gain speed.
          irVars = parent.vars.defaults || {};
          parent = _isNotFalse(parent.vars.inherit) && parent.parent;
        }
        vars.immediateRender = _isNotFalse(irVars.immediateRender);
        type < 2 ? vars.runBackwards = 1 : vars.startAt = params[varsIndex - 1]; // "from" vars
      }

      return new Tween(params[0], vars, params[varsIndex + 1]);
    },
    _conditionalReturn = function _conditionalReturn(value, func) {
      return value || value === 0 ? func(value) : func;
    },
    _clamp$1 = function _clamp(min, max, value) {
      return value < min ? min : value > max ? max : value;
    },
    getUnit = function getUnit(value, v) {
      return !_isString$2(value) || !(v = _unitExp.exec(value)) ? "" : v[1];
    },
    // note: protect against padded numbers as strings, like "100.100". That shouldn't return "00" as the unit. If it's numeric, return no unit.
    clamp$3 = function clamp(min, max, value) {
      return _conditionalReturn(value, function (v) {
        return _clamp$1(min, max, v);
      });
    },
    _slice = [].slice,
    _isArrayLike = function _isArrayLike(value, nonEmpty) {
      return value && _isObject$1(value) && "length" in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject$1(value[0])) && !value.nodeType && value !== _win$4;
    },
    _flatten = function _flatten(ar, leaveStrings, accumulator) {
      if (accumulator === void 0) {
        accumulator = [];
      }
      return ar.forEach(function (value) {
        var _accumulator;
        return _isString$2(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray$3(value)) : accumulator.push(value);
      }) || accumulator;
    },
    //takes any value and returns an array. If it's a string (and leaveStrings isn't true), it'll use document.querySelectorAll() and convert that to an array. It'll also accept iterables like jQuery objects.
    toArray$3 = function toArray(value, scope, leaveStrings) {
      return _context$3 && !scope && _context$3.selector ? _context$3.selector(value) : _isString$2(value) && !leaveStrings && (_coreInitted$4 || !_wake()) ? _slice.call((scope || _doc$4).querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [];
    },
    selector = function selector(value) {
      value = toArray$3(value)[0] || _warn("Invalid scope") || {};
      return function (v) {
        var el = value.current || value.nativeElement || value;
        return toArray$3(v, el.querySelectorAll ? el : el === value ? _warn("Invalid scope") || _doc$4.createElement("div") : value);
      };
    },
    shuffle = function shuffle(a) {
      return a.sort(function () {
        return .5 - Math.random();
      });
    },
    // alternative that's a bit faster and more reliably diverse but bigger:   for (let j, v, i = a.length; i; j = Math.floor(Math.random() * i), v = a[--i], a[i] = a[j], a[j] = v); return a;
    //for distributing values across an array. Can accept a number, a function or (most commonly) a function which can contain the following properties: {base, amount, from, ease, grid, axis, length, each}. Returns a function that expects the following parameters: index, target, array. Recognizes the following
    distribute = function distribute(v) {
      if (_isFunction$2(v)) {
        return v;
      }
      var vars = _isObject$1(v) ? v : {
          each: v
        },
        //n:1 is just to indicate v was a number; we leverage that later to set v according to the length we get. If a number is passed in, we treat it like the old stagger value where 0.1, for example, would mean that things would be distributed with 0.1 between each element in the array rather than a total "amount" that's chunked out among them all.
        ease = _parseEase(vars.ease),
        from = vars.from || 0,
        base = parseFloat(vars.base) || 0,
        cache = {},
        isDecimal = from > 0 && from < 1,
        ratios = isNaN(from) || isDecimal,
        axis = vars.axis,
        ratioX = from,
        ratioY = from;
      if (_isString$2(from)) {
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
          wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum$2])[1];
          if (!wrapAt) {
            max = -_bigNum$2;
            while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l) {}
            wrapAt < l && wrapAt--;
          }
          distances = cache[l] = [];
          originX = ratios ? Math.min(wrapAt, l) * ratioX - .5 : from % wrapAt;
          originY = wrapAt === _bigNum$2 ? 0 : ratios ? l * ratioY / wrapAt - .5 : from / wrapAt | 0;
          max = 0;
          min = _bigNum$2;
          for (j = 0; j < l; j++) {
            x = j % wrapAt - originX;
            y = originY - (j / wrapAt | 0);
            distances[j] = d = !axis ? _sqrt$2(x * x + y * y) : Math.abs(axis === "y" ? y : x);
            d > max && (max = d);
            d < min && (min = d);
          }
          from === "random" && shuffle(distances);
          distances.max = max - min;
          distances.min = min;
          distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt) || 0) * (from === "edges" ? -1 : 1);
          distances.b = l < 0 ? base - l : base;
          distances.u = getUnit(vars.amount || vars.each) || 0; //unit

          ease = ease && l < 0 ? _invertEase(ease) : ease;
        }
        l = (distances[i] - distances.min) / distances.max || 0;
        return _roundPrecise(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u; //round in order to work around floating point errors
      };
    },
    _roundModifier = function _roundModifier(v) {
      //pass in 0.1 get a function that'll round to the nearest tenth, or 5 to round to the closest 5, or 0.001 to the closest 1000th, etc.
      var p = Math.pow(10, ((v + "").split(".")[1] || "").length); //to avoid floating point math errors (like 24 * 0.1 == 2.4000000000000004), we chop off at a specific number of decimal places (much faster than toFixed())

      return function (raw) {
        var n = _roundPrecise(Math.round(parseFloat(raw) / v) * v * p);
        return (n - n % 1) / p + (_isNumber$2(raw) ? 0 : getUnit(raw)); // n - n % 1 replaces Math.floor() in order to handle negative values properly. For example, Math.floor(-150.00000000000003) is 151!
      };
    },
    snap = function snap(snapTo, value) {
      var isArray = _isArray(snapTo),
        radius,
        is2D;
      if (!isArray && _isObject$1(snapTo)) {
        radius = isArray = snapTo.radius || _bigNum$2;
        if (snapTo.values) {
          snapTo = toArray$3(snapTo.values);
          if (is2D = !_isNumber$2(snapTo[0])) {
            radius *= radius; //performance optimization so we don't have to Math.sqrt() in the loop.
          }
        } else {
          snapTo = _roundModifier(snapTo.increment);
        }
      }
      return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : _isFunction$2(snapTo) ? function (raw) {
        is2D = snapTo(raw);
        return Math.abs(is2D - raw) <= radius ? is2D : raw;
      } : function (raw) {
        var x = parseFloat(is2D ? raw.x : raw),
          y = parseFloat(is2D ? raw.y : 0),
          min = _bigNum$2,
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
        return is2D || closest === raw || _isNumber$2(raw) ? closest : closest + getUnit(raw);
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
      // NOTE: wrap() CANNOT be an arrow function! A very odd compiling bug causes problems (unrelated to GSAP).
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
      //replaces all occurrences of random(...) in a string with the calculated random value. can be a range like random(-100, 100, 5) or an array like random([0, 100, 500])
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
        var isString = _isString$2(start),
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
            interpolators.push(interpolate(start[i - 1], start[i])); //build the interpolators up front as a performance optimization so that when the function is called many times, it can just reuse them.
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
      //used for nextLabel() and previousLabel()
      var labels = timeline.labels,
        min = _bigNum$2,
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
    _callback$1 = function _callback(animation, type, executeLazyFirst) {
      var v = animation.vars,
        callback = v[type],
        prevContext = _context$3,
        context = animation._ctx,
        params,
        scope,
        result;
      if (!callback) {
        return;
      }
      params = v[type + "Params"];
      scope = v.callbackScope || animation;
      executeLazyFirst && _lazyTweens.length && _lazyRender(); //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onUpdate on a timeline that reports/checks tweened values.

      context && (_context$3 = context);
      result = params ? callback.apply(scope, params) : callback.call(scope);
      _context$3 = prevContext;
      return result;
    },
    _interrupt = function _interrupt(animation) {
      _removeFromParent(animation);
      animation.scrollTrigger && animation.scrollTrigger.kill(!!_reverting$1);
      animation.progress() < 1 && _callback$1(animation, "onInterrupt");
      return animation;
    },
    _quickTween,
    _registerPluginQueue = [],
    _createPlugin = function _createPlugin(config) {
      if (!config) return;
      config = !config.name && config["default"] || config; // UMD packaging wraps things oddly, so for example MotionPathHelper becomes {MotionPathHelper:MotionPathHelper, default:MotionPathHelper}.

      if (_windowExists$2() || config.headless) {
        // edge case: some build tools may pass in a null/undefined value
        var name = config.name,
          isFunc = _isFunction$2(config),
          Plugin = name && !isFunc && config.init ? function () {
            this._props = [];
          } : config,
          //in case someone passes in an object that's not a plugin, like CustomEase
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
          _setDefaults$1(Plugin, _setDefaults$1(_copyExcluding(config, instanceDefaults), statics)); //static methods

          _merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config, statics))); //instance methods

          _plugins[Plugin.prop = name] = Plugin;
          if (config.targetTest) {
            _harnessPlugins.push(Plugin);
            _reservedProps[name] = 1;
          }
          name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin"; //for the global name. "motionPath" should become MotionPathPlugin
        }

        _addGlobal(name, Plugin);
        config.register && config.register(gsap$4, Plugin, PropTween);
      } else {
        _registerPluginQueue.push(config);
      }
    },
    /*
     * --------------------------------------------------------------------------------------
     * COLORS
     * --------------------------------------------------------------------------------------
     */
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
    // possible future idea to replace the hard-coded color name values - put this in the ticker.wake() where we set the _doc:
    // let ctx = _doc.createElement("canvas").getContext("2d");
    // _forEachName("aqua,lime,silver,black,maroon,teal,blue,navy,white,olive,yellow,orange,gray,purple,green,red,pink,cyan", color => {ctx.fillStyle = color; _colorLookup[color] = splitColor(ctx.fillStyle)});
    _hue = function _hue(h, m1, m2) {
      h += h < 0 ? 1 : h > 1 ? -1 : 0;
      return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < .5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + .5 | 0;
    },
    splitColor = function splitColor(v, toHSL, forceAlpha) {
      var a = !v ? _colorLookup.black : _isNumber$2(v) ? [v >> 16, v >> 8 & _255, v & _255] : 0,
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
          //sometimes a trailing comma is included and we should chop it off (typically from a comma-delimited list of values like a textShadow:"2px 2px 2px blue, 5px 5px 5px rgb(255,0,0)" - in this example "blue," has a trailing comma. We could strip it out inside parseComplex() but we'd need to do it to the beginning and ending values plus it wouldn't provide protection from other potential scenarios like if the user passes in a similar value.
          v = v.substr(0, v.length - 1);
        }
        if (_colorLookup[v]) {
          a = _colorLookup[v];
        } else if (v.charAt(0) === "#") {
          if (v.length < 6) {
            //for shorthand like #9F0 or #9F0F (could have alpha)
            r = v.charAt(1);
            g = v.charAt(2);
            b = v.charAt(3);
            v = "#" + r + r + g + g + b + b + (v.length === 5 ? v.charAt(4) + v.charAt(4) : "");
          }
          if (v.length === 9) {
            // hex with alpha, like #fd5e53ff
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
            a.length > 3 && (a[3] *= 1); //cast as number

            a[0] = _hue(h + 1 / 3, r, g);
            a[1] = _hue(h, r, g);
            a[2] = _hue(h - 1 / 3, r, g);
          } else if (~v.indexOf("=")) {
            //if relative values are found, just return the raw strings with the relative prefixes in place.
            a = v.match(_numExp$1);
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
      // strips out the colors from the string, finds all the numeric slots (with units) and returns an array of those. The Array also has a "c" property which is an Array of the index values where the colors belong. This is to help work around issues where there's a mis-matched order of color/numeric data like drop-shadow(#f00 0px 1px 2px) and drop-shadow(0x 1px 2px #f00). This is basically a helper function used in _formatColors()
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
        //we'll dynamically build this Regular Expression to conserve file size. After building it, it will be able to find rgb(), rgba(), # (hexadecimal), and named color values like red, blue, purple, etc.,
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
        a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1])); // make sure the order of numbers/colors match with the END value.

        return true;
      }
    },
    /*
     * --------------------------------------------------------------------------------------
     * TICKER
     * --------------------------------------------------------------------------------------
     */
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
          (elapsed > _lagThreshold || elapsed < 0) && (_startTime += elapsed - _adjustedLag);
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
          manual || (_id = _req(_tick)); //make sure the request is made before we dispatch the "tick" event so that timing is maintained. Otherwise, if processing the "tick" requires a bunch of time (like 15ms) and we're using a setTimeout() that's based on 16.7ms, it'd technically take 31.7ms between frames otherwise.

          if (dispatch) {
            for (_i = 0; _i < _listeners.length; _i++) {
              // use _i and check _listeners.length instead of a variable because a listener could get removed during the loop, and if that happens to an element less than the current index, it'd throw things off in the loop.
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
            if (!_coreInitted$4 && _windowExists$2()) {
              _win$4 = _coreInitted$4 = window;
              _doc$4 = _win$4.document || {};
              _globals.gsap = gsap$4;
              (_win$4.gsapVersions || (_win$4.gsapVersions = [])).push(gsap$4.version);
              _install(_installScope || _win$4.GreenSockGlobals || !_win$4.gsap && _win$4 || {});
              _registerPluginQueue.forEach(_createPlugin);
            }
            _raf = typeof requestAnimationFrame !== "undefined" && requestAnimationFrame;
            _id && _self.sleep();
            _req = _raf || function (f) {
              return setTimeout(f, _nextTime - _self.time * 1000 + 1 | 0);
            };
            _tickerActive = 1;
            _tick(2);
          }
        },
        sleep: function sleep() {
          (_raf ? cancelAnimationFrame : clearTimeout)(_id);
          _tickerActive = 0;
          _req = _emptyFunc;
        },
        lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
          _lagThreshold = threshold || Infinity; // zero should be interpreted as basically unlimited

          _adjustedLag = Math.min(adjustedLag || 33, _lagThreshold);
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
    //also ensures the core classes are initialized.

    /*
    * -------------------------------------------------
    * EASING
    * -------------------------------------------------
    */
    _easeMap = {},
    _customEaseExp = /^[\d.\-M][\d.\-,\s]/,
    _quotesExp = /["']/g,
    _parseObjectInString = function _parseObjectInString(value) {
      //takes a string like "{wiggles:10, type:anticipate})" and turns it into a real object. Notice it ends in ")" and includes the {} wrappers. This is because we only use this function for parsing ease configs and prioritized optimization rather than reusability.
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
      //name can be a string like "elastic.out(1,0.5)", and pass in _easeMap as obj and it'll parse it out and call the actual function like _easeMap.Elastic.easeOut.config(1,0.5). It will also parse custom ease strings as long as CustomEase is loaded and registered (internally as _easeMap._CE).
      var split = (name + "").split("("),
        ease = _easeMap[split[0]];
      return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _valueInParentheses(name).split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease;
    },
    _invertEase = function _invertEase(ease) {
      return function (p) {
        return 1 - ease(1 - p);
      };
    },
    // allow yoyoEase to be set in children and have those affected when the parent/ancestor timeline yoyos.
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
      return !ease ? defaultEase : (_isFunction$2(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
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
        //note: if amplitude is < 1, we simply adjust the period for a more natural feel. Otherwise the math doesn't work right and the curve starts at 1.
        p2 = (period || (type ? .3 : .45)) / (amplitude < 1 ? amplitude : 1),
        p3 = p2 / _2PI$1 * (Math.asin(1 / p1) || 0),
        easeOut = function easeOut(p) {
          return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin$2((p - p3) * p2) + 1;
        },
        ease = type === "out" ? easeOut : type === "in" ? function (p) {
          return 1 - easeOut(1 - p);
        } : _easeInOutFromOut(easeOut);
      p2 = _2PI$1 / p2; //precalculate to optimize

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
    }; // a cheaper (kb and cpu) but more mild way to get a parameterized weighted ease by feeding in a value between -1 (easeIn) and 1 (easeOut) where 0 is linear.
  // _weightedEase = ratio => {
  // 	let y = 0.5 + ratio / 2;
  // 	return p => (2 * (1 - p) * p * y + p * p);
  // },
  // a stronger (but more expensive kb/cpu) parameterized weighted ease that lets you feed in a value between -1 (easeIn) and 1 (easeOut) where 0 is linear.
  // _weightedEaseStrong = ratio => {
  // 	ratio = .5 + ratio / 2;
  // 	let o = 1 / 3 * (ratio < .5 ? ratio : 1 - ratio),
  // 		b = ratio - o,
  // 		c = ratio + o;
  // 	return p => p === 1 ? p : 3 * b * (1 - p) * (1 - p) * p + 3 * c * (1 - p) * p * p + p * p * p;
  // };

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
    return -(_sqrt$2(1 - p * p) - 1);
  });
  _insertEase("Sine", function (p) {
    return p === 1 ? 1 : -_cos$2(p * _HALF_PI) + 1;
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
        return ((p2 * _clamp$1(0, max, p) | 0) + p3) * p1;
      };
    }
  };
  _defaults$1.ease = _easeMap["quad.out"];
  _forEachName("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function (name) {
    return _callbackNames += name + "," + name + "Params,";
  });
  /*
   * --------------------------------------------------------------------------------------
   * CACHE
   * --------------------------------------------------------------------------------------
   */

  var GSCache = function GSCache(target, harness) {
    this.id = _gsID++;
    target._gsap = this;
    this.target = target;
    this.harness = harness;
    this.get = harness ? harness.get : _getProperty;
    this.set = harness ? harness.getSetter : _getSetter;
  };
  /*
   * --------------------------------------------------------------------------------------
   * ANIMATION
   * --------------------------------------------------------------------------------------
   */

  var Animation = /*#__PURE__*/function () {
    function Animation(vars) {
      this.vars = vars;
      this._delay = +vars.delay || 0;
      if (this._repeat = vars.repeat === Infinity ? -2 : vars.repeat || 0) {
        // TODO: repeat: Infinity on a timeline's children must flag that timeline internally and affect its totalDuration, otherwise it'll stop in the negative direction when reaching the start.
        this._rDelay = vars.repeatDelay || 0;
        this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
      }
      this._ts = 1;
      _setDuration(this, +vars.duration, 1, 1);
      this.data = vars.data;
      if (_context$3) {
        this._ctx = _context$3;
        _context$3.data.push(this);
      }
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
        !parent._dp || parent.parent || _postAddChecks(parent, this); // edge case: if this is a child of a timeline that already completed, for example, we must re-activate the parent.
        //in case any of the ancestor timelines had completed but should now be enabled, we should reset their totalTime() which will also ensure that they're lined up properly and enabled. Skip for animations that are on the root (wasteful). Example: a TimelineLite.exportRoot() is performed when there's a paused tween on the root, the export will not complete until that tween is unpaused, but imagine a child gets restarted later, after all [unpaused] tweens have completed. The start of that child would get pushed out, but one of the ancestors may have completed.

        while (parent && parent.parent) {
          if (parent.parent._time !== parent._start + (parent._ts >= 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) {
            parent.totalTime(parent._tTime, true);
          }
          parent = parent.parent;
        }
        if (!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && _totalTime < this._tDur || this._ts < 0 && _totalTime > 0 || !this._tDur && !_totalTime)) {
          //if the animation doesn't have a parent, put it back into its last parent (recorded as _dp for exactly cases like this). Limit to parents with autoRemoveChildren (like globalTimeline) so that if the user manually removes an animation from a timeline and then alters its playhead, it doesn't get added back in.
          _addToTimeline(this._dp, this, this._start - this._delay);
        }
      }
      if (this._tTime !== _totalTime || !this._dur && !suppressEvents || this._initted && Math.abs(this._zTime) === _tinyNum || !_totalTime && !this._initted && (this.add || this._ptLookup)) {
        // check for _ptLookup on a Tween instance to ensure it has actually finished being instantiated, otherwise if this.reverse() gets called in the Animation constructor, it could trigger a render() here even though the _targets weren't populated, thus when _init() is called there won't be any PropTweens (it'll act like the tween is non-functional)
        this._ts || (this._pTime = _totalTime); // otherwise, if an animation is paused, then the playhead is moved back to zero, then resumed, it'd revert back to the original time at the pause
        //if (!this._lock) { // avoid endless recursion (not sure we need this yet or if it's worth the performance hit)
        //   this._lock = 1;

        _lazySafeRender(this, _totalTime, suppressEvents); //   this._lock = 0;
        //}
      }

      return this;
    };
    _proto.time = function time(value, suppressEvents) {
      return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % (this._dur + this._rDelay) || (value ? this._dur : 0), suppressEvents) : this._time; // note: if the modulus results in 0, the playhead could be exactly at the end or the beginning, and we always defer to the END with a non-zero value, otherwise if you set the time() to the very end (duration()), it would render at the START!
    };

    _proto.totalProgress = function totalProgress(value, suppressEvents) {
      return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() > 0 ? 1 : 0;
    };
    _proto.progress = function progress(value, suppressEvents) {
      return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
    };
    _proto.iteration = function iteration(value, suppressEvents) {
      var cycleDuration = this.duration() + this._rDelay;
      return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1;
    } // potential future addition:
    // isPlayingBackwards() {
    // 	let animation = this,
    // 		orientation = 1; // 1 = forward, -1 = backward
    // 	while (animation) {
    // 		orientation *= animation.reversed() || (animation.repeat() && !(animation.iteration() & 1)) ? -1 : 1;
    // 		animation = animation.parent;
    // 	}
    // 	return orientation < 0;
    // }
    ;

    _proto.timeScale = function timeScale(value, suppressEvents) {
      if (!arguments.length) {
        return this._rts === -_tinyNum ? 0 : this._rts; // recorded timeScale. Special case: if someone calls reverse() on an animation with timeScale of 0, we assign it -_tinyNum to remember it's reversed.
      }

      if (this._rts === value) {
        return this;
      }
      var tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime; // make sure to do the parentToChildTotalTime() BEFORE setting the new _ts because the old one must be used in that calculation.
      // future addition? Up side: fast and minimal file size. Down side: only works on this animation; if a timeline is reversed, for example, its childrens' onReverse wouldn't get called.
      //(+value < 0 && this._rts >= 0) && _callback(this, "onReverse", true);
      // prioritize rendering where the parent's playhead lines up instead of this._tTime because there could be a tween that's animating another tween's timeScale in the same rendering loop (same parent), thus if the timeScale tween renders first, it would alter _start BEFORE _tTime was set on that tick (in the rendering loop), effectively freezing it until the timeScale tween finishes.

      this._rts = +value || 0;
      this._ts = this._ps || value === -_tinyNum ? 0 : this._rts; // _ts is the functional timeScale which would be 0 if the animation is paused.

      this.totalTime(_clamp$1(-Math.abs(this._delay), this._tDur, tTime), suppressEvents !== false);
      _setEnd(this); // if parent.smoothChildTiming was false, the end time didn't get updated in the _alignPlayhead() method, so do it here.

      return _recacheAncestors(this);
    };
    _proto.paused = function paused(value) {
      if (!arguments.length) {
        return this._ps;
      }
      if (this._ps !== value) {
        this._ps = value;
        if (value) {
          this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()); // if the pause occurs during the delay phase, make sure that's factored in when resuming.

          this._ts = this._act = 0; // _ts is the functional timeScale, so a paused tween would effectively have a timeScale of 0. We record the "real" timeScale as _rts (recorded time scale)
        } else {
          _wake();
          this._ts = this._rts; //only defer to _pTime (pauseTime) if tTime is zero. Remember, someone could pause() an animation, then scrub the playhead and resume(). If the parent doesn't have smoothChildTiming, we render at the rawTime() because the startTime won't get updated.

          this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== _tinyNum && (this._tTime -= _tinyNum)); // edge case: animation.progress(1).pause().play() wouldn't render again because the playhead is already at the end, but the call to totalTime() below will add it back to its parent...and not remove it again (since removing only happens upon rendering at a new time). Offsetting the _tTime slightly is done simply to cause the final render in totalTime() that'll pop it off its timeline (if autoRemoveChildren is true, of course). Check to make sure _zTime isn't -_tinyNum to avoid an edge case where the playhead is pushed to the end but INSIDE a tween/callback, the timeline itself is paused thus halting rendering and leaving a few unrendered. When resuming, it wouldn't render those otherwise.
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
      var parent = this.parent || this._dp; // _dp = detached parent

      return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
    };
    _proto.revert = function revert(config) {
      if (config === void 0) {
        config = _revertConfig;
      }
      var prevIsReverting = _reverting$1;
      _reverting$1 = config;
      if (this._initted || this._startAt) {
        this.timeline && this.timeline.revert(config);
        this.totalTime(-0.01, config.suppressEvents);
      }
      this.data !== "nested" && config.kill !== false && this.kill();
      _reverting$1 = prevIsReverting;
      return this;
    };
    _proto.globalTime = function globalTime(rawTime) {
      var animation = this,
        time = arguments.length ? rawTime : animation.rawTime();
      while (animation) {
        time = animation._start + time / (Math.abs(animation._ts) || 1);
        animation = animation._dp;
      }
      return !this.parent && this._sat ? this._sat.globalTime(rawTime) : time; // the _startAt tweens for .fromTo() and .from() that have immediateRender should always be FIRST in the timeline (important for context.revert()). "_sat" stands for _startAtTween, referring to the parent tween that created the _startAt. We must discern if that tween had immediateRender so that we can know whether or not to prioritize it in revert().
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
      return this.totalTime(_parsePosition$1(this, position), _isNotFalse(suppressEvents));
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
        !!value !== this.reversed() && this.timeScale(-this._rts || (value ? -_tinyNum : 0)); // in case timeScale is zero, reversing would have no effect so we use _tinyNum.

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
        var f = _isFunction$2(onFulfilled) ? onFulfilled : _passThrough$1,
          _resolve = function _resolve() {
            var _then = self.then;
            self.then = null; // temporarily null the then() method to avoid an infinite loop (see https://github.com/greensock/GSAP/issues/322)

            _isFunction$2(f) && (f = f(self)) && (f.then || f === self) && (self.then = _then);
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
  _setDefaults$1(Animation.prototype, {
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
  /*
   * -------------------------------------------------
   * TIMELINE
   * -------------------------------------------------
   */

  var Timeline = /*#__PURE__*/function (_Animation) {
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
      new Tween(targets, vars, _parsePosition$1(this, position), 1);
      return this;
    };
    _proto2.call = function call(callback, params, position) {
      return _addToTimeline(this, Tween.delayedCall(0, callback, params), position);
    } //ONLY for backward compatibility! Maybe delete?
    ;

    _proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
      vars.duration = duration;
      vars.stagger = vars.stagger || stagger;
      vars.onComplete = onCompleteAll;
      vars.onCompleteParams = onCompleteAllParams;
      vars.parent = this;
      new Tween(targets, vars, _parsePosition$1(this, position));
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
        // if a paused timeline is resumed (or its _start is updated for another reason...which rounds it), that could result in the playhead shifting a **tiny** amount and a zero-duration child at that spot may get rendered at a different ratio, like its totalTime in render() may be 1e-17 instead of 0, for example.
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
          //if totalDuration() finds a child with a negative startTime and smoothChildTiming is true, things get shifted around internally so we need to adjust the time accordingly. For example, if a tween starts at -30 we must shift EVERYTHING forward 30 seconds and move this timeline's startTime backward by 30 seconds so that things align with the playhead (no jump).
          tTime += this._time - prevTime;
          totalTime += this._time - prevTime;
        }
        time = tTime;
        prevStart = this._start;
        timeScale = this._ts;
        prevPaused = !timeScale;
        if (crossingStart) {
          dur || (prevTime = this._zTime); //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect.

          (totalTime || !suppressEvents) && (this._zTime = totalTime);
        }
        if (this._repeat) {
          //adjust the time for repeats and yoyos
          yoyo = this._yoyo;
          cycleDuration = dur + this._rDelay;
          if (this._repeat < -1 && totalTime < 0) {
            return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
          }
          time = _roundPrecise(tTime % cycleDuration); //round to avoid floating point errors. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)

          if (tTime === tDur) {
            // the tDur === tTime is for edge cases where there's a lengthy decimal on the duration and it may reach the very end but the time is rendered as not-quite-there (remember, tDur is rounded to 4 decimals whereas dur isn't)
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
          !prevTime && this._tTime && prevIteration !== iteration && this._tTime - prevIteration * cycleDuration - this._dur <= 0 && (prevIteration = iteration); // edge case - if someone does addPause() at the very beginning of a repeating timeline, that pause is technically at the same spot as the end which causes this._time to get set to 0 when the totalTime would normally place the playhead at the end. See https://gsap.com/forums/topic/23823-closing-nav-animation-not-working-on-ie-and-iphone-6-maybe-other-older-browser/?tab=comments#comment-113005 also, this._tTime - prevIteration * cycleDuration - this._dur <= 0 just checks to make sure it wasn't previously in the "repeatDelay" portion

          if (yoyo && iteration & 1) {
            time = dur - time;
            isYoyo = 1;
          }
          /*
          make sure children at the end/beginning of the timeline are rendered properly. If, for example,
          a 3-second long timeline rendered at 2.9 seconds previously, and now renders at 3.2 seconds (which
          would get translated to 2.8 seconds if the timeline yoyos or 0.2 seconds if it just repeats), there
          could be a callback or a short tween that's at 2.95 or 3 seconds in which wouldn't render. So
          we need to push the timeline to the end (and/or beginning depending on its yoyo value). Also we must
          ensure that zero-duration tweens at the very beginning or end of the Timeline work.
          */

          if (iteration !== prevIteration && !this._lock) {
            var rewinding = yoyo && prevIteration & 1,
              doesWrap = rewinding === (yoyo && iteration & 1);
            iteration < prevIteration && (rewinding = !rewinding);
            prevTime = rewinding ? 0 : tTime % dur ? dur : tTime; // if the playhead is landing exactly at the end of an iteration, use that totalTime rather than only the duration, otherwise it'll skip the 2nd render since it's effectively at the same time.

            this._lock = 1;
            this.render(prevTime || (isYoyo ? 0 : _roundPrecise(iteration * cycleDuration)), suppressEvents, !dur)._lock = 0;
            this._tTime = tTime; // if a user gets the iteration() inside the onRepeat, for example, it should be accurate.

            !suppressEvents && this.parent && _callback$1(this, "onRepeat");
            this.vars.repeatRefresh && !isYoyo && (this.invalidate()._lock = 1);
            if (prevTime && prevTime !== this._time || prevPaused !== !this._ts || this.vars.onRepeat && !this.parent && !this._act) {
              // if prevTime is 0 and we render at the very end, _time will be the end, thus won't match. So in this edge case, prevTime won't match _time but that's okay. If it gets killed in the onRepeat, eject as well.
              return this;
            }
            dur = this._dur; // in case the duration changed in the onRepeat

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
            } //in order for yoyoEase to work properly when there's a stagger, we must swap out the ease in each sub-tween.

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
        this._act = !timeScale; //as long as it's not paused, force it to be active so that if the user renders independent of the parent timeline, it'll be forced to re-render on the next tick.

        if (!this._initted) {
          this._onUpdate = this.vars.onUpdate;
          this._initted = 1;
          this._zTime = totalTime;
          prevTime = 0; // upon init, the playhead should always go forward; someone could invalidate() a completed timeline and then if they restart(), that would make child tweens render in reverse order which could lock in the wrong starting values if they build on each other, like tl.to(obj, {x: 100}).to(obj, {x: 0}).
        }

        if (!prevTime && time && !suppressEvents && !iteration) {
          _callback$1(this, "onStart");
          if (this._tTime !== tTime) {
            // in case the onStart triggered a render at a different spot, eject. Like if someone did animation.pause(0.5) or something inside the onStart.
            return this;
          }
        }
        if (time >= prevTime && totalTime >= 0) {
          child = this._first;
          while (child) {
            next = child._next;
            if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
              if (child.parent !== this) {
                // an extreme edge case - the child's render could do something like kill() the "next" one in the linked list, or reparent it. In that case we must re-initiate the whole render to be safe.
                return this.render(totalTime, suppressEvents, force);
              }
              child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);
              if (time !== this._time || !this._ts && !prevPaused) {
                //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
                pauseTween = 0;
                next && (tTime += this._zTime = -_tinyNum); // it didn't finish rendering, so flag zTime as negative so that so that the next time render() is called it'll be forced (to render any remaining children)

                break;
              }
            }
            child = next;
          }
        } else {
          child = this._last;
          var adjustedTime = totalTime < 0 ? totalTime : time; //when the playhead goes backward beyond the start of this timeline, we must pass that information down to the child animations so that zero-duration tweens know whether to render their starting or ending values.

          while (child) {
            next = child._prev;
            if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
              if (child.parent !== this) {
                // an extreme edge case - the child's render could do something like kill() the "next" one in the linked list, or reparent it. In that case we must re-initiate the whole render to be safe.
                return this.render(totalTime, suppressEvents, force);
              }
              child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force || _reverting$1 && (child._initted || child._startAt)); // if reverting, we should always force renders of initted tweens (but remember that .fromTo() or .from() may have a _startAt but not _initted yet). If, for example, a .fromTo() tween with a stagger (which creates an internal timeline) gets reverted BEFORE some of its child tweens render for the first time, it may not properly trigger them to revert.

              if (time !== this._time || !this._ts && !prevPaused) {
                //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
                pauseTween = 0;
                next && (tTime += this._zTime = adjustedTime ? -_tinyNum : _tinyNum); // it didn't finish rendering, so adjust zTime so that so that the next time render() is called it'll be forced (to render any remaining children)

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
            //the callback resumed playback! So since we may have held back the playhead due to where the pause is positioned, go ahead and jump to where it's SUPPOSED to be (if no pause happened).
            this._start = prevStart; //if the pause was at an earlier time and the user resumed in the callback, it could reposition the timeline (changing its startTime), throwing things off slightly, so we make sure the _start doesn't shift.

            _setEnd(this);
            return this.render(totalTime, suppressEvents, force);
          }
        }
        this._onUpdate && !suppressEvents && _callback$1(this, "onUpdate", true);
        if (tTime === tDur && this._tTime >= this.totalDuration() || !tTime && prevTime) if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) if (!this._lock) {
          // remember, a child's callback may alter this timeline's playhead or timeScale which is why we need to add some of these checks.
          (totalTime || !dur) && (tTime === tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1); // don't remove if the timeline is reversed and the playhead isn't at 0, otherwise tl.progress(1).reverse() won't work. Only remove if the playhead is at the end and timeScale is positive, or if the playhead is at 0 and the timeScale is negative.

          if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime || !tDur)) {
            _callback$1(this, tTime === tDur && totalTime >= 0 ? "onComplete" : "onReverseComplete", true);
            this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
          }
        }
      }
      return this;
    };
    _proto2.add = function add(child, position) {
      var _this2 = this;
      _isNumber$2(position) || (position = _parsePosition$1(this, position, child));
      if (!(child instanceof Animation)) {
        if (_isArray(child)) {
          child.forEach(function (obj) {
            return _this2.add(obj, position);
          });
          return this;
        }
        if (_isString$2(child)) {
          return this.addLabel(child, position);
        }
        if (_isFunction$2(child)) {
          child = Tween.delayedCall(0, child);
        } else {
          return this;
        }
      }
      return this !== child ? _addToTimeline(this, child, position) : this; //don't allow a timeline to be added to itself as a child!
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
        ignoreBeforeTime = -_bigNum$2;
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
      if (_isString$2(child)) {
        return this.removeLabel(child);
      }
      if (_isFunction$2(child)) {
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
        //special case for the global timeline (or any other that has no parent or detached parent).
        this._start = _roundPrecise(_ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts));
      }
      _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);
      this._forcing = 0;
      return this;
    };
    _proto2.addLabel = function addLabel(label, position) {
      this.labels[label] = _parsePosition$1(this, position);
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
      return _addToTimeline(this, t, _parsePosition$1(this, position));
    };
    _proto2.removePause = function removePause(position) {
      var child = this._first;
      position = _parsePosition$1(this, position);
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
        parsedTargets = toArray$3(targets),
        child = this._first,
        isGlobalTime = _isNumber$2(onlyActive),
        // a number is interpreted as a global time. If the animation spans
        children;
      while (child) {
        if (child instanceof Tween) {
          if (_arrayContainsAny(child._targets, parsedTargets) && (isGlobalTime ? (!_overwritingTween || child._initted && child._ts) && child.globalTime(0) <= onlyActive && child.globalTime(child.totalDuration()) > onlyActive : !onlyActive || child.isActive())) {
            // note: if this is for overwriting, it should only be for tweens that aren't paused and are initted.
            a.push(child);
          }
        } else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) {
          a.push.apply(a, children);
        }
        child = child._next;
      }
      return a;
    } // potential future feature - targets() on timelines
    // targets() {
    // 	let result = [];
    // 	this.getChildren(true, true, false).forEach(t => result.push(...t.targets()));
    // 	return result.filter((v, i) => result.indexOf(v) === i);
    // }
    ;

    _proto2.tweenTo = function tweenTo(position, vars) {
      vars = vars || {};
      var tl = this,
        endTime = _parsePosition$1(tl, position),
        _vars = vars,
        startAt = _vars.startAt,
        _onStart = _vars.onStart,
        onStartParams = _vars.onStartParams,
        immediateRender = _vars.immediateRender,
        initted,
        tween = Tween.to(tl, _setDefaults$1({
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
            _onStart && _onStart.apply(tween, onStartParams || []); //in case the user had an onStart in the vars - we don't want to overwrite it.
          }
        }, vars));
      return immediateRender ? tween.render(0) : tween;
    };
    _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
      return this.tweenTo(toPosition, _setDefaults$1({
        startAt: {
          time: _parsePosition$1(this, fromPosition)
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
      return _getLabelInDirection(this, _parsePosition$1(this, afterTime));
    };
    _proto2.previousLabel = function previousLabel(beforeTime) {
      if (beforeTime === void 0) {
        beforeTime = this._time;
      }
      return _getLabelInDirection(this, _parsePosition$1(this, beforeTime), 1);
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
    _proto2.invalidate = function invalidate(soft) {
      var child = this._first;
      this._lock = 0;
      while (child) {
        child.invalidate(soft);
        child = child._next;
      }
      return _Animation.prototype.invalidate.call(this, soft);
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
        prevStart = _bigNum$2,
        prev,
        start,
        parent;
      if (arguments.length) {
        return self.timeScale((self._repeat < 0 ? self.duration() : self.totalDuration()) / (self.reversed() ? -value : value));
      }
      if (self._dirty) {
        parent = self.parent;
        while (child) {
          prev = child._prev; //record it here in case the tween changes position in the sequence...

          child._dirty && child.totalDuration(); //could change the tween._startTime, so make sure the animation's cache is clean before analyzing it.

          start = child._start;
          if (start > prevStart && self._sort && child._ts && !self._lock) {
            //in case one of the tweens shifted out of order, it needs to be re-inserted into the correct position in the sequence
            self._lock = 1; //prevent endless recursive calls - there are methods that get triggered that check duration/totalDuration when we add().

            _addToTimeline(self, child, start - child._delay, 1)._lock = 0;
          } else {
            prevStart = start;
          }
          if (start < 0 && child._ts) {
            //children aren't allowed to have negative startTimes unless smoothChildTiming is true, so adjust here if one is found.
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
  _setDefaults$1(Timeline.prototype, {
    _lock: 0,
    _hasPause: 0,
    _forcing: 0
  });
  var _addComplexStringPropTween = function _addComplexStringPropTween(target, prop, start, end, setter, stringFilter, funcParam) {
      //note: we call _addComplexStringPropTween.call(tweenInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.
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
      start += ""; //ensure values are strings

      end += "";
      if (hasRandom = ~end.indexOf("random(")) {
        end = _replaceRandom(end);
      }
      if (stringFilter) {
        a = [start, end];
        stringFilter(a, target, prop); //pass an array with the starting and ending values and let the filter do whatever it needs to the values.

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
          startNum = parseFloat(startNums[matchIndex - 1]) || 0; //these nested PropTweens are handled in a special way - we'll never actually call a render or setter method on them. We'll just loop through them in the parent complex string PropTween's render method.

          pt._pt = {
            _next: pt._pt,
            p: chunk || matchIndex === 1 ? chunk : ",",
            //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
            s: startNum,
            c: endNum.charAt(1) === "=" ? _parseRelative(startNum, endNum) - startNum : parseFloat(endNum) - startNum,
            m: color && color < 4 ? Math.round : 0
          };
          index = _complexStringNumExp.lastIndex;
        }
      }
      pt.c = index < end.length ? end.substring(index, end.length) : ""; //we use the "c" of the PropTween to store the final part of the string (after the last number)

      pt.fp = funcParam;
      if (_relExp.test(end) || hasRandom) {
        pt.e = 0; //if the end string contains relative values or dynamic random(...) values, delete the end it so that on the final render we don't actually set it to the string with += or -= characters (forces it to use the calculated value).
      }

      this._pt = pt; //start the linked list with this new PropTween. Remember, we call _addComplexStringPropTween.call(tweenInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.

      return pt;
    },
    _addPropTween = function _addPropTween(target, prop, start, end, index, targets, modifier, stringFilter, funcParam, optional) {
      _isFunction$2(end) && (end = end(index || 0, target, targets));
      var currentValue = target[prop],
        parsedStart = start !== "get" ? start : !_isFunction$2(currentValue) ? currentValue : funcParam ? target[prop.indexOf("set") || !_isFunction$2(target["get" + prop.substr(3)]) ? prop : "get" + prop.substr(3)](funcParam) : target[prop](),
        setter = !_isFunction$2(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc,
        pt;
      if (_isString$2(end)) {
        if (~end.indexOf("random(")) {
          end = _replaceRandom(end);
        }
        if (end.charAt(1) === "=") {
          pt = _parseRelative(parsedStart, end) + (getUnit(parsedStart) || 0);
          if (pt || pt === 0) {
            // to avoid isNaN, like if someone passes in a value like "!= whatever"
            end = pt;
          }
        }
      }
      if (!optional || parsedStart !== end || _forceAllPropTweens) {
        if (!isNaN(parsedStart * end) && end !== "") {
          // fun fact: any number multiplied by "" is evaluated as the number 0!
          pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
          funcParam && (pt.fp = funcParam);
          modifier && pt.modifier(modifier, this, target);
          return this._pt = pt;
        }
        !currentValue && !(prop in target) && _missingPlugin(prop, end);
        return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam);
      }
    },
    //creates a copy of the vars object and processes any function-based values (putting the resulting values directly into the copy) as well as strings with "random()" in them. It does NOT process relative values.
    _processVars = function _processVars(vars, index, target, targets, tween) {
      _isFunction$2(vars) && (vars = _parseFuncOrString(vars, tween, index, target, targets));
      if (!_isObject$1(vars) || vars.style && vars.nodeType || _isArray(vars) || _isTypedArray(vars)) {
        return _isString$2(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars;
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
          ptLookup = tween._ptLookup[tween._targets.indexOf(target)]; //note: we can't use tween._ptLookup[index] because for staggered tweens, the index from the fullTargets array won't match what it is in each individual tween that spawns from the stagger.

          i = plugin._props.length;
          while (i--) {
            ptLookup[plugin._props[i]] = pt;
          }
        }
      }
      return plugin;
    },
    _overwritingTween,
    //store a reference temporarily so we can avoid overwriting itself.
    _forceAllPropTweens,
    _initTween = function _initTween(tween, time, tTime) {
      var vars = tween.vars,
        ease = vars.ease,
        startAt = vars.startAt,
        immediateRender = vars.immediateRender,
        lazy = vars.lazy,
        onUpdate = vars.onUpdate,
        runBackwards = vars.runBackwards,
        yoyoEase = vars.yoyoEase,
        keyframes = vars.keyframes,
        autoRevert = vars.autoRevert,
        dur = tween._dur,
        prevStartAt = tween._startAt,
        targets = tween._targets,
        parent = tween.parent,
        fullTargets = parent && parent.data === "nested" ? parent.vars.targets : targets,
        autoOverwrite = tween._overwrite === "auto" && !_suppressOverwrites$1,
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
      tween._ease = _parseEase(ease, _defaults$1.ease);
      tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults$1.ease)) : 0;
      if (yoyoEase && tween._yoyo && !tween._repeat) {
        //there must have been a parent timeline with yoyo:true that is currently in its yoyo phase, so flip the eases.
        yoyoEase = tween._yEase;
        tween._yEase = tween._ease;
        tween._ease = yoyoEase;
      }
      tween._from = !tl && !!vars.runBackwards; //nested timelines should never run backwards - the backwards-ness is in the child tweens.

      if (!tl || keyframes && !vars.stagger) {
        //if there's an internal timeline, skip all the parsing because we passed that task down the chain.
        harness = targets[0] ? _getCache(targets[0]).harness : 0;
        harnessVars = harness && vars[harness.prop]; //someone may need to specify CSS-specific values AND non-CSS values, like if the element has an "x" property plus it's a standard DOM element. We allow people to distinguish by wrapping plugin-specific stuff in a css:{} object for example.

        cleanVars = _copyExcluding(vars, _reservedProps);
        if (prevStartAt) {
          prevStartAt._zTime < 0 && prevStartAt.progress(1); // in case it's a lazy startAt that hasn't rendered yet.

          time < 0 && runBackwards && immediateRender && !autoRevert ? prevStartAt.render(-1, true) : prevStartAt.revert(runBackwards && dur ? _revertConfigNoKill : _startAtRevertConfig); // if it's a "startAt" (not "from()" or runBackwards: true), we only need to do a shallow revert (keep transforms cached in CSSPlugin)
          // don't just _removeFromParent(prevStartAt.render(-1, true)) because that'll leave inline styles. We're creating a new _startAt for "startAt" tweens that re-capture things to ensure that if the pre-tween values changed since the tween was created, they're recorded.

          prevStartAt._lazy = 0;
        }
        if (startAt) {
          _removeFromParent(tween._startAt = Tween.set(targets, _setDefaults$1({
            data: "isStart",
            overwrite: false,
            parent: parent,
            immediateRender: true,
            lazy: !prevStartAt && _isNotFalse(lazy),
            startAt: null,
            delay: 0,
            onUpdate: onUpdate && function () {
              return _callback$1(tween, "onUpdate");
            },
            stagger: 0
          }, startAt))); //copy the properties/values into a new object to avoid collisions, like var to = {x:0}, from = {x:500}; timeline.fromTo(e, from, to).fromTo(e, to, from);

          tween._startAt._dp = 0; // don't allow it to get put back into root timeline! Like when revert() is called and totalTime() gets set.

          tween._startAt._sat = tween; // used in globalTime(). _sat stands for _startAtTween

          time < 0 && (_reverting$1 || !immediateRender && !autoRevert) && tween._startAt.revert(_revertConfigNoKill); // rare edge case, like if a render is forced in the negative direction of a non-initted tween.

          if (immediateRender) {
            if (dur && time <= 0 && tTime <= 0) {
              // check tTime here because in the case of a yoyo tween whose playhead gets pushed to the end like tween.progress(1), we should allow it through so that the onComplete gets fired properly.
              time && (tween._zTime = time);
              return; //we skip initialization here so that overwriting doesn't occur until the tween actually begins. Otherwise, if you create several immediateRender:true tweens of the same target/properties to drop into a Timeline, the last one created would overwrite the first ones because they didn't get placed into the timeline yet before the first render occurs and kicks in overwriting.
            }
          }
        } else if (runBackwards && dur) {
          //from() tweens must be handled uniquely: their beginning values must be rendered but we don't want overwriting to occur yet (when time is still 0). Wait until the tween actually begins before doing all the routines like overwriting. At that time, we should render at the END of the tween to ensure that things initialize correctly (remember, from() tweens go backwards)
          if (!prevStartAt) {
            time && (immediateRender = false); //in rare cases (like if a from() tween runs and then is invalidate()-ed), immediateRender could be true but the initial forced-render gets skipped, so there's no need to force the render in this context when the _time is greater than 0

            p = _setDefaults$1({
              overwrite: false,
              data: "isFromStart",
              //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
              lazy: immediateRender && !prevStartAt && _isNotFalse(lazy),
              immediateRender: immediateRender,
              //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
              stagger: 0,
              parent: parent //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y: gsap.utils.wrap([-100,100]), stagger: 0.5})
            }, cleanVars);
            harnessVars && (p[harness.prop] = harnessVars); // in case someone does something like .from(..., {css:{}})

            _removeFromParent(tween._startAt = Tween.set(targets, p));
            tween._startAt._dp = 0; // don't allow it to get put back into root timeline!

            tween._startAt._sat = tween; // used in globalTime()

            time < 0 && (_reverting$1 ? tween._startAt.revert(_revertConfigNoKill) : tween._startAt.render(-1, true));
            tween._zTime = time;
            if (!immediateRender) {
              _initTween(tween._startAt, _tinyNum, _tinyNum); //ensures that the initial values are recorded
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
          _lazyLookup[gsData.id] && _lazyTweens.length && _lazyRender(); //if other tweens of the same target have recently initted but haven't rendered yet, we've got to force the render so that the starting values are correct (imagine populating a timeline with a bunch of sequential tweens and then jumping to the end)

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
            _globalTimeline.killTweensOf(target, ptLookup, tween.globalTime(time)); // make sure the overwriting doesn't overwrite THIS tween!!!

            overwritten = !tween.parent;
            _overwritingTween = 0;
          }
          tween._pt && lazy && (_lazyLookup[gsData.id] = 1);
        }
        hasPriority && _sortPropTweensByPriority(tween);
        tween._onInit && tween._onInit(tween); //plugins like RoundProps must wait until ALL of the PropTweens are instantiated. In the plugin's init() function, it sets the _onInit on the tween instance. May not be pretty/intuitive, but it's fast and keeps file size down.
      }

      tween._onUpdate = onUpdate;
      tween._initted = (!tween._op || tween._pt) && !overwritten; // if overwrittenProps resulted in the entire tween being killed, do NOT flag it as initted or else it may render for one tick.

      keyframes && time <= 0 && tl.render(_bigNum$2, true, true); // if there's a 0% keyframe, it'll render in the "before" state for any staggered/delayed animations thus when the following tween initializes, it'll use the "before" state instead of the "after" state as the initial values.
    },
    _updatePropTweens = function _updatePropTweens(tween, property, value, start, startIsRelative, ratio, time, skipRecursion) {
      var ptCache = (tween._pt && tween._ptCache || (tween._ptCache = {}))[property],
        pt,
        rootPT,
        lookup,
        i;
      if (!ptCache) {
        ptCache = tween._ptCache[property] = [];
        lookup = tween._ptLookup;
        i = tween._targets.length;
        while (i--) {
          pt = lookup[i][property];
          if (pt && pt.d && pt.d._pt) {
            // it's a plugin, so find the nested PropTween
            pt = pt.d._pt;
            while (pt && pt.p !== property && pt.fp !== property) {
              // "fp" is functionParam for things like setting CSS variables which require .setProperty("--var-name", value)
              pt = pt._next;
            }
          }
          if (!pt) {
            // there is no PropTween associated with that property, so we must FORCE one to be created and ditch out of this
            // if the tween has other properties that already rendered at new positions, we'd normally have to rewind to put them back like tween.render(0, true) before forcing an _initTween(), but that can create another edge case like tweening a timeline's progress would trigger onUpdates to fire which could move other things around. It's better to just inform users that .resetTo() should ONLY be used for tweens that already have that property. For example, you can't gsap.to(...{ y: 0 }) and then tween.restTo("x", 200) for example.
            _forceAllPropTweens = 1; // otherwise, when we _addPropTween() and it finds no change between the start and end values, it skips creating a PropTween (for efficiency...why tween when there's no difference?) but in this case we NEED that PropTween created so we can edit it.

            tween.vars[property] = "+=0";
            _initTween(tween, time);
            _forceAllPropTweens = 0;
            return skipRecursion ? _warn(property + " not eligible for reset") : 1; // if someone tries to do a quickTo() on a special property like borderRadius which must get split into 4 different properties, that's not eligible for .resetTo().
          }

          ptCache.push(pt);
        }
      }
      i = ptCache.length;
      while (i--) {
        rootPT = ptCache[i];
        pt = rootPT._pt || rootPT; // complex values may have nested PropTweens. We only accommodate the FIRST value.

        pt.s = (start || start === 0) && !startIsRelative ? start : pt.s + (start || 0) + ratio * pt.c;
        pt.c = value - pt.s;
        rootPT.e && (rootPT.e = _round$2(value) + getUnit(rootPT.e)); // mainly for CSSPlugin (end value)

        rootPT.b && (rootPT.b = pt.s + getUnit(rootPT.b)); // (beginning value)
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
    // parses multiple formats, like {"0%": {x: 100}, {"50%": {x: -20}} and { x: {"0%": 100, "50%": -20} }, and an "ease" can be set on any object. We populate an "allProps" object with an Array for each property, like {x: [{}, {}], y:[{}, {}]} with data for each property tween. The objects have a "t" (time), "v", (value), and "e" (ease) property. This allows us to piece together a timeline later.
    _parseKeyframe = function _parseKeyframe(prop, obj, allProps, easeEach) {
      var ease = obj.ease || easeEach || "power1.inOut",
        p,
        a;
      if (_isArray(obj)) {
        a = allProps[prop] || (allProps[prop] = []); // t = time (out of 100), v = value, e = ease

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
      return _isFunction$2(value) ? value.call(tween, i, target, targets) : _isString$2(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value;
    },
    _staggerTweenProps = _callbackNames + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert",
    _staggerPropsToSkip = {};
  _forEachName(_staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger", function (name) {
    return _staggerPropsToSkip[name] = 1;
  });
  /*
   * --------------------------------------------------------------------------------------
   * TWEEN
   * --------------------------------------------------------------------------------------
   */

  var Tween = /*#__PURE__*/function (_Animation2) {
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
        parsedTargets = (_isArray(targets) || _isTypedArray(targets) ? _isNumber$2(targets[0]) : "length" in vars) ? [targets] : toArray$3(targets),
        tl,
        i,
        copy,
        l,
        p,
        curTarget,
        staggerFunc,
        staggerVarsToMerge;
      _this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://gsap.com", !_config.nullTargetWarn) || [];
      _this3._ptLookup = []; //PropTween lookup. An array containing an object for each target, having keys for each tweening property

      _this3._overwrite = overwrite;
      if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
        vars = _this3.vars;
        tl = _this3.timeline = new Timeline({
          data: "nested",
          defaults: defaults || {},
          targets: parent && parent.data === "nested" ? parent.vars.targets : parsedTargets
        }); // we need to store the targets because for staggers and keyframes, we end up creating an individual tween for each but function-based values need to know the index and the whole Array of targets.

        tl.kill();
        tl.parent = tl._dp = _assertThisInitialized(_this3);
        tl._start = 0;
        if (stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
          l = parsedTargets.length;
          staggerFunc = stagger && distribute(stagger);
          if (_isObject$1(stagger)) {
            //users can pass in callbacks like onStart/onComplete in the stagger object. These should fire with each individual tween.
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
            curTarget = parsedTargets[i]; //don't just copy duration or delay because if they're a string or function, we'd end up in an infinite loop because _isFuncOrString() would evaluate as true in the child tweens, entering this loop, etc. So we parse the value straight from vars and default to 0.

            copy.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this3), i, curTarget, parsedTargets);
            copy.delay = (+_parseFuncOrString(delay, _assertThisInitialized(_this3), i, curTarget, parsedTargets) || 0) - _this3._delay;
            if (!stagger && l === 1 && copy.delay) {
              // if someone does delay:"random(1, 5)", repeat:-1, for example, the delay shouldn't be inside the repeat.
              _this3._delay = delay = copy.delay;
              _this3._start += delay;
              copy.delay = 0;
            }
            tl.to(curTarget, copy, staggerFunc ? staggerFunc(i, curTarget, parsedTargets) : 0);
            tl._ease = _easeMap.none;
          }
          tl.duration() ? duration = delay = 0 : _this3.timeline = 0; // if the timeline's duration is 0, we don't need a timeline internally!
        } else if (keyframes) {
          _inheritDefaults(_setDefaults$1(tl.vars.defaults, {
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
            tl.duration(); // to ensure tl._dur is cached because we tap into it for performance purposes in the render() method.
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
            }); // in case keyframes didn't go to 100%
          }
        }

        duration || _this3.duration(duration = tl.duration());
      } else {
        _this3.timeline = 0; //speed optimization, faster lookups (no going up the prototype chain)
      }

      if (overwrite === true && !_suppressOverwrites$1) {
        _overwritingTween = _assertThisInitialized(_this3);
        _globalTimeline.killTweensOf(parsedTargets);
        _overwritingTween = 0;
      }
      _addToTimeline(parent, _assertThisInitialized(_this3), position);
      vars.reversed && _this3.reverse();
      vars.paused && _this3.paused(true);
      if (immediateRender || !duration && !keyframes && _this3._start === _roundPrecise(parent._time) && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this3)) && parent.data !== "nested") {
        _this3._tTime = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)

        _this3.render(Math.max(0, -delay) || 0); //in case delay is negative
      }

      scrollTrigger && _scrollTrigger(_assertThisInitialized(_this3), scrollTrigger);
      return _this3;
    }
    var _proto3 = Tween.prototype;
    _proto3.render = function render(totalTime, suppressEvents, force) {
      var prevTime = this._time,
        tDur = this._tDur,
        dur = this._dur,
        isNegative = totalTime < 0,
        tTime = totalTime > tDur - _tinyNum && !isNegative ? tDur : totalTime < _tinyNum ? 0 : totalTime,
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
      } else if (tTime !== this._tTime || !totalTime || force || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== isNegative) {
        //this senses if we're crossing over the start time, in which case we must record _zTime and force the render, but we do it in this lengthy conditional way for performance reasons (usually we can skip the calculations): this._initted && (this._zTime < 0) !== (totalTime < 0)
        time = tTime;
        timeline = this.timeline;
        if (this._repeat) {
          //adjust the time for repeats and yoyos
          cycleDuration = dur + this._rDelay;
          if (this._repeat < -1 && isNegative) {
            return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
          }
          time = _roundPrecise(tTime % cycleDuration); //round to avoid floating point errors. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)

          if (tTime === tDur) {
            // the tDur === tTime is for edge cases where there's a lengthy decimal on the duration and it may reach the very end but the time is rendered as not-quite-there (remember, tDur is rounded to 4 decimals whereas dur isn't)
            iteration = this._repeat;
            time = dur;
          } else {
            iteration = ~~(tTime / cycleDuration);
            if (iteration && iteration === _roundPrecise(tTime / cycleDuration)) {
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
          if (time === prevTime && !force && this._initted && iteration === prevIteration) {
            //could be during the repeatDelay part. No need to render and fire callbacks.
            this._tTime = tTime;
            return this;
          }
          if (iteration !== prevIteration) {
            timeline && this._yEase && _propagateYoyoEase(timeline, isYoyo); //repeatRefresh functionality

            if (this.vars.repeatRefresh && !isYoyo && !this._lock && this._time !== cycleDuration && this._initted) {
              // this._time will === cycleDuration when we render at EXACTLY the end of an iteration. Without this condition, it'd often do the repeatRefresh render TWICE (again on the very next tick).
              this._lock = force = 1; //force, otherwise if lazy is true, the _attemptInitTween() will return and we'll jump out and get caught bouncing on each tick.

              this.render(_roundPrecise(cycleDuration * iteration), true).invalidate()._lock = 0;
            }
          }
        }
        if (!this._initted) {
          if (_attemptInitTween(this, isNegative ? totalTime : time, force, suppressEvents, tTime)) {
            this._tTime = 0; // in constructor if immediateRender is true, we set _tTime to -_tinyNum to have the playhead cross the starting point but we can't leave _tTime as a negative number.

            return this;
          }
          if (prevTime !== this._time && !(force && this.vars.repeatRefresh && iteration !== prevIteration)) {
            // rare edge case - during initialization, an onUpdate in the _startAt (.fromTo()) might force this tween to render at a different spot in which case we should ditch this render() call so that it doesn't revert the values. But we also don't want to dump if we're doing a repeatRefresh render!
            return this;
          }
          if (dur !== this._dur) {
            // while initting, a plugin like InertiaPlugin might alter the duration, so rerun from the start to ensure everything renders as it should.
            return this.render(totalTime, suppressEvents, force);
          }
        }
        this._tTime = tTime;
        this._time = time;
        if (!this._act && this._ts) {
          this._act = 1; //as long as it's not paused, force it to be active so that if the user renders independent of the parent timeline, it'll be forced to re-render on the next tick.

          this._lazy = 0;
        }
        this.ratio = ratio = (yoyoEase || this._ease)(time / dur);
        if (this._from) {
          this.ratio = ratio = 1 - ratio;
        }
        if (time && !prevTime && !suppressEvents && !iteration) {
          _callback$1(this, "onStart");
          if (this._tTime !== tTime) {
            // in case the onStart triggered a render at a different spot, eject. Like if someone did animation.pause(0.5) or something inside the onStart.
            return this;
          }
        }
        pt = this._pt;
        while (pt) {
          pt.r(ratio, pt.d);
          pt = pt._next;
        }
        timeline && timeline.render(totalTime < 0 ? totalTime : timeline._dur * timeline._ease(time / this._dur), suppressEvents, force) || this._startAt && (this._zTime = totalTime);
        if (this._onUpdate && !suppressEvents) {
          isNegative && _rewindStartAt(this, totalTime, suppressEvents, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.

          _callback$1(this, "onUpdate");
        }
        this._repeat && iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent && _callback$1(this, "onRepeat");
        if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
          isNegative && !this._onUpdate && _rewindStartAt(this, totalTime, true, true);
          (totalTime || !dur) && (tTime === this._tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1); // don't remove if we're rendering at exactly a time of 0, as there could be autoRevert values that should get set on the next tick (if the playhead goes backward beyond the startTime, negative totalTime). Don't remove if the timeline is reversed and the playhead isn't at 0, otherwise tl.progress(1).reverse() won't work. Only remove if the playhead is at the end and timeScale is positive, or if the playhead is at 0 and the timeScale is negative.

          if (!suppressEvents && !(isNegative && !prevTime) && (tTime || prevTime || isYoyo)) {
            // if prevTime and tTime are zero, we shouldn't fire the onReverseComplete. This could happen if you gsap.to(... {paused:true}).play();
            _callback$1(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);
            this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
          }
        }
      }
      return this;
    };
    _proto3.targets = function targets() {
      return this._targets;
    };
    _proto3.invalidate = function invalidate(soft) {
      // "soft" gives us a way to clear out everything EXCEPT the recorded pre-"from" portion of from() tweens. Otherwise, for example, if you tween.progress(1).render(0, true true).invalidate(), the "from" values would persist and then on the next render, the from() tweens would initialize and the current value would match the "from" values, thus animate from the same value to the same value (no animation). We tap into this in ScrollTrigger's refresh() where we must push a tween to completion and then back again but honor its init state in case the tween is dependent on another tween further up on the page.
      (!soft || !this.vars.runBackwards) && (this._startAt = 0);
      this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0;
      this._ptLookup = [];
      this.timeline && this.timeline.invalidate(soft);
      return _Animation2.prototype.invalidate.call(this, soft);
    };
    _proto3.resetTo = function resetTo(property, value, start, startIsRelative, skipRecursion) {
      _tickerActive || _ticker.wake();
      this._ts || this.play();
      var time = Math.min(this._dur, (this._dp._time - this._start) * this._ts),
        ratio;
      this._initted || _initTween(this, time);
      ratio = this._ease(time / this._dur); // don't just get tween.ratio because it may not have rendered yet.
      // possible future addition to allow an object with multiple values to update, like tween.resetTo({x: 100, y: 200}); At this point, it doesn't seem worth the added kb given the fact that most users will likely opt for the convenient gsap.quickTo() way of interacting with this method.
      // if (_isObject(property)) { // performance optimization
      // 	for (p in property) {
      // 		if (_updatePropTweens(this, p, property[p], value ? value[p] : null, start, ratio, time)) {
      // 			return this.resetTo(property, value, start, startIsRelative); // if a PropTween wasn't found for the property, it'll get forced with a re-initialization so we need to jump out and start over again.
      // 		}
      // 	}
      // } else {

      if (_updatePropTweens(this, property, value, start, startIsRelative, ratio, time, skipRecursion)) {
        return this.resetTo(property, value, start, startIsRelative, 1); // if a PropTween wasn't found for the property, it'll get forced with a re-initialization so we need to jump out and start over again.
      } //}

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
        this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true)._first || _interrupt(this); // if nothing is left tweening, interrupt.

        this.parent && tDur !== this.timeline.totalDuration() && _setDuration(this, this._dur * this.timeline._tDur / tDur, 0, 1); // if a nested tween is killed that changes the duration, it should affect this tween's duration. We must use the ratio, though, because sometimes the internal timeline is stretched like for keyframes where they don't all add up to whatever the parent tween's duration was set to.

        return this;
      }
      var parsedTargets = this._targets,
        killingTargets = targets ? toArray$3(targets) : parsedTargets,
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
        //so people can pass in a comma-delimited list of property names
        if (_isString$2(vars)) {
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
      this._initted && !this._pt && firstPT && _interrupt(this); //if all tweening properties are killed, kill the tween. Without this line, if there's a tween with multiple targets and then you killTweensOf() each target individually, the tween would technically still remain active and fire its onComplete even though there aren't any more properties tweening.

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
      }); // we must use onReverseComplete too for things like timeline.add(() => {...}) which should be triggered in BOTH directions (forward and reverse)
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
  _setDefaults$1(Tween.prototype, {
    _targets: [],
    _lazy: 0,
    _startAt: 0,
    _op: 0,
    _onInit: 0
  }); //add the pertinent timeline methods to Tween instances so that users can chain conveniently and create a timeline automatically. (removed due to concerns that it'd ultimately add to more confusion especially for beginners)
  // _forEachName("to,from,fromTo,set,call,add,addLabel,addPause", name => {
  // 	Tween.prototype[name] = function() {
  // 		let tl = new Timeline();
  // 		return _addToTimeline(tl, this)[name].apply(tl, toArray(arguments));
  // 	}
  // });
  //for backward compatibility. Leverage the timeline calls.

  _forEachName("staggerTo,staggerFrom,staggerFromTo", function (name) {
    Tween[name] = function () {
      var tl = new Timeline(),
        params = _slice.call(arguments, 0);
      params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
      return tl[name].apply(tl, params);
    };
  });
  /*
   * --------------------------------------------------------------------------------------
   * PROPTWEEN
   * --------------------------------------------------------------------------------------
   */

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
      return _isFunction$2(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain;
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
        //b = beginning string
        s = data.b;
      } else if (ratio === 1 && data.e) {
        //e = ending string
        s = data.e;
      } else {
        while (pt) {
          s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 10000) / 10000) + s; //we use the "p" property for the text inbetween (like a suffix). And in the context of a complex string, the modifier (m) is typically just Math.round(), like for RGB colors.

          pt = pt._next;
        }
        s += data.c; //we use the "c" of the PropTween to store the final chunk of non-numeric text.
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
        last; //sorts the PropTween linked list in order of priority because some plugins need to do their work after ALL of the PropTweens were created (like RoundPropsPlugin and ModifiersPlugin)

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
    }; //PropTween key: t = target, p = prop, r = renderer, d = data, s = start, c = change, op = overwriteProperty (ONLY populated when it's different than p), pr = priority, _next/_prev for the linked list siblings, set = setter, m = modifier, mSet = modifierSetter (the original setter, before a modifier was added)

  var PropTween = /*#__PURE__*/function () {
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
      this.mSet = this.mSet || this.set; //in case it was already set (a PropTween can only have one modifier)

      this.set = _setterWithModifier;
      this.m = func;
      this.mt = target; //modifier target

      this.tween = tween;
    };
    return PropTween;
  }(); //Initialization tasks

  _forEachName(_callbackNames + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function (name) {
    return _reservedProps[name] = 1;
  });
  _globals.TweenMax = _globals.TweenLite = Tween;
  _globals.TimelineLite = _globals.TimelineMax = Timeline;
  _globalTimeline = new Timeline({
    sortChildren: false,
    defaults: _defaults$1,
    autoRemoveChildren: true,
    id: "root",
    smoothChildTiming: true
  });
  _config.stringFilter = _colorStringFilter;
  var _media = [],
    _listeners$1 = {},
    _emptyArray$1 = [],
    _lastMediaTime = 0,
    _contextID = 0,
    _dispatch$1 = function _dispatch(type) {
      return (_listeners$1[type] || _emptyArray$1).map(function (f) {
        return f();
      });
    },
    _onMediaChange = function _onMediaChange() {
      var time = Date.now(),
        matches = [];
      if (time - _lastMediaTime > 2) {
        _dispatch$1("matchMediaInit");
        _media.forEach(function (c) {
          var queries = c.queries,
            conditions = c.conditions,
            match,
            p,
            anyMatch,
            toggled;
          for (p in queries) {
            match = _win$4.matchMedia(queries[p]).matches; // Firefox doesn't update the "matches" property of the MediaQueryList object correctly - it only does so as it calls its change handler - so we must re-create a media query here to ensure it's accurate.

            match && (anyMatch = 1);
            if (match !== conditions[p]) {
              conditions[p] = match;
              toggled = 1;
            }
          }
          if (toggled) {
            c.revert();
            anyMatch && matches.push(c);
          }
        });
        _dispatch$1("matchMediaRevert");
        matches.forEach(function (c) {
          return c.onMatch(c, function (func) {
            return c.add(null, func);
          });
        });
        _lastMediaTime = time;
        _dispatch$1("matchMedia");
      }
    };
  var Context = /*#__PURE__*/function () {
    function Context(func, scope) {
      this.selector = scope && selector(scope);
      this.data = [];
      this._r = []; // returned/cleanup functions

      this.isReverted = false;
      this.id = _contextID++; // to work around issues that frameworks like Vue cause by making things into Proxies which make it impossible to do something like _media.indexOf(this) because "this" would no longer refer to the Context instance itself - it'd refer to a Proxy! We needed a way to identify the context uniquely

      func && this.add(func);
    }
    var _proto5 = Context.prototype;
    _proto5.add = function add(name, func, scope) {
      // possible future addition if we need the ability to add() an animation to a context and for whatever reason cannot create that animation inside of a context.add(() => {...}) function.
      // if (name && _isFunction(name.revert)) {
      // 	this.data.push(name);
      // 	return (name._ctx = this);
      // }
      if (_isFunction$2(name)) {
        scope = func;
        func = name;
        name = _isFunction$2;
      }
      var self = this,
        f = function f() {
          var prev = _context$3,
            prevSelector = self.selector,
            result;
          prev && prev !== self && prev.data.push(self);
          scope && (self.selector = selector(scope));
          _context$3 = self;
          result = func.apply(self, arguments);
          _isFunction$2(result) && self._r.push(result);
          _context$3 = prev;
          self.selector = prevSelector;
          self.isReverted = false;
          return result;
        };
      self.last = f;
      return name === _isFunction$2 ? f(self, function (func) {
        return self.add(null, func);
      }) : name ? self[name] = f : f;
    };
    _proto5.ignore = function ignore(func) {
      var prev = _context$3;
      _context$3 = null;
      func(this);
      _context$3 = prev;
    };
    _proto5.getTweens = function getTweens() {
      var a = [];
      this.data.forEach(function (e) {
        return e instanceof Context ? a.push.apply(a, e.getTweens()) : e instanceof Tween && !(e.parent && e.parent.data === "nested") && a.push(e);
      });
      return a;
    };
    _proto5.clear = function clear() {
      this._r.length = this.data.length = 0;
    };
    _proto5.kill = function kill(revert, matchMedia) {
      var _this4 = this;
      if (revert) {
        (function () {
          var tweens = _this4.getTweens(),
            i = _this4.data.length,
            t;
          while (i--) {
            // Flip plugin tweens are very different in that they should actually be pushed to their end. The plugin replaces the timeline's .revert() method to do exactly that. But we also need to remove any of those nested tweens inside the flip timeline so that they don't get individually reverted.
            t = _this4.data[i];
            if (t.data === "isFlip") {
              t.revert();
              t.getChildren(true, true, false).forEach(function (tween) {
                return tweens.splice(tweens.indexOf(tween), 1);
              });
            }
          } // save as an object so that we can cache the globalTime for each tween to optimize performance during the sort

          tweens.map(function (t) {
            return {
              g: t._dur || t._delay || t._sat && !t._sat.vars.immediateRender ? t.globalTime(0) : -Infinity,
              t: t
            };
          }).sort(function (a, b) {
            return b.g - a.g || -Infinity;
          }).forEach(function (o) {
            return o.t.revert(revert);
          }); // note: all of the _startAt tweens should be reverted in reverse order that they were created, and they'll all have the same globalTime (-1) so the " || -1" in the sort keeps the order properly.

          i = _this4.data.length;
          while (i--) {
            // make sure we loop backwards so that, for example, SplitTexts that were created later on the same element get reverted first
            t = _this4.data[i];
            if (t instanceof Timeline) {
              if (t.data !== "nested") {
                t.scrollTrigger && t.scrollTrigger.revert();
                t.kill(); // don't revert() the timeline because that's duplicating efforts since we already reverted all the tweens
              }
            } else {
              !(t instanceof Tween) && t.revert && t.revert(revert);
            }
          }
          _this4._r.forEach(function (f) {
            return f(revert, _this4);
          });
          _this4.isReverted = true;
        })();
      } else {
        this.data.forEach(function (e) {
          return e.kill && e.kill();
        });
      }
      this.clear();
      if (matchMedia) {
        var i = _media.length;
        while (i--) {
          // previously, we checked _media.indexOf(this), but some frameworks like Vue enforce Proxy objects that make it impossible to get the proper result that way, so we must use a unique ID number instead.
          _media[i].id === this.id && _media.splice(i, 1);
        }
      }
    };
    _proto5.revert = function revert(config) {
      this.kill(config || {});
    };
    return Context;
  }();
  var MatchMedia = /*#__PURE__*/function () {
    function MatchMedia(scope) {
      this.contexts = [];
      this.scope = scope;
      _context$3 && _context$3.data.push(this);
    }
    var _proto6 = MatchMedia.prototype;
    _proto6.add = function add(conditions, func, scope) {
      _isObject$1(conditions) || (conditions = {
        matches: conditions
      });
      var context = new Context(0, scope || this.scope),
        cond = context.conditions = {},
        mq,
        p,
        active;
      _context$3 && !context.selector && (context.selector = _context$3.selector); // in case a context is created inside a context. Like a gsap.matchMedia() that's inside a scoped gsap.context()

      this.contexts.push(context);
      func = context.add("onMatch", func);
      context.queries = conditions;
      for (p in conditions) {
        if (p === "all") {
          active = 1;
        } else {
          mq = _win$4.matchMedia(conditions[p]);
          if (mq) {
            _media.indexOf(context) < 0 && _media.push(context);
            (cond[p] = mq.matches) && (active = 1);
            mq.addListener ? mq.addListener(_onMediaChange) : mq.addEventListener("change", _onMediaChange);
          }
        }
      }
      active && func(context, function (f) {
        return context.add(null, f);
      });
      return this;
    } // refresh() {
    // 	let time = _lastMediaTime,
    // 		media = _media;
    // 	_lastMediaTime = -1;
    // 	_media = this.contexts;
    // 	_onMediaChange();
    // 	_lastMediaTime = time;
    // 	_media = media;
    // }
    ;

    _proto6.revert = function revert(config) {
      this.kill(config || {});
    };
    _proto6.kill = function kill(revert) {
      this.contexts.forEach(function (c) {
        return c.kill(revert, true);
      });
    };
    return MatchMedia;
  }();
  /*
   * --------------------------------------------------------------------------------------
   * GSAP
   * --------------------------------------------------------------------------------------
   */

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
      _isString$2(target) && (target = toArray$3(target)[0]); //in case selector text or an array is passed in

      var getter = _getCache(target || {}).get,
        format = unit ? _passThrough$1 : _numericIfPossible;
      unit === "native" && (unit = "");
      return !target ? target : !property ? function (property, unit, uncache) {
        return format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
      } : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
    },
    quickSetter: function quickSetter(target, property, unit) {
      target = toArray$3(target);
      if (target.length > 1) {
        var setters = target.map(function (t) {
            return gsap$4.quickSetter(t, property, unit);
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
        // in case it's an alias, like "rotate" for "rotation".
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
      var tween = gsap$4.to(target, _merge((_merge2 = {}, _merge2[property] = "+=0.1", _merge2.paused = true, _merge2), vars || {})),
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
      value && value.ease && (value.ease = _parseEase(value.ease, _defaults$1.ease));
      return _mergeDeep(_defaults$1, value || {});
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
        return effect(toArray$3(targets), _setDefaults$1(vars || {}, defaults), tl);
      };
      if (extendTimeline) {
        Timeline.prototype[name] = function (targets, vars, position) {
          return this.add(_effects[name](targets, _isObject$1(vars) ? vars : (position = vars) && {}, this), position);
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
      tl._dp = 0; //otherwise it'll get re-activated when adding children and be re-introduced into _globalTimeline's linked list (then added to itself).

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
    context: function context(func, scope) {
      return func ? new Context(func, scope) : _context$3;
    },
    matchMedia: function matchMedia(scope) {
      return new MatchMedia(scope);
    },
    matchMediaRefresh: function matchMediaRefresh() {
      return _media.forEach(function (c) {
        var cond = c.conditions,
          found,
          p;
        for (p in cond) {
          if (cond[p]) {
            cond[p] = false;
            found = 1;
          }
        }
        found && c.revert();
      }) || _onMediaChange();
    },
    addEventListener: function addEventListener(type, callback) {
      var a = _listeners$1[type] || (_listeners$1[type] = []);
      ~a.indexOf(callback) || a.push(callback);
    },
    removeEventListener: function removeEventListener(type, callback) {
      var a = _listeners$1[type],
        i = a && a.indexOf(callback);
      i >= 0 && a.splice(i, 1);
    },
    utils: {
      wrap: wrap,
      wrapYoyo: wrapYoyo,
      distribute: distribute,
      random: random,
      snap: snap,
      normalize: normalize,
      getUnit: getUnit,
      clamp: clamp$3,
      splitColor: splitColor,
      toArray: toArray$3,
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
      reverting: function reverting() {
        return _reverting$1;
      },
      context: function context(toAdd) {
        if (toAdd && _context$3) {
          _context$3.data.push(toAdd);
          toAdd._ctx = _context$3;
        }
        return _context$3;
      },
      suppressOverwrites: function suppressOverwrites(value) {
        return _suppressOverwrites$1 = value;
      }
    }
  };
  _forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function (name) {
    return _gsap[name] = Tween[name];
  });
  _ticker.add(Timeline.updateRoot);
  _quickTween = _gsap.to({}, {
    duration: 0
  }); // ---- EXTRA PLUGINS --------------------------------------------------------

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
              // is a plugin
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
        //don't pre-process function-based values or "random()" strings.
        init: function init(target, vars, tween) {
          tween._onInit = function (tween) {
            var temp, p;
            if (_isString$2(vars)) {
              temp = {};
              _forEachName(vars, function (name) {
                return temp[name] = 1;
              }); //if the user passes in a comma-delimited list of property names to roundProps, like "x,y", we round to whole numbers.

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
    }; //register core plugins

  var gsap$4 = _gsap.registerPlugin({
    name: "attr",
    init: function init(target, vars, tween, index, targets) {
      var p, pt, v;
      this.tween = tween;
      for (p in vars) {
        v = target.getAttribute(p) || "";
        pt = this.add(target, "setAttribute", (v || 0) + "", vars[p], index, targets, 0, 0, p);
        pt.op = p;
        pt.b = v; // record the beginning value so we can revert()

        this._props.push(p);
      }
    },
    render: function render(ratio, data) {
      var pt = data._pt;
      while (pt) {
        _reverting$1 ? pt.set(pt.t, pt.p, pt.b, pt) : pt.r(ratio, pt.d); // if reverting, go back to the original (pt.b)

        pt = pt._next;
      }
    }
  }, {
    name: "endArray",
    init: function init(target, value) {
      var i = value.length;
      while (i--) {
        this.add(target, i, target[i] || 0, value[i], 0, 0, 0, 0, 0, 1);
      }
    }
  }, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap; //to prevent the core plugins from being dropped via aggressive tree shaking, we must include them in the variable declaration in this way.

  Tween.version = Timeline.version = gsap$4.version = "3.12.5";
  _coreReady = 1;
  _windowExists$2() && _wake();
  _easeMap.Power0;
    _easeMap.Power1;
    _easeMap.Power2;
    _easeMap.Power3;
    _easeMap.Power4;
    _easeMap.Linear;
    _easeMap.Quad;
    _easeMap.Cubic;
    _easeMap.Quart;
    _easeMap.Quint;
    _easeMap.Strong;
    _easeMap.Elastic;
    _easeMap.Back;
    _easeMap.SteppedEase;
    _easeMap.Bounce;
    _easeMap.Sine;
    _easeMap.Expo;
    _easeMap.Circ;

  /*!
   * CSSPlugin 3.12.5
   * https://gsap.com
   *
   * Copyright 2008-2024, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license or for
   * Club GSAP members, the agreement issued with that membership.
   * @author: Jack Doyle, jack@greensock.com
  */
  var _win$3,
    _doc$3,
    _docElement,
    _pluginInitted,
    _tempDiv,
    _recentSetterPlugin,
    _reverting,
    _windowExists$1 = function _windowExists() {
      return typeof window !== "undefined";
    },
    _transformProps = {},
    _RAD2DEG = 180 / Math.PI,
    _DEG2RAD$1 = Math.PI / 180,
    _atan2$1 = Math.atan2,
    _bigNum$1 = 1e8,
    _capsExp$1 = /([A-Z])/g,
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
    //if units change, we need a way to render the original unit/value when the tween goes all the way back to the beginning (ratio:0)
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
    _transformProp$1 = "transform",
    _transformOriginProp = _transformProp$1 + "Origin",
    _saveStyle = function _saveStyle(property, isNotCSS) {
      var _this = this;
      var target = this.target,
        style = target.style,
        cache = target._gsap;
      if (property in _transformProps && style) {
        this.tfm = this.tfm || {};
        if (property !== "transform") {
          property = _propertyAliases[property] || property;
          ~property.indexOf(",") ? property.split(",").forEach(function (a) {
            return _this.tfm[a] = _get(target, a);
          }) : this.tfm[property] = cache.x ? cache[property] : _get(target, property); // note: scale would map to "scaleX,scaleY", thus we loop and apply them both.

          property === _transformOriginProp && (this.tfm.zOrigin = cache.zOrigin);
        } else {
          return _propertyAliases.transform.split(",").forEach(function (p) {
            return _saveStyle.call(_this, p, isNotCSS);
          });
        }
        if (this.props.indexOf(_transformProp$1) >= 0) {
          return;
        }
        if (cache.svg) {
          this.svgo = target.getAttribute("data-svg-origin");
          this.props.push(_transformOriginProp, isNotCSS, "");
        }
        property = _transformProp$1;
      }
      (style || isNotCSS) && this.props.push(property, isNotCSS, style[property]);
    },
    _removeIndependentTransforms = function _removeIndependentTransforms(style) {
      if (style.translate) {
        style.removeProperty("translate");
        style.removeProperty("scale");
        style.removeProperty("rotate");
      }
    },
    _revertStyle = function _revertStyle() {
      var props = this.props,
        target = this.target,
        style = target.style,
        cache = target._gsap,
        i,
        p;
      for (i = 0; i < props.length; i += 3) {
        // stored like this: property, isNotCSS, value
        props[i + 1] ? target[props[i]] = props[i + 2] : props[i + 2] ? style[props[i]] = props[i + 2] : style.removeProperty(props[i].substr(0, 2) === "--" ? props[i] : props[i].replace(_capsExp$1, "-$1").toLowerCase());
      }
      if (this.tfm) {
        for (p in this.tfm) {
          cache[p] = this.tfm[p];
        }
        if (cache.svg) {
          cache.renderTransform();
          target.setAttribute("data-svg-origin", this.svgo || "");
        }
        i = _reverting();
        if ((!i || !i.isStart) && !style[_transformProp$1]) {
          _removeIndependentTransforms(style);
          if (cache.zOrigin && style[_transformOriginProp]) {
            style[_transformOriginProp] += " " + cache.zOrigin + "px"; // since we're uncaching, we must put the zOrigin back into the transformOrigin so that we can pull it out accurately when we parse again. Otherwise, we'd lose the z portion of the origin since we extract it to protect from Safari bugs.

            cache.zOrigin = 0;
            cache.renderTransform();
          }
          cache.uncache = 1; // if it's a startAt that's being reverted in the _initTween() of the core, we don't need to uncache transforms. This is purely a performance optimization.
        }
      }
    },
    _getStyleSaver = function _getStyleSaver(target, properties) {
      var saver = {
        target: target,
        props: [],
        revert: _revertStyle,
        save: _saveStyle
      };
      target._gsap || gsap$4.core.getCache(target); // just make sure there's a _gsap cache defined because we read from it in _saveStyle() and it's more efficient to just check it here once.

      properties && properties.split(",").forEach(function (p) {
        return saver.save(p);
      });
      return saver;
    },
    _supports3D,
    _createElement = function _createElement(type, ns) {
      var e = _doc$3.createElementNS ? _doc$3.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc$3.createElement(type); //some servers swap in https for http in the namespace which can break things, making "style" inaccessible.

      return e && e.style ? e : _doc$3.createElement(type); //some environments won't allow access to the element's style when created with a namespace in which case we default to the standard createElement() to work around the issue. Also note that when GSAP is embedded directly inside an SVG file, createElement() won't allow access to the style object in Firefox (see https://gsap.com/forums/topic/20215-problem-using-tweenmax-in-standalone-self-containing-svg-file-err-cannot-set-property-csstext-of-undefined/).
    },
    _getComputedProperty = function _getComputedProperty(target, property, skipPrefixFallback) {
      var cs = getComputedStyle(target);
      return cs[property] || cs.getPropertyValue(property.replace(_capsExp$1, "-$1").toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty(target, _checkPropPrefix(property) || property, 1) || ""; //css variables may not need caps swapped out for dashes and lowercase.
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
    _initCore$3 = function _initCore() {
      if (_windowExists$1() && window.document) {
        _win$3 = window;
        _doc$3 = _win$3.document;
        _docElement = _doc$3.documentElement;
        _tempDiv = _createElement("div") || {
          style: {}
        };
        _createElement("div");
        _transformProp$1 = _checkPropPrefix(_transformProp$1);
        _transformOriginProp = _transformProp$1 + "Origin";
        _tempDiv.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0"; //make sure to override certain properties that may contaminate measurements, in case the user has overreaching style sheets.

        _supports3D = !!_checkPropPrefix("perspective");
        _reverting = gsap$4.core.reverting;
        _pluginInitted = 1;
      }
    },
    _getBBoxHack = function _getBBoxHack(swapIfPossible) {
      //works around issues in some browsers (like Firefox) that don't correctly report getBBox() on SVG elements inside a <defs> element and/or <mask>. We try creating an SVG, adding it to the documentElement and toss the element in there so that it's definitely part of the rendering tree, then grab the bbox and if it works, we actually swap out the original getBBox() method for our own that does these extra steps whenever getBBox is needed. This helps ensure that performance is optimal (only do all these extra steps when absolutely necessary...most elements don't need it).
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
          this._gsapBBox = this.getBBox; //store the original

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
        bounds = target.getBBox(); //Firefox throws errors if you try calling getBBox() on an SVG element that's not rendered (like in a <symbol> or <defs>). https://bugzilla.mozilla.org/show_bug.cgi?id=612118
      } catch (error) {
        bounds = _getBBoxHack.call(target, true);
      }
      bounds && (bounds.width || bounds.height) || target.getBBox === _getBBoxHack || (bounds = _getBBoxHack.call(target, true)); //some browsers (like Firefox) misreport the bounds if the element has zero width and height (it just assumes it's at x:0, y:0), thus we need to manually grab the position in that case.

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
    //reports if the element is an SVG on which getBBox() actually works
    _removeProperty = function _removeProperty(target, property) {
      if (property) {
        var style = target.style,
          first2Chars;
        if (property in _transformProps && property !== _transformOriginProp) {
          property = _transformProp$1;
        }
        if (style.removeProperty) {
          first2Chars = property.substr(0, 2);
          if (first2Chars === "ms" || property.substr(0, 6) === "webkit") {
            //Microsoft and some Webkit browsers don't conform to the standard of capitalizing the first prefix character, so we adjust so that when we prefix the caps with a dash, it's correct (otherwise it'd be "ms-transform" instead of "-ms-transform" for IE9, for example)
            property = "-" + property;
          }
          style.removeProperty(first2Chars === "--" ? property : property.replace(_capsExp$1, "-$1").toLowerCase());
        } else {
          //note: old versions of IE use "removeAttribute()" instead of "removeProperty()"
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
    _nonStandardLayouts = {
      grid: 1,
      flex: 1
    },
    //takes a single value like 20px and converts it to the unit specified, like "%", returning only the numeric amount.
    _convertToUnit = function _convertToUnit(target, property, value, unit) {
      var curValue = parseFloat(value) || 0,
        curUnit = (value + "").trim().substr((curValue + "").length) || "px",
        // some browsers leave extra whitespace at the beginning of CSS variables, hence the need to trim()
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
        return _round$2(toPercent ? curValue / px * amount : curValue / 100 * px);
      }
      style[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit);
      parent = ~property.indexOf("adius") || unit === "em" && target.appendChild && !isRootSVG ? target : target.parentNode;
      if (isSVG) {
        parent = (target.ownerSVGElement || {}).parentNode;
      }
      if (!parent || parent === _doc$3 || !parent.appendChild) {
        parent = _doc$3.body;
      }
      cache = parent._gsap;
      if (cache && toPercent && cache.width && horizontal && cache.time === _ticker.time && !cache.uncache) {
        return _round$2(curValue / cache.width * amount);
      } else {
        if (toPercent && (property === "height" || property === "width")) {
          // if we're dealing with width/height that's inside a container with padding and/or it's a flexbox/grid container, we must apply it to the target itself rather than the _tempDiv in order to ensure complete accuracy, factoring in the parent's padding.
          var v = target.style[property];
          target.style[property] = amount + unit;
          px = target[measureProperty];
          v ? target.style[property] = v : _removeProperty(target, property);
        } else {
          (toPercent || curUnit === "%") && !_nonStandardLayouts[_getComputedProperty(parent, "display")] && (style.position = _getComputedProperty(target, "position"));
          parent === target && (style.position = "static"); // like for borderRadius, if it's a % we must have it relative to the target itself but that may not have position: relative or position: absolute in which case it'd go up the chain until it finds its offsetParent (bad). position: static protects against that.

          parent.appendChild(_tempDiv);
          px = _tempDiv[measureProperty];
          parent.removeChild(_tempDiv);
          style.position = "absolute";
        }
        if (horizontal && toPercent) {
          cache = _getCache(parent);
          cache.time = _ticker.time;
          cache.width = parent[measureProperty];
        }
      }
      return _round$2(toPixels ? px * curValue / amount : px && curValue ? amount / px * curValue : 0);
    },
    _get = function _get(target, property, unit, uncache) {
      var value;
      _pluginInitted || _initCore$3();
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
          value = _specialProps[property] && _specialProps[property](target, property, unit) || _getComputedProperty(target, property) || _getProperty(target, property) || (property === "opacity" ? 1 : 0); // note: some browsers, like Firefox, don't report borderRadius correctly! Instead, it only reports every corner like  borderTopLeftRadius
        }
      }

      return unit && !~(value + "").trim().indexOf(" ") ? _convertToUnit(target, property, value, unit) + unit : value;
    },
    _tweenComplexCSSString = function _tweenComplexCSSString(target, prop, start, end) {
      // note: we call _tweenComplexCSSString.call(pluginInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.
      if (!start || start === "none") {
        // some browsers like Safari actually PREFER the prefixed property and mis-report the unprefixed value like clipPath (BUG). In other words, even though clipPath exists in the style ("clipPath" in target.style) and it's set in the CSS properly (along with -webkit-clip-path), Safari reports clipPath as "none" whereas WebkitClipPath reports accurately like "ellipse(100% 0% at 50% 0%)", so in this case we must SWITCH to using the prefixed property instead. See https://gsap.com/forums/topic/18310-clippath-doesnt-work-on-ios/
        var p = _checkPropPrefix(prop, target, 1),
          s = p && _getComputedProperty(target, p, 1);
        if (s && s !== start) {
          prop = p;
          start = s;
        } else if (prop === "borderColor") {
          start = _getComputedProperty(target, "borderTopColor"); // Firefox bug: always reports "borderColor" as "", so we must fall back to borderTopColor. See https://gsap.com/forums/topic/24583-how-to-return-colors-that-i-had-after-reverse/
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
      start += ""; // ensure values are strings

      end += "";
      if (end === "auto") {
        startValue = target.style[prop];
        target.style[prop] = end;
        end = _getComputedProperty(target, prop) || end;
        startValue ? target.style[prop] = startValue : _removeProperty(target, prop);
      }
      a = [start, end];
      _colorStringFilter(a); // pass an array with the starting and ending values and let the filter do whatever it needs to the values. If colors are found, it returns true and then we must match where the color shows up order-wise because for things like boxShadow, sometimes the browser provides the computed values with the color FIRST, but the user provides it with the color LAST, so flip them if necessary. Same for drop-shadow().

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
              //if something like "perspective:300" is passed in and we must add a unit to the end
              endUnit = endUnit || _config.units[prop] || startUnit;
              if (index === end.length) {
                end += endUnit;
                pt.e += endUnit;
              }
            }
            if (startUnit !== endUnit) {
              startNum = _convertToUnit(target, prop, startValue, endUnit) || 0;
            } // these nested PropTweens are handled in a special way - we'll never actually call a render or setter method on them. We'll just loop through them in the parent complex string PropTween's render method.

            pt._pt = {
              _next: pt._pt,
              p: chunk || matchIndex === 1 ? chunk : ",",
              //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
              s: startNum,
              c: endNum - startNum,
              m: color && color < 4 || prop === "zIndex" ? Math.round : 0
            };
          }
        }
        pt.c = index < end.length ? end.substring(index, end.length) : ""; //we use the "c" of the PropTween to store the final part of the string (after the last number)
      } else {
        pt.r = prop === "display" && end === "none" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue;
      }
      _relExp.test(end) && (pt.e = 0); //if the end string contains relative values or dynamic random(...) values, delete the end it so that on the final render we don't actually set it to the string with += or -= characters (forces it to use the calculated value).

      this._pt = pt; //start the linked list with this new PropTween. Remember, we call _tweenComplexCSSString.call(pluginInstance...) to ensure that it's scoped properly. We may call it from within another plugin too, thus "this" would refer to the plugin.

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
        //the user provided them in the wrong order, so flip them
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
              prop = prop === "transformOrigin" ? _transformOriginProp : _transformProp$1;
            }
            _removeProperty(target, prop);
          }
        }
        if (clearTransforms) {
          _removeProperty(target, _transformProp$1);
          if (cache) {
            cache.svg && target.removeAttribute("transform");
            _parseTransform(target, 1); // force all the cached values back to "normal"/identity, otherwise if there's another tween that's already set to render transforms on this element, it could display the wrong values.

            cache.uncache = 1;
            _removeIndependentTransforms(style);
          }
        }
      }
    },
    // note: specialProps should return 1 if (and only if) they have a non-zero priority. It indicates we need to sort the linked list.
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
      /* className feature (about 0.4kb gzipped).
      , className(plugin, target, property, endValue, tween) {
      	let _renderClassName = (ratio, data) => {
      			data.css.render(ratio, data.css);
      			if (!ratio || ratio === 1) {
      				let inline = data.rmv,
      					target = data.t,
      					p;
      				target.setAttribute("class", ratio ? data.e : data.b);
      				for (p in inline) {
      					_removeProperty(target, p);
      				}
      			}
      		},
      		_getAllStyles = (target) => {
      			let styles = {},
      				computed = getComputedStyle(target),
      				p;
      			for (p in computed) {
      				if (isNaN(p) && p !== "cssText" && p !== "length") {
      					styles[p] = computed[p];
      				}
      			}
      			_setDefaults(styles, _parseTransform(target, 1));
      			return styles;
      		},
      		startClassList = target.getAttribute("class"),
      		style = target.style,
      		cssText = style.cssText,
      		cache = target._gsap,
      		classPT = cache.classPT,
      		inlineToRemoveAtEnd = {},
      		data = {t:target, plugin:plugin, rmv:inlineToRemoveAtEnd, b:startClassList, e:(endValue.charAt(1) !== "=") ? endValue : startClassList.replace(new RegExp("(?:\\s|^)" + endValue.substr(2) + "(?![\\w-])"), "") + ((endValue.charAt(0) === "+") ? " " + endValue.substr(2) : "")},
      		changingVars = {},
      		startVars = _getAllStyles(target),
      		transformRelated = /(transform|perspective)/i,
      		endVars, p;
      	if (classPT) {
      		classPT.r(1, classPT.d);
      		_removeLinkedListItem(classPT.d.plugin, classPT, "_pt");
      	}
      	target.setAttribute("class", data.e);
      	endVars = _getAllStyles(target, true);
      	target.setAttribute("class", startClassList);
      	for (p in endVars) {
      		if (endVars[p] !== startVars[p] && !transformRelated.test(p)) {
      			changingVars[p] = endVars[p];
      			if (!style[p] && style[p] !== "0") {
      				inlineToRemoveAtEnd[p] = 1;
      			}
      		}
      	}
      	cache.classPT = plugin._pt = new PropTween(plugin._pt, target, "className", 0, 0, _renderClassName, data, 0, -11);
      	if (style.cssText !== cssText) { //only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://gsap.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
      		style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
      	}
      	_parseTransform(target, true); //to clear the caching of transforms
      	data.css = new gsap.plugins.css();
      	data.css.init(target, changingVars, tween);
      	plugin._props.push(...data.css._props);
      	return 1;
      }
      */
    },
    /*
     * --------------------------------------------------------------------------------------
     * TRANSFORMS
     * --------------------------------------------------------------------------------------
     */
    _identity2DMatrix = [1, 0, 0, 1, 0, 0],
    _rotationalProperties = {},
    _isNullTransform = function _isNullTransform(value) {
      return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value;
    },
    _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray(target) {
      var matrixString = _getComputedProperty(target, _transformProp$1);
      return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_numExp$1).map(_round$2);
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
        temp = target.transform.baseVal.consolidate().matrix; //ensures that even complex values like "translate(50,60) rotate(135,0,0)" are parsed because it mashes it into a matrix.

        matrix = [temp.a, temp.b, temp.c, temp.d, temp.e, temp.f];
        return matrix.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix;
      } else if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache.svg) {
        //note: if offsetParent is null, that means the element isn't in the normal document flow, like if it has display:none or one of its ancestors has display:none). Firefox returns null for getComputedStyle() if the element is in an iframe that has display:none. https://bugzilla.mozilla.org/show_bug.cgi?id=548397
        //browsers don't report transforms accurately unless the element is in the DOM and has a display value that's not "none". Firefox and Microsoft browsers have a partial bug where they'll report transforms even if display:none BUT not any percentage-based values like translate(-50%, 8px) will be reported as if it's translate(0, 8px).
        temp = style.display;
        style.display = "block";
        parent = target.parentNode;
        if (!parent || !target.offsetParent) {
          // note: in 3.3.0 we switched target.offsetParent to _doc.body.contains(target) to avoid [sometimes unnecessary] MutationObserver calls but that wasn't adequate because there are edge cases where nested position: fixed elements need to get reparented to accurately sense transforms. See https://github.com/greensock/GSAP/issues/388 and https://github.com/greensock/GSAP/issues/375
          addedToDOM = 1; //flag

          nextSibling = target.nextElementSibling;
          _docElement.appendChild(target); //we must add it to the DOM in order to get values properly
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
        yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf("%") ? yOrigin / 100 * bounds.height : yOrigin); // if (!("xOrigin" in cache) && (xOrigin || yOrigin)) { // added in 3.12.3, reverted in 3.12.4; requires more exploration
        // 	xOrigin -= bounds.x;
        // 	yOrigin -= bounds.y;
        // }
      } else if (matrix !== _identity2DMatrix && (determinant = a * d - b * c)) {
        //if it's zero (like if scaleX and scaleY are zero), skip it to avoid errors with dividing by zero.
        x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + (c * ty - d * tx) / determinant;
        y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - (a * ty - b * tx) / determinant;
        xOrigin = x;
        yOrigin = y; // theory: we only had to do this for smoothing and it assumes that the previous one was not originIsAbsolute.
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
      target.style[_transformOriginProp] = "0px 0px"; //otherwise, if someone sets  an origin via CSS, it will likely interfere with the SVG transform attribute ones (because remember, we're baking the origin into the matrix() value).

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
        cs = getComputedStyle(target),
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
      if (cs.translate) {
        // accommodate independent transforms by combining them into normal ones.
        if (cs.translate !== "none" || cs.scale !== "none" || cs.rotate !== "none") {
          style[_transformProp$1] = (cs.translate !== "none" ? "translate3d(" + (cs.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (cs.rotate !== "none" ? "rotate(" + cs.rotate + ") " : "") + (cs.scale !== "none" ? "scale(" + cs.scale.split(" ").join(",") + ") " : "") + (cs[_transformProp$1] !== "none" ? cs[_transformProp$1] : "");
        }
        style.scale = style.rotate = style.translate = "none";
      }
      matrix = _getMatrix(target, cache.svg);
      if (cache.svg) {
        if (cache.uncache) {
          // if cache.uncache is true (and maybe if origin is 0,0), we need to set element.style.transformOrigin = (cache.xOrigin - bbox.x) + "px " + (cache.yOrigin - bbox.y) + "px". Previously we let the data-svg-origin stay instead, but when introducing revert(), it complicated things.
          t2 = target.getBBox();
          origin = cache.xOrigin - t2.x + "px " + (cache.yOrigin - t2.y) + "px";
          t1 = "";
        } else {
          t1 = !uncache && target.getAttribute("data-svg-origin"); //  Remember, to work around browser inconsistencies we always force SVG elements' transformOrigin to 0,0 and offset the translation accordingly.
        }

        _applySVGOrigin(target, t1 || origin, !!t1 || cache.originIsAbsolute, cache.smooth !== false, matrix);
      }
      xOrigin = cache.xOrigin || 0;
      yOrigin = cache.yOrigin || 0;
      if (matrix !== _identity2DMatrix) {
        a = matrix[0]; //a11

        b = matrix[1]; //a21

        c = matrix[2]; //a31

        d = matrix[3]; //a41

        x = a12 = matrix[4];
        y = a22 = matrix[5]; //2D matrix

        if (matrix.length === 6) {
          scaleX = Math.sqrt(a * a + b * b);
          scaleY = Math.sqrt(d * d + c * c);
          rotation = a || b ? _atan2$1(b, a) * _RAD2DEG : 0; //note: if scaleX is 0, we cannot accurately measure rotation. Same for skewX with a scaleY of 0. Therefore, we default to the previously recorded value (or zero if that doesn't exist).

          skewX = c || d ? _atan2$1(c, d) * _RAD2DEG + rotation : 0;
          skewX && (scaleY *= Math.abs(Math.cos(skewX * _DEG2RAD$1)));
          if (cache.svg) {
            x -= xOrigin - (xOrigin * a + yOrigin * c);
            y -= yOrigin - (xOrigin * b + yOrigin * d);
          } //3D matrix
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
          angle = _atan2$1(a32, a33);
          rotationX = angle * _RAD2DEG; //rotationX

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
          } //rotationY

          angle = _atan2$1(-c, a33);
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
          } //rotationZ

          angle = _atan2$1(b, a);
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
            //when rotationY is set, it will often be parsed as 180 degrees different than it should be, and rotationX and rotation both being 180 (it looks the same), so we adjust for that here.
            rotationX = rotation = 0;
            rotationY = 180 - rotationY;
          }
          scaleX = _round$2(Math.sqrt(a * a + b * b + c * c));
          scaleY = _round$2(Math.sqrt(a22 * a22 + a32 * a32));
          angle = _atan2$1(a12, a22);
          skewX = Math.abs(angle) > 0.0002 ? angle * _RAD2DEG : 0;
          perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
        }
        if (cache.svg) {
          //sense if there are CSS transforms applied on an SVG element in which case we must overwrite them when rendering. The transform attribute is more reliable cross-browser, but we can't just remove the CSS ones because they may be applied in a CSS rule somewhere (not just inline).
          t1 = target.getAttribute("transform");
          cache.forceCSS = target.setAttribute("transform", "") || !_isNullTransform(_getComputedProperty(target, _transformProp$1));
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
      cache.scaleX = _round$2(scaleX);
      cache.scaleY = _round$2(scaleY);
      cache.rotation = _round$2(rotation) + deg;
      cache.rotationX = _round$2(rotationX) + deg;
      cache.rotationY = _round$2(rotationY) + deg;
      cache.skewX = skewX + deg;
      cache.skewY = skewY + deg;
      cache.transformPerspective = perspective + px;
      if (cache.zOrigin = parseFloat(origin.split(" ")[2]) || !uncache && cache.zOrigin || 0) {
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
    //for handling transformOrigin values, stripping out the 3rd dimension
    _addPxTranslate = function _addPxTranslate(target, start, value) {
      var unit = getUnit(start);
      return _round$2(parseFloat(start) + parseFloat(_convertToUnit(target, "x", value + "px", unit))) + unit;
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
        use3D = force3D === "auto" && ratio && ratio !== 1 || force3D === true; // Safari has a bug that causes it not to render 3D transform-origin values properly, so we force the z origin to 0, record it in the cache, and then do the math here to offset the translate values accordingly (basically do the 3D transform-origin part manually)

      if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
        var angle = parseFloat(rotationY) * _DEG2RAD$1,
          a13 = Math.sin(angle),
          a33 = Math.cos(angle),
          cos;
        angle = parseFloat(rotationX) * _DEG2RAD$1;
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
      target.style[_transformProp$1] = transforms || "translate(0, 0)";
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
        //for performance reasons, we combine all skewing into the skewX and rotation values. Remember, a skewY of 10 degrees looks the same as a rotation of 10 degrees plus a skewX of 10 degrees.
        skewY = parseFloat(skewY);
        skewX += skewY;
        rotation += skewY;
      }
      if (rotation || skewX) {
        rotation *= _DEG2RAD$1;
        skewX *= _DEG2RAD$1;
        a11 = Math.cos(rotation) * scaleX;
        a21 = Math.sin(rotation) * scaleX;
        a12 = Math.sin(rotation - skewX) * -scaleY;
        a22 = Math.cos(rotation - skewX) * scaleY;
        if (skewX) {
          skewY *= _DEG2RAD$1;
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
        a11 = _round$2(a11);
        a21 = _round$2(a21);
        a12 = _round$2(a12);
        a22 = _round$2(a22);
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
        tx = _round$2(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
        ty = _round$2(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
      }
      if (xPercent || yPercent) {
        //The SVG spec doesn't support percentage-based translation in the "transform" attribute, so we merge it into the translation to simulate it.
        temp = target.getBBox();
        tx = _round$2(tx + xPercent / 100 * temp.width);
        ty = _round$2(ty + yPercent / 100 * temp.height);
      }
      temp = "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")";
      target.setAttribute("transform", temp);
      forceCSS && (target.style[_transformProp$1] = temp); //some browsers prioritize CSS transforms over the transform attribute. When we sense that the user has CSS transforms applied, we must overwrite them this way (otherwise some browser simply won't render the transform attribute changes!)
    },
    _addRotationalPropTween = function _addRotationalPropTween(plugin, target, property, startNum, endValue) {
      var cap = 360,
        isString = _isString$2(endValue),
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
      // Internet Explorer doesn't have Object.assign(), so we recreate it here.
      for (var p in source) {
        target[p] = source[p];
      }
      return target;
    },
    _addRawTransformPTs = function _addRawTransformPTs(plugin, transforms, target) {
      //for handling cases where someone passes in a whole transform string, like transform: "scale(2, 3) rotate(20deg) translateY(30em)"
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
        style[_transformProp$1] = transforms;
        endCache = _parseTransform(target, 1);
        _removeProperty(target, _transformProp$1);
        target.setAttribute("transform", startValue);
      } else {
        startValue = getComputedStyle(target)[_transformProp$1];
        style[_transformProp$1] = transforms;
        endCache = _parseTransform(target, 1);
        style[_transformProp$1] = startValue;
      }
      for (p in _transformProps) {
        startValue = startCache[p];
        endValue = endCache[p];
        if (startValue !== endValue && exclude.indexOf(p) < 0) {
          //tweening to no perspective gives very unintuitive results - just keep the same perspective in that case.
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
    }; // handle splitting apart padding, margin, borderWidth, and borderRadius into their 4 components. Firefox, for example, won't report borderRadius correctly - it will only do borderTopLeftRadius and the other corners. We also want to handle paddingTop, marginLeft, borderRightWidth, etc.

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
        // getter, passed target, property, and unit (from _get())
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
    register: _initCore$3,
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
        hasPriority,
        inlineProps;
      _pluginInitted || _initCore$3(); // we may call init() multiple times on the same plugin instance, like when adding special properties, so make sure we don't overwrite the revert data or inlineProps

      this.styles = this.styles || _getStyleSaver(target);
      inlineProps = this.styles.props;
      this.tween = tween;
      for (p in vars) {
        if (p === "autoRound") {
          continue;
        }
        endValue = vars[p];
        if (_plugins[p] && _checkPlugin(p, vars, tween, index, target, targets)) {
          // plugins
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
          //CSS variable
          startValue = (getComputedStyle(target).getPropertyValue(p) + "").trim();
          endValue += "";
          _colorExp.lastIndex = 0;
          if (!_colorExp.test(startValue)) {
            // colors don't have units
            startUnit = getUnit(startValue);
            endUnit = getUnit(endValue);
          }
          endUnit ? startUnit !== endUnit && (startValue = _convertToUnit(target, p, startValue, endUnit) + endUnit) : startUnit && (endValue += startUnit);
          this.add(style, "setProperty", startValue, endValue, index, targets, 0, 0, p);
          props.push(p);
          inlineProps.push(p, 0, style[p]);
        } else if (type !== "undefined") {
          if (startAt && p in startAt) {
            // in case someone hard-codes a complex value as the start, like top: "calc(2vh / 2)". Without this, it'd use the computed value (always in px)
            startValue = typeof startAt[p] === "function" ? startAt[p].call(tween, index, target, targets) : startAt[p];
            _isString$2(startValue) && ~startValue.indexOf("random(") && (startValue = _replaceRandom(startValue));
            getUnit(startValue + "") || startValue === "auto" || (startValue += _config.units[p] || getUnit(_get(target, p)) || ""); // for cases when someone passes in a unitless value like {x: 100}; if we try setting translate(100, 0px) it won't work.

            (startValue + "").charAt(1) === "=" && (startValue = _get(target, p)); // can't work with relative values
          } else {
            startValue = _get(target, p);
          }
          startNum = parseFloat(startValue);
          relative = type === "string" && endValue.charAt(1) === "=" && endValue.substr(0, 2);
          relative && (endValue = endValue.substr(2));
          endNum = parseFloat(endValue);
          if (p in _propertyAliases) {
            if (p === "autoAlpha") {
              //special case where we control the visibility along with opacity. We still allow the opacity value to pass through and get tweened.
              if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) {
                //if visibility is initially set to "hidden", we should interpret that as intent to make opacity 0 (a convenience)
                startNum = 0;
              }
              inlineProps.push("visibility", 0, style.visibility);
              _addNonTweeningPT(this, style, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum);
            }
            if (p !== "scale" && p !== "transform") {
              p = _propertyAliases[p];
              ~p.indexOf(",") && (p = p.split(",")[0]);
            }
          }
          isTransformRelated = p in _transformProps; //--- TRANSFORM-RELATED ---

          if (isTransformRelated) {
            this.styles.save(p);
            if (!transformPropTween) {
              cache = target._gsap;
              cache.renderTransform && !vars.parseTransform || _parseTransform(target, vars.parseTransform); // if, for example, gsap.set(... {transform:"translateX(50vw)"}), the _get() call doesn't parse the transform, thus cache.renderTransform won't be set yet so force the parsing of the transform here.

              smooth = vars.smoothOrigin !== false && cache.smooth;
              transformPropTween = this._pt = new PropTween(this._pt, style, _transformProp$1, 0, 1, cache.renderTransform, cache, 0, -1); //the first time through, create the rendering PropTween so that it runs LAST (in the linked list, we keep adding to the beginning)

              transformPropTween.dep = 1; //flag it as dependent so that if things get killed/overwritten and this is the only PropTween left, we can safely kill the whole tween.
            }

            if (p === "scale") {
              this._pt = new PropTween(this._pt, cache, "scaleY", cache.scaleY, (relative ? _parseRelative(cache.scaleY, relative + endNum) : endNum) - cache.scaleY || 0, _renderCSSProp);
              this._pt.u = 0;
              props.push("scaleY", p);
              p += "X";
            } else if (p === "transformOrigin") {
              inlineProps.push(_transformOriginProp, 0, style[_transformOriginProp]);
              endValue = _convertKeywordsToPercentages(endValue); //in case something like "left top" or "bottom right" is passed in. Convert to percentages.

              if (cache.svg) {
                _applySVGOrigin(target, endValue, 0, smooth, 0, this);
              } else {
                endUnit = parseFloat(endValue.split(" ")[2]) || 0; //handle the zOrigin separately!

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
            endNum || (endNum = 0); // protect against NaN

            endUnit = getUnit(endValue) || (p in _config.units ? _config.units[p] : startUnit);
            startUnit !== endUnit && (startNum = _convertToUnit(target, p, startValue, endUnit));
            this._pt = new PropTween(this._pt, isTransformRelated ? cache : style, p, startNum, (relative ? _parseRelative(startNum, relative + endNum) : endNum) - startNum, !isTransformRelated && (endUnit === "px" || p === "zIndex") && vars.autoRound !== false ? _renderRoundedCSSProp : _renderCSSProp);
            this._pt.u = endUnit || 0;
            if (startUnit !== endUnit && endUnit !== "%") {
              //when the tween goes all the way back to the beginning, we need to revert it to the OLD/ORIGINAL value (with those units). We record that as a "b" (beginning) property and point to a render method that handles that. (performance optimization)
              this._pt.b = startValue;
              this._pt.r = _renderCSSPropWithBeginning;
            }
          } else if (!(p in style)) {
            if (p in target) {
              //maybe it's not a style - it could be a property added directly to an element in which case we'll try to animate that.
              this.add(target, p, startValue || target[p], relative ? relative + endValue : endValue, index, targets);
            } else if (p !== "parseTransform") {
              _missingPlugin(p, endValue);
              continue;
            }
          } else {
            _tweenComplexCSSString.call(this, target, p, startValue, relative ? relative + endValue : endValue);
          }
          isTransformRelated || (p in style ? inlineProps.push(p, 0, style[p]) : inlineProps.push(p, 1, startValue || target[p]));
          props.push(p);
        }
      }
      hasPriority && _sortPropTweensByPriority(this);
    },
    render: function render(ratio, data) {
      if (data.tween._time || !_reverting()) {
        var pt = data._pt;
        while (pt) {
          pt.r(ratio, pt.d);
          pt = pt._next;
        }
      } else {
        data.styles.revert();
      }
    },
    get: _get,
    aliases: _propertyAliases,
    getSetter: function getSetter(target, property, plugin) {
      //returns a setter function that accepts target, property, value and applies it accordingly. Remember, properties like "x" aren't as simple as target.style.property = value because they've got to be applied to a proxy object and then merged into a transform string in a renderer.
      var p = _propertyAliases[property];
      p && p.indexOf(",") < 0 && (property = p);
      return property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, "x")) ? plugin && _recentSetterPlugin === plugin ? property === "scale" ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !_isUndefined(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : _getSetter(target, property);
    },
    core: {
      _removeProperty: _removeProperty,
      _getMatrix: _getMatrix
    }
  };
  gsap$4.utils.checkPrefix = _checkPropPrefix;
  gsap$4.core.getStyleSaver = _getStyleSaver;
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
  gsap$4.registerPlugin(CSSPlugin);

  var gsapWithCSS = gsap$4.registerPlugin(CSSPlugin) || gsap$4;
    // to protect from tree shaking
    gsapWithCSS.core.Tween;

  function _defineProperties$1(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass$1(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$1(Constructor, staticProps);
    return Constructor;
  }

  /*!
   * Observer 3.12.5
   * https://gsap.com
   *
   * @license Copyright 2008-2024, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license or for
   * Club GSAP members, the agreement issued with that membership.
   * @author: Jack Doyle, jack@greensock.com
  */

  /* eslint-disable */
  var gsap$3,
    _coreInitted$3,
    _win$2,
    _doc$2,
    _docEl$1,
    _body$1,
    _isTouch,
    _pointerType,
    ScrollTrigger$1,
    _root$1,
    _normalizer$1,
    _eventTypes,
    _context$2,
    _getGSAP$2 = function _getGSAP() {
      return gsap$3 || typeof window !== "undefined" && (gsap$3 = window.gsap) && gsap$3.registerPlugin && gsap$3;
    },
    _startup$1 = 1,
    _observers = [],
    _scrollers = [],
    _proxies = [],
    _getTime$1 = Date.now,
    _bridge = function _bridge(name, value) {
      return value;
    },
    _integrate = function _integrate() {
      var core = ScrollTrigger$1.core,
        data = core.bridge || {},
        scrollers = core._scrollers,
        proxies = core._proxies;
      scrollers.push.apply(scrollers, _scrollers);
      proxies.push.apply(proxies, _proxies);
      _scrollers = scrollers;
      _proxies = proxies;
      _bridge = function _bridge(name, value) {
        return data[name](value);
      };
    },
    _getProxyProp = function _getProxyProp(element, property) {
      return ~_proxies.indexOf(element) && _proxies[_proxies.indexOf(element) + 1][property];
    },
    _isViewport$1 = function _isViewport(el) {
      return !!~_root$1.indexOf(el);
    },
    _addListener$1 = function _addListener(element, type, func, passive, capture) {
      return element.addEventListener(type, func, {
        passive: passive !== false,
        capture: !!capture
      });
    },
    _removeListener$1 = function _removeListener(element, type, func, capture) {
      return element.removeEventListener(type, func, !!capture);
    },
    _scrollLeft = "scrollLeft",
    _scrollTop = "scrollTop",
    _onScroll$1 = function _onScroll() {
      return _normalizer$1 && _normalizer$1.isPressed || _scrollers.cache++;
    },
    _scrollCacheFunc = function _scrollCacheFunc(f, doNotCache) {
      var cachingFunc = function cachingFunc(value) {
        // since reading the scrollTop/scrollLeft/pageOffsetY/pageOffsetX can trigger a layout, this function allows us to cache the value so it only gets read fresh after a "scroll" event fires (or while we're refreshing because that can lengthen the page and alter the scroll position). when "soft" is true, that means don't actually set the scroll, but cache the new value instead (useful in ScrollSmoother)
        if (value || value === 0) {
          _startup$1 && (_win$2.history.scrollRestoration = "manual"); // otherwise the new position will get overwritten by the browser onload.

          var isNormalizing = _normalizer$1 && _normalizer$1.isPressed;
          value = cachingFunc.v = Math.round(value) || (_normalizer$1 && _normalizer$1.iOS ? 1 : 0); //TODO: iOS Bug: if you allow it to go to 0, Safari can start to report super strange (wildly inaccurate) touch positions!

          f(value);
          cachingFunc.cacheID = _scrollers.cache;
          isNormalizing && _bridge("ss", value); // set scroll (notify ScrollTrigger so it can dispatch a "scrollStart" event if necessary
        } else if (doNotCache || _scrollers.cache !== cachingFunc.cacheID || _bridge("ref")) {
          cachingFunc.cacheID = _scrollers.cache;
          cachingFunc.v = f();
        }
        return cachingFunc.v + cachingFunc.offset;
      };
      cachingFunc.offset = 0;
      return f && cachingFunc;
    },
    _horizontal = {
      s: _scrollLeft,
      p: "left",
      p2: "Left",
      os: "right",
      os2: "Right",
      d: "width",
      d2: "Width",
      a: "x",
      sc: _scrollCacheFunc(function (value) {
        return arguments.length ? _win$2.scrollTo(value, _vertical.sc()) : _win$2.pageXOffset || _doc$2[_scrollLeft] || _docEl$1[_scrollLeft] || _body$1[_scrollLeft] || 0;
      })
    },
    _vertical = {
      s: _scrollTop,
      p: "top",
      p2: "Top",
      os: "bottom",
      os2: "Bottom",
      d: "height",
      d2: "Height",
      a: "y",
      op: _horizontal,
      sc: _scrollCacheFunc(function (value) {
        return arguments.length ? _win$2.scrollTo(_horizontal.sc(), value) : _win$2.pageYOffset || _doc$2[_scrollTop] || _docEl$1[_scrollTop] || _body$1[_scrollTop] || 0;
      })
    },
    _getTarget = function _getTarget(t, self) {
      return (self && self._ctx && self._ctx.selector || gsap$3.utils.toArray)(t)[0] || (typeof t === "string" && gsap$3.config().nullTargetWarn !== false ? console.warn("Element not found:", t) : null);
    },
    _getScrollFunc = function _getScrollFunc(element, _ref) {
      var s = _ref.s,
        sc = _ref.sc;
      // we store the scroller functions in an alternating sequenced Array like [element, verticalScrollFunc, horizontalScrollFunc, ...] so that we can minimize memory, maximize performance, and we also record the last position as a ".rec" property in order to revert to that after refreshing to ensure things don't shift around.
      _isViewport$1(element) && (element = _doc$2.scrollingElement || _docEl$1);
      var i = _scrollers.indexOf(element),
        offset = sc === _vertical.sc ? 1 : 2;
      !~i && (i = _scrollers.push(element) - 1);
      _scrollers[i + offset] || _addListener$1(element, "scroll", _onScroll$1); // clear the cache when a scroll occurs

      var prev = _scrollers[i + offset],
        func = prev || (_scrollers[i + offset] = _scrollCacheFunc(_getProxyProp(element, s), true) || (_isViewport$1(element) ? sc : _scrollCacheFunc(function (value) {
          return arguments.length ? element[s] = value : element[s];
        })));
      func.target = element;
      prev || (func.smooth = gsap$3.getProperty(element, "scrollBehavior") === "smooth"); // only set it the first time (don't reset every time a scrollFunc is requested because perhaps it happens during a refresh() when it's disabled in ScrollTrigger.

      return func;
    },
    _getVelocityProp = function _getVelocityProp(value, minTimeRefresh, useDelta) {
      var v1 = value,
        v2 = value,
        t1 = _getTime$1(),
        t2 = t1,
        min = minTimeRefresh || 50,
        dropToZeroTime = Math.max(500, min * 3),
        update = function update(value, force) {
          var t = _getTime$1();
          if (force || t - t1 > min) {
            v2 = v1;
            v1 = value;
            t2 = t1;
            t1 = t;
          } else if (useDelta) {
            v1 += value;
          } else {
            // not totally necessary, but makes it a bit more accurate by adjusting the v1 value according to the new slope. This way we're not just ignoring the incoming data. Removing for now because it doesn't seem to make much practical difference and it's probably not worth the kb.
            v1 = v2 + (value - v2) / (t - t2) * (t1 - t2);
          }
        },
        reset = function reset() {
          v2 = v1 = useDelta ? 0 : v1;
          t2 = t1 = 0;
        },
        getVelocity = function getVelocity(latestValue) {
          var tOld = t2,
            vOld = v2,
            t = _getTime$1();
          (latestValue || latestValue === 0) && latestValue !== v1 && update(latestValue);
          return t1 === t2 || t - t2 > dropToZeroTime ? 0 : (v1 + (useDelta ? vOld : -vOld)) / ((useDelta ? t : t1) - tOld) * 1000;
        };
      return {
        update: update,
        reset: reset,
        getVelocity: getVelocity
      };
    },
    _getEvent = function _getEvent(e, preventDefault) {
      preventDefault && !e._gsapAllow && e.preventDefault();
      return e.changedTouches ? e.changedTouches[0] : e;
    },
    _getAbsoluteMax = function _getAbsoluteMax(a) {
      var max = Math.max.apply(Math, a),
        min = Math.min.apply(Math, a);
      return Math.abs(max) >= Math.abs(min) ? max : min;
    },
    _setScrollTrigger = function _setScrollTrigger() {
      ScrollTrigger$1 = gsap$3.core.globals().ScrollTrigger;
      ScrollTrigger$1 && ScrollTrigger$1.core && _integrate();
    },
    _initCore$2 = function _initCore(core) {
      gsap$3 = core || _getGSAP$2();
      if (!_coreInitted$3 && gsap$3 && typeof document !== "undefined" && document.body) {
        _win$2 = window;
        _doc$2 = document;
        _docEl$1 = _doc$2.documentElement;
        _body$1 = _doc$2.body;
        _root$1 = [_win$2, _doc$2, _docEl$1, _body$1];
        gsap$3.utils.clamp;
        _context$2 = gsap$3.core.context || function () {};
        _pointerType = "onpointerenter" in _body$1 ? "pointer" : "mouse"; // isTouch is 0 if no touch, 1 if ONLY touch, and 2 if it can accommodate touch but also other types like mouse/pointer.

        _isTouch = Observer.isTouch = _win$2.matchMedia && _win$2.matchMedia("(hover: none), (pointer: coarse)").matches ? 1 : "ontouchstart" in _win$2 || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? 2 : 0;
        _eventTypes = Observer.eventTypes = ("ontouchstart" in _docEl$1 ? "touchstart,touchmove,touchcancel,touchend" : !("onpointerdown" in _docEl$1) ? "mousedown,mousemove,mouseup,mouseup" : "pointerdown,pointermove,pointercancel,pointerup").split(",");
        setTimeout(function () {
          return _startup$1 = 0;
        }, 500);
        _setScrollTrigger();
        _coreInitted$3 = 1;
      }
      return _coreInitted$3;
    };
  _horizontal.op = _vertical;
  _scrollers.cache = 0;
  var Observer = /*#__PURE__*/function () {
    function Observer(vars) {
      this.init(vars);
    }
    var _proto = Observer.prototype;
    _proto.init = function init(vars) {
      _coreInitted$3 || _initCore$2(gsap$3) || console.warn("Please gsap.registerPlugin(Observer)");
      ScrollTrigger$1 || _setScrollTrigger();
      var tolerance = vars.tolerance,
        dragMinimum = vars.dragMinimum,
        type = vars.type,
        target = vars.target,
        lineHeight = vars.lineHeight,
        debounce = vars.debounce,
        preventDefault = vars.preventDefault,
        onStop = vars.onStop,
        onStopDelay = vars.onStopDelay,
        ignore = vars.ignore,
        wheelSpeed = vars.wheelSpeed,
        event = vars.event,
        onDragStart = vars.onDragStart,
        onDragEnd = vars.onDragEnd,
        onDrag = vars.onDrag,
        onPress = vars.onPress,
        onRelease = vars.onRelease,
        onRight = vars.onRight,
        onLeft = vars.onLeft,
        onUp = vars.onUp,
        onDown = vars.onDown,
        onChangeX = vars.onChangeX,
        onChangeY = vars.onChangeY,
        onChange = vars.onChange,
        onToggleX = vars.onToggleX,
        onToggleY = vars.onToggleY,
        onHover = vars.onHover,
        onHoverEnd = vars.onHoverEnd,
        onMove = vars.onMove,
        ignoreCheck = vars.ignoreCheck,
        isNormalizer = vars.isNormalizer,
        onGestureStart = vars.onGestureStart,
        onGestureEnd = vars.onGestureEnd,
        onWheel = vars.onWheel,
        onEnable = vars.onEnable,
        onDisable = vars.onDisable,
        onClick = vars.onClick,
        scrollSpeed = vars.scrollSpeed,
        capture = vars.capture,
        allowClicks = vars.allowClicks,
        lockAxis = vars.lockAxis,
        onLockAxis = vars.onLockAxis;
      this.target = target = _getTarget(target) || _docEl$1;
      this.vars = vars;
      ignore && (ignore = gsap$3.utils.toArray(ignore));
      tolerance = tolerance || 1e-9;
      dragMinimum = dragMinimum || 0;
      wheelSpeed = wheelSpeed || 1;
      scrollSpeed = scrollSpeed || 1;
      type = type || "wheel,touch,pointer";
      debounce = debounce !== false;
      lineHeight || (lineHeight = parseFloat(_win$2.getComputedStyle(_body$1).lineHeight) || 22); // note: browser may report "normal", so default to 22.

      var id,
        onStopDelayedCall,
        dragged,
        moved,
        wheeled,
        locked,
        axis,
        self = this,
        prevDeltaX = 0,
        prevDeltaY = 0,
        passive = vars.passive || !preventDefault,
        scrollFuncX = _getScrollFunc(target, _horizontal),
        scrollFuncY = _getScrollFunc(target, _vertical),
        scrollX = scrollFuncX(),
        scrollY = scrollFuncY(),
        limitToTouch = ~type.indexOf("touch") && !~type.indexOf("pointer") && _eventTypes[0] === "pointerdown",
        // for devices that accommodate mouse events and touch events, we need to distinguish.
        isViewport = _isViewport$1(target),
        ownerDoc = target.ownerDocument || _doc$2,
        deltaX = [0, 0, 0],
        // wheel, scroll, pointer/touch
        deltaY = [0, 0, 0],
        onClickTime = 0,
        clickCapture = function clickCapture() {
          return onClickTime = _getTime$1();
        },
        _ignoreCheck = function _ignoreCheck(e, isPointerOrTouch) {
          return (self.event = e) && ignore && ~ignore.indexOf(e.target) || isPointerOrTouch && limitToTouch && e.pointerType !== "touch" || ignoreCheck && ignoreCheck(e, isPointerOrTouch);
        },
        onStopFunc = function onStopFunc() {
          self._vx.reset();
          self._vy.reset();
          onStopDelayedCall.pause();
          onStop && onStop(self);
        },
        update = function update() {
          var dx = self.deltaX = _getAbsoluteMax(deltaX),
            dy = self.deltaY = _getAbsoluteMax(deltaY),
            changedX = Math.abs(dx) >= tolerance,
            changedY = Math.abs(dy) >= tolerance;
          onChange && (changedX || changedY) && onChange(self, dx, dy, deltaX, deltaY); // in ScrollTrigger.normalizeScroll(), we need to know if it was touch/pointer so we need access to the deltaX/deltaY Arrays before we clear them out.

          if (changedX) {
            onRight && self.deltaX > 0 && onRight(self);
            onLeft && self.deltaX < 0 && onLeft(self);
            onChangeX && onChangeX(self);
            onToggleX && self.deltaX < 0 !== prevDeltaX < 0 && onToggleX(self);
            prevDeltaX = self.deltaX;
            deltaX[0] = deltaX[1] = deltaX[2] = 0;
          }
          if (changedY) {
            onDown && self.deltaY > 0 && onDown(self);
            onUp && self.deltaY < 0 && onUp(self);
            onChangeY && onChangeY(self);
            onToggleY && self.deltaY < 0 !== prevDeltaY < 0 && onToggleY(self);
            prevDeltaY = self.deltaY;
            deltaY[0] = deltaY[1] = deltaY[2] = 0;
          }
          if (moved || dragged) {
            onMove && onMove(self);
            if (dragged) {
              onDrag(self);
              dragged = false;
            }
            moved = false;
          }
          locked && !(locked = false) && onLockAxis && onLockAxis(self);
          if (wheeled) {
            onWheel(self);
            wheeled = false;
          }
          id = 0;
        },
        onDelta = function onDelta(x, y, index) {
          deltaX[index] += x;
          deltaY[index] += y;
          self._vx.update(x);
          self._vy.update(y);
          debounce ? id || (id = requestAnimationFrame(update)) : update();
        },
        onTouchOrPointerDelta = function onTouchOrPointerDelta(x, y) {
          if (lockAxis && !axis) {
            self.axis = axis = Math.abs(x) > Math.abs(y) ? "x" : "y";
            locked = true;
          }
          if (axis !== "y") {
            deltaX[2] += x;
            self._vx.update(x, true); // update the velocity as frequently as possible instead of in the debounced function so that very quick touch-scrolls (flicks) feel natural. If it's the mouse/touch/pointer, force it so that we get snappy/accurate momentum scroll.
          }

          if (axis !== "x") {
            deltaY[2] += y;
            self._vy.update(y, true);
          }
          debounce ? id || (id = requestAnimationFrame(update)) : update();
        },
        _onDrag = function _onDrag(e) {
          if (_ignoreCheck(e, 1)) {
            return;
          }
          e = _getEvent(e, preventDefault);
          var x = e.clientX,
            y = e.clientY,
            dx = x - self.x,
            dy = y - self.y,
            isDragging = self.isDragging;
          self.x = x;
          self.y = y;
          if (isDragging || Math.abs(self.startX - x) >= dragMinimum || Math.abs(self.startY - y) >= dragMinimum) {
            onDrag && (dragged = true);
            isDragging || (self.isDragging = true);
            onTouchOrPointerDelta(dx, dy);
            isDragging || onDragStart && onDragStart(self);
          }
        },
        _onPress = self.onPress = function (e) {
          if (_ignoreCheck(e, 1) || e && e.button) {
            return;
          }
          self.axis = axis = null;
          onStopDelayedCall.pause();
          self.isPressed = true;
          e = _getEvent(e); // note: may need to preventDefault(?) Won't side-scroll on iOS Safari if we do, though.

          prevDeltaX = prevDeltaY = 0;
          self.startX = self.x = e.clientX;
          self.startY = self.y = e.clientY;
          self._vx.reset(); // otherwise the t2 may be stale if the user touches and flicks super fast and releases in less than 2 requestAnimationFrame ticks, causing velocity to be 0.

          self._vy.reset();
          _addListener$1(isNormalizer ? target : ownerDoc, _eventTypes[1], _onDrag, passive, true);
          self.deltaX = self.deltaY = 0;
          onPress && onPress(self);
        },
        _onRelease = self.onRelease = function (e) {
          if (_ignoreCheck(e, 1)) {
            return;
          }
          _removeListener$1(isNormalizer ? target : ownerDoc, _eventTypes[1], _onDrag, true);
          var isTrackingDrag = !isNaN(self.y - self.startY),
            wasDragging = self.isDragging,
            isDragNotClick = wasDragging && (Math.abs(self.x - self.startX) > 3 || Math.abs(self.y - self.startY) > 3),
            // some touch devices need some wiggle room in terms of sensing clicks - the finger may move a few pixels.
            eventData = _getEvent(e);
          if (!isDragNotClick && isTrackingDrag) {
            self._vx.reset();
            self._vy.reset(); //if (preventDefault && allowClicks && self.isPressed) { // check isPressed because in a rare edge case, the inputObserver in ScrollTrigger may stopPropagation() on the press/drag, so the onRelease may get fired without the onPress/onDrag ever getting called, thus it could trigger a click to occur on a link after scroll-dragging it.

            if (preventDefault && allowClicks) {
              gsap$3.delayedCall(0.08, function () {
                // some browsers (like Firefox) won't trust script-generated clicks, so if the user tries to click on a video to play it, for example, it simply won't work. Since a regular "click" event will most likely be generated anyway (one that has its isTrusted flag set to true), we must slightly delay our script-generated click so that the "real"/trusted one is prioritized. Remember, when there are duplicate events in quick succession, we suppress all but the first one. Some browsers don't even trigger the "real" one at all, so our synthetic one is a safety valve that ensures that no matter what, a click event does get dispatched.
                if (_getTime$1() - onClickTime > 300 && !e.defaultPrevented) {
                  if (e.target.click) {
                    //some browsers (like mobile Safari) don't properly trigger the click event
                    e.target.click();
                  } else if (ownerDoc.createEvent) {
                    var syntheticEvent = ownerDoc.createEvent("MouseEvents");
                    syntheticEvent.initMouseEvent("click", true, true, _win$2, 1, eventData.screenX, eventData.screenY, eventData.clientX, eventData.clientY, false, false, false, false, 0, null);
                    e.target.dispatchEvent(syntheticEvent);
                  }
                }
              });
            }
          }
          self.isDragging = self.isGesturing = self.isPressed = false;
          onStop && wasDragging && !isNormalizer && onStopDelayedCall.restart(true);
          onDragEnd && wasDragging && onDragEnd(self);
          onRelease && onRelease(self, isDragNotClick);
        },
        _onGestureStart = function _onGestureStart(e) {
          return e.touches && e.touches.length > 1 && (self.isGesturing = true) && onGestureStart(e, self.isDragging);
        },
        _onGestureEnd = function _onGestureEnd() {
          return (self.isGesturing = false) || onGestureEnd(self);
        },
        onScroll = function onScroll(e) {
          if (_ignoreCheck(e)) {
            return;
          }
          var x = scrollFuncX(),
            y = scrollFuncY();
          onDelta((x - scrollX) * scrollSpeed, (y - scrollY) * scrollSpeed, 1);
          scrollX = x;
          scrollY = y;
          onStop && onStopDelayedCall.restart(true);
        },
        _onWheel = function _onWheel(e) {
          if (_ignoreCheck(e)) {
            return;
          }
          e = _getEvent(e, preventDefault);
          onWheel && (wheeled = true);
          var multiplier = (e.deltaMode === 1 ? lineHeight : e.deltaMode === 2 ? _win$2.innerHeight : 1) * wheelSpeed;
          onDelta(e.deltaX * multiplier, e.deltaY * multiplier, 0);
          onStop && !isNormalizer && onStopDelayedCall.restart(true);
        },
        _onMove = function _onMove(e) {
          if (_ignoreCheck(e)) {
            return;
          }
          var x = e.clientX,
            y = e.clientY,
            dx = x - self.x,
            dy = y - self.y;
          self.x = x;
          self.y = y;
          moved = true;
          onStop && onStopDelayedCall.restart(true);
          (dx || dy) && onTouchOrPointerDelta(dx, dy);
        },
        _onHover = function _onHover(e) {
          self.event = e;
          onHover(self);
        },
        _onHoverEnd = function _onHoverEnd(e) {
          self.event = e;
          onHoverEnd(self);
        },
        _onClick = function _onClick(e) {
          return _ignoreCheck(e) || _getEvent(e, preventDefault) && onClick(self);
        };
      onStopDelayedCall = self._dc = gsap$3.delayedCall(onStopDelay || 0.25, onStopFunc).pause();
      self.deltaX = self.deltaY = 0;
      self._vx = _getVelocityProp(0, 50, true);
      self._vy = _getVelocityProp(0, 50, true);
      self.scrollX = scrollFuncX;
      self.scrollY = scrollFuncY;
      self.isDragging = self.isGesturing = self.isPressed = false;
      _context$2(this);
      self.enable = function (e) {
        if (!self.isEnabled) {
          _addListener$1(isViewport ? ownerDoc : target, "scroll", _onScroll$1);
          type.indexOf("scroll") >= 0 && _addListener$1(isViewport ? ownerDoc : target, "scroll", onScroll, passive, capture);
          type.indexOf("wheel") >= 0 && _addListener$1(target, "wheel", _onWheel, passive, capture);
          if (type.indexOf("touch") >= 0 && _isTouch || type.indexOf("pointer") >= 0) {
            _addListener$1(target, _eventTypes[0], _onPress, passive, capture);
            _addListener$1(ownerDoc, _eventTypes[2], _onRelease);
            _addListener$1(ownerDoc, _eventTypes[3], _onRelease);
            allowClicks && _addListener$1(target, "click", clickCapture, true, true);
            onClick && _addListener$1(target, "click", _onClick);
            onGestureStart && _addListener$1(ownerDoc, "gesturestart", _onGestureStart);
            onGestureEnd && _addListener$1(ownerDoc, "gestureend", _onGestureEnd);
            onHover && _addListener$1(target, _pointerType + "enter", _onHover);
            onHoverEnd && _addListener$1(target, _pointerType + "leave", _onHoverEnd);
            onMove && _addListener$1(target, _pointerType + "move", _onMove);
          }
          self.isEnabled = true;
          e && e.type && _onPress(e);
          onEnable && onEnable(self);
        }
        return self;
      };
      self.disable = function () {
        if (self.isEnabled) {
          // only remove the _onScroll listener if there aren't any others that rely on the functionality.
          _observers.filter(function (o) {
            return o !== self && _isViewport$1(o.target);
          }).length || _removeListener$1(isViewport ? ownerDoc : target, "scroll", _onScroll$1);
          if (self.isPressed) {
            self._vx.reset();
            self._vy.reset();
            _removeListener$1(isNormalizer ? target : ownerDoc, _eventTypes[1], _onDrag, true);
          }
          _removeListener$1(isViewport ? ownerDoc : target, "scroll", onScroll, capture);
          _removeListener$1(target, "wheel", _onWheel, capture);
          _removeListener$1(target, _eventTypes[0], _onPress, capture);
          _removeListener$1(ownerDoc, _eventTypes[2], _onRelease);
          _removeListener$1(ownerDoc, _eventTypes[3], _onRelease);
          _removeListener$1(target, "click", clickCapture, true);
          _removeListener$1(target, "click", _onClick);
          _removeListener$1(ownerDoc, "gesturestart", _onGestureStart);
          _removeListener$1(ownerDoc, "gestureend", _onGestureEnd);
          _removeListener$1(target, _pointerType + "enter", _onHover);
          _removeListener$1(target, _pointerType + "leave", _onHoverEnd);
          _removeListener$1(target, _pointerType + "move", _onMove);
          self.isEnabled = self.isPressed = self.isDragging = false;
          onDisable && onDisable(self);
        }
      };
      self.kill = self.revert = function () {
        self.disable();
        var i = _observers.indexOf(self);
        i >= 0 && _observers.splice(i, 1);
        _normalizer$1 === self && (_normalizer$1 = 0);
      };
      _observers.push(self);
      isNormalizer && _isViewport$1(target) && (_normalizer$1 = self);
      self.enable(event);
    };
    _createClass$1(Observer, [{
      key: "velocityX",
      get: function get() {
        return this._vx.getVelocity();
      }
    }, {
      key: "velocityY",
      get: function get() {
        return this._vy.getVelocity();
      }
    }]);
    return Observer;
  }();
  Observer.version = "3.12.5";
  Observer.create = function (vars) {
    return new Observer(vars);
  };
  Observer.register = _initCore$2;
  Observer.getAll = function () {
    return _observers.slice();
  };
  Observer.getById = function (id) {
    return _observers.filter(function (o) {
      return o.vars.id === id;
    })[0];
  };
  _getGSAP$2() && gsap$3.registerPlugin(Observer);

  /*!
   * ScrollTrigger 3.12.5
   * https://gsap.com
   *
   * @license Copyright 2008-2024, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license or for
   * Club GSAP members, the agreement issued with that membership.
   * @author: Jack Doyle, jack@greensock.com
  */
  var gsap$2,
    _coreInitted$2,
    _win$1,
    _doc$1,
    _docEl,
    _body,
    _root,
    _resizeDelay,
    _toArray$2,
    _clamp,
    _time2,
    _syncInterval,
    _refreshing,
    _pointerIsDown,
    _transformProp,
    _i,
    _prevWidth,
    _prevHeight,
    _autoRefresh,
    _sort,
    _suppressOverwrites,
    _ignoreResize,
    _normalizer,
    _ignoreMobileResize,
    _baseScreenHeight,
    _baseScreenWidth,
    _fixIOSBug,
    _context$1,
    _scrollRestoration,
    _div100vh,
    _100vh,
    _isReverted,
    _clampingMax,
    _limitCallbacks,
    // if true, we'll only trigger callbacks if the active state toggles, so if you scroll immediately past both the start and end positions of a ScrollTrigger (thus inactive to inactive), neither its onEnter nor onLeave will be called. This is useful during startup.
    _startup = 1,
    _getTime = Date.now,
    _time1 = _getTime(),
    _lastScrollTime = 0,
    _enabled = 0,
    _parseClamp = function _parseClamp(value, type, self) {
      var clamp = _isString$1(value) && (value.substr(0, 6) === "clamp(" || value.indexOf("max") > -1);
      self["_" + type + "Clamp"] = clamp;
      return clamp ? value.substr(6, value.length - 7) : value;
    },
    _keepClamp = function _keepClamp(value, clamp) {
      return clamp && (!_isString$1(value) || value.substr(0, 6) !== "clamp(") ? "clamp(" + value + ")" : value;
    },
    _rafBugFix = function _rafBugFix() {
      return _enabled && requestAnimationFrame(_rafBugFix);
    },
    // in some browsers (like Firefox), screen repaints weren't consistent unless we had SOMETHING queued up in requestAnimationFrame()! So this just creates a super simple loop to keep it alive and smooth out repaints.
    _pointerDownHandler = function _pointerDownHandler() {
      return _pointerIsDown = 1;
    },
    _pointerUpHandler = function _pointerUpHandler() {
      return _pointerIsDown = 0;
    },
    _passThrough = function _passThrough(v) {
      return v;
    },
    _round$1 = function _round(value) {
      return Math.round(value * 100000) / 100000 || 0;
    },
    _windowExists = function _windowExists() {
      return typeof window !== "undefined";
    },
    _getGSAP$1 = function _getGSAP() {
      return gsap$2 || _windowExists() && (gsap$2 = window.gsap) && gsap$2.registerPlugin && gsap$2;
    },
    _isViewport = function _isViewport(e) {
      return !!~_root.indexOf(e);
    },
    _getViewportDimension = function _getViewportDimension(dimensionProperty) {
      return (dimensionProperty === "Height" ? _100vh : _win$1["inner" + dimensionProperty]) || _docEl["client" + dimensionProperty] || _body["client" + dimensionProperty];
    },
    _getBoundsFunc = function _getBoundsFunc(element) {
      return _getProxyProp(element, "getBoundingClientRect") || (_isViewport(element) ? function () {
        _winOffsets.width = _win$1.innerWidth;
        _winOffsets.height = _100vh;
        return _winOffsets;
      } : function () {
        return _getBounds(element);
      });
    },
    _getSizeFunc = function _getSizeFunc(scroller, isViewport, _ref) {
      var d = _ref.d,
        d2 = _ref.d2,
        a = _ref.a;
      return (a = _getProxyProp(scroller, "getBoundingClientRect")) ? function () {
        return a()[d];
      } : function () {
        return (isViewport ? _getViewportDimension(d2) : scroller["client" + d2]) || 0;
      };
    },
    _getOffsetsFunc = function _getOffsetsFunc(element, isViewport) {
      return !isViewport || ~_proxies.indexOf(element) ? _getBoundsFunc(element) : function () {
        return _winOffsets;
      };
    },
    _maxScroll = function _maxScroll(element, _ref2) {
      var s = _ref2.s,
        d2 = _ref2.d2,
        d = _ref2.d,
        a = _ref2.a;
      return Math.max(0, (s = "scroll" + d2) && (a = _getProxyProp(element, s)) ? a() - _getBoundsFunc(element)()[d] : _isViewport(element) ? (_docEl[s] || _body[s]) - _getViewportDimension(d2) : element[s] - element["offset" + d2]);
    },
    _iterateAutoRefresh = function _iterateAutoRefresh(func, events) {
      for (var i = 0; i < _autoRefresh.length; i += 3) {
        (!events || ~events.indexOf(_autoRefresh[i + 1])) && func(_autoRefresh[i], _autoRefresh[i + 1], _autoRefresh[i + 2]);
      }
    },
    _isString$1 = function _isString(value) {
      return typeof value === "string";
    },
    _isFunction$1 = function _isFunction(value) {
      return typeof value === "function";
    },
    _isNumber$1 = function _isNumber(value) {
      return typeof value === "number";
    },
    _isObject = function _isObject(value) {
      return typeof value === "object";
    },
    _endAnimation = function _endAnimation(animation, reversed, pause) {
      return animation && animation.progress(reversed ? 0 : 1) && pause && animation.pause();
    },
    _callback = function _callback(self, func) {
      if (self.enabled) {
        var result = self._ctx ? self._ctx.add(function () {
          return func(self);
        }) : func(self);
        result && result.totalTime && (self.callbackAnimation = result);
      }
    },
    _abs$1 = Math.abs,
    _left = "left",
    _top = "top",
    _right = "right",
    _bottom = "bottom",
    _width = "width",
    _height = "height",
    _Right = "Right",
    _Left = "Left",
    _Top = "Top",
    _Bottom = "Bottom",
    _padding = "padding",
    _margin = "margin",
    _Width = "Width",
    _Height = "Height",
    _px = "px",
    _getComputedStyle$1 = function _getComputedStyle(element) {
      return _win$1.getComputedStyle(element);
    },
    _makePositionable = function _makePositionable(element) {
      // if the element already has position: absolute or fixed, leave that, otherwise make it position: relative
      var position = _getComputedStyle$1(element).position;
      element.style.position = position === "absolute" || position === "fixed" ? position : "relative";
    },
    _setDefaults = function _setDefaults(obj, defaults) {
      for (var p in defaults) {
        p in obj || (obj[p] = defaults[p]);
      }
      return obj;
    },
    _getBounds = function _getBounds(element, withoutTransforms) {
      var tween = withoutTransforms && _getComputedStyle$1(element)[_transformProp] !== "matrix(1, 0, 0, 1, 0, 0)" && gsap$2.to(element, {
          x: 0,
          y: 0,
          xPercent: 0,
          yPercent: 0,
          rotation: 0,
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          skewX: 0,
          skewY: 0
        }).progress(1),
        bounds = element.getBoundingClientRect();
      tween && tween.progress(0).kill();
      return bounds;
    },
    _getSize$1 = function _getSize(element, _ref3) {
      var d2 = _ref3.d2;
      return element["offset" + d2] || element["client" + d2] || 0;
    },
    _getLabelRatioArray = function _getLabelRatioArray(timeline) {
      var a = [],
        labels = timeline.labels,
        duration = timeline.duration(),
        p;
      for (p in labels) {
        a.push(labels[p] / duration);
      }
      return a;
    },
    _getClosestLabel = function _getClosestLabel(animation) {
      return function (value) {
        return gsap$2.utils.snap(_getLabelRatioArray(animation), value);
      };
    },
    _snapDirectional = function _snapDirectional(snapIncrementOrArray) {
      var snap = gsap$2.utils.snap(snapIncrementOrArray),
        a = Array.isArray(snapIncrementOrArray) && snapIncrementOrArray.slice(0).sort(function (a, b) {
          return a - b;
        });
      return a ? function (value, direction, threshold) {
        if (threshold === void 0) {
          threshold = 1e-3;
        }
        var i;
        if (!direction) {
          return snap(value);
        }
        if (direction > 0) {
          value -= threshold; // to avoid rounding errors. If we're too strict, it might snap forward, then immediately again, and again.

          for (i = 0; i < a.length; i++) {
            if (a[i] >= value) {
              return a[i];
            }
          }
          return a[i - 1];
        } else {
          i = a.length;
          value += threshold;
          while (i--) {
            if (a[i] <= value) {
              return a[i];
            }
          }
        }
        return a[0];
      } : function (value, direction, threshold) {
        if (threshold === void 0) {
          threshold = 1e-3;
        }
        var snapped = snap(value);
        return !direction || Math.abs(snapped - value) < threshold || snapped - value < 0 === direction < 0 ? snapped : snap(direction < 0 ? value - snapIncrementOrArray : value + snapIncrementOrArray);
      };
    },
    _getLabelAtDirection = function _getLabelAtDirection(timeline) {
      return function (value, st) {
        return _snapDirectional(_getLabelRatioArray(timeline))(value, st.direction);
      };
    },
    _multiListener = function _multiListener(func, element, types, callback) {
      return types.split(",").forEach(function (type) {
        return func(element, type, callback);
      });
    },
    _addListener = function _addListener(element, type, func, nonPassive, capture) {
      return element.addEventListener(type, func, {
        passive: !nonPassive,
        capture: !!capture
      });
    },
    _removeListener = function _removeListener(element, type, func, capture) {
      return element.removeEventListener(type, func, !!capture);
    },
    _wheelListener = function _wheelListener(func, el, scrollFunc) {
      scrollFunc = scrollFunc && scrollFunc.wheelHandler;
      if (scrollFunc) {
        func(el, "wheel", scrollFunc);
        func(el, "touchmove", scrollFunc);
      }
    },
    _markerDefaults = {
      startColor: "green",
      endColor: "red",
      indent: 0,
      fontSize: "16px",
      fontWeight: "normal"
    },
    _defaults = {
      toggleActions: "play",
      anticipatePin: 0
    },
    _keywords = {
      top: 0,
      left: 0,
      center: 0.5,
      bottom: 1,
      right: 1
    },
    _offsetToPx = function _offsetToPx(value, size) {
      if (_isString$1(value)) {
        var eqIndex = value.indexOf("="),
          relative = ~eqIndex ? +(value.charAt(eqIndex - 1) + 1) * parseFloat(value.substr(eqIndex + 1)) : 0;
        if (~eqIndex) {
          value.indexOf("%") > eqIndex && (relative *= size / 100);
          value = value.substr(0, eqIndex - 1);
        }
        value = relative + (value in _keywords ? _keywords[value] * size : ~value.indexOf("%") ? parseFloat(value) * size / 100 : parseFloat(value) || 0);
      }
      return value;
    },
    _createMarker = function _createMarker(type, name, container, direction, _ref4, offset, matchWidthEl, containerAnimation) {
      var startColor = _ref4.startColor,
        endColor = _ref4.endColor,
        fontSize = _ref4.fontSize,
        indent = _ref4.indent,
        fontWeight = _ref4.fontWeight;
      var e = _doc$1.createElement("div"),
        useFixedPosition = _isViewport(container) || _getProxyProp(container, "pinType") === "fixed",
        isScroller = type.indexOf("scroller") !== -1,
        parent = useFixedPosition ? _body : container,
        isStart = type.indexOf("start") !== -1,
        color = isStart ? startColor : endColor,
        css = "border-color:" + color + ";font-size:" + fontSize + ";color:" + color + ";font-weight:" + fontWeight + ";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";
      css += "position:" + ((isScroller || containerAnimation) && useFixedPosition ? "fixed;" : "absolute;");
      (isScroller || containerAnimation || !useFixedPosition) && (css += (direction === _vertical ? _right : _bottom) + ":" + (offset + parseFloat(indent)) + "px;");
      matchWidthEl && (css += "box-sizing:border-box;text-align:left;width:" + matchWidthEl.offsetWidth + "px;");
      e._isStart = isStart;
      e.setAttribute("class", "gsap-marker-" + type + (name ? " marker-" + name : ""));
      e.style.cssText = css;
      e.innerText = name || name === 0 ? type + "-" + name : type;
      parent.children[0] ? parent.insertBefore(e, parent.children[0]) : parent.appendChild(e);
      e._offset = e["offset" + direction.op.d2];
      _positionMarker(e, 0, direction, isStart);
      return e;
    },
    _positionMarker = function _positionMarker(marker, start, direction, flipped) {
      var vars = {
          display: "block"
        },
        side = direction[flipped ? "os2" : "p2"],
        oppositeSide = direction[flipped ? "p2" : "os2"];
      marker._isFlipped = flipped;
      vars[direction.a + "Percent"] = flipped ? -100 : 0;
      vars[direction.a] = flipped ? "1px" : 0;
      vars["border" + side + _Width] = 1;
      vars["border" + oppositeSide + _Width] = 0;
      vars[direction.p] = start + "px";
      gsap$2.set(marker, vars);
    },
    _triggers = [],
    _ids = {},
    _rafID,
    _sync = function _sync() {
      return _getTime() - _lastScrollTime > 34 && (_rafID || (_rafID = requestAnimationFrame(_updateAll)));
    },
    _onScroll = function _onScroll() {
      // previously, we tried to optimize performance by batching/deferring to the next requestAnimationFrame(), but discovered that Safari has a few bugs that make this unworkable (especially on iOS). See https://codepen.io/GreenSock/pen/16c435b12ef09c38125204818e7b45fc?editors=0010 and https://codepen.io/GreenSock/pen/JjOxYpQ/3dd65ccec5a60f1d862c355d84d14562?editors=0010 and https://codepen.io/GreenSock/pen/ExbrPNa/087cef197dc35445a0951e8935c41503?editors=0010
      if (!_normalizer || !_normalizer.isPressed || _normalizer.startX > _body.clientWidth) {
        // if the user is dragging the scrollbar, allow it.
        _scrollers.cache++;
        if (_normalizer) {
          _rafID || (_rafID = requestAnimationFrame(_updateAll));
        } else {
          _updateAll(); // Safari in particular (on desktop) NEEDS the immediate update rather than waiting for a requestAnimationFrame() whereas iOS seems to benefit from waiting for the requestAnimationFrame() tick, at least when normalizing. See https://codepen.io/GreenSock/pen/qBYozqO?editors=0110
        }

        _lastScrollTime || _dispatch("scrollStart");
        _lastScrollTime = _getTime();
      }
    },
    _setBaseDimensions = function _setBaseDimensions() {
      _baseScreenWidth = _win$1.innerWidth;
      _baseScreenHeight = _win$1.innerHeight;
    },
    _onResize = function _onResize() {
      _scrollers.cache++;
      !_refreshing && !_ignoreResize && !_doc$1.fullscreenElement && !_doc$1.webkitFullscreenElement && (!_ignoreMobileResize || _baseScreenWidth !== _win$1.innerWidth || Math.abs(_win$1.innerHeight - _baseScreenHeight) > _win$1.innerHeight * 0.25) && _resizeDelay.restart(true);
    },
    // ignore resizes triggered by refresh()
    _listeners = {},
    _emptyArray = [],
    _softRefresh = function _softRefresh() {
      return _removeListener(ScrollTrigger, "scrollEnd", _softRefresh) || _refreshAll(true);
    },
    _dispatch = function _dispatch(type) {
      return _listeners[type] && _listeners[type].map(function (f) {
        return f();
      }) || _emptyArray;
    },
    _savedStyles = [],
    // when ScrollTrigger.saveStyles() is called, the inline styles are recorded in this Array in a sequential format like [element, cssText, gsCache, media]. This keeps it very memory-efficient and fast to iterate through.
    _revertRecorded = function _revertRecorded(media) {
      for (var i = 0; i < _savedStyles.length; i += 5) {
        if (!media || _savedStyles[i + 4] && _savedStyles[i + 4].query === media) {
          _savedStyles[i].style.cssText = _savedStyles[i + 1];
          _savedStyles[i].getBBox && _savedStyles[i].setAttribute("transform", _savedStyles[i + 2] || "");
          _savedStyles[i + 3].uncache = 1;
        }
      }
    },
    _revertAll = function _revertAll(kill, media) {
      var trigger;
      for (_i = 0; _i < _triggers.length; _i++) {
        trigger = _triggers[_i];
        if (trigger && (!media || trigger._ctx === media)) {
          if (kill) {
            trigger.kill(1);
          } else {
            trigger.revert(true, true);
          }
        }
      }
      _isReverted = true;
      media && _revertRecorded(media);
      media || _dispatch("revert");
    },
    _clearScrollMemory = function _clearScrollMemory(scrollRestoration, force) {
      // zero-out all the recorded scroll positions. Don't use _triggers because if, for example, .matchMedia() is used to create some ScrollTriggers and then the user resizes and it removes ALL ScrollTriggers, and then go back to a size where there are ScrollTriggers, it would have kept the position(s) saved from the initial state.
      _scrollers.cache++;
      (force || !_refreshingAll) && _scrollers.forEach(function (obj) {
        return _isFunction$1(obj) && obj.cacheID++ && (obj.rec = 0);
      });
      _isString$1(scrollRestoration) && (_win$1.history.scrollRestoration = _scrollRestoration = scrollRestoration);
    },
    _refreshingAll,
    _refreshID = 0,
    _queueRefreshID,
    _queueRefreshAll = function _queueRefreshAll() {
      // we don't want to call _refreshAll() every time we create a new ScrollTrigger (for performance reasons) - it's better to batch them. Some frameworks dynamically load content and we can't rely on the window's "load" or "DOMContentLoaded" events to trigger it.
      if (_queueRefreshID !== _refreshID) {
        var id = _queueRefreshID = _refreshID;
        requestAnimationFrame(function () {
          return id === _refreshID && _refreshAll(true);
        });
      }
    },
    _refresh100vh = function _refresh100vh() {
      _body.appendChild(_div100vh);
      _100vh = !_normalizer && _div100vh.offsetHeight || _win$1.innerHeight;
      _body.removeChild(_div100vh);
    },
    _hideAllMarkers = function _hideAllMarkers(hide) {
      return _toArray$2(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach(function (el) {
        return el.style.display = hide ? "none" : "block";
      });
    },
    _refreshAll = function _refreshAll(force, skipRevert) {
      if (_lastScrollTime && !force && !_isReverted) {
        _addListener(ScrollTrigger, "scrollEnd", _softRefresh);
        return;
      }
      _refresh100vh();
      _refreshingAll = ScrollTrigger.isRefreshing = true;
      _scrollers.forEach(function (obj) {
        return _isFunction$1(obj) && ++obj.cacheID && (obj.rec = obj());
      }); // force the clearing of the cache because some browsers take a little while to dispatch the "scroll" event and the user may have changed the scroll position and then called ScrollTrigger.refresh() right away

      var refreshInits = _dispatch("refreshInit");
      _sort && ScrollTrigger.sort();
      skipRevert || _revertAll();
      _scrollers.forEach(function (obj) {
        if (_isFunction$1(obj)) {
          obj.smooth && (obj.target.style.scrollBehavior = "auto"); // smooth scrolling interferes

          obj(0);
        }
      });
      _triggers.slice(0).forEach(function (t) {
        return t.refresh();
      }); // don't loop with _i because during a refresh() someone could call ScrollTrigger.update() which would iterate through _i resulting in a skip.

      _isReverted = false;
      _triggers.forEach(function (t) {
        // nested pins (pinnedContainer) with pinSpacing may expand the container, so we must accommodate that here.
        if (t._subPinOffset && t.pin) {
          var prop = t.vars.horizontal ? "offsetWidth" : "offsetHeight",
            original = t.pin[prop];
          t.revert(true, 1);
          t.adjustPinSpacing(t.pin[prop] - original);
          t.refresh();
        }
      });
      _clampingMax = 1; // pinSpacing might be propping a page open, thus when we .setPositions() to clamp a ScrollTrigger's end we should leave the pinSpacing alone. That's what this flag is for.

      _hideAllMarkers(true);
      _triggers.forEach(function (t) {
        // the scroller's max scroll position may change after all the ScrollTriggers refreshed (like pinning could push it down), so we need to loop back and correct any with end: "max". Same for anything with a clamped end
        var max = _maxScroll(t.scroller, t._dir),
          endClamp = t.vars.end === "max" || t._endClamp && t.end > max,
          startClamp = t._startClamp && t.start >= max;
        (endClamp || startClamp) && t.setPositions(startClamp ? max - 1 : t.start, endClamp ? Math.max(startClamp ? max : t.start + 1, max) : t.end, true);
      });
      _hideAllMarkers(false);
      _clampingMax = 0;
      refreshInits.forEach(function (result) {
        return result && result.render && result.render(-1);
      }); // if the onRefreshInit() returns an animation (typically a gsap.set()), revert it. This makes it easy to put things in a certain spot before refreshing for measurement purposes, and then put things back.

      _scrollers.forEach(function (obj) {
        if (_isFunction$1(obj)) {
          obj.smooth && requestAnimationFrame(function () {
            return obj.target.style.scrollBehavior = "smooth";
          });
          obj.rec && obj(obj.rec);
        }
      });
      _clearScrollMemory(_scrollRestoration, 1);
      _resizeDelay.pause();
      _refreshID++;
      _refreshingAll = 2;
      _updateAll(2);
      _triggers.forEach(function (t) {
        return _isFunction$1(t.vars.onRefresh) && t.vars.onRefresh(t);
      });
      _refreshingAll = ScrollTrigger.isRefreshing = false;
      _dispatch("refresh");
    },
    _lastScroll = 0,
    _direction = 1,
    _primary,
    _updateAll = function _updateAll(force) {
      if (force === 2 || !_refreshingAll && !_isReverted) {
        // _isReverted could be true if, for example, a matchMedia() is in the process of executing. We don't want to update during the time everything is reverted.
        ScrollTrigger.isUpdating = true;
        _primary && _primary.update(0); // ScrollSmoother uses refreshPriority -9999 to become the primary that gets updated before all others because it affects the scroll position.

        var l = _triggers.length,
          time = _getTime(),
          recordVelocity = time - _time1 >= 50,
          scroll = l && _triggers[0].scroll();
        _direction = _lastScroll > scroll ? -1 : 1;
        _refreshingAll || (_lastScroll = scroll);
        if (recordVelocity) {
          if (_lastScrollTime && !_pointerIsDown && time - _lastScrollTime > 200) {
            _lastScrollTime = 0;
            _dispatch("scrollEnd");
          }
          _time2 = _time1;
          _time1 = time;
        }
        if (_direction < 0) {
          _i = l;
          while (_i-- > 0) {
            _triggers[_i] && _triggers[_i].update(0, recordVelocity);
          }
          _direction = 1;
        } else {
          for (_i = 0; _i < l; _i++) {
            _triggers[_i] && _triggers[_i].update(0, recordVelocity);
          }
        }
        ScrollTrigger.isUpdating = false;
      }
      _rafID = 0;
    },
    _propNamesToCopy = [_left, _top, _bottom, _right, _margin + _Bottom, _margin + _Right, _margin + _Top, _margin + _Left, "display", "flexShrink", "float", "zIndex", "gridColumnStart", "gridColumnEnd", "gridRowStart", "gridRowEnd", "gridArea", "justifySelf", "alignSelf", "placeSelf", "order"],
    _stateProps = _propNamesToCopy.concat([_width, _height, "boxSizing", "max" + _Width, "max" + _Height, "position", _margin, _padding, _padding + _Top, _padding + _Right, _padding + _Bottom, _padding + _Left]),
    _swapPinOut = function _swapPinOut(pin, spacer, state) {
      _setState(state);
      var cache = pin._gsap;
      if (cache.spacerIsNative) {
        _setState(cache.spacerState);
      } else if (pin._gsap.swappedIn) {
        var parent = spacer.parentNode;
        if (parent) {
          parent.insertBefore(pin, spacer);
          parent.removeChild(spacer);
        }
      }
      pin._gsap.swappedIn = false;
    },
    _swapPinIn = function _swapPinIn(pin, spacer, cs, spacerState) {
      if (!pin._gsap.swappedIn) {
        var i = _propNamesToCopy.length,
          spacerStyle = spacer.style,
          pinStyle = pin.style,
          p;
        while (i--) {
          p = _propNamesToCopy[i];
          spacerStyle[p] = cs[p];
        }
        spacerStyle.position = cs.position === "absolute" ? "absolute" : "relative";
        cs.display === "inline" && (spacerStyle.display = "inline-block");
        pinStyle[_bottom] = pinStyle[_right] = "auto";
        spacerStyle.flexBasis = cs.flexBasis || "auto";
        spacerStyle.overflow = "visible";
        spacerStyle.boxSizing = "border-box";
        spacerStyle[_width] = _getSize$1(pin, _horizontal) + _px;
        spacerStyle[_height] = _getSize$1(pin, _vertical) + _px;
        spacerStyle[_padding] = pinStyle[_margin] = pinStyle[_top] = pinStyle[_left] = "0";
        _setState(spacerState);
        pinStyle[_width] = pinStyle["max" + _Width] = cs[_width];
        pinStyle[_height] = pinStyle["max" + _Height] = cs[_height];
        pinStyle[_padding] = cs[_padding];
        if (pin.parentNode !== spacer) {
          pin.parentNode.insertBefore(spacer, pin);
          spacer.appendChild(pin);
        }
        pin._gsap.swappedIn = true;
      }
    },
    _capsExp = /([A-Z])/g,
    _setState = function _setState(state) {
      if (state) {
        var style = state.t.style,
          l = state.length,
          i = 0,
          p,
          value;
        (state.t._gsap || gsap$2.core.getCache(state.t)).uncache = 1; // otherwise transforms may be off

        for (; i < l; i += 2) {
          value = state[i + 1];
          p = state[i];
          if (value) {
            style[p] = value;
          } else if (style[p]) {
            style.removeProperty(p.replace(_capsExp, "-$1").toLowerCase());
          }
        }
      }
    },
    _getState = function _getState(element) {
      // returns an Array with alternating values like [property, value, property, value] and a "t" property pointing to the target (element). Makes it fast and cheap.
      var l = _stateProps.length,
        style = element.style,
        state = [],
        i = 0;
      for (; i < l; i++) {
        state.push(_stateProps[i], style[_stateProps[i]]);
      }
      state.t = element;
      return state;
    },
    _copyState = function _copyState(state, override, omitOffsets) {
      var result = [],
        l = state.length,
        i = omitOffsets ? 8 : 0,
        // skip top, left, right, bottom if omitOffsets is true
        p;
      for (; i < l; i += 2) {
        p = state[i];
        result.push(p, p in override ? override[p] : state[i + 1]);
      }
      result.t = state.t;
      return result;
    },
    _winOffsets = {
      left: 0,
      top: 0
    },
    // // potential future feature (?) Allow users to calculate where a trigger hits (scroll position) like getScrollPosition("#id", "top bottom")
    // _getScrollPosition = (trigger, position, {scroller, containerAnimation, horizontal}) => {
    // 	scroller = _getTarget(scroller || _win);
    // 	let direction = horizontal ? _horizontal : _vertical,
    // 		isViewport = _isViewport(scroller);
    // 	_getSizeFunc(scroller, isViewport, direction);
    // 	return _parsePosition(position, _getTarget(trigger), _getSizeFunc(scroller, isViewport, direction)(), direction, _getScrollFunc(scroller, direction)(), 0, 0, 0, _getOffsetsFunc(scroller, isViewport)(), isViewport ? 0 : parseFloat(_getComputedStyle(scroller)["border" + direction.p2 + _Width]) || 0, 0, containerAnimation ? containerAnimation.duration() : _maxScroll(scroller), containerAnimation);
    // },
    _parsePosition = function _parsePosition(value, trigger, scrollerSize, direction, scroll, marker, markerScroller, self, scrollerBounds, borderWidth, useFixedPosition, scrollerMax, containerAnimation, clampZeroProp) {
      _isFunction$1(value) && (value = value(self));
      if (_isString$1(value) && value.substr(0, 3) === "max") {
        value = scrollerMax + (value.charAt(4) === "=" ? _offsetToPx("0" + value.substr(3), scrollerSize) : 0);
      }
      var time = containerAnimation ? containerAnimation.time() : 0,
        p1,
        p2,
        element;
      containerAnimation && containerAnimation.seek(0);
      isNaN(value) || (value = +value); // convert a string number like "45" to an actual number

      if (!_isNumber$1(value)) {
        _isFunction$1(trigger) && (trigger = trigger(self));
        var offsets = (value || "0").split(" "),
          bounds,
          localOffset,
          globalOffset,
          display;
        element = _getTarget(trigger, self) || _body;
        bounds = _getBounds(element) || {};
        if ((!bounds || !bounds.left && !bounds.top) && _getComputedStyle$1(element).display === "none") {
          // if display is "none", it won't report getBoundingClientRect() properly
          display = element.style.display;
          element.style.display = "block";
          bounds = _getBounds(element);
          display ? element.style.display = display : element.style.removeProperty("display");
        }
        localOffset = _offsetToPx(offsets[0], bounds[direction.d]);
        globalOffset = _offsetToPx(offsets[1] || "0", scrollerSize);
        value = bounds[direction.p] - scrollerBounds[direction.p] - borderWidth + localOffset + scroll - globalOffset;
        markerScroller && _positionMarker(markerScroller, globalOffset, direction, scrollerSize - globalOffset < 20 || markerScroller._isStart && globalOffset > 20);
        scrollerSize -= scrollerSize - globalOffset; // adjust for the marker
      } else {
        containerAnimation && (value = gsap$2.utils.mapRange(containerAnimation.scrollTrigger.start, containerAnimation.scrollTrigger.end, 0, scrollerMax, value));
        markerScroller && _positionMarker(markerScroller, scrollerSize, direction, true);
      }
      if (clampZeroProp) {
        self[clampZeroProp] = value || -0.001;
        value < 0 && (value = 0);
      }
      if (marker) {
        var position = value + scrollerSize,
          isStart = marker._isStart;
        p1 = "scroll" + direction.d2;
        _positionMarker(marker, position, direction, isStart && position > 20 || !isStart && (useFixedPosition ? Math.max(_body[p1], _docEl[p1]) : marker.parentNode[p1]) <= position + 1);
        if (useFixedPosition) {
          scrollerBounds = _getBounds(markerScroller);
          useFixedPosition && (marker.style[direction.op.p] = scrollerBounds[direction.op.p] - direction.op.m - marker._offset + _px);
        }
      }
      if (containerAnimation && element) {
        p1 = _getBounds(element);
        containerAnimation.seek(scrollerMax);
        p2 = _getBounds(element);
        containerAnimation._caScrollDist = p1[direction.p] - p2[direction.p];
        value = value / containerAnimation._caScrollDist * scrollerMax;
      }
      containerAnimation && containerAnimation.seek(time);
      return containerAnimation ? value : Math.round(value);
    },
    _prefixExp = /(webkit|moz|length|cssText|inset)/i,
    _reparent = function _reparent(element, parent, top, left) {
      if (element.parentNode !== parent) {
        var style = element.style,
          p,
          cs;
        if (parent === _body) {
          element._stOrig = style.cssText; // record original inline styles so we can revert them later

          cs = _getComputedStyle$1(element);
          for (p in cs) {
            // must copy all relevant styles to ensure that nothing changes visually when we reparent to the <body>. Skip the vendor prefixed ones.
            if (!+p && !_prefixExp.test(p) && cs[p] && typeof style[p] === "string" && p !== "0") {
              style[p] = cs[p];
            }
          }
          style.top = top;
          style.left = left;
        } else {
          style.cssText = element._stOrig;
        }
        gsap$2.core.getCache(element).uncache = 1;
        parent.appendChild(element);
      }
    },
    _interruptionTracker = function _interruptionTracker(getValueFunc, initialValue, onInterrupt) {
      var last1 = initialValue,
        last2 = last1;
      return function (value) {
        var current = Math.round(getValueFunc()); // round because in some [very uncommon] Windows environments, scroll can get reported with decimals even though it was set without.

        if (current !== last1 && current !== last2 && Math.abs(current - last1) > 3 && Math.abs(current - last2) > 3) {
          // if the user scrolls, kill the tween. iOS Safari intermittently misreports the scroll position, it may be the most recently-set one or the one before that! When Safari is zoomed (CMD-+), it often misreports as 1 pixel off too! So if we set the scroll position to 125, for example, it'll actually report it as 124.
          value = current;
          onInterrupt && onInterrupt();
        }
        last2 = last1;
        last1 = value;
        return value;
      };
    },
    _shiftMarker = function _shiftMarker(marker, direction, value) {
      var vars = {};
      vars[direction.p] = "+=" + value;
      gsap$2.set(marker, vars);
    },
    // _mergeAnimations = animations => {
    // 	let tl = gsap.timeline({smoothChildTiming: true}).startTime(Math.min(...animations.map(a => a.globalTime(0))));
    // 	animations.forEach(a => {let time = a.totalTime(); tl.add(a); a.totalTime(time); });
    // 	tl.smoothChildTiming = false;
    // 	return tl;
    // },
    // returns a function that can be used to tween the scroll position in the direction provided, and when doing so it'll add a .tween property to the FUNCTION itself, and remove it when the tween completes or gets killed. This gives us a way to have multiple ScrollTriggers use a central function for any given scroller and see if there's a scroll tween running (which would affect if/how things get updated)
    _getTweenCreator = function _getTweenCreator(scroller, direction) {
      var getScroll = _getScrollFunc(scroller, direction),
        prop = "_scroll" + direction.p2,
        // add a tweenable property to the scroller that's a getter/setter function, like _scrollTop or _scrollLeft. This way, if someone does gsap.killTweensOf(scroller) it'll kill the scroll tween.
        getTween = function getTween(scrollTo, vars, initialValue, change1, change2) {
          var tween = getTween.tween,
            onComplete = vars.onComplete,
            modifiers = {};
          initialValue = initialValue || getScroll();
          var checkForInterruption = _interruptionTracker(getScroll, initialValue, function () {
            tween.kill();
            getTween.tween = 0;
          });
          change2 = change1 && change2 || 0; // if change1 is 0, we set that to the difference and ignore change2. Otherwise, there would be a compound effect.

          change1 = change1 || scrollTo - initialValue;
          tween && tween.kill();
          vars[prop] = scrollTo;
          vars.inherit = false;
          vars.modifiers = modifiers;
          modifiers[prop] = function () {
            return checkForInterruption(initialValue + change1 * tween.ratio + change2 * tween.ratio * tween.ratio);
          };
          vars.onUpdate = function () {
            _scrollers.cache++;
            getTween.tween && _updateAll(); // if it was interrupted/killed, like in a context.revert(), don't force an updateAll()
          };

          vars.onComplete = function () {
            getTween.tween = 0;
            onComplete && onComplete.call(tween);
          };
          tween = getTween.tween = gsap$2.to(scroller, vars);
          return tween;
        };
      scroller[prop] = getScroll;
      getScroll.wheelHandler = function () {
        return getTween.tween && getTween.tween.kill() && (getTween.tween = 0);
      };
      _addListener(scroller, "wheel", getScroll.wheelHandler); // Windows machines handle mousewheel scrolling in chunks (like "3 lines per scroll") meaning the typical strategy for cancelling the scroll isn't as sensitive. It's much more likely to match one of the previous 2 scroll event positions. So we kill any snapping as soon as there's a wheel event.

      ScrollTrigger.isTouch && _addListener(scroller, "touchmove", getScroll.wheelHandler);
      return getTween;
    };
  var ScrollTrigger = /*#__PURE__*/function () {
    function ScrollTrigger(vars, animation) {
      _coreInitted$2 || ScrollTrigger.register(gsap$2) || console.warn("Please gsap.registerPlugin(ScrollTrigger)");
      _context$1(this);
      this.init(vars, animation);
    }
    var _proto = ScrollTrigger.prototype;
    _proto.init = function init(vars, animation) {
      this.progress = this.start = 0;
      this.vars && this.kill(true, true); // in case it's being initted again

      if (!_enabled) {
        this.update = this.refresh = this.kill = _passThrough;
        return;
      }
      vars = _setDefaults(_isString$1(vars) || _isNumber$1(vars) || vars.nodeType ? {
        trigger: vars
      } : vars, _defaults);
      var _vars = vars,
        onUpdate = _vars.onUpdate,
        toggleClass = _vars.toggleClass,
        id = _vars.id,
        onToggle = _vars.onToggle,
        onRefresh = _vars.onRefresh,
        scrub = _vars.scrub,
        trigger = _vars.trigger,
        pin = _vars.pin,
        pinSpacing = _vars.pinSpacing,
        invalidateOnRefresh = _vars.invalidateOnRefresh,
        anticipatePin = _vars.anticipatePin,
        onScrubComplete = _vars.onScrubComplete,
        onSnapComplete = _vars.onSnapComplete,
        once = _vars.once,
        snap = _vars.snap,
        pinReparent = _vars.pinReparent,
        pinSpacer = _vars.pinSpacer,
        containerAnimation = _vars.containerAnimation,
        fastScrollEnd = _vars.fastScrollEnd,
        preventOverlaps = _vars.preventOverlaps,
        direction = vars.horizontal || vars.containerAnimation && vars.horizontal !== false ? _horizontal : _vertical,
        isToggle = !scrub && scrub !== 0,
        scroller = _getTarget(vars.scroller || _win$1),
        scrollerCache = gsap$2.core.getCache(scroller),
        isViewport = _isViewport(scroller),
        useFixedPosition = ("pinType" in vars ? vars.pinType : _getProxyProp(scroller, "pinType") || isViewport && "fixed") === "fixed",
        callbacks = [vars.onEnter, vars.onLeave, vars.onEnterBack, vars.onLeaveBack],
        toggleActions = isToggle && vars.toggleActions.split(" "),
        markers = "markers" in vars ? vars.markers : _defaults.markers,
        borderWidth = isViewport ? 0 : parseFloat(_getComputedStyle$1(scroller)["border" + direction.p2 + _Width]) || 0,
        self = this,
        onRefreshInit = vars.onRefreshInit && function () {
          return vars.onRefreshInit(self);
        },
        getScrollerSize = _getSizeFunc(scroller, isViewport, direction),
        getScrollerOffsets = _getOffsetsFunc(scroller, isViewport),
        lastSnap = 0,
        lastRefresh = 0,
        prevProgress = 0,
        scrollFunc = _getScrollFunc(scroller, direction),
        tweenTo,
        pinCache,
        snapFunc,
        scroll1,
        scroll2,
        start,
        end,
        markerStart,
        markerEnd,
        markerStartTrigger,
        markerEndTrigger,
        markerVars,
        executingOnRefresh,
        change,
        pinOriginalState,
        pinActiveState,
        pinState,
        spacer,
        offset,
        pinGetter,
        pinSetter,
        pinStart,
        pinChange,
        spacingStart,
        spacerState,
        markerStartSetter,
        pinMoves,
        markerEndSetter,
        cs,
        snap1,
        snap2,
        scrubTween,
        scrubSmooth,
        snapDurClamp,
        snapDelayedCall,
        prevScroll,
        prevAnimProgress,
        caMarkerSetter,
        customRevertReturn; // for the sake of efficiency, _startClamp/_endClamp serve like a truthy value indicating that clamping was enabled on the start/end, and ALSO store the actual pre-clamped numeric value. We tap into that in ScrollSmoother for speed effects. So for example, if start="clamp(top bottom)" results in a start of -100 naturally, it would get clamped to 0 but -100 would be stored in _startClamp.

      self._startClamp = self._endClamp = false;
      self._dir = direction;
      anticipatePin *= 45;
      self.scroller = scroller;
      self.scroll = containerAnimation ? containerAnimation.time.bind(containerAnimation) : scrollFunc;
      scroll1 = scrollFunc();
      self.vars = vars;
      animation = animation || vars.animation;
      if ("refreshPriority" in vars) {
        _sort = 1;
        vars.refreshPriority === -9999 && (_primary = self); // used by ScrollSmoother
      }

      scrollerCache.tweenScroll = scrollerCache.tweenScroll || {
        top: _getTweenCreator(scroller, _vertical),
        left: _getTweenCreator(scroller, _horizontal)
      };
      self.tweenTo = tweenTo = scrollerCache.tweenScroll[direction.p];
      self.scrubDuration = function (value) {
        scrubSmooth = _isNumber$1(value) && value;
        if (!scrubSmooth) {
          scrubTween && scrubTween.progress(1).kill();
          scrubTween = 0;
        } else {
          scrubTween ? scrubTween.duration(value) : scrubTween = gsap$2.to(animation, {
            ease: "expo",
            totalProgress: "+=0",
            inherit: false,
            duration: scrubSmooth,
            paused: true,
            onComplete: function onComplete() {
              return onScrubComplete && onScrubComplete(self);
            }
          });
        }
      };
      if (animation) {
        animation.vars.lazy = false;
        animation._initted && !self.isReverted || animation.vars.immediateRender !== false && vars.immediateRender !== false && animation.duration() && animation.render(0, true, true); // special case: if this ScrollTrigger gets re-initted, a from() tween with a stagger could get initted initially and then reverted on the re-init which means it'll need to get rendered again here to properly display things. Otherwise, See https://gsap.com/forums/topic/36777-scrollsmoother-splittext-nextjs/ and https://codepen.io/GreenSock/pen/eYPyPpd?editors=0010

        self.animation = animation.pause();
        animation.scrollTrigger = self;
        self.scrubDuration(scrub);
        snap1 = 0;
        id || (id = animation.vars.id);
      }
      if (snap) {
        // TODO: potential idea: use legitimate CSS scroll snapping by pushing invisible elements into the DOM that serve as snap positions, and toggle the document.scrollingElement.style.scrollSnapType onToggle. See https://codepen.io/GreenSock/pen/JjLrgWM for a quick proof of concept.
        if (!_isObject(snap) || snap.push) {
          snap = {
            snapTo: snap
          };
        }
        "scrollBehavior" in _body.style && gsap$2.set(isViewport ? [_body, _docEl] : scroller, {
          scrollBehavior: "auto"
        }); // smooth scrolling doesn't work with snap.

        _scrollers.forEach(function (o) {
          return _isFunction$1(o) && o.target === (isViewport ? _doc$1.scrollingElement || _docEl : scroller) && (o.smooth = false);
        }); // note: set smooth to false on both the vertical and horizontal scroll getters/setters

        snapFunc = _isFunction$1(snap.snapTo) ? snap.snapTo : snap.snapTo === "labels" ? _getClosestLabel(animation) : snap.snapTo === "labelsDirectional" ? _getLabelAtDirection(animation) : snap.directional !== false ? function (value, st) {
          return _snapDirectional(snap.snapTo)(value, _getTime() - lastRefresh < 500 ? 0 : st.direction);
        } : gsap$2.utils.snap(snap.snapTo);
        snapDurClamp = snap.duration || {
          min: 0.1,
          max: 2
        };
        snapDurClamp = _isObject(snapDurClamp) ? _clamp(snapDurClamp.min, snapDurClamp.max) : _clamp(snapDurClamp, snapDurClamp);
        snapDelayedCall = gsap$2.delayedCall(snap.delay || scrubSmooth / 2 || 0.1, function () {
          var scroll = scrollFunc(),
            refreshedRecently = _getTime() - lastRefresh < 500,
            tween = tweenTo.tween;
          if ((refreshedRecently || Math.abs(self.getVelocity()) < 10) && !tween && !_pointerIsDown && lastSnap !== scroll) {
            var progress = (scroll - start) / change,
              totalProgress = animation && !isToggle ? animation.totalProgress() : progress,
              velocity = refreshedRecently ? 0 : (totalProgress - snap2) / (_getTime() - _time2) * 1000 || 0,
              change1 = gsap$2.utils.clamp(-progress, 1 - progress, _abs$1(velocity / 2) * velocity / 0.185),
              naturalEnd = progress + (snap.inertia === false ? 0 : change1),
              endValue,
              endScroll,
              _snap = snap,
              onStart = _snap.onStart,
              _onInterrupt = _snap.onInterrupt,
              _onComplete = _snap.onComplete;
            endValue = snapFunc(naturalEnd, self);
            _isNumber$1(endValue) || (endValue = naturalEnd); // in case the function didn't return a number, fall back to using the naturalEnd

            endScroll = Math.round(start + endValue * change);
            if (scroll <= end && scroll >= start && endScroll !== scroll) {
              if (tween && !tween._initted && tween.data <= _abs$1(endScroll - scroll)) {
                // there's an overlapping snap! So we must figure out which one is closer and let that tween live.
                return;
              }
              if (snap.inertia === false) {
                change1 = endValue - progress;
              }
              tweenTo(endScroll, {
                duration: snapDurClamp(_abs$1(Math.max(_abs$1(naturalEnd - totalProgress), _abs$1(endValue - totalProgress)) * 0.185 / velocity / 0.05 || 0)),
                ease: snap.ease || "power3",
                data: _abs$1(endScroll - scroll),
                // record the distance so that if another snap tween occurs (conflict) we can prioritize the closest snap.
                onInterrupt: function onInterrupt() {
                  return snapDelayedCall.restart(true) && _onInterrupt && _onInterrupt(self);
                },
                onComplete: function onComplete() {
                  self.update();
                  lastSnap = scrollFunc();
                  if (animation) {
                    // the resolution of the scrollbar is limited, so we should correct the scrubbed animation's playhead at the end to match EXACTLY where it was supposed to snap
                    scrubTween ? scrubTween.resetTo("totalProgress", endValue, animation._tTime / animation._tDur) : animation.progress(endValue);
                  }
                  snap1 = snap2 = animation && !isToggle ? animation.totalProgress() : self.progress;
                  onSnapComplete && onSnapComplete(self);
                  _onComplete && _onComplete(self);
                }
              }, scroll, change1 * change, endScroll - scroll - change1 * change);
              onStart && onStart(self, tweenTo.tween);
            }
          } else if (self.isActive && lastSnap !== scroll) {
            snapDelayedCall.restart(true);
          }
        }).pause();
      }
      id && (_ids[id] = self);
      trigger = self.trigger = _getTarget(trigger || pin !== true && pin); // if a trigger has some kind of scroll-related effect applied that could contaminate the "y" or "x" position (like a ScrollSmoother effect), we needed a way to temporarily revert it, so we use the stRevert property of the gsCache. It can return another function that we'll call at the end so it can return to its normal state.

      customRevertReturn = trigger && trigger._gsap && trigger._gsap.stRevert;
      customRevertReturn && (customRevertReturn = customRevertReturn(self));
      pin = pin === true ? trigger : _getTarget(pin);
      _isString$1(toggleClass) && (toggleClass = {
        targets: trigger,
        className: toggleClass
      });
      if (pin) {
        pinSpacing === false || pinSpacing === _margin || (pinSpacing = !pinSpacing && pin.parentNode && pin.parentNode.style && _getComputedStyle$1(pin.parentNode).display === "flex" ? false : _padding); // if the parent is display: flex, don't apply pinSpacing by default. We should check that pin.parentNode is an element (not shadow dom window)

        self.pin = pin;
        pinCache = gsap$2.core.getCache(pin);
        if (!pinCache.spacer) {
          // record the spacer and pinOriginalState on the cache in case someone tries pinning the same element with MULTIPLE ScrollTriggers - we don't want to have multiple spacers or record the "original" pin state after it has already been affected by another ScrollTrigger.
          if (pinSpacer) {
            pinSpacer = _getTarget(pinSpacer);
            pinSpacer && !pinSpacer.nodeType && (pinSpacer = pinSpacer.current || pinSpacer.nativeElement); // for React & Angular

            pinCache.spacerIsNative = !!pinSpacer;
            pinSpacer && (pinCache.spacerState = _getState(pinSpacer));
          }
          pinCache.spacer = spacer = pinSpacer || _doc$1.createElement("div");
          spacer.classList.add("pin-spacer");
          id && spacer.classList.add("pin-spacer-" + id);
          pinCache.pinState = pinOriginalState = _getState(pin);
        } else {
          pinOriginalState = pinCache.pinState;
        }
        vars.force3D !== false && gsap$2.set(pin, {
          force3D: true
        });
        self.spacer = spacer = pinCache.spacer;
        cs = _getComputedStyle$1(pin);
        spacingStart = cs[pinSpacing + direction.os2];
        pinGetter = gsap$2.getProperty(pin);
        pinSetter = gsap$2.quickSetter(pin, direction.a, _px); // pin.firstChild && !_maxScroll(pin, direction) && (pin.style.overflow = "hidden"); // protects from collapsing margins, but can have unintended consequences as demonstrated here: https://codepen.io/GreenSock/pen/1e42c7a73bfa409d2cf1e184e7a4248d so it was removed in favor of just telling people to set up their CSS to avoid the collapsing margins (overflow: hidden | auto is just one option. Another is border-top: 1px solid transparent).

        _swapPinIn(pin, spacer, cs);
        pinState = _getState(pin);
      }
      if (markers) {
        markerVars = _isObject(markers) ? _setDefaults(markers, _markerDefaults) : _markerDefaults;
        markerStartTrigger = _createMarker("scroller-start", id, scroller, direction, markerVars, 0);
        markerEndTrigger = _createMarker("scroller-end", id, scroller, direction, markerVars, 0, markerStartTrigger);
        offset = markerStartTrigger["offset" + direction.op.d2];
        var content = _getTarget(_getProxyProp(scroller, "content") || scroller);
        markerStart = this.markerStart = _createMarker("start", id, content, direction, markerVars, offset, 0, containerAnimation);
        markerEnd = this.markerEnd = _createMarker("end", id, content, direction, markerVars, offset, 0, containerAnimation);
        containerAnimation && (caMarkerSetter = gsap$2.quickSetter([markerStart, markerEnd], direction.a, _px));
        if (!useFixedPosition && !(_proxies.length && _getProxyProp(scroller, "fixedMarkers") === true)) {
          _makePositionable(isViewport ? _body : scroller);
          gsap$2.set([markerStartTrigger, markerEndTrigger], {
            force3D: true
          });
          markerStartSetter = gsap$2.quickSetter(markerStartTrigger, direction.a, _px);
          markerEndSetter = gsap$2.quickSetter(markerEndTrigger, direction.a, _px);
        }
      }
      if (containerAnimation) {
        var oldOnUpdate = containerAnimation.vars.onUpdate,
          oldParams = containerAnimation.vars.onUpdateParams;
        containerAnimation.eventCallback("onUpdate", function () {
          self.update(0, 0, 1);
          oldOnUpdate && oldOnUpdate.apply(containerAnimation, oldParams || []);
        });
      }
      self.previous = function () {
        return _triggers[_triggers.indexOf(self) - 1];
      };
      self.next = function () {
        return _triggers[_triggers.indexOf(self) + 1];
      };
      self.revert = function (revert, temp) {
        if (!temp) {
          return self.kill(true);
        } // for compatibility with gsap.context() and gsap.matchMedia() which call revert()

        var r = revert !== false || !self.enabled,
          prevRefreshing = _refreshing;
        if (r !== self.isReverted) {
          if (r) {
            prevScroll = Math.max(scrollFunc(), self.scroll.rec || 0); // record the scroll so we can revert later (repositioning/pinning things can affect scroll position). In the static refresh() method, we first record all the scroll positions as a reference.

            prevProgress = self.progress;
            prevAnimProgress = animation && animation.progress();
          }
          markerStart && [markerStart, markerEnd, markerStartTrigger, markerEndTrigger].forEach(function (m) {
            return m.style.display = r ? "none" : "block";
          });
          if (r) {
            _refreshing = self;
            self.update(r); // make sure the pin is back in its original position so that all the measurements are correct. do this BEFORE swapping the pin out
          }

          if (pin && (!pinReparent || !self.isActive)) {
            if (r) {
              _swapPinOut(pin, spacer, pinOriginalState);
            } else {
              _swapPinIn(pin, spacer, _getComputedStyle$1(pin), spacerState);
            }
          }
          r || self.update(r); // when we're restoring, the update should run AFTER swapping the pin into its pin-spacer.

          _refreshing = prevRefreshing; // restore. We set it to true during the update() so that things fire properly in there.

          self.isReverted = r;
        }
      };
      self.refresh = function (soft, force, position, pinOffset) {
        // position is typically only defined if it's coming from setPositions() - it's a way to skip the normal parsing. pinOffset is also only from setPositions() and is mostly related to fancy stuff we need to do in ScrollSmoother with effects
        if ((_refreshing || !self.enabled) && !force) {
          return;
        }
        if (pin && soft && _lastScrollTime) {
          _addListener(ScrollTrigger, "scrollEnd", _softRefresh);
          return;
        }
        !_refreshingAll && onRefreshInit && onRefreshInit(self);
        _refreshing = self;
        if (tweenTo.tween && !position) {
          // we skip this if a position is passed in because typically that's from .setPositions() and it's best to allow in-progress snapping to continue.
          tweenTo.tween.kill();
          tweenTo.tween = 0;
        }
        scrubTween && scrubTween.pause();
        invalidateOnRefresh && animation && animation.revert({
          kill: false
        }).invalidate();
        self.isReverted || self.revert(true, true);
        self._subPinOffset = false; // we'll set this to true in the sub-pins if we find any

        var size = getScrollerSize(),
          scrollerBounds = getScrollerOffsets(),
          max = containerAnimation ? containerAnimation.duration() : _maxScroll(scroller, direction),
          isFirstRefresh = change <= 0.01,
          offset = 0,
          otherPinOffset = pinOffset || 0,
          parsedEnd = _isObject(position) ? position.end : vars.end,
          parsedEndTrigger = vars.endTrigger || trigger,
          parsedStart = _isObject(position) ? position.start : vars.start || (vars.start === 0 || !trigger ? 0 : pin ? "0 0" : "0 100%"),
          pinnedContainer = self.pinnedContainer = vars.pinnedContainer && _getTarget(vars.pinnedContainer, self),
          triggerIndex = trigger && Math.max(0, _triggers.indexOf(self)) || 0,
          i = triggerIndex,
          cs,
          bounds,
          scroll,
          isVertical,
          override,
          curTrigger,
          curPin,
          oppositeScroll,
          initted,
          revertedPins,
          forcedOverflow,
          markerStartOffset,
          markerEndOffset;
        if (markers && _isObject(position)) {
          // if we alter the start/end positions with .setPositions(), it generally feeds in absolute NUMBERS which don't convey information about where to line up the markers, so to keep it intuitive, we record how far the trigger positions shift after applying the new numbers and then offset by that much in the opposite direction. We do the same to the associated trigger markers too of course.
          markerStartOffset = gsap$2.getProperty(markerStartTrigger, direction.p);
          markerEndOffset = gsap$2.getProperty(markerEndTrigger, direction.p);
        }
        while (i--) {
          // user might try to pin the same element more than once, so we must find any prior triggers with the same pin, revert them, and determine how long they're pinning so that we can offset things appropriately. Make sure we revert from last to first so that things "rewind" properly.
          curTrigger = _triggers[i];
          curTrigger.end || curTrigger.refresh(0, 1) || (_refreshing = self); // if it's a timeline-based trigger that hasn't been fully initialized yet because it's waiting for 1 tick, just force the refresh() here, otherwise if it contains a pin that's supposed to affect other ScrollTriggers further down the page, they won't be adjusted properly.

          curPin = curTrigger.pin;
          if (curPin && (curPin === trigger || curPin === pin || curPin === pinnedContainer) && !curTrigger.isReverted) {
            revertedPins || (revertedPins = []);
            revertedPins.unshift(curTrigger); // we'll revert from first to last to make sure things reach their end state properly

            curTrigger.revert(true, true);
          }
          if (curTrigger !== _triggers[i]) {
            // in case it got removed.
            triggerIndex--;
            i--;
          }
        }
        _isFunction$1(parsedStart) && (parsedStart = parsedStart(self));
        parsedStart = _parseClamp(parsedStart, "start", self);
        start = _parsePosition(parsedStart, trigger, size, direction, scrollFunc(), markerStart, markerStartTrigger, self, scrollerBounds, borderWidth, useFixedPosition, max, containerAnimation, self._startClamp && "_startClamp") || (pin ? -0.001 : 0);
        _isFunction$1(parsedEnd) && (parsedEnd = parsedEnd(self));
        if (_isString$1(parsedEnd) && !parsedEnd.indexOf("+=")) {
          if (~parsedEnd.indexOf(" ")) {
            parsedEnd = (_isString$1(parsedStart) ? parsedStart.split(" ")[0] : "") + parsedEnd;
          } else {
            offset = _offsetToPx(parsedEnd.substr(2), size);
            parsedEnd = _isString$1(parsedStart) ? parsedStart : (containerAnimation ? gsap$2.utils.mapRange(0, containerAnimation.duration(), containerAnimation.scrollTrigger.start, containerAnimation.scrollTrigger.end, start) : start) + offset; // _parsePosition won't factor in the offset if the start is a number, so do it here.

            parsedEndTrigger = trigger;
          }
        }
        parsedEnd = _parseClamp(parsedEnd, "end", self);
        end = Math.max(start, _parsePosition(parsedEnd || (parsedEndTrigger ? "100% 0" : max), parsedEndTrigger, size, direction, scrollFunc() + offset, markerEnd, markerEndTrigger, self, scrollerBounds, borderWidth, useFixedPosition, max, containerAnimation, self._endClamp && "_endClamp")) || -0.001;
        offset = 0;
        i = triggerIndex;
        while (i--) {
          curTrigger = _triggers[i];
          curPin = curTrigger.pin;
          if (curPin && curTrigger.start - curTrigger._pinPush <= start && !containerAnimation && curTrigger.end > 0) {
            cs = curTrigger.end - (self._startClamp ? Math.max(0, curTrigger.start) : curTrigger.start);
            if ((curPin === trigger && curTrigger.start - curTrigger._pinPush < start || curPin === pinnedContainer) && isNaN(parsedStart)) {
              // numeric start values shouldn't be offset at all - treat them as absolute
              offset += cs * (1 - curTrigger.progress);
            }
            curPin === pin && (otherPinOffset += cs);
          }
        }
        start += offset;
        end += offset;
        self._startClamp && (self._startClamp += offset);
        if (self._endClamp && !_refreshingAll) {
          self._endClamp = end || -0.001;
          end = Math.min(end, _maxScroll(scroller, direction));
        }
        change = end - start || (start -= 0.01) && 0.001;
        if (isFirstRefresh) {
          // on the very first refresh(), the prevProgress couldn't have been accurate yet because the start/end were never calculated, so we set it here. Before 3.11.5, it could lead to an inaccurate scroll position restoration with snapping.
          prevProgress = gsap$2.utils.clamp(0, 1, gsap$2.utils.normalize(start, end, prevScroll));
        }
        self._pinPush = otherPinOffset;
        if (markerStart && offset) {
          // offset the markers if necessary
          cs = {};
          cs[direction.a] = "+=" + offset;
          pinnedContainer && (cs[direction.p] = "-=" + scrollFunc());
          gsap$2.set([markerStart, markerEnd], cs);
        }
        if (pin && !(_clampingMax && self.end >= _maxScroll(scroller, direction))) {
          cs = _getComputedStyle$1(pin);
          isVertical = direction === _vertical;
          scroll = scrollFunc(); // recalculate because the triggers can affect the scroll

          pinStart = parseFloat(pinGetter(direction.a)) + otherPinOffset;
          if (!max && end > 1) {
            // makes sure the scroller has a scrollbar, otherwise if something has width: 100%, for example, it would be too big (exclude the scrollbar). See https://gsap.com/forums/topic/25182-scrolltrigger-width-of-page-increase-where-markers-are-set-to-false/
            forcedOverflow = (isViewport ? _doc$1.scrollingElement || _docEl : scroller).style;
            forcedOverflow = {
              style: forcedOverflow,
              value: forcedOverflow["overflow" + direction.a.toUpperCase()]
            };
            if (isViewport && _getComputedStyle$1(_body)["overflow" + direction.a.toUpperCase()] !== "scroll") {
              // avoid an extra scrollbar if BOTH <html> and <body> have overflow set to "scroll"
              forcedOverflow.style["overflow" + direction.a.toUpperCase()] = "scroll";
            }
          }
          _swapPinIn(pin, spacer, cs);
          pinState = _getState(pin); // transforms will interfere with the top/left/right/bottom placement, so remove them temporarily. getBoundingClientRect() factors in transforms.

          bounds = _getBounds(pin, true);
          oppositeScroll = useFixedPosition && _getScrollFunc(scroller, isVertical ? _horizontal : _vertical)();
          if (pinSpacing) {
            spacerState = [pinSpacing + direction.os2, change + otherPinOffset + _px];
            spacerState.t = spacer;
            i = pinSpacing === _padding ? _getSize$1(pin, direction) + change + otherPinOffset : 0;
            if (i) {
              spacerState.push(direction.d, i + _px); // for box-sizing: border-box (must include padding).

              spacer.style.flexBasis !== "auto" && (spacer.style.flexBasis = i + _px);
            }
            _setState(spacerState);
            if (pinnedContainer) {
              // in ScrollTrigger.refresh(), we need to re-evaluate the pinContainer's size because this pinSpacing may stretch it out, but we can't just add the exact distance because depending on layout, it may not push things down or it may only do so partially.
              _triggers.forEach(function (t) {
                if (t.pin === pinnedContainer && t.vars.pinSpacing !== false) {
                  t._subPinOffset = true;
                }
              });
            }
            useFixedPosition && scrollFunc(prevScroll);
          } else {
            i = _getSize$1(pin, direction);
            i && spacer.style.flexBasis !== "auto" && (spacer.style.flexBasis = i + _px);
          }
          if (useFixedPosition) {
            override = {
              top: bounds.top + (isVertical ? scroll - start : oppositeScroll) + _px,
              left: bounds.left + (isVertical ? oppositeScroll : scroll - start) + _px,
              boxSizing: "border-box",
              position: "fixed"
            };
            override[_width] = override["max" + _Width] = Math.ceil(bounds.width) + _px;
            override[_height] = override["max" + _Height] = Math.ceil(bounds.height) + _px;
            override[_margin] = override[_margin + _Top] = override[_margin + _Right] = override[_margin + _Bottom] = override[_margin + _Left] = "0";
            override[_padding] = cs[_padding];
            override[_padding + _Top] = cs[_padding + _Top];
            override[_padding + _Right] = cs[_padding + _Right];
            override[_padding + _Bottom] = cs[_padding + _Bottom];
            override[_padding + _Left] = cs[_padding + _Left];
            pinActiveState = _copyState(pinOriginalState, override, pinReparent);
            _refreshingAll && scrollFunc(0);
          }
          if (animation) {
            // the animation might be affecting the transform, so we must jump to the end, check the value, and compensate accordingly. Otherwise, when it becomes unpinned, the pinSetter() will get set to a value that doesn't include whatever the animation did.
            initted = animation._initted; // if not, we must invalidate() after this step, otherwise it could lock in starting values prematurely.

            _suppressOverwrites(1);
            animation.render(animation.duration(), true, true);
            pinChange = pinGetter(direction.a) - pinStart + change + otherPinOffset;
            pinMoves = Math.abs(change - pinChange) > 1;
            useFixedPosition && pinMoves && pinActiveState.splice(pinActiveState.length - 2, 2); // transform is the last property/value set in the state Array. Since the animation is controlling that, we should omit it.

            animation.render(0, true, true);
            initted || animation.invalidate(true);
            animation.parent || animation.totalTime(animation.totalTime()); // if, for example, a toggleAction called play() and then refresh() happens and when we render(1) above, it would cause the animation to complete and get removed from its parent, so this makes sure it gets put back in.

            _suppressOverwrites(0);
          } else {
            pinChange = change;
          }
          forcedOverflow && (forcedOverflow.value ? forcedOverflow.style["overflow" + direction.a.toUpperCase()] = forcedOverflow.value : forcedOverflow.style.removeProperty("overflow-" + direction.a));
        } else if (trigger && scrollFunc() && !containerAnimation) {
          // it may be INSIDE a pinned element, so walk up the tree and look for any elements with _pinOffset to compensate because anything with pinSpacing that's already scrolled would throw off the measurements in getBoundingClientRect()
          bounds = trigger.parentNode;
          while (bounds && bounds !== _body) {
            if (bounds._pinOffset) {
              start -= bounds._pinOffset;
              end -= bounds._pinOffset;
            }
            bounds = bounds.parentNode;
          }
        }
        revertedPins && revertedPins.forEach(function (t) {
          return t.revert(false, true);
        });
        self.start = start;
        self.end = end;
        scroll1 = scroll2 = _refreshingAll ? prevScroll : scrollFunc(); // reset velocity

        if (!containerAnimation && !_refreshingAll) {
          scroll1 < prevScroll && scrollFunc(prevScroll);
          self.scroll.rec = 0;
        }
        self.revert(false, true);
        lastRefresh = _getTime();
        if (snapDelayedCall) {
          lastSnap = -1; // just so snapping gets re-enabled, clear out any recorded last value
          // self.isActive && scrollFunc(start + change * prevProgress); // previously this line was here to ensure that when snapping kicks in, it's from the previous progress but in some cases that's not desirable, like an all-page ScrollTrigger when new content gets added to the page, that'd totally change the progress.

          snapDelayedCall.restart(true);
        }
        _refreshing = 0;
        animation && isToggle && (animation._initted || prevAnimProgress) && animation.progress() !== prevAnimProgress && animation.progress(prevAnimProgress || 0, true).render(animation.time(), true, true); // must force a re-render because if saveStyles() was used on the target(s), the styles could have been wiped out during the refresh().

        if (isFirstRefresh || prevProgress !== self.progress || containerAnimation || invalidateOnRefresh) {
          // ensures that the direction is set properly (when refreshing, progress is set back to 0 initially, then back again to wherever it needs to be) and that callbacks are triggered.
          animation && !isToggle && animation.totalProgress(containerAnimation && start < -0.001 && !prevProgress ? gsap$2.utils.normalize(start, end, 0) : prevProgress, true); // to avoid issues where animation callbacks like onStart aren't triggered.

          self.progress = isFirstRefresh || (scroll1 - start) / change === prevProgress ? 0 : prevProgress;
        }
        pin && pinSpacing && (spacer._pinOffset = Math.round(self.progress * pinChange));
        scrubTween && scrubTween.invalidate();
        if (!isNaN(markerStartOffset)) {
          // numbers were passed in for the position which are absolute, so instead of just putting the markers at the very bottom of the viewport, we figure out how far they shifted down (it's safe to assume they were originally positioned in closer relation to the trigger element with values like "top", "center", a percentage or whatever, so we offset that much in the opposite direction to basically revert them to the relative position thy were at previously.
          markerStartOffset -= gsap$2.getProperty(markerStartTrigger, direction.p);
          markerEndOffset -= gsap$2.getProperty(markerEndTrigger, direction.p);
          _shiftMarker(markerStartTrigger, direction, markerStartOffset);
          _shiftMarker(markerStart, direction, markerStartOffset - (pinOffset || 0));
          _shiftMarker(markerEndTrigger, direction, markerEndOffset);
          _shiftMarker(markerEnd, direction, markerEndOffset - (pinOffset || 0));
        }
        isFirstRefresh && !_refreshingAll && self.update(); // edge case - when you reload a page when it's already scrolled down, some browsers fire a "scroll" event before DOMContentLoaded, triggering an updateAll(). If we don't update the self.progress as part of refresh(), then when it happens next, it may record prevProgress as 0 when it really shouldn't, potentially causing a callback in an animation to fire again.

        if (onRefresh && !_refreshingAll && !executingOnRefresh) {
          // when refreshing all, we do extra work to correct pinnedContainer sizes and ensure things don't exceed the maxScroll, so we should do all the refreshes at the end after all that work so that the start/end values are corrected.
          executingOnRefresh = true;
          onRefresh(self);
          executingOnRefresh = false;
        }
      };
      self.getVelocity = function () {
        return (scrollFunc() - scroll2) / (_getTime() - _time2) * 1000 || 0;
      };
      self.endAnimation = function () {
        _endAnimation(self.callbackAnimation);
        if (animation) {
          scrubTween ? scrubTween.progress(1) : !animation.paused() ? _endAnimation(animation, animation.reversed()) : isToggle || _endAnimation(animation, self.direction < 0, 1);
        }
      };
      self.labelToScroll = function (label) {
        return animation && animation.labels && (start || self.refresh() || start) + animation.labels[label] / animation.duration() * change || 0;
      };
      self.getTrailing = function (name) {
        var i = _triggers.indexOf(self),
          a = self.direction > 0 ? _triggers.slice(0, i).reverse() : _triggers.slice(i + 1);
        return (_isString$1(name) ? a.filter(function (t) {
          return t.vars.preventOverlaps === name;
        }) : a).filter(function (t) {
          return self.direction > 0 ? t.end <= start : t.start >= end;
        });
      };
      self.update = function (reset, recordVelocity, forceFake) {
        if (containerAnimation && !forceFake && !reset) {
          return;
        }
        var scroll = _refreshingAll === true ? prevScroll : self.scroll(),
          p = reset ? 0 : (scroll - start) / change,
          clipped = p < 0 ? 0 : p > 1 ? 1 : p || 0,
          prevProgress = self.progress,
          isActive,
          wasActive,
          toggleState,
          action,
          stateChanged,
          toggled,
          isAtMax,
          isTakingAction;
        if (recordVelocity) {
          scroll2 = scroll1;
          scroll1 = containerAnimation ? scrollFunc() : scroll;
          if (snap) {
            snap2 = snap1;
            snap1 = animation && !isToggle ? animation.totalProgress() : clipped;
          }
        } // anticipate the pinning a few ticks ahead of time based on velocity to avoid a visual glitch due to the fact that most browsers do scrolling on a separate thread (not synced with requestAnimationFrame).

        if (anticipatePin && pin && !_refreshing && !_startup && _lastScrollTime) {
          if (!clipped && start < scroll + (scroll - scroll2) / (_getTime() - _time2) * anticipatePin) {
            clipped = 0.0001;
          } else if (clipped === 1 && end > scroll + (scroll - scroll2) / (_getTime() - _time2) * anticipatePin) {
            clipped = 0.9999;
          }
        }
        if (clipped !== prevProgress && self.enabled) {
          isActive = self.isActive = !!clipped && clipped < 1;
          wasActive = !!prevProgress && prevProgress < 1;
          toggled = isActive !== wasActive;
          stateChanged = toggled || !!clipped !== !!prevProgress; // could go from start all the way to end, thus it didn't toggle but it did change state in a sense (may need to fire a callback)

          self.direction = clipped > prevProgress ? 1 : -1;
          self.progress = clipped;
          if (stateChanged && !_refreshing) {
            toggleState = clipped && !prevProgress ? 0 : clipped === 1 ? 1 : prevProgress === 1 ? 2 : 3; // 0 = enter, 1 = leave, 2 = enterBack, 3 = leaveBack (we prioritize the FIRST encounter, thus if you scroll really fast past the onEnter and onLeave in one tick, it'd prioritize onEnter.

            if (isToggle) {
              action = !toggled && toggleActions[toggleState + 1] !== "none" && toggleActions[toggleState + 1] || toggleActions[toggleState]; // if it didn't toggle, that means it shot right past and since we prioritize the "enter" action, we should switch to the "leave" in this case (but only if one is defined)

              isTakingAction = animation && (action === "complete" || action === "reset" || action in animation);
            }
          }
          preventOverlaps && (toggled || isTakingAction) && (isTakingAction || scrub || !animation) && (_isFunction$1(preventOverlaps) ? preventOverlaps(self) : self.getTrailing(preventOverlaps).forEach(function (t) {
            return t.endAnimation();
          }));
          if (!isToggle) {
            if (scrubTween && !_refreshing && !_startup) {
              scrubTween._dp._time - scrubTween._start !== scrubTween._time && scrubTween.render(scrubTween._dp._time - scrubTween._start); // if there's a scrub on both the container animation and this one (or a ScrollSmoother), the update order would cause this one not to have rendered yet, so it wouldn't make any progress before we .restart() it heading toward the new progress so it'd appear stuck thus we force a render here.

              if (scrubTween.resetTo) {
                scrubTween.resetTo("totalProgress", clipped, animation._tTime / animation._tDur);
              } else {
                // legacy support (courtesy), before 3.10.0
                scrubTween.vars.totalProgress = clipped;
                scrubTween.invalidate().restart();
              }
            } else if (animation) {
              animation.totalProgress(clipped, !!(_refreshing && (lastRefresh || reset)));
            }
          }
          if (pin) {
            reset && pinSpacing && (spacer.style[pinSpacing + direction.os2] = spacingStart);
            if (!useFixedPosition) {
              pinSetter(_round$1(pinStart + pinChange * clipped));
            } else if (stateChanged) {
              isAtMax = !reset && clipped > prevProgress && end + 1 > scroll && scroll + 1 >= _maxScroll(scroller, direction); // if it's at the VERY end of the page, don't switch away from position: fixed because it's pointless and it could cause a brief flash when the user scrolls back up (when it gets pinned again)

              if (pinReparent) {
                if (!reset && (isActive || isAtMax)) {
                  var bounds = _getBounds(pin, true),
                    _offset = scroll - start;
                  _reparent(pin, _body, bounds.top + (direction === _vertical ? _offset : 0) + _px, bounds.left + (direction === _vertical ? 0 : _offset) + _px);
                } else {
                  _reparent(pin, spacer);
                }
              }
              _setState(isActive || isAtMax ? pinActiveState : pinState);
              pinMoves && clipped < 1 && isActive || pinSetter(pinStart + (clipped === 1 && !isAtMax ? pinChange : 0));
            }
          }
          snap && !tweenTo.tween && !_refreshing && !_startup && snapDelayedCall.restart(true);
          toggleClass && (toggled || once && clipped && (clipped < 1 || !_limitCallbacks)) && _toArray$2(toggleClass.targets).forEach(function (el) {
            return el.classList[isActive || once ? "add" : "remove"](toggleClass.className);
          }); // classes could affect positioning, so do it even if reset or refreshing is true.

          onUpdate && !isToggle && !reset && onUpdate(self);
          if (stateChanged && !_refreshing) {
            if (isToggle) {
              if (isTakingAction) {
                if (action === "complete") {
                  animation.pause().totalProgress(1);
                } else if (action === "reset") {
                  animation.restart(true).pause();
                } else if (action === "restart") {
                  animation.restart(true);
                } else {
                  animation[action]();
                }
              }
              onUpdate && onUpdate(self);
            }
            if (toggled || !_limitCallbacks) {
              // on startup, the page could be scrolled and we don't want to fire callbacks that didn't toggle. For example onEnter shouldn't fire if the ScrollTrigger isn't actually entered.
              onToggle && toggled && _callback(self, onToggle);
              callbacks[toggleState] && _callback(self, callbacks[toggleState]);
              once && (clipped === 1 ? self.kill(false, 1) : callbacks[toggleState] = 0); // a callback shouldn't be called again if once is true.

              if (!toggled) {
                // it's possible to go completely past, like from before the start to after the end (or vice-versa) in which case BOTH callbacks should be fired in that order
                toggleState = clipped === 1 ? 1 : 3;
                callbacks[toggleState] && _callback(self, callbacks[toggleState]);
              }
            }
            if (fastScrollEnd && !isActive && Math.abs(self.getVelocity()) > (_isNumber$1(fastScrollEnd) ? fastScrollEnd : 2500)) {
              _endAnimation(self.callbackAnimation);
              scrubTween ? scrubTween.progress(1) : _endAnimation(animation, action === "reverse" ? 1 : !clipped, 1);
            }
          } else if (isToggle && onUpdate && !_refreshing) {
            onUpdate(self);
          }
        } // update absolutely-positioned markers (only if the scroller isn't the viewport)

        if (markerEndSetter) {
          var n = containerAnimation ? scroll / containerAnimation.duration() * (containerAnimation._caScrollDist || 0) : scroll;
          markerStartSetter(n + (markerStartTrigger._isFlipped ? 1 : 0));
          markerEndSetter(n);
        }
        caMarkerSetter && caMarkerSetter(-scroll / containerAnimation.duration() * (containerAnimation._caScrollDist || 0));
      };
      self.enable = function (reset, refresh) {
        if (!self.enabled) {
          self.enabled = true;
          _addListener(scroller, "resize", _onResize);
          isViewport || _addListener(scroller, "scroll", _onScroll);
          onRefreshInit && _addListener(ScrollTrigger, "refreshInit", onRefreshInit);
          if (reset !== false) {
            self.progress = prevProgress = 0;
            scroll1 = scroll2 = lastSnap = scrollFunc();
          }
          refresh !== false && self.refresh();
        }
      };
      self.getTween = function (snap) {
        return snap && tweenTo ? tweenTo.tween : scrubTween;
      };
      self.setPositions = function (newStart, newEnd, keepClamp, pinOffset) {
        // doesn't persist after refresh()! Intended to be a way to override values that were set during refresh(), like you could set it in onRefresh()
        if (containerAnimation) {
          // convert ratios into scroll positions. Remember, start/end values on ScrollTriggers that have a containerAnimation refer to the time (in seconds), NOT scroll positions.
          var st = containerAnimation.scrollTrigger,
            duration = containerAnimation.duration(),
            _change = st.end - st.start;
          newStart = st.start + _change * newStart / duration;
          newEnd = st.start + _change * newEnd / duration;
        }
        self.refresh(false, false, {
          start: _keepClamp(newStart, keepClamp && !!self._startClamp),
          end: _keepClamp(newEnd, keepClamp && !!self._endClamp)
        }, pinOffset);
        self.update();
      };
      self.adjustPinSpacing = function (amount) {
        if (spacerState && amount) {
          var i = spacerState.indexOf(direction.d) + 1;
          spacerState[i] = parseFloat(spacerState[i]) + amount + _px;
          spacerState[1] = parseFloat(spacerState[1]) + amount + _px;
          _setState(spacerState);
        }
      };
      self.disable = function (reset, allowAnimation) {
        if (self.enabled) {
          reset !== false && self.revert(true, true);
          self.enabled = self.isActive = false;
          allowAnimation || scrubTween && scrubTween.pause();
          prevScroll = 0;
          pinCache && (pinCache.uncache = 1);
          onRefreshInit && _removeListener(ScrollTrigger, "refreshInit", onRefreshInit);
          if (snapDelayedCall) {
            snapDelayedCall.pause();
            tweenTo.tween && tweenTo.tween.kill() && (tweenTo.tween = 0);
          }
          if (!isViewport) {
            var i = _triggers.length;
            while (i--) {
              if (_triggers[i].scroller === scroller && _triggers[i] !== self) {
                return; //don't remove the listeners if there are still other triggers referencing it.
              }
            }

            _removeListener(scroller, "resize", _onResize);
            isViewport || _removeListener(scroller, "scroll", _onScroll);
          }
        }
      };
      self.kill = function (revert, allowAnimation) {
        self.disable(revert, allowAnimation);
        scrubTween && !allowAnimation && scrubTween.kill();
        id && delete _ids[id];
        var i = _triggers.indexOf(self);
        i >= 0 && _triggers.splice(i, 1);
        i === _i && _direction > 0 && _i--; // if we're in the middle of a refresh() or update(), splicing would cause skips in the index, so adjust...
        // if no other ScrollTrigger instances of the same scroller are found, wipe out any recorded scroll position. Otherwise, in a single page application, for example, it could maintain scroll position when it really shouldn't.

        i = 0;
        _triggers.forEach(function (t) {
          return t.scroller === self.scroller && (i = 1);
        });
        i || _refreshingAll || (self.scroll.rec = 0);
        if (animation) {
          animation.scrollTrigger = null;
          revert && animation.revert({
            kill: false
          });
          allowAnimation || animation.kill();
        }
        markerStart && [markerStart, markerEnd, markerStartTrigger, markerEndTrigger].forEach(function (m) {
          return m.parentNode && m.parentNode.removeChild(m);
        });
        _primary === self && (_primary = 0);
        if (pin) {
          pinCache && (pinCache.uncache = 1);
          i = 0;
          _triggers.forEach(function (t) {
            return t.pin === pin && i++;
          });
          i || (pinCache.spacer = 0); // if there aren't any more ScrollTriggers with the same pin, remove the spacer, otherwise it could be contaminated with old/stale values if the user re-creates a ScrollTrigger for the same element.
        }

        vars.onKill && vars.onKill(self);
      };
      _triggers.push(self);
      self.enable(false, false);
      customRevertReturn && customRevertReturn(self);
      if (animation && animation.add && !change) {
        // if the animation is a timeline, it may not have been populated yet, so it wouldn't render at the proper place on the first refresh(), thus we should schedule one for the next tick. If "change" is defined, we know it must be re-enabling, thus we can refresh() right away.
        var updateFunc = self.update; // some browsers may fire a scroll event BEFORE a tick elapses and/or the DOMContentLoaded fires. So there's a chance update() will be called BEFORE a refresh() has happened on a Timeline-attached ScrollTrigger which means the start/end won't be calculated yet. We don't want to add conditional logic inside the update() method (like check to see if end is defined and if not, force a refresh()) because that's a function that gets hit a LOT (performance). So we swap out the real update() method for this one that'll re-attach it the first time it gets called and of course forces a refresh().

        self.update = function () {
          self.update = updateFunc;
          start || end || self.refresh();
        };
        gsap$2.delayedCall(0.01, self.update);
        change = 0.01;
        start = end = 0;
      } else {
        self.refresh();
      }
      pin && _queueRefreshAll(); // pinning could affect the positions of other things, so make sure we queue a full refresh()
    };

    ScrollTrigger.register = function register(core) {
      if (!_coreInitted$2) {
        gsap$2 = core || _getGSAP$1();
        _windowExists() && window.document && ScrollTrigger.enable();
        _coreInitted$2 = _enabled;
      }
      return _coreInitted$2;
    };
    ScrollTrigger.defaults = function defaults(config) {
      if (config) {
        for (var p in config) {
          _defaults[p] = config[p];
        }
      }
      return _defaults;
    };
    ScrollTrigger.disable = function disable(reset, kill) {
      _enabled = 0;
      _triggers.forEach(function (trigger) {
        return trigger[kill ? "kill" : "disable"](reset);
      });
      _removeListener(_win$1, "wheel", _onScroll);
      _removeListener(_doc$1, "scroll", _onScroll);
      clearInterval(_syncInterval);
      _removeListener(_doc$1, "touchcancel", _passThrough);
      _removeListener(_body, "touchstart", _passThrough);
      _multiListener(_removeListener, _doc$1, "pointerdown,touchstart,mousedown", _pointerDownHandler);
      _multiListener(_removeListener, _doc$1, "pointerup,touchend,mouseup", _pointerUpHandler);
      _resizeDelay.kill();
      _iterateAutoRefresh(_removeListener);
      for (var i = 0; i < _scrollers.length; i += 3) {
        _wheelListener(_removeListener, _scrollers[i], _scrollers[i + 1]);
        _wheelListener(_removeListener, _scrollers[i], _scrollers[i + 2]);
      }
    };
    ScrollTrigger.enable = function enable() {
      _win$1 = window;
      _doc$1 = document;
      _docEl = _doc$1.documentElement;
      _body = _doc$1.body;
      if (gsap$2) {
        _toArray$2 = gsap$2.utils.toArray;
        _clamp = gsap$2.utils.clamp;
        _context$1 = gsap$2.core.context || _passThrough;
        _suppressOverwrites = gsap$2.core.suppressOverwrites || _passThrough;
        _scrollRestoration = _win$1.history.scrollRestoration || "auto";
        _lastScroll = _win$1.pageYOffset;
        gsap$2.core.globals("ScrollTrigger", ScrollTrigger); // must register the global manually because in Internet Explorer, functions (classes) don't have a "name" property.

        if (_body) {
          _enabled = 1;
          _div100vh = document.createElement("div"); // to solve mobile browser address bar show/hide resizing, we shouldn't rely on window.innerHeight. Instead, use a <div> with its height set to 100vh and measure that since that's what the scrolling is based on anyway and it's not affected by address bar showing/hiding.

          _div100vh.style.height = "100vh";
          _div100vh.style.position = "absolute";
          _refresh100vh();
          _rafBugFix();
          Observer.register(gsap$2); // isTouch is 0 if no touch, 1 if ONLY touch, and 2 if it can accommodate touch but also other types like mouse/pointer.

          ScrollTrigger.isTouch = Observer.isTouch;
          _fixIOSBug = Observer.isTouch && /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent); // since 2017, iOS has had a bug that causes event.clientX/Y to be inaccurate when a scroll occurs, thus we must alternate ignoring every other touchmove event to work around it. See https://bugs.webkit.org/show_bug.cgi?id=181954 and https://codepen.io/GreenSock/pen/ExbrPNa/087cef197dc35445a0951e8935c41503

          _ignoreMobileResize = Observer.isTouch === 1;
          _addListener(_win$1, "wheel", _onScroll); // mostly for 3rd party smooth scrolling libraries.

          _root = [_win$1, _doc$1, _docEl, _body];
          if (gsap$2.matchMedia) {
            ScrollTrigger.matchMedia = function (vars) {
              var mm = gsap$2.matchMedia(),
                p;
              for (p in vars) {
                mm.add(p, vars[p]);
              }
              return mm;
            };
            gsap$2.addEventListener("matchMediaInit", function () {
              return _revertAll();
            });
            gsap$2.addEventListener("matchMediaRevert", function () {
              return _revertRecorded();
            });
            gsap$2.addEventListener("matchMedia", function () {
              _refreshAll(0, 1);
              _dispatch("matchMedia");
            });
            gsap$2.matchMedia("(orientation: portrait)", function () {
              // when orientation changes, we should take new base measurements for the ignoreMobileResize feature.
              _setBaseDimensions();
              return _setBaseDimensions;
            });
          } else {
            console.warn("Requires GSAP 3.11.0 or later");
          }
          _setBaseDimensions();
          _addListener(_doc$1, "scroll", _onScroll); // some browsers (like Chrome), the window stops dispatching scroll events on the window if you scroll really fast, but it's consistent on the document!

          var bodyStyle = _body.style,
            border = bodyStyle.borderTopStyle,
            AnimationProto = gsap$2.core.Animation.prototype,
            bounds,
            i;
          AnimationProto.revert || Object.defineProperty(AnimationProto, "revert", {
            value: function value() {
              return this.time(-0.01, true);
            }
          }); // only for backwards compatibility (Animation.revert() was added after 3.10.4)

          bodyStyle.borderTopStyle = "solid"; // works around an issue where a margin of a child element could throw off the bounds of the _body, making it seem like there's a margin when there actually isn't. The border ensures that the bounds are accurate.

          bounds = _getBounds(_body);
          _vertical.m = Math.round(bounds.top + _vertical.sc()) || 0; // accommodate the offset of the <body> caused by margins and/or padding

          _horizontal.m = Math.round(bounds.left + _horizontal.sc()) || 0;
          border ? bodyStyle.borderTopStyle = border : bodyStyle.removeProperty("border-top-style"); // TODO: (?) maybe move to leveraging the velocity mechanism in Observer and skip intervals.

          _syncInterval = setInterval(_sync, 250);
          gsap$2.delayedCall(0.5, function () {
            return _startup = 0;
          });
          _addListener(_doc$1, "touchcancel", _passThrough); // some older Android devices intermittently stop dispatching "touchmove" events if we don't listen for "touchcancel" on the document.

          _addListener(_body, "touchstart", _passThrough); //works around Safari bug: https://gsap.com/forums/topic/21450-draggable-in-iframe-on-mobile-is-buggy/

          _multiListener(_addListener, _doc$1, "pointerdown,touchstart,mousedown", _pointerDownHandler);
          _multiListener(_addListener, _doc$1, "pointerup,touchend,mouseup", _pointerUpHandler);
          _transformProp = gsap$2.utils.checkPrefix("transform");
          _stateProps.push(_transformProp);
          _coreInitted$2 = _getTime();
          _resizeDelay = gsap$2.delayedCall(0.2, _refreshAll).pause();
          _autoRefresh = [_doc$1, "visibilitychange", function () {
            var w = _win$1.innerWidth,
              h = _win$1.innerHeight;
            if (_doc$1.hidden) {
              _prevWidth = w;
              _prevHeight = h;
            } else if (_prevWidth !== w || _prevHeight !== h) {
              _onResize();
            }
          }, _doc$1, "DOMContentLoaded", _refreshAll, _win$1, "load", _refreshAll, _win$1, "resize", _onResize];
          _iterateAutoRefresh(_addListener);
          _triggers.forEach(function (trigger) {
            return trigger.enable(0, 1);
          });
          for (i = 0; i < _scrollers.length; i += 3) {
            _wheelListener(_removeListener, _scrollers[i], _scrollers[i + 1]);
            _wheelListener(_removeListener, _scrollers[i], _scrollers[i + 2]);
          }
        }
      }
    };
    ScrollTrigger.config = function config(vars) {
      "limitCallbacks" in vars && (_limitCallbacks = !!vars.limitCallbacks);
      var ms = vars.syncInterval;
      ms && clearInterval(_syncInterval) || (_syncInterval = ms) && setInterval(_sync, ms);
      "ignoreMobileResize" in vars && (_ignoreMobileResize = ScrollTrigger.isTouch === 1 && vars.ignoreMobileResize);
      if ("autoRefreshEvents" in vars) {
        _iterateAutoRefresh(_removeListener) || _iterateAutoRefresh(_addListener, vars.autoRefreshEvents || "none");
        _ignoreResize = (vars.autoRefreshEvents + "").indexOf("resize") === -1;
      }
    };
    ScrollTrigger.scrollerProxy = function scrollerProxy(target, vars) {
      var t = _getTarget(target),
        i = _scrollers.indexOf(t),
        isViewport = _isViewport(t);
      if (~i) {
        _scrollers.splice(i, isViewport ? 6 : 2);
      }
      if (vars) {
        isViewport ? _proxies.unshift(_win$1, vars, _body, vars, _docEl, vars) : _proxies.unshift(t, vars);
      }
    };
    ScrollTrigger.clearMatchMedia = function clearMatchMedia(query) {
      _triggers.forEach(function (t) {
        return t._ctx && t._ctx.query === query && t._ctx.kill(true, true);
      });
    };
    ScrollTrigger.isInViewport = function isInViewport(element, ratio, horizontal) {
      var bounds = (_isString$1(element) ? _getTarget(element) : element).getBoundingClientRect(),
        offset = bounds[horizontal ? _width : _height] * ratio || 0;
      return horizontal ? bounds.right - offset > 0 && bounds.left + offset < _win$1.innerWidth : bounds.bottom - offset > 0 && bounds.top + offset < _win$1.innerHeight;
    };
    ScrollTrigger.positionInViewport = function positionInViewport(element, referencePoint, horizontal) {
      _isString$1(element) && (element = _getTarget(element));
      var bounds = element.getBoundingClientRect(),
        size = bounds[horizontal ? _width : _height],
        offset = referencePoint == null ? size / 2 : referencePoint in _keywords ? _keywords[referencePoint] * size : ~referencePoint.indexOf("%") ? parseFloat(referencePoint) * size / 100 : parseFloat(referencePoint) || 0;
      return horizontal ? (bounds.left + offset) / _win$1.innerWidth : (bounds.top + offset) / _win$1.innerHeight;
    };
    ScrollTrigger.killAll = function killAll(allowListeners) {
      _triggers.slice(0).forEach(function (t) {
        return t.vars.id !== "ScrollSmoother" && t.kill();
      });
      if (allowListeners !== true) {
        var listeners = _listeners.killAll || [];
        _listeners = {};
        listeners.forEach(function (f) {
          return f();
        });
      }
    };
    return ScrollTrigger;
  }();
  ScrollTrigger.version = "3.12.5";
  ScrollTrigger.saveStyles = function (targets) {
    return targets ? _toArray$2(targets).forEach(function (target) {
      // saved styles are recorded in a consecutive alternating Array, like [element, cssText, transform attribute, cache, matchMedia, ...]
      if (target && target.style) {
        var i = _savedStyles.indexOf(target);
        i >= 0 && _savedStyles.splice(i, 5);
        _savedStyles.push(target, target.style.cssText, target.getBBox && target.getAttribute("transform"), gsap$2.core.getCache(target), _context$1());
      }
    }) : _savedStyles;
  };
  ScrollTrigger.revert = function (soft, media) {
    return _revertAll(!soft, media);
  };
  ScrollTrigger.create = function (vars, animation) {
    return new ScrollTrigger(vars, animation);
  };
  ScrollTrigger.refresh = function (safe) {
    return safe ? _onResize() : (_coreInitted$2 || ScrollTrigger.register()) && _refreshAll(true);
  };
  ScrollTrigger.update = function (force) {
    return ++_scrollers.cache && _updateAll(force === true ? 2 : 0);
  };
  ScrollTrigger.clearScrollMemory = _clearScrollMemory;
  ScrollTrigger.maxScroll = function (element, horizontal) {
    return _maxScroll(element, horizontal ? _horizontal : _vertical);
  };
  ScrollTrigger.getScrollFunc = function (element, horizontal) {
    return _getScrollFunc(_getTarget(element), horizontal ? _horizontal : _vertical);
  };
  ScrollTrigger.getById = function (id) {
    return _ids[id];
  };
  ScrollTrigger.getAll = function () {
    return _triggers.filter(function (t) {
      return t.vars.id !== "ScrollSmoother";
    });
  }; // it's common for people to ScrollTrigger.getAll(t => t.kill()) on page routes, for example, and we don't want it to ruin smooth scrolling by killing the main ScrollSmoother one.

  ScrollTrigger.isScrolling = function () {
    return !!_lastScrollTime;
  };
  ScrollTrigger.snapDirectional = _snapDirectional;
  ScrollTrigger.addEventListener = function (type, callback) {
    var a = _listeners[type] || (_listeners[type] = []);
    ~a.indexOf(callback) || a.push(callback);
  };
  ScrollTrigger.removeEventListener = function (type, callback) {
    var a = _listeners[type],
      i = a && a.indexOf(callback);
    i >= 0 && a.splice(i, 1);
  };
  ScrollTrigger.batch = function (targets, vars) {
    var result = [],
      varsCopy = {},
      interval = vars.interval || 0.016,
      batchMax = vars.batchMax || 1e9,
      proxyCallback = function proxyCallback(type, callback) {
        var elements = [],
          triggers = [],
          delay = gsap$2.delayedCall(interval, function () {
            callback(elements, triggers);
            elements = [];
            triggers = [];
          }).pause();
        return function (self) {
          elements.length || delay.restart(true);
          elements.push(self.trigger);
          triggers.push(self);
          batchMax <= elements.length && delay.progress(1);
        };
      },
      p;
    for (p in vars) {
      varsCopy[p] = p.substr(0, 2) === "on" && _isFunction$1(vars[p]) && p !== "onRefreshInit" ? proxyCallback(p, vars[p]) : vars[p];
    }
    if (_isFunction$1(batchMax)) {
      batchMax = batchMax();
      _addListener(ScrollTrigger, "refresh", function () {
        return batchMax = vars.batchMax();
      });
    }
    _toArray$2(targets).forEach(function (target) {
      var config = {};
      for (p in varsCopy) {
        config[p] = varsCopy[p];
      }
      config.trigger = target;
      result.push(ScrollTrigger.create(config));
    });
    return result;
  }; // to reduce file size. clamps the scroll and also returns a duration multiplier so that if the scroll gets chopped shorter, the duration gets curtailed as well (otherwise if you're very close to the top of the page, for example, and swipe up really fast, it'll suddenly slow down and take a long time to reach the top).

  var _clampScrollAndGetDurationMultiplier = function _clampScrollAndGetDurationMultiplier(scrollFunc, current, end, max) {
      current > max ? scrollFunc(max) : current < 0 && scrollFunc(0);
      return end > max ? (max - current) / (end - current) : end < 0 ? current / (current - end) : 1;
    },
    _allowNativePanning = function _allowNativePanning(target, direction) {
      if (direction === true) {
        target.style.removeProperty("touch-action");
      } else {
        target.style.touchAction = direction === true ? "auto" : direction ? "pan-" + direction + (Observer.isTouch ? " pinch-zoom" : "") : "none"; // note: Firefox doesn't support it pinch-zoom properly, at least in addition to a pan-x or pan-y.
      }

      target === _docEl && _allowNativePanning(_body, direction);
    },
    _overflow = {
      auto: 1,
      scroll: 1
    },
    _nestedScroll = function _nestedScroll(_ref5) {
      var event = _ref5.event,
        target = _ref5.target,
        axis = _ref5.axis;
      var node = (event.changedTouches ? event.changedTouches[0] : event).target,
        cache = node._gsap || gsap$2.core.getCache(node),
        time = _getTime(),
        cs;
      if (!cache._isScrollT || time - cache._isScrollT > 2000) {
        // cache for 2 seconds to improve performance.
        while (node && node !== _body && (node.scrollHeight <= node.clientHeight && node.scrollWidth <= node.clientWidth || !(_overflow[(cs = _getComputedStyle$1(node)).overflowY] || _overflow[cs.overflowX]))) {
          node = node.parentNode;
        }
        cache._isScroll = node && node !== target && !_isViewport(node) && (_overflow[(cs = _getComputedStyle$1(node)).overflowY] || _overflow[cs.overflowX]);
        cache._isScrollT = time;
      }
      if (cache._isScroll || axis === "x") {
        event.stopPropagation();
        event._gsapAllow = true;
      }
    },
    // capture events on scrollable elements INSIDE the <body> and allow those by calling stopPropagation() when we find a scrollable ancestor
    _inputObserver = function _inputObserver(target, type, inputs, nested) {
      return Observer.create({
        target: target,
        capture: true,
        debounce: false,
        lockAxis: true,
        type: type,
        onWheel: nested = nested && _nestedScroll,
        onPress: nested,
        onDrag: nested,
        onScroll: nested,
        onEnable: function onEnable() {
          return inputs && _addListener(_doc$1, Observer.eventTypes[0], _captureInputs, false, true);
        },
        onDisable: function onDisable() {
          return _removeListener(_doc$1, Observer.eventTypes[0], _captureInputs, true);
        }
      });
    },
    _inputExp = /(input|label|select|textarea)/i,
    _inputIsFocused,
    _captureInputs = function _captureInputs(e) {
      var isInput = _inputExp.test(e.target.tagName);
      if (isInput || _inputIsFocused) {
        e._gsapAllow = true;
        _inputIsFocused = isInput;
      }
    },
    _getScrollNormalizer = function _getScrollNormalizer(vars) {
      _isObject(vars) || (vars = {});
      vars.preventDefault = vars.isNormalizer = vars.allowClicks = true;
      vars.type || (vars.type = "wheel,touch");
      vars.debounce = !!vars.debounce;
      vars.id = vars.id || "normalizer";
      var _vars2 = vars,
        normalizeScrollX = _vars2.normalizeScrollX,
        momentum = _vars2.momentum,
        allowNestedScroll = _vars2.allowNestedScroll,
        onRelease = _vars2.onRelease,
        self,
        maxY,
        target = _getTarget(vars.target) || _docEl,
        smoother = gsap$2.core.globals().ScrollSmoother,
        smootherInstance = smoother && smoother.get(),
        content = _fixIOSBug && (vars.content && _getTarget(vars.content) || smootherInstance && vars.content !== false && !smootherInstance.smooth() && smootherInstance.content()),
        scrollFuncY = _getScrollFunc(target, _vertical),
        scrollFuncX = _getScrollFunc(target, _horizontal),
        scale = 1,
        initialScale = (Observer.isTouch && _win$1.visualViewport ? _win$1.visualViewport.scale * _win$1.visualViewport.width : _win$1.outerWidth) / _win$1.innerWidth,
        wheelRefresh = 0,
        resolveMomentumDuration = _isFunction$1(momentum) ? function () {
          return momentum(self);
        } : function () {
          return momentum || 2.8;
        },
        lastRefreshID,
        skipTouchMove,
        inputObserver = _inputObserver(target, vars.type, true, allowNestedScroll),
        resumeTouchMove = function resumeTouchMove() {
          return skipTouchMove = false;
        },
        scrollClampX = _passThrough,
        scrollClampY = _passThrough,
        updateClamps = function updateClamps() {
          maxY = _maxScroll(target, _vertical);
          scrollClampY = _clamp(_fixIOSBug ? 1 : 0, maxY);
          normalizeScrollX && (scrollClampX = _clamp(0, _maxScroll(target, _horizontal)));
          lastRefreshID = _refreshID;
        },
        removeContentOffset = function removeContentOffset() {
          content._gsap.y = _round$1(parseFloat(content._gsap.y) + scrollFuncY.offset) + "px";
          content.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + parseFloat(content._gsap.y) + ", 0, 1)";
          scrollFuncY.offset = scrollFuncY.cacheID = 0;
        },
        ignoreDrag = function ignoreDrag() {
          if (skipTouchMove) {
            requestAnimationFrame(resumeTouchMove);
            var offset = _round$1(self.deltaY / 2),
              scroll = scrollClampY(scrollFuncY.v - offset);
            if (content && scroll !== scrollFuncY.v + scrollFuncY.offset) {
              scrollFuncY.offset = scroll - scrollFuncY.v;
              var y = _round$1((parseFloat(content && content._gsap.y) || 0) - scrollFuncY.offset);
              content.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + y + ", 0, 1)";
              content._gsap.y = y + "px";
              scrollFuncY.cacheID = _scrollers.cache;
              _updateAll();
            }
            return true;
          }
          scrollFuncY.offset && removeContentOffset();
          skipTouchMove = true;
        },
        tween,
        startScrollX,
        startScrollY,
        onStopDelayedCall,
        onResize = function onResize() {
          // if the window resizes, like on an iPhone which Apple FORCES the address bar to show/hide even if we event.preventDefault(), it may be scrolling too far now that the address bar is showing, so we must dynamically adjust the momentum tween.
          updateClamps();
          if (tween.isActive() && tween.vars.scrollY > maxY) {
            scrollFuncY() > maxY ? tween.progress(1) && scrollFuncY(maxY) : tween.resetTo("scrollY", maxY);
          }
        };
      content && gsap$2.set(content, {
        y: "+=0"
      }); // to ensure there's a cache (element._gsap)

      vars.ignoreCheck = function (e) {
        return _fixIOSBug && e.type === "touchmove" && ignoreDrag() || scale > 1.05 && e.type !== "touchstart" || self.isGesturing || e.touches && e.touches.length > 1;
      };
      vars.onPress = function () {
        skipTouchMove = false;
        var prevScale = scale;
        scale = _round$1((_win$1.visualViewport && _win$1.visualViewport.scale || 1) / initialScale);
        tween.pause();
        prevScale !== scale && _allowNativePanning(target, scale > 1.01 ? true : normalizeScrollX ? false : "x");
        startScrollX = scrollFuncX();
        startScrollY = scrollFuncY();
        updateClamps();
        lastRefreshID = _refreshID;
      };
      vars.onRelease = vars.onGestureStart = function (self, wasDragging) {
        scrollFuncY.offset && removeContentOffset();
        if (!wasDragging) {
          onStopDelayedCall.restart(true);
        } else {
          _scrollers.cache++; // make sure we're pulling the non-cached value
          // alternate algorithm: durX = Math.min(6, Math.abs(self.velocityX / 800)),	dur = Math.max(durX, Math.min(6, Math.abs(self.velocityY / 800))); dur = dur * (0.4 + (1 - _power4In(dur / 6)) * 0.6)) * (momentumSpeed || 1)

          var dur = resolveMomentumDuration(),
            currentScroll,
            endScroll;
          if (normalizeScrollX) {
            currentScroll = scrollFuncX();
            endScroll = currentScroll + dur * 0.05 * -self.velocityX / 0.227; // the constant .227 is from power4(0.05). velocity is inverted because scrolling goes in the opposite direction.

            dur *= _clampScrollAndGetDurationMultiplier(scrollFuncX, currentScroll, endScroll, _maxScroll(target, _horizontal));
            tween.vars.scrollX = scrollClampX(endScroll);
          }
          currentScroll = scrollFuncY();
          endScroll = currentScroll + dur * 0.05 * -self.velocityY / 0.227; // the constant .227 is from power4(0.05)

          dur *= _clampScrollAndGetDurationMultiplier(scrollFuncY, currentScroll, endScroll, _maxScroll(target, _vertical));
          tween.vars.scrollY = scrollClampY(endScroll);
          tween.invalidate().duration(dur).play(0.01);
          if (_fixIOSBug && tween.vars.scrollY >= maxY || currentScroll >= maxY - 1) {
            // iOS bug: it'll show the address bar but NOT fire the window "resize" event until the animation is done but we must protect against overshoot so we leverage an onUpdate to do so.
            gsap$2.to({}, {
              onUpdate: onResize,
              duration: dur
            });
          }
        }
        onRelease && onRelease(self);
      };
      vars.onWheel = function () {
        tween._ts && tween.pause();
        if (_getTime() - wheelRefresh > 1000) {
          // after 1 second, refresh the clamps otherwise that'll only happen when ScrollTrigger.refresh() is called or for touch-scrolling.
          lastRefreshID = 0;
          wheelRefresh = _getTime();
        }
      };
      vars.onChange = function (self, dx, dy, xArray, yArray) {
        _refreshID !== lastRefreshID && updateClamps();
        dx && normalizeScrollX && scrollFuncX(scrollClampX(xArray[2] === dx ? startScrollX + (self.startX - self.x) : scrollFuncX() + dx - xArray[1])); // for more precision, we track pointer/touch movement from the start, otherwise it'll drift.

        if (dy) {
          scrollFuncY.offset && removeContentOffset();
          var isTouch = yArray[2] === dy,
            y = isTouch ? startScrollY + self.startY - self.y : scrollFuncY() + dy - yArray[1],
            yClamped = scrollClampY(y);
          isTouch && y !== yClamped && (startScrollY += yClamped - y);
          scrollFuncY(yClamped);
        }
        (dy || dx) && _updateAll();
      };
      vars.onEnable = function () {
        _allowNativePanning(target, normalizeScrollX ? false : "x");
        ScrollTrigger.addEventListener("refresh", onResize);
        _addListener(_win$1, "resize", onResize);
        if (scrollFuncY.smooth) {
          scrollFuncY.target.style.scrollBehavior = "auto";
          scrollFuncY.smooth = scrollFuncX.smooth = false;
        }
        inputObserver.enable();
      };
      vars.onDisable = function () {
        _allowNativePanning(target, true);
        _removeListener(_win$1, "resize", onResize);
        ScrollTrigger.removeEventListener("refresh", onResize);
        inputObserver.kill();
      };
      vars.lockAxis = vars.lockAxis !== false;
      self = new Observer(vars);
      self.iOS = _fixIOSBug; // used in the Observer getCachedScroll() function to work around an iOS bug that wreaks havoc with TouchEvent.clientY if we allow scroll to go all the way back to 0.

      _fixIOSBug && !scrollFuncY() && scrollFuncY(1); // iOS bug causes event.clientY values to freak out (wildly inaccurate) if the scroll position is exactly 0.

      _fixIOSBug && gsap$2.ticker.add(_passThrough); // prevent the ticker from sleeping

      onStopDelayedCall = self._dc;
      tween = gsap$2.to(self, {
        ease: "power4",
        paused: true,
        inherit: false,
        scrollX: normalizeScrollX ? "+=0.1" : "+=0",
        scrollY: "+=0.1",
        modifiers: {
          scrollY: _interruptionTracker(scrollFuncY, scrollFuncY(), function () {
            return tween.pause();
          })
        },
        onUpdate: _updateAll,
        onComplete: onStopDelayedCall.vars.onComplete
      }); // we need the modifier to sense if the scroll position is altered outside of the momentum tween (like with a scrollTo tween) so we can pause() it to prevent conflicts.

      return self;
    };
  ScrollTrigger.sort = function (func) {
    return _triggers.sort(func || function (a, b) {
      return (a.vars.refreshPriority || 0) * -1e6 + a.start - (b.start + (b.vars.refreshPriority || 0) * -1e6);
    });
  };
  ScrollTrigger.observe = function (vars) {
    return new Observer(vars);
  };
  ScrollTrigger.normalizeScroll = function (vars) {
    if (typeof vars === "undefined") {
      return _normalizer;
    }
    if (vars === true && _normalizer) {
      return _normalizer.enable();
    }
    if (vars === false) {
      _normalizer && _normalizer.kill();
      _normalizer = vars;
      return;
    }
    var normalizer = vars instanceof Observer ? vars : _getScrollNormalizer(vars);
    _normalizer && _normalizer.target === normalizer.target && _normalizer.kill();
    _isViewport(normalizer.target) && (_normalizer = normalizer);
    return normalizer;
  };
  ScrollTrigger.core = {
    // smaller file size way to leverage in ScrollSmoother and Observer
    _getVelocityProp: _getVelocityProp,
    _inputObserver: _inputObserver,
    _scrollers: _scrollers,
    _proxies: _proxies,
    bridge: {
      // when normalizeScroll sets the scroll position (ss = setScroll)
      ss: function ss() {
        _lastScrollTime || _dispatch("scrollStart");
        _lastScrollTime = _getTime();
      },
      // a way to get the _refreshing value in Observer
      ref: function ref() {
        return _refreshing;
      }
    }
  };
  _getGSAP$1() && gsap$2.registerPlugin(ScrollTrigger);

  /*!
   * paths 3.12.5
   * https://gsap.com
   *
   * Copyright 2008-2024, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license or for
   * Club GSAP members, the agreement issued with that membership.
   * @author: Jack Doyle, jack@greensock.com
  */

  /* eslint-disable */
  var _svgPathExp = /[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig,
    _numbersExp = /(?:(-)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig,
    _scientific = /[\+\-]?\d*\.?\d+e[\+\-]?\d+/ig,
    _selectorExp$1 = /(^[#\.][a-z]|[a-y][a-z])/i,
    _DEG2RAD = Math.PI / 180,
    _sin$1 = Math.sin,
    _cos$1 = Math.cos,
    _abs = Math.abs,
    _sqrt$1 = Math.sqrt,
    _isString = function _isString(value) {
      return typeof value === "string";
    },
    _isNumber = function _isNumber(value) {
      return typeof value === "number";
    },
    _roundingNum = 1e5,
    //if progress lands on 1, the % will make it 0 which is why we || 1, but not if it's negative because it makes more sense for motion to end at 0 in that case.
    _round = function _round(value) {
      return Math.round(value * _roundingNum) / _roundingNum || 0;
    };
  /* TERMINOLOGY
   - RawPath - an array of arrays, one for each Segment. A single RawPath could have multiple "M" commands, defining Segments (paths aren't always connected).
   - Segment - an array containing a sequence of Cubic Bezier coordinates in alternating x, y, x, y format. Starting anchor, then control point 1, control point 2, and ending anchor, then the next control point 1, control point 2, anchor, etc. Uses less memory than an array with a bunch of {x, y} points.
   - Bezier - a single cubic Bezier with a starting anchor, two control points, and an ending anchor.
   - the variable "t" is typically the position along an individual Bezier path (time) and it's NOT linear, meaning it could accelerate/decelerate based on the control points whereas the "p" or "progress" value is linearly mapped to the whole path, so it shouldn't really accelerate/decelerate based on control points. So a progress of 0.2 would be almost exactly 20% along the path. "t" is ONLY in an individual Bezier piece.
   */
  //accepts basic selector text, a path instance, a RawPath instance, or a Segment and returns a RawPath (makes it easy to homogenize things). If an element or selector text is passed in, it'll also cache the value so that if it's queried again, it'll just take the path data from there instead of parsing it all over again (as long as the path data itself hasn't changed - it'll check).

  function getRawPath(value) {
    value = _isString(value) && _selectorExp$1.test(value) ? document.querySelector(value) || value : value;
    var e = value.getAttribute ? value : 0,
      rawPath;
    if (e && (value = value.getAttribute("d"))) {
      //implements caching
      if (!e._gsPath) {
        e._gsPath = {};
      }
      rawPath = e._gsPath[value];
      return rawPath && !rawPath._dirty ? rawPath : e._gsPath[value] = stringToRawPath(value);
    }
    return !value ? console.warn("Expecting a <path> element or an SVG path data string") : _isString(value) ? stringToRawPath(value) : _isNumber(value[0]) ? [value] : value;
  } //copies a RawPath WITHOUT the length meta data (for speed)
  function reverseSegment(segment) {
    var i = 0,
      y;
    segment.reverse(); //this will invert the order y, x, y, x so we must flip it back.

    for (; i < segment.length; i += 2) {
      y = segment[i];
      segment[i] = segment[i + 1];
      segment[i + 1] = y;
    }
    segment.reversed = !segment.reversed;
  }
  var _createPath = function _createPath(e, ignore) {
      var path = document.createElementNS("http://www.w3.org/2000/svg", "path"),
        attr = [].slice.call(e.attributes),
        i = attr.length,
        name;
      ignore = "," + ignore + ",";
      while (--i > -1) {
        name = attr[i].nodeName.toLowerCase(); //in Microsoft Edge, if you don't set the attribute with a lowercase name, it doesn't render correctly! Super weird.

        if (ignore.indexOf("," + name + ",") < 0) {
          path.setAttributeNS(null, name, attr[i].nodeValue);
        }
      }
      return path;
    },
    _typeAttrs = {
      rect: "rx,ry,x,y,width,height",
      circle: "r,cx,cy",
      ellipse: "rx,ry,cx,cy",
      line: "x1,x2,y1,y2"
    },
    _attrToObj = function _attrToObj(e, attrs) {
      var props = attrs ? attrs.split(",") : [],
        obj = {},
        i = props.length;
      while (--i > -1) {
        obj[props[i]] = +e.getAttribute(props[i]) || 0;
      }
      return obj;
    }; //converts an SVG shape like <circle>, <rect>, <polygon>, <polyline>, <ellipse>, etc. to a <path>, swapping it in and copying the attributes to match.

  function convertToPath(element, swap) {
    var type = element.tagName.toLowerCase(),
      circ = 0.552284749831,
      data,
      x,
      y,
      r,
      ry,
      path,
      rcirc,
      rycirc,
      points,
      w,
      h,
      x2,
      x3,
      x4,
      x5,
      x6,
      y2,
      y3,
      y4,
      y5,
      y6,
      attr;
    if (type === "path" || !element.getBBox) {
      return element;
    }
    path = _createPath(element, "x,y,width,height,cx,cy,rx,ry,r,x1,x2,y1,y2,points");
    attr = _attrToObj(element, _typeAttrs[type]);
    if (type === "rect") {
      r = attr.rx;
      ry = attr.ry || r;
      x = attr.x;
      y = attr.y;
      w = attr.width - r * 2;
      h = attr.height - ry * 2;
      if (r || ry) {
        //if there are rounded corners, render cubic beziers
        x2 = x + r * (1 - circ);
        x3 = x + r;
        x4 = x3 + w;
        x5 = x4 + r * circ;
        x6 = x4 + r;
        y2 = y + ry * (1 - circ);
        y3 = y + ry;
        y4 = y3 + h;
        y5 = y4 + ry * circ;
        y6 = y4 + ry;
        data = "M" + x6 + "," + y3 + " V" + y4 + " C" + [x6, y5, x5, y6, x4, y6, x4 - (x4 - x3) / 3, y6, x3 + (x4 - x3) / 3, y6, x3, y6, x2, y6, x, y5, x, y4, x, y4 - (y4 - y3) / 3, x, y3 + (y4 - y3) / 3, x, y3, x, y2, x2, y, x3, y, x3 + (x4 - x3) / 3, y, x4 - (x4 - x3) / 3, y, x4, y, x5, y, x6, y2, x6, y3].join(",") + "z";
      } else {
        data = "M" + (x + w) + "," + y + " v" + h + " h" + -w + " v" + -h + " h" + w + "z";
      }
    } else if (type === "circle" || type === "ellipse") {
      if (type === "circle") {
        r = ry = attr.r;
        rycirc = r * circ;
      } else {
        r = attr.rx;
        ry = attr.ry;
        rycirc = ry * circ;
      }
      x = attr.cx;
      y = attr.cy;
      rcirc = r * circ;
      data = "M" + (x + r) + "," + y + " C" + [x + r, y + rycirc, x + rcirc, y + ry, x, y + ry, x - rcirc, y + ry, x - r, y + rycirc, x - r, y, x - r, y - rycirc, x - rcirc, y - ry, x, y - ry, x + rcirc, y - ry, x + r, y - rycirc, x + r, y].join(",") + "z";
    } else if (type === "line") {
      data = "M" + attr.x1 + "," + attr.y1 + " L" + attr.x2 + "," + attr.y2; //previously, we just converted to "Mx,y Lx,y" but Safari has bugs that cause that not to render properly when using a stroke-dasharray that's not fully visible! Using a cubic bezier fixes that issue.
    } else if (type === "polyline" || type === "polygon") {
      points = (element.getAttribute("points") + "").match(_numbersExp) || [];
      x = points.shift();
      y = points.shift();
      data = "M" + x + "," + y + " L" + points.join(",");
      if (type === "polygon") {
        data += "," + x + "," + y + "z";
      }
    }
    path.setAttribute("d", rawPathToString(path._gsRawPath = stringToRawPath(data)));
    if (swap && element.parentNode) {
      element.parentNode.insertBefore(path, element);
      element.parentNode.removeChild(element);
    }
    return path;
  } //returns the rotation (in degrees) at a particular progress on a rawPath (the slope of the tangent)

  function arcToSegment(lastX, lastY, rx, ry, angle, largeArcFlag, sweepFlag, x, y) {
    if (lastX === x && lastY === y) {
      return;
    }
    rx = _abs(rx);
    ry = _abs(ry);
    var angleRad = angle % 360 * _DEG2RAD,
      cosAngle = _cos$1(angleRad),
      sinAngle = _sin$1(angleRad),
      PI = Math.PI,
      TWOPI = PI * 2,
      dx2 = (lastX - x) / 2,
      dy2 = (lastY - y) / 2,
      x1 = cosAngle * dx2 + sinAngle * dy2,
      y1 = -sinAngle * dx2 + cosAngle * dy2,
      x1_sq = x1 * x1,
      y1_sq = y1 * y1,
      radiiCheck = x1_sq / (rx * rx) + y1_sq / (ry * ry);
    if (radiiCheck > 1) {
      rx = _sqrt$1(radiiCheck) * rx;
      ry = _sqrt$1(radiiCheck) * ry;
    }
    var rx_sq = rx * rx,
      ry_sq = ry * ry,
      sq = (rx_sq * ry_sq - rx_sq * y1_sq - ry_sq * x1_sq) / (rx_sq * y1_sq + ry_sq * x1_sq);
    if (sq < 0) {
      sq = 0;
    }
    var coef = (largeArcFlag === sweepFlag ? -1 : 1) * _sqrt$1(sq),
      cx1 = coef * (rx * y1 / ry),
      cy1 = coef * -(ry * x1 / rx),
      sx2 = (lastX + x) / 2,
      sy2 = (lastY + y) / 2,
      cx = sx2 + (cosAngle * cx1 - sinAngle * cy1),
      cy = sy2 + (sinAngle * cx1 + cosAngle * cy1),
      ux = (x1 - cx1) / rx,
      uy = (y1 - cy1) / ry,
      vx = (-x1 - cx1) / rx,
      vy = (-y1 - cy1) / ry,
      temp = ux * ux + uy * uy,
      angleStart = (uy < 0 ? -1 : 1) * Math.acos(ux / _sqrt$1(temp)),
      angleExtent = (ux * vy - uy * vx < 0 ? -1 : 1) * Math.acos((ux * vx + uy * vy) / _sqrt$1(temp * (vx * vx + vy * vy)));
    isNaN(angleExtent) && (angleExtent = PI); //rare edge case. Math.cos(-1) is NaN.

    if (!sweepFlag && angleExtent > 0) {
      angleExtent -= TWOPI;
    } else if (sweepFlag && angleExtent < 0) {
      angleExtent += TWOPI;
    }
    angleStart %= TWOPI;
    angleExtent %= TWOPI;
    var segments = Math.ceil(_abs(angleExtent) / (TWOPI / 4)),
      rawPath = [],
      angleIncrement = angleExtent / segments,
      controlLength = 4 / 3 * _sin$1(angleIncrement / 2) / (1 + _cos$1(angleIncrement / 2)),
      ma = cosAngle * rx,
      mb = sinAngle * rx,
      mc = sinAngle * -ry,
      md = cosAngle * ry,
      i;
    for (i = 0; i < segments; i++) {
      angle = angleStart + i * angleIncrement;
      x1 = _cos$1(angle);
      y1 = _sin$1(angle);
      ux = _cos$1(angle += angleIncrement);
      uy = _sin$1(angle);
      rawPath.push(x1 - controlLength * y1, y1 + controlLength * x1, ux + controlLength * uy, uy - controlLength * ux, ux, uy);
    } //now transform according to the actual size of the ellipse/arc (the beziers were noramlized, between 0 and 1 on a circle).

    for (i = 0; i < rawPath.length; i += 2) {
      x1 = rawPath[i];
      y1 = rawPath[i + 1];
      rawPath[i] = x1 * ma + y1 * mc + cx;
      rawPath[i + 1] = x1 * mb + y1 * md + cy;
    }
    rawPath[i - 2] = x; //always set the end to exactly where it's supposed to be

    rawPath[i - 1] = y;
    return rawPath;
  } //Spits back a RawPath with absolute coordinates. Each segment starts with a "moveTo" command (x coordinate, then y) and then 2 control points (x, y, x, y), then anchor. The goal is to minimize memory and maximize speed.

  function stringToRawPath(d) {
    var a = (d + "").replace(_scientific, function (m) {
        var n = +m;
        return n < 0.0001 && n > -0.0001 ? 0 : n;
      }).match(_svgPathExp) || [],
      //some authoring programs spit out very small numbers in scientific notation like "1e-5", so make sure we round that down to 0 first.
      path = [],
      relativeX = 0,
      relativeY = 0,
      twoThirds = 2 / 3,
      elements = a.length,
      points = 0,
      errorMessage = "ERROR: malformed path: " + d,
      i,
      j,
      x,
      y,
      command,
      isRelative,
      segment,
      startX,
      startY,
      difX,
      difY,
      beziers,
      prevCommand,
      flag1,
      flag2,
      line = function line(sx, sy, ex, ey) {
        difX = (ex - sx) / 3;
        difY = (ey - sy) / 3;
        segment.push(sx + difX, sy + difY, ex - difX, ey - difY, ex, ey);
      };
    if (!d || !isNaN(a[0]) || isNaN(a[1])) {
      console.log(errorMessage);
      return path;
    }
    for (i = 0; i < elements; i++) {
      prevCommand = command;
      if (isNaN(a[i])) {
        command = a[i].toUpperCase();
        isRelative = command !== a[i]; //lower case means relative
      } else {
        //commands like "C" can be strung together without any new command characters between.
        i--;
      }
      x = +a[i + 1];
      y = +a[i + 2];
      if (isRelative) {
        x += relativeX;
        y += relativeY;
      }
      if (!i) {
        startX = x;
        startY = y;
      } // "M" (move)

      if (command === "M") {
        if (segment) {
          if (segment.length < 8) {
            //if the path data was funky and just had a M with no actual drawing anywhere, skip it.
            path.length -= 1;
          } else {
            points += segment.length;
          }
        }
        relativeX = startX = x;
        relativeY = startY = y;
        segment = [x, y];
        path.push(segment);
        i += 2;
        command = "L"; //an "M" with more than 2 values gets interpreted as "lineTo" commands ("L").
        // "C" (cubic bezier)
      } else if (command === "C") {
        if (!segment) {
          segment = [0, 0];
        }
        if (!isRelative) {
          relativeX = relativeY = 0;
        } //note: "*1" is just a fast/short way to cast the value as a Number. WAAAY faster in Chrome, slightly slower in Firefox.

        segment.push(x, y, relativeX + a[i + 3] * 1, relativeY + a[i + 4] * 1, relativeX += a[i + 5] * 1, relativeY += a[i + 6] * 1);
        i += 6; // "S" (continuation of cubic bezier)
      } else if (command === "S") {
        difX = relativeX;
        difY = relativeY;
        if (prevCommand === "C" || prevCommand === "S") {
          difX += relativeX - segment[segment.length - 4];
          difY += relativeY - segment[segment.length - 3];
        }
        if (!isRelative) {
          relativeX = relativeY = 0;
        }
        segment.push(difX, difY, x, y, relativeX += a[i + 3] * 1, relativeY += a[i + 4] * 1);
        i += 4; // "Q" (quadratic bezier)
      } else if (command === "Q") {
        difX = relativeX + (x - relativeX) * twoThirds;
        difY = relativeY + (y - relativeY) * twoThirds;
        if (!isRelative) {
          relativeX = relativeY = 0;
        }
        relativeX += a[i + 3] * 1;
        relativeY += a[i + 4] * 1;
        segment.push(difX, difY, relativeX + (x - relativeX) * twoThirds, relativeY + (y - relativeY) * twoThirds, relativeX, relativeY);
        i += 4; // "T" (continuation of quadratic bezier)
      } else if (command === "T") {
        difX = relativeX - segment[segment.length - 4];
        difY = relativeY - segment[segment.length - 3];
        segment.push(relativeX + difX, relativeY + difY, x + (relativeX + difX * 1.5 - x) * twoThirds, y + (relativeY + difY * 1.5 - y) * twoThirds, relativeX = x, relativeY = y);
        i += 2; // "H" (horizontal line)
      } else if (command === "H") {
        line(relativeX, relativeY, relativeX = x, relativeY);
        i += 1; // "V" (vertical line)
      } else if (command === "V") {
        //adjust values because the first (and only one) isn't x in this case, it's y.
        line(relativeX, relativeY, relativeX, relativeY = x + (isRelative ? relativeY - relativeX : 0));
        i += 1; // "L" (line) or "Z" (close)
      } else if (command === "L" || command === "Z") {
        if (command === "Z") {
          x = startX;
          y = startY;
          segment.closed = true;
        }
        if (command === "L" || _abs(relativeX - x) > 0.5 || _abs(relativeY - y) > 0.5) {
          line(relativeX, relativeY, x, y);
          if (command === "L") {
            i += 2;
          }
        }
        relativeX = x;
        relativeY = y; // "A" (arc)
      } else if (command === "A") {
        flag1 = a[i + 4];
        flag2 = a[i + 5];
        difX = a[i + 6];
        difY = a[i + 7];
        j = 7;
        if (flag1.length > 1) {
          // for cases when the flags are merged, like "a8 8 0 018 8" (the 0 and 1 flags are WITH the x value of 8, but it could also be "a8 8 0 01-8 8" so it may include x or not)
          if (flag1.length < 3) {
            difY = difX;
            difX = flag2;
            j--;
          } else {
            difY = flag2;
            difX = flag1.substr(2);
            j -= 2;
          }
          flag2 = flag1.charAt(1);
          flag1 = flag1.charAt(0);
        }
        beziers = arcToSegment(relativeX, relativeY, +a[i + 1], +a[i + 2], +a[i + 3], +flag1, +flag2, (isRelative ? relativeX : 0) + difX * 1, (isRelative ? relativeY : 0) + difY * 1);
        i += j;
        if (beziers) {
          for (j = 0; j < beziers.length; j++) {
            segment.push(beziers[j]);
          }
        }
        relativeX = segment[segment.length - 2];
        relativeY = segment[segment.length - 1];
      } else {
        console.log(errorMessage);
      }
    }
    i = segment.length;
    if (i < 6) {
      //in case there's odd SVG like a M0,0 command at the very end.
      path.pop();
      i = 0;
    } else if (segment[0] === segment[i - 2] && segment[1] === segment[i - 1]) {
      segment.closed = true;
    }
    path.totalPoints = points + i;
    return path;
  } //populates the points array in alternating x/y values (like [x, y, x, y...] instead of individual point objects [{x, y}, {x, y}...] to conserve memory and stay in line with how we're handling segment arrays
  /*
  Takes any of the following and converts it to an all Cubic Bezier SVG data string:
  - A <path> data string like "M0,0 L2,4 v20,15 H100"
  - A RawPath, like [[x, y, x, y, x, y, x, y][[x, y, x, y, x, y, x, y]]
  - A Segment, like [x, y, x, y, x, y, x, y]

  Note: all numbers are rounded down to the closest 0.001 to minimize memory, maximize speed, and avoid odd numbers like 1e-13
  */

  function rawPathToString(rawPath) {
    if (_isNumber(rawPath[0])) {
      //in case a segment is passed in instead
      rawPath = [rawPath];
    }
    var result = "",
      l = rawPath.length,
      sl,
      s,
      i,
      segment;
    for (s = 0; s < l; s++) {
      segment = rawPath[s];
      result += "M" + _round(segment[0]) + "," + _round(segment[1]) + " C";
      sl = segment.length;
      for (i = 2; i < sl; i++) {
        result += _round(segment[i++]) + "," + _round(segment[i++]) + " " + _round(segment[i++]) + "," + _round(segment[i++]) + " " + _round(segment[i++]) + "," + _round(segment[i]) + " ";
      }
      if (segment.closed) {
        result += "z";
      }
    }
    return result;
  }
  /*
  // takes a segment with coordinates [x, y, x, y, ...] and converts the control points into angles and lengths [x, y, angle, length, angle, length, x, y, angle, length, ...] so that it animates more cleanly and avoids odd breaks/kinks. For example, if you animate from 1 o'clock to 6 o'clock, it'd just go directly/linearly rather than around. So the length would be very short in the middle of the tween.
  export function cpCoordsToAngles(segment, copy) {
  	var result = copy ? segment.slice(0) : segment,
  		x, y, i;
  	for (i = 0; i < segment.length; i+=6) {
  		x = segment[i+2] - segment[i];
  		y = segment[i+3] - segment[i+1];
  		result[i+2] = Math.atan2(y, x);
  		result[i+3] = Math.sqrt(x * x + y * y);
  		x = segment[i+6] - segment[i+4];
  		y = segment[i+7] - segment[i+5];
  		result[i+4] = Math.atan2(y, x);
  		result[i+5] = Math.sqrt(x * x + y * y);
  	}
  	return result;
  }

  // takes a segment that was converted with cpCoordsToAngles() to have angles and lengths instead of coordinates for the control points, and converts it BACK into coordinates.
  export function cpAnglesToCoords(segment, copy) {
  	var result = copy ? segment.slice(0) : segment,
  		length = segment.length,
  		rnd = 1000,
  		angle, l, i, j;
  	for (i = 0; i < length; i+=6) {
  		angle = segment[i+2];
  		l = segment[i+3]; //length
  		result[i+2] = (((segment[i] + Math.cos(angle) * l) * rnd) | 0) / rnd;
  		result[i+3] = (((segment[i+1] + Math.sin(angle) * l) * rnd) | 0) / rnd;
  		angle = segment[i+4];
  		l = segment[i+5]; //length
  		result[i+4] = (((segment[i+6] - Math.cos(angle) * l) * rnd) | 0) / rnd;
  		result[i+5] = (((segment[i+7] - Math.sin(angle) * l) * rnd) | 0) / rnd;
  	}
  	return result;
  }

  //adds an "isSmooth" array to each segment and populates it with a boolean value indicating whether or not it's smooth (the control points have basically the same slope). For any smooth control points, it converts the coordinates into angle (x, in radians) and length (y) and puts them into the same index value in a smoothData array.
  export function populateSmoothData(rawPath) {
  	let j = rawPath.length,
  		smooth, segment, x, y, x2, y2, i, l, a, a2, isSmooth, smoothData;
  	while (--j > -1) {
  		segment = rawPath[j];
  		isSmooth = segment.isSmooth = segment.isSmooth || [0, 0, 0, 0];
  		smoothData = segment.smoothData = segment.smoothData || [0, 0, 0, 0];
  		isSmooth.length = 4;
  		l = segment.length - 2;
  		for (i = 6; i < l; i += 6) {
  			x = segment[i] - segment[i - 2];
  			y = segment[i + 1] - segment[i - 1];
  			x2 = segment[i + 2] - segment[i];
  			y2 = segment[i + 3] - segment[i + 1];
  			a = _atan2(y, x);
  			a2 = _atan2(y2, x2);
  			smooth = (Math.abs(a - a2) < 0.09);
  			if (smooth) {
  				smoothData[i - 2] = a;
  				smoothData[i + 2] = a2;
  				smoothData[i - 1] = _sqrt(x * x + y * y);
  				smoothData[i + 3] = _sqrt(x2 * x2 + y2 * y2);
  			}
  			isSmooth.push(smooth, smooth, 0, 0, smooth, smooth);
  		}
  		//if the first and last points are identical, check to see if there's a smooth transition. We must handle this a bit differently due to their positions in the array.
  		if (segment[l] === segment[0] && segment[l+1] === segment[1]) {
  			x = segment[0] - segment[l-2];
  			y = segment[1] - segment[l-1];
  			x2 = segment[2] - segment[0];
  			y2 = segment[3] - segment[1];
  			a = _atan2(y, x);
  			a2 = _atan2(y2, x2);
  			if (Math.abs(a - a2) < 0.09) {
  				smoothData[l-2] = a;
  				smoothData[2] = a2;
  				smoothData[l-1] = _sqrt(x * x + y * y);
  				smoothData[3] = _sqrt(x2 * x2 + y2 * y2);
  				isSmooth[l-2] = isSmooth[l-1] = true; //don't change indexes 2 and 3 because we'll trigger everything from the END, and this will optimize file size a bit.
  			}
  		}
  	}
  	return rawPath;
  }
  export function pointToScreen(svgElement, point) {
  	if (arguments.length < 2) { //by default, take the first set of coordinates in the path as the point
  		let rawPath = getRawPath(svgElement);
  		point = svgElement.ownerSVGElement.createSVGPoint();
  		point.x = rawPath[0][0];
  		point.y = rawPath[0][1];
  	}
  	return point.matrixTransform(svgElement.getScreenCTM());
  }

  */

  /*!
   * MorphSVGPlugin 3.12.5
   * https://gsap.com
   *
   * @license Copyright 2008-2024, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license or for
   * Club GSAP members, the agreement issued with that membership.
   * @author: Jack Doyle, jack@greensock.com
  */
  var gsap$1,
    _toArray$1,
    _lastLinkedAnchor,
    _coreInitted$1,
    PluginClass,
    _getGSAP = function _getGSAP() {
      return gsap$1 || typeof window !== "undefined" && (gsap$1 = window.gsap) && gsap$1.registerPlugin && gsap$1;
    },
    _isFunction = function _isFunction(value) {
      return typeof value === "function";
    },
    _atan2 = Math.atan2,
    _cos = Math.cos,
    _sin = Math.sin,
    _sqrt = Math.sqrt,
    _PI = Math.PI,
    _2PI = _PI * 2,
    _angleMin = _PI * 0.3,
    _angleMax = _PI * 0.7,
    _bigNum = 1e20,
    _numExp = /[-+=\.]*\d+[\.e\-\+]*\d*[e\-\+]*\d*/gi,
    //finds any numbers, including ones that start with += or -=, negative numbers, and ones in scientific notation like 1e-8.
    _selectorExp = /(^[#\.][a-z]|[a-y][a-z])/i,
    _commands = /[achlmqstvz]/i,
    _log = function _log(message) {
      return console && console.warn(message);
    },
    _bonusValidated = 1,
    //<name>MorphSVGPlugin</name>
    _getAverageXY = function _getAverageXY(segment) {
      var l = segment.length,
        x = 0,
        y = 0,
        i;
      for (i = 0; i < l; i++) {
        x += segment[i++];
        y += segment[i];
      }
      return [x / (l / 2), y / (l / 2)];
    },
    _getSize = function _getSize(segment) {
      //rough estimate of the bounding box (based solely on the anchors) of a single segment. sets "size", "centerX", and "centerY" properties on the bezier array itself, and returns the size (width * height)
      var l = segment.length,
        xMax = segment[0],
        xMin = xMax,
        yMax = segment[1],
        yMin = yMax,
        x,
        y,
        i;
      for (i = 6; i < l; i += 6) {
        x = segment[i];
        y = segment[i + 1];
        if (x > xMax) {
          xMax = x;
        } else if (x < xMin) {
          xMin = x;
        }
        if (y > yMax) {
          yMax = y;
        } else if (y < yMin) {
          yMin = y;
        }
      }
      segment.centerX = (xMax + xMin) / 2;
      segment.centerY = (yMax + yMin) / 2;
      return segment.size = (xMax - xMin) * (yMax - yMin);
    },
    _getTotalSize = function _getTotalSize(rawPath, samplesPerBezier) {
      if (samplesPerBezier === void 0) {
        samplesPerBezier = 3;
      }

      //rough estimate of the bounding box of the entire list of Bezier segments (based solely on the anchors). sets "size", "centerX", and "centerY" properties on the bezier array itself, and returns the size (width * height)
      var j = rawPath.length,
        xMax = rawPath[0][0],
        xMin = xMax,
        yMax = rawPath[0][1],
        yMin = yMax,
        inc = 1 / samplesPerBezier,
        l,
        x,
        y,
        i,
        segment,
        k,
        t,
        inv,
        x1,
        y1,
        x2,
        x3,
        x4,
        y2,
        y3,
        y4;
      while (--j > -1) {
        segment = rawPath[j];
        l = segment.length;
        for (i = 6; i < l; i += 6) {
          x1 = segment[i];
          y1 = segment[i + 1];
          x2 = segment[i + 2] - x1;
          y2 = segment[i + 3] - y1;
          x3 = segment[i + 4] - x1;
          y3 = segment[i + 5] - y1;
          x4 = segment[i + 6] - x1;
          y4 = segment[i + 7] - y1;
          k = samplesPerBezier;
          while (--k > -1) {
            t = inc * k;
            inv = 1 - t;
            x = (t * t * x4 + 3 * inv * (t * x3 + inv * x2)) * t + x1;
            y = (t * t * y4 + 3 * inv * (t * y3 + inv * y2)) * t + y1;
            if (x > xMax) {
              xMax = x;
            } else if (x < xMin) {
              xMin = x;
            }
            if (y > yMax) {
              yMax = y;
            } else if (y < yMin) {
              yMin = y;
            }
          }
        }
      }
      rawPath.centerX = (xMax + xMin) / 2;
      rawPath.centerY = (yMax + yMin) / 2;
      rawPath.left = xMin;
      rawPath.width = xMax - xMin;
      rawPath.top = yMin;
      rawPath.height = yMax - yMin;
      return rawPath.size = (xMax - xMin) * (yMax - yMin);
    },
    _sortByComplexity = function _sortByComplexity(a, b) {
      return b.length - a.length;
    },
    _sortBySize = function _sortBySize(a, b) {
      var sizeA = a.size || _getSize(a),
        sizeB = b.size || _getSize(b);
      return Math.abs(sizeB - sizeA) < (sizeA + sizeB) / 20 ? b.centerX - a.centerX || b.centerY - a.centerY : sizeB - sizeA; //if the size is within 10% of each other, prioritize position from left to right, then top to bottom.
    },
    _offsetSegment = function _offsetSegment(segment, shapeIndex) {
      var a = segment.slice(0),
        l = segment.length,
        wrap = l - 2,
        i,
        index;
      shapeIndex = shapeIndex | 0;
      for (i = 0; i < l; i++) {
        index = (i + shapeIndex) % wrap;
        segment[i++] = a[index];
        segment[i] = a[index + 1];
      }
    },
    _getTotalMovement = function _getTotalMovement(sb, eb, shapeIndex, offsetX, offsetY) {
      var l = sb.length,
        d = 0,
        wrap = l - 2,
        index,
        i,
        x,
        y;
      shapeIndex *= 6;
      for (i = 0; i < l; i += 6) {
        index = (i + shapeIndex) % wrap;
        y = sb[index] - (eb[i] - offsetX);
        x = sb[index + 1] - (eb[i + 1] - offsetY);
        d += _sqrt(x * x + y * y);
      }
      return d;
    },
    _getClosestShapeIndex = function _getClosestShapeIndex(sb, eb, checkReverse) {
      //finds the index in a closed cubic bezier array that's closest to the angle provided (angle measured from the center or average x/y).
      var l = sb.length,
        sCenter = _getAverageXY(sb),
        //when comparing distances, adjust the coordinates as if the shapes are centered with each other.
        eCenter = _getAverageXY(eb),
        offsetX = eCenter[0] - sCenter[0],
        offsetY = eCenter[1] - sCenter[1],
        min = _getTotalMovement(sb, eb, 0, offsetX, offsetY),
        minIndex = 0,
        copy,
        d,
        i;
      for (i = 6; i < l; i += 6) {
        d = _getTotalMovement(sb, eb, i / 6, offsetX, offsetY);
        if (d < min) {
          min = d;
          minIndex = i;
        }
      }
      if (checkReverse) {
        copy = sb.slice(0);
        reverseSegment(copy);
        for (i = 6; i < l; i += 6) {
          d = _getTotalMovement(copy, eb, i / 6, offsetX, offsetY);
          if (d < min) {
            min = d;
            minIndex = -i;
          }
        }
      }
      return minIndex / 6;
    },
    _getClosestAnchor = function _getClosestAnchor(rawPath, x, y) {
      //finds the x/y of the anchor that's closest to the provided x/y coordinate (returns an array, like [x, y]). The bezier should be the top-level type that contains an array for each segment.
      var j = rawPath.length,
        closestDistance = _bigNum,
        closestX = 0,
        closestY = 0,
        segment,
        dx,
        dy,
        d,
        i,
        l;
      while (--j > -1) {
        segment = rawPath[j];
        l = segment.length;
        for (i = 0; i < l; i += 6) {
          dx = segment[i] - x;
          dy = segment[i + 1] - y;
          d = _sqrt(dx * dx + dy * dy);
          if (d < closestDistance) {
            closestDistance = d;
            closestX = segment[i];
            closestY = segment[i + 1];
          }
        }
      }
      return [closestX, closestY];
    },
    _getClosestSegment = function _getClosestSegment(bezier, pool, startIndex, sortRatio, offsetX, offsetY) {
      //matches the bezier to the closest one in a pool (array) of beziers, assuming they are in order of size and we shouldn't drop more than 20% of the size, otherwise prioritizing location (total distance to the center). Extracts the segment out of the pool array and returns it.
      var l = pool.length,
        index = 0,
        minSize = Math.min(bezier.size || _getSize(bezier), pool[startIndex].size || _getSize(pool[startIndex])) * sortRatio,
        //limit things based on a percentage of the size of either the bezier or the next element in the array, whichever is smaller.
        min = _bigNum,
        cx = bezier.centerX + offsetX,
        cy = bezier.centerY + offsetY,
        size,
        i,
        dx,
        dy,
        d;
      for (i = startIndex; i < l; i++) {
        size = pool[i].size || _getSize(pool[i]);
        if (size < minSize) {
          break;
        }
        dx = pool[i].centerX - cx;
        dy = pool[i].centerY - cy;
        d = _sqrt(dx * dx + dy * dy);
        if (d < min) {
          index = i;
          min = d;
        }
      }
      d = pool[index];
      pool.splice(index, 1);
      return d;
    },
    _subdivideSegmentQty = function _subdivideSegmentQty(segment, quantity) {
      var tally = 0,
        max = 0.999999,
        l = segment.length,
        newPointsPerSegment = quantity / ((l - 2) / 6),
        ax,
        ay,
        cp1x,
        cp1y,
        cp2x,
        cp2y,
        bx,
        by,
        x1,
        y1,
        x2,
        y2,
        i,
        t;
      for (i = 2; i < l; i += 6) {
        tally += newPointsPerSegment;
        while (tally > max) {
          //compare with 0.99999 instead of 1 in order to prevent rounding errors
          ax = segment[i - 2];
          ay = segment[i - 1];
          cp1x = segment[i];
          cp1y = segment[i + 1];
          cp2x = segment[i + 2];
          cp2y = segment[i + 3];
          bx = segment[i + 4];
          by = segment[i + 5];
          t = 1 / ((Math.floor(tally) || 1) + 1); //progress along the bezier (value between 0 and 1)

          x1 = ax + (cp1x - ax) * t;
          x2 = cp1x + (cp2x - cp1x) * t;
          x1 += (x2 - x1) * t;
          x2 += (cp2x + (bx - cp2x) * t - x2) * t;
          y1 = ay + (cp1y - ay) * t;
          y2 = cp1y + (cp2y - cp1y) * t;
          y1 += (y2 - y1) * t;
          y2 += (cp2y + (by - cp2y) * t - y2) * t;
          segment.splice(i, 4, ax + (cp1x - ax) * t,
          //first control point
          ay + (cp1y - ay) * t, x1,
          //second control point
          y1, x1 + (x2 - x1) * t,
          //new fabricated anchor on line
          y1 + (y2 - y1) * t, x2,
          //third control point
          y2, cp2x + (bx - cp2x) * t,
          //fourth control point
          cp2y + (by - cp2y) * t);
          i += 6;
          l += 6;
          tally--;
        }
      }
      return segment;
    },
    _equalizeSegmentQuantity = function _equalizeSegmentQuantity(start, end, shapeIndex, map, fillSafe) {
      //returns an array of shape indexes, 1 for each segment.
      var dif = end.length - start.length,
        longer = dif > 0 ? end : start,
        shorter = dif > 0 ? start : end,
        added = 0,
        sortMethod = map === "complexity" ? _sortByComplexity : _sortBySize,
        sortRatio = map === "position" ? 0 : typeof map === "number" ? map : 0.8,
        i = shorter.length,
        shapeIndices = typeof shapeIndex === "object" && shapeIndex.push ? shapeIndex.slice(0) : [shapeIndex],
        reverse = shapeIndices[0] === "reverse" || shapeIndices[0] < 0,
        log = shapeIndex === "log",
        eb,
        sb,
        b,
        x,
        y,
        offsetX,
        offsetY;
      if (!shorter[0]) {
        return;
      }
      if (longer.length > 1) {
        start.sort(sortMethod);
        end.sort(sortMethod);
        offsetX = longer.size || _getTotalSize(longer); //ensures centerX and centerY are defined (used below).

        offsetX = shorter.size || _getTotalSize(shorter);
        offsetX = longer.centerX - shorter.centerX;
        offsetY = longer.centerY - shorter.centerY;
        if (sortMethod === _sortBySize) {
          for (i = 0; i < shorter.length; i++) {
            longer.splice(i, 0, _getClosestSegment(shorter[i], longer, i, sortRatio, offsetX, offsetY));
          }
        }
      }
      if (dif) {
        if (dif < 0) {
          dif = -dif;
        }
        if (longer[0].length > shorter[0].length) {
          //since we use shorter[0] as the one to map the origination point of any brand new fabricated segments, do any subdividing first so that there are more points to choose from (if necessary)
          _subdivideSegmentQty(shorter[0], (longer[0].length - shorter[0].length) / 6 | 0);
        }
        i = shorter.length;
        while (added < dif) {
          x = longer[i].size || _getSize(longer[i]); //just to ensure centerX and centerY are calculated which we use on the next line.

          b = _getClosestAnchor(shorter, longer[i].centerX, longer[i].centerY);
          x = b[0];
          y = b[1];
          shorter[i++] = [x, y, x, y, x, y, x, y];
          shorter.totalPoints += 8;
          added++;
        }
      }
      for (i = 0; i < start.length; i++) {
        eb = end[i];
        sb = start[i];
        dif = eb.length - sb.length;
        if (dif < 0) {
          _subdivideSegmentQty(eb, -dif / 6 | 0);
        } else if (dif > 0) {
          _subdivideSegmentQty(sb, dif / 6 | 0);
        }
        if (reverse && fillSafe !== false && !sb.reversed) {
          reverseSegment(sb);
        }
        shapeIndex = shapeIndices[i] || shapeIndices[i] === 0 ? shapeIndices[i] : "auto";
        if (shapeIndex) {
          //if start shape is closed, find the closest point to the start/end, and re-organize the bezier points accordingly so that the shape morphs in a more intuitive way.
          if (sb.closed || Math.abs(sb[0] - sb[sb.length - 2]) < 0.5 && Math.abs(sb[1] - sb[sb.length - 1]) < 0.5) {
            if (shapeIndex === "auto" || shapeIndex === "log") {
              shapeIndices[i] = shapeIndex = _getClosestShapeIndex(sb, eb, !i || fillSafe === false);
              if (shapeIndex < 0) {
                reverse = true;
                reverseSegment(sb);
                shapeIndex = -shapeIndex;
              }
              _offsetSegment(sb, shapeIndex * 6);
            } else if (shapeIndex !== "reverse") {
              if (i && shapeIndex < 0) {
                //only happens if an array is passed as shapeIndex and a negative value is defined for an index beyond 0. Very rare, but helpful sometimes.
                reverseSegment(sb);
              }
              _offsetSegment(sb, (shapeIndex < 0 ? -shapeIndex : shapeIndex) * 6);
            } //otherwise, if it's not a closed shape, consider reversing it if that would make the overall travel less
          } else if (!reverse && (shapeIndex === "auto" && Math.abs(eb[0] - sb[0]) + Math.abs(eb[1] - sb[1]) + Math.abs(eb[eb.length - 2] - sb[sb.length - 2]) + Math.abs(eb[eb.length - 1] - sb[sb.length - 1]) > Math.abs(eb[0] - sb[sb.length - 2]) + Math.abs(eb[1] - sb[sb.length - 1]) + Math.abs(eb[eb.length - 2] - sb[0]) + Math.abs(eb[eb.length - 1] - sb[1]) || shapeIndex % 2)) {
            reverseSegment(sb);
            shapeIndices[i] = -1;
            reverse = true;
          } else if (shapeIndex === "auto") {
            shapeIndices[i] = 0;
          } else if (shapeIndex === "reverse") {
            shapeIndices[i] = -1;
          }
          if (sb.closed !== eb.closed) {
            //if one is closed and one isn't, don't close either one otherwise the tweening will look weird (but remember, the beginning and final states will honor the actual values, so this only affects the inbetween state)
            sb.closed = eb.closed = false;
          }
        }
      }
      log && _log("shapeIndex:[" + shapeIndices.join(",") + "]");
      start.shapeIndex = shapeIndices;
      return shapeIndices;
    },
    _pathFilter = function _pathFilter(a, shapeIndex, map, precompile, fillSafe) {
      var start = stringToRawPath(a[0]),
        end = stringToRawPath(a[1]);
      if (!_equalizeSegmentQuantity(start, end, shapeIndex || shapeIndex === 0 ? shapeIndex : "auto", map, fillSafe)) {
        return; //malformed path data or null target
      }

      a[0] = rawPathToString(start);
      a[1] = rawPathToString(end);
      if (precompile === "log" || precompile === true) {
        _log('precompile:["' + a[0] + '","' + a[1] + '"]');
      }
    },
    _offsetPoints = function _offsetPoints(text, offset) {
      if (!offset) {
        return text;
      }
      var a = text.match(_numExp) || [],
        l = a.length,
        s = "",
        inc,
        i,
        j;
      if (offset === "reverse") {
        i = l - 1;
        inc = -2;
      } else {
        i = ((parseInt(offset, 10) || 0) * 2 + 1 + l * 100) % l;
        inc = 2;
      }
      for (j = 0; j < l; j += 2) {
        s += a[i - 1] + "," + a[i] + " ";
        i = (i + inc) % l;
      }
      return s;
    },
    //adds a certain number of points while maintaining the polygon/polyline shape (so that the start/end values can have a matching quantity of points to animate). Returns the revised string.
    _equalizePointQuantity = function _equalizePointQuantity(a, quantity) {
      var tally = 0,
        x = parseFloat(a[0]),
        y = parseFloat(a[1]),
        s = x + "," + y + " ",
        max = 0.999999,
        newPointsPerSegment,
        i,
        l,
        j,
        factor,
        nextX,
        nextY;
      l = a.length;
      newPointsPerSegment = quantity * 0.5 / (l * 0.5 - 1);
      for (i = 0; i < l - 2; i += 2) {
        tally += newPointsPerSegment;
        nextX = parseFloat(a[i + 2]);
        nextY = parseFloat(a[i + 3]);
        if (tally > max) {
          //compare with 0.99999 instead of 1 in order to prevent rounding errors
          factor = 1 / (Math.floor(tally) + 1);
          j = 1;
          while (tally > max) {
            s += (x + (nextX - x) * factor * j).toFixed(2) + "," + (y + (nextY - y) * factor * j).toFixed(2) + " ";
            tally--;
            j++;
          }
        }
        s += nextX + "," + nextY + " ";
        x = nextX;
        y = nextY;
      }
      return s;
    },
    _pointsFilter = function _pointsFilter(a) {
      var startNums = a[0].match(_numExp) || [],
        endNums = a[1].match(_numExp) || [],
        dif = endNums.length - startNums.length;
      if (dif > 0) {
        a[0] = _equalizePointQuantity(startNums, dif);
      } else {
        a[1] = _equalizePointQuantity(endNums, -dif);
      }
    },
    _buildPointsFilter = function _buildPointsFilter(shapeIndex) {
      return !isNaN(shapeIndex) ? function (a) {
        _pointsFilter(a);
        a[1] = _offsetPoints(a[1], parseInt(shapeIndex, 10));
      } : _pointsFilter;
    },
    _parseShape = function _parseShape(shape, forcePath, target) {
      var isString = typeof shape === "string",
        e,
        type;
      if (!isString || _selectorExp.test(shape) || (shape.match(_numExp) || []).length < 3) {
        e = _toArray$1(shape)[0];
        if (e) {
          type = (e.nodeName + "").toUpperCase();
          if (forcePath && type !== "PATH") {
            //if we were passed an element (or selector text for an element) that isn't a path, convert it.
            e = convertToPath(e, false);
            type = "PATH";
          }
          shape = e.getAttribute(type === "PATH" ? "d" : "points") || "";
          if (e === target) {
            //if the shape matches the target element, the user wants to revert to the original which should have been stored in the data-original attribute
            shape = e.getAttributeNS(null, "data-original") || shape;
          }
        } else {
          _log("WARNING: invalid morph to: " + shape);
          shape = false;
        }
      }
      return shape;
    },
    //adds an "isSmooth" array to each segment and populates it with a boolean value indicating whether or not it's smooth (the control points have basically the same slope). For any smooth control points, it converts the coordinates into angle (x, in radians) and length (y) and puts them into the same index value in a smoothData array.
    _populateSmoothData = function _populateSmoothData(rawPath, tolerance) {
      var j = rawPath.length,
        limit = 0.2 * (tolerance || 1),
        smooth,
        segment,
        x,
        y,
        x2,
        y2,
        i,
        l,
        a,
        a2,
        isSmooth,
        smoothData;
      while (--j > -1) {
        segment = rawPath[j];
        isSmooth = segment.isSmooth = segment.isSmooth || [0, 0, 0, 0];
        smoothData = segment.smoothData = segment.smoothData || [0, 0, 0, 0];
        isSmooth.length = 4;
        l = segment.length - 2;
        for (i = 6; i < l; i += 6) {
          x = segment[i] - segment[i - 2];
          y = segment[i + 1] - segment[i - 1];
          x2 = segment[i + 2] - segment[i];
          y2 = segment[i + 3] - segment[i + 1];
          a = _atan2(y, x);
          a2 = _atan2(y2, x2);
          smooth = Math.abs(a - a2) < limit;
          if (smooth) {
            smoothData[i - 2] = a;
            smoothData[i + 2] = a2;
            smoothData[i - 1] = _sqrt(x * x + y * y);
            smoothData[i + 3] = _sqrt(x2 * x2 + y2 * y2);
          }
          isSmooth.push(smooth, smooth, 0, 0, smooth, smooth);
        } //if the first and last points are identical, check to see if there's a smooth transition. We must handle this a bit differently due to their positions in the array.

        if (segment[l] === segment[0] && segment[l + 1] === segment[1]) {
          x = segment[0] - segment[l - 2];
          y = segment[1] - segment[l - 1];
          x2 = segment[2] - segment[0];
          y2 = segment[3] - segment[1];
          a = _atan2(y, x);
          a2 = _atan2(y2, x2);
          if (Math.abs(a - a2) < limit) {
            smoothData[l - 2] = a;
            smoothData[2] = a2;
            smoothData[l - 1] = _sqrt(x * x + y * y);
            smoothData[3] = _sqrt(x2 * x2 + y2 * y2);
            isSmooth[l - 2] = isSmooth[l - 1] = true; //don't change indexes 2 and 3 because we'll trigger everything from the END, and this will optimize file size a bit.
          }
        }
      }

      return rawPath;
    },
    _parseOriginFactors = function _parseOriginFactors(v) {
      var a = v.trim().split(" "),
        x = ~v.indexOf("left") ? 0 : ~v.indexOf("right") ? 100 : isNaN(parseFloat(a[0])) ? 50 : parseFloat(a[0]),
        y = ~v.indexOf("top") ? 0 : ~v.indexOf("bottom") ? 100 : isNaN(parseFloat(a[1])) ? 50 : parseFloat(a[1]);
      return {
        x: x / 100,
        y: y / 100
      };
    },
    _shortAngle = function _shortAngle(dif) {
      return dif !== dif % _PI ? dif + (dif < 0 ? _2PI : -_2PI) : dif;
    },
    _morphMessage = "Use MorphSVGPlugin.convertToPath() to convert to a path before morphing.",
    _tweenRotation = function _tweenRotation(start, end, i, linkedPT) {
      var so = this._origin,
        //starting origin
        eo = this._eOrigin,
        //ending origin
        dx = start[i] - so.x,
        dy = start[i + 1] - so.y,
        d = _sqrt(dx * dx + dy * dy),
        //length from starting origin to starting point
        sa = _atan2(dy, dx),
        angleDif,
        _short;
      dx = end[i] - eo.x;
      dy = end[i + 1] - eo.y;
      angleDif = _atan2(dy, dx) - sa;
      _short = _shortAngle(angleDif); //in the case of control points, we ALWAYS link them to their anchor so that they don't get torn apart and rotate the opposite direction. If it's not a control point, we look at the most recently linked point as long as they're within a certain rotational range of each other.

      if (!linkedPT && _lastLinkedAnchor && Math.abs(_short + _lastLinkedAnchor.ca) < _angleMin) {
        linkedPT = _lastLinkedAnchor;
      }
      return this._anchorPT = _lastLinkedAnchor = {
        _next: this._anchorPT,
        t: start,
        sa: sa,
        //starting angle
        ca: linkedPT && _short * linkedPT.ca < 0 && Math.abs(_short) > _angleMax ? angleDif : _short,
        //change in angle
        sl: d,
        //starting length
        cl: _sqrt(dx * dx + dy * dy) - d,
        //change in length
        i: i
      };
    },
    _initCore$1 = function _initCore(required) {
      gsap$1 = _getGSAP();
      PluginClass = PluginClass || gsap$1 && gsap$1.plugins.morphSVG;
      if (gsap$1 && PluginClass) {
        _toArray$1 = gsap$1.utils.toArray;
        PluginClass.prototype._tweenRotation = _tweenRotation;
        _coreInitted$1 = 1;
      } else if (required) {
        _log("Please gsap.registerPlugin(MorphSVGPlugin)");
      }
    };
  var MorphSVGPlugin = {
    version: "3.12.5",
    name: "morphSVG",
    rawVars: 1,
    // otherwise "render" would be interpreted as a function-based value.
    register: function register(core, Plugin) {
      gsap$1 = core;
      PluginClass = Plugin;
      _initCore$1();
    },
    init: function init(target, value, tween, index, targets) {
      _coreInitted$1 || _initCore$1(1);
      if (!value) {
        _log("invalid shape");
        return false;
      }
      _isFunction(value) && (value = value.call(tween, index, target, targets));
      var type, p, pt, shape, isPoly, shapeIndex, map, startSmooth, endSmooth, start, end, i, j, l, startSeg, endSeg, precompiled, sData, eData, originFactors, useRotation, offset;
      if (typeof value === "string" || value.getBBox || value[0]) {
        value = {
          shape: value
        };
      } else if (typeof value === "object") {
        // if there are any function-based values, parse them here (and make a copy of the object so we're not modifying the original)
        type = {};
        for (p in value) {
          type[p] = _isFunction(value[p]) && p !== "render" ? value[p].call(tween, index, target, targets) : value[p];
        }
        value = type;
      }
      var cs = target.nodeType ? window.getComputedStyle(target) : {},
        fill = cs.fill + "",
        fillSafe = !(fill === "none" || (fill.match(_numExp) || [])[3] === "0" || cs.fillRule === "evenodd"),
        origins = (value.origin || "50 50").split(",");
      type = (target.nodeName + "").toUpperCase();
      isPoly = type === "POLYLINE" || type === "POLYGON";
      if (type !== "PATH" && !isPoly && !value.prop) {
        _log("Cannot morph a <" + type + "> element. " + _morphMessage);
        return false;
      }
      p = type === "PATH" ? "d" : "points";
      if (!value.prop && !_isFunction(target.setAttribute)) {
        return false;
      }
      shape = _parseShape(value.shape || value.d || value.points || "", p === "d", target);
      if (isPoly && _commands.test(shape)) {
        _log("A <" + type + "> cannot accept path data. " + _morphMessage);
        return false;
      }
      shapeIndex = value.shapeIndex || value.shapeIndex === 0 ? value.shapeIndex : "auto";
      map = value.map || MorphSVGPlugin.defaultMap;
      this._prop = value.prop;
      this._render = value.render || MorphSVGPlugin.defaultRender;
      this._apply = "updateTarget" in value ? value.updateTarget : MorphSVGPlugin.defaultUpdateTarget;
      this._rnd = Math.pow(10, isNaN(value.precision) ? 2 : +value.precision);
      this._tween = tween;
      if (shape) {
        this._target = target;
        precompiled = typeof value.precompile === "object";
        start = this._prop ? target[this._prop] : target.getAttribute(p);
        if (!this._prop && !target.getAttributeNS(null, "data-original")) {
          target.setAttributeNS(null, "data-original", start); //record the original state in a data-original attribute so that we can revert to it later.
        }

        if (p === "d" || this._prop) {
          start = stringToRawPath(precompiled ? value.precompile[0] : start);
          end = stringToRawPath(precompiled ? value.precompile[1] : shape);
          if (!precompiled && !_equalizeSegmentQuantity(start, end, shapeIndex, map, fillSafe)) {
            return false; //malformed path data or null target
          }

          if (value.precompile === "log" || value.precompile === true) {
            _log('precompile:["' + rawPathToString(start) + '","' + rawPathToString(end) + '"]');
          }
          useRotation = (value.type || MorphSVGPlugin.defaultType) !== "linear";
          if (useRotation) {
            start = _populateSmoothData(start, value.smoothTolerance);
            end = _populateSmoothData(end, value.smoothTolerance);
            if (!start.size) {
              _getTotalSize(start); //adds top/left/width/height values
            }

            if (!end.size) {
              _getTotalSize(end);
            }
            originFactors = _parseOriginFactors(origins[0]);
            this._origin = start.origin = {
              x: start.left + originFactors.x * start.width,
              y: start.top + originFactors.y * start.height
            };
            if (origins[1]) {
              originFactors = _parseOriginFactors(origins[1]);
            }
            this._eOrigin = {
              x: end.left + originFactors.x * end.width,
              y: end.top + originFactors.y * end.height
            };
          }
          this._rawPath = target._gsRawPath = start;
          j = start.length;
          while (--j > -1) {
            startSeg = start[j];
            endSeg = end[j];
            startSmooth = startSeg.isSmooth || [];
            endSmooth = endSeg.isSmooth || [];
            l = startSeg.length;
            _lastLinkedAnchor = 0; //reset; we use _lastLinkedAnchor in the _tweenRotation() method to help make sure that close points don't get ripped apart and rotate opposite directions. Typically we want to go the shortest direction, but if the previous anchor is going a different direction, we override this logic (within certain thresholds)

            for (i = 0; i < l; i += 2) {
              if (endSeg[i] !== startSeg[i] || endSeg[i + 1] !== startSeg[i + 1]) {
                if (useRotation) {
                  if (startSmooth[i] && endSmooth[i]) {
                    //if BOTH starting and ending values are smooth (meaning control points have basically the same slope), interpolate the rotation and length instead of the coordinates (this is what makes things smooth).
                    sData = startSeg.smoothData;
                    eData = endSeg.smoothData;
                    offset = i + (i === l - 4 ? 7 - l : 5); //helps us accommodate wrapping (like if the end and start anchors are identical and the control points are smooth).

                    this._controlPT = {
                      _next: this._controlPT,
                      i: i,
                      j: j,
                      l1s: sData[i + 1],
                      l1c: eData[i + 1] - sData[i + 1],
                      l2s: sData[offset],
                      l2c: eData[offset] - sData[offset]
                    };
                    pt = this._tweenRotation(startSeg, endSeg, i + 2);
                    this._tweenRotation(startSeg, endSeg, i, pt);
                    this._tweenRotation(startSeg, endSeg, offset - 1, pt);
                    i += 4;
                  } else {
                    this._tweenRotation(startSeg, endSeg, i);
                  }
                } else {
                  pt = this.add(startSeg, i, startSeg[i], endSeg[i], 0, 0, 0, 0, 0, 1);
                  pt = this.add(startSeg, i + 1, startSeg[i + 1], endSeg[i + 1], 0, 0, 0, 0, 0, 1) || pt;
                }
              }
            }
          }
        } else {
          pt = this.add(target, "setAttribute", target.getAttribute(p) + "", shape + "", index, targets, 0, _buildPointsFilter(shapeIndex), p);
        }
        if (useRotation) {
          this.add(this._origin, "x", this._origin.x, this._eOrigin.x, 0, 0, 0, 0, 0, 1);
          pt = this.add(this._origin, "y", this._origin.y, this._eOrigin.y, 0, 0, 0, 0, 0, 1);
        }
        if (pt) {
          this._props.push("morphSVG");
          pt.end = shape;
          pt.endProp = p;
        }
      }
      return _bonusValidated;
    },
    render: function render(ratio, data) {
      var rawPath = data._rawPath,
        controlPT = data._controlPT,
        anchorPT = data._anchorPT,
        rnd = data._rnd,
        target = data._target,
        pt = data._pt,
        s,
        space,
        easeInOut,
        segment,
        l,
        angle,
        i,
        j,
        x,
        y,
        sin,
        cos,
        offset;
      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }
      if (ratio === 1 && data._apply) {
        pt = data._pt;
        while (pt) {
          if (pt.end) {
            if (data._prop) {
              target[data._prop] = pt.end;
            } else {
              target.setAttribute(pt.endProp, pt.end); //make sure the end value is exactly as specified (in case we had to add fabricated points during the tween)
            }
          }

          pt = pt._next;
        }
      } else if (rawPath) {
        //rotationally position the anchors
        while (anchorPT) {
          angle = anchorPT.sa + ratio * anchorPT.ca;
          l = anchorPT.sl + ratio * anchorPT.cl; //length

          anchorPT.t[anchorPT.i] = data._origin.x + _cos(angle) * l;
          anchorPT.t[anchorPT.i + 1] = data._origin.y + _sin(angle) * l;
          anchorPT = anchorPT._next;
        } //smooth out the control points

        easeInOut = ratio < 0.5 ? 2 * ratio * ratio : (4 - 2 * ratio) * ratio - 1;
        while (controlPT) {
          i = controlPT.i;
          segment = rawPath[controlPT.j];
          offset = i + (i === segment.length - 4 ? 7 - segment.length : 5); //accommodates wrapping around of smooth points, like if the start and end anchors are on top of each other and their handles are smooth.

          angle = _atan2(segment[offset] - segment[i + 1], segment[offset - 1] - segment[i]); //average the angles

          sin = _sin(angle);
          cos = _cos(angle);
          x = segment[i + 2];
          y = segment[i + 3];
          l = controlPT.l1s + easeInOut * controlPT.l1c; //length

          segment[i] = x - cos * l;
          segment[i + 1] = y - sin * l;
          l = controlPT.l2s + easeInOut * controlPT.l2c;
          segment[offset - 1] = x + cos * l;
          segment[offset] = y + sin * l;
          controlPT = controlPT._next;
        }
        target._gsRawPath = rawPath;
        if (data._apply) {
          s = "";
          space = " ";
          for (j = 0; j < rawPath.length; j++) {
            segment = rawPath[j];
            l = segment.length;
            s += "M" + (segment[0] * rnd | 0) / rnd + space + (segment[1] * rnd | 0) / rnd + " C";
            for (i = 2; i < l; i++) {
              //this is actually faster than just doing a join() on the array, possibly because the numbers have so many decimal places
              s += (segment[i] * rnd | 0) / rnd + space;
            }
          }
          if (data._prop) {
            target[data._prop] = s;
          } else {
            target.setAttribute("d", s);
          }
        }
      }
      data._render && rawPath && data._render.call(data._tween, rawPath, target);
    },
    kill: function kill(property) {
      this._pt = this._rawPath = 0;
    },
    getRawPath: getRawPath,
    stringToRawPath: stringToRawPath,
    rawPathToString: rawPathToString,
    normalizeStrings: function normalizeStrings(shape1, shape2, _ref) {
      var shapeIndex = _ref.shapeIndex,
        map = _ref.map;
      var result = [shape1, shape2];
      _pathFilter(result, shapeIndex, map);
      return result;
    },
    pathFilter: _pathFilter,
    pointsFilter: _pointsFilter,
    getTotalSize: _getTotalSize,
    equalizeSegmentQuantity: _equalizeSegmentQuantity,
    convertToPath: function convertToPath$1(targets, swap) {
      return _toArray$1(targets).map(function (target) {
        return convertToPath(target, swap !== false);
      });
    },
    defaultType: "linear",
    defaultUpdateTarget: true,
    defaultMap: "size"
  };
  _getGSAP() && gsap$1.registerPlugin(MorphSVGPlugin);

  gsapWithCSS.registerPlugin(MorphSVGPlugin);

  // Menu function
  function menu() {
    const toggleBtn = document.getElementById('menu-toggle'),
      content = document.querySelector('#wrapper'),
      sidenav = document.querySelector('.sidenav'),
      burger = document.querySelector('.header__burger'),
      list = document.querySelector('.sidenav nav'),
      lang = document.querySelector('.lang_selector');
    let isOpen = false;
    const tl = gsapWithCSS.timeline({
      paused: true
    });
    if (window.innerWidth < 768) {
      tl.to(sidenav, {
        display: 'flex',
        duration: 0
      }).to('.icon-equal', {
        duration: 0.4,
        morphSVG: '.icon-cross'
      }).to(sidenav, {
        height: '100vh',
        width: '100vw',
        duration: 0.3,
        ease: 'elastic.out(1, 0.75)'
      }, '<').to(list, {
        opacity: 1,
        duration: 0.2
      }).to(lang, {
        opacity: 1,
        duration: 0.2
      });
    } else {
      tl.to(sidenav, {
        display: 'block',
        duration: 0
      }).to('.icon-equal', {
        duration: 0.4,
        morphSVG: '.icon-cross'
      }).to(sidenav, {
        height: 'auto',
        width: 'auto',
        duration: 0.5,
        ease: 'elastic.out(1, 0.75)'
      }, '<').to(list, {
        opacity: 1,
        duration: 0.2
      }).to(lang, {
        opacity: 1,
        duration: 0.2
      });
    }
    toggleBtn.addEventListener('click', e => {
      burger.classList.toggle('is-open');
      if (isOpen === false) {
        tl.play();
      } else {
        tl.reverse();
      }
      isOpen = !isOpen;
    });
    content.addEventListener('click', e => {
      let target = e.target;
      if (isOpen && target !== sidenav) {
        tl.reverse();
      }
    });
  }

  function customCursor() {
    const cursor = jQuery(".cursor"),
      body = jQuery("body"),
      slider = jQuery(".slider"),
      nav = jQuery(".nav"),
      fail = jQuery(".fail");
      jQuery(".invert");
      const nav_open_menu = jQuery(".navopen"),
      wwidth = jQuery(window).width(),
      wheight = jQuery(window).height();
    function cursorMove() {
      return body.addClass("cursor-on"), cursor.css({
        transform: "matrix(1, 0, 0, 1, " + wwidth / 2 + ", " + wheight / 2 + ")"
      }), jQuery(window).on("mousemove", function (e) {
        var n, t;
        if (window.x = e.clientX, window.y = e.clientY, cursor.css({
          transform: "matrix(1, 0, 0, 1, " + x + ", " + y + ")"
        }), !nav.hasClass("overlay-visible")) return n = Math.floor((x - 60) / 5), t = Math.floor((y - 60) / 5), n < 20 && t < 20 ? nav_open_menu.addClass("magnetize").css({
          transform: "scale(1.3) translate3d(" + n + "px, " + t + "px, 0)"
        }) : nav_open_menu.removeClass("magnetize").attr("style", "");
      });
    }
    function cursorBind() {
      var e, n, t;
      if ((n = cursor.find("span")).removeClass("link external new"), e = jQuery(".focus"), t = jQuery(".slack"),
      // active cursor
      jQuery(window).on({
        mouseenter: function () {
          return n.removeClass("off");
        },
        mouseleave: function () {
          return n.addClass("off");
        }
      }),
      // links , buttons and inputs
      jQuery("a:not(.link--readmore, .link--viewall, .link--without), button, input, input[type=submit], label").on({
        mouseenter: function () {
          var e;
          return e = jQuery(this).hasClass("external") ? "link external" : "link", n.addClass(e);
        },
        mouseleave: function () {
          return n.removeClass("link external");
        }
      }), jQuery(".link--readmore").on({
        mouseenter: function () {
          return n.addClass('cursor--readmore');
        },
        mouseleave: function () {
          return n.removeClass("cursor--readmore");
        }
      }), jQuery(".link--viewall").on({
        mouseenter: function () {
          return n.addClass('cursor--viewall');
        },
        mouseleave: function () {
          return n.removeClass("cursor--viewall");
        }
      }), jQuery(".link--play").on({
        mouseenter: function () {
          console.log('play enter');
          return n.addClass('cursor--play');
        },
        mouseleave: function () {
          return n.removeClass("cursor--play");
        }
      }), jQuery(".link--pause").on({
        mouseenter: function () {
          return n.addClass('cursor--pause');
        },
        mouseleave: function () {
          return n.removeClass("cursor--pause");
        }
      }), jQuery(".link--drag").on({
        mouseenter: function () {
          return n.addClass('cursor--drag');
        },
        mouseleave: function () {
          return n.removeClass("cursor--drag");
        }
      }), jQuery(".single__intro").on({
        mouseenter: function () {
          return n.removeClass('cursor--play');
        }
      }),
      // // titles
      // jQuery("h1").on({
      // 	mouseenter: function() {
      // 	var e;
      // 	return (
      // 		(e = jQuery(this).hasClass("external") ? "invert external" : "invert"),
      // 		n.addClass(e)
      // 	);
      // 	},
      // 	mouseleave: function() {
      // 	return n.removeClass("invert external");
      // 	}
      // }),

      // drag
      // jQuery(".swiperCarouselWines").on({
      // 	mouseenter: function() {
      // 	var e;
      // 	return (
      // 		(e = jQuery(this).hasClass("external") ? "drag external" : "drag"),
      // 		n.addClass(e)
      // 	);
      // 	},
      // 	mouseleave: function() {
      // 	return n.removeClass("drag external");
      // 	}
      // }),

      e.length && e.find("a").on({
        mouseenter: function () {
          return n.addClass("new");
        },
        mouseleave: function () {
          return n.removeClass("new");
        }
      }), slider.length && slider.on({
        mouseenter: function () {
          var e;
          return e = jQuery(this).hasClass("full") ? "click" : "drag", n.addClass(e);
        },
        mouseleave: function () {
          return n.removeClass("drag click");
        }
      }), t.length && t.on({
        mouseenter: function () {
          return n.addClass("light");
        },
        mouseleave: function () {
          return n.removeClass("light");
        }
      }), fail.length) return fail.on({
        mouseover: function () {
          return n.addClass("relol");
        },
        mouseleave: function () {
          return n.removeClass("relol");
        }
      });
    }

    // https://stackoverflow.com/a/4819886
    function isTouchDevice() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }
    const isTouch = isTouchDevice();
    if (!isTouch) {
      cursorMove();
      cursorBind();
    }
  }

  function clamp$2(t, i, e) {
    return Math.max(t, Math.min(i, e));
  }
  class Animate {
    constructor() {
      this.isRunning = !1, this.value = 0, this.from = 0, this.to = 0, this.duration = 0, this.currentTime = 0;
    }
    advance(t) {
      var i;
      if (!this.isRunning) return;
      let e = !1;
      if (this.duration && this.easing) {
        this.currentTime += t;
        const i = clamp$2(0, this.currentTime / this.duration, 1);
        e = i >= 1;
        const s = e ? 1 : this.easing(i);
        this.value = this.from + (this.to - this.from) * s;
      } else this.lerp ? (this.value = function damp(t, i, e, s) {
        return function lerp(t, i, e) {
          return (1 - e) * t + e * i;
        }(t, i, 1 - Math.exp(-e * s));
      }(this.value, this.to, 60 * this.lerp, t), Math.round(this.value) === this.to && (this.value = this.to, e = !0)) : (this.value = this.to, e = !0);
      e && this.stop(), null === (i = this.onUpdate) || void 0 === i || i.call(this, this.value, e);
    }
    stop() {
      this.isRunning = !1;
    }
    fromTo(t, i, {
      lerp: e,
      duration: s,
      easing: o,
      onStart: n,
      onUpdate: l
    }) {
      this.from = this.value = t, this.to = i, this.lerp = e, this.duration = s, this.easing = o, this.currentTime = 0, this.isRunning = !0, null == n || n(), this.onUpdate = l;
    }
  }
  class Dimensions {
    constructor({
      wrapper: t,
      content: i,
      autoResize: e = !0,
      debounce: s = 250
    } = {}) {
      this.width = 0, this.height = 0, this.scrollWidth = 0, this.scrollHeight = 0, this.resize = () => {
        this.onWrapperResize(), this.onContentResize();
      }, this.onWrapperResize = () => {
        this.wrapper === window ? (this.width = window.innerWidth, this.height = window.innerHeight) : this.wrapper instanceof HTMLElement && (this.width = this.wrapper.clientWidth, this.height = this.wrapper.clientHeight);
      }, this.onContentResize = () => {
        this.wrapper === window ? (this.scrollHeight = this.content.scrollHeight, this.scrollWidth = this.content.scrollWidth) : this.wrapper instanceof HTMLElement && (this.scrollHeight = this.wrapper.scrollHeight, this.scrollWidth = this.wrapper.scrollWidth);
      }, this.wrapper = t, this.content = i, e && (this.debouncedResize = function debounce(t, i) {
        let e;
        return function () {
          let s = arguments,
            o = this;
          clearTimeout(e), e = setTimeout(function () {
            t.apply(o, s);
          }, i);
        };
      }(this.resize, s), this.wrapper === window ? window.addEventListener("resize", this.debouncedResize, !1) : (this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize), this.wrapperResizeObserver.observe(this.wrapper)), this.contentResizeObserver = new ResizeObserver(this.debouncedResize), this.contentResizeObserver.observe(this.content)), this.resize();
    }
    destroy() {
      var t, i;
      null === (t = this.wrapperResizeObserver) || void 0 === t || t.disconnect(), null === (i = this.contentResizeObserver) || void 0 === i || i.disconnect(), window.removeEventListener("resize", this.debouncedResize, !1);
    }
    get limit() {
      return {
        x: this.scrollWidth - this.width,
        y: this.scrollHeight - this.height
      };
    }
  }
  class Emitter {
    constructor() {
      this.events = {};
    }
    emit(t, ...i) {
      let e = this.events[t] || [];
      for (let t = 0, s = e.length; t < s; t++) e[t](...i);
    }
    on(t, i) {
      var e;
      return (null === (e = this.events[t]) || void 0 === e ? void 0 : e.push(i)) || (this.events[t] = [i]), () => {
        var e;
        this.events[t] = null === (e = this.events[t]) || void 0 === e ? void 0 : e.filter(t => i !== t);
      };
    }
    off(t, i) {
      var e;
      this.events[t] = null === (e = this.events[t]) || void 0 === e ? void 0 : e.filter(t => i !== t);
    }
    destroy() {
      this.events = {};
    }
  }
  const t = 100 / 6;
  class VirtualScroll {
    constructor(i, {
      wheelMultiplier: e = 1,
      touchMultiplier: s = 1
    }) {
      this.lastDelta = {
        x: 0,
        y: 0
      }, this.windowWidth = 0, this.windowHeight = 0, this.onTouchStart = t => {
        const {
          clientX: i,
          clientY: e
        } = t.targetTouches ? t.targetTouches[0] : t;
        this.touchStart.x = i, this.touchStart.y = e, this.lastDelta = {
          x: 0,
          y: 0
        }, this.emitter.emit("scroll", {
          deltaX: 0,
          deltaY: 0,
          event: t
        });
      }, this.onTouchMove = t => {
        var i, e, s, o;
        const {
            clientX: n,
            clientY: l
          } = t.targetTouches ? t.targetTouches[0] : t,
          r = -(n - (null !== (e = null === (i = this.touchStart) || void 0 === i ? void 0 : i.x) && void 0 !== e ? e : 0)) * this.touchMultiplier,
          h = -(l - (null !== (o = null === (s = this.touchStart) || void 0 === s ? void 0 : s.y) && void 0 !== o ? o : 0)) * this.touchMultiplier;
        this.touchStart.x = n, this.touchStart.y = l, this.lastDelta = {
          x: r,
          y: h
        }, this.emitter.emit("scroll", {
          deltaX: r,
          deltaY: h,
          event: t
        });
      }, this.onTouchEnd = t => {
        this.emitter.emit("scroll", {
          deltaX: this.lastDelta.x,
          deltaY: this.lastDelta.y,
          event: t
        });
      }, this.onWheel = i => {
        let {
          deltaX: e,
          deltaY: s,
          deltaMode: o
        } = i;
        e *= 1 === o ? t : 2 === o ? this.windowWidth : 1, s *= 1 === o ? t : 2 === o ? this.windowHeight : 1, e *= this.wheelMultiplier, s *= this.wheelMultiplier, this.emitter.emit("scroll", {
          deltaX: e,
          deltaY: s,
          event: i
        });
      }, this.onWindowResize = () => {
        this.windowWidth = window.innerWidth, this.windowHeight = window.innerHeight;
      }, this.element = i, this.wheelMultiplier = e, this.touchMultiplier = s, this.touchStart = {
        x: null,
        y: null
      }, this.emitter = new Emitter(), window.addEventListener("resize", this.onWindowResize, !1), this.onWindowResize(), this.element.addEventListener("wheel", this.onWheel, {
        passive: !1
      }), this.element.addEventListener("touchstart", this.onTouchStart, {
        passive: !1
      }), this.element.addEventListener("touchmove", this.onTouchMove, {
        passive: !1
      }), this.element.addEventListener("touchend", this.onTouchEnd, {
        passive: !1
      });
    }
    on(t, i) {
      return this.emitter.on(t, i);
    }
    destroy() {
      this.emitter.destroy(), window.removeEventListener("resize", this.onWindowResize, !1), this.element.removeEventListener("wheel", this.onWheel), this.element.removeEventListener("touchstart", this.onTouchStart), this.element.removeEventListener("touchmove", this.onTouchMove), this.element.removeEventListener("touchend", this.onTouchEnd);
    }
  }
  class Lenis {
    constructor({
      wrapper: t = window,
      content: i = document.documentElement,
      wheelEventsTarget: e = t,
      eventsTarget: s = e,
      smoothWheel: o = !0,
      syncTouch: n = !1,
      syncTouchLerp: l = .075,
      touchInertiaMultiplier: r = 35,
      duration: h,
      easing: a = t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: c = .1,
      infinite: d = !1,
      orientation: u = "vertical",
      gestureOrientation: p = "vertical",
      touchMultiplier: m = 1,
      wheelMultiplier: v = 1,
      autoResize: g = !0,
      prevent: w,
      virtualScroll: S,
      __experimental__naiveDimensions: f = !1
    } = {}) {
      this.__isScrolling = !1, this.__isStopped = !1, this.__isLocked = !1, this.userData = {}, this.lastVelocity = 0, this.velocity = 0, this.direction = 0, this.onPointerDown = t => {
        1 === t.button && this.reset();
      }, this.onVirtualScroll = t => {
        if ("function" == typeof this.options.virtualScroll && !1 === this.options.virtualScroll(t)) return;
        const {
          deltaX: i,
          deltaY: e,
          event: s
        } = t;
        if (this.emitter.emit("virtual-scroll", {
          deltaX: i,
          deltaY: e,
          event: s
        }), s.ctrlKey) return;
        const o = s.type.includes("touch"),
          n = s.type.includes("wheel");
        this.isTouching = "touchstart" === s.type || "touchmove" === s.type;
        if (this.options.syncTouch && o && "touchstart" === s.type && !this.isStopped && !this.isLocked) return void this.reset();
        const l = 0 === i && 0 === e,
          r = "vertical" === this.options.gestureOrientation && 0 === e || "horizontal" === this.options.gestureOrientation && 0 === i;
        if (l || r) return;
        let h = s.composedPath();
        h = h.slice(0, h.indexOf(this.rootElement));
        const a = this.options.prevent;
        if (h.find(t => {
          var i, e, s, l, r;
          return t instanceof Element && ("function" == typeof a && (null == a ? void 0 : a(t)) || (null === (i = t.hasAttribute) || void 0 === i ? void 0 : i.call(t, "data-lenis-prevent")) || o && (null === (e = t.hasAttribute) || void 0 === e ? void 0 : e.call(t, "data-lenis-prevent-touch")) || n && (null === (s = t.hasAttribute) || void 0 === s ? void 0 : s.call(t, "data-lenis-prevent-wheel")) || (null === (l = t.classList) || void 0 === l ? void 0 : l.contains("lenis")) && !(null === (r = t.classList) || void 0 === r ? void 0 : r.contains("lenis-stopped")));
        })) return;
        if (this.isStopped || this.isLocked) return void s.preventDefault();
        if (!(this.options.syncTouch && o || this.options.smoothWheel && n)) return this.isScrolling = "native", void this.animate.stop();
        s.preventDefault();
        let c = e;
        "both" === this.options.gestureOrientation ? c = Math.abs(e) > Math.abs(i) ? e : i : "horizontal" === this.options.gestureOrientation && (c = i);
        const d = o && this.options.syncTouch,
          u = o && "touchend" === s.type && Math.abs(c) > 5;
        u && (c = this.velocity * this.options.touchInertiaMultiplier), this.scrollTo(this.targetScroll + c, Object.assign({
          programmatic: !1
        }, d ? {
          lerp: u ? this.options.syncTouchLerp : 1
        } : {
          lerp: this.options.lerp,
          duration: this.options.duration,
          easing: this.options.easing
        }));
      }, this.onNativeScroll = () => {
        if (clearTimeout(this.__resetVelocityTimeout), delete this.__resetVelocityTimeout, this.__preventNextNativeScrollEvent) delete this.__preventNextNativeScrollEvent;else if (!1 === this.isScrolling || "native" === this.isScrolling) {
          const t = this.animatedScroll;
          this.animatedScroll = this.targetScroll = this.actualScroll, this.lastVelocity = this.velocity, this.velocity = this.animatedScroll - t, this.direction = Math.sign(this.animatedScroll - t), this.isScrolling = "native", this.emit(), 0 !== this.velocity && (this.__resetVelocityTimeout = setTimeout(() => {
            this.lastVelocity = this.velocity, this.velocity = 0, this.isScrolling = !1, this.emit();
          }, 400));
        }
      }, window.lenisVersion = "1.1.9", t && t !== document.documentElement && t !== document.body || (t = window), this.options = {
        wrapper: t,
        content: i,
        wheelEventsTarget: e,
        eventsTarget: s,
        smoothWheel: o,
        syncTouch: n,
        syncTouchLerp: l,
        touchInertiaMultiplier: r,
        duration: h,
        easing: a,
        lerp: c,
        infinite: d,
        gestureOrientation: p,
        orientation: u,
        touchMultiplier: m,
        wheelMultiplier: v,
        autoResize: g,
        prevent: w,
        virtualScroll: S,
        __experimental__naiveDimensions: f
      }, this.animate = new Animate(), this.emitter = new Emitter(), this.dimensions = new Dimensions({
        wrapper: t,
        content: i,
        autoResize: g
      }), this.updateClassName(), this.userData = {}, this.time = 0, this.velocity = this.lastVelocity = 0, this.isLocked = !1, this.isStopped = !1, this.isScrolling = !1, this.targetScroll = this.animatedScroll = this.actualScroll, this.options.wrapper.addEventListener("scroll", this.onNativeScroll, !1), this.options.wrapper.addEventListener("pointerdown", this.onPointerDown, !1), this.virtualScroll = new VirtualScroll(s, {
        touchMultiplier: m,
        wheelMultiplier: v
      }), this.virtualScroll.on("scroll", this.onVirtualScroll);
    }
    destroy() {
      this.emitter.destroy(), this.options.wrapper.removeEventListener("scroll", this.onNativeScroll, !1), this.options.wrapper.removeEventListener("pointerdown", this.onPointerDown, !1), this.virtualScroll.destroy(), this.dimensions.destroy(), this.cleanUpClassName();
    }
    on(t, i) {
      return this.emitter.on(t, i);
    }
    off(t, i) {
      return this.emitter.off(t, i);
    }
    setScroll(t) {
      this.isHorizontal ? this.rootElement.scrollLeft = t : this.rootElement.scrollTop = t;
    }
    resize() {
      this.dimensions.resize();
    }
    emit() {
      this.emitter.emit("scroll", this);
    }
    reset() {
      this.isLocked = !1, this.isScrolling = !1, this.animatedScroll = this.targetScroll = this.actualScroll, this.lastVelocity = this.velocity = 0, this.animate.stop();
    }
    start() {
      this.isStopped && (this.isStopped = !1, this.reset());
    }
    stop() {
      this.isStopped || (this.isStopped = !0, this.animate.stop(), this.reset());
    }
    raf(t) {
      const i = t - (this.time || t);
      this.time = t, this.animate.advance(.001 * i);
    }
    scrollTo(t, {
      offset: i = 0,
      immediate: e = !1,
      lock: s = !1,
      duration: o = this.options.duration,
      easing: n = this.options.easing,
      lerp: l = this.options.lerp,
      onStart: r,
      onComplete: h,
      force: a = !1,
      programmatic: c = !0,
      userData: d = {}
    } = {}) {
      if (!this.isStopped && !this.isLocked || a) {
        if ("string" == typeof t && ["top", "left", "start"].includes(t)) t = 0;else if ("string" == typeof t && ["bottom", "right", "end"].includes(t)) t = this.limit;else {
          let e;
          if ("string" == typeof t ? e = document.querySelector(t) : t instanceof HTMLElement && (null == t ? void 0 : t.nodeType) && (e = t), e) {
            if (this.options.wrapper !== window) {
              const t = this.rootElement.getBoundingClientRect();
              i -= this.isHorizontal ? t.left : t.top;
            }
            const s = e.getBoundingClientRect();
            t = (this.isHorizontal ? s.left : s.top) + this.animatedScroll;
          }
        }
        if ("number" == typeof t && (t += i, t = Math.round(t), this.options.infinite ? c && (this.targetScroll = this.animatedScroll = this.scroll) : t = clamp$2(0, t, this.limit), t !== this.targetScroll)) {
          if (this.userData = d, e) return this.animatedScroll = this.targetScroll = t, this.setScroll(this.scroll), this.reset(), this.preventNextNativeScrollEvent(), this.emit(), null == h || h(this), void (this.userData = {});
          c || (this.targetScroll = t), this.animate.fromTo(this.animatedScroll, t, {
            duration: o,
            easing: n,
            lerp: l,
            onStart: () => {
              s && (this.isLocked = !0), this.isScrolling = "smooth", null == r || r(this);
            },
            onUpdate: (t, i) => {
              this.isScrolling = "smooth", this.lastVelocity = this.velocity, this.velocity = t - this.animatedScroll, this.direction = Math.sign(this.velocity), this.animatedScroll = t, this.setScroll(this.scroll), c && (this.targetScroll = t), i || this.emit(), i && (this.reset(), this.emit(), null == h || h(this), this.userData = {}, this.preventNextNativeScrollEvent());
            }
          });
        }
      }
    }
    preventNextNativeScrollEvent() {
      this.__preventNextNativeScrollEvent = !0, requestAnimationFrame(() => {
        delete this.__preventNextNativeScrollEvent;
      });
    }
    get rootElement() {
      return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
    }
    get limit() {
      return this.options.__experimental__naiveDimensions ? this.isHorizontal ? this.rootElement.scrollWidth - this.rootElement.clientWidth : this.rootElement.scrollHeight - this.rootElement.clientHeight : this.dimensions.limit[this.isHorizontal ? "x" : "y"];
    }
    get isHorizontal() {
      return "horizontal" === this.options.orientation;
    }
    get actualScroll() {
      return this.isHorizontal ? this.rootElement.scrollLeft : this.rootElement.scrollTop;
    }
    get scroll() {
      return this.options.infinite ? function modulo(t, i) {
        return (t % i + i) % i;
      }(this.animatedScroll, this.limit) : this.animatedScroll;
    }
    get progress() {
      return 0 === this.limit ? 1 : this.scroll / this.limit;
    }
    get isScrolling() {
      return this.__isScrolling;
    }
    set isScrolling(t) {
      this.__isScrolling !== t && (this.__isScrolling = t, this.updateClassName());
    }
    get isStopped() {
      return this.__isStopped;
    }
    set isStopped(t) {
      this.__isStopped !== t && (this.__isStopped = t, this.updateClassName());
    }
    get isLocked() {
      return this.__isLocked;
    }
    set isLocked(t) {
      this.__isLocked !== t && (this.__isLocked = t, this.updateClassName());
    }
    get isSmooth() {
      return "smooth" === this.isScrolling;
    }
    get className() {
      let t = "lenis";
      return this.isStopped && (t += " lenis-stopped"), this.isLocked && (t += " lenis-locked"), this.isScrolling && (t += " lenis-scrolling"), "smooth" === this.isScrolling && (t += " lenis-smooth"), t;
    }
    updateClassName() {
      this.cleanUpClassName(), this.rootElement.className = `${this.rootElement.className} ${this.className}`.trim();
    }
    cleanUpClassName() {
      this.rootElement.className = this.rootElement.className.replace(/lenis(-\w+)?/g, "").trim();
    }
  }

  gsapWithCSS.registerPlugin(ScrollTrigger);
  function smooth() {
    const lenis = new Lenis();
    lenis.on('scroll', e => {
      // console.log(e)
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsapWithCSS.ticker.add(time => {
      lenis.raf(time * 1000);
    });
    gsapWithCSS.ticker.lagSmoothing(0);
  }

  // Calculate View height

  function calculateVH() {
    // console.log('calculate VH');

    var vh = window.innerHeight * 0.01;

    // console.log(vh);
    document.documentElement.style.setProperty('--vh', vh + 'px');

    // console.log(vh);
  }

  function revealFooter() {
    // console.log('reveal Footer');

    const footer = document.querySelector('.site-footer:not(.footer__contact)');
    ScrollTrigger.create({
      trigger: footer,
      pin: true,
      start: "top top",
      endTrigger: '#wrapper',
      end: "bottom top"
      // pinSpacing: false
    });
  }

  /*!
   * strings: 3.12.5
   * https://gsap.com
   *
   * Copyright 2008-2024, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license or for
   * Club GSAP members, the agreement issued with that membership.
   * @author: Jack Doyle, jack@greensock.com
  */
  var emojiExp = /([\uD800-\uDBFF][\uDC00-\uDFFF](?:[\u200D\uFE0F][\uD800-\uDBFF][\uDC00-\uDFFF]){2,}|\uD83D\uDC69(?:\u200D(?:(?:\uD83D\uDC69\u200D)?\uD83D\uDC67|(?:\uD83D\uDC69\u200D)?\uD83D\uDC66)|\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69\u200D(?:\uD83D\uDC69\u200D)?\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D(?:\uD83D\uDC69\u200D)?\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]\uFE0F|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC6F\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3C-\uDD3E\uDDD6-\uDDDF])\u200D[\u2640\u2642]\uFE0F|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F\u200D[\u2640\u2642]|(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642])\uFE0F|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC69\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708]))\uFE0F|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83D\uDC69\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69]))|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC66\u200D\uD83D\uDC66|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]))|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\u200D(?:(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC67|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC66)|\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDD1-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])?|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])\uFE0F)/;
  function getText(e) {
    var type = e.nodeType,
      result = "";
    if (type === 1 || type === 9 || type === 11) {
      if (typeof e.textContent === "string") {
        return e.textContent;
      } else {
        for (e = e.firstChild; e; e = e.nextSibling) {
          result += getText(e);
        }
      }
    } else if (type === 3 || type === 4) {
      return e.nodeValue;
    }
    return result;
  }

  /*!
   * SplitText: 3.12.5
   * https://gsap.com
   *
   * @license Copyright 2008-2024, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license or for
   * Club GSAP members, the agreement issued with that membership.
   * @author: Jack Doyle, jack@greensock.com
  */
  var _doc,
    _win,
    _coreInitted,
    gsap,
    _context,
    _toArray,
    _stripExp = /(?:\r|\n|\t\t)/g,
    //find carriage returns, new line feeds and double-tabs.
    _multipleSpacesExp = /(?:\s\s+)/g,
    _nonBreakingSpace = String.fromCharCode(160),
    _initCore = function _initCore(core) {
      _doc = document;
      _win = window;
      gsap = gsap || core || _win.gsap || console.warn("Please gsap.registerPlugin(SplitText)");
      if (gsap) {
        _toArray = gsap.utils.toArray;
        _context = gsap.core.context || function () {};
        _coreInitted = 1;
      }
    },
    //<name>SplitText</name>
    _getComputedStyle = function _getComputedStyle(element) {
      return _win.getComputedStyle(element);
    },
    _isAbsolute = function _isAbsolute(vars) {
      return vars.position === "absolute" || vars.absolute === true;
    },
    //some characters are combining marks (think diacritics/accents in European languages) which involve 2 or 4 characters that combine in the browser to form a single character. Pass in the remaining text and an array of the special characters to search for and if the text starts with one of those special characters, it'll spit back the number of characters to retain (often 2 or 4). Used in the specialChars features that was introduced in 0.6.0.
    _findSpecialChars = function _findSpecialChars(text, chars) {
      var i = chars.length,
        s;
      while (--i > -1) {
        s = chars[i];
        if (text.substr(0, s.length) === s) {
          return s.length;
        }
      }
    },
    _divStart = " style='position:relative;display:inline-block;'",
    _cssClassFunc = function _cssClassFunc(cssClass, tag) {
      if (cssClass === void 0) {
        cssClass = "";
      }
      var iterate = ~cssClass.indexOf("++"),
        num = 1;
      if (iterate) {
        cssClass = cssClass.split("++").join("");
      }
      return function () {
        return "<" + tag + _divStart + (cssClass ? " class='" + cssClass + (iterate ? num++ : "") + "'>" : ">");
      };
    },
    _swapText = function _swapText(element, oldText, newText) {
      var type = element.nodeType;
      if (type === 1 || type === 9 || type === 11) {
        for (element = element.firstChild; element; element = element.nextSibling) {
          _swapText(element, oldText, newText);
        }
      } else if (type === 3 || type === 4) {
        element.nodeValue = element.nodeValue.split(oldText).join(newText);
      }
    },
    _pushReversed = function _pushReversed(a, merge) {
      var i = merge.length;
      while (--i > -1) {
        a.push(merge[i]);
      }
    },
    _isBeforeWordDelimiter = function _isBeforeWordDelimiter(e, root, wordDelimiter) {
      var next;
      while (e && e !== root) {
        next = e._next || e.nextSibling;
        if (next) {
          return next.textContent.charAt(0) === wordDelimiter;
        }
        e = e.parentNode || e._parent;
      }
    },
    _deWordify = function _deWordify(e) {
      var children = _toArray(e.childNodes),
        l = children.length,
        i,
        child;
      for (i = 0; i < l; i++) {
        child = children[i];
        if (child._isSplit) {
          _deWordify(child);
        } else {
          if (i && child.previousSibling && child.previousSibling.nodeType === 3) {
            child.previousSibling.nodeValue += child.nodeType === 3 ? child.nodeValue : child.firstChild.nodeValue;
            e.removeChild(child);
          } else if (child.nodeType !== 3) {
            e.insertBefore(child.firstChild, child);
            e.removeChild(child);
          }
        }
      }
    },
    _getStyleAsNumber = function _getStyleAsNumber(name, computedStyle) {
      return parseFloat(computedStyle[name]) || 0;
    },
    _setPositionsAfterSplit = function _setPositionsAfterSplit(element, vars, allChars, allWords, allLines, origWidth, origHeight) {
      var cs = _getComputedStyle(element),
        paddingLeft = _getStyleAsNumber("paddingLeft", cs),
        lineOffsetY = -999,
        borderTopAndBottom = _getStyleAsNumber("borderBottomWidth", cs) + _getStyleAsNumber("borderTopWidth", cs),
        borderLeftAndRight = _getStyleAsNumber("borderLeftWidth", cs) + _getStyleAsNumber("borderRightWidth", cs),
        padTopAndBottom = _getStyleAsNumber("paddingTop", cs) + _getStyleAsNumber("paddingBottom", cs),
        padLeftAndRight = _getStyleAsNumber("paddingLeft", cs) + _getStyleAsNumber("paddingRight", cs),
        lineThreshold = _getStyleAsNumber("fontSize", cs) * (vars.lineThreshold || 0.2),
        textAlign = cs.textAlign,
        charArray = [],
        wordArray = [],
        lineArray = [],
        wordDelimiter = vars.wordDelimiter || " ",
        tag = vars.tag ? vars.tag : vars.span ? "span" : "div",
        types = vars.type || vars.split || "chars,words,lines",
        lines = allLines && ~types.indexOf("lines") ? [] : null,
        words = ~types.indexOf("words"),
        chars = ~types.indexOf("chars"),
        absolute = _isAbsolute(vars),
        linesClass = vars.linesClass,
        iterateLine = ~(linesClass || "").indexOf("++"),
        spaceNodesToRemove = [],
        isFlex = cs.display === "flex",
        prevInlineDisplay = element.style.display,
        i,
        j,
        l,
        node,
        nodes,
        isChild,
        curLine,
        addWordSpaces,
        style,
        lineNode,
        lineWidth,
        offset;
      iterateLine && (linesClass = linesClass.split("++").join(""));
      isFlex && (element.style.display = "block"); //copy all the descendant nodes into an array (we can't use a regular nodeList because it's live and we may need to renest things)

      j = element.getElementsByTagName("*");
      l = j.length;
      nodes = [];
      for (i = 0; i < l; i++) {
        nodes[i] = j[i];
      } //for absolute positioning, we need to record the x/y offsets and width/height for every <div>. And even if we're not positioning things absolutely, in order to accommodate lines, we must figure out where the y offset changes so that we can sense where the lines break, and we populate the lines array.

      if (lines || absolute) {
        for (i = 0; i < l; i++) {
          node = nodes[i];
          isChild = node.parentNode === element;
          if (isChild || absolute || chars && !words) {
            offset = node.offsetTop;
            if (lines && isChild && Math.abs(offset - lineOffsetY) > lineThreshold && (node.nodeName !== "BR" || i === 0)) {
              //we found some rare occasions where a certain character like &#8209; could cause the offsetTop to be off by 1 pixel, so we build in a threshold.
              curLine = [];
              lines.push(curLine);
              lineOffsetY = offset;
            }
            if (absolute) {
              //record offset x and y, as well as width and height so that we can access them later for positioning. Grabbing them at once ensures we don't trigger a browser paint & we maximize performance.
              node._x = node.offsetLeft;
              node._y = offset;
              node._w = node.offsetWidth;
              node._h = node.offsetHeight;
            }
            if (lines) {
              if (node._isSplit && isChild || !chars && isChild || words && isChild || !words && node.parentNode.parentNode === element && !node.parentNode._isSplit) {
                curLine.push(node);
                node._x -= paddingLeft;
                if (_isBeforeWordDelimiter(node, element, wordDelimiter)) {
                  node._wordEnd = true;
                }
              }
              if (node.nodeName === "BR" && (node.nextSibling && node.nextSibling.nodeName === "BR" || i === 0)) {
                //two consecutive <br> tags signify a new [empty] line. Also, if the entire block of content STARTS with a <br>, add a line.
                lines.push([]);
              }
            }
          }
        }
      }
      for (i = 0; i < l; i++) {
        node = nodes[i];
        isChild = node.parentNode === element;
        if (node.nodeName === "BR") {
          if (lines || absolute) {
            node.parentNode && node.parentNode.removeChild(node);
            nodes.splice(i--, 1);
            l--;
          } else if (!words) {
            element.appendChild(node);
          }
          continue;
        }
        if (absolute) {
          style = node.style;
          if (!words && !isChild) {
            node._x += node.parentNode._x;
            node._y += node.parentNode._y;
          }
          style.left = node._x + "px";
          style.top = node._y + "px";
          style.position = "absolute";
          style.display = "block"; //if we don't set the width/height, things collapse in older versions of IE and the origin for transforms is thrown off in all browsers.

          style.width = node._w + 1 + "px"; //IE is 1px short sometimes. Avoid wrapping

          style.height = node._h + "px";
        }
        if (!words && chars) {
          //we always start out wrapping words in their own <div> so that line breaks happen correctly, but here we'll remove those <div> tags if necessary and re-nest the characters directly into the element rather than inside the word <div>
          if (node._isSplit) {
            node._next = j = node.nextSibling;
            node.parentNode.appendChild(node); //put it at the end to keep the order correct.

            while (j && j.nodeType === 3 && j.textContent === " ") {
              // if there are nodes that are just a space right afterward, go ahead and append them to the end so they're not out of order.
              node._next = j.nextSibling;
              node.parentNode.appendChild(j);
              j = j.nextSibling;
            }
          } else if (node.parentNode._isSplit) {
            node._parent = node.parentNode;
            if (!node.previousSibling && node.firstChild) {
              node.firstChild._isFirst = true;
            }
            if (node.nextSibling && node.nextSibling.textContent === " " && !node.nextSibling.nextSibling) {
              //if the last node inside a nested element is just a space (like T<span>nested </span>), remove it otherwise it'll get placed in the wrong order. Don't remove it right away, though, because we need to sense when words/characters are before a space like _isBeforeWordDelimiter(). Removing it now would make that a false negative.
              spaceNodesToRemove.push(node.nextSibling);
            }
            node._next = node.nextSibling && node.nextSibling._isFirst ? null : node.nextSibling;
            node.parentNode.removeChild(node);
            nodes.splice(i--, 1);
            l--;
          } else if (!isChild) {
            offset = !node.nextSibling && _isBeforeWordDelimiter(node.parentNode, element, wordDelimiter); //if this is the last letter in the word (and we're not breaking by lines and not positioning things absolutely), we need to add a space afterwards so that the characters don't just mash together

            node.parentNode._parent && node.parentNode._parent.appendChild(node);
            offset && node.parentNode.appendChild(_doc.createTextNode(" "));
            if (tag === "span") {
              node.style.display = "inline"; //so that word breaks are honored properly.
            }

            charArray.push(node);
          }
        } else if (node.parentNode._isSplit && !node._isSplit && node.innerHTML !== "") {
          wordArray.push(node);
        } else if (chars && !node._isSplit) {
          if (tag === "span") {
            node.style.display = "inline";
          }
          charArray.push(node);
        }
      }
      i = spaceNodesToRemove.length;
      while (--i > -1) {
        spaceNodesToRemove[i].parentNode.removeChild(spaceNodesToRemove[i]);
      }
      if (lines) {
        //the next 7 lines just give us the line width in the most reliable way and figure out the left offset (if position isn't relative or absolute). We must set the width along with text-align to ensure everything works properly for various alignments.
        if (absolute) {
          lineNode = _doc.createElement(tag);
          element.appendChild(lineNode);
          lineWidth = lineNode.offsetWidth + "px";
          offset = lineNode.offsetParent === element ? 0 : element.offsetLeft;
          element.removeChild(lineNode);
        }
        style = element.style.cssText;
        element.style.cssText = "display:none;"; //to improve performance, set display:none on the element so that the browser doesn't have to worry about reflowing or rendering while we're renesting things. We'll revert the cssText later.
        //we can't use element.innerHTML = "" because that causes IE to literally delete all the nodes and their content even though we've stored them in an array! So we must loop through the children and remove them.

        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
        addWordSpaces = wordDelimiter === " " && (!absolute || !words && !chars);
        for (i = 0; i < lines.length; i++) {
          curLine = lines[i];
          lineNode = _doc.createElement(tag);
          lineNode.style.cssText = "display:block;text-align:" + textAlign + ";position:" + (absolute ? "absolute;" : "relative;");
          if (linesClass) {
            lineNode.className = linesClass + (iterateLine ? i + 1 : "");
          }
          lineArray.push(lineNode);
          l = curLine.length;
          for (j = 0; j < l; j++) {
            if (curLine[j].nodeName !== "BR") {
              node = curLine[j];
              lineNode.appendChild(node);
              addWordSpaces && node._wordEnd && lineNode.appendChild(_doc.createTextNode(" "));
              if (absolute) {
                if (j === 0) {
                  lineNode.style.top = node._y + "px";
                  lineNode.style.left = paddingLeft + offset + "px";
                }
                node.style.top = "0px";
                if (offset) {
                  node.style.left = node._x - offset + "px";
                }
              }
            }
          }
          if (l === 0) {
            //if there are no nodes in the line (typically meaning there were two consecutive <br> tags, just add a non-breaking space so that things display properly.
            lineNode.innerHTML = "&nbsp;";
          } else if (!words && !chars) {
            _deWordify(lineNode);
            _swapText(lineNode, String.fromCharCode(160), " ");
          }
          if (absolute) {
            lineNode.style.width = lineWidth;
            lineNode.style.height = node._h + "px";
          }
          element.appendChild(lineNode);
        }
        element.style.cssText = style;
      } //if everything shifts to being position:absolute, the container can collapse in terms of height or width, so fix that here.

      if (absolute) {
        if (origHeight > element.clientHeight) {
          element.style.height = origHeight - padTopAndBottom + "px";
          if (element.clientHeight < origHeight) {
            //IE8 and earlier use a different box model - we must include padding and borders
            element.style.height = origHeight + borderTopAndBottom + "px";
          }
        }
        if (origWidth > element.clientWidth) {
          element.style.width = origWidth - padLeftAndRight + "px";
          if (element.clientWidth < origWidth) {
            //IE8 and earlier use a different box model - we must include padding and borders
            element.style.width = origWidth + borderLeftAndRight + "px";
          }
        }
      }
      isFlex && (prevInlineDisplay ? element.style.display = prevInlineDisplay : element.style.removeProperty("display"));
      _pushReversed(allChars, charArray);
      words && _pushReversed(allWords, wordArray);
      _pushReversed(allLines, lineArray);
    },
    _splitRawText = function _splitRawText(element, vars, wordStart, charStart) {
      var tag = vars.tag ? vars.tag : vars.span ? "span" : "div",
        types = vars.type || vars.split || "chars,words,lines",
        //words = (types.indexOf("words") !== -1),
        chars = ~types.indexOf("chars"),
        absolute = _isAbsolute(vars),
        wordDelimiter = vars.wordDelimiter || " ",
        isWordDelimiter = function isWordDelimiter(_char) {
          return _char === wordDelimiter || _char === _nonBreakingSpace && wordDelimiter === " ";
        },
        space = wordDelimiter !== " " ? "" : absolute ? "&#173; " : " ",
        wordEnd = "</" + tag + ">",
        wordIsOpen = 1,
        specialChars = vars.specialChars ? typeof vars.specialChars === "function" ? vars.specialChars : _findSpecialChars : null,
        //specialChars can be an array or a function. For performance reasons, we always set this local "specialChars" to a function to which we pass the remaining text and whatever the original vars.specialChars was so that if it's an array, it works with the _findSpecialChars() function.
        text,
        splitText,
        i,
        j,
        l,
        character,
        hasTagStart,
        testResult,
        container = _doc.createElement("div"),
        parent = element.parentNode;
      parent.insertBefore(container, element);
      container.textContent = element.nodeValue;
      parent.removeChild(element);
      element = container;
      text = getText(element);
      hasTagStart = text.indexOf("<") !== -1;
      if (vars.reduceWhiteSpace !== false) {
        text = text.replace(_multipleSpacesExp, " ").replace(_stripExp, "");
      }
      if (hasTagStart) {
        text = text.split("<").join("{{LT}}"); //we can't leave "<" in the string, or when we set the innerHTML, it can be interpreted as a node
      }

      l = text.length;
      splitText = (text.charAt(0) === " " ? space : "") + wordStart();
      for (i = 0; i < l; i++) {
        character = text.charAt(i);
        if (specialChars && (testResult = specialChars(text.substr(i), vars.specialChars))) {
          // look for any specialChars that were declared. Remember, they can be passed in like {specialChars:["मी", "पा", "है"]} or a function could be defined instead. Either way, the function should return the number of characters that should be grouped together for this "character".
          character = text.substr(i, testResult || 1);
          splitText += chars && character !== " " ? charStart() + character + "</" + tag + ">" : character;
          i += testResult - 1;
        } else if (isWordDelimiter(character) && !isWordDelimiter(text.charAt(i - 1)) && i) {
          splitText += wordIsOpen ? wordEnd : "";
          wordIsOpen = 0;
          while (isWordDelimiter(text.charAt(i + 1))) {
            //skip over empty spaces (to avoid making them words)
            splitText += space;
            i++;
          }
          if (i === l - 1) {
            splitText += space;
          } else if (text.charAt(i + 1) !== ")") {
            splitText += space + wordStart();
            wordIsOpen = 1;
          }
        } else if (character === "{" && text.substr(i, 6) === "{{LT}}") {
          splitText += chars ? charStart() + "{{LT}}" + "</" + tag + ">" : "{{LT}}";
          i += 5;
        } else if (character.charCodeAt(0) >= 0xD800 && character.charCodeAt(0) <= 0xDBFF || text.charCodeAt(i + 1) >= 0xFE00 && text.charCodeAt(i + 1) <= 0xFE0F) {
          //special emoji characters use 2 or 4 unicode characters that we must keep together.
          j = ((text.substr(i, 12).split(emojiExp) || [])[1] || "").length || 2;
          splitText += chars && character !== " " ? charStart() + text.substr(i, j) + "</" + tag + ">" : text.substr(i, j);
          i += j - 1;
        } else {
          splitText += chars && character !== " " ? charStart() + character + "</" + tag + ">" : character;
        }
      }
      element.outerHTML = splitText + (wordIsOpen ? wordEnd : "");
      hasTagStart && _swapText(parent, "{{LT}}", "<"); //note: don't perform this on "element" because that gets replaced with all new elements when we set element.outerHTML.
    },
    _split = function _split(element, vars, wordStart, charStart) {
      var children = _toArray(element.childNodes),
        l = children.length,
        absolute = _isAbsolute(vars),
        i,
        child;
      if (element.nodeType !== 3 || l > 1) {
        vars.absolute = false;
        for (i = 0; i < l; i++) {
          child = children[i];
          child._next = child._isFirst = child._parent = child._wordEnd = null;
          if (child.nodeType !== 3 || /\S+/.test(child.nodeValue)) {
            if (absolute && child.nodeType !== 3 && _getComputedStyle(child).display === "inline") {
              //if there's a child node that's display:inline, switch it to inline-block so that absolute positioning works properly (most browsers don't report offsetTop/offsetLeft properly inside a <span> for example)
              child.style.display = "inline-block";
              child.style.position = "relative";
            }
            child._isSplit = true;
            _split(child, vars, wordStart, charStart); //don't split lines on child elements
          }
        }

        vars.absolute = absolute;
        element._isSplit = true;
        return;
      }
      _splitRawText(element, vars, wordStart, charStart);
    };
  var SplitText = /*#__PURE__*/function () {
    function SplitText(element, vars) {
      _coreInitted || _initCore();
      this.elements = _toArray(element);
      this.chars = [];
      this.words = [];
      this.lines = [];
      this._originals = [];
      this.vars = vars || {};
      _context(this);
      this.split(vars);
    }
    var _proto = SplitText.prototype;
    _proto.split = function split(vars) {
      this.isSplit && this.revert();
      this.vars = vars = vars || this.vars;
      this._originals.length = this.chars.length = this.words.length = this.lines.length = 0;
      var i = this.elements.length,
        tag = vars.tag ? vars.tag : vars.span ? "span" : "div",
        wordStart = _cssClassFunc(vars.wordsClass, tag),
        charStart = _cssClassFunc(vars.charsClass, tag),
        origHeight,
        origWidth,
        e; //we split in reversed order so that if/when we position:absolute elements, they don't affect the position of the ones after them in the document flow (shifting them up as they're taken out of the document flow).

      while (--i > -1) {
        e = this.elements[i];
        this._originals[i] = {
          html: e.innerHTML,
          style: e.getAttribute("style")
        };
        origHeight = e.clientHeight;
        origWidth = e.clientWidth;
        _split(e, vars, wordStart, charStart);
        _setPositionsAfterSplit(e, vars, this.chars, this.words, this.lines, origWidth, origHeight);
      }
      this.chars.reverse();
      this.words.reverse();
      this.lines.reverse();
      this.isSplit = true;
      return this;
    };
    _proto.revert = function revert() {
      var originals = this._originals;
      if (!originals) {
        throw "revert() call wasn't scoped properly.";
      }
      this.elements.forEach(function (e, i) {
        e.innerHTML = originals[i].html;
        e.setAttribute("style", originals[i].style);
      });
      this.chars = [];
      this.words = [];
      this.lines = [];
      this.isSplit = false;
      return this;
    };
    SplitText.create = function create(element, vars) {
      return new SplitText(element, vars);
    };
    return SplitText;
  }();
  SplitText.version = "3.12.5";
  SplitText.register = _initCore;

  gsapWithCSS.registerPlugin(SplitText);
  function moduleBanner() {
    // console.log('module banner 02');

    // Select all phrase containers
    const phrases = document.querySelectorAll('.new__phrases');

    // Function to create the animation sequence
    function animatePhrases() {
      let tl = gsapWithCSS.timeline({
        repeat: -1
      });
      phrases.forEach((phrase, index) => {
        // Separa la frase en palabras 
        let split = new SplitText(phrase, {
          type: 'words, chars',
          wordsClass: 'split-word',
          charsClass: 'split-chars'
        });

        // contenedor textos
        const container = document.querySelector('.new__text');
        container.style.opacity = 1;

        // obtener elementos
        const words = split.words;
        const chars = split.chars;
        const strongs = phrase.querySelectorAll('strong .split-word');
        chars.forEach(char => {
          let ElText = char.innerText;
          // console.log(ElText);                  
          char.innerHTML = '<div class="chars_type"></div><span>' + ElText + '</span>';
        });

        // Creamos los rectangulos en los strongs
        strongs.forEach(strong => {
          const rect = document.createElement('div');
          rect.className = 'highlight-rect';
          rect.style.position = 'absolute';
          rect.style.zIndex = '-1'; // Place it behind the text
          rect.style.pointerEvents = 'none'; // Avoid interaction issues
          strong.appendChild(rect);

          // Position the rectangle and set its initial size
          const strongRect = strong.getBoundingClientRect();
          phrase.getBoundingClientRect();
          rect.style.width = `${strongRect.width}px`;
          rect.style.height = `${strongRect.height}px`;
          // rect.style.top = `${strongRect.top - parentRect.top}px`;
          // rect.style.left = `${strongRect.left - parentRect.left}px`;
          rect.style.transform = 'scaleX(0)'; // Initially collapsed
          rect.style.transformOrigin = 'left center'; // Set the transform origin
        });

        // obtenemos todos los rectangulos
        const rects = phrase.querySelectorAll('.highlight-rect');
        const spans = phrase.querySelectorAll('.split-chars');
        spans.forEach((span, index) => {
          // console.log(index)

          const text = span.querySelector('span');
          const before = span.querySelector('.chars_type');
          tl.to(before, {
            opacity: 1,
            duration: 0.05
          });
          if (index == 0) {
            tl.to(before, {
              opacity: 0,
              duration: 0.2
            });
            tl.to(before, {
              opacity: 1,
              duration: 0.2
            });
            tl.to(before, {
              opacity: 0,
              duration: 0.2
            });
            tl.to(before, {
              opacity: 1,
              duration: 0.2
            });
          }
          tl.to(before, {
            left: '100%',
            duration: 0.05
          }, "<");
          tl.to(text, {
            opacity: 1,
            x: 0,
            duration: 0.1,
            stagger: 0.05,
            ease: 'power2.out'
          }, "<");
          tl.to(before, {
            opacity: 0,
            duration: 0.05
          });
        });
        tl
        // .to(
        //     chars,
        //     {
        //         opacity: 1,
        //         x: 0,
        //         duration: 0.3,
        //         stagger: 0.1,
        //         ease: 'power2.out'
        //     }
        // )
        .to(strongs, {
          color: '#000000',
          duration: 0.3,
          stagger: 0.3
        }).to(rects, {
          scaleX: 1,
          duration: 0.3,
          stagger: 0.3,
          ease: 'linear'
        }, "<").to({}, {
          duration: 2.5
        }).to(words, {
          opacity: 0,
          x: -20,
          duration: 0.2,
          ease: 'power2.out'
        }).to(strongs, {
          color: '--color-primary',
          duration: 0.2
        }, "<").to(rects, {
          opacity: 0,
          duration: 0.3,
          ease: 'power1.out'
        }, "<").to(rects, {
          scaleX: 0,
          duration: 0.5,
          ease: 'power1.out'
        }, "<");

        // Add space between phrases
        if (index < phrases.length - 1) {
          tl.to({}, {
            duration: 0.3
          }); // Add delay between phrases
        }
      });

      return tl;
    }

    // Start the animation
    animatePhrases();
  }

  gsapWithCSS.registerPlugin(ScrollTrigger, SplitText);
  function heroReveal() {
    // console.clear();

    const heros = document.querySelectorAll('.hero');
    heros.forEach(hero => {
      const text = hero.querySelector('.hero__text p');
      const refresh = hero.dataset.refresh;
      // console.log(100-refresh);

      const split = new SplitText(text, {
        type: 'words, chars',
        charsClass: 'char'
      });
      gsapWithCSS.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: "+=" + 2 * innerHeight,
          pin: true,
          scrub: 1,
          markers: false,
          pinSpacing: true,
          refreshPriority: 100 - refresh
        }
      }).set(split.chars, {
        opacity: 1,
        stagger: 0.1
      }, 0.1);

      // tl.scrollTrigger.refresh();
    });
  }

  function blocks() {
    const blocks = document.querySelectorAll('.blocks__item');

    // https://stackoverflow.com/a/4819886
    function isTouchDevice() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }
    const isTouch = isTouchDevice();
    blocks.forEach(block => {
      const video = block.querySelector('video');
      const hover = block.querySelector('.block__hover');
      const title = block.querySelector('.blocks__title');
      const text = block.querySelector('.blocks__text');
      const icon = block.querySelector('.blocks__arrow');
      const circle = icon.querySelector('svg circle');
      const arrow = icon.querySelector('svg path');
      if (isTouch) {
        video.style.display = 'none';
      }
      video.pause();
      const tl = gsapWithCSS.timeline({
        paused: true
      }).to(video, {
        opacity: 1,
        duration: 0.4
      }).to(title, {
        y: -100,
        duration: 0.4
      }, '<').to(text, {
        opacity: 1,
        duration: 0.4
      }, '<').to(icon, {
        rotate: 180,
        duration: 0.4
      }, '<').to(circle, {
        fill: 'rgba(0,0,0,0)',
        stroke: 'white',
        duration: 0.4
      }, '<').to(arrow, {
        stroke: 'white',
        duration: 0.4
      }, '<');
      hover.addEventListener('mouseover', () => {
        video.play();
        tl.play();
      });
      hover.addEventListener('mouseout', () => {
        tl.reverse();
        video.pause();
      });
    });
  }

  function moduleServices() {
    var services = gsapWithCSS.utils.toArray('.services__desktop');
    services.forEach((service, index) => {
      var images = service.querySelectorAll('.services__image');
      var texts = service.querySelectorAll('.service__text');
      var titles = service.querySelectorAll('.service__title');

      // Configura GSAP para dividir cada titulo en palabras al principio
      titles.forEach((title, index) => {
        const split = new SplitText(title, {
          type: 'chars, words',
          charsClass: 'split-chars',
          wordsClass: 'split-words'
        });
        gsapWithCSS.set(split.chars, {
          y: '100%'
        }); // Oculta las palabras al principio
      });

      // scrollTrigger para el pineo general
      ScrollTrigger.create({
        trigger: service,
        // scroller: ".scroller",
        scrub: true,
        // markers: true,
        pin: true,
        start: () => "top top",
        end: () => "+=" + (images.length - 1) * window.innerHeight,
        invalidateOnRefresh: true,
        pinSpacing: false
      });
      images.forEach((image, index) => {
        var bg = image.querySelector('img');

        // console.log( index ); 
        // console.log( images.length );

        if (index != images.length - 1) {
          let tl = gsapWithCSS.timeline({
            scrollTrigger: {
              trigger: image,
              start: "top top",
              end: "bottom top",
              scrub: 1,
              toggleActions: "play none reverse none",
              invalidateOnRefresh: true
              // markers: true,   
              // pin: true,
              // pinSpacing: false,
            }
          });

          tl.to(bg, {
            height: 0
          });
        }

        // Configura ScrollTrigger para desplazamiento hacia abajo
        ScrollTrigger.create({
          trigger: image,
          start: "top 52%",
          end: "top 52%",
          // markers: true,
          onEnter: self => {
            // console.log('arriba');
            if (self.direction === 1) {
              // Si se desplaza hacia abajo
              animateTitle(index); // Llama a la función animateTitle para desplazamiento hacia abajo
              // console.log('esta bajando?');
            }
          }
        });

        // Configura ScrollTrigger para desplazamiento hacia arriba
        ScrollTrigger.create({
          trigger: image,
          start: "top 48%",
          end: "top 48%",
          // markers: true,
          onEnterBack: self => {
            // console.log('abajo');
            if (self.direction === -1) {
              // Si se desplaza hacia arriba
              animateTitle(index - 1); // Llama a la función animateTitle para desplazamiento hacia arriba
              // console.log('esta subiendo?');
            }
          }
        });

        function animateTitle(index, direction) {
          if (index > -1) {
            // console.log(index);    
            texts.forEach((text, index) => {
              text.classList.remove("active");
            });
            texts[index].classList.add('active');
          }
        }
      });
    });
  }

  gsapWithCSS.registerPlugin(ScrollTrigger);
  function moduleGrid() {
    // console.log('module Cases');  

    const sections = document.querySelectorAll(".grid__desktop");
    sections.forEach((section, index) => {
      const first = section.querySelector(".grid__column:nth-child(1)");
      const second = section.querySelector(".grid__column:nth-child(2)");
      const third = section.querySelector(".grid__column:nth-child(3)");
      gsapWithCSS.to(first, {
        y: '-15%',
        // ease: "power2.inOut",
        scrollTrigger: {
          trigger: section,
          start: "top 20%",
          end: "bottom center",
          scrub: 1,
          markers: false
        }
      });
      gsapWithCSS.to(second, {
        y: '-30%',
        // ease: "power2.inOut",
        scrollTrigger: {
          trigger: section,
          start: "top 20%",
          end: "bottom center",
          scrub: 1,
          markers: false
        }
      });
      gsapWithCSS.to(third, {
        y: '-20%',
        // ease: "power2.inOut",
        scrollTrigger: {
          trigger: section,
          start: "top 20%",
          end: "bottom center",
          scrub: 1,
          markers: false
        }
      });
    });
  }

  gsapWithCSS.registerPlugin(ScrollTrigger);
  function moduleCardVideo() {
    // console.log('module Cases');

    // detect if
    function isTouchDevice() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }
    const isTouch = isTouchDevice();
    const cards = document.querySelectorAll('.card--video');
    cards.forEach(function (card) {
      if (!isTouch) {
        const image = card.querySelector('.card__image');
        const video = card.querySelector('video');

        // console.log(video.offsetWidth);

        card.addEventListener('mouseover', () => {
          video.play();
          video.style.opacity = '1';
          image.style.opacity = '0';
          image.style.width = video.offsetWidth - 2 + 'px';
          image.style.height = video.offsetHeight - 2 + 'px';
        });
        card.addEventListener('mouseout', () => {
          video.pause();
          video.style.opacity = '0';
          image.style.opacity = '1';
          image.style.width = card.offsetWidth + 'px';
          image.style.height = card.offsetHeight + 'px';
        });
      } else {
        card.classList.add('card--touch');
      }
    });
  }

  gsapWithCSS.registerPlugin(ScrollTrigger);
  function moduleAwards() {
    // console.log('module Cases'); 

    const sections = document.querySelectorAll(".awards");
    sections.forEach((section, index) => {
      const column = section.querySelector(".award__title");
      gsapWithCSS.to(column, {
        y: '-50vh',
        // ease: "power2.inOut",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          markers: false
        }
      });
    });
  }

  gsapWithCSS.registerPlugin(ScrollTrigger, SplitText);
  function moduleCases() {
    const cases = document.querySelectorAll('.cases');
    cases.forEach(item => {
      const texts = item.querySelectorAll(".case__text p");

      // Configura GSAP para dividir cada texto en palabras al principio
      texts.forEach((text, index) => {
        const split = new SplitText(text, {
          type: 'chars',
          charsClass: 'split-chars'
        });
        gsapWithCSS.set(split.chars, {
          opacity: 0
        }); // Oculta las palabras al principio
      });

      document.querySelector(".cases");
      let slides = item.querySelectorAll(".case");
      let getRatio = el => window.innerHeight / (window.innerHeight + el.offsetHeight);
      slides.forEach((slide, i) => {
        // Configura ScrollTrigger para desplazamiento hacia abajo
        ScrollTrigger.create({
          trigger: slide,
          start: "top 52%",
          end: "top 52%",
          // markers: true,
          onEnter: self => {
            // console.log('arriba');
            if (self.direction === 1) {
              // Si se desplaza hacia abajo
              animateTitle(i, 'down'); // Llama a la función animateTitle para desplazamiento hacia abajo
              // console.log('esta bajando?');
            }
          }
        });

        // Configura ScrollTrigger para desplazamiento hacia arriba
        ScrollTrigger.create({
          trigger: slide,
          start: "top 48%",
          end: "top 48%",
          // markers: true,
          onEnterBack: self => {
            // console.log('abajo');
            if (self.direction === -1) {
              // Si se desplaza hacia arriba
              animateTitle(i, 'up'); // Llama a la función animateTitle para desplazamiento hacia arriba
              // console.log('esta subiendo?');
            }
          }
        });

        let bg = slide.querySelector(".case__bg");
        let content = slide.querySelector(".case__text");
        let tl = gsapWithCSS.timeline({
          scrollTrigger: {
            trigger: slide,
            start: () => i ? "top bottom" : "top top",
            end: "bottom top",
            scrub: 0.1,
            invalidateOnRefresh: true
          }
        });
        tl.fromTo(bg, {
          y: () => i ? -window.innerHeight * getRatio(slide) : 0
        }, {
          y: () => window.innerHeight * (1 - getRatio(slide)),
          ease: "none"
        });
        tl.fromTo(content, {
          y: () => i ? window.innerHeight * -getRatio(slide) * 2 : 0
        }, {
          y: () => window.innerHeight * getRatio(slide) * 2,
          ease: "none"
        }, 0);

        // smooth y renderizado
        // gsap.ticker.lagSmoothing(0);

        // ScrollTrigger.defaults({
        //     refreshPriority: 1,
        //     fastScrollEnd: true
        // });
      });

      function animateTitle(index, direction) {
        // console.log('animated title');
        // console.log(index);

        // Selecciona el texto correspondiente al índice
        const currentText = direction === 'down' ? texts[index] : texts[index - 1];
        const previousIndex = direction === 'down' ? index - 1 : index;
        const previousText = texts[previousIndex]; // Texto anterior o siguiente según la dirección

        // Si hay texto anterior, anima su salida con SplitText
        if (previousText) {
          animateTextOut(previousText);
        }

        // Anima la entrada del texto actual con SplitText
        animateTextIn(currentText);
      }
      function animateTextOut(textElement) {
        // console.log('animated title Out');

        var chars = textElement.querySelectorAll('.split-chars');
        chars.forEach((word, index) => {
          gsapWithCSS.to(word, {
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "ease-in-out"
          });
        });
      }
      function animateTextIn(textElement) {
        // console.log('animated title In');

        var chars = textElement.querySelectorAll('.split-chars');
        gsapWithCSS.to(chars, {
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "ease-in-out"
        });
      }
    });
  }

  gsapWithCSS.registerPlugin(ScrollTrigger);
  function moduleMasonry() {
    // console.log('module Cases');  

    const images = document.querySelectorAll(".single__masonry img");
    images.forEach((image, index) => {
      // const image = image.querySelector("img");

      gsapWithCSS.to(image, {
        y: "0",
        // ease: "power2.inOut",
        scrollTrigger: {
          trigger: image,
          start: "top bottom",
          end: "bottom center",
          scrub: 1,
          markers: false
        }
      });
    });
  }

  /*!
   * lightgallery | 2.7.2 | September 20th 2023
   * http://www.lightgalleryjs.com/
   * Copyright (c) 2020 Sachin Neravath;
   * @license GPLv3
   */

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  var __assign$1 = function () {
    __assign$1 = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
    };
    return __assign$1.apply(this, arguments);
  };
  function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
    return r;
  }

  /**
   * List of lightGallery events
   * All events should be documented here
   * Below interfaces are used to build the website documentations
   * */
  var lGEvents$1 = {
    afterAppendSlide: 'lgAfterAppendSlide',
    init: 'lgInit',
    hasVideo: 'lgHasVideo',
    containerResize: 'lgContainerResize',
    updateSlides: 'lgUpdateSlides',
    afterAppendSubHtml: 'lgAfterAppendSubHtml',
    beforeOpen: 'lgBeforeOpen',
    afterOpen: 'lgAfterOpen',
    slideItemLoad: 'lgSlideItemLoad',
    beforeSlide: 'lgBeforeSlide',
    afterSlide: 'lgAfterSlide',
    posterClick: 'lgPosterClick',
    dragStart: 'lgDragStart',
    dragMove: 'lgDragMove',
    dragEnd: 'lgDragEnd',
    beforeNextSlide: 'lgBeforeNextSlide',
    beforePrevSlide: 'lgBeforePrevSlide',
    beforeClose: 'lgBeforeClose',
    afterClose: 'lgAfterClose',
    rotateLeft: 'lgRotateLeft',
    rotateRight: 'lgRotateRight',
    flipHorizontal: 'lgFlipHorizontal',
    flipVertical: 'lgFlipVertical',
    autoplay: 'lgAutoplay',
    autoplayStart: 'lgAutoplayStart',
    autoplayStop: 'lgAutoplayStop'
  };
  var lightGalleryCoreSettings = {
    mode: 'lg-slide',
    easing: 'ease',
    speed: 400,
    licenseKey: '0000-0000-000-0000',
    height: '100%',
    width: '100%',
    addClass: '',
    startClass: 'lg-start-zoom',
    backdropDuration: 300,
    container: '',
    startAnimationDuration: 400,
    zoomFromOrigin: true,
    hideBarsDelay: 0,
    showBarsAfter: 10000,
    slideDelay: 0,
    supportLegacyBrowser: true,
    allowMediaOverlap: false,
    videoMaxSize: '1280-720',
    loadYouTubePoster: true,
    defaultCaptionHeight: 0,
    ariaLabelledby: '',
    ariaDescribedby: '',
    resetScrollPosition: true,
    hideScrollbar: false,
    closable: true,
    swipeToClose: true,
    closeOnTap: true,
    showCloseIcon: true,
    showMaximizeIcon: false,
    loop: true,
    escKey: true,
    keyPress: true,
    trapFocus: true,
    controls: true,
    slideEndAnimation: true,
    hideControlOnEnd: false,
    mousewheel: false,
    getCaptionFromTitleOrAlt: true,
    appendSubHtmlTo: '.lg-sub-html',
    subHtmlSelectorRelative: false,
    preload: 2,
    numberOfSlideItemsInDom: 10,
    selector: '',
    selectWithin: '',
    nextHtml: '',
    prevHtml: '',
    index: 0,
    iframeWidth: '100%',
    iframeHeight: '100%',
    iframeMaxWidth: '100%',
    iframeMaxHeight: '100%',
    download: true,
    counter: true,
    appendCounterTo: '.lg-toolbar',
    swipeThreshold: 50,
    enableSwipe: true,
    enableDrag: true,
    dynamic: false,
    dynamicEl: [],
    extraProps: [],
    exThumbImage: '',
    isMobile: undefined,
    mobileSettings: {
      controls: false,
      showCloseIcon: false,
      download: false
    },
    plugins: [],
    strings: {
      closeGallery: 'Close gallery',
      toggleMaximize: 'Toggle maximize',
      previousSlide: 'Previous slide',
      nextSlide: 'Next slide',
      download: 'Download',
      playVideo: 'Play video',
      mediaLoadingFailed: 'Oops... Failed to load content...'
    }
  };
  function initLgPolyfills() {
    (function () {
      if (typeof window.CustomEvent === 'function') return false;
      function CustomEvent(event, params) {
        params = params || {
          bubbles: false,
          cancelable: false,
          detail: null
        };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      }
      window.CustomEvent = CustomEvent;
    })();
    (function () {
      if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
      }
    })();
  }
  var lgQuery = /** @class */function () {
    function lgQuery(selector) {
      this.cssVenderPrefixes = ['TransitionDuration', 'TransitionTimingFunction', 'Transform', 'Transition'];
      this.selector = this._getSelector(selector);
      this.firstElement = this._getFirstEl();
      return this;
    }
    lgQuery.generateUUID = function () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
      });
    };
    lgQuery.prototype._getSelector = function (selector, context) {
      if (context === void 0) {
        context = document;
      }
      if (typeof selector !== 'string') {
        return selector;
      }
      context = context || document;
      var fl = selector.substring(0, 1);
      if (fl === '#') {
        return context.querySelector(selector);
      } else {
        return context.querySelectorAll(selector);
      }
    };
    lgQuery.prototype._each = function (func) {
      if (!this.selector) {
        return this;
      }
      if (this.selector.length !== undefined) {
        [].forEach.call(this.selector, func);
      } else {
        func(this.selector, 0);
      }
      return this;
    };
    lgQuery.prototype._setCssVendorPrefix = function (el, cssProperty, value) {
      // prettier-ignore
      var property = cssProperty.replace(/-([a-z])/gi, function (s, group1) {
        return group1.toUpperCase();
      });
      if (this.cssVenderPrefixes.indexOf(property) !== -1) {
        el.style[property.charAt(0).toLowerCase() + property.slice(1)] = value;
        el.style['webkit' + property] = value;
        el.style['moz' + property] = value;
        el.style['ms' + property] = value;
        el.style['o' + property] = value;
      } else {
        el.style[property] = value;
      }
    };
    lgQuery.prototype._getFirstEl = function () {
      if (this.selector && this.selector.length !== undefined) {
        return this.selector[0];
      } else {
        return this.selector;
      }
    };
    lgQuery.prototype.isEventMatched = function (event, eventName) {
      var eventNamespace = eventName.split('.');
      return event.split('.').filter(function (e) {
        return e;
      }).every(function (e) {
        return eventNamespace.indexOf(e) !== -1;
      });
    };
    lgQuery.prototype.attr = function (attr, value) {
      if (value === undefined) {
        if (!this.firstElement) {
          return '';
        }
        return this.firstElement.getAttribute(attr);
      }
      this._each(function (el) {
        el.setAttribute(attr, value);
      });
      return this;
    };
    lgQuery.prototype.find = function (selector) {
      return $LG(this._getSelector(selector, this.selector));
    };
    lgQuery.prototype.first = function () {
      if (this.selector && this.selector.length !== undefined) {
        return $LG(this.selector[0]);
      } else {
        return $LG(this.selector);
      }
    };
    lgQuery.prototype.eq = function (index) {
      return $LG(this.selector[index]);
    };
    lgQuery.prototype.parent = function () {
      return $LG(this.selector.parentElement);
    };
    lgQuery.prototype.get = function () {
      return this._getFirstEl();
    };
    lgQuery.prototype.removeAttr = function (attributes) {
      var attrs = attributes.split(' ');
      this._each(function (el) {
        attrs.forEach(function (attr) {
          return el.removeAttribute(attr);
        });
      });
      return this;
    };
    lgQuery.prototype.wrap = function (className) {
      if (!this.firstElement) {
        return this;
      }
      var wrapper = document.createElement('div');
      wrapper.className = className;
      this.firstElement.parentNode.insertBefore(wrapper, this.firstElement);
      this.firstElement.parentNode.removeChild(this.firstElement);
      wrapper.appendChild(this.firstElement);
      return this;
    };
    lgQuery.prototype.addClass = function (classNames) {
      if (classNames === void 0) {
        classNames = '';
      }
      this._each(function (el) {
        // IE doesn't support multiple arguments
        classNames.split(' ').forEach(function (className) {
          if (className) {
            el.classList.add(className);
          }
        });
      });
      return this;
    };
    lgQuery.prototype.removeClass = function (classNames) {
      this._each(function (el) {
        // IE doesn't support multiple arguments
        classNames.split(' ').forEach(function (className) {
          if (className) {
            el.classList.remove(className);
          }
        });
      });
      return this;
    };
    lgQuery.prototype.hasClass = function (className) {
      if (!this.firstElement) {
        return false;
      }
      return this.firstElement.classList.contains(className);
    };
    lgQuery.prototype.hasAttribute = function (attribute) {
      if (!this.firstElement) {
        return false;
      }
      return this.firstElement.hasAttribute(attribute);
    };
    lgQuery.prototype.toggleClass = function (className) {
      if (!this.firstElement) {
        return this;
      }
      if (this.hasClass(className)) {
        this.removeClass(className);
      } else {
        this.addClass(className);
      }
      return this;
    };
    lgQuery.prototype.css = function (property, value) {
      var _this = this;
      this._each(function (el) {
        _this._setCssVendorPrefix(el, property, value);
      });
      return this;
    };
    // Need to pass separate namespaces for separate elements
    lgQuery.prototype.on = function (events, listener) {
      var _this = this;
      if (!this.selector) {
        return this;
      }
      events.split(' ').forEach(function (event) {
        if (!Array.isArray(lgQuery.eventListeners[event])) {
          lgQuery.eventListeners[event] = [];
        }
        lgQuery.eventListeners[event].push(listener);
        _this.selector.addEventListener(event.split('.')[0], listener);
      });
      return this;
    };
    // @todo - test this
    lgQuery.prototype.once = function (event, listener) {
      var _this = this;
      this.on(event, function () {
        _this.off(event);
        listener(event);
      });
      return this;
    };
    lgQuery.prototype.off = function (event) {
      var _this = this;
      if (!this.selector) {
        return this;
      }
      Object.keys(lgQuery.eventListeners).forEach(function (eventName) {
        if (_this.isEventMatched(event, eventName)) {
          lgQuery.eventListeners[eventName].forEach(function (listener) {
            _this.selector.removeEventListener(eventName.split('.')[0], listener);
          });
          lgQuery.eventListeners[eventName] = [];
        }
      });
      return this;
    };
    lgQuery.prototype.trigger = function (event, detail) {
      if (!this.firstElement) {
        return this;
      }
      var customEvent = new CustomEvent(event.split('.')[0], {
        detail: detail || null
      });
      this.firstElement.dispatchEvent(customEvent);
      return this;
    };
    // Does not support IE
    lgQuery.prototype.load = function (url) {
      var _this = this;
      fetch(url).then(function (res) {
        return res.text();
      }).then(function (html) {
        _this.selector.innerHTML = html;
      });
      return this;
    };
    lgQuery.prototype.html = function (html) {
      if (html === undefined) {
        if (!this.firstElement) {
          return '';
        }
        return this.firstElement.innerHTML;
      }
      this._each(function (el) {
        el.innerHTML = html;
      });
      return this;
    };
    lgQuery.prototype.append = function (html) {
      this._each(function (el) {
        if (typeof html === 'string') {
          el.insertAdjacentHTML('beforeend', html);
        } else {
          el.appendChild(html);
        }
      });
      return this;
    };
    lgQuery.prototype.prepend = function (html) {
      this._each(function (el) {
        el.insertAdjacentHTML('afterbegin', html);
      });
      return this;
    };
    lgQuery.prototype.remove = function () {
      this._each(function (el) {
        el.parentNode.removeChild(el);
      });
      return this;
    };
    lgQuery.prototype.empty = function () {
      this._each(function (el) {
        el.innerHTML = '';
      });
      return this;
    };
    lgQuery.prototype.scrollTop = function (scrollTop) {
      if (scrollTop !== undefined) {
        document.body.scrollTop = scrollTop;
        document.documentElement.scrollTop = scrollTop;
        return this;
      } else {
        return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      }
    };
    lgQuery.prototype.scrollLeft = function (scrollLeft) {
      if (scrollLeft !== undefined) {
        document.body.scrollLeft = scrollLeft;
        document.documentElement.scrollLeft = scrollLeft;
        return this;
      } else {
        return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
      }
    };
    lgQuery.prototype.offset = function () {
      if (!this.firstElement) {
        return {
          left: 0,
          top: 0
        };
      }
      var rect = this.firstElement.getBoundingClientRect();
      var bodyMarginLeft = $LG('body').style().marginLeft;
      // Minus body margin - https://stackoverflow.com/questions/30711548/is-getboundingclientrect-left-returning-a-wrong-value
      return {
        left: rect.left - parseFloat(bodyMarginLeft) + this.scrollLeft(),
        top: rect.top + this.scrollTop()
      };
    };
    lgQuery.prototype.style = function () {
      if (!this.firstElement) {
        return {};
      }
      return this.firstElement.currentStyle || window.getComputedStyle(this.firstElement);
    };
    // Width without padding and border even if box-sizing is used.
    lgQuery.prototype.width = function () {
      var style = this.style();
      return this.firstElement.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    };
    // Height without padding and border even if box-sizing is used.
    lgQuery.prototype.height = function () {
      var style = this.style();
      return this.firstElement.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    };
    lgQuery.eventListeners = {};
    return lgQuery;
  }();
  function $LG(selector) {
    initLgPolyfills();
    return new lgQuery(selector);
  }
  var defaultDynamicOptions = ['src', 'sources', 'subHtml', 'subHtmlUrl', 'html', 'video', 'poster', 'slideName', 'responsive', 'srcset', 'sizes', 'iframe', 'downloadUrl', 'download', 'width', 'facebookShareUrl', 'tweetText', 'iframeTitle', 'twitterShareUrl', 'pinterestShareUrl', 'pinterestText', 'fbHtml', 'disqusIdentifier', 'disqusUrl'];
  // Convert html data-attribute to camalcase
  function convertToData(attr) {
    // FInd a way for lgsize
    if (attr === 'href') {
      return 'src';
    }
    attr = attr.replace('data-', '');
    attr = attr.charAt(0).toLowerCase() + attr.slice(1);
    attr = attr.replace(/-([a-z])/g, function (g) {
      return g[1].toUpperCase();
    });
    return attr;
  }
  var utils = {
    /**
     * get possible width and height from the lgSize attribute. Used for ZoomFromOrigin option
     */
    getSize: function (el, container, spacing, defaultLgSize) {
      if (spacing === void 0) {
        spacing = 0;
      }
      var LGel = $LG(el);
      var lgSize = LGel.attr('data-lg-size') || defaultLgSize;
      if (!lgSize) {
        return;
      }
      var isResponsiveSizes = lgSize.split(',');
      // if at-least two viewport sizes are available
      if (isResponsiveSizes[1]) {
        var wWidth = window.innerWidth;
        for (var i = 0; i < isResponsiveSizes.length; i++) {
          var size_1 = isResponsiveSizes[i];
          var responsiveWidth = parseInt(size_1.split('-')[2], 10);
          if (responsiveWidth > wWidth) {
            lgSize = size_1;
            break;
          }
          // take last item as last option
          if (i === isResponsiveSizes.length - 1) {
            lgSize = size_1;
          }
        }
      }
      var size = lgSize.split('-');
      var width = parseInt(size[0], 10);
      var height = parseInt(size[1], 10);
      var cWidth = container.width();
      var cHeight = container.height() - spacing;
      var maxWidth = Math.min(cWidth, width);
      var maxHeight = Math.min(cHeight, height);
      var ratio = Math.min(maxWidth / width, maxHeight / height);
      return {
        width: width * ratio,
        height: height * ratio
      };
    },
    /**
     * @desc Get transform value based on the imageSize. Used for ZoomFromOrigin option
     * @param {jQuery Element}
     * @returns {String} Transform CSS string
     */
    getTransform: function (el, container, top, bottom, imageSize) {
      if (!imageSize) {
        return;
      }
      var LGel = $LG(el).find('img').first();
      if (!LGel.get()) {
        return;
      }
      var containerRect = container.get().getBoundingClientRect();
      var wWidth = containerRect.width;
      // using innerWidth to include mobile safari bottom bar
      var wHeight = container.height() - (top + bottom);
      var elWidth = LGel.width();
      var elHeight = LGel.height();
      var elStyle = LGel.style();
      var x = (wWidth - elWidth) / 2 - LGel.offset().left + (parseFloat(elStyle.paddingLeft) || 0) + (parseFloat(elStyle.borderLeft) || 0) + $LG(window).scrollLeft() + containerRect.left;
      var y = (wHeight - elHeight) / 2 - LGel.offset().top + (parseFloat(elStyle.paddingTop) || 0) + (parseFloat(elStyle.borderTop) || 0) + $LG(window).scrollTop() + top;
      var scX = elWidth / imageSize.width;
      var scY = elHeight / imageSize.height;
      var transform = 'translate3d(' + (x *= -1) + 'px, ' + (y *= -1) + 'px, 0) scale3d(' + scX + ', ' + scY + ', 1)';
      return transform;
    },
    getIframeMarkup: function (iframeWidth, iframeHeight, iframeMaxWidth, iframeMaxHeight, src, iframeTitle) {
      var title = iframeTitle ? 'title="' + iframeTitle + '"' : '';
      return "<div class=\"lg-video-cont lg-has-iframe\" style=\"width:" + iframeWidth + "; max-width:" + iframeMaxWidth + "; height: " + iframeHeight + "; max-height:" + iframeMaxHeight + "\">\n                    <iframe class=\"lg-object\" frameborder=\"0\" " + title + " src=\"" + src + "\"  allowfullscreen=\"true\"></iframe>\n                </div>";
    },
    getImgMarkup: function (index, src, altAttr, srcset, sizes, sources) {
      var srcsetAttr = srcset ? "srcset=\"" + srcset + "\"" : '';
      var sizesAttr = sizes ? "sizes=\"" + sizes + "\"" : '';
      var imgMarkup = "<img " + altAttr + " " + srcsetAttr + "  " + sizesAttr + " class=\"lg-object lg-image\" data-index=\"" + index + "\" src=\"" + src + "\" />";
      var sourceTag = '';
      if (sources) {
        var sourceObj = typeof sources === 'string' ? JSON.parse(sources) : sources;
        sourceTag = sourceObj.map(function (source) {
          var attrs = '';
          Object.keys(source).forEach(function (key) {
            // Do not remove the first space as it is required to separate the attributes
            attrs += " " + key + "=\"" + source[key] + "\"";
          });
          return "<source " + attrs + "></source>";
        });
      }
      return "" + sourceTag + imgMarkup;
    },
    // Get src from responsive src
    getResponsiveSrc: function (srcItms) {
      var rsWidth = [];
      var rsSrc = [];
      var src = '';
      for (var i = 0; i < srcItms.length; i++) {
        var _src = srcItms[i].split(' ');
        // Manage empty space
        if (_src[0] === '') {
          _src.splice(0, 1);
        }
        rsSrc.push(_src[0]);
        rsWidth.push(_src[1]);
      }
      var wWidth = window.innerWidth;
      for (var j = 0; j < rsWidth.length; j++) {
        if (parseInt(rsWidth[j], 10) > wWidth) {
          src = rsSrc[j];
          break;
        }
      }
      return src;
    },
    isImageLoaded: function (img) {
      if (!img) return false;
      // During the onload event, IE correctly identifies any images that
      // weren’t downloaded as not complete. Others should too. Gecko-based
      // browsers act like NS4 in that they report this incorrectly.
      if (!img.complete) {
        return false;
      }
      // However, they do have two very useful properties: naturalWidth and
      // naturalHeight. These give the true size of the image. If it failed
      // to load, either of these should be zero.
      if (img.naturalWidth === 0) {
        return false;
      }
      // No other way of checking: assume it’s ok.
      return true;
    },
    getVideoPosterMarkup: function (_poster, dummyImg, videoContStyle, playVideoString, _isVideo) {
      var videoClass = '';
      if (_isVideo && _isVideo.youtube) {
        videoClass = 'lg-has-youtube';
      } else if (_isVideo && _isVideo.vimeo) {
        videoClass = 'lg-has-vimeo';
      } else {
        videoClass = 'lg-has-html5';
      }
      return "<div class=\"lg-video-cont " + videoClass + "\" style=\"" + videoContStyle + "\">\n                <div class=\"lg-video-play-button\">\n                <svg\n                    viewBox=\"0 0 20 20\"\n                    preserveAspectRatio=\"xMidYMid\"\n                    focusable=\"false\"\n                    aria-labelledby=\"" + playVideoString + "\"\n                    role=\"img\"\n                    class=\"lg-video-play-icon\"\n                >\n                    <title>" + playVideoString + "</title>\n                    <polygon class=\"lg-video-play-icon-inner\" points=\"1,0 20,10 1,20\"></polygon>\n                </svg>\n                <svg class=\"lg-video-play-icon-bg\" viewBox=\"0 0 50 50\" focusable=\"false\">\n                    <circle cx=\"50%\" cy=\"50%\" r=\"20\"></circle></svg>\n                <svg class=\"lg-video-play-icon-circle\" viewBox=\"0 0 50 50\" focusable=\"false\">\n                    <circle cx=\"50%\" cy=\"50%\" r=\"20\"></circle>\n                </svg>\n            </div>\n            " + (dummyImg || '') + "\n            <img class=\"lg-object lg-video-poster\" src=\"" + _poster + "\" />\n        </div>";
    },
    getFocusableElements: function (container) {
      var elements = container.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
      var visibleElements = [].filter.call(elements, function (element) {
        var style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
      return visibleElements;
    },
    /**
     * @desc Create dynamic elements array from gallery items when dynamic option is false
     * It helps to avoid frequent DOM interaction
     * and avoid multiple checks for dynamic elments
     *
     * @returns {Array} dynamicEl
     */
    getDynamicOptions: function (items, extraProps, getCaptionFromTitleOrAlt, exThumbImage) {
      var dynamicElements = [];
      var availableDynamicOptions = __spreadArrays(defaultDynamicOptions, extraProps);
      [].forEach.call(items, function (item) {
        var dynamicEl = {};
        for (var i = 0; i < item.attributes.length; i++) {
          var attr = item.attributes[i];
          if (attr.specified) {
            var dynamicAttr = convertToData(attr.name);
            var label = '';
            if (availableDynamicOptions.indexOf(dynamicAttr) > -1) {
              label = dynamicAttr;
            }
            if (label) {
              dynamicEl[label] = attr.value;
            }
          }
        }
        var currentItem = $LG(item);
        var alt = currentItem.find('img').first().attr('alt');
        var title = currentItem.attr('title');
        var thumb = exThumbImage ? currentItem.attr(exThumbImage) : currentItem.find('img').first().attr('src');
        dynamicEl.thumb = thumb;
        if (getCaptionFromTitleOrAlt && !dynamicEl.subHtml) {
          dynamicEl.subHtml = title || alt || '';
        }
        dynamicEl.alt = alt || title || '';
        dynamicElements.push(dynamicEl);
      });
      return dynamicElements;
    },
    isMobile: function () {
      return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    },
    /**
     * @desc Check the given src is video
     * @param {String} src
     * @return {Object} video type
     * Ex:{ youtube  :  ["//www.youtube.com/watch?v=c0asJgSyxcY", "c0asJgSyxcY"] }
     *
     * @todo - this information can be moved to dynamicEl to avoid frequent calls
     */
    isVideo: function (src, isHTML5VIdeo, index) {
      if (!src) {
        if (isHTML5VIdeo) {
          return {
            html5: true
          };
        } else {
          console.error('lightGallery :- data-src is not provided on slide item ' + (index + 1) + '. Please make sure the selector property is properly configured. More info - https://www.lightgalleryjs.com/demos/html-markup/');
          return;
        }
      }
      var youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)([\&|?][\S]*)*/i);
      var vimeo = src.match(/\/\/(?:www\.)?(?:player\.)?vimeo.com\/(?:video\/)?([0-9a-z\-_]+)(.*)?/i);
      var wistia = src.match(/https?:\/\/(.+)?(wistia\.com|wi\.st)\/(medias|embed)\/([0-9a-z\-_]+)(.*)/);
      if (youtube) {
        return {
          youtube: youtube
        };
      } else if (vimeo) {
        return {
          vimeo: vimeo
        };
      } else if (wistia) {
        return {
          wistia: wistia
        };
      }
    }
  };

  // @ref - https://stackoverflow.com/questions/3971841/how-to-resize-images-proportionally-keeping-the-aspect-ratio
  // @ref - https://2ality.com/2017/04/setting-up-multi-platform-packages.html
  // Unique id for each gallery
  var lgId = 0;
  var LightGallery = /** @class */function () {
    function LightGallery(element, options) {
      this.lgOpened = false;
      this.index = 0;
      // lightGallery modules
      this.plugins = [];
      // false when lightGallery load first slide content;
      this.lGalleryOn = false;
      // True when a slide animation is in progress
      this.lgBusy = false;
      this.currentItemsInDom = [];
      // Scroll top value before lightGallery is opened
      this.prevScrollTop = 0;
      this.bodyPaddingRight = 0;
      this.isDummyImageRemoved = false;
      this.dragOrSwipeEnabled = false;
      this.mediaContainerPosition = {
        top: 0,
        bottom: 0
      };
      if (!element) {
        return this;
      }
      lgId++;
      this.lgId = lgId;
      this.el = element;
      this.LGel = $LG(element);
      this.generateSettings(options);
      this.buildModules();
      // When using dynamic mode, ensure dynamicEl is an array
      if (this.settings.dynamic && this.settings.dynamicEl !== undefined && !Array.isArray(this.settings.dynamicEl)) {
        throw 'When using dynamic mode, you must also define dynamicEl as an Array.';
      }
      this.galleryItems = this.getItems();
      this.normalizeSettings();
      // Gallery items
      this.init();
      this.validateLicense();
      return this;
    }
    LightGallery.prototype.generateSettings = function (options) {
      // lightGallery settings
      this.settings = __assign$1(__assign$1({}, lightGalleryCoreSettings), options);
      if (this.settings.isMobile && typeof this.settings.isMobile === 'function' ? this.settings.isMobile() : utils.isMobile()) {
        var mobileSettings = __assign$1(__assign$1({}, this.settings.mobileSettings), this.settings.mobileSettings);
        this.settings = __assign$1(__assign$1({}, this.settings), mobileSettings);
      }
    };
    LightGallery.prototype.normalizeSettings = function () {
      if (this.settings.slideEndAnimation) {
        this.settings.hideControlOnEnd = false;
      }
      if (!this.settings.closable) {
        this.settings.swipeToClose = false;
      }
      // And reset it on close to get the correct value next time
      this.zoomFromOrigin = this.settings.zoomFromOrigin;
      // At the moment, Zoom from image doesn't support dynamic options
      // @todo add zoomFromOrigin support for dynamic images
      if (this.settings.dynamic) {
        this.zoomFromOrigin = false;
      }
      if (!this.settings.container) {
        this.settings.container = document.body;
      }
      // settings.preload should not be grater than $item.length
      this.settings.preload = Math.min(this.settings.preload, this.galleryItems.length);
    };
    LightGallery.prototype.init = function () {
      var _this = this;
      this.addSlideVideoInfo(this.galleryItems);
      this.buildStructure();
      this.LGel.trigger(lGEvents$1.init, {
        instance: this
      });
      if (this.settings.keyPress) {
        this.keyPress();
      }
      setTimeout(function () {
        _this.enableDrag();
        _this.enableSwipe();
        _this.triggerPosterClick();
      }, 50);
      this.arrow();
      if (this.settings.mousewheel) {
        this.mousewheel();
      }
      if (!this.settings.dynamic) {
        this.openGalleryOnItemClick();
      }
    };
    LightGallery.prototype.openGalleryOnItemClick = function () {
      var _this = this;
      var _loop_1 = function (index) {
        var element = this_1.items[index];
        var $element = $LG(element);
        // Using different namespace for click because click event should not unbind if selector is same object('this')
        // @todo manage all event listners - should have namespace that represent element
        var uuid = lgQuery.generateUUID();
        $element.attr('data-lg-id', uuid).on("click.lgcustom-item-" + uuid, function (e) {
          e.preventDefault();
          var currentItemIndex = _this.settings.index || index;
          _this.openGallery(currentItemIndex, element);
        });
      };
      var this_1 = this;
      // Using for loop instead of using bubbling as the items can be any html element.
      for (var index = 0; index < this.items.length; index++) {
        _loop_1(index);
      }
    };
    /**
     * Module constructor
     * Modules are build incrementally.
     * Gallery should be opened only once all the modules are initialized.
     * use moduleBuildTimeout to make sure this
     */
    LightGallery.prototype.buildModules = function () {
      var _this = this;
      this.settings.plugins.forEach(function (plugin) {
        _this.plugins.push(new plugin(_this, $LG));
      });
    };
    LightGallery.prototype.validateLicense = function () {
      if (!this.settings.licenseKey) {
        console.error('Please provide a valid license key');
      } else if (this.settings.licenseKey === '0000-0000-000-0000') {
        console.warn("lightGallery: " + this.settings.licenseKey + " license key is not valid for production use");
      }
    };
    LightGallery.prototype.getSlideItem = function (index) {
      return $LG(this.getSlideItemId(index));
    };
    LightGallery.prototype.getSlideItemId = function (index) {
      return "#lg-item-" + this.lgId + "-" + index;
    };
    LightGallery.prototype.getIdName = function (id) {
      return id + "-" + this.lgId;
    };
    LightGallery.prototype.getElementById = function (id) {
      return $LG("#" + this.getIdName(id));
    };
    LightGallery.prototype.manageSingleSlideClassName = function () {
      if (this.galleryItems.length < 2) {
        this.outer.addClass('lg-single-item');
      } else {
        this.outer.removeClass('lg-single-item');
      }
    };
    LightGallery.prototype.buildStructure = function () {
      var _this = this;
      var container = this.$container && this.$container.get();
      if (container) {
        return;
      }
      var controls = '';
      var subHtmlCont = '';
      // Create controls
      if (this.settings.controls) {
        controls = "<button type=\"button\" id=\"" + this.getIdName('lg-prev') + "\" aria-label=\"" + this.settings.strings['previousSlide'] + "\" class=\"lg-prev lg-icon\"> " + this.settings.prevHtml + " </button>\n                <button type=\"button\" id=\"" + this.getIdName('lg-next') + "\" aria-label=\"" + this.settings.strings['nextSlide'] + "\" class=\"lg-next lg-icon\"> " + this.settings.nextHtml + " </button>";
      }
      if (this.settings.appendSubHtmlTo !== '.lg-item') {
        subHtmlCont = '<div class="lg-sub-html" role="status" aria-live="polite"></div>';
      }
      var addClasses = '';
      if (this.settings.allowMediaOverlap) {
        // Do not remove space before last single quote
        addClasses += 'lg-media-overlap ';
      }
      var ariaLabelledby = this.settings.ariaLabelledby ? 'aria-labelledby="' + this.settings.ariaLabelledby + '"' : '';
      var ariaDescribedby = this.settings.ariaDescribedby ? 'aria-describedby="' + this.settings.ariaDescribedby + '"' : '';
      var containerClassName = "lg-container " + this.settings.addClass + " " + (document.body !== this.settings.container ? 'lg-inline' : '');
      var closeIcon = this.settings.closable && this.settings.showCloseIcon ? "<button type=\"button\" aria-label=\"" + this.settings.strings['closeGallery'] + "\" id=\"" + this.getIdName('lg-close') + "\" class=\"lg-close lg-icon\"></button>" : '';
      var maximizeIcon = this.settings.showMaximizeIcon ? "<button type=\"button\" aria-label=\"" + this.settings.strings['toggleMaximize'] + "\" id=\"" + this.getIdName('lg-maximize') + "\" class=\"lg-maximize lg-icon\"></button>" : '';
      var template = "\n        <div class=\"" + containerClassName + "\" id=\"" + this.getIdName('lg-container') + "\" tabindex=\"-1\" aria-modal=\"true\" " + ariaLabelledby + " " + ariaDescribedby + " role=\"dialog\"\n        >\n            <div id=\"" + this.getIdName('lg-backdrop') + "\" class=\"lg-backdrop\"></div>\n\n            <div id=\"" + this.getIdName('lg-outer') + "\" class=\"lg-outer lg-use-css3 lg-css3 lg-hide-items " + addClasses + " \">\n\n              <div id=\"" + this.getIdName('lg-content') + "\" class=\"lg-content\">\n                <div id=\"" + this.getIdName('lg-inner') + "\" class=\"lg-inner\">\n                </div>\n                " + controls + "\n              </div>\n                <div id=\"" + this.getIdName('lg-toolbar') + "\" class=\"lg-toolbar lg-group\">\n                    " + maximizeIcon + "\n                    " + closeIcon + "\n                    </div>\n                    " + (this.settings.appendSubHtmlTo === '.lg-outer' ? subHtmlCont : '') + "\n                <div id=\"" + this.getIdName('lg-components') + "\" class=\"lg-components\">\n                    " + (this.settings.appendSubHtmlTo === '.lg-sub-html' ? subHtmlCont : '') + "\n                </div>\n            </div>\n        </div>\n        ";
      $LG(this.settings.container).append(template);
      if (document.body !== this.settings.container) {
        $LG(this.settings.container).css('position', 'relative');
      }
      this.outer = this.getElementById('lg-outer');
      this.$lgComponents = this.getElementById('lg-components');
      this.$backdrop = this.getElementById('lg-backdrop');
      this.$container = this.getElementById('lg-container');
      this.$inner = this.getElementById('lg-inner');
      this.$content = this.getElementById('lg-content');
      this.$toolbar = this.getElementById('lg-toolbar');
      this.$backdrop.css('transition-duration', this.settings.backdropDuration + 'ms');
      var outerClassNames = this.settings.mode + " ";
      this.manageSingleSlideClassName();
      if (this.settings.enableDrag) {
        outerClassNames += 'lg-grab ';
      }
      this.outer.addClass(outerClassNames);
      this.$inner.css('transition-timing-function', this.settings.easing);
      this.$inner.css('transition-duration', this.settings.speed + 'ms');
      if (this.settings.download) {
        this.$toolbar.append("<a id=\"" + this.getIdName('lg-download') + "\" target=\"_blank\" rel=\"noopener\" aria-label=\"" + this.settings.strings['download'] + "\" download class=\"lg-download lg-icon\"></a>");
      }
      this.counter();
      $LG(window).on("resize.lg.global" + this.lgId + " orientationchange.lg.global" + this.lgId, function () {
        _this.refreshOnResize();
      });
      this.hideBars();
      this.manageCloseGallery();
      this.toggleMaximize();
      this.initModules();
    };
    LightGallery.prototype.refreshOnResize = function () {
      if (this.lgOpened) {
        var currentGalleryItem = this.galleryItems[this.index];
        var __slideVideoInfo = currentGalleryItem.__slideVideoInfo;
        this.mediaContainerPosition = this.getMediaContainerPosition();
        var _a = this.mediaContainerPosition,
          top_1 = _a.top,
          bottom = _a.bottom;
        this.currentImageSize = utils.getSize(this.items[this.index], this.outer, top_1 + bottom, __slideVideoInfo && this.settings.videoMaxSize);
        if (__slideVideoInfo) {
          this.resizeVideoSlide(this.index, this.currentImageSize);
        }
        if (this.zoomFromOrigin && !this.isDummyImageRemoved) {
          var imgStyle = this.getDummyImgStyles(this.currentImageSize);
          this.outer.find('.lg-current .lg-dummy-img').first().attr('style', imgStyle);
        }
        this.LGel.trigger(lGEvents$1.containerResize);
      }
    };
    LightGallery.prototype.resizeVideoSlide = function (index, imageSize) {
      var lgVideoStyle = this.getVideoContStyle(imageSize);
      var currentSlide = this.getSlideItem(index);
      currentSlide.find('.lg-video-cont').attr('style', lgVideoStyle);
    };
    /**
     * Update slides dynamically.
     * Add, edit or delete slides dynamically when lightGallery is opened.
     * Modify the current gallery items and pass it via updateSlides method
     * @note
     * - Do not mutate existing lightGallery items directly.
     * - Always pass new list of gallery items
     * - You need to take care of thumbnails outside the gallery if any
     * - user this method only if you want to update slides when the gallery is opened. Otherwise, use `refresh()` method.
     * @param items Gallery items
     * @param index After the update operation, which slide gallery should navigate to
     * @category lGPublicMethods
     * @example
     * const plugin = lightGallery();
     *
     * // Adding slides dynamically
     * let galleryItems = [
     * // Access existing lightGallery items
     * // galleryItems are automatically generated internally from the gallery HTML markup
     * // or directly from galleryItems when dynamic gallery is used
     *   ...plugin.galleryItems,
     *     ...[
     *       {
     *         src: 'img/img-1.png',
     *           thumb: 'img/thumb1.png',
     *         },
     *     ],
     *   ];
     *   plugin.updateSlides(
     *     galleryItems,
     *     plugin.index,
     *   );
     *
     *
     * // Remove slides dynamically
     * galleryItems = JSON.parse(
     *   JSON.stringify(updateSlideInstance.galleryItems),
     * );
     * galleryItems.shift();
     * updateSlideInstance.updateSlides(galleryItems, 1);
     * @see <a href="/demos/update-slides/">Demo</a>
     */
    LightGallery.prototype.updateSlides = function (items, index) {
      if (this.index > items.length - 1) {
        this.index = items.length - 1;
      }
      if (items.length === 1) {
        this.index = 0;
      }
      if (!items.length) {
        this.closeGallery();
        return;
      }
      var currentSrc = this.galleryItems[index].src;
      this.galleryItems = items;
      this.updateControls();
      this.$inner.empty();
      this.currentItemsInDom = [];
      var _index = 0;
      // Find the current index based on source value of the slide
      this.galleryItems.some(function (galleryItem, itemIndex) {
        if (galleryItem.src === currentSrc) {
          _index = itemIndex;
          return true;
        }
        return false;
      });
      this.currentItemsInDom = this.organizeSlideItems(_index, -1);
      this.loadContent(_index, true);
      this.getSlideItem(_index).addClass('lg-current');
      this.index = _index;
      this.updateCurrentCounter(_index);
      this.LGel.trigger(lGEvents$1.updateSlides);
    };
    // Get gallery items based on multiple conditions
    LightGallery.prototype.getItems = function () {
      // Gallery items
      this.items = [];
      if (!this.settings.dynamic) {
        if (this.settings.selector === 'this') {
          this.items.push(this.el);
        } else if (this.settings.selector) {
          if (typeof this.settings.selector === 'string') {
            if (this.settings.selectWithin) {
              var selectWithin = $LG(this.settings.selectWithin);
              this.items = selectWithin.find(this.settings.selector).get();
            } else {
              this.items = this.el.querySelectorAll(this.settings.selector);
            }
          } else {
            this.items = this.settings.selector;
          }
        } else {
          this.items = this.el.children;
        }
        return utils.getDynamicOptions(this.items, this.settings.extraProps, this.settings.getCaptionFromTitleOrAlt, this.settings.exThumbImage);
      } else {
        return this.settings.dynamicEl || [];
      }
    };
    LightGallery.prototype.shouldHideScrollbar = function () {
      return this.settings.hideScrollbar && document.body === this.settings.container;
    };
    LightGallery.prototype.hideScrollbar = function () {
      if (!this.shouldHideScrollbar()) {
        return;
      }
      this.bodyPaddingRight = parseFloat($LG('body').style().paddingRight);
      var bodyRect = document.documentElement.getBoundingClientRect();
      var scrollbarWidth = window.innerWidth - bodyRect.width;
      $LG(document.body).css('padding-right', scrollbarWidth + this.bodyPaddingRight + 'px');
      $LG(document.body).addClass('lg-overlay-open');
    };
    LightGallery.prototype.resetScrollBar = function () {
      if (!this.shouldHideScrollbar()) {
        return;
      }
      $LG(document.body).css('padding-right', this.bodyPaddingRight + 'px');
      $LG(document.body).removeClass('lg-overlay-open');
    };
    /**
     * Open lightGallery.
     * Open gallery with specific slide by passing index of the slide as parameter.
     * @category lGPublicMethods
     * @param {Number} index  - index of the slide
     * @param {HTMLElement} element - Which image lightGallery should zoom from
     *
     * @example
     * const $dynamicGallery = document.getElementById('dynamic-gallery-demo');
     * const dynamicGallery = lightGallery($dynamicGallery, {
     *     dynamic: true,
     *     dynamicEl: [
     *         {
     *              src: 'img/1.jpg',
     *              thumb: 'img/thumb-1.jpg',
     *              subHtml: '<h4>Image 1 title</h4><p>Image 1 descriptions.</p>',
     *         },
     *         ...
     *     ],
     * });
     * $dynamicGallery.addEventListener('click', function () {
     *     // Starts with third item.(Optional).
     *     // This is useful if you want use dynamic mode with
     *     // custom thumbnails (thumbnails outside gallery),
     *     dynamicGallery.openGallery(2);
     * });
     *
     */
    LightGallery.prototype.openGallery = function (index, element) {
      var _this = this;
      if (index === void 0) {
        index = this.settings.index;
      }
      // prevent accidental double execution
      if (this.lgOpened) return;
      this.lgOpened = true;
      this.outer.removeClass('lg-hide-items');
      this.hideScrollbar();
      // Add display block, but still has opacity 0
      this.$container.addClass('lg-show');
      var itemsToBeInsertedToDom = this.getItemsToBeInsertedToDom(index, index);
      this.currentItemsInDom = itemsToBeInsertedToDom;
      var items = '';
      itemsToBeInsertedToDom.forEach(function (item) {
        items = items + ("<div id=\"" + item + "\" class=\"lg-item\"></div>");
      });
      this.$inner.append(items);
      this.addHtml(index);
      var transform = '';
      this.mediaContainerPosition = this.getMediaContainerPosition();
      var _a = this.mediaContainerPosition,
        top = _a.top,
        bottom = _a.bottom;
      if (!this.settings.allowMediaOverlap) {
        this.setMediaContainerPosition(top, bottom);
      }
      var __slideVideoInfo = this.galleryItems[index].__slideVideoInfo;
      if (this.zoomFromOrigin && element) {
        this.currentImageSize = utils.getSize(element, this.outer, top + bottom, __slideVideoInfo && this.settings.videoMaxSize);
        transform = utils.getTransform(element, this.outer, top, bottom, this.currentImageSize);
      }
      if (!this.zoomFromOrigin || !transform) {
        this.outer.addClass(this.settings.startClass);
        this.getSlideItem(index).removeClass('lg-complete');
      }
      var timeout = this.settings.zoomFromOrigin ? 100 : this.settings.backdropDuration;
      setTimeout(function () {
        _this.outer.addClass('lg-components-open');
      }, timeout);
      this.index = index;
      this.LGel.trigger(lGEvents$1.beforeOpen);
      // add class lg-current to remove initial transition
      this.getSlideItem(index).addClass('lg-current');
      this.lGalleryOn = false;
      // Store the current scroll top value to scroll back after closing the gallery..
      this.prevScrollTop = $LG(window).scrollTop();
      setTimeout(function () {
        // Need to check both zoomFromOrigin and transform values as we need to set set the
        // default opening animation if user missed to add the lg-size attribute
        if (_this.zoomFromOrigin && transform) {
          var currentSlide_1 = _this.getSlideItem(index);
          currentSlide_1.css('transform', transform);
          setTimeout(function () {
            currentSlide_1.addClass('lg-start-progress lg-start-end-progress').css('transition-duration', _this.settings.startAnimationDuration + 'ms');
            _this.outer.addClass('lg-zoom-from-image');
          });
          setTimeout(function () {
            currentSlide_1.css('transform', 'translate3d(0, 0, 0)');
          }, 100);
        }
        setTimeout(function () {
          _this.$backdrop.addClass('in');
          _this.$container.addClass('lg-show-in');
        }, 10);
        setTimeout(function () {
          if (_this.settings.trapFocus && document.body === _this.settings.container) {
            _this.trapFocus();
          }
        }, _this.settings.backdropDuration + 50);
        // lg-visible class resets gallery opacity to 1
        if (!_this.zoomFromOrigin || !transform) {
          setTimeout(function () {
            _this.outer.addClass('lg-visible');
          }, _this.settings.backdropDuration);
        }
        // initiate slide function
        _this.slide(index, false, false, false);
        _this.LGel.trigger(lGEvents$1.afterOpen);
      });
      if (document.body === this.settings.container) {
        $LG('html').addClass('lg-on');
      }
    };
    /**
     * Note - Changing the position of the media on every slide transition creates a flickering effect.
     * Therefore, The height of the caption is calculated dynamically, only once based on the first slide caption.
     * if you have dynamic captions for each media,
     * you can provide an appropriate height for the captions via allowMediaOverlap option
     */
    LightGallery.prototype.getMediaContainerPosition = function () {
      if (this.settings.allowMediaOverlap) {
        return {
          top: 0,
          bottom: 0
        };
      }
      var top = this.$toolbar.get().clientHeight || 0;
      var subHtml = this.outer.find('.lg-components .lg-sub-html').get();
      var captionHeight = this.settings.defaultCaptionHeight || subHtml && subHtml.clientHeight || 0;
      var thumbContainer = this.outer.find('.lg-thumb-outer').get();
      var thumbHeight = thumbContainer ? thumbContainer.clientHeight : 0;
      var bottom = thumbHeight + captionHeight;
      return {
        top: top,
        bottom: bottom
      };
    };
    LightGallery.prototype.setMediaContainerPosition = function (top, bottom) {
      if (top === void 0) {
        top = 0;
      }
      if (bottom === void 0) {
        bottom = 0;
      }
      this.$content.css('top', top + 'px').css('bottom', bottom + 'px');
    };
    LightGallery.prototype.hideBars = function () {
      var _this = this;
      // Hide controllers if mouse doesn't move for some period
      setTimeout(function () {
        _this.outer.removeClass('lg-hide-items');
        if (_this.settings.hideBarsDelay > 0) {
          _this.outer.on('mousemove.lg click.lg touchstart.lg', function () {
            _this.outer.removeClass('lg-hide-items');
            clearTimeout(_this.hideBarTimeout);
            // Timeout will be cleared on each slide movement also
            _this.hideBarTimeout = setTimeout(function () {
              _this.outer.addClass('lg-hide-items');
            }, _this.settings.hideBarsDelay);
          });
          _this.outer.trigger('mousemove.lg');
        }
      }, this.settings.showBarsAfter);
    };
    LightGallery.prototype.initPictureFill = function ($img) {
      if (this.settings.supportLegacyBrowser) {
        try {
          picturefill({
            elements: [$img.get()]
          });
        } catch (e) {
          console.warn('lightGallery :- If you want srcset or picture tag to be supported for older browser please include picturefil javascript library in your document.');
        }
      }
    };
    /**
     *  @desc Create image counter
     *  Ex: 1/10
     */
    LightGallery.prototype.counter = function () {
      if (this.settings.counter) {
        var counterHtml = "<div class=\"lg-counter\" role=\"status\" aria-live=\"polite\">\n                <span id=\"" + this.getIdName('lg-counter-current') + "\" class=\"lg-counter-current\">" + (this.index + 1) + " </span> /\n                <span id=\"" + this.getIdName('lg-counter-all') + "\" class=\"lg-counter-all\">" + this.galleryItems.length + " </span></div>";
        this.outer.find(this.settings.appendCounterTo).append(counterHtml);
      }
    };
    /**
     *  @desc add sub-html into the slide
     *  @param {Number} index - index of the slide
     */
    LightGallery.prototype.addHtml = function (index) {
      var subHtml;
      var subHtmlUrl;
      if (this.galleryItems[index].subHtmlUrl) {
        subHtmlUrl = this.galleryItems[index].subHtmlUrl;
      } else {
        subHtml = this.galleryItems[index].subHtml;
      }
      if (!subHtmlUrl) {
        if (subHtml) {
          // get first letter of sub-html
          // if first letter starts with . or # get the html form the jQuery object
          var fL = subHtml.substring(0, 1);
          if (fL === '.' || fL === '#') {
            if (this.settings.subHtmlSelectorRelative && !this.settings.dynamic) {
              subHtml = $LG(this.items).eq(index).find(subHtml).first().html();
            } else {
              subHtml = $LG(subHtml).first().html();
            }
          }
        } else {
          subHtml = '';
        }
      }
      if (this.settings.appendSubHtmlTo !== '.lg-item') {
        if (subHtmlUrl) {
          this.outer.find('.lg-sub-html').load(subHtmlUrl);
        } else {
          this.outer.find('.lg-sub-html').html(subHtml);
        }
      } else {
        var currentSlide = $LG(this.getSlideItemId(index));
        if (subHtmlUrl) {
          currentSlide.load(subHtmlUrl);
        } else {
          currentSlide.append("<div class=\"lg-sub-html\">" + subHtml + "</div>");
        }
      }
      // Add lg-empty-html class if title doesn't exist
      if (typeof subHtml !== 'undefined' && subHtml !== null) {
        if (subHtml === '') {
          this.outer.find(this.settings.appendSubHtmlTo).addClass('lg-empty-html');
        } else {
          this.outer.find(this.settings.appendSubHtmlTo).removeClass('lg-empty-html');
        }
      }
      this.LGel.trigger(lGEvents$1.afterAppendSubHtml, {
        index: index
      });
    };
    /**
     *  @desc Preload slides
     *  @param {Number} index - index of the slide
     * @todo preload not working for the first slide, Also, should work for the first and last slide as well
     */
    LightGallery.prototype.preload = function (index) {
      for (var i = 1; i <= this.settings.preload; i++) {
        if (i >= this.galleryItems.length - index) {
          break;
        }
        this.loadContent(index + i, false);
      }
      for (var j = 1; j <= this.settings.preload; j++) {
        if (index - j < 0) {
          break;
        }
        this.loadContent(index - j, false);
      }
    };
    LightGallery.prototype.getDummyImgStyles = function (imageSize) {
      if (!imageSize) return '';
      return "width:" + imageSize.width + "px;\n                margin-left: -" + imageSize.width / 2 + "px;\n                margin-top: -" + imageSize.height / 2 + "px;\n                height:" + imageSize.height + "px";
    };
    LightGallery.prototype.getVideoContStyle = function (imageSize) {
      if (!imageSize) return '';
      return "width:" + imageSize.width + "px;\n                height:" + imageSize.height + "px";
    };
    LightGallery.prototype.getDummyImageContent = function ($currentSlide, index, alt) {
      var $currentItem;
      if (!this.settings.dynamic) {
        $currentItem = $LG(this.items).eq(index);
      }
      if ($currentItem) {
        var _dummyImgSrc = void 0;
        if (!this.settings.exThumbImage) {
          _dummyImgSrc = $currentItem.find('img').first().attr('src');
        } else {
          _dummyImgSrc = $currentItem.attr(this.settings.exThumbImage);
        }
        if (!_dummyImgSrc) return '';
        var imgStyle = this.getDummyImgStyles(this.currentImageSize);
        var dummyImgContent = "<img " + alt + " style=\"" + imgStyle + "\" class=\"lg-dummy-img\" src=\"" + _dummyImgSrc + "\" />";
        $currentSlide.addClass('lg-first-slide');
        this.outer.addClass('lg-first-slide-loading');
        return dummyImgContent;
      }
      return '';
    };
    LightGallery.prototype.setImgMarkup = function (src, $currentSlide, index) {
      var currentGalleryItem = this.galleryItems[index];
      var alt = currentGalleryItem.alt,
        srcset = currentGalleryItem.srcset,
        sizes = currentGalleryItem.sizes,
        sources = currentGalleryItem.sources;
      // Use the thumbnail as dummy image which will be resized to actual image size and
      // displayed on top of actual image
      var imgContent = '';
      var altAttr = alt ? 'alt="' + alt + '"' : '';
      if (this.isFirstSlideWithZoomAnimation()) {
        imgContent = this.getDummyImageContent($currentSlide, index, altAttr);
      } else {
        imgContent = utils.getImgMarkup(index, src, altAttr, srcset, sizes, sources);
      }
      var imgMarkup = "<picture class=\"lg-img-wrap\"> " + imgContent + "</picture>";
      $currentSlide.prepend(imgMarkup);
    };
    LightGallery.prototype.onSlideObjectLoad = function ($slide, isHTML5VideoWithoutPoster, onLoad, onError) {
      var mediaObject = $slide.find('.lg-object').first();
      if (utils.isImageLoaded(mediaObject.get()) || isHTML5VideoWithoutPoster) {
        onLoad();
      } else {
        mediaObject.on('load.lg error.lg', function () {
          onLoad && onLoad();
        });
        mediaObject.on('error.lg', function () {
          onError && onError();
        });
      }
    };
    /**
     *
     * @param $el Current slide item
     * @param index
     * @param delay Delay is 0 except first time
     * @param speed Speed is same as delay, except it is 0 if gallery is opened via hash plugin
     * @param isFirstSlide
     */
    LightGallery.prototype.onLgObjectLoad = function (currentSlide, index, delay, speed, isFirstSlide, isHTML5VideoWithoutPoster) {
      var _this = this;
      this.onSlideObjectLoad(currentSlide, isHTML5VideoWithoutPoster, function () {
        _this.triggerSlideItemLoad(currentSlide, index, delay, speed, isFirstSlide);
      }, function () {
        currentSlide.addClass('lg-complete lg-complete_');
        currentSlide.html('<span class="lg-error-msg">' + _this.settings.strings['mediaLoadingFailed'] + '</span>');
      });
    };
    LightGallery.prototype.triggerSlideItemLoad = function ($currentSlide, index, delay, speed, isFirstSlide) {
      var _this = this;
      var currentGalleryItem = this.galleryItems[index];
      // Adding delay for video slides without poster for better performance and user experience
      // Videos should start playing once once the gallery is completely loaded
      var _speed = isFirstSlide && this.getSlideType(currentGalleryItem) === 'video' && !currentGalleryItem.poster ? speed : 0;
      setTimeout(function () {
        $currentSlide.addClass('lg-complete lg-complete_');
        _this.LGel.trigger(lGEvents$1.slideItemLoad, {
          index: index,
          delay: delay || 0,
          isFirstSlide: isFirstSlide
        });
      }, _speed);
    };
    LightGallery.prototype.isFirstSlideWithZoomAnimation = function () {
      return !!(!this.lGalleryOn && this.zoomFromOrigin && this.currentImageSize);
    };
    // Add video slideInfo
    LightGallery.prototype.addSlideVideoInfo = function (items) {
      var _this = this;
      items.forEach(function (element, index) {
        element.__slideVideoInfo = utils.isVideo(element.src, !!element.video, index);
        if (element.__slideVideoInfo && _this.settings.loadYouTubePoster && !element.poster && element.__slideVideoInfo.youtube) {
          element.poster = "//img.youtube.com/vi/" + element.__slideVideoInfo.youtube[1] + "/maxresdefault.jpg";
        }
      });
    };
    /**
     *  Load slide content into slide.
     *  This is used to load content into slides that is not visible too
     *  @param {Number} index - index of the slide.
     *  @param {Boolean} rec - if true call loadcontent() function again.
     */
    LightGallery.prototype.loadContent = function (index, rec) {
      var _this = this;
      var currentGalleryItem = this.galleryItems[index];
      var $currentSlide = $LG(this.getSlideItemId(index));
      var poster = currentGalleryItem.poster,
        srcset = currentGalleryItem.srcset,
        sizes = currentGalleryItem.sizes,
        sources = currentGalleryItem.sources;
      var src = currentGalleryItem.src;
      var video = currentGalleryItem.video;
      var _html5Video = video && typeof video === 'string' ? JSON.parse(video) : video;
      if (currentGalleryItem.responsive) {
        var srcDyItms = currentGalleryItem.responsive.split(',');
        src = utils.getResponsiveSrc(srcDyItms) || src;
      }
      var videoInfo = currentGalleryItem.__slideVideoInfo;
      var lgVideoStyle = '';
      var iframe = !!currentGalleryItem.iframe;
      var isFirstSlide = !this.lGalleryOn;
      // delay for adding complete class. it is 0 except first time.
      var delay = 0;
      if (isFirstSlide) {
        if (this.zoomFromOrigin && this.currentImageSize) {
          delay = this.settings.startAnimationDuration + 10;
        } else {
          delay = this.settings.backdropDuration + 10;
        }
      }
      if (!$currentSlide.hasClass('lg-loaded')) {
        if (videoInfo) {
          var _a = this.mediaContainerPosition,
            top_2 = _a.top,
            bottom = _a.bottom;
          var videoSize = utils.getSize(this.items[index], this.outer, top_2 + bottom, videoInfo && this.settings.videoMaxSize);
          lgVideoStyle = this.getVideoContStyle(videoSize);
        }
        if (iframe) {
          var markup = utils.getIframeMarkup(this.settings.iframeWidth, this.settings.iframeHeight, this.settings.iframeMaxWidth, this.settings.iframeMaxHeight, src, currentGalleryItem.iframeTitle);
          $currentSlide.prepend(markup);
        } else if (poster) {
          var dummyImg = '';
          var hasStartAnimation = isFirstSlide && this.zoomFromOrigin && this.currentImageSize;
          if (hasStartAnimation) {
            dummyImg = this.getDummyImageContent($currentSlide, index, '');
          }
          var markup = utils.getVideoPosterMarkup(poster, dummyImg || '', lgVideoStyle, this.settings.strings['playVideo'], videoInfo);
          $currentSlide.prepend(markup);
        } else if (videoInfo) {
          var markup = "<div class=\"lg-video-cont \" style=\"" + lgVideoStyle + "\"></div>";
          $currentSlide.prepend(markup);
        } else {
          this.setImgMarkup(src, $currentSlide, index);
          if (srcset || sources) {
            var $img = $currentSlide.find('.lg-object');
            this.initPictureFill($img);
          }
        }
        if (poster || videoInfo) {
          this.LGel.trigger(lGEvents$1.hasVideo, {
            index: index,
            src: src,
            html5Video: _html5Video,
            hasPoster: !!poster
          });
        }
        this.LGel.trigger(lGEvents$1.afterAppendSlide, {
          index: index
        });
        if (this.lGalleryOn && this.settings.appendSubHtmlTo === '.lg-item') {
          this.addHtml(index);
        }
      }
      // For first time add some delay for displaying the start animation.
      var _speed = 0;
      // Do not change the delay value because it is required for zoom plugin.
      // If gallery opened from direct url (hash) speed value should be 0
      if (delay && !$LG(document.body).hasClass('lg-from-hash')) {
        _speed = delay;
      }
      // Only for first slide and zoomFromOrigin is enabled
      if (this.isFirstSlideWithZoomAnimation()) {
        setTimeout(function () {
          $currentSlide.removeClass('lg-start-end-progress lg-start-progress').removeAttr('style');
        }, this.settings.startAnimationDuration + 100);
        if (!$currentSlide.hasClass('lg-loaded')) {
          setTimeout(function () {
            if (_this.getSlideType(currentGalleryItem) === 'image') {
              var alt = currentGalleryItem.alt;
              var altAttr = alt ? 'alt="' + alt + '"' : '';
              $currentSlide.find('.lg-img-wrap').append(utils.getImgMarkup(index, src, altAttr, srcset, sizes, currentGalleryItem.sources));
              if (srcset || sources) {
                var $img = $currentSlide.find('.lg-object');
                _this.initPictureFill($img);
              }
            }
            if (_this.getSlideType(currentGalleryItem) === 'image' || _this.getSlideType(currentGalleryItem) === 'video' && poster) {
              _this.onLgObjectLoad($currentSlide, index, delay, _speed, true, false);
              // load remaining slides once the slide is completely loaded
              _this.onSlideObjectLoad($currentSlide, !!(videoInfo && videoInfo.html5 && !poster), function () {
                _this.loadContentOnFirstSlideLoad(index, $currentSlide, _speed);
              }, function () {
                _this.loadContentOnFirstSlideLoad(index, $currentSlide, _speed);
              });
            }
          }, this.settings.startAnimationDuration + 100);
        }
      }
      // SLide content has been added to dom
      $currentSlide.addClass('lg-loaded');
      if (!this.isFirstSlideWithZoomAnimation() || this.getSlideType(currentGalleryItem) === 'video' && !poster) {
        this.onLgObjectLoad($currentSlide, index, delay, _speed, isFirstSlide, !!(videoInfo && videoInfo.html5 && !poster));
      }
      // When gallery is opened once content is loaded (second time) need to add lg-complete class for css styling
      if ((!this.zoomFromOrigin || !this.currentImageSize) && $currentSlide.hasClass('lg-complete_') && !this.lGalleryOn) {
        setTimeout(function () {
          $currentSlide.addClass('lg-complete');
        }, this.settings.backdropDuration);
      }
      // Content loaded
      // Need to set lGalleryOn before calling preload function
      this.lGalleryOn = true;
      if (rec === true) {
        if (!$currentSlide.hasClass('lg-complete_')) {
          $currentSlide.find('.lg-object').first().on('load.lg error.lg', function () {
            _this.preload(index);
          });
        } else {
          this.preload(index);
        }
      }
    };
    /**
     * @desc Remove dummy image content and load next slides
     * Called only for the first time if zoomFromOrigin animation is enabled
     * @param index
     * @param $currentSlide
     * @param speed
     */
    LightGallery.prototype.loadContentOnFirstSlideLoad = function (index, $currentSlide, speed) {
      var _this = this;
      setTimeout(function () {
        $currentSlide.find('.lg-dummy-img').remove();
        $currentSlide.removeClass('lg-first-slide');
        _this.outer.removeClass('lg-first-slide-loading');
        _this.isDummyImageRemoved = true;
        _this.preload(index);
      }, speed + 300);
    };
    LightGallery.prototype.getItemsToBeInsertedToDom = function (index, prevIndex, numberOfItems) {
      var _this = this;
      if (numberOfItems === void 0) {
        numberOfItems = 0;
      }
      var itemsToBeInsertedToDom = [];
      // Minimum 2 items should be there
      var possibleNumberOfItems = Math.max(numberOfItems, 3);
      possibleNumberOfItems = Math.min(possibleNumberOfItems, this.galleryItems.length);
      var prevIndexItem = "lg-item-" + this.lgId + "-" + prevIndex;
      if (this.galleryItems.length <= 3) {
        this.galleryItems.forEach(function (_element, index) {
          itemsToBeInsertedToDom.push("lg-item-" + _this.lgId + "-" + index);
        });
        return itemsToBeInsertedToDom;
      }
      if (index < (this.galleryItems.length - 1) / 2) {
        for (var idx = index; idx > index - possibleNumberOfItems / 2 && idx >= 0; idx--) {
          itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + idx);
        }
        var numberOfExistingItems = itemsToBeInsertedToDom.length;
        for (var idx = 0; idx < possibleNumberOfItems - numberOfExistingItems; idx++) {
          itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (index + idx + 1));
        }
      } else {
        for (var idx = index; idx <= this.galleryItems.length - 1 && idx < index + possibleNumberOfItems / 2; idx++) {
          itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + idx);
        }
        var numberOfExistingItems = itemsToBeInsertedToDom.length;
        for (var idx = 0; idx < possibleNumberOfItems - numberOfExistingItems; idx++) {
          itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (index - idx - 1));
        }
      }
      if (this.settings.loop) {
        if (index === this.galleryItems.length - 1) {
          itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + 0);
        } else if (index === 0) {
          itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (this.galleryItems.length - 1));
        }
      }
      if (itemsToBeInsertedToDom.indexOf(prevIndexItem) === -1) {
        itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + prevIndex);
      }
      return itemsToBeInsertedToDom;
    };
    LightGallery.prototype.organizeSlideItems = function (index, prevIndex) {
      var _this = this;
      var itemsToBeInsertedToDom = this.getItemsToBeInsertedToDom(index, prevIndex, this.settings.numberOfSlideItemsInDom);
      itemsToBeInsertedToDom.forEach(function (item) {
        if (_this.currentItemsInDom.indexOf(item) === -1) {
          _this.$inner.append("<div id=\"" + item + "\" class=\"lg-item\"></div>");
        }
      });
      this.currentItemsInDom.forEach(function (item) {
        if (itemsToBeInsertedToDom.indexOf(item) === -1) {
          $LG("#" + item).remove();
        }
      });
      return itemsToBeInsertedToDom;
    };
    /**
     * Get previous index of the slide
     */
    LightGallery.prototype.getPreviousSlideIndex = function () {
      var prevIndex = 0;
      try {
        var currentItemId = this.outer.find('.lg-current').first().attr('id');
        prevIndex = parseInt(currentItemId.split('-')[3]) || 0;
      } catch (error) {
        prevIndex = 0;
      }
      return prevIndex;
    };
    LightGallery.prototype.setDownloadValue = function (index) {
      if (this.settings.download) {
        var currentGalleryItem = this.galleryItems[index];
        var hideDownloadBtn = currentGalleryItem.downloadUrl === false || currentGalleryItem.downloadUrl === 'false';
        if (hideDownloadBtn) {
          this.outer.addClass('lg-hide-download');
        } else {
          var $download = this.getElementById('lg-download');
          this.outer.removeClass('lg-hide-download');
          $download.attr('href', currentGalleryItem.downloadUrl || currentGalleryItem.src);
          if (currentGalleryItem.download) {
            $download.attr('download', currentGalleryItem.download);
          }
        }
      }
    };
    LightGallery.prototype.makeSlideAnimation = function (direction, currentSlideItem, previousSlideItem) {
      var _this = this;
      if (this.lGalleryOn) {
        previousSlideItem.addClass('lg-slide-progress');
      }
      setTimeout(function () {
        // remove all transitions
        _this.outer.addClass('lg-no-trans');
        _this.outer.find('.lg-item').removeClass('lg-prev-slide lg-next-slide');
        if (direction === 'prev') {
          //prevslide
          currentSlideItem.addClass('lg-prev-slide');
          previousSlideItem.addClass('lg-next-slide');
        } else {
          // next slide
          currentSlideItem.addClass('lg-next-slide');
          previousSlideItem.addClass('lg-prev-slide');
        }
        // give 50 ms for browser to add/remove class
        setTimeout(function () {
          _this.outer.find('.lg-item').removeClass('lg-current');
          currentSlideItem.addClass('lg-current');
          // reset all transitions
          _this.outer.removeClass('lg-no-trans');
        }, 50);
      }, this.lGalleryOn ? this.settings.slideDelay : 0);
    };
    /**
     * Goto a specific slide.
     * @param {Number} index - index of the slide
     * @param {Boolean} fromTouch - true if slide function called via touch event or mouse drag
     * @param {Boolean} fromThumb - true if slide function called via thumbnail click
     * @param {String} direction - Direction of the slide(next/prev)
     * @category lGPublicMethods
     * @example
     *  const plugin = lightGallery();
     *  // to go to 3rd slide
     *  plugin.slide(2);
     *
     */
    LightGallery.prototype.slide = function (index, fromTouch, fromThumb, direction) {
      var _this = this;
      var prevIndex = this.getPreviousSlideIndex();
      this.currentItemsInDom = this.organizeSlideItems(index, prevIndex);
      // Prevent multiple call, Required for hsh plugin
      if (this.lGalleryOn && prevIndex === index) {
        return;
      }
      var numberOfGalleryItems = this.galleryItems.length;
      if (!this.lgBusy) {
        if (this.settings.counter) {
          this.updateCurrentCounter(index);
        }
        var currentSlideItem = this.getSlideItem(index);
        var previousSlideItem_1 = this.getSlideItem(prevIndex);
        var currentGalleryItem = this.galleryItems[index];
        var videoInfo = currentGalleryItem.__slideVideoInfo;
        this.outer.attr('data-lg-slide-type', this.getSlideType(currentGalleryItem));
        this.setDownloadValue(index);
        if (videoInfo) {
          var _a = this.mediaContainerPosition,
            top_3 = _a.top,
            bottom = _a.bottom;
          var videoSize = utils.getSize(this.items[index], this.outer, top_3 + bottom, videoInfo && this.settings.videoMaxSize);
          this.resizeVideoSlide(index, videoSize);
        }
        this.LGel.trigger(lGEvents$1.beforeSlide, {
          prevIndex: prevIndex,
          index: index,
          fromTouch: !!fromTouch,
          fromThumb: !!fromThumb
        });
        this.lgBusy = true;
        clearTimeout(this.hideBarTimeout);
        this.arrowDisable(index);
        if (!direction) {
          if (index < prevIndex) {
            direction = 'prev';
          } else if (index > prevIndex) {
            direction = 'next';
          }
        }
        if (!fromTouch) {
          this.makeSlideAnimation(direction, currentSlideItem, previousSlideItem_1);
        } else {
          this.outer.find('.lg-item').removeClass('lg-prev-slide lg-current lg-next-slide');
          var touchPrev = void 0;
          var touchNext = void 0;
          if (numberOfGalleryItems > 2) {
            touchPrev = index - 1;
            touchNext = index + 1;
            if (index === 0 && prevIndex === numberOfGalleryItems - 1) {
              // next slide
              touchNext = 0;
              touchPrev = numberOfGalleryItems - 1;
            } else if (index === numberOfGalleryItems - 1 && prevIndex === 0) {
              // prev slide
              touchNext = 0;
              touchPrev = numberOfGalleryItems - 1;
            }
          } else {
            touchPrev = 0;
            touchNext = 1;
          }
          if (direction === 'prev') {
            this.getSlideItem(touchNext).addClass('lg-next-slide');
          } else {
            this.getSlideItem(touchPrev).addClass('lg-prev-slide');
          }
          currentSlideItem.addClass('lg-current');
        }
        // Do not put load content in set timeout as it needs to load immediately when the gallery is opened
        if (!this.lGalleryOn) {
          this.loadContent(index, true);
        } else {
          setTimeout(function () {
            _this.loadContent(index, true);
            // Add title if this.settings.appendSubHtmlTo === lg-sub-html
            if (_this.settings.appendSubHtmlTo !== '.lg-item') {
              _this.addHtml(index);
            }
          }, this.settings.speed + 50 + (fromTouch ? 0 : this.settings.slideDelay));
        }
        setTimeout(function () {
          _this.lgBusy = false;
          previousSlideItem_1.removeClass('lg-slide-progress');
          _this.LGel.trigger(lGEvents$1.afterSlide, {
            prevIndex: prevIndex,
            index: index,
            fromTouch: fromTouch,
            fromThumb: fromThumb
          });
        }, (this.lGalleryOn ? this.settings.speed + 100 : 100) + (fromTouch ? 0 : this.settings.slideDelay));
      }
      this.index = index;
    };
    LightGallery.prototype.updateCurrentCounter = function (index) {
      this.getElementById('lg-counter-current').html(index + 1 + '');
    };
    LightGallery.prototype.updateCounterTotal = function () {
      this.getElementById('lg-counter-all').html(this.galleryItems.length + '');
    };
    LightGallery.prototype.getSlideType = function (item) {
      if (item.__slideVideoInfo) {
        return 'video';
      } else if (item.iframe) {
        return 'iframe';
      } else {
        return 'image';
      }
    };
    LightGallery.prototype.touchMove = function (startCoords, endCoords, e) {
      var distanceX = endCoords.pageX - startCoords.pageX;
      var distanceY = endCoords.pageY - startCoords.pageY;
      var allowSwipe = false;
      if (this.swipeDirection) {
        allowSwipe = true;
      } else {
        if (Math.abs(distanceX) > 15) {
          this.swipeDirection = 'horizontal';
          allowSwipe = true;
        } else if (Math.abs(distanceY) > 15) {
          this.swipeDirection = 'vertical';
          allowSwipe = true;
        }
      }
      if (!allowSwipe) {
        return;
      }
      var $currentSlide = this.getSlideItem(this.index);
      if (this.swipeDirection === 'horizontal') {
        e === null || e === void 0 ? void 0 : e.preventDefault();
        // reset opacity and transition duration
        this.outer.addClass('lg-dragging');
        // move current slide
        this.setTranslate($currentSlide, distanceX, 0);
        // move next and prev slide with current slide
        var width = $currentSlide.get().offsetWidth;
        var slideWidthAmount = width * 15 / 100;
        var gutter = slideWidthAmount - Math.abs(distanceX * 10 / 100);
        this.setTranslate(this.outer.find('.lg-prev-slide').first(), -width + distanceX - gutter, 0);
        this.setTranslate(this.outer.find('.lg-next-slide').first(), width + distanceX + gutter, 0);
      } else if (this.swipeDirection === 'vertical') {
        if (this.settings.swipeToClose) {
          e === null || e === void 0 ? void 0 : e.preventDefault();
          this.$container.addClass('lg-dragging-vertical');
          var opacity = 1 - Math.abs(distanceY) / window.innerHeight;
          this.$backdrop.css('opacity', opacity);
          var scale = 1 - Math.abs(distanceY) / (window.innerWidth * 2);
          this.setTranslate($currentSlide, 0, distanceY, scale, scale);
          if (Math.abs(distanceY) > 100) {
            this.outer.addClass('lg-hide-items').removeClass('lg-components-open');
          }
        }
      }
    };
    LightGallery.prototype.touchEnd = function (endCoords, startCoords, event) {
      var _this = this;
      var distance;
      // keep slide animation for any mode while dragg/swipe
      if (this.settings.mode !== 'lg-slide') {
        this.outer.addClass('lg-slide');
      }
      // set transition duration
      setTimeout(function () {
        _this.$container.removeClass('lg-dragging-vertical');
        _this.outer.removeClass('lg-dragging lg-hide-items').addClass('lg-components-open');
        var triggerClick = true;
        if (_this.swipeDirection === 'horizontal') {
          distance = endCoords.pageX - startCoords.pageX;
          var distanceAbs = Math.abs(endCoords.pageX - startCoords.pageX);
          if (distance < 0 && distanceAbs > _this.settings.swipeThreshold) {
            _this.goToNextSlide(true);
            triggerClick = false;
          } else if (distance > 0 && distanceAbs > _this.settings.swipeThreshold) {
            _this.goToPrevSlide(true);
            triggerClick = false;
          }
        } else if (_this.swipeDirection === 'vertical') {
          distance = Math.abs(endCoords.pageY - startCoords.pageY);
          if (_this.settings.closable && _this.settings.swipeToClose && distance > 100) {
            _this.closeGallery();
            return;
          } else {
            _this.$backdrop.css('opacity', 1);
          }
        }
        _this.outer.find('.lg-item').removeAttr('style');
        if (triggerClick && Math.abs(endCoords.pageX - startCoords.pageX) < 5) {
          // Trigger click if distance is less than 5 pix
          var target = $LG(event.target);
          if (_this.isPosterElement(target)) {
            _this.LGel.trigger(lGEvents$1.posterClick);
          }
        }
        _this.swipeDirection = undefined;
      });
      // remove slide class once drag/swipe is completed if mode is not slide
      setTimeout(function () {
        if (!_this.outer.hasClass('lg-dragging') && _this.settings.mode !== 'lg-slide') {
          _this.outer.removeClass('lg-slide');
        }
      }, this.settings.speed + 100);
    };
    LightGallery.prototype.enableSwipe = function () {
      var _this = this;
      var startCoords = {};
      var endCoords = {};
      var isMoved = false;
      var isSwiping = false;
      if (this.settings.enableSwipe) {
        this.$inner.on('touchstart.lg', function (e) {
          _this.dragOrSwipeEnabled = true;
          var $item = _this.getSlideItem(_this.index);
          if (($LG(e.target).hasClass('lg-item') || $item.get().contains(e.target)) && !_this.outer.hasClass('lg-zoomed') && !_this.lgBusy && e.touches.length === 1) {
            isSwiping = true;
            _this.touchAction = 'swipe';
            _this.manageSwipeClass();
            startCoords = {
              pageX: e.touches[0].pageX,
              pageY: e.touches[0].pageY
            };
          }
        });
        this.$inner.on('touchmove.lg', function (e) {
          if (isSwiping && _this.touchAction === 'swipe' && e.touches.length === 1) {
            endCoords = {
              pageX: e.touches[0].pageX,
              pageY: e.touches[0].pageY
            };
            _this.touchMove(startCoords, endCoords, e);
            isMoved = true;
          }
        });
        this.$inner.on('touchend.lg', function (event) {
          if (_this.touchAction === 'swipe') {
            if (isMoved) {
              isMoved = false;
              _this.touchEnd(endCoords, startCoords, event);
            } else if (isSwiping) {
              var target = $LG(event.target);
              if (_this.isPosterElement(target)) {
                _this.LGel.trigger(lGEvents$1.posterClick);
              }
            }
            _this.touchAction = undefined;
            isSwiping = false;
          }
        });
      }
    };
    LightGallery.prototype.enableDrag = function () {
      var _this = this;
      var startCoords = {};
      var endCoords = {};
      var isDraging = false;
      var isMoved = false;
      if (this.settings.enableDrag) {
        this.outer.on('mousedown.lg', function (e) {
          _this.dragOrSwipeEnabled = true;
          var $item = _this.getSlideItem(_this.index);
          if ($LG(e.target).hasClass('lg-item') || $item.get().contains(e.target)) {
            if (!_this.outer.hasClass('lg-zoomed') && !_this.lgBusy) {
              e.preventDefault();
              if (!_this.lgBusy) {
                _this.manageSwipeClass();
                startCoords = {
                  pageX: e.pageX,
                  pageY: e.pageY
                };
                isDraging = true;
                // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                _this.outer.get().scrollLeft += 1;
                _this.outer.get().scrollLeft -= 1;
                // *
                _this.outer.removeClass('lg-grab').addClass('lg-grabbing');
                _this.LGel.trigger(lGEvents$1.dragStart);
              }
            }
          }
        });
        $LG(window).on("mousemove.lg.global" + this.lgId, function (e) {
          if (isDraging && _this.lgOpened) {
            isMoved = true;
            endCoords = {
              pageX: e.pageX,
              pageY: e.pageY
            };
            _this.touchMove(startCoords, endCoords);
            _this.LGel.trigger(lGEvents$1.dragMove);
          }
        });
        $LG(window).on("mouseup.lg.global" + this.lgId, function (event) {
          if (!_this.lgOpened) {
            return;
          }
          var target = $LG(event.target);
          if (isMoved) {
            isMoved = false;
            _this.touchEnd(endCoords, startCoords, event);
            _this.LGel.trigger(lGEvents$1.dragEnd);
          } else if (_this.isPosterElement(target)) {
            _this.LGel.trigger(lGEvents$1.posterClick);
          }
          // Prevent execution on click
          if (isDraging) {
            isDraging = false;
            _this.outer.removeClass('lg-grabbing').addClass('lg-grab');
          }
        });
      }
    };
    LightGallery.prototype.triggerPosterClick = function () {
      var _this = this;
      this.$inner.on('click.lg', function (event) {
        if (!_this.dragOrSwipeEnabled && _this.isPosterElement($LG(event.target))) {
          _this.LGel.trigger(lGEvents$1.posterClick);
        }
      });
    };
    LightGallery.prototype.manageSwipeClass = function () {
      var _touchNext = this.index + 1;
      var _touchPrev = this.index - 1;
      if (this.settings.loop && this.galleryItems.length > 2) {
        if (this.index === 0) {
          _touchPrev = this.galleryItems.length - 1;
        } else if (this.index === this.galleryItems.length - 1) {
          _touchNext = 0;
        }
      }
      this.outer.find('.lg-item').removeClass('lg-next-slide lg-prev-slide');
      if (_touchPrev > -1) {
        this.getSlideItem(_touchPrev).addClass('lg-prev-slide');
      }
      this.getSlideItem(_touchNext).addClass('lg-next-slide');
    };
    /**
     * Go to next slide
     * @param {Boolean} fromTouch - true if slide function called via touch event
     * @category lGPublicMethods
     * @example
     *  const plugin = lightGallery();
     *  plugin.goToNextSlide();
     * @see <a href="/demos/methods/">Demo</a>
     */
    LightGallery.prototype.goToNextSlide = function (fromTouch) {
      var _this = this;
      var _loop = this.settings.loop;
      if (fromTouch && this.galleryItems.length < 3) {
        _loop = false;
      }
      if (!this.lgBusy) {
        if (this.index + 1 < this.galleryItems.length) {
          this.index++;
          this.LGel.trigger(lGEvents$1.beforeNextSlide, {
            index: this.index
          });
          this.slide(this.index, !!fromTouch, false, 'next');
        } else {
          if (_loop) {
            this.index = 0;
            this.LGel.trigger(lGEvents$1.beforeNextSlide, {
              index: this.index
            });
            this.slide(this.index, !!fromTouch, false, 'next');
          } else if (this.settings.slideEndAnimation && !fromTouch) {
            this.outer.addClass('lg-right-end');
            setTimeout(function () {
              _this.outer.removeClass('lg-right-end');
            }, 400);
          }
        }
      }
    };
    /**
     * Go to previous slides
     * @param {Boolean} fromTouch - true if slide function called via touch event
     * @category lGPublicMethods
     * @example
     *  const plugin = lightGallery({});
     *  plugin.goToPrevSlide();
     * @see <a href="/demos/methods/">Demo</a>
     *
     */
    LightGallery.prototype.goToPrevSlide = function (fromTouch) {
      var _this = this;
      var _loop = this.settings.loop;
      if (fromTouch && this.galleryItems.length < 3) {
        _loop = false;
      }
      if (!this.lgBusy) {
        if (this.index > 0) {
          this.index--;
          this.LGel.trigger(lGEvents$1.beforePrevSlide, {
            index: this.index,
            fromTouch: fromTouch
          });
          this.slide(this.index, !!fromTouch, false, 'prev');
        } else {
          if (_loop) {
            this.index = this.galleryItems.length - 1;
            this.LGel.trigger(lGEvents$1.beforePrevSlide, {
              index: this.index,
              fromTouch: fromTouch
            });
            this.slide(this.index, !!fromTouch, false, 'prev');
          } else if (this.settings.slideEndAnimation && !fromTouch) {
            this.outer.addClass('lg-left-end');
            setTimeout(function () {
              _this.outer.removeClass('lg-left-end');
            }, 400);
          }
        }
      }
    };
    LightGallery.prototype.keyPress = function () {
      var _this = this;
      $LG(window).on("keydown.lg.global" + this.lgId, function (e) {
        if (_this.lgOpened && _this.settings.escKey === true && e.keyCode === 27) {
          e.preventDefault();
          if (_this.settings.allowMediaOverlap && _this.outer.hasClass('lg-can-toggle') && _this.outer.hasClass('lg-components-open')) {
            _this.outer.removeClass('lg-components-open');
          } else {
            _this.closeGallery();
          }
        }
        if (_this.lgOpened && _this.galleryItems.length > 1) {
          if (e.keyCode === 37) {
            e.preventDefault();
            _this.goToPrevSlide();
          }
          if (e.keyCode === 39) {
            e.preventDefault();
            _this.goToNextSlide();
          }
        }
      });
    };
    LightGallery.prototype.arrow = function () {
      var _this = this;
      this.getElementById('lg-prev').on('click.lg', function () {
        _this.goToPrevSlide();
      });
      this.getElementById('lg-next').on('click.lg', function () {
        _this.goToNextSlide();
      });
    };
    LightGallery.prototype.arrowDisable = function (index) {
      // Disable arrows if settings.hideControlOnEnd is true
      if (!this.settings.loop && this.settings.hideControlOnEnd) {
        var $prev = this.getElementById('lg-prev');
        var $next = this.getElementById('lg-next');
        if (index + 1 === this.galleryItems.length) {
          $next.attr('disabled', 'disabled').addClass('disabled');
        } else {
          $next.removeAttr('disabled').removeClass('disabled');
        }
        if (index === 0) {
          $prev.attr('disabled', 'disabled').addClass('disabled');
        } else {
          $prev.removeAttr('disabled').removeClass('disabled');
        }
      }
    };
    LightGallery.prototype.setTranslate = function ($el, xValue, yValue, scaleX, scaleY) {
      if (scaleX === void 0) {
        scaleX = 1;
      }
      if (scaleY === void 0) {
        scaleY = 1;
      }
      $el.css('transform', 'translate3d(' + xValue + 'px, ' + yValue + 'px, 0px) scale3d(' + scaleX + ', ' + scaleY + ', 1)');
    };
    LightGallery.prototype.mousewheel = function () {
      var _this = this;
      var lastCall = 0;
      this.outer.on('wheel.lg', function (e) {
        if (!e.deltaY || _this.galleryItems.length < 2) {
          return;
        }
        e.preventDefault();
        var now = new Date().getTime();
        if (now - lastCall < 1000) {
          return;
        }
        lastCall = now;
        if (e.deltaY > 0) {
          _this.goToNextSlide();
        } else if (e.deltaY < 0) {
          _this.goToPrevSlide();
        }
      });
    };
    LightGallery.prototype.isSlideElement = function (target) {
      return target.hasClass('lg-outer') || target.hasClass('lg-item') || target.hasClass('lg-img-wrap');
    };
    LightGallery.prototype.isPosterElement = function (target) {
      var playButton = this.getSlideItem(this.index).find('.lg-video-play-button').get();
      return target.hasClass('lg-video-poster') || target.hasClass('lg-video-play-button') || playButton && playButton.contains(target.get());
    };
    /**
     * Maximize minimize inline gallery.
     * @category lGPublicMethods
     */
    LightGallery.prototype.toggleMaximize = function () {
      var _this = this;
      this.getElementById('lg-maximize').on('click.lg', function () {
        _this.$container.toggleClass('lg-inline');
        _this.refreshOnResize();
      });
    };
    LightGallery.prototype.invalidateItems = function () {
      for (var index = 0; index < this.items.length; index++) {
        var element = this.items[index];
        var $element = $LG(element);
        $element.off("click.lgcustom-item-" + $element.attr('data-lg-id'));
      }
    };
    LightGallery.prototype.trapFocus = function () {
      var _this = this;
      this.$container.get().focus({
        preventScroll: true
      });
      $LG(window).on("keydown.lg.global" + this.lgId, function (e) {
        if (!_this.lgOpened) {
          return;
        }
        var isTabPressed = e.key === 'Tab' || e.keyCode === 9;
        if (!isTabPressed) {
          return;
        }
        var focusableEls = utils.getFocusableElements(_this.$container.get());
        var firstFocusableEl = focusableEls[0];
        var lastFocusableEl = focusableEls[focusableEls.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableEl) {
            lastFocusableEl.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableEl) {
            firstFocusableEl.focus();
            e.preventDefault();
          }
        }
      });
    };
    LightGallery.prototype.manageCloseGallery = function () {
      var _this = this;
      if (!this.settings.closable) return;
      var mousedown = false;
      this.getElementById('lg-close').on('click.lg', function () {
        _this.closeGallery();
      });
      if (this.settings.closeOnTap) {
        // If you drag the slide and release outside gallery gets close on chrome
        // for preventing this check mousedown and mouseup happened on .lg-item or lg-outer
        this.outer.on('mousedown.lg', function (e) {
          var target = $LG(e.target);
          if (_this.isSlideElement(target)) {
            mousedown = true;
          } else {
            mousedown = false;
          }
        });
        this.outer.on('mousemove.lg', function () {
          mousedown = false;
        });
        this.outer.on('mouseup.lg', function (e) {
          var target = $LG(e.target);
          if (_this.isSlideElement(target) && mousedown) {
            if (!_this.outer.hasClass('lg-dragging')) {
              _this.closeGallery();
            }
          }
        });
      }
    };
    /**
     * Close lightGallery if it is opened.
     *
     * @description If closable is false in the settings, you need to pass true via closeGallery method to force close gallery
     * @return returns the estimated time to close gallery completely including the close animation duration
     * @category lGPublicMethods
     * @example
     *  const plugin = lightGallery();
     *  plugin.closeGallery();
     *
     */
    LightGallery.prototype.closeGallery = function (force) {
      var _this = this;
      if (!this.lgOpened || !this.settings.closable && !force) {
        return 0;
      }
      this.LGel.trigger(lGEvents$1.beforeClose);
      if (this.settings.resetScrollPosition && !this.settings.hideScrollbar) {
        $LG(window).scrollTop(this.prevScrollTop);
      }
      var currentItem = this.items[this.index];
      var transform;
      if (this.zoomFromOrigin && currentItem) {
        var _a = this.mediaContainerPosition,
          top_4 = _a.top,
          bottom = _a.bottom;
        var _b = this.galleryItems[this.index],
          __slideVideoInfo = _b.__slideVideoInfo,
          poster = _b.poster;
        var imageSize = utils.getSize(currentItem, this.outer, top_4 + bottom, __slideVideoInfo && poster && this.settings.videoMaxSize);
        transform = utils.getTransform(currentItem, this.outer, top_4, bottom, imageSize);
      }
      if (this.zoomFromOrigin && transform) {
        this.outer.addClass('lg-closing lg-zoom-from-image');
        this.getSlideItem(this.index).addClass('lg-start-end-progress').css('transition-duration', this.settings.startAnimationDuration + 'ms').css('transform', transform);
      } else {
        this.outer.addClass('lg-hide-items');
        // lg-zoom-from-image is used for setting the opacity to 1 if zoomFromOrigin is true
        // If the closing item doesn't have the lg-size attribute, remove this class to avoid the closing css conflicts
        this.outer.removeClass('lg-zoom-from-image');
      }
      // Unbind all events added by lightGallery
      // @todo
      //this.$el.off('.lg.tm');
      this.destroyModules();
      this.lGalleryOn = false;
      this.isDummyImageRemoved = false;
      this.zoomFromOrigin = this.settings.zoomFromOrigin;
      clearTimeout(this.hideBarTimeout);
      this.hideBarTimeout = false;
      $LG('html').removeClass('lg-on');
      this.outer.removeClass('lg-visible lg-components-open');
      // Resetting opacity to 0 isd required as  vertical swipe to close function adds inline opacity.
      this.$backdrop.removeClass('in').css('opacity', 0);
      var removeTimeout = this.zoomFromOrigin && transform ? Math.max(this.settings.startAnimationDuration, this.settings.backdropDuration) : this.settings.backdropDuration;
      this.$container.removeClass('lg-show-in');
      // Once the closign animation is completed and gallery is invisible
      setTimeout(function () {
        if (_this.zoomFromOrigin && transform) {
          _this.outer.removeClass('lg-zoom-from-image');
        }
        _this.$container.removeClass('lg-show');
        // Reset scrollbar
        _this.resetScrollBar();
        // Need to remove inline opacity as it is used in the stylesheet as well
        _this.$backdrop.removeAttr('style').css('transition-duration', _this.settings.backdropDuration + 'ms');
        _this.outer.removeClass("lg-closing " + _this.settings.startClass);
        _this.getSlideItem(_this.index).removeClass('lg-start-end-progress');
        _this.$inner.empty();
        if (_this.lgOpened) {
          _this.LGel.trigger(lGEvents$1.afterClose, {
            instance: _this
          });
        }
        if (_this.$container.get()) {
          _this.$container.get().blur();
        }
        _this.lgOpened = false;
      }, removeTimeout + 100);
      return removeTimeout + 100;
    };
    LightGallery.prototype.initModules = function () {
      this.plugins.forEach(function (module) {
        try {
          module.init();
        } catch (err) {
          console.warn("lightGallery:- make sure lightGallery module is properly initiated");
        }
      });
    };
    LightGallery.prototype.destroyModules = function (destroy) {
      this.plugins.forEach(function (module) {
        try {
          if (destroy) {
            module.destroy();
          } else {
            module.closeGallery && module.closeGallery();
          }
        } catch (err) {
          console.warn("lightGallery:- make sure lightGallery module is properly destroyed");
        }
      });
    };
    /**
     * Refresh lightGallery with new set of children.
     *
     * @description This is useful to update the gallery when the child elements are changed without calling destroy method.
     *
     * If you are using dynamic mode, you can pass the modified array of dynamicEl as the first parameter to refresh the dynamic gallery
     * @see <a href="/demos/dynamic-mode/">Demo</a>
     * @category lGPublicMethods
     * @example
     *  const plugin = lightGallery();
     *  // Delete or add children, then call
     *  plugin.refresh();
     *
     */
    LightGallery.prototype.refresh = function (galleryItems) {
      if (!this.settings.dynamic) {
        this.invalidateItems();
      }
      if (galleryItems) {
        this.galleryItems = galleryItems;
      } else {
        this.galleryItems = this.getItems();
      }
      this.updateControls();
      this.openGalleryOnItemClick();
      this.LGel.trigger(lGEvents$1.updateSlides);
    };
    LightGallery.prototype.updateControls = function () {
      this.addSlideVideoInfo(this.galleryItems);
      this.updateCounterTotal();
      this.manageSingleSlideClassName();
    };
    LightGallery.prototype.destroyGallery = function () {
      this.destroyModules(true);
      if (!this.settings.dynamic) {
        this.invalidateItems();
      }
      $LG(window).off(".lg.global" + this.lgId);
      this.LGel.off('.lg');
      this.$container.remove();
    };
    /**
     * Destroy lightGallery.
     * Destroy lightGallery and its plugin instances completely
     *
     * @description This method also calls CloseGallery function internally. Returns the time takes to completely close and destroy the instance.
     * In case if you want to re-initialize lightGallery right after destroying it, initialize it only once the destroy process is completed.
     * You can use refresh method most of the times.
     * @category lGPublicMethods
     * @example
     *  const plugin = lightGallery();
     *  plugin.destroy();
     *
     */
    LightGallery.prototype.destroy = function () {
      var closeTimeout = this.closeGallery(true);
      if (closeTimeout) {
        setTimeout(this.destroyGallery.bind(this), closeTimeout);
      } else {
        this.destroyGallery();
      }
      return closeTimeout;
    };
    return LightGallery;
  }();
  function lightGallery(el, options) {
    return new LightGallery(el, options);
  }

  /*!
   * lightgallery | 2.7.2 | September 20th 2023
   * http://www.lightgalleryjs.com/
   * Copyright (c) 2020 Sachin Neravath;
   * @license GPLv3
   */

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  var __assign = function () {
    __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  var videoSettings = {
    autoplayFirstVideo: true,
    youTubePlayerParams: false,
    vimeoPlayerParams: false,
    wistiaPlayerParams: false,
    gotoNextSlideOnVideoEnd: true,
    autoplayVideoOnSlide: false,
    videojs: false,
    videojsTheme: '',
    videojsOptions: {}
  };

  /**
   * List of lightGallery events
   * All events should be documented here
   * Below interfaces are used to build the website documentations
   * */
  var lGEvents = {
    afterAppendSlide: 'lgAfterAppendSlide',
    init: 'lgInit',
    hasVideo: 'lgHasVideo',
    containerResize: 'lgContainerResize',
    updateSlides: 'lgUpdateSlides',
    afterAppendSubHtml: 'lgAfterAppendSubHtml',
    beforeOpen: 'lgBeforeOpen',
    afterOpen: 'lgAfterOpen',
    slideItemLoad: 'lgSlideItemLoad',
    beforeSlide: 'lgBeforeSlide',
    afterSlide: 'lgAfterSlide',
    posterClick: 'lgPosterClick',
    dragStart: 'lgDragStart',
    dragMove: 'lgDragMove',
    dragEnd: 'lgDragEnd',
    beforeNextSlide: 'lgBeforeNextSlide',
    beforePrevSlide: 'lgBeforePrevSlide',
    beforeClose: 'lgBeforeClose',
    afterClose: 'lgAfterClose',
    rotateLeft: 'lgRotateLeft',
    rotateRight: 'lgRotateRight',
    flipHorizontal: 'lgFlipHorizontal',
    flipVertical: 'lgFlipVertical',
    autoplay: 'lgAutoplay',
    autoplayStart: 'lgAutoplayStart',
    autoplayStop: 'lgAutoplayStop'
  };
  var param = function (obj) {
    return Object.keys(obj).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
    }).join('&');
  };
  var paramsToObject = function (url) {
    var paramas = url.slice(1).split('&').map(function (p) {
      return p.split('=');
    }).reduce(function (obj, pair) {
      var _a = pair.map(decodeURIComponent),
        key = _a[0],
        value = _a[1];
      obj[key] = value;
      return obj;
    }, {});
    return paramas;
  };
  var getYouTubeParams = function (videoInfo, youTubePlayerParamsSettings) {
    if (!videoInfo.youtube) return '';
    var slideUrlParams = videoInfo.youtube[2] ? paramsToObject(videoInfo.youtube[2]) : '';
    // For youtube first params gets priority if duplicates found
    var defaultYouTubePlayerParams = {
      wmode: 'opaque',
      autoplay: 0,
      mute: 1,
      enablejsapi: 1
    };
    var playerParamsSettings = youTubePlayerParamsSettings || {};
    var youTubePlayerParams = __assign(__assign(__assign({}, defaultYouTubePlayerParams), playerParamsSettings), slideUrlParams);
    var youTubeParams = "?" + param(youTubePlayerParams);
    return youTubeParams;
  };
  var isYouTubeNoCookie = function (url) {
    return url.includes('youtube-nocookie.com');
  };
  var getVimeoURLParams = function (defaultParams, videoInfo) {
    if (!videoInfo || !videoInfo.vimeo) return '';
    var urlParams = videoInfo.vimeo[2] || '';
    var defaultPlayerParams = defaultParams && Object.keys(defaultParams).length !== 0 ? '&' + param(defaultParams) : '';
    // Support private video
    var urlWithHash = videoInfo.vimeo[0].split('/').pop() || '';
    var urlWithHashWithParams = urlWithHash.split('?')[0] || '';
    var hash = urlWithHashWithParams.split('#')[0];
    var isPrivate = videoInfo.vimeo[1] !== hash;
    if (isPrivate) {
      urlParams = urlParams.replace("/" + hash, '');
    }
    urlParams = urlParams[0] == '?' ? '&' + urlParams.slice(1) : urlParams || '';
    // For vimeo last params gets priority if duplicates found
    var vimeoPlayerParams = "?autoplay=0&muted=1" + (isPrivate ? "&h=" + hash : '') + defaultPlayerParams + urlParams;
    return vimeoPlayerParams;
  };

  /**
   * Video module for lightGallery
   * Supports HTML5, YouTube, Vimeo, wistia videos
   *
   *
   * @ref Wistia
   * https://wistia.com/support/integrations/wordpress(How to get url)
   * https://wistia.com/support/developers/embed-options#using-embed-options
   * https://wistia.com/support/developers/player-api
   * https://wistia.com/support/developers/construct-an-embed-code
   * http://jsfiddle.net/xvnm7xLm/
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
   * https://wistia.com/support/embed-and-share/sharing-videos
   * https://private-sharing.wistia.com/medias/mwhrulrucj
   *
   * @ref Youtube
   * https://developers.google.com/youtube/player_parameters#enablejsapi
   * https://developers.google.com/youtube/iframe_api_reference
   * https://developer.chrome.com/blog/autoplay/#iframe-delegation
   *
   * @ref Vimeo
   * https://stackoverflow.com/questions/10488943/easy-way-to-get-vimeo-id-from-a-vimeo-url
   * https://vimeo.zendesk.com/hc/en-us/articles/360000121668-Starting-playback-at-a-specific-timecode
   * https://vimeo.zendesk.com/hc/en-us/articles/360001494447-Using-Player-Parameters
   */
  var Video = /** @class */function () {
    function Video(instance) {
      // get lightGallery core plugin instance
      this.core = instance;
      this.settings = __assign(__assign({}, videoSettings), this.core.settings);
      return this;
    }
    Video.prototype.init = function () {
      var _this = this;
      /**
       * Event triggered when video url found without poster
       * Append video HTML
       * Play if autoplayFirstVideo is true
       */
      this.core.LGel.on(lGEvents.hasVideo + ".video", this.onHasVideo.bind(this));
      this.core.LGel.on(lGEvents.posterClick + ".video", function () {
        var $el = _this.core.getSlideItem(_this.core.index);
        _this.loadVideoOnPosterClick($el);
      });
      this.core.LGel.on(lGEvents.slideItemLoad + ".video", this.onSlideItemLoad.bind(this));
      // @desc fired immediately before each slide transition.
      this.core.LGel.on(lGEvents.beforeSlide + ".video", this.onBeforeSlide.bind(this));
      // @desc fired immediately after each slide transition.
      this.core.LGel.on(lGEvents.afterSlide + ".video", this.onAfterSlide.bind(this));
    };
    /**
     * @desc Event triggered when a slide is completely loaded
     *
     * @param {Event} event - lightGalley custom event
     */
    Video.prototype.onSlideItemLoad = function (event) {
      var _this = this;
      var _a = event.detail,
        isFirstSlide = _a.isFirstSlide,
        index = _a.index;
      // Should check the active slide as well as user may have moved to different slide before the first slide is loaded
      if (this.settings.autoplayFirstVideo && isFirstSlide && index === this.core.index) {
        // Delay is just for the transition effect on video load
        setTimeout(function () {
          _this.loadAndPlayVideo(index);
        }, 200);
      }
      // Should not call on first slide. should check only if the slide is active
      if (!isFirstSlide && this.settings.autoplayVideoOnSlide && index === this.core.index) {
        this.loadAndPlayVideo(index);
      }
    };
    /**
     * @desc Event triggered when video url or poster found
     * Append video HTML is poster is not given
     * Play if autoplayFirstVideo is true
     *
     * @param {Event} event - Javascript Event object.
     */
    Video.prototype.onHasVideo = function (event) {
      var _a = event.detail,
        index = _a.index,
        src = _a.src,
        html5Video = _a.html5Video,
        hasPoster = _a.hasPoster;
      if (!hasPoster) {
        // All functions are called separately if poster exist in loadVideoOnPosterClick function
        this.appendVideos(this.core.getSlideItem(index), {
          src: src,
          addClass: 'lg-object',
          index: index,
          html5Video: html5Video
        });
        // Automatically navigate to next slide once video reaches the end.
        this.gotoNextSlideOnVideoEnd(src, index);
      }
    };
    /**
     * @desc fired immediately before each slide transition.
     * Pause the previous video
     * Hide the download button if the slide contains YouTube, Vimeo, or Wistia videos.
     *
     * @param {Event} event - Javascript Event object.
     * @param {number} prevIndex - Previous index of the slide.
     * @param {number} index - Current index of the slide
     */
    Video.prototype.onBeforeSlide = function (event) {
      if (this.core.lGalleryOn) {
        var prevIndex = event.detail.prevIndex;
        this.pauseVideo(prevIndex);
      }
    };
    /**
     * @desc fired immediately after each slide transition.
     * Play video if autoplayVideoOnSlide option is enabled.
     *
     * @param {Event} event - Javascript Event object.
     * @param {number} prevIndex - Previous index of the slide.
     * @param {number} index - Current index of the slide
     * @todo should check on onSlideLoad as well if video is not loaded on after slide
     */
    Video.prototype.onAfterSlide = function (event) {
      var _this = this;
      var _a = event.detail,
        index = _a.index,
        prevIndex = _a.prevIndex;
      // Do not call on first slide
      var $slide = this.core.getSlideItem(index);
      if (this.settings.autoplayVideoOnSlide && index !== prevIndex) {
        if ($slide.hasClass('lg-complete')) {
          setTimeout(function () {
            _this.loadAndPlayVideo(index);
          }, 100);
        }
      }
    };
    Video.prototype.loadAndPlayVideo = function (index) {
      var $slide = this.core.getSlideItem(index);
      var currentGalleryItem = this.core.galleryItems[index];
      if (currentGalleryItem.poster) {
        this.loadVideoOnPosterClick($slide, true);
      } else {
        this.playVideo(index);
      }
    };
    /**
     * Play HTML5, Youtube, Vimeo or Wistia videos in a particular slide.
     * @param {number} index - Index of the slide
     */
    Video.prototype.playVideo = function (index) {
      this.controlVideo(index, 'play');
    };
    /**
     * Pause HTML5, Youtube, Vimeo or Wistia videos in a particular slide.
     * @param {number} index - Index of the slide
     */
    Video.prototype.pauseVideo = function (index) {
      this.controlVideo(index, 'pause');
    };
    Video.prototype.getVideoHtml = function (src, addClass, index, html5Video) {
      var video = '';
      var videoInfo = this.core.galleryItems[index].__slideVideoInfo || {};
      var currentGalleryItem = this.core.galleryItems[index];
      var videoTitle = currentGalleryItem.title || currentGalleryItem.alt;
      videoTitle = videoTitle ? 'title="' + videoTitle + '"' : '';
      var commonIframeProps = "allowtransparency=\"true\"\n            frameborder=\"0\"\n            scrolling=\"no\"\n            allowfullscreen\n            mozallowfullscreen\n            webkitallowfullscreen\n            oallowfullscreen\n            msallowfullscreen";
      if (videoInfo.youtube) {
        var videoId = 'lg-youtube' + index;
        var youTubeParams = getYouTubeParams(videoInfo, this.settings.youTubePlayerParams);
        var isYouTubeNoCookieURL = isYouTubeNoCookie(src);
        var youtubeURL = isYouTubeNoCookieURL ? '//www.youtube-nocookie.com/' : '//www.youtube.com/';
        video = "<iframe allow=\"autoplay\" id=" + videoId + " class=\"lg-video-object lg-youtube " + addClass + "\" " + videoTitle + " src=\"" + youtubeURL + "embed/" + (videoInfo.youtube[1] + youTubeParams) + "\" " + commonIframeProps + "></iframe>";
      } else if (videoInfo.vimeo) {
        var videoId = 'lg-vimeo' + index;
        var playerParams = getVimeoURLParams(this.settings.vimeoPlayerParams, videoInfo);
        video = "<iframe allow=\"autoplay\" id=" + videoId + " class=\"lg-video-object lg-vimeo " + addClass + "\" " + videoTitle + " src=\"//player.vimeo.com/video/" + (videoInfo.vimeo[1] + playerParams) + "\" " + commonIframeProps + "></iframe>";
      } else if (videoInfo.wistia) {
        var wistiaId = 'lg-wistia' + index;
        var playerParams = param(this.settings.wistiaPlayerParams);
        playerParams = playerParams ? '?' + playerParams : '';
        video = "<iframe allow=\"autoplay\" id=\"" + wistiaId + "\" src=\"//fast.wistia.net/embed/iframe/" + (videoInfo.wistia[4] + playerParams) + "\" " + videoTitle + " class=\"wistia_embed lg-video-object lg-wistia " + addClass + "\" name=\"wistia_embed\" " + commonIframeProps + "></iframe>";
      } else if (videoInfo.html5) {
        var html5VideoMarkup = '';
        for (var i = 0; i < html5Video.source.length; i++) {
          html5VideoMarkup += "<source src=\"" + html5Video.source[i].src + "\" type=\"" + html5Video.source[i].type + "\">";
        }
        if (html5Video.tracks) {
          var _loop_1 = function (i) {
            var trackAttributes = '';
            var track = html5Video.tracks[i];
            Object.keys(track || {}).forEach(function (key) {
              trackAttributes += key + "=\"" + track[key] + "\" ";
            });
            html5VideoMarkup += "<track " + trackAttributes + ">";
          };
          for (var i = 0; i < html5Video.tracks.length; i++) {
            _loop_1(i);
          }
        }
        var html5VideoAttrs_1 = '';
        var videoAttributes_1 = html5Video.attributes || {};
        Object.keys(videoAttributes_1 || {}).forEach(function (key) {
          html5VideoAttrs_1 += key + "=\"" + videoAttributes_1[key] + "\" ";
        });
        video = "<video class=\"lg-video-object lg-html5 " + (this.settings.videojs && this.settings.videojsTheme ? this.settings.videojsTheme + ' ' : '') + " " + (this.settings.videojs ? ' video-js' : '') + "\" " + html5VideoAttrs_1 + ">\n                " + html5VideoMarkup + "\n                Your browser does not support HTML5 video.\n            </video>";
      }
      return video;
    };
    /**
     * @desc - Append videos to the slide
     *
     * @param {HTMLElement} el - slide element
     * @param {Object} videoParams - Video parameters, Contains src, class, index, htmlVideo
     */
    Video.prototype.appendVideos = function (el, videoParams) {
      var _a;
      var videoHtml = this.getVideoHtml(videoParams.src, videoParams.addClass, videoParams.index, videoParams.html5Video);
      el.find('.lg-video-cont').append(videoHtml);
      var $videoElement = el.find('.lg-video-object').first();
      if (videoParams.html5Video) {
        $videoElement.on('mousedown.lg.video', function (e) {
          e.stopPropagation();
        });
      }
      if (this.settings.videojs && ((_a = this.core.galleryItems[videoParams.index].__slideVideoInfo) === null || _a === void 0 ? void 0 : _a.html5)) {
        try {
          return videojs($videoElement.get(), this.settings.videojsOptions);
        } catch (e) {
          console.error('lightGallery:- Make sure you have included videojs');
        }
      }
    };
    Video.prototype.gotoNextSlideOnVideoEnd = function (src, index) {
      var _this = this;
      var $videoElement = this.core.getSlideItem(index).find('.lg-video-object').first();
      var videoInfo = this.core.galleryItems[index].__slideVideoInfo || {};
      if (this.settings.gotoNextSlideOnVideoEnd) {
        if (videoInfo.html5) {
          $videoElement.on('ended', function () {
            _this.core.goToNextSlide();
          });
        } else if (videoInfo.vimeo) {
          try {
            // https://github.com/vimeo/player.js/#ended
            new Vimeo.Player($videoElement.get()).on('ended', function () {
              _this.core.goToNextSlide();
            });
          } catch (e) {
            console.error('lightGallery:- Make sure you have included //github.com/vimeo/player.js');
          }
        } else if (videoInfo.wistia) {
          try {
            window._wq = window._wq || [];
            // @todo Event is gettign triggered multiple times
            window._wq.push({
              id: $videoElement.attr('id'),
              onReady: function (video) {
                video.bind('end', function () {
                  _this.core.goToNextSlide();
                });
              }
            });
          } catch (e) {
            console.error('lightGallery:- Make sure you have included //fast.wistia.com/assets/external/E-v1.js');
          }
        }
      }
    };
    Video.prototype.controlVideo = function (index, action) {
      var $videoElement = this.core.getSlideItem(index).find('.lg-video-object').first();
      var videoInfo = this.core.galleryItems[index].__slideVideoInfo || {};
      if (!$videoElement.get()) return;
      if (videoInfo.youtube) {
        try {
          $videoElement.get().contentWindow.postMessage("{\"event\":\"command\",\"func\":\"" + action + "Video\",\"args\":\"\"}", '*');
        } catch (e) {
          console.error("lightGallery:- " + e);
        }
      } else if (videoInfo.vimeo) {
        try {
          new Vimeo.Player($videoElement.get())[action]();
        } catch (e) {
          console.error('lightGallery:- Make sure you have included //github.com/vimeo/player.js');
        }
      } else if (videoInfo.html5) {
        if (this.settings.videojs) {
          try {
            videojs($videoElement.get())[action]();
          } catch (e) {
            console.error('lightGallery:- Make sure you have included videojs');
          }
        } else {
          $videoElement.get()[action]();
        }
      } else if (videoInfo.wistia) {
        try {
          window._wq = window._wq || [];
          // @todo Find a way to destroy wistia player instance
          window._wq.push({
            id: $videoElement.attr('id'),
            onReady: function (video) {
              video[action]();
            }
          });
        } catch (e) {
          console.error('lightGallery:- Make sure you have included //fast.wistia.com/assets/external/E-v1.js');
        }
      }
    };
    Video.prototype.loadVideoOnPosterClick = function ($el, forcePlay) {
      var _this = this;
      // check slide has poster
      if (!$el.hasClass('lg-video-loaded')) {
        // check already video element present
        if (!$el.hasClass('lg-has-video')) {
          $el.addClass('lg-has-video');
          var _html = void 0;
          var _src = this.core.galleryItems[this.core.index].src;
          var video = this.core.galleryItems[this.core.index].video;
          if (video) {
            _html = typeof video === 'string' ? JSON.parse(video) : video;
          }
          var videoJsPlayer_1 = this.appendVideos($el, {
            src: _src,
            addClass: '',
            index: this.core.index,
            html5Video: _html
          });
          this.gotoNextSlideOnVideoEnd(_src, this.core.index);
          var $tempImg = $el.find('.lg-object').first().get();
          // @todo make sure it is working
          $el.find('.lg-video-cont').first().append($tempImg);
          $el.addClass('lg-video-loading');
          videoJsPlayer_1 && videoJsPlayer_1.ready(function () {
            videoJsPlayer_1.on('loadedmetadata', function () {
              _this.onVideoLoadAfterPosterClick($el, _this.core.index);
            });
          });
          $el.find('.lg-video-object').first().on('load.lg error.lg loadedmetadata.lg', function () {
            setTimeout(function () {
              _this.onVideoLoadAfterPosterClick($el, _this.core.index);
            }, 50);
          });
        } else {
          this.playVideo(this.core.index);
        }
      } else if (forcePlay) {
        this.playVideo(this.core.index);
      }
    };
    Video.prototype.onVideoLoadAfterPosterClick = function ($el, index) {
      $el.addClass('lg-video-loaded');
      this.playVideo(index);
    };
    Video.prototype.destroy = function () {
      this.core.LGel.off('.lg.video');
      this.core.LGel.off('.video');
    };
    return Video;
  }();

  function videoLightgallery() {
    console.log(' lg video');
    var videos = document.getElementsByClassName('video__lg');
    for (let item of videos) {
      lightGallery(item, {
        plugins: [Video],
        share: false,
        selector: 'this',
        speed: 500,
        licenseKey: 'RWGFX-KWFPH-57MZ4-GKE8B',
        counter: false,
        mousewheel: true,
        addClass: 'custom-light-gallery',
        // Añadir una clase personalizada si lo deseas
        appendSubHtmlTo: '.lg-item',
        subHtmlSelectorRelative: true,
        download: false,
        mobileSettings: {
          showCloseIcon: true
        }
      });
    }
  }

  function singleVideo() {
    let scrollPos = 0;
    function bloquearScroll() {
      // Guardar la posición actual del scroll
      scrollPos = window.scrollY;

      // Evitar que el body se desplace
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPos}px`;
      document.body.style.width = '100%';
    }
    function desbloquearScroll() {
      // Restaurar el scroll y la posición
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';

      // Restaurar la posición del scroll
      window.scrollTo(0, scrollPos);
    }
    const cursor = jQuery(".cursor");
    var n = cursor.find("span");

    // console.log('single video');

    const video = document.querySelector('.single__header--video video');
    const poster = document.querySelector('.single__header__poster');
    const container = document.querySelector('.single__header--video');
    const body = document.querySelector('body');
    const video_button = document.querySelector('.single__header .video__lg');

    // detect if touch
    function isTouchDevice() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }
    const isTouch = isTouchDevice();
    if (!isTouch) {
      // console.log(video);

      video_button.style.display = 'none';
      video.currentTime = 1;
      video.pause();
      container.addEventListener('click', () => {
        // Detect play/pause state of video and toggle
        if (video.paused) {
          bloquearScroll(); // Bloquear el scroll
          poster.style.opacity = '0';
          video.play();
          body.classList.add('video-play');
          container.classList.remove('link--play');
          container.classList.add('link--pause');

          // kill events play
          jQuery(".link--pause").unbind("mouseenter");
          jQuery(".link--pause").unbind("mouseleave");

          // active cursor
          n.removeClass('cursor--play');
          n.addClass('cursor--pause');

          // active cursor
          jQuery(window).on({
            mouseenter: function () {
              return n.removeClass("off");
            },
            mouseleave: function () {
              return n.addClass("off");
            }
          });
          jQuery(".link--pause").on({
            mouseenter: function () {
              return n.addClass('cursor--pause');
            },
            mouseleave: function () {
              return n.removeClass("cursor--pause");
            }
          });
        } else {
          desbloquearScroll(); // Desbloquear el scroll
          video.pause();
          body.classList.remove('video-play');
          container.classList.add('link--play');
          container.classList.remove('link--pause');

          // kill events pause
          jQuery(".link--play").unbind("mouseenter");
          jQuery(".link--play").unbind("mouseleave");

          // desactive cursor
          n.removeClass('cursor--pause');
          n.addClass('cursor--play');
          // customCursor();

          jQuery(".link--play").on({
            mouseenter: function () {
              return n.addClass('cursor--play');
            },
            mouseleave: function () {
              return n.removeClass("cursor--play");
            }
          });
        }
      });
    } else {
      video.style.display = 'none';
    }
  }

  function moduleWords() {
    // console.log('Words');

    let targets = document.querySelectorAll(".words");
    targets.forEach(item => {
      let container = item.querySelectorAll(".words__items");
      let elements = item.querySelectorAll(".words__item");
      const refresh = item.dataset.refresh;

      // console.log(100-refresh);

      // console.log('items', 1 / (elements.length - 1) )

      gsapWithCSS.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top top",
          end: "+=" + 1.5 * innerHeight,
          pin: true,
          scrub: 1,
          markers: false,
          refreshPriority: 100 - refresh,
          snap: {
            snapTo: 1 / (elements.length - 1),
            duration: 0.5,
            delay: 0,
            ease: "power1.inOut",
            inertia: false
          }
        }
      }).to(container, {
        x: -((elements.length - 1) * window.innerWidth) + 'px',
        ease: "none"
      });
    });
  }

  function moduleQuotes() {
    console.log('Quotes');

    // console.log('Words');

    let quotes = document.querySelectorAll(".quotes");
    quotes.forEach(quote => {
      let container = quote.querySelector(".quotes__items");
      // let wrap = quote.querySelectorAll(".quotes__items__wrap");
      let elements = quote.querySelectorAll(".quotes__item");
      quote.querySelector(".quotes__item:last-child");
      const refresh = quote.dataset.refresh;

      // Inicializa una variable para almacenar la altura máxima
      let maxHeight = 0;

      // Recorre todos los elementos para encontrar el más alto
      elements.forEach(element => {
        // Obtiene la altura de cada elemento
        const elementHeight = element.offsetHeight;

        // Si esta altura es mayor que la altura máxima encontrada, la actualiza
        if (elementHeight > maxHeight) {
          maxHeight = elementHeight;
        }
      });

      // Asigna la altura máxima a todos los elementos
      elements.forEach(element => {
        element.style.height = `${maxHeight}px`;
      });
      container.style.height = `${maxHeight}px`;
      gsapWithCSS.registerPlugin(ScrollTrigger);
      let textBlocks = gsapWithCSS.utils.toArray(".quotes__item");
      console.log(maxHeight);
      const tl = gsapWithCSS.timeline({
        scrollTrigger: {
          trigger: quote,
          start: "top top",
          // La animación empieza cuando la sección llega a la parte superior de la ventana
          end: () => "+=" + elements.length * window.innerHeight,
          // Se ajusta al número de elementos
          scrub: 1,
          // La animación sigue el scroll del usuario
          pin: true,
          // Fija la sección mientras se ejecuta la animación
          pinSpacing: true,
          refreshPriority: 100 - refresh
        }
      });
      textBlocks.forEach((block, i) => {
        tl.fromTo(block, {
          opacity: 0,
          y: 50
        },
        // Empieza invisible y un poco desplazado hacia abajo
        {
          opacity: 1,
          y: 0,
          duration: 0.3
        }, i * 0.5 // Controla el tiempo de aparición
        ).to(block, {
          opacity: 0,
          y: -50,
          duration: 0.3
        }, i * 0.5 + 0.2 // La salida ocurre después de un pequeño retraso
        );
      });
    });
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  /*!
   * Splide.js
   * Version  : 4.1.4
   * License  : MIT
   * Copyright: 2022 Naotoshi Fujita
   */
  var MEDIA_PREFERS_REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
  var CREATED = 1;
  var MOUNTED = 2;
  var IDLE = 3;
  var MOVING = 4;
  var SCROLLING = 5;
  var DRAGGING = 6;
  var DESTROYED = 7;
  var STATES = {
    CREATED: CREATED,
    MOUNTED: MOUNTED,
    IDLE: IDLE,
    MOVING: MOVING,
    SCROLLING: SCROLLING,
    DRAGGING: DRAGGING,
    DESTROYED: DESTROYED
  };
  function empty$1(array) {
    array.length = 0;
  }
  function slice$2(arrayLike, start, end) {
    return Array.prototype.slice.call(arrayLike, start, end);
  }
  function apply$2(func) {
    return func.bind.apply(func, [null].concat(slice$2(arguments, 1)));
  }
  var nextTick = setTimeout;
  var noop = function noop() {};
  function raf$1(func) {
    return requestAnimationFrame(func);
  }
  function typeOf$2(type, subject) {
    return typeof subject === type;
  }
  function isObject$1(subject) {
    return !isNull$1(subject) && typeOf$2("object", subject);
  }
  var isArray$2 = Array.isArray;
  var isFunction = apply$2(typeOf$2, "function");
  var isString = apply$2(typeOf$2, "string");
  var isUndefined$1 = apply$2(typeOf$2, "undefined");
  function isNull$1(subject) {
    return subject === null;
  }
  function isHTMLElement(subject) {
    try {
      return subject instanceof (subject.ownerDocument.defaultView || window).HTMLElement;
    } catch (e) {
      return false;
    }
  }
  function toArray$2(value) {
    return isArray$2(value) ? value : [value];
  }
  function forEach$2(values, iteratee) {
    toArray$2(values).forEach(iteratee);
  }
  function includes(array, value) {
    return array.indexOf(value) > -1;
  }
  function push(array, items) {
    array.push.apply(array, toArray$2(items));
    return array;
  }
  function toggleClass$1(elm, classes, add) {
    if (elm) {
      forEach$2(classes, function (name) {
        if (name) {
          elm.classList[add ? "add" : "remove"](name);
        }
      });
    }
  }
  function addClass(elm, classes) {
    toggleClass$1(elm, isString(classes) ? classes.split(" ") : classes, true);
  }
  function append(parent, children) {
    forEach$2(children, parent.appendChild.bind(parent));
  }
  function before(nodes, ref) {
    forEach$2(nodes, function (node) {
      var parent = (ref || node).parentNode;
      if (parent) {
        parent.insertBefore(node, ref);
      }
    });
  }
  function matches(elm, selector) {
    return isHTMLElement(elm) && (elm["msMatchesSelector"] || elm.matches).call(elm, selector);
  }
  function children(parent, selector) {
    var children2 = parent ? slice$2(parent.children) : [];
    return selector ? children2.filter(function (child) {
      return matches(child, selector);
    }) : children2;
  }
  function child(parent, selector) {
    return selector ? children(parent, selector)[0] : parent.firstElementChild;
  }
  var ownKeys$2 = Object.keys;
  function forOwn$2(object, iteratee, right) {
    if (object) {
      (right ? ownKeys$2(object).reverse() : ownKeys$2(object)).forEach(function (key) {
        key !== "__proto__" && iteratee(object[key], key);
      });
    }
    return object;
  }
  function assign$2(object) {
    slice$2(arguments, 1).forEach(function (source) {
      forOwn$2(source, function (value, key) {
        object[key] = source[key];
      });
    });
    return object;
  }
  function merge(object) {
    slice$2(arguments, 1).forEach(function (source) {
      forOwn$2(source, function (value, key) {
        if (isArray$2(value)) {
          object[key] = value.slice();
        } else if (isObject$1(value)) {
          object[key] = merge({}, isObject$1(object[key]) ? object[key] : {}, value);
        } else {
          object[key] = value;
        }
      });
    });
    return object;
  }
  function omit(object, keys) {
    forEach$2(keys || ownKeys$2(object), function (key) {
      delete object[key];
    });
  }
  function removeAttribute$1(elms, attrs) {
    forEach$2(elms, function (elm) {
      forEach$2(attrs, function (attr) {
        elm && elm.removeAttribute(attr);
      });
    });
  }
  function setAttribute$1(elms, attrs, value) {
    if (isObject$1(attrs)) {
      forOwn$2(attrs, function (value2, name) {
        setAttribute$1(elms, name, value2);
      });
    } else {
      forEach$2(elms, function (elm) {
        isNull$1(value) || value === "" ? removeAttribute$1(elm, attrs) : elm.setAttribute(attrs, String(value));
      });
    }
  }
  function create(tag, attrs, parent) {
    var elm = document.createElement(tag);
    if (attrs) {
      isString(attrs) ? addClass(elm, attrs) : setAttribute$1(elm, attrs);
    }
    parent && append(parent, elm);
    return elm;
  }
  function style(elm, prop, value) {
    if (isUndefined$1(value)) {
      return getComputedStyle(elm)[prop];
    }
    if (!isNull$1(value)) {
      elm.style[prop] = "" + value;
    }
  }
  function display(elm, display2) {
    style(elm, "display", display2);
  }
  function focus(elm) {
    elm["setActive"] && elm["setActive"]() || elm.focus({
      preventScroll: true
    });
  }
  function getAttribute(elm, attr) {
    return elm.getAttribute(attr);
  }
  function hasClass(elm, className) {
    return elm && elm.classList.contains(className);
  }
  function rect(target) {
    return target.getBoundingClientRect();
  }
  function remove(nodes) {
    forEach$2(nodes, function (node) {
      if (node && node.parentNode) {
        node.parentNode.removeChild(node);
      }
    });
  }
  function parseHtml(html) {
    return child(new DOMParser().parseFromString(html, "text/html").body);
  }
  function prevent(e, stopPropagation) {
    e.preventDefault();
    if (stopPropagation) {
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
  function query(parent, selector) {
    return parent && parent.querySelector(selector);
  }
  function queryAll(parent, selector) {
    return selector ? slice$2(parent.querySelectorAll(selector)) : [];
  }
  function removeClass(elm, classes) {
    toggleClass$1(elm, classes, false);
  }
  function timeOf(e) {
    return e.timeStamp;
  }
  function unit(value) {
    return isString(value) ? value : value ? value + "px" : "";
  }
  var PROJECT_CODE = "splide";
  var DATA_ATTRIBUTE = "data-" + PROJECT_CODE;
  function assert(condition, message) {
    if (!condition) {
      throw new Error("[" + PROJECT_CODE + "] " + (message || ""));
    }
  }
  var min$2 = Math.min,
    max$1 = Math.max,
    floor$1 = Math.floor,
    ceil$1 = Math.ceil,
    abs$1 = Math.abs;
  function approximatelyEqual(x, y, epsilon) {
    return abs$1(x - y) < epsilon;
  }
  function between(number, x, y, exclusive) {
    var minimum = min$2(x, y);
    var maximum = max$1(x, y);
    return exclusive ? minimum < number && number < maximum : minimum <= number && number <= maximum;
  }
  function clamp$1(number, x, y) {
    var minimum = min$2(x, y);
    var maximum = max$1(x, y);
    return min$2(max$1(minimum, number), maximum);
  }
  function sign(x) {
    return +(x > 0) - +(x < 0);
  }
  function format(string, replacements) {
    forEach$2(replacements, function (replacement) {
      string = string.replace("%s", "" + replacement);
    });
    return string;
  }
  function pad(number) {
    return number < 10 ? "0" + number : "" + number;
  }
  var ids = {};
  function uniqueId(prefix) {
    return "" + prefix + pad(ids[prefix] = (ids[prefix] || 0) + 1);
  }
  function EventBinder$1() {
    var listeners = [];
    function bind(targets, events, callback, options) {
      forEachEvent(targets, events, function (target, event, namespace) {
        var isEventTarget = ("addEventListener" in target);
        var remover = isEventTarget ? target.removeEventListener.bind(target, event, callback, options) : target["removeListener"].bind(target, callback);
        isEventTarget ? target.addEventListener(event, callback, options) : target["addListener"](callback);
        listeners.push([target, event, namespace, callback, remover]);
      });
    }
    function unbind(targets, events, callback) {
      forEachEvent(targets, events, function (target, event, namespace) {
        listeners = listeners.filter(function (listener) {
          if (listener[0] === target && listener[1] === event && listener[2] === namespace && (!callback || listener[3] === callback)) {
            listener[4]();
            return false;
          }
          return true;
        });
      });
    }
    function dispatch(target, type, detail) {
      var e;
      var bubbles = true;
      if (typeof CustomEvent === "function") {
        e = new CustomEvent(type, {
          bubbles: bubbles,
          detail: detail
        });
      } else {
        e = document.createEvent("CustomEvent");
        e.initCustomEvent(type, bubbles, false, detail);
      }
      target.dispatchEvent(e);
      return e;
    }
    function forEachEvent(targets, events, iteratee) {
      forEach$2(targets, function (target) {
        target && forEach$2(events, function (events2) {
          events2.split(" ").forEach(function (eventNS) {
            var fragment = eventNS.split(".");
            iteratee(target, fragment[0], fragment[1]);
          });
        });
      });
    }
    function destroy() {
      listeners.forEach(function (data) {
        data[4]();
      });
      empty$1(listeners);
    }
    return {
      bind: bind,
      unbind: unbind,
      dispatch: dispatch,
      destroy: destroy
    };
  }
  var EVENT_MOUNTED = "mounted";
  var EVENT_READY = "ready";
  var EVENT_MOVE$1 = "move";
  var EVENT_MOVED$1 = "moved";
  var EVENT_CLICK = "click";
  var EVENT_ACTIVE = "active";
  var EVENT_INACTIVE = "inactive";
  var EVENT_VISIBLE = "visible";
  var EVENT_HIDDEN = "hidden";
  var EVENT_REFRESH = "refresh";
  var EVENT_UPDATED$1 = "updated";
  var EVENT_RESIZE = "resize";
  var EVENT_RESIZED = "resized";
  var EVENT_DRAG$1 = "drag";
  var EVENT_DRAGGING = "dragging";
  var EVENT_DRAGGED$1 = "dragged";
  var EVENT_SCROLL$1 = "scroll";
  var EVENT_SCROLLED$1 = "scrolled";
  var EVENT_OVERFLOW = "overflow";
  var EVENT_DESTROY$1 = "destroy";
  var EVENT_ARROWS_MOUNTED = "arrows:mounted";
  var EVENT_ARROWS_UPDATED = "arrows:updated";
  var EVENT_PAGINATION_MOUNTED = "pagination:mounted";
  var EVENT_PAGINATION_UPDATED = "pagination:updated";
  var EVENT_NAVIGATION_MOUNTED = "navigation:mounted";
  var EVENT_AUTOPLAY_PLAY = "autoplay:play";
  var EVENT_AUTOPLAY_PLAYING = "autoplay:playing";
  var EVENT_AUTOPLAY_PAUSE = "autoplay:pause";
  var EVENT_LAZYLOAD_LOADED = "lazyload:loaded";
  var EVENT_SLIDE_KEYDOWN = "sk";
  var EVENT_SHIFTED = "sh";
  var EVENT_END_INDEX_CHANGED = "ei";
  function EventInterface$1(Splide2) {
    var bus = Splide2 ? Splide2.event.bus : document.createDocumentFragment();
    var binder = EventBinder$1();
    function on(events, callback) {
      binder.bind(bus, toArray$2(events).join(" "), function (e) {
        callback.apply(callback, isArray$2(e.detail) ? e.detail : []);
      });
    }
    function emit(event) {
      binder.dispatch(bus, event, slice$2(arguments, 1));
    }
    if (Splide2) {
      Splide2.event.on(EVENT_DESTROY$1, binder.destroy);
    }
    return assign$2(binder, {
      bus: bus,
      on: on,
      off: apply$2(binder.unbind, bus),
      emit: emit
    });
  }
  function RequestInterval$1(interval, onInterval, onUpdate, limit) {
    var now = Date.now;
    var startTime;
    var rate = 0;
    var id;
    var paused = true;
    var count = 0;
    function update() {
      if (!paused) {
        rate = interval ? min$2((now() - startTime) / interval, 1) : 1;
        onUpdate && onUpdate(rate);
        if (rate >= 1) {
          onInterval();
          startTime = now();
          if (limit && ++count >= limit) {
            return pause();
          }
        }
        id = raf$1(update);
      }
    }
    function start(resume) {
      resume || cancel();
      startTime = now() - (resume ? rate * interval : 0);
      paused = false;
      id = raf$1(update);
    }
    function pause() {
      paused = true;
    }
    function rewind() {
      startTime = now();
      rate = 0;
      if (onUpdate) {
        onUpdate(rate);
      }
    }
    function cancel() {
      id && cancelAnimationFrame(id);
      rate = 0;
      id = 0;
      paused = true;
    }
    function set(time) {
      interval = time;
    }
    function isPaused() {
      return paused;
    }
    return {
      start: start,
      rewind: rewind,
      pause: pause,
      cancel: cancel,
      set: set,
      isPaused: isPaused
    };
  }
  function State(initialState) {
    var state = initialState;
    function set(value) {
      state = value;
    }
    function is(states) {
      return includes(toArray$2(states), state);
    }
    return {
      set: set,
      is: is
    };
  }
  function Throttle$1(func, duration) {
    var interval = RequestInterval$1(duration || 0, func, null, 1);
    return function () {
      interval.isPaused() && interval.start();
    };
  }
  function Media(Splide2, Components2, options) {
    var state = Splide2.state;
    var breakpoints = options.breakpoints || {};
    var reducedMotion = options.reducedMotion || {};
    var binder = EventBinder$1();
    var queries = [];
    function setup() {
      var isMin = options.mediaQuery === "min";
      ownKeys$2(breakpoints).sort(function (n, m) {
        return isMin ? +n - +m : +m - +n;
      }).forEach(function (key) {
        register(breakpoints[key], "(" + (isMin ? "min" : "max") + "-width:" + key + "px)");
      });
      register(reducedMotion, MEDIA_PREFERS_REDUCED_MOTION);
      update();
    }
    function destroy(completely) {
      if (completely) {
        binder.destroy();
      }
    }
    function register(options2, query) {
      var queryList = matchMedia(query);
      binder.bind(queryList, "change", update);
      queries.push([options2, queryList]);
    }
    function update() {
      var destroyed = state.is(DESTROYED);
      var direction = options.direction;
      var merged = queries.reduce(function (merged2, entry) {
        return merge(merged2, entry[1].matches ? entry[0] : {});
      }, {});
      omit(options);
      set(merged);
      if (options.destroy) {
        Splide2.destroy(options.destroy === "completely");
      } else if (destroyed) {
        destroy(true);
        Splide2.mount();
      } else {
        direction !== options.direction && Splide2.refresh();
      }
    }
    function reduce(enable) {
      if (matchMedia(MEDIA_PREFERS_REDUCED_MOTION).matches) {
        enable ? merge(options, reducedMotion) : omit(options, ownKeys$2(reducedMotion));
      }
    }
    function set(opts, base, notify) {
      merge(options, opts);
      base && merge(Object.getPrototypeOf(options), opts);
      if (notify || !state.is(CREATED)) {
        Splide2.emit(EVENT_UPDATED$1, options);
      }
    }
    return {
      setup: setup,
      destroy: destroy,
      reduce: reduce,
      set: set
    };
  }
  var ARROW = "Arrow";
  var ARROW_LEFT = ARROW + "Left";
  var ARROW_RIGHT = ARROW + "Right";
  var ARROW_UP = ARROW + "Up";
  var ARROW_DOWN = ARROW + "Down";
  var RTL = "rtl";
  var TTB = "ttb";
  var ORIENTATION_MAP = {
    width: ["height"],
    left: ["top", "right"],
    right: ["bottom", "left"],
    x: ["y"],
    X: ["Y"],
    Y: ["X"],
    ArrowLeft: [ARROW_UP, ARROW_RIGHT],
    ArrowRight: [ARROW_DOWN, ARROW_LEFT]
  };
  function Direction(Splide2, Components2, options) {
    function resolve(prop, axisOnly, direction) {
      direction = direction || options.direction;
      var index = direction === RTL && !axisOnly ? 1 : direction === TTB ? 0 : -1;
      return ORIENTATION_MAP[prop] && ORIENTATION_MAP[prop][index] || prop.replace(/width|left|right/i, function (match, offset) {
        var replacement = ORIENTATION_MAP[match.toLowerCase()][index] || match;
        return offset > 0 ? replacement.charAt(0).toUpperCase() + replacement.slice(1) : replacement;
      });
    }
    function orient(value) {
      return value * (options.direction === RTL ? 1 : -1);
    }
    return {
      resolve: resolve,
      orient: orient
    };
  }
  var ROLE = "role";
  var TAB_INDEX = "tabindex";
  var DISABLED = "disabled";
  var ARIA_PREFIX = "aria-";
  var ARIA_CONTROLS = ARIA_PREFIX + "controls";
  var ARIA_CURRENT = ARIA_PREFIX + "current";
  var ARIA_SELECTED = ARIA_PREFIX + "selected";
  var ARIA_LABEL = ARIA_PREFIX + "label";
  var ARIA_LABELLEDBY = ARIA_PREFIX + "labelledby";
  var ARIA_HIDDEN = ARIA_PREFIX + "hidden";
  var ARIA_ORIENTATION = ARIA_PREFIX + "orientation";
  var ARIA_ROLEDESCRIPTION = ARIA_PREFIX + "roledescription";
  var ARIA_LIVE = ARIA_PREFIX + "live";
  var ARIA_BUSY = ARIA_PREFIX + "busy";
  var ARIA_ATOMIC = ARIA_PREFIX + "atomic";
  var ALL_ATTRIBUTES = [ROLE, TAB_INDEX, DISABLED, ARIA_CONTROLS, ARIA_CURRENT, ARIA_LABEL, ARIA_LABELLEDBY, ARIA_HIDDEN, ARIA_ORIENTATION, ARIA_ROLEDESCRIPTION];
  var CLASS_PREFIX = PROJECT_CODE + "__";
  var STATUS_CLASS_PREFIX = "is-";
  var CLASS_ROOT = PROJECT_CODE;
  var CLASS_TRACK = CLASS_PREFIX + "track";
  var CLASS_LIST = CLASS_PREFIX + "list";
  var CLASS_SLIDE = CLASS_PREFIX + "slide";
  var CLASS_CLONE = CLASS_SLIDE + "--clone";
  var CLASS_CONTAINER = CLASS_SLIDE + "__container";
  var CLASS_ARROWS = CLASS_PREFIX + "arrows";
  var CLASS_ARROW = CLASS_PREFIX + "arrow";
  var CLASS_ARROW_PREV = CLASS_ARROW + "--prev";
  var CLASS_ARROW_NEXT = CLASS_ARROW + "--next";
  var CLASS_PAGINATION = CLASS_PREFIX + "pagination";
  var CLASS_PAGINATION_PAGE = CLASS_PAGINATION + "__page";
  var CLASS_PROGRESS = CLASS_PREFIX + "progress";
  var CLASS_PROGRESS_BAR = CLASS_PROGRESS + "__bar";
  var CLASS_TOGGLE = CLASS_PREFIX + "toggle";
  var CLASS_SPINNER = CLASS_PREFIX + "spinner";
  var CLASS_SR = CLASS_PREFIX + "sr";
  var CLASS_INITIALIZED = STATUS_CLASS_PREFIX + "initialized";
  var CLASS_ACTIVE$1 = STATUS_CLASS_PREFIX + "active";
  var CLASS_PREV = STATUS_CLASS_PREFIX + "prev";
  var CLASS_NEXT = STATUS_CLASS_PREFIX + "next";
  var CLASS_VISIBLE = STATUS_CLASS_PREFIX + "visible";
  var CLASS_LOADING = STATUS_CLASS_PREFIX + "loading";
  var CLASS_FOCUS_IN = STATUS_CLASS_PREFIX + "focus-in";
  var CLASS_OVERFLOW = STATUS_CLASS_PREFIX + "overflow";
  var STATUS_CLASSES = [CLASS_ACTIVE$1, CLASS_VISIBLE, CLASS_PREV, CLASS_NEXT, CLASS_LOADING, CLASS_FOCUS_IN, CLASS_OVERFLOW];
  var CLASSES = {
    slide: CLASS_SLIDE,
    clone: CLASS_CLONE,
    arrows: CLASS_ARROWS,
    arrow: CLASS_ARROW,
    prev: CLASS_ARROW_PREV,
    next: CLASS_ARROW_NEXT,
    pagination: CLASS_PAGINATION,
    page: CLASS_PAGINATION_PAGE,
    spinner: CLASS_SPINNER
  };
  function closest(from, selector) {
    if (isFunction(from.closest)) {
      return from.closest(selector);
    }
    var elm = from;
    while (elm && elm.nodeType === 1) {
      if (matches(elm, selector)) {
        break;
      }
      elm = elm.parentElement;
    }
    return elm;
  }
  var FRICTION = 5;
  var LOG_INTERVAL = 200;
  var POINTER_DOWN_EVENTS = "touchstart mousedown";
  var POINTER_MOVE_EVENTS = "touchmove mousemove";
  var POINTER_UP_EVENTS = "touchend touchcancel mouseup click";
  function Elements(Splide2, Components2, options) {
    var _EventInterface = EventInterface$1(Splide2),
      on = _EventInterface.on,
      bind = _EventInterface.bind;
    var root = Splide2.root;
    var i18n = options.i18n;
    var elements = {};
    var slides = [];
    var rootClasses = [];
    var trackClasses = [];
    var track;
    var list;
    var isUsingKey;
    function setup() {
      collect();
      init();
      update();
    }
    function mount() {
      on(EVENT_REFRESH, destroy);
      on(EVENT_REFRESH, setup);
      on(EVENT_UPDATED$1, update);
      bind(document, POINTER_DOWN_EVENTS + " keydown", function (e) {
        isUsingKey = e.type === "keydown";
      }, {
        capture: true
      });
      bind(root, "focusin", function () {
        toggleClass$1(root, CLASS_FOCUS_IN, !!isUsingKey);
      });
    }
    function destroy(completely) {
      var attrs = ALL_ATTRIBUTES.concat("style");
      empty$1(slides);
      removeClass(root, rootClasses);
      removeClass(track, trackClasses);
      removeAttribute$1([track, list], attrs);
      removeAttribute$1(root, completely ? attrs : ["style", ARIA_ROLEDESCRIPTION]);
    }
    function update() {
      removeClass(root, rootClasses);
      removeClass(track, trackClasses);
      rootClasses = getClasses(CLASS_ROOT);
      trackClasses = getClasses(CLASS_TRACK);
      addClass(root, rootClasses);
      addClass(track, trackClasses);
      setAttribute$1(root, ARIA_LABEL, options.label);
      setAttribute$1(root, ARIA_LABELLEDBY, options.labelledby);
    }
    function collect() {
      track = find("." + CLASS_TRACK);
      list = child(track, "." + CLASS_LIST);
      assert(track && list, "A track/list element is missing.");
      push(slides, children(list, "." + CLASS_SLIDE + ":not(." + CLASS_CLONE + ")"));
      forOwn$2({
        arrows: CLASS_ARROWS,
        pagination: CLASS_PAGINATION,
        prev: CLASS_ARROW_PREV,
        next: CLASS_ARROW_NEXT,
        bar: CLASS_PROGRESS_BAR,
        toggle: CLASS_TOGGLE
      }, function (className, key) {
        elements[key] = find("." + className);
      });
      assign$2(elements, {
        root: root,
        track: track,
        list: list,
        slides: slides
      });
    }
    function init() {
      var id = root.id || uniqueId(PROJECT_CODE);
      var role = options.role;
      root.id = id;
      track.id = track.id || id + "-track";
      list.id = list.id || id + "-list";
      if (!getAttribute(root, ROLE) && root.tagName !== "SECTION" && role) {
        setAttribute$1(root, ROLE, role);
      }
      setAttribute$1(root, ARIA_ROLEDESCRIPTION, i18n.carousel);
      setAttribute$1(list, ROLE, "presentation");
    }
    function find(selector) {
      var elm = query(root, selector);
      return elm && closest(elm, "." + CLASS_ROOT) === root ? elm : void 0;
    }
    function getClasses(base) {
      return [base + "--" + options.type, base + "--" + options.direction, options.drag && base + "--draggable", options.isNavigation && base + "--nav", base === CLASS_ROOT && CLASS_ACTIVE$1];
    }
    return assign$2(elements, {
      setup: setup,
      mount: mount,
      destroy: destroy
    });
  }
  var SLIDE$1 = "slide";
  var LOOP = "loop";
  var FADE$1 = "fade";
  function Slide$1(Splide2, index, slideIndex, slide) {
    var event = EventInterface$1(Splide2);
    var on = event.on,
      emit = event.emit,
      bind = event.bind;
    var Components = Splide2.Components,
      root = Splide2.root,
      options = Splide2.options;
    var isNavigation = options.isNavigation,
      updateOnMove = options.updateOnMove,
      i18n = options.i18n,
      pagination = options.pagination,
      slideFocus = options.slideFocus;
    var resolve = Components.Direction.resolve;
    var styles = getAttribute(slide, "style");
    var label = getAttribute(slide, ARIA_LABEL);
    var isClone = slideIndex > -1;
    var container = child(slide, "." + CLASS_CONTAINER);
    var destroyed;
    function mount() {
      if (!isClone) {
        slide.id = root.id + "-slide" + pad(index + 1);
        setAttribute$1(slide, ROLE, pagination ? "tabpanel" : "group");
        setAttribute$1(slide, ARIA_ROLEDESCRIPTION, i18n.slide);
        setAttribute$1(slide, ARIA_LABEL, label || format(i18n.slideLabel, [index + 1, Splide2.length]));
      }
      listen();
    }
    function listen() {
      bind(slide, "click", apply$2(emit, EVENT_CLICK, self));
      bind(slide, "keydown", apply$2(emit, EVENT_SLIDE_KEYDOWN, self));
      on([EVENT_MOVED$1, EVENT_SHIFTED, EVENT_SCROLLED$1], update);
      on(EVENT_NAVIGATION_MOUNTED, initNavigation);
      if (updateOnMove) {
        on(EVENT_MOVE$1, onMove);
      }
    }
    function destroy() {
      destroyed = true;
      event.destroy();
      removeClass(slide, STATUS_CLASSES);
      removeAttribute$1(slide, ALL_ATTRIBUTES);
      setAttribute$1(slide, "style", styles);
      setAttribute$1(slide, ARIA_LABEL, label || "");
    }
    function initNavigation() {
      var controls = Splide2.splides.map(function (target) {
        var Slide2 = target.splide.Components.Slides.getAt(index);
        return Slide2 ? Slide2.slide.id : "";
      }).join(" ");
      setAttribute$1(slide, ARIA_LABEL, format(i18n.slideX, (isClone ? slideIndex : index) + 1));
      setAttribute$1(slide, ARIA_CONTROLS, controls);
      setAttribute$1(slide, ROLE, slideFocus ? "button" : "");
      slideFocus && removeAttribute$1(slide, ARIA_ROLEDESCRIPTION);
    }
    function onMove() {
      if (!destroyed) {
        update();
      }
    }
    function update() {
      if (!destroyed) {
        var curr = Splide2.index;
        updateActivity();
        updateVisibility();
        toggleClass$1(slide, CLASS_PREV, index === curr - 1);
        toggleClass$1(slide, CLASS_NEXT, index === curr + 1);
      }
    }
    function updateActivity() {
      var active = isActive();
      if (active !== hasClass(slide, CLASS_ACTIVE$1)) {
        toggleClass$1(slide, CLASS_ACTIVE$1, active);
        setAttribute$1(slide, ARIA_CURRENT, isNavigation && active || "");
        emit(active ? EVENT_ACTIVE : EVENT_INACTIVE, self);
      }
    }
    function updateVisibility() {
      var visible = isVisible();
      var hidden = !visible && (!isActive() || isClone);
      if (!Splide2.state.is([MOVING, SCROLLING])) {
        setAttribute$1(slide, ARIA_HIDDEN, hidden || "");
      }
      setAttribute$1(queryAll(slide, options.focusableNodes || ""), TAB_INDEX, hidden ? -1 : "");
      if (slideFocus) {
        setAttribute$1(slide, TAB_INDEX, hidden ? -1 : 0);
      }
      if (visible !== hasClass(slide, CLASS_VISIBLE)) {
        toggleClass$1(slide, CLASS_VISIBLE, visible);
        emit(visible ? EVENT_VISIBLE : EVENT_HIDDEN, self);
      }
      if (!visible && document.activeElement === slide) {
        var Slide2 = Components.Slides.getAt(Splide2.index);
        Slide2 && focus(Slide2.slide);
      }
    }
    function style$1(prop, value, useContainer) {
      style(useContainer && container || slide, prop, value);
    }
    function isActive() {
      var curr = Splide2.index;
      return curr === index || options.cloneStatus && curr === slideIndex;
    }
    function isVisible() {
      if (Splide2.is(FADE$1)) {
        return isActive();
      }
      var trackRect = rect(Components.Elements.track);
      var slideRect = rect(slide);
      var left = resolve("left", true);
      var right = resolve("right", true);
      return floor$1(trackRect[left]) <= ceil$1(slideRect[left]) && floor$1(slideRect[right]) <= ceil$1(trackRect[right]);
    }
    function isWithin(from, distance) {
      var diff = abs$1(from - index);
      if (!isClone && (options.rewind || Splide2.is(LOOP))) {
        diff = min$2(diff, Splide2.length - diff);
      }
      return diff <= distance;
    }
    var self = {
      index: index,
      slideIndex: slideIndex,
      slide: slide,
      container: container,
      isClone: isClone,
      mount: mount,
      destroy: destroy,
      update: update,
      style: style$1,
      isWithin: isWithin
    };
    return self;
  }
  function Slides(Splide2, Components2, options) {
    var _EventInterface2 = EventInterface$1(Splide2),
      on = _EventInterface2.on,
      emit = _EventInterface2.emit,
      bind = _EventInterface2.bind;
    var _Components2$Elements = Components2.Elements,
      slides = _Components2$Elements.slides,
      list = _Components2$Elements.list;
    var Slides2 = [];
    function mount() {
      init();
      on(EVENT_REFRESH, destroy);
      on(EVENT_REFRESH, init);
    }
    function init() {
      slides.forEach(function (slide, index) {
        register(slide, index, -1);
      });
    }
    function destroy() {
      forEach$1(function (Slide2) {
        Slide2.destroy();
      });
      empty$1(Slides2);
    }
    function update() {
      forEach$1(function (Slide2) {
        Slide2.update();
      });
    }
    function register(slide, index, slideIndex) {
      var object = Slide$1(Splide2, index, slideIndex, slide);
      object.mount();
      Slides2.push(object);
      Slides2.sort(function (Slide1, Slide2) {
        return Slide1.index - Slide2.index;
      });
    }
    function get(excludeClones) {
      return excludeClones ? filter(function (Slide2) {
        return !Slide2.isClone;
      }) : Slides2;
    }
    function getIn(page) {
      var Controller = Components2.Controller;
      var index = Controller.toIndex(page);
      var max = Controller.hasFocus() ? 1 : options.perPage;
      return filter(function (Slide2) {
        return between(Slide2.index, index, index + max - 1);
      });
    }
    function getAt(index) {
      return filter(index)[0];
    }
    function add(items, index) {
      forEach$2(items, function (slide) {
        if (isString(slide)) {
          slide = parseHtml(slide);
        }
        if (isHTMLElement(slide)) {
          var ref = slides[index];
          ref ? before(slide, ref) : append(list, slide);
          addClass(slide, options.classes.slide);
          observeImages(slide, apply$2(emit, EVENT_RESIZE));
        }
      });
      emit(EVENT_REFRESH);
    }
    function remove$1(matcher) {
      remove(filter(matcher).map(function (Slide2) {
        return Slide2.slide;
      }));
      emit(EVENT_REFRESH);
    }
    function forEach$1(iteratee, excludeClones) {
      get(excludeClones).forEach(iteratee);
    }
    function filter(matcher) {
      return Slides2.filter(isFunction(matcher) ? matcher : function (Slide2) {
        return isString(matcher) ? matches(Slide2.slide, matcher) : includes(toArray$2(matcher), Slide2.index);
      });
    }
    function style(prop, value, useContainer) {
      forEach$1(function (Slide2) {
        Slide2.style(prop, value, useContainer);
      });
    }
    function observeImages(elm, callback) {
      var images = queryAll(elm, "img");
      var length = images.length;
      if (length) {
        images.forEach(function (img) {
          bind(img, "load error", function () {
            if (! --length) {
              callback();
            }
          });
        });
      } else {
        callback();
      }
    }
    function getLength(excludeClones) {
      return excludeClones ? slides.length : Slides2.length;
    }
    function isEnough() {
      return Slides2.length > options.perPage;
    }
    return {
      mount: mount,
      destroy: destroy,
      update: update,
      register: register,
      get: get,
      getIn: getIn,
      getAt: getAt,
      add: add,
      remove: remove$1,
      forEach: forEach$1,
      filter: filter,
      style: style,
      getLength: getLength,
      isEnough: isEnough
    };
  }
  function Layout(Splide2, Components2, options) {
    var _EventInterface3 = EventInterface$1(Splide2),
      on = _EventInterface3.on,
      bind = _EventInterface3.bind,
      emit = _EventInterface3.emit;
    var Slides = Components2.Slides;
    var resolve = Components2.Direction.resolve;
    var _Components2$Elements2 = Components2.Elements,
      root = _Components2$Elements2.root,
      track = _Components2$Elements2.track,
      list = _Components2$Elements2.list;
    var getAt = Slides.getAt,
      styleSlides = Slides.style;
    var vertical;
    var rootRect;
    var overflow;
    function mount() {
      init();
      bind(window, "resize load", Throttle$1(apply$2(emit, EVENT_RESIZE)));
      on([EVENT_UPDATED$1, EVENT_REFRESH], init);
      on(EVENT_RESIZE, resize);
    }
    function init() {
      vertical = options.direction === TTB;
      style(root, "maxWidth", unit(options.width));
      style(track, resolve("paddingLeft"), cssPadding(false));
      style(track, resolve("paddingRight"), cssPadding(true));
      resize(true);
    }
    function resize(force) {
      var newRect = rect(root);
      if (force || rootRect.width !== newRect.width || rootRect.height !== newRect.height) {
        style(track, "height", cssTrackHeight());
        styleSlides(resolve("marginRight"), unit(options.gap));
        styleSlides("width", cssSlideWidth());
        styleSlides("height", cssSlideHeight(), true);
        rootRect = newRect;
        emit(EVENT_RESIZED);
        if (overflow !== (overflow = isOverflow())) {
          toggleClass$1(root, CLASS_OVERFLOW, overflow);
          emit(EVENT_OVERFLOW, overflow);
        }
      }
    }
    function cssPadding(right) {
      var padding = options.padding;
      var prop = resolve(right ? "right" : "left");
      return padding && unit(padding[prop] || (isObject$1(padding) ? 0 : padding)) || "0px";
    }
    function cssTrackHeight() {
      var height = "";
      if (vertical) {
        height = cssHeight();
        assert(height, "height or heightRatio is missing.");
        height = "calc(" + height + " - " + cssPadding(false) + " - " + cssPadding(true) + ")";
      }
      return height;
    }
    function cssHeight() {
      return unit(options.height || rect(list).width * options.heightRatio);
    }
    function cssSlideWidth() {
      return options.autoWidth ? null : unit(options.fixedWidth) || (vertical ? "" : cssSlideSize());
    }
    function cssSlideHeight() {
      return unit(options.fixedHeight) || (vertical ? options.autoHeight ? null : cssSlideSize() : cssHeight());
    }
    function cssSlideSize() {
      var gap = unit(options.gap);
      return "calc((100%" + (gap && " + " + gap) + ")/" + (options.perPage || 1) + (gap && " - " + gap) + ")";
    }
    function listSize() {
      return rect(list)[resolve("width")];
    }
    function slideSize(index, withoutGap) {
      var Slide = getAt(index || 0);
      return Slide ? rect(Slide.slide)[resolve("width")] + (withoutGap ? 0 : getGap()) : 0;
    }
    function totalSize(index, withoutGap) {
      var Slide = getAt(index);
      if (Slide) {
        var right = rect(Slide.slide)[resolve("right")];
        var left = rect(list)[resolve("left")];
        return abs$1(right - left) + (withoutGap ? 0 : getGap());
      }
      return 0;
    }
    function sliderSize(withoutGap) {
      return totalSize(Splide2.length - 1) - totalSize(0) + slideSize(0, withoutGap);
    }
    function getGap() {
      var Slide = getAt(0);
      return Slide && parseFloat(style(Slide.slide, resolve("marginRight"))) || 0;
    }
    function getPadding(right) {
      return parseFloat(style(track, resolve("padding" + (right ? "Right" : "Left")))) || 0;
    }
    function isOverflow() {
      return Splide2.is(FADE$1) || sliderSize(true) > listSize();
    }
    return {
      mount: mount,
      resize: resize,
      listSize: listSize,
      slideSize: slideSize,
      sliderSize: sliderSize,
      totalSize: totalSize,
      getPadding: getPadding,
      isOverflow: isOverflow
    };
  }
  var MULTIPLIER = 2;
  function Clones(Splide2, Components2, options) {
    var event = EventInterface$1(Splide2);
    var on = event.on;
    var Elements = Components2.Elements,
      Slides = Components2.Slides;
    var resolve = Components2.Direction.resolve;
    var clones = [];
    var cloneCount;
    function mount() {
      on(EVENT_REFRESH, remount);
      on([EVENT_UPDATED$1, EVENT_RESIZE], observe);
      if (cloneCount = computeCloneCount()) {
        generate(cloneCount);
        Components2.Layout.resize(true);
      }
    }
    function remount() {
      destroy();
      mount();
    }
    function destroy() {
      remove(clones);
      empty$1(clones);
      event.destroy();
    }
    function observe() {
      var count = computeCloneCount();
      if (cloneCount !== count) {
        if (cloneCount < count || !count) {
          event.emit(EVENT_REFRESH);
        }
      }
    }
    function generate(count) {
      var slides = Slides.get().slice();
      var length = slides.length;
      if (length) {
        while (slides.length < count) {
          push(slides, slides);
        }
        push(slides.slice(-count), slides.slice(0, count)).forEach(function (Slide, index) {
          var isHead = index < count;
          var clone = cloneDeep(Slide.slide, index);
          isHead ? before(clone, slides[0].slide) : append(Elements.list, clone);
          push(clones, clone);
          Slides.register(clone, index - count + (isHead ? 0 : length), Slide.index);
        });
      }
    }
    function cloneDeep(elm, index) {
      var clone = elm.cloneNode(true);
      addClass(clone, options.classes.clone);
      clone.id = Splide2.root.id + "-clone" + pad(index + 1);
      return clone;
    }
    function computeCloneCount() {
      var clones2 = options.clones;
      if (!Splide2.is(LOOP)) {
        clones2 = 0;
      } else if (isUndefined$1(clones2)) {
        var fixedSize = options[resolve("fixedWidth")] && Components2.Layout.slideSize(0);
        var fixedCount = fixedSize && ceil$1(rect(Elements.track)[resolve("width")] / fixedSize);
        clones2 = fixedCount || options[resolve("autoWidth")] && Splide2.length || options.perPage * MULTIPLIER;
      }
      return clones2;
    }
    return {
      mount: mount,
      destroy: destroy
    };
  }
  function Move(Splide2, Components2, options) {
    var _EventInterface4 = EventInterface$1(Splide2),
      on = _EventInterface4.on,
      emit = _EventInterface4.emit;
    var set = Splide2.state.set;
    var _Components2$Layout = Components2.Layout,
      slideSize = _Components2$Layout.slideSize,
      getPadding = _Components2$Layout.getPadding,
      totalSize = _Components2$Layout.totalSize,
      listSize = _Components2$Layout.listSize,
      sliderSize = _Components2$Layout.sliderSize;
    var _Components2$Directio = Components2.Direction,
      resolve = _Components2$Directio.resolve,
      orient = _Components2$Directio.orient;
    var _Components2$Elements3 = Components2.Elements,
      list = _Components2$Elements3.list,
      track = _Components2$Elements3.track;
    var Transition;
    function mount() {
      Transition = Components2.Transition;
      on([EVENT_MOUNTED, EVENT_RESIZED, EVENT_UPDATED$1, EVENT_REFRESH], reposition);
    }
    function reposition() {
      if (!Components2.Controller.isBusy()) {
        Components2.Scroll.cancel();
        jump(Splide2.index);
        Components2.Slides.update();
      }
    }
    function move(dest, index, prev, callback) {
      if (dest !== index && canShift(dest > prev)) {
        cancel();
        translate(shift(getPosition(), dest > prev), true);
      }
      set(MOVING);
      emit(EVENT_MOVE$1, index, prev, dest);
      Transition.start(index, function () {
        set(IDLE);
        emit(EVENT_MOVED$1, index, prev, dest);
        callback && callback();
      });
    }
    function jump(index) {
      translate(toPosition(index, true));
    }
    function translate(position, preventLoop) {
      if (!Splide2.is(FADE$1)) {
        var destination = preventLoop ? position : loop(position);
        style(list, "transform", "translate" + resolve("X") + "(" + destination + "px)");
        position !== destination && emit(EVENT_SHIFTED);
      }
    }
    function loop(position) {
      if (Splide2.is(LOOP)) {
        var index = toIndex(position);
        var exceededMax = index > Components2.Controller.getEnd();
        var exceededMin = index < 0;
        if (exceededMin || exceededMax) {
          position = shift(position, exceededMax);
        }
      }
      return position;
    }
    function shift(position, backwards) {
      var excess = position - getLimit(backwards);
      var size = sliderSize();
      position -= orient(size * (ceil$1(abs$1(excess) / size) || 1)) * (backwards ? 1 : -1);
      return position;
    }
    function cancel() {
      translate(getPosition(), true);
      Transition.cancel();
    }
    function toIndex(position) {
      var Slides = Components2.Slides.get();
      var index = 0;
      var minDistance = Infinity;
      for (var i = 0; i < Slides.length; i++) {
        var slideIndex = Slides[i].index;
        var distance = abs$1(toPosition(slideIndex, true) - position);
        if (distance <= minDistance) {
          minDistance = distance;
          index = slideIndex;
        } else {
          break;
        }
      }
      return index;
    }
    function toPosition(index, trimming) {
      var position = orient(totalSize(index - 1) - offset(index));
      return trimming ? trim(position) : position;
    }
    function getPosition() {
      var left = resolve("left");
      return rect(list)[left] - rect(track)[left] + orient(getPadding(false));
    }
    function trim(position) {
      if (options.trimSpace && Splide2.is(SLIDE$1)) {
        position = clamp$1(position, 0, orient(sliderSize(true) - listSize()));
      }
      return position;
    }
    function offset(index) {
      var focus = options.focus;
      return focus === "center" ? (listSize() - slideSize(index, true)) / 2 : +focus * slideSize(index) || 0;
    }
    function getLimit(max) {
      return toPosition(max ? Components2.Controller.getEnd() : 0, !!options.trimSpace);
    }
    function canShift(backwards) {
      var shifted = orient(shift(getPosition(), backwards));
      return backwards ? shifted >= 0 : shifted <= list[resolve("scrollWidth")] - rect(track)[resolve("width")];
    }
    function exceededLimit(max, position) {
      position = isUndefined$1(position) ? getPosition() : position;
      var exceededMin = max !== true && orient(position) < orient(getLimit(false));
      var exceededMax = max !== false && orient(position) > orient(getLimit(true));
      return exceededMin || exceededMax;
    }
    return {
      mount: mount,
      move: move,
      jump: jump,
      translate: translate,
      shift: shift,
      cancel: cancel,
      toIndex: toIndex,
      toPosition: toPosition,
      getPosition: getPosition,
      getLimit: getLimit,
      exceededLimit: exceededLimit,
      reposition: reposition
    };
  }
  function Controller(Splide2, Components2, options) {
    var _EventInterface5 = EventInterface$1(Splide2),
      on = _EventInterface5.on,
      emit = _EventInterface5.emit;
    var Move = Components2.Move;
    var getPosition = Move.getPosition,
      getLimit = Move.getLimit,
      toPosition = Move.toPosition;
    var _Components2$Slides = Components2.Slides,
      isEnough = _Components2$Slides.isEnough,
      getLength = _Components2$Slides.getLength;
    var omitEnd = options.omitEnd;
    var isLoop = Splide2.is(LOOP);
    var isSlide = Splide2.is(SLIDE$1);
    var getNext = apply$2(getAdjacent, false);
    var getPrev = apply$2(getAdjacent, true);
    var currIndex = options.start || 0;
    var endIndex;
    var prevIndex = currIndex;
    var slideCount;
    var perMove;
    var perPage;
    function mount() {
      init();
      on([EVENT_UPDATED$1, EVENT_REFRESH, EVENT_END_INDEX_CHANGED], init);
      on(EVENT_RESIZED, onResized);
    }
    function init() {
      slideCount = getLength(true);
      perMove = options.perMove;
      perPage = options.perPage;
      endIndex = getEnd();
      var index = clamp$1(currIndex, 0, omitEnd ? endIndex : slideCount - 1);
      if (index !== currIndex) {
        currIndex = index;
        Move.reposition();
      }
    }
    function onResized() {
      if (endIndex !== getEnd()) {
        emit(EVENT_END_INDEX_CHANGED);
      }
    }
    function go(control, allowSameIndex, callback) {
      if (!isBusy()) {
        var dest = parse(control);
        var index = loop(dest);
        if (index > -1 && (allowSameIndex || index !== currIndex)) {
          setIndex(index);
          Move.move(dest, index, prevIndex, callback);
        }
      }
    }
    function scroll(destination, duration, snap, callback) {
      Components2.Scroll.scroll(destination, duration, snap, function () {
        var index = loop(Move.toIndex(getPosition()));
        setIndex(omitEnd ? min$2(index, endIndex) : index);
        callback && callback();
      });
    }
    function parse(control) {
      var index = currIndex;
      if (isString(control)) {
        var _ref = control.match(/([+\-<>])(\d+)?/) || [],
          indicator = _ref[1],
          number = _ref[2];
        if (indicator === "+" || indicator === "-") {
          index = computeDestIndex(currIndex + +("" + indicator + (+number || 1)), currIndex);
        } else if (indicator === ">") {
          index = number ? toIndex(+number) : getNext(true);
        } else if (indicator === "<") {
          index = getPrev(true);
        }
      } else {
        index = isLoop ? control : clamp$1(control, 0, endIndex);
      }
      return index;
    }
    function getAdjacent(prev, destination) {
      var number = perMove || (hasFocus() ? 1 : perPage);
      var dest = computeDestIndex(currIndex + number * (prev ? -1 : 1), currIndex, !(perMove || hasFocus()));
      if (dest === -1 && isSlide) {
        if (!approximatelyEqual(getPosition(), getLimit(!prev), 1)) {
          return prev ? 0 : endIndex;
        }
      }
      return destination ? dest : loop(dest);
    }
    function computeDestIndex(dest, from, snapPage) {
      if (isEnough() || hasFocus()) {
        var index = computeMovableDestIndex(dest);
        if (index !== dest) {
          from = dest;
          dest = index;
          snapPage = false;
        }
        if (dest < 0 || dest > endIndex) {
          if (!perMove && (between(0, dest, from, true) || between(endIndex, from, dest, true))) {
            dest = toIndex(toPage(dest));
          } else {
            if (isLoop) {
              dest = snapPage ? dest < 0 ? -(slideCount % perPage || perPage) : slideCount : dest;
            } else if (options.rewind) {
              dest = dest < 0 ? endIndex : 0;
            } else {
              dest = -1;
            }
          }
        } else {
          if (snapPage && dest !== from) {
            dest = toIndex(toPage(from) + (dest < from ? -1 : 1));
          }
        }
      } else {
        dest = -1;
      }
      return dest;
    }
    function computeMovableDestIndex(dest) {
      if (isSlide && options.trimSpace === "move" && dest !== currIndex) {
        var position = getPosition();
        while (position === toPosition(dest, true) && between(dest, 0, Splide2.length - 1, !options.rewind)) {
          dest < currIndex ? --dest : ++dest;
        }
      }
      return dest;
    }
    function loop(index) {
      return isLoop ? (index + slideCount) % slideCount || 0 : index;
    }
    function getEnd() {
      var end = slideCount - (hasFocus() || isLoop && perMove ? 1 : perPage);
      while (omitEnd && end-- > 0) {
        if (toPosition(slideCount - 1, true) !== toPosition(end, true)) {
          end++;
          break;
        }
      }
      return clamp$1(end, 0, slideCount - 1);
    }
    function toIndex(page) {
      return clamp$1(hasFocus() ? page : perPage * page, 0, endIndex);
    }
    function toPage(index) {
      return hasFocus() ? min$2(index, endIndex) : floor$1((index >= endIndex ? slideCount - 1 : index) / perPage);
    }
    function toDest(destination) {
      var closest = Move.toIndex(destination);
      return isSlide ? clamp$1(closest, 0, endIndex) : closest;
    }
    function setIndex(index) {
      if (index !== currIndex) {
        prevIndex = currIndex;
        currIndex = index;
      }
    }
    function getIndex(prev) {
      return prev ? prevIndex : currIndex;
    }
    function hasFocus() {
      return !isUndefined$1(options.focus) || options.isNavigation;
    }
    function isBusy() {
      return Splide2.state.is([MOVING, SCROLLING]) && !!options.waitForTransition;
    }
    return {
      mount: mount,
      go: go,
      scroll: scroll,
      getNext: getNext,
      getPrev: getPrev,
      getAdjacent: getAdjacent,
      getEnd: getEnd,
      setIndex: setIndex,
      getIndex: getIndex,
      toIndex: toIndex,
      toPage: toPage,
      toDest: toDest,
      hasFocus: hasFocus,
      isBusy: isBusy
    };
  }
  var XML_NAME_SPACE = "http://www.w3.org/2000/svg";
  var PATH = "m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z";
  var SIZE = 40;
  function Arrows(Splide2, Components2, options) {
    var event = EventInterface$1(Splide2);
    var on = event.on,
      bind = event.bind,
      emit = event.emit;
    var classes = options.classes,
      i18n = options.i18n;
    var Elements = Components2.Elements,
      Controller = Components2.Controller;
    var placeholder = Elements.arrows,
      track = Elements.track;
    var wrapper = placeholder;
    var prev = Elements.prev;
    var next = Elements.next;
    var created;
    var wrapperClasses;
    var arrows = {};
    function mount() {
      init();
      on(EVENT_UPDATED$1, remount);
    }
    function remount() {
      destroy();
      mount();
    }
    function init() {
      var enabled = options.arrows;
      if (enabled && !(prev && next)) {
        createArrows();
      }
      if (prev && next) {
        assign$2(arrows, {
          prev: prev,
          next: next
        });
        display(wrapper, enabled ? "" : "none");
        addClass(wrapper, wrapperClasses = CLASS_ARROWS + "--" + options.direction);
        if (enabled) {
          listen();
          update();
          setAttribute$1([prev, next], ARIA_CONTROLS, track.id);
          emit(EVENT_ARROWS_MOUNTED, prev, next);
        }
      }
    }
    function destroy() {
      event.destroy();
      removeClass(wrapper, wrapperClasses);
      if (created) {
        remove(placeholder ? [prev, next] : wrapper);
        prev = next = null;
      } else {
        removeAttribute$1([prev, next], ALL_ATTRIBUTES);
      }
    }
    function listen() {
      on([EVENT_MOUNTED, EVENT_MOVED$1, EVENT_REFRESH, EVENT_SCROLLED$1, EVENT_END_INDEX_CHANGED], update);
      bind(next, "click", apply$2(go, ">"));
      bind(prev, "click", apply$2(go, "<"));
    }
    function go(control) {
      Controller.go(control, true);
    }
    function createArrows() {
      wrapper = placeholder || create("div", classes.arrows);
      prev = createArrow(true);
      next = createArrow(false);
      created = true;
      append(wrapper, [prev, next]);
      !placeholder && before(wrapper, track);
    }
    function createArrow(prev2) {
      var arrow = "<button class=\"" + classes.arrow + " " + (prev2 ? classes.prev : classes.next) + "\" type=\"button\"><svg xmlns=\"" + XML_NAME_SPACE + "\" viewBox=\"0 0 " + SIZE + " " + SIZE + "\" width=\"" + SIZE + "\" height=\"" + SIZE + "\" focusable=\"false\"><path d=\"" + (options.arrowPath || PATH) + "\" />";
      return parseHtml(arrow);
    }
    function update() {
      if (prev && next) {
        var index = Splide2.index;
        var prevIndex = Controller.getPrev();
        var nextIndex = Controller.getNext();
        var prevLabel = prevIndex > -1 && index < prevIndex ? i18n.last : i18n.prev;
        var nextLabel = nextIndex > -1 && index > nextIndex ? i18n.first : i18n.next;
        prev.disabled = prevIndex < 0;
        next.disabled = nextIndex < 0;
        setAttribute$1(prev, ARIA_LABEL, prevLabel);
        setAttribute$1(next, ARIA_LABEL, nextLabel);
        emit(EVENT_ARROWS_UPDATED, prev, next, prevIndex, nextIndex);
      }
    }
    return {
      arrows: arrows,
      mount: mount,
      destroy: destroy,
      update: update
    };
  }
  var INTERVAL_DATA_ATTRIBUTE = DATA_ATTRIBUTE + "-interval";
  function Autoplay(Splide2, Components2, options) {
    var _EventInterface6 = EventInterface$1(Splide2),
      on = _EventInterface6.on,
      bind = _EventInterface6.bind,
      emit = _EventInterface6.emit;
    var interval = RequestInterval$1(options.interval, Splide2.go.bind(Splide2, ">"), onAnimationFrame);
    var isPaused = interval.isPaused;
    var Elements = Components2.Elements,
      _Components2$Elements4 = Components2.Elements,
      root = _Components2$Elements4.root,
      toggle = _Components2$Elements4.toggle;
    var autoplay = options.autoplay;
    var hovered;
    var focused;
    var stopped = autoplay === "pause";
    function mount() {
      if (autoplay) {
        listen();
        toggle && setAttribute$1(toggle, ARIA_CONTROLS, Elements.track.id);
        stopped || play();
        update();
      }
    }
    function listen() {
      if (options.pauseOnHover) {
        bind(root, "mouseenter mouseleave", function (e) {
          hovered = e.type === "mouseenter";
          autoToggle();
        });
      }
      if (options.pauseOnFocus) {
        bind(root, "focusin focusout", function (e) {
          focused = e.type === "focusin";
          autoToggle();
        });
      }
      if (toggle) {
        bind(toggle, "click", function () {
          stopped ? play() : pause(true);
        });
      }
      on([EVENT_MOVE$1, EVENT_SCROLL$1, EVENT_REFRESH], interval.rewind);
      on(EVENT_MOVE$1, onMove);
    }
    function play() {
      if (isPaused() && Components2.Slides.isEnough()) {
        interval.start(!options.resetProgress);
        focused = hovered = stopped = false;
        update();
        emit(EVENT_AUTOPLAY_PLAY);
      }
    }
    function pause(stop) {
      if (stop === void 0) {
        stop = true;
      }
      stopped = !!stop;
      update();
      if (!isPaused()) {
        interval.pause();
        emit(EVENT_AUTOPLAY_PAUSE);
      }
    }
    function autoToggle() {
      if (!stopped) {
        hovered || focused ? pause(false) : play();
      }
    }
    function update() {
      if (toggle) {
        toggleClass$1(toggle, CLASS_ACTIVE$1, !stopped);
        setAttribute$1(toggle, ARIA_LABEL, options.i18n[stopped ? "play" : "pause"]);
      }
    }
    function onAnimationFrame(rate) {
      var bar = Elements.bar;
      bar && style(bar, "width", rate * 100 + "%");
      emit(EVENT_AUTOPLAY_PLAYING, rate);
    }
    function onMove(index) {
      var Slide = Components2.Slides.getAt(index);
      interval.set(Slide && +getAttribute(Slide.slide, INTERVAL_DATA_ATTRIBUTE) || options.interval);
    }
    return {
      mount: mount,
      destroy: interval.cancel,
      play: play,
      pause: pause,
      isPaused: isPaused
    };
  }
  function Cover(Splide2, Components2, options) {
    var _EventInterface7 = EventInterface$1(Splide2),
      on = _EventInterface7.on;
    function mount() {
      if (options.cover) {
        on(EVENT_LAZYLOAD_LOADED, apply$2(toggle, true));
        on([EVENT_MOUNTED, EVENT_UPDATED$1, EVENT_REFRESH], apply$2(cover, true));
      }
    }
    function cover(cover2) {
      Components2.Slides.forEach(function (Slide) {
        var img = child(Slide.container || Slide.slide, "img");
        if (img && img.src) {
          toggle(cover2, img, Slide);
        }
      });
    }
    function toggle(cover2, img, Slide) {
      Slide.style("background", cover2 ? "center/cover no-repeat url(\"" + img.src + "\")" : "", true);
      display(img, cover2 ? "none" : "");
    }
    return {
      mount: mount,
      destroy: apply$2(cover, false)
    };
  }
  var BOUNCE_DIFF_THRESHOLD = 10;
  var BOUNCE_DURATION = 600;
  var FRICTION_FACTOR = 0.6;
  var BASE_VELOCITY = 1.5;
  var MIN_DURATION = 800;
  function Scroll(Splide2, Components2, options) {
    var _EventInterface8 = EventInterface$1(Splide2),
      on = _EventInterface8.on,
      emit = _EventInterface8.emit;
    var set = Splide2.state.set;
    var Move = Components2.Move;
    var getPosition = Move.getPosition,
      getLimit = Move.getLimit,
      exceededLimit = Move.exceededLimit,
      translate = Move.translate;
    var isSlide = Splide2.is(SLIDE$1);
    var interval;
    var callback;
    var friction = 1;
    function mount() {
      on(EVENT_MOVE$1, clear);
      on([EVENT_UPDATED$1, EVENT_REFRESH], cancel);
    }
    function scroll(destination, duration, snap, onScrolled, noConstrain) {
      var from = getPosition();
      clear();
      if (snap && (!isSlide || !exceededLimit())) {
        var size = Components2.Layout.sliderSize();
        var offset = sign(destination) * size * floor$1(abs$1(destination) / size) || 0;
        destination = Move.toPosition(Components2.Controller.toDest(destination % size)) + offset;
      }
      var noDistance = approximatelyEqual(from, destination, 1);
      friction = 1;
      duration = noDistance ? 0 : duration || max$1(abs$1(destination - from) / BASE_VELOCITY, MIN_DURATION);
      callback = onScrolled;
      interval = RequestInterval$1(duration, onEnd, apply$2(update, from, destination, noConstrain), 1);
      set(SCROLLING);
      emit(EVENT_SCROLL$1);
      interval.start();
    }
    function onEnd() {
      set(IDLE);
      callback && callback();
      emit(EVENT_SCROLLED$1);
    }
    function update(from, to, noConstrain, rate) {
      var position = getPosition();
      var target = from + (to - from) * easing(rate);
      var diff = (target - position) * friction;
      translate(position + diff);
      if (isSlide && !noConstrain && exceededLimit()) {
        friction *= FRICTION_FACTOR;
        if (abs$1(diff) < BOUNCE_DIFF_THRESHOLD) {
          scroll(getLimit(exceededLimit(true)), BOUNCE_DURATION, false, callback, true);
        }
      }
    }
    function clear() {
      if (interval) {
        interval.cancel();
      }
    }
    function cancel() {
      if (interval && !interval.isPaused()) {
        clear();
        onEnd();
      }
    }
    function easing(t) {
      var easingFunc = options.easingFunc;
      return easingFunc ? easingFunc(t) : 1 - Math.pow(1 - t, 4);
    }
    return {
      mount: mount,
      destroy: clear,
      scroll: scroll,
      cancel: cancel
    };
  }
  var SCROLL_LISTENER_OPTIONS = {
    passive: false,
    capture: true
  };
  function Drag(Splide2, Components2, options) {
    var _EventInterface9 = EventInterface$1(Splide2),
      on = _EventInterface9.on,
      emit = _EventInterface9.emit,
      bind = _EventInterface9.bind,
      unbind = _EventInterface9.unbind;
    var state = Splide2.state;
    var Move = Components2.Move,
      Scroll = Components2.Scroll,
      Controller = Components2.Controller,
      track = Components2.Elements.track,
      reduce = Components2.Media.reduce;
    var _Components2$Directio2 = Components2.Direction,
      resolve = _Components2$Directio2.resolve,
      orient = _Components2$Directio2.orient;
    var getPosition = Move.getPosition,
      exceededLimit = Move.exceededLimit;
    var basePosition;
    var baseEvent;
    var prevBaseEvent;
    var isFree;
    var dragging;
    var exceeded = false;
    var clickPrevented;
    var disabled;
    var target;
    function mount() {
      bind(track, POINTER_MOVE_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
      bind(track, POINTER_UP_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
      bind(track, POINTER_DOWN_EVENTS, onPointerDown, SCROLL_LISTENER_OPTIONS);
      bind(track, "click", onClick, {
        capture: true
      });
      bind(track, "dragstart", prevent);
      on([EVENT_MOUNTED, EVENT_UPDATED$1], init);
    }
    function init() {
      var drag = options.drag;
      disable(!drag);
      isFree = drag === "free";
    }
    function onPointerDown(e) {
      clickPrevented = false;
      if (!disabled) {
        var isTouch = isTouchEvent(e);
        if (isDraggable(e.target) && (isTouch || !e.button)) {
          if (!Controller.isBusy()) {
            target = isTouch ? track : window;
            dragging = state.is([MOVING, SCROLLING]);
            prevBaseEvent = null;
            bind(target, POINTER_MOVE_EVENTS, onPointerMove, SCROLL_LISTENER_OPTIONS);
            bind(target, POINTER_UP_EVENTS, onPointerUp, SCROLL_LISTENER_OPTIONS);
            Move.cancel();
            Scroll.cancel();
            save(e);
          } else {
            prevent(e, true);
          }
        }
      }
    }
    function onPointerMove(e) {
      if (!state.is(DRAGGING)) {
        state.set(DRAGGING);
        emit(EVENT_DRAG$1);
      }
      if (e.cancelable) {
        if (dragging) {
          Move.translate(basePosition + constrain(diffCoord(e)));
          var expired = diffTime(e) > LOG_INTERVAL;
          var hasExceeded = exceeded !== (exceeded = exceededLimit());
          if (expired || hasExceeded) {
            save(e);
          }
          clickPrevented = true;
          emit(EVENT_DRAGGING);
          prevent(e);
        } else if (isSliderDirection(e)) {
          dragging = shouldStart(e);
          prevent(e);
        }
      }
    }
    function onPointerUp(e) {
      if (state.is(DRAGGING)) {
        state.set(IDLE);
        emit(EVENT_DRAGGED$1);
      }
      if (dragging) {
        move(e);
        prevent(e);
      }
      unbind(target, POINTER_MOVE_EVENTS, onPointerMove);
      unbind(target, POINTER_UP_EVENTS, onPointerUp);
      dragging = false;
    }
    function onClick(e) {
      if (!disabled && clickPrevented) {
        prevent(e, true);
      }
    }
    function save(e) {
      prevBaseEvent = baseEvent;
      baseEvent = e;
      basePosition = getPosition();
    }
    function move(e) {
      var velocity = computeVelocity(e);
      var destination = computeDestination(velocity);
      var rewind = options.rewind && options.rewindByDrag;
      reduce(false);
      if (isFree) {
        Controller.scroll(destination, 0, options.snap);
      } else if (Splide2.is(FADE$1)) {
        Controller.go(orient(sign(velocity)) < 0 ? rewind ? "<" : "-" : rewind ? ">" : "+");
      } else if (Splide2.is(SLIDE$1) && exceeded && rewind) {
        Controller.go(exceededLimit(true) ? ">" : "<");
      } else {
        Controller.go(Controller.toDest(destination), true);
      }
      reduce(true);
    }
    function shouldStart(e) {
      var thresholds = options.dragMinThreshold;
      var isObj = isObject$1(thresholds);
      var mouse = isObj && thresholds.mouse || 0;
      var touch = (isObj ? thresholds.touch : +thresholds) || 10;
      return abs$1(diffCoord(e)) > (isTouchEvent(e) ? touch : mouse);
    }
    function isSliderDirection(e) {
      return abs$1(diffCoord(e)) > abs$1(diffCoord(e, true));
    }
    function computeVelocity(e) {
      if (Splide2.is(LOOP) || !exceeded) {
        var time = diffTime(e);
        if (time && time < LOG_INTERVAL) {
          return diffCoord(e) / time;
        }
      }
      return 0;
    }
    function computeDestination(velocity) {
      return getPosition() + sign(velocity) * min$2(abs$1(velocity) * (options.flickPower || 600), isFree ? Infinity : Components2.Layout.listSize() * (options.flickMaxPages || 1));
    }
    function diffCoord(e, orthogonal) {
      return coordOf(e, orthogonal) - coordOf(getBaseEvent(e), orthogonal);
    }
    function diffTime(e) {
      return timeOf(e) - timeOf(getBaseEvent(e));
    }
    function getBaseEvent(e) {
      return baseEvent === e && prevBaseEvent || baseEvent;
    }
    function coordOf(e, orthogonal) {
      return (isTouchEvent(e) ? e.changedTouches[0] : e)["page" + resolve(orthogonal ? "Y" : "X")];
    }
    function constrain(diff) {
      return diff / (exceeded && Splide2.is(SLIDE$1) ? FRICTION : 1);
    }
    function isDraggable(target2) {
      var noDrag = options.noDrag;
      return !matches(target2, "." + CLASS_PAGINATION_PAGE + ", ." + CLASS_ARROW) && (!noDrag || !matches(target2, noDrag));
    }
    function isTouchEvent(e) {
      return typeof TouchEvent !== "undefined" && e instanceof TouchEvent;
    }
    function isDragging() {
      return dragging;
    }
    function disable(value) {
      disabled = value;
    }
    return {
      mount: mount,
      disable: disable,
      isDragging: isDragging
    };
  }
  var NORMALIZATION_MAP = {
    Spacebar: " ",
    Right: ARROW_RIGHT,
    Left: ARROW_LEFT,
    Up: ARROW_UP,
    Down: ARROW_DOWN
  };
  function normalizeKey(key) {
    key = isString(key) ? key : key.key;
    return NORMALIZATION_MAP[key] || key;
  }
  var KEYBOARD_EVENT = "keydown";
  function Keyboard(Splide2, Components2, options) {
    var _EventInterface10 = EventInterface$1(Splide2),
      on = _EventInterface10.on,
      bind = _EventInterface10.bind,
      unbind = _EventInterface10.unbind;
    var root = Splide2.root;
    var resolve = Components2.Direction.resolve;
    var target;
    var disabled;
    function mount() {
      init();
      on(EVENT_UPDATED$1, destroy);
      on(EVENT_UPDATED$1, init);
      on(EVENT_MOVE$1, onMove);
    }
    function init() {
      var keyboard = options.keyboard;
      if (keyboard) {
        target = keyboard === "global" ? window : root;
        bind(target, KEYBOARD_EVENT, onKeydown);
      }
    }
    function destroy() {
      unbind(target, KEYBOARD_EVENT);
    }
    function disable(value) {
      disabled = value;
    }
    function onMove() {
      var _disabled = disabled;
      disabled = true;
      nextTick(function () {
        disabled = _disabled;
      });
    }
    function onKeydown(e) {
      if (!disabled) {
        var key = normalizeKey(e);
        if (key === resolve(ARROW_LEFT)) {
          Splide2.go("<");
        } else if (key === resolve(ARROW_RIGHT)) {
          Splide2.go(">");
        }
      }
    }
    return {
      mount: mount,
      destroy: destroy,
      disable: disable
    };
  }
  var SRC_DATA_ATTRIBUTE = DATA_ATTRIBUTE + "-lazy";
  var SRCSET_DATA_ATTRIBUTE = SRC_DATA_ATTRIBUTE + "-srcset";
  var IMAGE_SELECTOR = "[" + SRC_DATA_ATTRIBUTE + "], [" + SRCSET_DATA_ATTRIBUTE + "]";
  function LazyLoad(Splide2, Components2, options) {
    var _EventInterface11 = EventInterface$1(Splide2),
      on = _EventInterface11.on,
      off = _EventInterface11.off,
      bind = _EventInterface11.bind,
      emit = _EventInterface11.emit;
    var isSequential = options.lazyLoad === "sequential";
    var events = [EVENT_MOVED$1, EVENT_SCROLLED$1];
    var entries = [];
    function mount() {
      if (options.lazyLoad) {
        init();
        on(EVENT_REFRESH, init);
      }
    }
    function init() {
      empty$1(entries);
      register();
      if (isSequential) {
        loadNext();
      } else {
        off(events);
        on(events, check);
        check();
      }
    }
    function register() {
      Components2.Slides.forEach(function (Slide) {
        queryAll(Slide.slide, IMAGE_SELECTOR).forEach(function (img) {
          var src = getAttribute(img, SRC_DATA_ATTRIBUTE);
          var srcset = getAttribute(img, SRCSET_DATA_ATTRIBUTE);
          if (src !== img.src || srcset !== img.srcset) {
            var className = options.classes.spinner;
            var parent = img.parentElement;
            var spinner = child(parent, "." + className) || create("span", className, parent);
            entries.push([img, Slide, spinner]);
            img.src || display(img, "none");
          }
        });
      });
    }
    function check() {
      entries = entries.filter(function (data) {
        var distance = options.perPage * ((options.preloadPages || 1) + 1) - 1;
        return data[1].isWithin(Splide2.index, distance) ? load(data) : true;
      });
      entries.length || off(events);
    }
    function load(data) {
      var img = data[0];
      addClass(data[1].slide, CLASS_LOADING);
      bind(img, "load error", apply$2(onLoad, data));
      setAttribute$1(img, "src", getAttribute(img, SRC_DATA_ATTRIBUTE));
      setAttribute$1(img, "srcset", getAttribute(img, SRCSET_DATA_ATTRIBUTE));
      removeAttribute$1(img, SRC_DATA_ATTRIBUTE);
      removeAttribute$1(img, SRCSET_DATA_ATTRIBUTE);
    }
    function onLoad(data, e) {
      var img = data[0],
        Slide = data[1];
      removeClass(Slide.slide, CLASS_LOADING);
      if (e.type !== "error") {
        remove(data[2]);
        display(img, "");
        emit(EVENT_LAZYLOAD_LOADED, img, Slide);
        emit(EVENT_RESIZE);
      }
      isSequential && loadNext();
    }
    function loadNext() {
      entries.length && load(entries.shift());
    }
    return {
      mount: mount,
      destroy: apply$2(empty$1, entries),
      check: check
    };
  }
  function Pagination(Splide2, Components2, options) {
    var event = EventInterface$1(Splide2);
    var on = event.on,
      emit = event.emit,
      bind = event.bind;
    var Slides = Components2.Slides,
      Elements = Components2.Elements,
      Controller = Components2.Controller;
    var hasFocus = Controller.hasFocus,
      getIndex = Controller.getIndex,
      go = Controller.go;
    var resolve = Components2.Direction.resolve;
    var placeholder = Elements.pagination;
    var items = [];
    var list;
    var paginationClasses;
    function mount() {
      destroy();
      on([EVENT_UPDATED$1, EVENT_REFRESH, EVENT_END_INDEX_CHANGED], mount);
      var enabled = options.pagination;
      placeholder && display(placeholder, enabled ? "" : "none");
      if (enabled) {
        on([EVENT_MOVE$1, EVENT_SCROLL$1, EVENT_SCROLLED$1], update);
        createPagination();
        update();
        emit(EVENT_PAGINATION_MOUNTED, {
          list: list,
          items: items
        }, getAt(Splide2.index));
      }
    }
    function destroy() {
      if (list) {
        remove(placeholder ? slice$2(list.children) : list);
        removeClass(list, paginationClasses);
        empty$1(items);
        list = null;
      }
      event.destroy();
    }
    function createPagination() {
      var length = Splide2.length;
      var classes = options.classes,
        i18n = options.i18n,
        perPage = options.perPage;
      var max = hasFocus() ? Controller.getEnd() + 1 : ceil$1(length / perPage);
      list = placeholder || create("ul", classes.pagination, Elements.track.parentElement);
      addClass(list, paginationClasses = CLASS_PAGINATION + "--" + getDirection());
      setAttribute$1(list, ROLE, "tablist");
      setAttribute$1(list, ARIA_LABEL, i18n.select);
      setAttribute$1(list, ARIA_ORIENTATION, getDirection() === TTB ? "vertical" : "");
      for (var i = 0; i < max; i++) {
        var li = create("li", null, list);
        var button = create("button", {
          class: classes.page,
          type: "button"
        }, li);
        var controls = Slides.getIn(i).map(function (Slide) {
          return Slide.slide.id;
        });
        var text = !hasFocus() && perPage > 1 ? i18n.pageX : i18n.slideX;
        bind(button, "click", apply$2(onClick, i));
        if (options.paginationKeyboard) {
          bind(button, "keydown", apply$2(onKeydown, i));
        }
        setAttribute$1(li, ROLE, "presentation");
        setAttribute$1(button, ROLE, "tab");
        setAttribute$1(button, ARIA_CONTROLS, controls.join(" "));
        setAttribute$1(button, ARIA_LABEL, format(text, i + 1));
        setAttribute$1(button, TAB_INDEX, -1);
        items.push({
          li: li,
          button: button,
          page: i
        });
      }
    }
    function onClick(page) {
      go(">" + page, true);
    }
    function onKeydown(page, e) {
      var length = items.length;
      var key = normalizeKey(e);
      var dir = getDirection();
      var nextPage = -1;
      if (key === resolve(ARROW_RIGHT, false, dir)) {
        nextPage = ++page % length;
      } else if (key === resolve(ARROW_LEFT, false, dir)) {
        nextPage = (--page + length) % length;
      } else if (key === "Home") {
        nextPage = 0;
      } else if (key === "End") {
        nextPage = length - 1;
      }
      var item = items[nextPage];
      if (item) {
        focus(item.button);
        go(">" + nextPage);
        prevent(e, true);
      }
    }
    function getDirection() {
      return options.paginationDirection || options.direction;
    }
    function getAt(index) {
      return items[Controller.toPage(index)];
    }
    function update() {
      var prev = getAt(getIndex(true));
      var curr = getAt(getIndex());
      if (prev) {
        var button = prev.button;
        removeClass(button, CLASS_ACTIVE$1);
        removeAttribute$1(button, ARIA_SELECTED);
        setAttribute$1(button, TAB_INDEX, -1);
      }
      if (curr) {
        var _button = curr.button;
        addClass(_button, CLASS_ACTIVE$1);
        setAttribute$1(_button, ARIA_SELECTED, true);
        setAttribute$1(_button, TAB_INDEX, "");
      }
      emit(EVENT_PAGINATION_UPDATED, {
        list: list,
        items: items
      }, prev, curr);
    }
    return {
      items: items,
      mount: mount,
      destroy: destroy,
      getAt: getAt,
      update: update
    };
  }
  var TRIGGER_KEYS = [" ", "Enter"];
  function Sync(Splide2, Components2, options) {
    var isNavigation = options.isNavigation,
      slideFocus = options.slideFocus;
    var events = [];
    function mount() {
      Splide2.splides.forEach(function (target) {
        if (!target.isParent) {
          sync(Splide2, target.splide);
          sync(target.splide, Splide2);
        }
      });
      if (isNavigation) {
        navigate();
      }
    }
    function destroy() {
      events.forEach(function (event) {
        event.destroy();
      });
      empty$1(events);
    }
    function remount() {
      destroy();
      mount();
    }
    function sync(splide, target) {
      var event = EventInterface$1(splide);
      event.on(EVENT_MOVE$1, function (index, prev, dest) {
        target.go(target.is(LOOP) ? dest : index);
      });
      events.push(event);
    }
    function navigate() {
      var event = EventInterface$1(Splide2);
      var on = event.on;
      on(EVENT_CLICK, onClick);
      on(EVENT_SLIDE_KEYDOWN, onKeydown);
      on([EVENT_MOUNTED, EVENT_UPDATED$1], update);
      events.push(event);
      event.emit(EVENT_NAVIGATION_MOUNTED, Splide2.splides);
    }
    function update() {
      setAttribute$1(Components2.Elements.list, ARIA_ORIENTATION, options.direction === TTB ? "vertical" : "");
    }
    function onClick(Slide) {
      Splide2.go(Slide.index);
    }
    function onKeydown(Slide, e) {
      if (includes(TRIGGER_KEYS, normalizeKey(e))) {
        onClick(Slide);
        prevent(e);
      }
    }
    return {
      setup: apply$2(Components2.Media.set, {
        slideFocus: isUndefined$1(slideFocus) ? isNavigation : slideFocus
      }, true),
      mount: mount,
      destroy: destroy,
      remount: remount
    };
  }
  function Wheel(Splide2, Components2, options) {
    var _EventInterface12 = EventInterface$1(Splide2),
      bind = _EventInterface12.bind;
    var lastTime = 0;
    function mount() {
      if (options.wheel) {
        bind(Components2.Elements.track, "wheel", onWheel, SCROLL_LISTENER_OPTIONS);
      }
    }
    function onWheel(e) {
      if (e.cancelable) {
        var deltaY = e.deltaY;
        var backwards = deltaY < 0;
        var timeStamp = timeOf(e);
        var _min = options.wheelMinThreshold || 0;
        var sleep = options.wheelSleep || 0;
        if (abs$1(deltaY) > _min && timeStamp - lastTime > sleep) {
          Splide2.go(backwards ? "<" : ">");
          lastTime = timeStamp;
        }
        shouldPrevent(backwards) && prevent(e);
      }
    }
    function shouldPrevent(backwards) {
      return !options.releaseWheel || Splide2.state.is(MOVING) || Components2.Controller.getAdjacent(backwards) !== -1;
    }
    return {
      mount: mount
    };
  }
  var SR_REMOVAL_DELAY = 90;
  function Live(Splide2, Components2, options) {
    var _EventInterface13 = EventInterface$1(Splide2),
      on = _EventInterface13.on;
    var track = Components2.Elements.track;
    var enabled = options.live && !options.isNavigation;
    var sr = create("span", CLASS_SR);
    var interval = RequestInterval$1(SR_REMOVAL_DELAY, apply$2(toggle, false));
    function mount() {
      if (enabled) {
        disable(!Components2.Autoplay.isPaused());
        setAttribute$1(track, ARIA_ATOMIC, true);
        sr.textContent = "\u2026";
        on(EVENT_AUTOPLAY_PLAY, apply$2(disable, true));
        on(EVENT_AUTOPLAY_PAUSE, apply$2(disable, false));
        on([EVENT_MOVED$1, EVENT_SCROLLED$1], apply$2(toggle, true));
      }
    }
    function toggle(active) {
      setAttribute$1(track, ARIA_BUSY, active);
      if (active) {
        append(track, sr);
        interval.start();
      } else {
        remove(sr);
        interval.cancel();
      }
    }
    function destroy() {
      removeAttribute$1(track, [ARIA_LIVE, ARIA_ATOMIC, ARIA_BUSY]);
      remove(sr);
    }
    function disable(disabled) {
      if (enabled) {
        setAttribute$1(track, ARIA_LIVE, disabled ? "off" : "polite");
      }
    }
    return {
      mount: mount,
      disable: disable,
      destroy: destroy
    };
  }
  var ComponentConstructors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Media: Media,
    Direction: Direction,
    Elements: Elements,
    Slides: Slides,
    Layout: Layout,
    Clones: Clones,
    Move: Move,
    Controller: Controller,
    Arrows: Arrows,
    Autoplay: Autoplay,
    Cover: Cover,
    Scroll: Scroll,
    Drag: Drag,
    Keyboard: Keyboard,
    LazyLoad: LazyLoad,
    Pagination: Pagination,
    Sync: Sync,
    Wheel: Wheel,
    Live: Live
  });
  var I18N$1 = {
    prev: "Previous slide",
    next: "Next slide",
    first: "Go to first slide",
    last: "Go to last slide",
    slideX: "Go to slide %s",
    pageX: "Go to page %s",
    play: "Start autoplay",
    pause: "Pause autoplay",
    carousel: "carousel",
    slide: "slide",
    select: "Select a slide to show",
    slideLabel: "%s of %s"
  };
  var DEFAULTS$1 = {
    type: "slide",
    role: "region",
    speed: 400,
    perPage: 1,
    cloneStatus: true,
    arrows: true,
    pagination: true,
    paginationKeyboard: true,
    interval: 5e3,
    pauseOnHover: true,
    pauseOnFocus: true,
    resetProgress: true,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    drag: true,
    direction: "ltr",
    trimSpace: true,
    focusableNodes: "a, button, textarea, input, select, iframe",
    live: true,
    classes: CLASSES,
    i18n: I18N$1,
    reducedMotion: {
      speed: 0,
      rewindSpeed: 0,
      autoplay: "pause"
    }
  };
  function Fade(Splide2, Components2, options) {
    var Slides = Components2.Slides;
    function mount() {
      EventInterface$1(Splide2).on([EVENT_MOUNTED, EVENT_REFRESH], init);
    }
    function init() {
      Slides.forEach(function (Slide) {
        Slide.style("transform", "translateX(-" + 100 * Slide.index + "%)");
      });
    }
    function start(index, done) {
      Slides.style("transition", "opacity " + options.speed + "ms " + options.easing);
      nextTick(done);
    }
    return {
      mount: mount,
      start: start,
      cancel: noop
    };
  }
  function Slide(Splide2, Components2, options) {
    var Move = Components2.Move,
      Controller = Components2.Controller,
      Scroll = Components2.Scroll;
    var list = Components2.Elements.list;
    var transition = apply$2(style, list, "transition");
    var endCallback;
    function mount() {
      EventInterface$1(Splide2).bind(list, "transitionend", function (e) {
        if (e.target === list && endCallback) {
          cancel();
          endCallback();
        }
      });
    }
    function start(index, done) {
      var destination = Move.toPosition(index, true);
      var position = Move.getPosition();
      var speed = getSpeed(index);
      if (abs$1(destination - position) >= 1 && speed >= 1) {
        if (options.useScroll) {
          Scroll.scroll(destination, speed, false, done);
        } else {
          transition("transform " + speed + "ms " + options.easing);
          Move.translate(destination, true);
          endCallback = done;
        }
      } else {
        Move.jump(index);
        done();
      }
    }
    function cancel() {
      transition("");
      Scroll.cancel();
    }
    function getSpeed(index) {
      var rewindSpeed = options.rewindSpeed;
      if (Splide2.is(SLIDE$1) && rewindSpeed) {
        var prev = Controller.getIndex(true);
        var end = Controller.getEnd();
        if (prev === 0 && index >= end || prev >= end && index === 0) {
          return rewindSpeed;
        }
      }
      return options.speed;
    }
    return {
      mount: mount,
      start: start,
      cancel: cancel
    };
  }
  var _Splide = /*#__PURE__*/function () {
    function _Splide(target, options) {
      this.event = EventInterface$1();
      this.Components = {};
      this.state = State(CREATED);
      this.splides = [];
      this._o = {};
      this._E = {};
      var root = isString(target) ? query(document, target) : target;
      assert(root, root + " is invalid.");
      this.root = root;
      options = merge({
        label: getAttribute(root, ARIA_LABEL) || "",
        labelledby: getAttribute(root, ARIA_LABELLEDBY) || ""
      }, DEFAULTS$1, _Splide.defaults, options || {});
      try {
        merge(options, JSON.parse(getAttribute(root, DATA_ATTRIBUTE)));
      } catch (e) {
        assert(false, "Invalid JSON");
      }
      this._o = Object.create(merge({}, options));
    }
    var _proto = _Splide.prototype;
    _proto.mount = function mount(Extensions, Transition) {
      var _this = this;
      var state = this.state,
        Components2 = this.Components;
      assert(state.is([CREATED, DESTROYED]), "Already mounted!");
      state.set(CREATED);
      this._C = Components2;
      this._T = Transition || this._T || (this.is(FADE$1) ? Fade : Slide);
      this._E = Extensions || this._E;
      var Constructors = assign$2({}, ComponentConstructors, this._E, {
        Transition: this._T
      });
      forOwn$2(Constructors, function (Component, key) {
        var component = Component(_this, Components2, _this._o);
        Components2[key] = component;
        component.setup && component.setup();
      });
      forOwn$2(Components2, function (component) {
        component.mount && component.mount();
      });
      this.emit(EVENT_MOUNTED);
      addClass(this.root, CLASS_INITIALIZED);
      state.set(IDLE);
      this.emit(EVENT_READY);
      return this;
    };
    _proto.sync = function sync(splide) {
      this.splides.push({
        splide: splide
      });
      splide.splides.push({
        splide: this,
        isParent: true
      });
      if (this.state.is(IDLE)) {
        this._C.Sync.remount();
        splide.Components.Sync.remount();
      }
      return this;
    };
    _proto.go = function go(control) {
      this._C.Controller.go(control);
      return this;
    };
    _proto.on = function on(events, callback) {
      this.event.on(events, callback);
      return this;
    };
    _proto.off = function off(events) {
      this.event.off(events);
      return this;
    };
    _proto.emit = function emit(event) {
      var _this$event;
      (_this$event = this.event).emit.apply(_this$event, [event].concat(slice$2(arguments, 1)));
      return this;
    };
    _proto.add = function add(slides, index) {
      this._C.Slides.add(slides, index);
      return this;
    };
    _proto.remove = function remove(matcher) {
      this._C.Slides.remove(matcher);
      return this;
    };
    _proto.is = function is(type) {
      return this._o.type === type;
    };
    _proto.refresh = function refresh() {
      this.emit(EVENT_REFRESH);
      return this;
    };
    _proto.destroy = function destroy(completely) {
      if (completely === void 0) {
        completely = true;
      }
      var event = this.event,
        state = this.state;
      if (state.is(CREATED)) {
        EventInterface$1(this).on(EVENT_READY, this.destroy.bind(this, completely));
      } else {
        forOwn$2(this._C, function (component) {
          component.destroy && component.destroy(completely);
        }, true);
        event.emit(EVENT_DESTROY$1);
        event.destroy();
        completely && empty$1(this.splides);
        state.set(DESTROYED);
      }
      return this;
    };
    _createClass(_Splide, [{
      key: "options",
      get: function get() {
        return this._o;
      },
      set: function set(options) {
        this._C.Media.set(options, true, true);
      }
    }, {
      key: "length",
      get: function get() {
        return this._C.Slides.getLength(true);
      }
    }, {
      key: "index",
      get: function get() {
        return this._C.Controller.getIndex();
      }
    }]);
    return _Splide;
  }();
  var Splide = _Splide;
  Splide.defaults = {};
  Splide.STATES = STATES;

  function splideClients() {
    // console.log('cients');

    const carousel = document.querySelectorAll('.clients .splide');
    carousel.forEach(item => {
      const splide = new Splide(item, {
        // autoWidth: true,
        // height: 400,
        pagination: false,
        arrows: false,
        gap: 10,
        perPage: 4,
        perMove: 1,
        padding: {
          left: 0,
          right: 100
        },
        breakpoints: {
          1599: {
            perPage: 3,
            perMove: 1,
            padding: {
              left: 0,
              right: 100
            },
            gap: 15
          },
          991: {
            perPage: 2,
            perMove: 1,
            padding: {
              left: 0,
              right: 60
            },
            gap: 15
          },
          767: {
            perPage: 1,
            perMove: 1,
            padding: {
              left: 0,
              right: 60
            },
            gap: 15
          }
        }
      });
      splide.mount();
    });
  }

  function splideTeam() {
    // console.log('team');

    const carousel = document.querySelectorAll('.team .splide');
    carousel.forEach(item => {
      const splide = new Splide(item, {
        // autoWidth: true,
        // height: 400,
        pagination: false,
        arrows: false,
        gap: 10,
        perPage: 4,
        padding: {
          left: 0,
          right: 250
        },
        breakpoints: {
          767: {
            perPage: 1,
            perMove: 1,
            padding: {
              left: 0,
              right: 60
            },
            gap: 15
          },
          991: {
            perPage: 2,
            perMove: 1,
            padding: {
              left: 0,
              right: 100
            },
            gap: 15
          },
          1199: {
            perPage: 3,
            perMove: 1,
            padding: {
              left: 0,
              right: 150
            },
            gap: 15
          }
        }
      });
      splide.mount();
    });
  }

  function splideSingleCarousel() {
    // console.log('cients');

    const carousel = document.querySelectorAll('.single__carousel .splide');
    carousel.forEach(item => {
      const splide = new Splide(item, {
        // autoWidth: true,
        // height: 400,
        type: 'loop',
        autoplay: true,
        pagination: false,
        arrows: false,
        gap: 10,
        perPage: 1,
        perMove: 1,
        padding: {
          left: '25vw',
          right: '25vw'
        },
        breakpoints: {
          767: {
            perPage: 1,
            perMove: 1,
            padding: {
              left: '10vw',
              right: '10vw'
            },
            gap: 10
          }
        }
      });
      splide.mount();
    });
  }

  /*!
   * @splidejs/splide-extension-auto-scroll
   * Version  : 0.5.3
   * License  : MIT
   * Copyright: 2022 Naotoshi Fujita
   */
  function empty(array) {
    array.length = 0;
  }
  function slice$1(arrayLike, start, end) {
    return Array.prototype.slice.call(arrayLike, start, end);
  }
  function apply$1(func) {
    return func.bind.apply(func, [null].concat(slice$1(arguments, 1)));
  }
  function raf(func) {
    return requestAnimationFrame(func);
  }
  function typeOf$1(type, subject) {
    return typeof subject === type;
  }
  var isArray$1 = Array.isArray;
  apply$1(typeOf$1, "function");
  apply$1(typeOf$1, "string");
  apply$1(typeOf$1, "undefined");
  function toArray$1(value) {
    return isArray$1(value) ? value : [value];
  }
  function forEach$1(values, iteratee) {
    toArray$1(values).forEach(iteratee);
  }
  var ownKeys$1 = Object.keys;
  function forOwn$1(object, iteratee, right) {
    if (object) {
      var keys = ownKeys$1(object);
      keys = right ? keys.reverse() : keys;
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key !== "__proto__") {
          if (iteratee(object[key], key) === false) {
            break;
          }
        }
      }
    }
    return object;
  }
  function assign$1(object) {
    slice$1(arguments, 1).forEach(function (source) {
      forOwn$1(source, function (value, key) {
        object[key] = source[key];
      });
    });
    return object;
  }
  var min$1 = Math.min;
  function EventBinder() {
    var listeners = [];
    function bind(targets, events, callback, options) {
      forEachEvent(targets, events, function (target, event, namespace) {
        var isEventTarget = ("addEventListener" in target);
        var remover = isEventTarget ? target.removeEventListener.bind(target, event, callback, options) : target["removeListener"].bind(target, callback);
        isEventTarget ? target.addEventListener(event, callback, options) : target["addListener"](callback);
        listeners.push([target, event, namespace, callback, remover]);
      });
    }
    function unbind(targets, events, callback) {
      forEachEvent(targets, events, function (target, event, namespace) {
        listeners = listeners.filter(function (listener) {
          if (listener[0] === target && listener[1] === event && listener[2] === namespace && (!callback || listener[3] === callback)) {
            listener[4]();
            return false;
          }
          return true;
        });
      });
    }
    function dispatch(target, type, detail) {
      var e;
      var bubbles = true;
      if (typeof CustomEvent === "function") {
        e = new CustomEvent(type, {
          bubbles: bubbles,
          detail: detail
        });
      } else {
        e = document.createEvent("CustomEvent");
        e.initCustomEvent(type, bubbles, false, detail);
      }
      target.dispatchEvent(e);
      return e;
    }
    function forEachEvent(targets, events, iteratee) {
      forEach$1(targets, function (target) {
        target && forEach$1(events, function (events2) {
          events2.split(" ").forEach(function (eventNS) {
            var fragment = eventNS.split(".");
            iteratee(target, fragment[0], fragment[1]);
          });
        });
      });
    }
    function destroy() {
      listeners.forEach(function (data) {
        data[4]();
      });
      empty(listeners);
    }
    return {
      bind: bind,
      unbind: unbind,
      dispatch: dispatch,
      destroy: destroy
    };
  }
  var EVENT_MOVE = "move";
  var EVENT_MOVED = "moved";
  var EVENT_UPDATED = "updated";
  var EVENT_DRAG = "drag";
  var EVENT_DRAGGED = "dragged";
  var EVENT_SCROLL = "scroll";
  var EVENT_SCROLLED = "scrolled";
  var EVENT_DESTROY = "destroy";
  function EventInterface(Splide2) {
    var bus = Splide2 ? Splide2.event.bus : document.createDocumentFragment();
    var binder = EventBinder();
    function on(events, callback) {
      binder.bind(bus, toArray$1(events).join(" "), function (e) {
        callback.apply(callback, isArray$1(e.detail) ? e.detail : []);
      });
    }
    function emit(event) {
      binder.dispatch(bus, event, slice$1(arguments, 1));
    }
    if (Splide2) {
      Splide2.event.on(EVENT_DESTROY, binder.destroy);
    }
    return assign$1(binder, {
      bus: bus,
      on: on,
      off: apply$1(binder.unbind, bus),
      emit: emit
    });
  }
  function RequestInterval(interval, onInterval, onUpdate, limit) {
    var now = Date.now;
    var startTime;
    var rate = 0;
    var id;
    var paused = true;
    var count = 0;
    function update() {
      if (!paused) {
        rate = interval ? min$1((now() - startTime) / interval, 1) : 1;
        onUpdate && onUpdate(rate);
        if (rate >= 1) {
          onInterval();
          startTime = now();
          if (limit && ++count >= limit) {
            return pause();
          }
        }
        raf(update);
      }
    }
    function start(resume) {
      !resume && cancel();
      startTime = now() - (resume ? rate * interval : 0);
      paused = false;
      raf(update);
    }
    function pause() {
      paused = true;
    }
    function rewind() {
      startTime = now();
      rate = 0;
      if (onUpdate) {
        onUpdate(rate);
      }
    }
    function cancel() {
      id && cancelAnimationFrame(id);
      rate = 0;
      id = 0;
      paused = true;
    }
    function set(time) {
      interval = time;
    }
    function isPaused() {
      return paused;
    }
    return {
      start: start,
      rewind: rewind,
      pause: pause,
      cancel: cancel,
      set: set,
      isPaused: isPaused
    };
  }
  function Throttle(func, duration) {
    var interval;
    function throttled() {
      if (!interval) {
        interval = RequestInterval(duration || 0, function () {
          func();
          interval = null;
        }, null, 1);
        interval.start();
      }
    }
    return throttled;
  }
  var CLASS_ACTIVE = "is-active";
  var SLIDE = "slide";
  var FADE = "fade";
  function slice(arrayLike, start, end) {
    return Array.prototype.slice.call(arrayLike, start, end);
  }
  function apply(func) {
    return func.bind(null, ...slice(arguments, 1));
  }
  function typeOf(type, subject) {
    return typeof subject === type;
  }
  function isObject(subject) {
    return !isNull(subject) && typeOf("object", subject);
  }
  const isArray = Array.isArray;
  apply(typeOf, "function");
  apply(typeOf, "string");
  const isUndefined = apply(typeOf, "undefined");
  function isNull(subject) {
    return subject === null;
  }
  function toArray(value) {
    return isArray(value) ? value : [value];
  }
  function forEach(values, iteratee) {
    toArray(values).forEach(iteratee);
  }
  function toggleClass(elm, classes, add) {
    if (elm) {
      forEach(classes, name => {
        if (name) {
          elm.classList[add ? "add" : "remove"](name);
        }
      });
    }
  }
  const ownKeys = Object.keys;
  function forOwn(object, iteratee, right) {
    if (object) {
      let keys = ownKeys(object);
      keys = right ? keys.reverse() : keys;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key !== "__proto__") {
          if (iteratee(object[key], key) === false) {
            break;
          }
        }
      }
    }
    return object;
  }
  function assign(object) {
    slice(arguments, 1).forEach(source => {
      forOwn(source, (value, key) => {
        object[key] = source[key];
      });
    });
    return object;
  }
  function removeAttribute(elms, attrs) {
    forEach(elms, elm => {
      forEach(attrs, attr => {
        elm && elm.removeAttribute(attr);
      });
    });
  }
  function setAttribute(elms, attrs, value) {
    if (isObject(attrs)) {
      forOwn(attrs, (value2, name) => {
        setAttribute(elms, name, value2);
      });
    } else {
      forEach(elms, elm => {
        isNull(value) || value === "" ? removeAttribute(elm, attrs) : elm.setAttribute(attrs, String(value));
      });
    }
  }
  const {
    min,
    max,
    floor,
    ceil,
    abs
  } = Math;
  function clamp(number, x, y) {
    const minimum = min(x, y);
    const maximum = max(x, y);
    return min(max(minimum, number), maximum);
  }
  const DEFAULTS = {
    speed: 1,
    autoStart: true,
    pauseOnHover: true,
    pauseOnFocus: true
  };
  const I18N = {
    startScroll: "Start auto scroll",
    pauseScroll: "Pause auto scroll"
  };
  function AutoScroll(Splide2, Components2, options) {
    const {
      on,
      off,
      bind,
      unbind
    } = EventInterface(Splide2);
    const {
      translate,
      getPosition,
      toIndex,
      getLimit
    } = Components2.Move;
    const {
      setIndex,
      getIndex
    } = Components2.Controller;
    const {
      orient
    } = Components2.Direction;
    const {
      toggle
    } = Components2.Elements;
    const {
      Live
    } = Components2;
    const {
      root
    } = Splide2;
    const throttledUpdateArrows = Throttle(Components2.Arrows.update, 500);
    let autoScrollOptions = {};
    let interval;
    let stopped;
    let hovered;
    let focused;
    let busy;
    let currPosition;
    function setup() {
      const {
        autoScroll
      } = options;
      autoScrollOptions = assign({}, DEFAULTS, isObject(autoScroll) ? autoScroll : {});
    }
    function mount() {
      if (!Splide2.is(FADE)) {
        if (!interval && options.autoScroll !== false) {
          interval = RequestInterval(0, move);
          listen();
          autoStart();
        }
      }
    }
    function destroy() {
      if (interval) {
        interval.cancel();
        interval = null;
        currPosition = void 0;
        off([EVENT_MOVE, EVENT_DRAG, EVENT_SCROLL, EVENT_MOVED, EVENT_SCROLLED]);
        unbind(root, "mouseenter mouseleave focusin focusout");
        unbind(toggle, "click");
      }
    }
    function listen() {
      if (autoScrollOptions.pauseOnHover) {
        bind(root, "mouseenter mouseleave", e => {
          hovered = e.type === "mouseenter";
          autoToggle();
        });
      }
      if (autoScrollOptions.pauseOnFocus) {
        bind(root, "focusin focusout", e => {
          focused = e.type === "focusin";
          autoToggle();
        });
      }
      if (autoScrollOptions.useToggleButton) {
        bind(toggle, "click", () => {
          stopped ? play() : pause();
        });
      }
      on(EVENT_UPDATED, update);
      on([EVENT_MOVE, EVENT_DRAG, EVENT_SCROLL], () => {
        busy = true;
        pause(false);
      });
      on([EVENT_MOVED, EVENT_DRAGGED, EVENT_SCROLLED], () => {
        busy = false;
        autoToggle();
      });
    }
    function update() {
      const {
        autoScroll
      } = options;
      if (autoScroll !== false) {
        autoScrollOptions = assign({}, autoScrollOptions, isObject(autoScroll) ? autoScroll : {});
        mount();
      } else {
        destroy();
      }
      if (interval && !isUndefined(currPosition)) {
        translate(currPosition);
      }
    }
    function autoStart() {
      if (autoScrollOptions.autoStart) {
        if (document.readyState === "complete") {
          play();
        } else {
          bind(window, "load", play);
        }
      }
    }
    function play() {
      if (isPaused()) {
        interval.start(true);
        Live.disable(true);
        focused = hovered = stopped = false;
        updateButton();
      }
    }
    function pause(stop = true) {
      if (!stopped) {
        stopped = stop;
        updateButton();
        if (!isPaused()) {
          interval.pause();
          Live.disable(false);
        }
      }
    }
    function autoToggle() {
      if (!stopped) {
        hovered || focused || busy ? pause(false) : play();
      }
    }
    function move() {
      const position = getPosition();
      const destination = computeDestination(position);
      if (position !== destination) {
        translate(destination);
        updateIndex(currPosition = getPosition());
      } else {
        pause(false);
        if (autoScrollOptions.rewind) {
          Splide2.go(autoScrollOptions.speed > 0 ? 0 : Components2.Controller.getEnd());
        }
      }
      throttledUpdateArrows();
    }
    function computeDestination(position) {
      const speed = autoScrollOptions.speed || 1;
      position += orient(speed);
      if (Splide2.is(SLIDE)) {
        position = clamp(position, getLimit(false), getLimit(true));
      }
      return position;
    }
    function updateIndex(position) {
      const {
        length
      } = Splide2;
      const index = (toIndex(position) + length) % length;
      if (index !== getIndex()) {
        setIndex(index);
        Components2.Slides.update();
        Components2.Pagination.update();
        options.lazyLoad === "nearby" && Components2.LazyLoad.check();
      }
    }
    function updateButton() {
      if (toggle) {
        const key = stopped ? "startScroll" : "pauseScroll";
        toggleClass(toggle, CLASS_ACTIVE, !stopped);
        setAttribute(toggle, "aria-label", options.i18n[key] || I18N[key]);
      }
    }
    function isPaused() {
      return !interval || interval.isPaused();
    }
    return {
      setup,
      mount,
      destroy,
      play,
      pause,
      isPaused
    };
  }

  function splideMarquee() {
    // console.log('marquee');

    const marquees = document.querySelectorAll('.splide_marquee');

    // animation for each title
    marquees.forEach((marquee, index, array) => {
      const splide = new Splide(marquee, {
        type: 'loop',
        drag: false,
        autoWidth: true,
        arrows: false,
        pagination: false,
        start: true,
        autoScroll: {
          speed: 0.5,
          pauseOnHover: false,
          pauseOnFocus: false
        }
      });
      splide.mount({
        AutoScroll
      });
    });
  }

  function splideContact() {
    const splide = new Splide('.contact__modal-slider', {
      pagination: false,
      arrows: false,
      perPage: 1,
      perMove: 1,
      height: '100vh',
      drag: false
    });
    splide.mount();
    const tl = gsapWithCSS.timeline({
      paused: true
    });
    tl.to('.contact__modal', {
      display: 'block',
      duration: 0
    });
    tl.to('.contact__modal', {
      opacity: 1,
      duration: 0.5
    });
    tl.to('.site-header', {
      opacity: 0,
      duration: 0.2
    }, '<');
    tl.to('.site-header', {
      display: 'none',
      duration: 0
    });
    const btnOpenModal = document.querySelector('.contact__cta-btn');
    const btnCloseModal = document.querySelector('.btn--close');
    const btnPrevModal = document.querySelector('.btn--prev');
    btnOpenModal.addEventListener('click', () => {
      tl.play();
    });
    btnCloseModal.addEventListener('click', () => {
      tl.reverse();
    });
    splide.on('moved', (newIndex, prevIndex) => {
      if (newIndex > 0) {
        btnPrevModal.style.visibility = 'visible';
      } else {
        btnPrevModal.style.visibility = 'hidden';
      }
    });
    btnPrevModal.addEventListener('click', () => {
      splide.go('<');
    });
    const slides = document.querySelectorAll('.slide__item');
    slides.forEach(slide => {
      slide.addEventListener('click', () => {
        splide.go('>');
      });
    });
    const slidesStep1 = document.querySelectorAll('.step-1 .slide__item');
    const slidesStep2 = document.querySelectorAll('.step-2 .slide__item');
    const interestInput = document.querySelector('input[name="interest"]');
    const budgetInput = document.querySelector('input[name="budget"]');
    slidesStep1.forEach(slide => {
      slide.addEventListener('click', () => {
        const option = slide.innerText;
        interestInput.value = option;
        console.log(option);
      });
    });
    slidesStep2.forEach(slide => {
      slide.addEventListener('click', () => {
        const option = slide.innerText;
        budgetInput.value = option;
        console.log(option);
      });
    });
  }

  function bannerParallax() {
    // console.log('banner parallax')

    const banners = document.querySelectorAll('.module--1.banner_parallax, .module--1.banner');
    banners.forEach(banner => {
      const refresh = banner.dataset.refresh;
      ScrollTrigger.create({
        trigger: banner,
        pin: true,
        start: "top top",
        endTrigger: '.module--2',
        end: "top top",
        refreshPriority: 100 - refresh,
        pinSpacing: false
      });
    });

    // console.log(image);

    // let mm = gsap.matchMedia();

    // mm.add('(min-width: 768px)', () => {
    //     const tl = gsap.timeline({
    //         repeat: -1
    //     });
    //     tl.to(image, {
    //         transform: 'translateZ(1px) scale(1.05)',
    //         duration: 10,
    //         ease: 'power1.out'
    //     });
    //     tl.to(image, {
    //         transform: 'translateZ(1px) scale(1)',
    //         duration: 10,
    //         ease: 'power1.out'
    //     });
    // });
  }

  function steps() {
    console.log('steps');
    let targets = document.querySelectorAll('.steps__item');
    targets.forEach(item => {
      const tl = gsapWithCSS.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top 70%',
          end: 'bottom top',
          // markers: true,
          scrub: 1,
          toggleActions: "play resume reverse reset"
        }
      });
      tl.to(item, {
        transform: 'translateY(0)',
        opacity: 1
      });
      tl.to(item, {
        opacity: 1
      });
      tl.to(item, {
        transform: 'translateY(-40px)',
        opacity: 0
      });
    });
  }

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var purecounter = {exports: {}};

  /*!
   * purecounter.js - A simple yet configurable native javascript counter which you can count on.
   * Author: Stig Rex
   * Version: 1.5.0
   * Url: https://github.com/srexi/purecounterjs
   * License: MIT
   */
  purecounter.exports;
  (function (module, exports) {
    !function (e, t) {
      module.exports = t() ;
    }(self, function () {
      return function () {
        var e = {
            3: function (e, t, r) {

              function n(e) {
                return function (e) {
                  if (Array.isArray(e)) return i(e);
                }(e) || function (e) {
                  if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e);
                }(e) || function (e, t) {
                  if (!e) return;
                  if ("string" == typeof e) return i(e, t);
                  var r = Object.prototype.toString.call(e).slice(8, -1);
                  "Object" === r && e.constructor && (r = e.constructor.name);
                  if ("Map" === r || "Set" === r) return Array.from(e);
                  if ("Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return i(e, t);
                }(e) || function () {
                  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
                }();
              }
              function i(e, t) {
                (null == t || t > e.length) && (t = e.length);
                for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
                return n;
              }
              function o(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
              }
              function a(e, t) {
                for (var r = 0; r < t.length; r++) {
                  var n = t[r];
                  n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
                }
              }
              r.d(t, {
                Z: function () {
                  return s;
                }
              });
              var s = function () {
                function e() {
                  var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                  o(this, e), this.defaults = {
                    start: 0,
                    end: 100,
                    duration: 2e3,
                    delay: 10,
                    once: !0,
                    pulse: !1,
                    decimals: 0,
                    legacy: !0,
                    filesizing: !1,
                    currency: !1,
                    separator: !1,
                    formater: "us-US",
                    selector: ".purecounter"
                  }, this.configOptions = this.setOptions(t, this.defaults), this.elements = document.querySelectorAll(this.configOptions.selector), this.intersectionSupport = this.intersectionListenerSupported(), this.registerEventListeners();
                }
                var t, r;
                return t = e, r = [{
                  key: "setOptions",
                  value: function (e) {
                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
                      r = {};
                    for (var n in e) if (0 === Object.keys(t).length || t.hasOwnProperty(n)) {
                      var i = this.parseValue(e[n]);
                      r[n] = i, n.match(/duration|pulse/) && (r[n] = "boolean" != typeof i ? 1e3 * i : i);
                    }
                    return Object.assign({}, t, r);
                  }
                }, {
                  key: "registerEventListeners",
                  value: function () {
                    var e = this.elements;
                    if (0 !== e.length) if (this.intersectionSupport) {
                      var t = new IntersectionObserver(this.animateElements.bind(this), {
                        root: null,
                        rootMargin: "20px",
                        threshold: .5
                      });
                      e.forEach(function (e) {
                        t.observe(e);
                      });
                    } else window.addEventListener && (this.animateLegacy(e), window.addEventListener("scroll", function (t) {
                      this.animateLegacy(e);
                    }, {
                      passive: !0
                    }));
                  }
                }, {
                  key: "animateLegacy",
                  value: function (e) {
                    var t = this;
                    e.forEach(function (e) {
                      !0 === t.parseConfig(e).legacy && t.elementIsInView(e) && t.animateElements([e]);
                    });
                  }
                }, {
                  key: "animateElements",
                  value: function (e, t) {
                    var r = this;
                    e.forEach(function (e) {
                      var n = e.target || e,
                        i = r.parseConfig(n);
                      if (i.duration <= 0) return n.innerHTML = r.formatNumber(i.end, i);
                      if (!t && !r.elementIsInView(e) || t && e.intersectionRatio < .5) {
                        var o = i.start > i.end ? i.end : i.start;
                        return n.innerHTML = r.formatNumber(o, i);
                      }
                      setTimeout(function () {
                        return r.startCounter(n, i);
                      }, i.delay);
                    });
                  }
                }, {
                  key: "startCounter",
                  value: function (e, t) {
                    var r = this,
                      n = (t.end - t.start) / (t.duration / t.delay),
                      i = "inc";
                    t.start > t.end && (i = "dec", n *= -1);
                    var o = this.parseValue(t.start);
                    e.innerHTML = this.formatNumber(o, t), !0 === t.once && e.setAttribute("data-purecounter-duration", 0);
                    var a = setInterval(function () {
                      var s = r.nextNumber(o, n, i);
                      e.innerHTML = r.formatNumber(s, t), ((o = s) >= t.end && "inc" === i || o <= t.end && "dec" === i) && (e.innerHTML = r.formatNumber(t.end, t), t.pulse && (e.setAttribute("data-purecounter-duration", 0), setTimeout(function () {
                        e.setAttribute("data-purecounter-duration", t.duration / 1e3);
                      }, t.pulse)), clearInterval(a));
                    }, t.delay);
                  }
                }, {
                  key: "parseConfig",
                  value: function (e) {
                    var t = this,
                      r = [].filter.call(e.attributes, function (e) {
                        return /^data-purecounter-/.test(e.name);
                      }),
                      i = 0 != r.length ? Object.assign.apply(Object, [{}].concat(n(r.map(function (e) {
                        var r = e.name,
                          n = e.value;
                        return function (e, t, r) {
                          return t in e ? Object.defineProperty(e, t, {
                            value: r,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                          }) : e[t] = r, e;
                        }({}, r.replace("data-purecounter-", "").toLowerCase(), t.parseValue(n));
                      })))) : {};
                    return this.setOptions(i, this.configOptions);
                  }
                }, {
                  key: "nextNumber",
                  value: function (e, t) {
                    var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "inc";
                    return e = this.parseValue(e), t = this.parseValue(t), parseFloat("inc" === r ? e + t : e - t);
                  }
                }, {
                  key: "convertNumber",
                  value: function (e, t) {
                    if (t.filesizing || t.currency) {
                      e = Math.abs(Number(e));
                      var r = 1e3,
                        n = t.currency && "string" == typeof t.currency ? t.currency : "",
                        i = t.decimals || 1,
                        o = ["", "K", "M", "B", "T"],
                        a = "";
                      t.filesizing && (r = 1024, o = ["bytes", "KB", "MB", "GB", "TB"]);
                      for (var s = 4; s >= 0; s--) if (0 === s && (a = "".concat(e.toFixed(i), " ").concat(o[s])), e >= this.getFilesizeThreshold(r, s)) {
                        a = "".concat((e / this.getFilesizeThreshold(r, s)).toFixed(i), " ").concat(o[s]);
                        break;
                      }
                      return n + a;
                    }
                    return parseFloat(e);
                  }
                }, {
                  key: "getFilesizeThreshold",
                  value: function (e, t) {
                    return Math.pow(e, t);
                  }
                }, {
                  key: "applySeparator",
                  value: function (e, t) {
                    if (t.formater) {
                      var r = t.separator ? "string" == typeof t.separator ? t.separator : "," : "";
                      return "en-US" !== t.formater && !0 === t.separator ? e : (n = r, e.replace(/^(?:(\d{1,3},(?:\d{1,3},?)*)|(\d{1,3}\.(?:\d{1,3}\.?)*)|(\d{1,3}(?:\s\d{1,3})*))([\.,]?\d{0,2}?)$/gi, function (e, t, r, i, o) {
                        var a = "",
                          s = "";
                        if (void 0 !== t ? (a = t.replace(new RegExp(/,/gi, "gi"), n), s = ",") : void 0 !== r ? a = r.replace(new RegExp(/\./gi, "gi"), n) : void 0 !== i && (a = i.replace(new RegExp(/ /gi, "gi"), n)), void 0 !== o) {
                          var u = "," !== s && "," !== n ? "," : ".";
                          a += o.replace(new RegExp(/\.|,/gi, "gi"), u);
                        }
                        return a;
                      }));
                    }
                    var n;
                    return e;
                  }
                }, {
                  key: "formatNumber",
                  value: function (e, t) {
                    var r = {
                        minimumFractionDigits: t.decimals,
                        maximumFractionDigits: t.decimals
                      },
                      n = "string" == typeof t.formater ? t.formater : void 0;
                    return e = this.convertNumber(e, t), e = t.formater ? e.toLocaleString(n, r) : parseInt(e).toString(), this.applySeparator(e, t);
                  }
                }, {
                  key: "getLocaleSeparator",
                  value: function () {}
                }, {
                  key: "parseValue",
                  value: function (e) {
                    return /^[0-9]+\.[0-9]+$/.test(e) ? parseFloat(e) : /^[0-9]+$/.test(e) ? parseInt(e) : /^true|false/i.test(e) ? /^true/i.test(e) : e;
                  }
                }, {
                  key: "elementIsInView",
                  value: function (e) {
                    for (var t = e.offsetTop, r = e.offsetLeft, n = e.offsetWidth, i = e.offsetHeight; e.offsetParent;) t += (e = e.offsetParent).offsetTop, r += e.offsetLeft;
                    return t >= window.pageYOffset && r >= window.pageXOffset && t + i <= window.pageYOffset + window.innerHeight && r + n <= window.pageXOffset + window.innerWidth;
                  }
                }, {
                  key: "intersectionListenerSupported",
                  value: function () {
                    return "IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in window.IntersectionObserverEntry.prototype;
                  }
                }], r && a(t.prototype, r), Object.defineProperty(t, "prototype", {
                  writable: !1
                }), e;
              }();
            },
            634: function (e, t, r) {
              var n = r(3).Z;
              e.exports = n;
            }
          },
          t = {};
        function r(n) {
          var i = t[n];
          if (void 0 !== i) return i.exports;
          var o = t[n] = {
            exports: {}
          };
          return e[n](o, o.exports, r), o.exports;
        }
        return r.d = function (e, t) {
          for (var n in t) r.o(t, n) && !r.o(e, n) && Object.defineProperty(e, n, {
            enumerable: !0,
            get: t[n]
          });
        }, r.o = function (e, t) {
          return Object.prototype.hasOwnProperty.call(e, t);
        }, r(634);
      }();
    });
  })(purecounter, purecounter.exports);
  var purecounterExports = purecounter.exports;
  var PureCounter = /*@__PURE__*/getDefaultExportFromCjs(purecounterExports);

  function values() {
    const counts = document.querySelectorAll('.values__count');
    let n = 1;
    counts.forEach(item => {
      const start = item.dataset.start;
      const end = item.dataset.end;
      const duration = item.dataset.duration;
      const decimals = item.dataset.decimals;
      const separator = item.dataset.separator;
      new PureCounter({
        selector: `.values__count-0${n}`,
        start,
        end,
        duration,
        decimals,
        separator
      });
      n++;
    });
  }

  // Main scripts
  gsapWithCSS.registerPlugin(ScrollTrigger);

  // import titleFull from './modules/module-title-full.js';

  ///////////////////////////////////////////////////////////////////////////////////

  // before loaded
  document.addEventListener('DOMContentLoaded', beforeLoad);

  // load
  window.addEventListener('load', () => {
    // const titleFullExist = document.getElementsByClassName('module-title-full');
    // if (titleFullExist.length > 0) {
    //     titleFull();
    // }

    // const loader = document.querySelector('.loader');

    // setTimeout(() => {
    //     loader.classList.add('hidden');
    //     loader.addEventListener('transitionend', () => {
    //         loader.style.display = 'none';
    //     });
    // }, 500);

    start();
  });

  // Window On Resize
  window.addEventListener('resize', onResize);

  ///////////////////////////////////////////////////////////////////////////////////

  function beforeLoad() {
    calculateVH();
    customCursor();
    menu();
    smooth();
    const singleVideoExist = document.getElementsByClassName('single__header--video');
    if (singleVideoExist.length > 0) {
      singleVideo();
    }
    const clientsExist = document.getElementsByClassName('clients');
    if (clientsExist.length > 0) {
      splideClients();
    }
    const teamExist = document.getElementsByClassName('team');
    if (teamExist.length > 0) {
      splideTeam();
    }
    const singleCarouselExist = document.getElementsByClassName('single__carousel');
    if (singleCarouselExist.length > 0) {
      splideSingleCarousel();
    }
    const marqueeExist = document.getElementsByClassName('splide_marquee');
    if (marqueeExist.length > 0) {
      splideMarquee();
    }
    const splideContactExist = document.getElementsByClassName('contact__modal');
    if (splideContactExist.length > 0) {
      splideContact();
    }
    const videoLightgalleryExist = document.getElementsByClassName('video__lg');
    if (videoLightgalleryExist.length > 0) {
      videoLightgallery();
    }
    const bannerParallaxExist = document.getElementsByClassName('banner_parallax');
    const bannerExist = document.getElementsByClassName('banner');
    if (bannerExist.length > 0 || bannerParallaxExist.length > 0) {
      bannerParallax();
    }
    const blocksExist = document.getElementsByClassName('blocks');
    if (blocksExist.length > 0) {
      blocks();
    }

    // ScrollTrigger.refresh();
    // ScrollTrigger.refresh();
  }

  function start() {
    const moduleBannerExist = document.getElementsByClassName('new__text');
    if (moduleBannerExist.length > 0) {
      moduleBanner();
    }
    const gridExist = document.getElementsByClassName('grid');
    if (gridExist.length > 0) {
      moduleGrid();
    }
    const cardVideoExist = document.getElementsByClassName('card--video');
    if (cardVideoExist.length > 0) {
      moduleCardVideo();
    }
    const moduleAwardsExist = document.getElementsByClassName('awards');
    if (moduleAwardsExist.length > 0) {
      moduleAwards();
    }
    const moduleCasesExist = document.getElementsByClassName('cases');
    if (moduleCasesExist.length > 0) {
      moduleCases();
    }
    const masonryExist = document.getElementsByClassName('single__masonry');
    if (masonryExist.length > 0) {
      moduleMasonry();
    }
    const moduleServicesExist = document.getElementsByClassName('services');
    if (moduleServicesExist.length > 0) {
      moduleServices();
    }
    const valuesExist = document.getElementsByClassName('values');
    if (valuesExist.length > 0) {
      values();
    }
    const moduleQuotesExist = document.getElementsByClassName('quotes');
    if (moduleQuotesExist.length > 0) {
      moduleQuotes();
    }
    const moduleWordsExist = document.getElementsByClassName('words');
    if (moduleWordsExist.length > 0) {
      moduleWords();
    }

    // hero text (karaoke)
    const heroExist = document.getElementsByClassName('hero');
    if (heroExist.length > 0) {
      heroReveal();
    }
    const stepsExist = document.getElementsByClassName('steps');
    if (stepsExist.length > 0) {
      steps();
    }
    const siteFooterExist = document.getElementsByClassName('site-footer');
    if (siteFooterExist.length > 0) {
      revealFooter();
    }
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  }
  function onResize() {
    calculateVH();
  }

})();
