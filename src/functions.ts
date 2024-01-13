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

const transformValue = <T>(
  value: TransformFn<T>,
  transformFn?: (value: TransformFn<T>, data?: any) => any,
  data?: any
) => {
  return transformFn ? transformFn(value, data) : value;
};

const addPropertie = <R>(
  value: AddPropertiesFn<R>,
  addPropertieFn?: (data?: any) => any,
  data?: any
) => {
  return addPropertieFn ? addPropertieFn(data) : value;
};

export const format = <
  T extends Record<string, any>,
  R extends Record<string, any> = T
>({
  data,
  properties = [],
  excludedProperties,
  renamedProperties,
  transformFn,
  addProperties = {}, // It needs to be an empty object because of the spread in combinedProperties
  filterNullsAndInvalids = true,
}: IFormatProperties<T, R>): R => {
  if (data === undefined || data === null) return data as unknown as R;

  // If you do not pass the keys of the properties that will be returned, they will all be selected
  const pickedProperties = properties.length ? properties : Object.keys(data);

  // Combines the properties that were selected with new properties that will be added
  const combinedProperties = [
    ...pickedProperties,
    ...Object.keys(addProperties),
  ];

  return combinedProperties.reduce((obj, key) => {
    const isExcluded = excludedProperties?.includes(key as FilterableKeys<T>);
    if (isExcluded) return obj;

    const isKeyInData = data[key] !== undefined;

    const newKey = renamedProperties?.[key as keyof T] ?? key;
    const isTransformFnDefinedForKey = transformFn?.[key as keyof T];
    const isAddPropertiesFnDefinedForKey = addProperties?.[key];

    let oldValue: TransformFn<T>;
    if (isKeyInData) oldValue = data[key as keyof T];

    const addedPropertie = addPropertie(
      oldValue as Partial<R>,
      isAddPropertiesFnDefinedForKey,
      data
    );

    const value = transformValue(
      addedPropertie,
      isTransformFnDefinedForKey,
      data
    );

    const invalidValue = value === null || value === undefined;
    if (filterNullsAndInvalids && invalidValue) return obj;

    obj[newKey as keyof R] = value;

    return obj;
  }, {} as R);
};

interface IFormatArray<T extends Record<string, any>, R>
  extends Omit<IFormatProperties<T, R>, "data"> {
  data: T[];
}

export const formatArray = <
  T extends Record<string, any>,
  R extends Record<string, any> = T
>({
  data,
  properties,
  excludedProperties,
  renamedProperties,
  transformFn,
  filterNullsAndInvalids,
}: IFormatArray<T, R>): R[] => {
  if (!data?.length) return data as unknown as R[];

  return data.map((item) =>
    format<T, R>({
      data: item,
      properties,
      excludedProperties,
      renamedProperties,
      transformFn,
      filterNullsAndInvalids,
    })
  );
};
