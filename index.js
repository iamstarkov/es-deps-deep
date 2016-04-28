/* eslint-disable no-underscore-dangle, no-use-before-define */
import R from 'ramda';
import Promise from 'pinkie-promise';
import binded from 'binded';
import esDepsResolved from 'es-deps-resolved';
import resolveCwd from 'resolve-cwd';
import { esDepUnit } from 'es-dep-unit';
import isBuiltinModule from 'is-builtin-module';
import contract from 'neat-contract';

const { resolve: toPromise, all, reject } = binded(Promise);

const _resolved = R.prop('resolved');

// d — debug
// const l = (msg = 'LOG') => R.tap(console.log.bind(console, msg));
// const id = R.identity;

// hasNoDeps :: String -> Boolean
// detect if dep cannot have deps (unresolved or builtin module)
const hasNoDeps = R.either(R.isNil, isBuiltinModule);

// deps :: String -> Boolean
// resolve dep's deps
const deps = R.pipeP(toPromise,
  _resolved,
  R.ifElse(hasNoDeps, R.always([]), esDepsResolved)
);

// esDepsDeep :: String -> Array[Object]
function esDepsDeep(file, excludeFn = R.F) {
  var cache = []; // eslint-disable-line

  // isInCache :: Object -> true
  const isInCache = R.pipe(_resolved, R.contains(R.__, cache));

  // impure void addToCache :: Object
  const addToCache = _ => { cache.push(_.resolved); };

  // walk :: Object -> Array[Object]
  const walk = item => R.ifElse(isInCache, R.always([]), R.pipeP(toPromise,
    R.tap(addToCache),
    deps,
    mapWalk,
    R.unnest,
    R.reject(excludeFn),
    R.prepend(item)
  ))(item);

  // mapWalk :: Array[Object] -> Array[Object]
  const mapWalk = R.pipeP(toPromise,
    R.map(walk),
    all
  );

  // deep :: String -> Array[Object]
  const deep = R.pipeP(toPromise,
    contract('file', String),
    resolveCwd,
    R.when(R.isNil, () => reject(new Error(`Can't find and open \`${file}\``))),
    esDepUnit(null, null),
    R.of,
    R.reject(excludeFn),
    mapWalk,
    R.unnest
  );

  return deep(file);
}

export default esDepsDeep;
