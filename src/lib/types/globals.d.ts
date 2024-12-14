

declare global {
  const Deno: {
    readTextFile(path: string): Promise<string>;
  } | undefined;
}


export type Deno = object | undefined;