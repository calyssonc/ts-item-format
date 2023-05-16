# ts-item-format

The `ts-item-format` package provides two functions: `format` and `formatArray`. These functions are designed to facilitate formatting and transformation of objects and arrays of objects in TypeScript.

## Installation

To install `ts-item-format`, you need to have Node.js and npm (Node Package Manager) installed. Run the following command:

```
npm install ts-item-format
```

## Usage

### `format` Function

The `format` function is used to format an individual object. It accepts the following parameters:

```typescript
format<T extends Record<string, any>, R extends Record<string, any>>(options: IFormatProperties<T, R>): R
```

- `options`: An object that contains the formatting options.
  - `data` (required): The object to be formatted.
  - `properties`: An array of object property keys that should be included in the formatting. If not specified, all properties of the object will be included.
  - `excludedProperties`: An array of object property keys that should be excluded from the formatting.
  - `renamedProperties`: An object that maps object property keys to new property names.
  - `transformFn`: An object that defines transformation functions for each object property key.
  - `filterNullsAndInvalids`: A boolean value indicating whether null or invalid values should be filtered from the formatting. The default is `true`.
  - `addProperties`: An object containing additional properties to be added to the formatting.

Usage example:

```typescript
import { format } from "ts-item-format";

const data = {
  name: "John Doe",
  age: 30,
  email: "john.doe@example.com",
};

const formattedData = format({
  data,
  properties: ["name", "email"],
  renamedProperties: {
    email: "contactEmail",
  },
});

console.log(formattedData);
// Output: { name: 'John Doe', contactEmail: 'john.doe@example.com' }
```

### `formatArray` Function

The `formatArray` function is used to format an array of objects. It accepts the same parameters as the `format` function, except for the `data` parameter, which is now an array of objects.

```typescript
formatArray<T extends Record<string, any>, R extends Record<string, any>>(options: IFormatArray<T, R>): R[]
```

Usage example:

```typescript
import { formatArray } from "ts-item-format";

const data = [
  {
    name: "John Doe",
    age: 30,
    email: "john.doe@example.com",
  },
  {
    name: "Jane Smith",
    age: 25,
    email: "jane.smith@example.com",
  },
];

const formattedData = formatArray({
  data,
  properties: ["name", "email"],
  renamedProperties: {
    email: "contactEmail",
  },
});

console.log(formattedData);
/*
Output:
[
  { name: 'John Doe', contactEmail: 'john.doe@example.com' },
  { name: 'Jane Smith', contactEmail: 'jane.smith@example.com' }
]
*/
```

### Nested `format` in `transformFn`

The `transformFn` option in the `format` and `formatArray` functions allows you to define transformation functions for each property key of the object. These transformation functions can also use the `format` function for nested formatting. Here's an example:

```typescript
import { format, formatArray } from "ts-item-format";

const data = [
  {
    name: "John Doe",
    age: 30,
    email: "john.doe@example.com",
    address: {
      street: "123 Main St",
      city: "New York",
      country: "USA",
    },
  },
  {
    name: "Jane Smith",
    age: 25,
    email: "jane.smith@example.com",
    address: {
      street: "456 Elm St",
      city: "Los Angeles",
      country: "USA",
    },
  },
];

const formattedData = formatArray({
  data,
  transformFn: {
    address: (value) =>
      format({
        data: value,
        properties: ["street", "city"],
        renamedProperties: {
          street: "addressStreet",
          city: "addressCity",
        },
      }),
  },
});

console.log(formattedData);
/*
Output:
[
  {
    name: 'John Doe',
    age: 30,
    email: 'john.doe@example.com',
    address: {
      addressStreet: '123 Main St',
      addressCity: 'New York'
    }
  },
  {
    name: 'Jane Smith',
    age: 25,
    email: 'jane.smith@example.com',
    address: {
      addressStreet: '456 Elm St',
      addressCity: 'Los Angeles'
    }
  }
]
*/
```

In the above example, the `formatArray` function is used to format an array of objects. The `transformFn` option is specified to format the `address` property of each object using the nested `format` function. The result is an array of objects with the `address` property formatted as specified.

### Converting Input DTO to Output DTO using `format` and `formatArray`

The `format` and `formatArray` functions can be used to convert an input Data Transfer Object (DTO) to an output DTO by applying formatting and transformation rules. Here's an example:

```typescript
import { format, formatArray } from "ts-item-format";

// Input DTO
interface InputDTO {
  firstName: string;
  lastName: string;
  email: string;
}

// Output DTO
interface OutputDTO {
  fullName: string;
  contactEmail: string;
}

// Input DTO data
const inputData: InputDTO = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
};

// Single object conversion using `format`
const outputData: OutputDTO = format<InputDTO, OutputDTO>({
  data: inputData,
  properties: ["firstName", "lastName", "email"],
  transformFn: {
    fullName: (value, data) => `${data.firstName} ${data.lastName}`,
    contactEmail: "email",
  },
});

console.log(outputData);
/*
Output:
{
  fullName: 'John Doe',
  contactEmail: 'john.doe@example.com',
}
*/

// Array of objects conversion using `formatArray`
const inputArray: InputDTO[] = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
  },
];

const outputArray: OutputDTO[] = formatArray<InputDTO, OutputDTO>({
  data: inputArray,
  properties: ["firstName", "lastName", "email"],
  transformFn: {
    fullName: (value, data) => `${data.firstName} ${data.lastName}`,
    contactEmail: "email",
  },
});

console.log(outputArray);
/*
Output:
[
  {
    fullName: 'John Doe',
    contactEmail: 'john.doe@example.com',
  },
  {
    fullName: 'Jane Smith',
    contactEmail: 'jane.smith@example.com',
  },
]
*/
```

In the above example, we define an input DTO interface (`InputDTO`) and an output DTO interface (`OutputDTO`). We have an input object (`inputData`) and an array of input objects (`inputArray`). Using the `format` function, we convert the input object to the output object by specifying the desired properties and transformation functions. Similarly, the `formatArray` function is used to convert the array of input objects to an array of output objects.

The `transformFn` option is used to define the transformation rules. In this example, we transform the `firstName` and `lastName` properties of the input DTO into a single `fullName` property in the output DTO by concatenating them. We also directly map the `email` property from the input DTO to the `contactEmail` property in the output DTO.

By using `format` and `formatArray` with appropriate formatting and transformation rules, we can easily convert input DTOs to output DTOs with the desired structure and data.

### Adding New Properties to DTO using `format` and `formatArray`

The `format` and `formatArray` functions can be used to add new properties to a Data Transfer Object (DTO) by including them in the `addProperties` parameter. Here's an example:

```typescript
import { format, formatArray } from "ts-item-format";

// Input DTO
interface InputDTO {
  firstName: string;
  lastName: string;
  email: string;
}

// Output DTO
interface OutputDTO {
  fullName: string;
  contactEmail: string;
  age: number;
}

// Input DTO data
const inputData: InputDTO = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
};

// Single object conversion using `format`
const outputData: OutputDTO = format<InputDTO, OutputDTO>({
  data: inputData,
  properties: ["firstName", "lastName", "email"],
  transformFn: {
    fullName: (value, data) => `${data.firstName} ${data.lastName}`,
    contactEmail: "email",
  },
  addProperties: {
    age: 30,
  },
});

console.log(outputData);
/*
Output:
{
  fullName: 'John Doe',
  contactEmail: 'john.doe@example.com',
  age: 30,
}
*/

// Array of objects conversion using `formatArray`
const inputArray: InputDTO[] = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
  },
];

const outputArray: OutputDTO[] = formatArray<InputDTO, OutputDTO>({
  data: inputArray,
  properties: ["firstName", "lastName", "email"],
  transformFn: {
    fullName: (value, data) => `${data.firstName} ${data.lastName}`,
    contactEmail: "email",
  },
  addProperties: {
    age: 25,
  },
});

console.log(outputArray);
/*
Output:
[
  {
    fullName: 'John Doe',
    contactEmail: 'john.doe@example.com',
    age: 25,
  },
  {
    fullName: 'Jane Smith',
    contactEmail: 'jane.smith@example.com',
    age: 25,
  },
]
*/
```

In the above example, we have an input DTO interface (`InputDTO`) and an output DTO interface (`OutputDTO`). We start with an input object (`inputData`) and an array of input objects (`inputArray`). Using the `format` function, we convert the input object to the output object by specifying the desired properties and transformation functions. Similarly, the `formatArray` function is used to convert the array of input objects to an array of output objects.

To add new properties to the output DTO, we use the `addProperties` parameter in both the `format` and `formatArray` functions. In this example, we add an `age` property with a value of 30 to the single output object and a value of 25 to each object in the output array.

By using `format` and `formatArray` along with the `addProperties` parameter, we can easily add new properties to the DTOs during the conversion process.

## Used Types

The `ts-item-format` package also provides some useful types that can be used in conjunction with the `format` and `formatArray` functions.

- `FilterableKeys<T>`: A generic type that extracts the keys of type `T` that are of type `string`.
- `RenamedProperties<T>`: A type that defines an object mapping the property keys of type `T` to new property names.
- `TransformFn<T, R>`: A type that defines an object mapping the property

keys of type `T` to transformation functions that take the property value and return a value of type `R`.

## Contributing

If you encounter any issues or have any suggestions for improvement, feel free to open an issue or submit a pull request on the [ts-item-format](https://github.com/calyssonc/ts-item-format) repository. Your contributions are appreciated!

The ChatGPT played a significant role in the development of the code and the generation of the README. It served as a valuable tool in understanding the existing code, identifying the possible uses of the `format` and `formatArray` functions, and aiding in the creation of the Markdown-formatted README. Through interaction with the ChatGPT, clear explanations and practical examples were obtained to effectively demonstrate the functionalities and proper usage of these functions, ultimately enhancing the package documentation.

## License

This package is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Autores

- [@calyssonc](https://www.github.com/calyssonc)
