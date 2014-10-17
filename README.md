[halis](https://github.com/halis/halis) — A new fast utility belt for the browser
==================================================


Dependencies
--------------------------------------

[Lo-Dash](http://lodash.com//)


About halis.js
--------------------------------------

Currently, lo-dash (based on [underscore](http://underscorejs.org)) is the only dependency. In the future, this may be factored out as well, depending on how much of it is used. 

The idea of halis is to provide a jQuery-like API that relies more on native function calls, for speed. Also, various utility methods are provided for strings, dates, arrays and checking arguments.


Installation
------------

```javascript
<script src="http://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js"></script>
  <script type="text/javascript">
    window.halisConfig = {
      //namespace: 'h',
    };
  </script>
  <script type='text/javascript' src='./halis.js'></script>
```
Include lodash and halis.js, you may optionally define halisConfig before loading halis.js 
and set the namespace property to tell halis to load under window[namespace] instead of window.halis

halis loads under window.halis by default and window.h (if available) as well

On the off chance that window.halis is set to something already, it is tracked so that you can 
call halis.noConflict() and window.halis will be reverted to its original state and then halis is returned


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

/*
We also have is?OrThrow for the following types
Boolean: 'Boolean',
Number: 'Number',
String: 'String',
Date: 'Date',
RegExp: 'RegExp',
Array: 'Array',
Object: 'Object',
Element: 'Element',
Function: 'Function'

You can access these at halis.types (array) or halis.typeNames (object)
*/
```


```javascript
halis.isArrayAndNotEmptyOrThrow([]);
// "value is empty"

halis.isObjectAndNotEmptyOrThrow({});
// undefined, nothing happens

halis.isStringAndNotEmptyOrThrow({});
// "value is not of type String"
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
// These methods are similar to what you use in jQuery
// they operate on an HtmlCollection, which is what the halis query methods return
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
