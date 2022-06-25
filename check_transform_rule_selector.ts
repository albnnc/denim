import { semver } from "./deps.ts";
import { ModMeta } from "./types.ts";

const selectorRegExp = /^@?(.+)@(.+)$/;

export function checkTransformRuleSelector(
  selector: string,
  meta: ModMeta,
) {
  if (selector === "*") {
    return true;
  }
  selectorRegExp.lastIndex = 0;
  const [_, id, version] = selectorRegExp.exec(selector) ?? [];
  return (
    (id === "*" || id === meta.id) &&
    (version === "*" || semver.satisfies(meta.version, version))
  );
}
