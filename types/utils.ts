// types/utils.ts

// Utility type to omit properties with a specific tag
export type OmitWithTag<T, U extends keyof any, Tag extends string> = Omit<T, U> & { [P in Tag]?: never };

// Utility type to compute the difference between two types
export type Diff<T, U> = T extends U ? never : T;

// Utility type to extract the first argument type from a function type
export type FirstArg<T> = T extends (arg1: infer U, ...args: any[]) => any ? U : never;
