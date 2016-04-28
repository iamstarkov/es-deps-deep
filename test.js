/* eslint-disable no-multi-spaces, max-len */
import test from 'ava';
import esDepsDeep from './index';
import { esDepUnitMock } from 'es-dep-unit';

test('basic one', async t => {
  const _ = await esDepsDeep('./fixtures/basic/first/second/index.js');
  const dep = esDepUnitMock(['fixtures', 'basic']);
  t.deepEqual(_[0], dep(null, null, './first/second/index.js'));
  t.is(_.length, 1);
});

test('basic two', async t => {
  const _ = await esDepsDeep('./fixtures/basic/first/index.js');
  const dep = esDepUnitMock(['fixtures', 'basic']);
  t.deepEqual(_[0], dep(null, null, './first/index.js'));
  t.deepEqual(_[1], dep('./second/index.js', './first/index.js', './first/second/index.js'));
  t.is(_.length, 2);
});

test('basic three', async t => {
  const _ = await esDepsDeep('./fixtures/basic/index.js');
  const dep = esDepUnitMock(['fixtures', 'basic']);
  t.deepEqual(_[0], dep(null, null, './index.js'));
  t.deepEqual(_[1], dep('./first/index.js', './index.js', './first/index.js'));
  t.deepEqual(_[2], dep('./second/index.js', './first/index.js', './first/second/index.js'));
  t.is(_.length, 3);
});

test('basic plus', async t => {
  const _ = await esDepsDeep('./fixtures/basic-plus/index.js');
  const dep = esDepUnitMock(['fixtures', 'basic-plus']);
  t.deepEqual(_[0], dep(null, null, './index.js'));
  t.deepEqual(_[1], dep('./first/index.js',  './index.js',              './first/index.js'));
  t.deepEqual(_[2], dep('./second/index.js', './first/index.js',        './first/second/index.js'));
  t.deepEqual(_[3], dep('./three/index.js',  './first/second/index.js', './first/second/three/index.js'));
  t.is(_.length, 4);
});

test('extended', async t => {
  const _ = await esDepsDeep('./fixtures/extended/index.js');
  const dep = esDepUnitMock(['fixtures', 'extended']);
  t.deepEqual(_[0], dep(null, null, './index.js'));
  t.deepEqual(_[1], dep('./first/index.js', './index.js', './first/index.js'));
  t.deepEqual(_[2], dep('./second/index.js', './first/index.js', './first/second/index.js'));
  t.deepEqual(_[3], dep('../third/index.js', './first/index.js', './third/index.js'));
  t.deepEqual(_[4], dep('../first/fourth/index.js', './third/index.js', './first/fourth/index.js'));
  t.is(_.length, 5);
});

test('resolve', async t => {
  const _ = await esDepsDeep('./fixtures/resolve');
  const dep = esDepUnitMock(['fixtures', 'resolve']);
  t.deepEqual(_[0], dep(null, null, './index.js'));
  t.deepEqual(_[1], dep('./a', './index.js', './a.js'));
  t.deepEqual(_[2], dep('./b', './index.js', './b/index.js'));
  t.is(_.length, 3);
});

test('cyclic', async t => {
  const _ = await esDepsDeep('./fixtures/cyclic/main.js');
  const dep = esDepUnitMock(['fixtures', 'cyclic']);
  t.deepEqual(_[0], dep(null, null, './main.js'));
  t.deepEqual(_[1], dep('./a.js', './main.js', './a.js'));
  t.deepEqual(_[2], dep('./b.js', './main.js', './b.js'));
  t.is(_.length, 3);
});

test('modules', async t => {
  const _ = await esDepsDeep('./fixtures/modules');
  const dep = esDepUnitMock(['fixtures', 'modules']);
  t.deepEqual(_[0], dep(null, null, './index.js'));
  t.deepEqual(_[1], dep('deep-modules-unresolved', './index.js', null));
  t.deepEqual(_[2], dep('./pew', './index.js', './pew.js'));
  t.is(_.length, 3);
});

test('modules nested', async t => {
  const _ = await esDepsDeep('./fixtures/modules-nested');
  const dep = esDepUnitMock(['fixtures', 'modules-nested']);
  t.deepEqual(_[0], dep(null, null, './index.js'));
  t.deepEqual(_[1], dep('meow',  './index.js', './node_modules/meow/index.js'));
  t.deepEqual(_[2], dep('purr',  './node_modules/meow/index.js', './node_modules/meow/node_modules/purr/index.js'));
  t.deepEqual(_[3], dep('./pew', './node_modules/meow/index.js', './node_modules/meow/pew/index.js'));
  t.deepEqual(_[4], dep('./pew', './index.js', './pew.js'));
  t.is(_.length, 5);
});

test('missing', async t => {
  const _ = await esDepsDeep('./fixtures/missing');
  const dep = esDepUnitMock(['fixtures', 'missing']);
  t.deepEqual(_[0], dep(null, null, './index.js'));
  t.deepEqual(_[1], dep('./one.js',   './index.js', './one.js'));
  t.deepEqual(_[2], dep('./two.js',   './index.js', './two.js'));
  t.deepEqual(_[3], dep('./extra.js', './index.js', null));
  t.is(_.length, 4);
});

test.todo('exclude x N');

test('builtin', async t => {
  const _ = await esDepsDeep('./fixtures/builtin');
  const dep = esDepUnitMock(['fixtures', 'missing']);
  t.deepEqual(_[0], dep(null, null, './index.js'));
  t.deepEqual(_[1], dep('path',   './index.js', 'path'));
  t.is(_.length, 2);
});

test.todo('json');
test.todo('no-unused-files');
test.todo('no-missed-files');
test.todo('no-unused-modules');
test.todo('no-missed-modules');

test('unresolved', t => t.throws(esDepsDeep('./fixtures/unresolved'), Error));
test('empty input', t => t.throws(esDepsDeep(), TypeError));
test('invalid input', t => t.throws(esDepsDeep(2), TypeError));
test.todo('invalid excludeFn');
