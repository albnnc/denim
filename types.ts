export interface GraphNode {
  parents: Set<string>;
  deps: Set<string>;
}

export type Graph = Record<string, GraphNode>;

export interface Meta {
  specifier: string;
  matches: Record<string, string>;
  id: string;
  version: string;
  file?: string;
}

export interface TransformRule {
  source: string;
  target: string;
}

export interface Config {
  transforms?: TransformRule[];
}
