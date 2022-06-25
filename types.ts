export interface DepMap {
  root: string;
  deps: Record<string, string[]>;
}

export interface DepMeta {
  specifier: string;
  matches: Record<string, string>;
  id: string;
  version: string;
}

export interface Rule {
  source: string;
  target: string;
}

export interface Config {
  rules?: Rule[];
}
