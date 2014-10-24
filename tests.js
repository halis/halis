
QUnit.test("query", function( assert ) {
  var x = { 
    a: { 
      b: [{name: 'steve'}, {name: 'bill'}, {name: 'joe'}],
    }
  };
  assert.equal('a.b.2.name'.query(x), 'joe');
  assert.equal('a.b.2.age'.query(x), undefined);
  assert.equal(halis.getProp(x, 'a.b.2.name'), 'joe');
  assert.equal(halis.getProp(x, 'a.b.2.age'), undefined);
});

QUnit.test("escapeForRegex", function( assert ) {
  var x = '^hello$';
  assert.equal(x.escapeForRegex(), '\\^hello\\$');
  assert.equal('hello'.escapeForRegex(), 'hello');
});

QUnit.test("startsWith", function( assert ) {
  var x = 'Hello';
  assert.equal(x.startsWith('h'), true);
  assert.equal(x.startsWith('l'), false);
  assert.equal(x.startsWith('o'), false);
});

QUnit.test("endsWith", function( assert ) {
  var x = 'Hello';
  assert.equal(x.endsWith('H'), false);
  assert.equal(x.endsWith('l'), false);
  assert.equal(x.endsWith('o'), true);
});

QUnit.test("contains", function( assert ) {
  var x = 'Hello';
  assert.equal(x.contains('LL'), true);
  assert.equal(x.contains('f'), false);
});

QUnit.test("isEmptyOrWhiteSpace", function( assert ) {
  assert.equal('x'.isEmptyOrWhiteSpace(), false);
  assert.equal(''.isEmptyOrWhiteSpace(), true);
  assert.equal('  '.isEmptyOrWhiteSpace(), true);
  assert.equal(' a '.isEmptyOrWhiteSpace(), false);
});

QUnit.test("format", function( assert ) {
  assert.equal('hello {0}{1}{1}'.format('world', '!'), 'hello world!!');
  assert.equal('{{hi}}there'.format('there'), '{hi}there');
  assert.equal('{0}{1}'.format('{1}', '{0}'), '{1}{0}');
});

QUnit.test("repeat", function( assert ) {
  assert.equal('hello '.repeat(3), 'hello hello hello ');
  assert.equal('<div></div>'.repeat(3), '<div></div><div></div><div></div>');
});

QUnit.test("slugify", function( assert ) {
  assert.equal('Some$Really%Obnoxious---Thing'.slugify(), 'some-really-obnoxious-thing');
});

QUnit.test("parseUrl", function( assert ) {
  var x = 'http://www.google.com?hello=world&whats=up'.parseUrl();
  assert.equal(halis.is(x, HTMLAnchorElement), true);
  assert.equal(halis.is(x.attributes, NamedNodeMap), true);
});

QUnit.test("el", function( assert ) {
  var x = 'div'.el();
  assert.equal(halis.is(x, HTMLDivElement), true);
  assert.equal(halis.is(x.attributes, NamedNodeMap), true);
});

QUnit.test("toDecimal", function( assert ) {
  var x = 5; 
  assert.equal(x.toDecimal(3), '5.000');
  assert.equal(x.toDecimal(0), '5');
});

QUnit.test("toCurrency", function( assert ) {
  var x = 5; 
  assert.equal(x.toCurrency(2), '$5.00');
  assert.equal(x.toCurrency(0), '$5');
});

QUnit.test("contains", function( assert ) {
  var x = [1,2,3,4,5]; 
  assert.equal(x.contains(4), true);
  assert.equal(x.contains(6), false);
});

QUnit.test("removeAt", function( assert ) {
  var x = [1,2,3,4,5];
  x.removeAt(1);
  assert.equal(x.length, 4);
  assert.equal(x[0], 1);
  assert.equal(x[1], 3);
  assert.equal(x[2], 4);
  assert.equal(x[3], 5);
});

QUnit.test("toShortDateString", function( assert ) {
  var x = new Date(2014,0,1,4,30,0,0); 
  assert.equal(x.toShortDateString(), '1/1/2014');
});

QUnit.test("toShortTimeString", function( assert ) {
  var x = new Date(2014,0,1,4,30,0,0); 
  assert.equal(x.toShortTimeString(), '4:30 AM');
});

QUnit.test("toShortDateTimeString", function( assert ) {
  var x = new Date(2014,0,1,4,30,0,0); 
  assert.equal(x.toShortDateTimeString(), '1/1/2014 4:30 AM');
});

QUnit.test("toSortString", function( assert ) {
  var x = new Date(2014,0,1,4,30,0,0); 
  assert.equal(x.toSortString(), '2014:00:01:04:30:00:000');
});
