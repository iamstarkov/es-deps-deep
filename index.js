/* eslint-disable no-underscore-dangle, no-use-before-define */
import R from 'ramda';
import Promise from 'pinkie-promise';
import binded from 'binded';
import esDepsResolved from 'es-deps-resolved';
import resolveCwd from 'resolve-cwd';
import { esDepUnit } from 'es-dep-unit';
import contract from 'neat-contract';

const { resolve: toPromise, all, reject } = binded(Promise);

const _resolved = R.prop('resolved');

// esDepsDeep :: String -> Array[Object]
function esDepsDeep(file, excludeFn = R.F) {
  var cache = []; // eslint-disable-line

  const deps = R.pipeP(toPromise,
    _resolved,
    R.ifElse(R.isNil, R.always([]), esDepsResolved)
  );

  const isInCache = R.pipe(_resolved, R.contains(R.__, cache));
  const addToCache = _ => { cache.push(_.resolved); };

  const walk = item => R.ifElse(isInCache, R.always([]), R.pipeP(toPromise,
    R.tap(addToCache),
    deps,
    mapWalk,
    R.unnest,
    R.reject(excludeFn),
    R.prepend(item)
  ))(item);

  const mapWalk = R.pipeP(toPromise, R.map(walk), all);

  return R.pipeP(toPromise,
    contract('file', String),
    resolveCwd,
    R.when(R.isNil, () => reject(new Error(`Can't find and open \`${file}\``))),
    esDepUnit(null, null),
    R.of,
    R.reject(excludeFn),
    mapWalk,
    R.unnest
  )(file);
}

export default esDepsDeep;
