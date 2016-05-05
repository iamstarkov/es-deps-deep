/* eslint-disable no-underscore-dangle, no-use-before-define */
import R from 'ramda';
import Promise from 'pinkie-promise';
import esDepsResolved from 'es-deps-resolved';
import resolveCwd from 'resolve-cwd';
import dep from 'es-dep-unit';
import isBuiltinModule from 'is-builtin-module';
import contract from 'neat-contract';

// toPromise :: a -> Promise a
const toPromise = Promise.resolve.bind(Promise);

// all :: Array[Promise a] -> Promise Array[a]
const all = Promise.all.bind(Promise);

// _resolved :: Object -> String|null
const _resolved = R.prop('resolved');

// d — debug
// const l = (msg = 'LOG') => R.tap(console.log.bind(console, msg));
// const id = R.identity;

// isJSON :: String -> Boolean
const isJSON = R.pipe(R.split('.'), R.last, R.equals('json'));

// emptyDeps :: -> []
const emptyDeps = R.always([]);

// deps :: String -> Boolean
const deps = R.pipeP(toPromise, _resolved, R.ifElse(
  R.anyPass([R.isNil, isBuiltinModule, isJSON]),
  emptyDeps,
  esDepsResolved
));

// esDepsDeep :: Array[String] -> Object -> Array[Object]
function esDepsDeep(files, options = {}) {
  var cache = []; // eslint-disable-line

  const excludeFn = options.excludeFn || R.F;

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

  // deep :: Array[String] -> Array[Object]
  const deep = R.pipeP(toPromise,
    R.pipe(
      contract('files', Array),
      R.map(contract('files[item]', String)),
      R.tap(() => contract('options', Object, options)),
      R.tap(() => contract('excludeFn', Function, excludeFn))
    ),
    R.map(file => R.pipe(
      resolveCwd,
      R.when(R.isNil, () => { throw new Error(`Can't resolve file \`${file}\` `); }),
      dep(null, null)
    )(file)),
    R.reject(excludeFn),
    mapWalk,
    R.unnest
  );

  return deep(files);
}

export default esDepsDeep;
