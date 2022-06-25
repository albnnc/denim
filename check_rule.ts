import { semver } from "./deps.ts";
import { DepMeta } from "./types.ts";

const ruleRegExp = /^@?(.+)@(.+)(\/(.+))?$/;

export function checkRule(
  rule: string,
  depMeta: DepMeta,
) {
  if (rule === "*") {
    return true;
  }
  ruleRegExp.lastIndex = 0;
  const [_, id, version, a, b] = ruleRegExp.exec(rule) ?? [];
  console.log(id, version, a, b);

  return (
    (id === "*" || id === depMeta.id) &&
    (version === "*" || semver.satisfies(depMeta.version, version))
  );
}
