
(function( _, halisConfig ) {
	var ns;
  
  (function() {
    var globalNS, conflict;
    globalNS = halisConfig.namespace || 'halis';
    if (window[globalNS]) {
      conflict = window[globalNS];
    }
    ns = window[globalNS] = {};

    if (!window.h) window.h = ns;

    ns.noConflict = function() {
      if (conflict) {
        window[globalNS] = conflict;
      }

      return this;
    };
    delete window.halisConfig;
  }());

	ns.typeNames = {
		Boolean: 'Boolean',
		Number: 'Number',
		String: 'String',
		Date: 'Date',
		RegExp: 'RegExp',
		Array: 'Array',
		Object: 'Object',
		Element: 'Element',
		Function: 'Function',
	};
	ns.types = _.keys(ns.typeNames);

  String.prototype.isEmptyOrWhiteSpace = String.prototype.isEmptyOrWhiteSpace || function() {
    return this.trim() === '';
  };

  String.prototype.format = String.prototype.format || function() {
    var args, regex, esc, lb, rb, lbReplace, rbReplace, argReplace, ctr, that, delimiter;

    that = this;
    if (that.isEmptyOrWhiteSpace()) return that;
    args = _.toArray(arguments);
    if (!args || !args.length) return that;

    esc = '\\';
    lb = '{';
    rb = '}';
    that = that.toString();

    delimiter = '##%%';
    regex = new RegExp(esc + lb + esc + lb, 'g');
    lbReplace = delimiter + 'leftbracketreplace' + delimiter;
    that = that.replace(regex, lbReplace);

    regex = new RegExp(esc + rb + esc + rb, 'g');
    rbReplace = delimiter + 'rightbracketreplace' + delimiter;
    that = that.replace(regex, rbReplace);

    ctr = 0;
    _.each(args, function( arg ) {
      if (!_.isString(arg)) arg = arg.toString();

      argReplace = delimiter + ctr.toString() + delimiter;
      regex = new RegExp(esc + lb + ctr.toString() + esc + rb, 'g');
      that = that.replace(regex, argReplace);
      ctr++;
    }.bind(that));

    ctr = 0;
    _.each(args, function( arg ) {
      argReplace = delimiter + ctr.toString() + delimiter;
      regex = new RegExp(argReplace, 'g');
      that = that.replace(regex, arg);
      ctr++;
    }.bind(that));

    regex = new RegExp(lbReplace, 'g');
    that = that.replace(regex, lb);
    
    regex = new RegExp(rbReplace, 'g');
    that = that.replace(regex, rb);

    return that;
  };

  Array.prototype.contains = Array.prototype.contains || function( val ) {
    return this.indexOf(val) !== -1;
  };

  Date.prototype.toShortDateString = Date.prototype.toShortDateString || function() {
    return [this.getMonth() + 1, 
            this.getDate(), 
            this.getFullYear()
           ].join('/');
  };

  Date.prototype.toShortTimeString = Date.prototype.toShortTimeString || function() {
    var hours = this.getHours();

    return [hours - 12, 
            this.getMinutes()
           ].join(':') + ' ' + (hours < 12 ? 'AM' : 'PM');
  };

  Date.prototype.toShortDateTimeString = Date.prototype.toShortDateTimeString || function() {
    return this.toShortDateString() + ' ' + this.toShortTimeString();
  }

  Date.prototype.toSortString = Date.prototype.toSortString || function() {
    var month, date, hours, minutes, seconds, ms;

    month = this.getMonth();
    date = this.getDate();
    hours = this.getHours();
    minutes = this.getMinutes();
    seconds = this.getSeconds();
    ms = this.getMilliseconds();

    function pad( num ) {
      if (num > 9) return num.toString();
      else return '0' + num;
    }

    function padMS( num ) {
      if (num > 99) return num.toString();
      else if (num > 9) return '0' + num;
      else return '00' + num;
    }

    return [this.getFullYear(),
            pad(month),
            pad(date),
            pad(hours),
            pad(minutes),
            pad(seconds),
            padMS(ms)
           ].join(':');
  };

	_.each(ns.types, function( type ) {
    var fn, fnName;

    fn = 'is{0}'.format(type);
    fnName = '{0}OrThrow'.format(fn);

		ns[fnName] = function( obj ) {
      if (!_[fn](obj)) throw 'value is not of type {0}'.format(type);
    };
	});

  ns.isArrayAndNotEmptyOrThrow = function( obj ) {
    ns.isArrayOrThrow(obj);
    if (_.isEmpty(obj)) throw 'value is empty';
  };

  ns.isObjectAndNotEmptyOrThrow = function( obj ) {
    ns.isObjectOrThrow(obj);
    if (_.isEmpty(obj)) throw 'value is empty';
  };

  ns.isStringNotEmptyOrThrow = function( obj ) {
    ns.isStringOrThrow(obj);
    if (obj.isEmptyOrWhiteSpace()) throw 'value is empty';
  };

  function HtmlCollection( arr ) {
    var that = this, h = {};
    ns.isArrayOrThrow(arr);
    that.elements = arr;

    that.pop = function() {
      return that.elements.pop();
    };

    that.push = function( val ) {
      that.elements.push(val);
      return that.elements;
    };

    return that;
  }

  function query( q, fnName ) {
    ns.isStringOrThrow(q);
    return new HtmlCollection(_.toArray(document[fnName](q)));
  }

  ns.$ = {
    id: function( id ) {
      var el;
      ns.isStringOrThrow(id);
      el = d.getElementById(id);
      return new HtmlCollection(el ? [el] : []);
    },
    klass: function( className ) {
      return query(className, 'getElementsByClassName');
    },
    tag: function( tagName ) {
      return query(tagName, 'getElementsByTagName');
    },
    name: function( name ) {
      return query(name, 'getElementsByName');
    },
    query: function( qry ) {
      return query(qry, 'querySelectorAll');
    },
  };

  HtmlCollection.prototype.html = function( html ) {
    ns.isStringOrThrow(html);
    _.each(this.elements, function( el ) {
      el.innerHTML = html;
    });
  };

  HtmlCollection.prototype.append = function( html ) {
    ns.isStringOrThrow(html);
    _.each(this.elements, function( el ) {
      el.innerHTML += html;
    });
  };

  HtmlCollection.prototype.empty = function() {
    _.each(this.elements, function( el ) {
      el.innerHTML = '';
    });
  };

  HtmlCollection.prototype.text = function( text ) {
    ns.isStringOrThrow(text);
    _.each(this.elements, function( el ) {
      el.innerText = text;
    });
  };

  HtmlCollection.prototype.attr = function( attr, val ) {
    var result;

    ns.isStringOrThrow(attr);

    if (val !== undefined) {
      _.each(this.elements, function( el ) {
        el.setAttribute(attr, val);
      });
      return;
    }

    result = [];
    _.each(this.elements, function( el ) {
      result.push(el.getAttribute(attr));
    });

    return result;
  };

  HtmlCollection.prototype.on = function( eventName, fn ) {
    var result;

    ns.isStringOrThrow(eventName);
    ns.isFunctionOrThrow(fn);

    _.each(this.elements, function( el ) {
      el.addEventListener(eventName, fn, false);

      if (!el.handlers) el.handlers = new HtmlHandlers(el);
      el.handlers.add(eventName, fn);
    });
  };

  HtmlCollection.prototype.off = function( eventName ) {
    var handlers;

    ns.isStringOrThrow(eventName);

    _.each(this.elements, function( el ) {
      handlers = el.handlers.get()[eventName];
      _.each(handlers, function( handler ) {
        el.removeEventListener(eventName, handler);
      });
      if (!el.handlers) el.handlers = new HtmlHandlers(el);
      el.handlers.remove(eventName);
    });
  };

  HtmlCollection.prototype.trigger = function( eventName ) {
    ns.isStringOrThrow(eventName);

    _.each(this.elements, function( el ) {
      if (el[eventName] && _.isFunction(el[eventName])) el[eventName]();
    });
  };

  function HtmlHandlers( el ) {
    var that = this;

    that.el = el;
    that.handlers = {};

    that.get = function() {
      return that.handlers;
    };

    that.add = function( eventName, handler ) {
      if (that.handlers[eventName]) that.handlers[eventName].push(handler);
      else that.handlers[eventName] = [handler];
    };

    that.remove = function( eventName ) {
      delete that.handlers[eventName];
    };

    return that;
  }

  ns.cancelEvent = function( e ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  };

}(_, window.halisConfig));
