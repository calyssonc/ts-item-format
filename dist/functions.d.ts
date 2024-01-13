type FilterableKeys<T> = Extract<keyof T, string>;
type RenamedProperties<T> = {
    [K in keyof T]?: string;
};
type TransformFn<T> = {
    [K in keyof T]?: (value: T[K], data?: T) => any;
};
type AddPropertiesFn<R> = {
    [key: string]: (data: R) => any;
};
interface IFormatProperties<T extends Record<string, any>, R> {
    data: T;
    properties?: FilterableKeys<T>[];
    excludedProperties?: FilterableKeys<T>[];
    renamedProperties?: RenamedProperties<T>;
    transformFn?: TransformFn<T>;
    filterNullsAndInvalids?: boolean;
    addProperties?: AddPropertiesFn<R>;
}
export declare const format: <T extends Record<string, any>, R extends Record<string, any> = T>({ data, properties, excludedProperties, renamedProperties, transformFn, addProperties, filterNullsAndInvalids, }: IFormatProperties<T, R>) => R;
interface IFormatArray<T extends Record<string, any>, R> extends Omit<IFormatProperties<T, R>, "data"> {
    data: T[];
}
export declare const formatArray: <T extends Record<string, any>, R extends Record<string, any> = T>({ data, properties, excludedProperties, renamedProperties, transformFn, filterNullsAndInvalids, }: IFormatArray<T, R>) => R[];
export {};
