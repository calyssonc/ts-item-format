type FilterableKeys<T> = Extract<keyof T, string>;

type RenamedProperties<T> = {
  [K in keyof T]?: string;
};

type TransformFn<T> = {
  [K in keyof T]?: (value: T[K], data?: T) => any;
};

interface IFormatProperties<T extends Record<string, any>, R> {
  data: T;
  properties?: FilterableKeys<T>[];
  excludedProperties?: FilterableKeys<T>[];
  renamedProperties?: RenamedProperties<T>;
  transformFn?: TransformFn<T>;
  filterNullsAndInvalids?: boolean;
  addProperties?: Partial<R>;
}

const transformValue = <T>(
  value: TransformFn<T>,
  transformFn?: (value: TransformFn<T>, data?: any) => any,
  data?: any
) => {
  return transformFn ? transformFn(value, data) : value;
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
  filterNullsAndInvalids = true,
  addProperties = {},
}: IFormatProperties<T, R>): R => {
  if (data === undefined || data === null) return data as unknown as R;

  const pickedProperties = properties.length ? properties : Object.keys(data);

  const combinedProperties = [
    ...pickedProperties,
    ...Object.keys(addProperties),
  ];

  return combinedProperties.reduce((obj, key) => {
    const isExcluded = excludedProperties?.includes(key as FilterableKeys<T>);
    if (isExcluded) return obj;

    const isKeyInData = !!data[key];
    const isKeyInAddProperties = !!addProperties[key];

    const newKey = renamedProperties?.[key as keyof T] ?? key;
    const isTransformFnDefinedForKey = transformFn?.[key as keyof T];

    let oldValue: TransformFn<T>;
    if (isKeyInData) oldValue = data[key as keyof T];
    if (isKeyInAddProperties) oldValue = addProperties[key];

    const value = transformValue(
      oldValue,
      isTransformFnDefinedForKey,
      isKeyInData ? data : addProperties
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
