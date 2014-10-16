[halis](https://github.com/halis/halis) — A new fast utility belt for the browser
==================================================


Dependencies
--------------------------------------

[Lo-Dash](http://lodash.com//)


About halis.js
--------------------------------------

Currently, lo-dash (based on [underscore](http://underscorejs.org)) is the only dependency. In the future, this may be factored out as well, depending on how much of it is used. 

The idea of halis is to provide a jQuery-like API that relies more on native function calls, for speed. Also, various utility methods are provided for strings, dates, arrays and checking arguments.


Getting Started
---------------

So what can we do?

```javascript
var x = { hello: { world: { whats: { up: 'nothing much' } } } };
'hello.world.whats.up'.query(x);
// "nothing much"
// OR
halis.getProp(x, 'hello.world.whats.up');
// "nothing much"
```


```javascript
'^Hello$'.escapeForRegex();
// "\^Hello\$" for when you want to create a RegExp with the constructor
```


```javascript
'Hello'.startsWith('h');
// true
```


```javascript
'Hello'.endsWith('h');
// false
```


```javascript
'Hello'.contains('l');
// true
```


```javascript
'    '.isEmptyOrWhiteSpace();
// true
```


```javascript
'Hello{0}{1}{0}'.format(' ', 'World');
// "Hello World "
```


```javascript
'yoho '.repeat(2);
// "yoho yoho "
```


```javascript
'Some$Really%Obnoxious---Thing'.slugify();
// "some-really-obnoxious-thing"
```


```javascript
'http://www.google.com?hello=world&whats=up'.parseUrl();
// parseUrl returns an HTMLAnchorElement, with two additions:
// .parameterArray = array of key/values in query string
// .parameterObject = object with key/values
```


```javascript
'div'.el();
// Returns HTMLDivElement
```


```javascript
var x = 5; x.toDecimal(3);
// "5.000"
var x = 5; x.toCurrency();
// "$5.00"

// Both of these have culture options available
```


```javascript
[1,2,3,4,5].contains(4);
// true
```


```javascript
[1,2,3,4,5].removeAt(1);
// [1,3,4,5]
```


```javascript
new Date().toShortDateString();
// "10/16/2014"
```


```javascript
new Date().toShortTimeString()
// "12:34 AM"
```


```javascript
new Date().toShortDateTimeString();
// "10/16/2014 12:10 PM"
```


```javascript
new Date().toSortString();
// "2014:09:16:00:10:11:202"
```


```javascript
halis.isStringOrThrow('hi');
// undefined, nothing happens

h.isStringOrThrow(2); // instead of halis you can use h
// "value is not of type String", exception
```


```javascript
halis.isArrayAndNotEmptyOrThrow([]);
// "value is empty"
```


```javascript
halis.query.id('') // getElementById()
halis.query.class('') // getElementsByClassName()
halis.query.tag('') // getElementsByTagName()
halis.query.name('') // getElementsByName()
halis.query.all('') // querySelectorAll()

// all these methods query the DOM and return an HTMLCollection
// (so you can operate on an array like jQuery)
// native methods much faster than jQuery
```


```javascript
// These methods operate on HtmlCollection (returned from halis dom query)
  .html(html)   // sets html
  .text(text)   // sets text
  .append(html) // appends html
  .empty()      // empty html
  .attr(name)   // name is optional get/sets attribute like jQuery
  .attrs({names: values}) // set multiple attributes
  .on(evt, fn), .off(evt), .trigger(evt) // eventing on HTMLCollection
  .addClass(name), .removeClass(name), .toggleClass(name)
  .clone(), .cloneShallow()
  .prev(), .next()
```


```javascript
h.ajax.post( url, data, successFn, errorFn );
h.ajax.put( url, data, successFn, errorFn );
h.ajax.get( url, successFn, errorFn );
h.ajax.delete( url, data, successFn, errorFn );

// lightweight ajax wrapper
```


```javascript
return halis.cancelEvent(e);
// prevent defualt, stop propagation, return false
```
