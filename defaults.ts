const prefix = "std|x|-|v\\d+";
const idLike = "[a-zA-Z0-9\\-_]+";
const pathname = "/" + [
  `(${prefix})?`,
  `:id(@${idLike}/${idLike}|${idLike}){@:version}?`,
  "*?",
].join("/");

export const defaultPatterns = [{ pathname }];

export const defaultRules = [{
  source: "*",
  target: "{id}@^{version}",
}];
