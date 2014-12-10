'Use strict';
var DataCollector;

angular.module('touk.userTracking.DataCollector', []).provider('TrackingDataCollector', DataCollector = (function() {
  var dependency, saveFn;

  function DataCollector() {}

  dependency = null;

  saveFn = null;

  DataCollector.prototype.setSaverDependency = function(name) {
    return dependency = name;
  };

  DataCollector.prototype.setSaverFn = function(name) {
    return saveFn = name;
  };

  DataCollector.prototype.$get = [
    '$injector', function($injector) {
      var saver, _ref;
      if (dependency && saveFn) {
        saver = (_ref = $injector.get(dependency)) != null ? _ref[saveFn] : void 0;
      }
      return new UserTracking.DataCollector(saver);
    }
  ];

  return DataCollector;

})());

'Use strict';
angular.module('touk.userTracking.directive', ['touk.userTracking.DataCollector']).directive('analyze', [
  '$location', 'TrackingDataCollector', function($location, collector) {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        var name, page, trackerGetter, trackerOptions;
        name = attrs.analyze || attrs.id || attrs.name || attrs.ngModel;
        page = $location.path();
        trackerOptions = {
          id: name + '@' + page,
          fieldName: name,
          pageName: page
        };
        trackerGetter = function() {
          return collector.get(trackerOptions);
        };
        element.find('input').on('focus blur', function(event) {
          return element.triggerHandler(event.type);
        });
        element.on('focus blur click dblclick keydown keyup keypress contextmenu', function(event) {
          var tracker, _name;
          tracker = trackerGetter();
          return (typeof tracker[_name = event.type] === "function" ? tracker[_name]() : void 0) || tracker.event(event.type);
        });
        return element.on('keydown', function(event) {
          var tracker, valueGetter;
          tracker = trackerGetter();
          valueGetter = function() {
            return angular.element(event.target).val();
          };
          return tracker.checkValueChange(valueGetter);
        });
      }
    };
  }
]);

'Use strict';
angular.module('touk.userTracking', ['touk.userTracking.DataCollector', 'touk.userTracking.directive']).factory('TrackingDataResource', [
  '$resource', function($resource) {
    return $resource('asdasds');
  }
]).config([
  'TrackingDataCollectorProvider', function(provider) {
    provider.setSaverDependency('TrackingDataResource');
    return provider.setSaverFn('save');
  }
]);

'Use strict';
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

UserTracking.DataCollector = (function() {
  DataCollector.prototype.INTERVAL = 3000;

  function DataCollector(saver) {
    this.saver = saver;
    this.save = __bind(this.save, this);
    this.get = __bind(this.get, this);
    this.create = __bind(this.create, this);
    this.init = __bind(this.init, this);
    this.fields = {};
    this.init();
  }

  DataCollector.prototype.init = function() {
    var field, id;
    this.data = (function() {
      var _ref, _results;
      _ref = this.fields;
      _results = [];
      for (id in _ref) {
        field = _ref[id];
        _results.push(field.init());
      }
      return _results;
    }).call(this);
    return setTimeout(this.save, this.INTERVAL);
  };

  DataCollector.prototype.create = function(tracker) {
    var field;
    if (tracker == null) {
      tracker = {};
    }
    field = new UserTracking.Field(tracker.fieldName, tracker.pageName, tracker.formName);
    this.data.push(field.data);
    return this.fields[tracker.id] = field;
  };

  DataCollector.prototype.get = function(tracker) {
    return this.fields[tracker.id] || this.create(tracker);
  };

  DataCollector.prototype.save = function() {
    if (typeof this.saver === "function") {
      this.saver(this.data);
    }
    return this.init();
  };

  return DataCollector;

})();

'Use strict';
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

UserTracking.Field = (function() {
  Field.prototype.INTERVAL = 200;

  function Field(pole, strona, formularz) {
    this.pole = pole;
    this.strona = strona;
    this.formularz = formularz;
    this.test = __bind(this.test, this);
    this.countChars = __bind(this.countChars, this);
    this.checkValueChange = __bind(this.checkValueChange, this);
    this.updateFocusTimer = __bind(this.updateFocusTimer, this);
    this.event = __bind(this.event, this);
    this.blur = __bind(this.blur, this);
    this.focus = __bind(this.focus, this);
    this.init = __bind(this.init, this);
    this.init();
  }

  Field.prototype.init = function() {
    return this.data = new UserTracking.FieldDTO(this.pole, this.strona, this.formularz);
  };

  Field.prototype.focus = function() {
    if (!this.focused) {
      this.focused = true;
      this.data.liczbaWejsc++;
      this.lastFocus = new Date().getTime();
      return this.updater = setInterval((function(_this) {
        return function() {
          return _this.lastFocus = _this.updateFocusTimer();
        };
      })(this), this.INTERVAL);
    }
  };

  Field.prototype.blur = function() {
    clearInterval(this.updater);
    this.focused = false;
    return this.updateFocusTimer();
  };

  Field.prototype.event = function(type) {
    var _base;
    if ((_base = this.data.zdarzenia)[type] == null) {
      _base[type] = 0;
    }
    this.data.zdarzenia[type]++;
    return this.test();
  };

  Field.prototype.updateFocusTimer = function() {
    var time;
    if (this.lastFocus) {
      time = new Date().getTime();
      this.data.czasFokusa += time - this.lastFocus;
      this.lastFocus = null;
      return time;
    }
  };

  Field.prototype.checkValueChange = function(getValue) {
    var valueBefore;
    valueBefore = getValue();
    return setTimeout((function(_this) {
      return function() {
        return _this.countChars(getValue(), valueBefore);
      };
    })(this), 10);
  };

  Field.prototype.countChars = function(newValue, oldValue) {
    var diff, re, _ref, _ref1, _ref2, _ref3;
    diff = newValue.length - oldValue.length;
    if (diff < 0) {
      this.data.skasowanychZnakow++;
    }
    if (diff > 0) {
      this.data.wpisanychZnakow++;
    }
    re = /[A-ZĄĆĘŁŃÓŚŹŻÉÖÜßČĎÉĚÍŇÓŘŠŤÚŽÝŮÀÂÆÇÈÉÊËÎÏÔÙÛÜ]/g;
    diff = (((_ref = newValue.match(re)) != null ? _ref.length : void 0) || 0) - (((_ref1 = oldValue.match(re)) != null ? _ref1.length : void 0) || 0);
    if (diff > 0) {
      this.data.wpisanychDuzychZnakow++;
    }
    re = /[a-ząćęłńóśźżéöüßčďéěíňóřšťúžýůàâæçèéêëîïôùûü]/g;
    diff = (((_ref2 = newValue.match(re)) != null ? _ref2.length : void 0) || 0) - (((_ref3 = oldValue.match(re)) != null ? _ref3.length : void 0) || 0);
    if (diff > 0) {
      return this.data.wpisanychMalychZnakow++;
    }
  };

  Field.prototype.test = function() {
    return console.log(angular.toJson(this.data));
  };

  return Field;

})();

'Use strict';
UserTracking.FieldDTO = (function() {
  function FieldDTO(pole, strona, formularz) {
    this.pole = pole;
    this.strona = strona;
    this.formularz = formularz;
    if (this.pole == null) {
      this.pole = null;
    }
    if (this.strona == null) {
      this.strona = null;
    }
    if (this.formularz == null) {
      this.formularz = null;
    }
    this.liczbaWejsc = 0;
    this.czasFokusa = 0;
    this.zdarzenia = {};
    this.wpisanychDuzychZnakow = 0;
    this.wpisanychMalychZnakow = 0;
    this.wpisanychZnakow = 0;
    this.skasowanychZnakow = 0;
  }

  return FieldDTO;

})();
