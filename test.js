/* eslint-disable no-multi-spaces, max-len */
import test from 'ava';
import R from 'ramda';
import esDepsDeep from './index';
import kit from 'es-dep-kit';
import { mock as depMock } from 'es-dep-unit';

test('basic one', async t => {
  const _ = await esDepsDeep(['./fixtures/basic/first/second/index.js']);
  const dep = depMock(['fixtures', 'basic']);
  t.deepEqual(_[0], dep(null, null, './first/second/index.js'));
  t.is(_.length, 1);
});

test('basic two', async t => {
  const _ = await esDepsDeep(['./fixtures/basic/first/index.js']);
  const dep = depMock(['fixtures', 'basic']);
  t.deepEqual(_[0], dep(null, null, './first/index.js'));
  t.deepEqual(_[1], dep('./second/index.js', './first/index.js', './first/second/index.js'));
  t.is(_.length, 2);
});

test('basic three', async t => {
  const _ = await esDepsDeep(['./fixtures/basic/index.js']);
  const dep = depMock(['fixtures', 'basic']);
  t.deepEqual(_[0], dep(null, null, './index.js'));
  t.deepEqual(_[1], dep('./first/index.js', './index.js', './first/index.js'));
  t.deepEqual(_[2], dep('./second/index.js', './first/index.js', './first/second/index.js'));
  t.is(_.length, 3);
});

test('basic plus', async t => {
  const _ = await esDepsDeep(['./fixtures/basic-plus/index.js']);
  const dep = depMock(['fixtures', 'basic-plus']);
  t.deepEqual(_[0], dep(null, null, './index.js'));
  t.deepEqual(_[1], dep('./first/index.js',  './index.js',              './first/index.js'));
  t.deepEqual(_[2], dep('./second/index.js', './first/index.js',        './first/second/index.js'));
  t.deepEqual(_[3], dep('./three/index.js',  './first/second/index.js', './first/second/three/index.js'));
  t.is(_.length, 4);
});

test('extended', async t => {
  const _ = await esDepsDeep(['./fixtures/extended/index.js']);
  const dep = depMock(['fixtures', 'extended']);
  t.deepEqual(_[0], dep(null, null, './index.js'));
  t.deepEqual(_[1], dep('./first/index.js', './index.js', './first/index.js'));
  t.deepEqual(_[2], dep('./second/index.js', './first/index.js', './first/second/index.js'));
  t.deepEqual(_[3], dep('../third/index.js', './first/index.js', './third/index.js'));
  t.deepEqual(_[4], dep('../first/fourth/index.js', './third/index.js', './first/fourth/index.js'));
  t.is(_.length, 5);
});

test('basic+extended', async t => {
  const _ = await esDepsDeep(['./fixtures/basic', './fixtures/extended']);
  t.is(_.length, 8);
});
test('resolve', async t => {
  const _ = await esDepsDeep(['./fixtures/resolve']);
  const dep = depMock(['fixtures', 'resolve']);
  t.deepEqual(_[0], dep(null, null, './index.js'));
  t.deepEqual(_[1], dep('./a', './index.js', './a.js'));
  t.deepEqual(_[2], dep('./b', './index.js', './b/index.js'));
  t.is(_.length, 3);
});

test('cyclic', async t => {
  const _ = await esDepsDeep(['./fixtures/cyclic/main.js']);
  const dep = depMock(['fixtures', 'cyclic']);
  t.deepEqual(_[0], dep(null, null, './main.js'));
  t.deepEqual(_[1], dep('./a.js', './main.js', './a.js'));
  t.deepEqual(_[2], dep('./b.js', './main.js', './b.js'));
  t.is(_.length, 3);
});

test('modules', async t => {
  const _ = await esDepsDeep(['./fixtures/modules']);
  const dep = depMock(['fixtures', 'modules']);
  t.deepEqual(_[0], dep(null, null, './index.js'));
  t.deepEqual(_[1], dep('deep-modules-unresolved', './index.js', null));
  t.deepEqual(_[2], dep('./pew', './index.js', './pew.js'));
  t.is(_.length, 3);
});

test('modules nested', async t => {
  const _ = await esDepsDeep(['./fixtures/modules-nested']);
  const dep = depMock(['fixtures', 'modules-nested']);
  t.deepEqual(_[0], dep(null, null, './index.js'));
  t.deepEqual(_[1], dep('meow',  './index.js', './node_modules/meow/index.js'));
  t.deepEqual(_[2], dep('purr',  './node_modules/meow/index.js', './node_modules/meow/node_modules/purr/index.js'));
  t.deepEqual(_[3], dep('./pew', './node_modules/meow/index.js', './node_modules/meow/pew/index.js'));
  t.deepEqual(_[4], dep('./pew', './index.js', './pew.js'));
  t.is(_.length, 5);
});

test('missing', async t => {
  const _ = await esDepsDeep(['./fixtures/missing']);
  const dep = depMock(['fixtures', 'missing']);
  t.deepEqual(_[0], dep(null, null, './index.js'));
  t.deepEqual(_[1], dep('./one.js',   './index.js', './one.js'));
  t.deepEqual(_[2], dep('./two.js',   './index.js', './two.js'));
  t.deepEqual(_[3], dep('./extra.js', './index.js', null));
  t.is(_.length, 4);
});

test('builtin', async t => {
  const _ = await esDepsDeep(['./fixtures/builtin']);
  const dep = depMock(['fixtures', 'builtin']);
  t.deepEqual(_[0], dep(null, null, './index.js'));
  t.deepEqual(_[1], dep('path',   './index.js', 'path'));
  t.is(_.length, 2);
});

test('json', async t => {
  const _ = await esDepsDeep(['./fixtures/json']);
  const dep = depMock(['fixtures', 'json']);
  t.deepEqual(_[0], dep(null, null, './index.js'));
  t.deepEqual(_[1], dep('./person.json',   './index.js', './person.json'));
  t.deepEqual(_[2], dep('./list.json',     './index.js', './list.json'));
  t.is(_.length, 3);
});

test('not exclude at all, by default', async t => {
  const _ = await esDepsDeep(['./fixtures/exclude']);
  t.is(_.length, 5);
});

test('not exclude at all', async t => {
  const _ = await esDepsDeep(['./fixtures/exclude'], { excludeFn: R.F });
  t.is(_.length, 5);
});

test('exclude everything', async t => {
  const _ = await esDepsDeep(['./fixtures/exclude'], { excludeFn: R.T });
  t.is(_.length, 0);
});

test('exclude entry', async t => {
  const _ = await esDepsDeep(['./fixtures/exclude'], { excludeFn: kit.isEntry });
  t.is(_.length, 0);
});

test('exclude modules', async t => {
  const _ = await esDepsDeep(['./fixtures/exclude'], { excludeFn: kit.isRequestedPackage });
  t.is(_.length, 3);
});

test('exclude local files', async t => {
  const _ = await esDepsDeep(['./fixtures/exclude'], { excludeFn: kit.isRequestedLocalFile });
  t.is(_.length, 3);
});

test('exclude node_modules', async t => {
  const _ = await esDepsDeep(['./fixtures/exclude'], { excludeFn: kit.isResolvedInNM });
  t.is(_.length, 2);
});

test('exclude resolved', async t => {
  const _ = await esDepsDeep(['./fixtures/exclude'], { excludeFn: kit.isResolved });
  t.is(_.length, 0);
});

test('exclude not resolved', async t => {
  const _ = await esDepsDeep(['./fixtures/exclude'], { excludeFn: kit.isNotResolved });
  t.is(_.length, 5);
});

test('exclude third parties', async t => {
  const _ = await esDepsDeep(['./fixtures/exclude'], { excludeFn: kit.isThirdParty });
  const dep = depMock(['fixtures', 'exclude']);
  t.deepEqual(_[0], dep(null, null, './index.js'));
  t.deepEqual(_[1], dep('meow',  './index.js', './node_modules/meow/index.js'));
  t.deepEqual(_[2], dep('./pew', './index.js', './pew.js'));
  t.is(_.length, 3);
});

test('filtering', async t => {
  const _ = await esDepsDeep(['./fixtures/filtering']);

  const files = _.filter(R.either(kit.isEntry, kit.isRequestedLocalFile));
  const usedFiles = files.filter(kit.isResolved);
  const extraFiles = files.filter(kit.isNotResolved);
  t.is(usedFiles.length, 3);
  t.is(extraFiles.length, 1);

  const modules = _.filter(kit.isRequestedPackage);
  const usedModules = modules.filter(kit.isResolved);
  const extraModules = modules.filter(kit.isNotResolved);
  t.is(usedModules.length, 2);
  t.is(extraModules.length, 1);
});

test('unresolved', t => t.throws(esDepsDeep(['./fixtures/unresolved']), Error));
test('empty input', t => t.throws(esDepsDeep(), TypeError));
test('invalid files', t => t.throws(esDepsDeep(2), TypeError));
test('invalid files[item]', t => t.throws(esDepsDeep([2]), TypeError));
test('invalid options', t => t.throws(esDepsDeep('./fixtures/basic', 2), TypeError));
test('invalid options.excludeFn', t => t.throws(esDepsDeep('./fixtures/basic', { excludeFn: 2 }), TypeError));
