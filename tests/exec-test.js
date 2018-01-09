import test from 'ava';
import { expand } from '../src/expander';

test('exec', async t => t.is(await expand("${exec('echo','hello')}"), 'hello'));
