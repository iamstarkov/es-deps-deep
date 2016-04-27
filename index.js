import R from 'ramda';
import Promise from 'pinkie-promise';
import binded from 'binded';
import esDepsResolved from 'es-deps-resolved';
import resolveCwd from 'resolve-cwd';
import { esDepUnit } from 'es-dep-unit';
import contract from 'neat-contract';

const { resolve, all, reject } = binded(Promise);

// esDepsDeep :: String -> Array[Object]
function esDepsDeep(file, excludeFn = R.F) {
  let cache = [];

  const deps = R.pipeP(resolve,
    R.prop('resolved'),
    R.ifElse(R.isNil, R.always([]), esDepsResolved));

  const walk = item => {
    if (R.contains(item.resolved, cache)) {
      return resolve([]);
    } else {
      cache.push(item.resolved);
      return R.pipeP(resolve,
        deps,
        mapWalk,
        R.unnest,
        R.reject(excludeFn),
        R.prepend(item)
      )(item);
    }
  };

  const mapWalk = items => all(items.map(walk));

  return R.pipeP(resolve,
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
