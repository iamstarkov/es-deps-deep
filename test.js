import test from 'ava';
import { esDepsDeep, esDepsDeepAsync } from './index';

test('basic', t =>
  t.is(esDepsDeep('unicorns'), 'unicorns'));

test('empty input', t => t.throws(() => { esDepsDeep(); }, TypeError));
test('invalid input', t => t.throws(() => { esDepsDeep(2); }, TypeError));

test('async :: basic', async t => t.is(
  await esDepsDeepAsync('unicorns'),
  'unicorns'));

test('async :: empty input', t => t.throws(esDepsDeepAsync(), TypeError));
test('async :: invalid input', t => t.throws(esDepsDeepAsync(2), TypeError));
