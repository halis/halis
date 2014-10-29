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

To run the tests run:
```
git clone https://github.com/halis/halis.git
```
and then open test.html in a browser

So what can we do?
---
```javascript
var x = { hello: { world: { whats: { up: 'nothing much' } } } };
'hello.world.whats.up'.query(x);
// "nothing much"
// OR
halis.getProp(x, 'hello.world.whats.up');
// "nothing much"
```
---
```javascript
'^Hello$'.escapeForRegex();
// "\^Hello\$" for when you want to create a RegExp with the constructor
```
---
```javascript
'Hello'.startsWith('h');
// true
```
---
```javascript
'Hello'.endsWith('h');
// false
```
---
```javascript
'Hello'.contains('l');
// true
```
---
```javascript
'    '.isEmptyOrWhiteSpace();
// true
```
---
```javascript
'Hello{0}{1}{0}'.format(' ', 'World');
// "Hello World "
```
---
```javascript
'yoho '.repeat(2);
// "yoho yoho "
```
---
```javascript
'Some$Really%Obnoxious---Thing'.slugify();
// "some-really-obnoxious-thing"
```
---
```javascript
'http://www.google.com?hello=world&whats=up'.parseUrl();
// parseUrl returns an HTMLAnchorElement, with two additions:
// .parameterArray = array of key/values in query string
// .parameterObject = object with key/values
```
---
```javascript
'div'.el();
// Returns HTMLDivElement
```
---
```javascript
var x = 5; x.toDecimal(3);
// "5.000"
var x = 5; x.toCurrency();
// "$5.00"

// Both of these have culture options available
```
---
```javascript
[1,2,3,4,5].contains(4);
// true
```
---
```javascript
[1,2,3,4,5].removeAt(1);
// [1,3,4,5]
```
---
```javascript
new Date().toShortDateString();
// "10/16/2014"
```
---
```javascript
new Date().toShortTimeString()
// "12:34 AM"
```
---
```javascript
new Date().toShortDateTimeString();
// "10/16/2014 12:10 PM"
```
---
```javascript
new Date().toSortString();
// "2014:09:16:00:10:11:202"
```
---
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
---
```javascript
halis.isArrayAndNotEmptyOrThrow([]);
// "value is empty"

halis.isObjectAndNotEmptyOrThrow({});
// undefined, nothing happens

halis.isStringAndNotEmptyOrThrow({});
// "value is not of type String"
```
---
```javascript
halis.query.id('') // getElementById()
halis.q.class('') // getElementsByClassName(), can use q instead of query
halis.query.tag('') // getElementsByTagName()
halis.query.name('') // getElementsByName()
halis.query.all('') // querySelectorAll()

// id, class, tag, name and all can be replaced with the first letter
// earlier we mentioned you can do halis or h
// and query or q
// so the first query above can be shortened to h.q.i(''), so on and so forth

// all these methods query the DOM and return an HTMLCollection
// (so you can operate on an array like jQuery)
// native methods much faster than jQuery
```
---
```javascript
// These methods are similar to what you use in jQuery
// they operate on an HtmlCollection, which is what the halis query methods return
  .html(html)   // sets html (or gets if html null or undefined)
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
---
```javascript
// halis.fn has convenience methods to operate on one HTMLElement
// these will be delegated to run on an entire HtmlCollection

halis.fn.get(el) // returns value of element no matter the type
// and in turn
HtmlCollection.get()
```
---
```javascript
h.ajax.post( url, data, successFn, errorFn );
h.ajax.put( url, data, successFn, errorFn );
h.ajax.get( url, successFn, errorFn );
h.ajax.delete( url, data, successFn, errorFn );

// lightweight ajax wrapper
```
---
```javascript
return halis.cancelEvent(e);
// e.preventDefault, e.stopImmediatePropagation, return false
```
---
```html
<head>
  <script type="text/template" id="firstTemplate" name="first">
    <div>Hello</div>
  </script>
  <script type="text/template" id="secondTemplate" name="second">
    <div>There</div>
  </script>
  <script type="text/template" id="thirdTemplate" name="third">
    <div>World</div>
  </script>
</head>
```
```javascript
// You may extract the above templates from the head element like so:
halis.getTemplates();
// The templates will reside at halis.templates
// Note that the name attribute is required

// Object {first: "<div>Hello</div>", second: "<div>There</div>", third: "<div>World</div>"}
// Also note that the templates will be removed from the dom
```
---
```javascript
halis.namespace('halis.hello.world');
// will create halis.hello = { world: {} };
// will not overwrite anything that exists
// (this is why it does not overwrite halis)
```
---
```javascript

  // If we have an empty object x and the following constructors:

  var x = {};

  function Cell() {
    this.x = 0;
    this.y = 0;
  };

  function HeaderCell() {
    this.HeaderText = '';
  };

  // And we want to achieve multiple inheritance or composition
  // Then we can do that with:

  halis.compose(x, [Cell, HeaderCell]);
  // Object {x: 0, y: 0, HeaderText: ""}
```
---
```javascript
// halis.throw = function( msg, showStackTrace ) {
// Note: showStackTrace defaults to true

h.throw('test');
Error
    at Object.halis.throw (file:///C:/halis/halis.js:754:47)
    at <anonymous>:2:8
    at Object.InjectedScript._evaluateOn (<anonymous>:732:137)
    at Object.InjectedScript._evaluateAndWrap (<anonymous>:665:34)
    at Object.InjectedScript.evaluate (<anonymous>:579:21) halis.js:754
Uncaught test

h.throw('test', false);
Uncaught test 

// halis also uses this throw method internally now, in functions like isStringOrThrow
// there is a config option:
<script type="text/javascript">
  window.halisConfig = {
    logInsteadOfThrow: true,
  };
</script>
<script type='text/javascript' src='./halis.js'></script>
// if this is set in halisConfig (in a script tag before halis.js is loaded)
// then anytime halis.throw is called it will log to the console instead of throw
```
---
```javascript
// If we have the following constructor and factory functions:
function Cell() {
  this.x = 0;
  this.y = 0;
};

function CellFactory( constructorFn ) {
  var result;
  result = new constructorFn();
  result.x += 1;
  result.y += 1;
  return result;
};
// Note that when you write your factory function
// you need to pass in the constructorFn (somewhere) 
// and use that instead of referencing Cell directly

// then we can register these in halis.plans via:
// halis.engineer = function( constructorFn, factoryFn ) {

halis.engineer(Cell, CellFactory);
// Object {plan: function, builder: function, build: function}

// When you need a new Cell you can simply call:
halis.plans.Cell.build()
// Cell {x: 1, y: 1}

```