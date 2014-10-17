
(function( _, halisConfig ) {
  var halis, pro;
  
  (function() {
    var globalNS, conflict;
    globalNS = halisConfig.namespace || 'halis';
    if (window[globalNS]) {
      conflict = window[globalNS];
    }
    halis = window[globalNS] = {};

    if (!window.h) window.h = halis;

    halis.noConflict = function() {
      if (conflict) {
        window[globalNS] = conflict;
      }

      return this;
    };
    delete window.halisConfig;
  }());

  halis.typeNames = {
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
  halis.types = _.keys(halis.typeNames);

  pro = String.prototype;
  pro.query = pro.query || function( obj ) {
    var parts, part, result, q;
    halis.isObjectOrThrow(obj);
    if (this.endsWith('.') || this.startsWith('.')) throw 'invalid query';
    if (this.match(/[^a-zA-Z0-9\_\$\.]/)) throw 'invalid query';

    if (_.isEmpty(obj) || this.isEmptyOrWhiteSpace()) return;
    if (!this.contains('.')) return obj[this];
    parts = this.split('.');

    result = obj;
    while (parts.length) {
      part = parts.shift();

      if (_.isNaN(+part) === false) part = +part;
      result = result[part];
      if (result === undefined) return;
    }

    return result;
  };

  halis.getProp = function( obj, qry ) {
    halis.isStringOrThrow(qry);
    return qry.query(obj);
  };

  function matchFn( regex ) {
    if (this.trim() === '') return false;
    if (this.match(regex)) return true;
    return false;
  }

  pro.escapeForRegex = pro.escapeForRegex || function() {
    halis.isStringOrThrow(this);
    return this.replace(/([()[{*+.$^\\|?])/g, '\\$1');
  };

  pro.startsWith = pro.startsWith || function( str ) {
    halis.isStringOrThrow(str);
    return matchFn.bind(this)(new RegExp('^' + str.escapeForRegex(), 'i'));
  };

  pro.endsWith = pro.endsWith || function( str ) {
    halis.isStringOrThrow(str);
    return matchFn.bind(this)(new RegExp(str.escapeForRegex() + '$', 'i'));
  };

  pro.contains = pro.contains || function( str ) {
    halis.isStringOrThrow(str);
    return matchFn.bind(this)(new RegExp(str.escapeForRegex(), 'i'));
  };

  pro.isEmptyOrWhiteSpace = pro.isEmptyOrWhiteSpace || function() {
    return this.trim() === '';
  };

  pro.format = pro.format || function() {
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

  pro.repeat = function( num ) {
    halis.isNumberOrThrow(num);
    if (num < 1) return '';
    return new Array(num + 1).join(this);
  };

  pro.slugify = function() {
    var result;
    if (this.isEmptyOrWhiteSpace()) return '';

    result = this.toLowerCase().trim();
    result = result.replace(/[^a-zA-Z0-9\s]/g, ' ');
    result = result.trim();
    result = result.replace(/\s+/g, ' ');
    result = result.replace(/\s+/g, '-');
    result = result.replace(/\-+/g, '-');

    return result;
  };

  pro.parseUrl = pro.parseUrl || function() {
    var anchor;

    if (this.isEmptyOrWhiteSpace()) return null;

    anchor = document.createElement('a');
    anchor.href = this.trim().toLowerCase();

    anchor.parameterObject = {};
    anchor.parameterArray = [];
    if (!anchor.search.isEmptyOrWhiteSpace()) {
      _.each(anchor.search.substr(1).split('&'), function( kvPair ) {
        var parts;
        kvPair = kvPair.trim();
        parts = kvPair.split('=');
        anchor.parameterArray.push({
          key: parts[0],
          value: parts[1],
        });
        anchor.parameterObject[parts[0]] = parts[1];
      });
    }

    return anchor;
  };

  pro.el = pro.el || function() {
    if (this.isEmptyOrWhiteSpace()) return null;
    return document.createElement(this.trim().toLowerCase());
  };

  function numberFormatFn( decimalPlaces, cultureString, currencyCode ) {
    var result, currentPlaces, neededPlaces;
    decimalPlaces = _.isNumber(decimalPlaces) ? decimalPlaces : 2;
    cultureString = cultureString || 'en-US';
    halis.isStringOrThrow(cultureString);
    halis.isNumberOrThrow(decimalPlaces);

    result = this.toFixed(decimalPlaces);
    if (currencyCode) {
      result = this.toLocaleString(cultureString, { style: 'currency', currency: currencyCode });
    } else {
      result = this.toLocaleString(cultureString);
    }

    if (!result.contains('.')) {
      if (decimalPlaces > 0) {
        result += '.';
        result += '0'.repeat(decimalPlaces);
      }
    } else {
      if (result.endsWith('.')) {
        result += '0'.repeat(decimalPlaces);
      } else {
        if (decimalPlaces === 0) {
          result = result.replace(/\.\d+/, '');
        } else {
          currentPlaces = result.match(/\.\d+/).pop().substring(1).length;
          neededPlaces = decimalPlaces - currentPlaces;
          if (neededPlaces < 1) {
            result = result.substr(0, result.length + neededPlaces);
          } else {
            result += '0'.repeat(neededPlaces);
          }
        }
      }
    }

    return result;
  }

  pro = Number.prototype;
  pro.toDecimal = pro.toDecimal || function( decimalPlaces, cultureString ) {
    return numberFormatFn.bind(this)(decimalPlaces, cultureString, null);
  };

  pro.toCurrency = pro.toCurrency || function( decimalPlaces, cultureString, currencyCode ) {
    return numberFormatFn.bind(this)(decimalPlaces, cultureString, currencyCode || 'USD');
  };

  pro = Array.prototype;
  pro.contains = pro.contains || function( val ) {
    return this.indexOf(val) !== -1;
  };

  pro.removeAt = pro.removeAt || function( index ) {
    halis.isNumberOrThrow(index);
    if (index < 0) throw 'out of bounds';
    if (index >= this.length) throw 'out of bounds';
    if (!this.length) return this;
    this.splice(index, 1);
    return this;
  };

  pro = Date.prototype;
  pro.toShortDateString = pro.toShortDateString || function() {
    return [this.getMonth() + 1, 
            this.getDate(), 
            this.getFullYear()
           ].join('/');
  };

  function pad( num ) {
    if (num > 9) return num.toString();
    else return '0' + num;
  }

  pro.toShortTimeString = pro.toShortTimeString || function() {
    var hours = this.getHours();

    if (hours === 0) hours = 12;
    else if (hours > 12) hours -= 12;

    return [hours, 
            pad(this.getMinutes())
           ].join(':') + ' ' + (hours < 12 ? 'AM' : 'PM');
  };

  pro.toShortDateTimeString = pro.toShortDateTimeString || function() {
    return this.toShortDateString() + ' ' + this.toShortTimeString();
  }

  pro.toSortString = pro.toSortString || function() {
    var month, date, hours, minutes, seconds, ms;

    month = this.getMonth();
    date = this.getDate();
    hours = this.getHours();
    minutes = this.getMinutes();
    seconds = this.getSeconds();
    ms = this.getMilliseconds();

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

  _.each(halis.types, function( type ) {
    var fn, fnName;

    fn = 'is{0}'.format(type);
    fnName = '{0}OrThrow'.format(fn);

    halis[fnName] = function( obj ) {
      if (!_[fn](obj)) throw 'value is not of type {0}'.format(type);
    };
  });
  pro = null;

  halis.isArrayAndNotEmptyOrThrow = function( obj ) {
    halis.isArrayOrThrow(obj);
    if (_.isEmpty(obj)) throw 'value is empty';
  };

  halis.isObjectAndNotEmptyOrThrow = function( obj ) {
    halis.isObjectOrThrow(obj);
    if (_.isEmpty(obj)) throw 'value is empty';
  };

  halis.isStringAndNotEmptyOrThrow = function( obj ) {
    halis.isStringOrThrow(obj);
    if (obj.isEmptyOrWhiteSpace()) throw 'value is empty';
  };

  function HtmlCollection( arr ) {
    var that = this, h = {};
    halis.isArrayOrThrow(arr);
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
    halis.isStringOrThrow(q);
    return new HtmlCollection(_.toArray(document[fnName](q)));
  }

  halis.q = halis.query = {};

  halis.q.i = halis.q.id = function( id ) {
    var el;
    halis.isStringOrThrow(id);
    el = document.getElementById(id);
    return new HtmlCollection(el ? [el] : []);
  };

  halis.q.c = halis.q.class = function( className ) {
    return query(className, 'getElementsByClassName');
  };

  halis.q.t = halis.q.tag = function( tagName ) {
    return query(tagName, 'getElementsByTagName');
  };

  halis.q.n = halis.q.name = function( name ) {
    return query(name, 'getElementsByName');
  };

  halis.q.a = halis.q.all = function( qry ) {
    return query(qry, 'querySelectorAll');
  };

  function ajaxFn( method, url, data, successFn, errorFn ) {
    var xhr;

    _.isStringOrThrow(url);
    if (successFn) _.isFunctionOrThrow(successFn);
    if (errorFn) _.isFunctionOrThrow(errorFn);

    xhr = new XMLHttpRequest();
    xhr.open(method, url);

    if (successFn || errorFn) {
      xhr.onreadystatechange = function ( data ) {
        var success, fn;
        if (xhr.readyState !== 4) return;

        success = xhr.status >= 200 && xhr.status < 300 || xhr.status === 304;
        if (success) fn = successFn;
        else fn = errorFn;

        fn.apply(this, [data, xhr]);
      }
    }

    if (data) xhr.send({ data: data });
    else xhr.send();
  }

  halis.ajax = {
    get: function( url, successFn, errorFn ) {
      ajaxFn('GET', url, null, successFn, errorFn);
    },
    post: function( url, data, successFn, errorFn ) {
      ajaxFn('POST', url, data, successFn, errorFn);
    },
    put: function( url, data, successFn, errorFn ) {
      ajaxFn('PUT', url, data, successFn, errorFn);
    },
    delete: function( url, data, successFn, errorFn ) {
      ajaxFn('DELETE', url, data, successFn, errorFn);
    }
  };

  halis.is = function(obj, type) {
    halis.isObjectOrThrow(obj);
    halis.isObjectOrThrow(type);

    return obj instanceof type; 
  };

  HtmlCollection.prototype.html = function( html ) {
    halis.isStringOrThrow(html);
    _.each(this.elements, function( el ) {
      el.innerHTML = html;
    });

    return this;
  };

  HtmlCollection.prototype.append = function( html ) {
    halis.isStringOrThrow(html);
    _.each(this.elements, function( el ) {
      el.innerHTML += html;
    });

    return this;
  };

  HtmlCollection.prototype.empty = function() {
    _.each(this.elements, function( el ) {
      el.innerHTML = '';
    });

    return this;
  };

  HtmlCollection.prototype.text = function( text ) {
    halis.isStringOrThrow(text);
    _.each(this.elements, function( el ) {
      el.innerText = text;
    });

    return this;
  };

  HtmlCollection.prototype.attr = function( attr, val ) {
    var result;

    halis.isStringOrThrow(attr);

    if (val !== undefined) {
      _.each(this.elements, function( el ) {
        el.setAttribute(attr, val);
      });
      return this;
    }

    result = [];
    _.each(this.elements, function( el ) {
      result.push(el.getAttribute(attr));
    });

    return result;
  };

  HtmlCollection.prototype.attrs = function( attrs ) {
    halis.isObjectOrThrow(attrs);

    _.each(_.keys(attrs), function( key ) {
      this.attr(key, attrs[key]);
    }.bind(this));

    return this;
  };

  HtmlCollection.prototype.on = function( eventName, fn ) {
    var result;

    halis.isStringOrThrow(eventName);
    halis.isFunctionOrThrow(fn);

    _.each(this.elements, function( el ) {
      el.addEventListener(eventName, fn, false);

      if (!el.handlers) el.handlers = new HtmlHandlers(el);
      el.handlers.add(eventName, fn);
    });

    return this;
  };

  HtmlCollection.prototype.off = function( eventName ) {
    var handlers;

    halis.isStringOrThrow(eventName);

    _.each(this.elements, function( el ) {
      handlers = el.handlers.get()[eventName];
      _.each(handlers, function( handler ) {
        el.removeEventListener(eventName, handler);
      });
      if (!el.handlers) el.handlers = new HtmlHandlers(el);
      el.handlers.remove(eventName);
    });

    return this;
  };

  HtmlCollection.prototype.trigger = function( eventName ) {
    halis.isStringOrThrow(eventName);

    _.each(this.elements, function( el ) {
      if (el[eventName] && _.isFunction(el[eventName])) el[eventName]();
    });

    return this;
  };

  function classFn( className, fnName ) {
    halis.isStringNotEmptyOrThrow(className);

    _.each(this.elements, function( el ) {
      el.classList[fnName](className);
    });

    return this;
  }

  HtmlCollection.prototype.addClass = function( className ) {
    return classFn.bind(this)(className, 'add');
  };

  HtmlCollection.prototype.removeClass = function( className ) {
    return classFn.bind(this)(className, 'remove');
  };

  HtmlCollection.prototype.toggleClass = function( className ) {
    return classFn.bind(this)(className, 'toggle');
  };

  function cloneFn( deep ) {
    var result;

    halis.isBooleanOrThrow(deep);

    result = [];
    _.each(this.elements, function( el ) {
      result.push(el.cloneNode(deep));
    });

    return new HtmlCollection(result);
  }

  HtmlCollection.prototype.clone = function( ) {
    return cloneFn.bind(this)(true);
  };

  HtmlCollection.prototype.cloneShallow = function( ) {
    return cloneFn.bind(this)(false);
  };

  function siblingFn( fnName ) {
    var result;

    result = [];
    _.each(this.elements, function( el ) {
      result.push(el[fnName]);
    });

    return new HtmlCollection(result);
  }

  HtmlCollection.prototype.prev = function( ) {
    return siblingFn.bind(this)('previousElementSibling');
  };

  HtmlCollection.prototype.next = function( ) {
    return siblingFn.bind(this)('nextElementSibling');
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

  HtmlCollection.prototype.get = function() {
    var result = [];

    _.each(this.elements, function( el ) {
      if (halis.is(el, HTMLInputElement)) {
        if (el.type.toLowerCase() === 'checkbox') {
          result.push(el.checked);
        } else if (el.type.toLowerCase() === 'textbox') {
          result.push(el.value);
        }
      } else if (halis.is(el, HTMLSelectElement)) {
        result.push(el.value);
      }
    });

    return result;
  };

  halis.cancelEvent = function( e ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  };

}(_, window.halisConfig));
