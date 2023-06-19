type RemoveReadonly<T> = {
    -readonly [P in keyof T]: T[P];
};

export type { RemoveReadonly };
