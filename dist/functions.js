"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatArray = exports.format = void 0;
var transformValue = function (value, transformFn, data) {
    return transformFn ? transformFn(value, data) : value;
};
var addPropertie = function (value, addPropertieFn, data) {
    return addPropertieFn ? addPropertieFn(data) : value;
};
var format = function (_a) {
    var data = _a.data, _b = _a.properties, properties = _b === void 0 ? [] : _b, excludedProperties = _a.excludedProperties, renamedProperties = _a.renamedProperties, transformFn = _a.transformFn, _c = _a.addProperties, addProperties = _c === void 0 ? {} : _c, // It needs to be an empty object because of the spread in combinedProperties
    _d = _a.filterNullsAndInvalids, // It needs to be an empty object because of the spread in combinedProperties
    filterNullsAndInvalids = _d === void 0 ? true : _d;
    if (data === undefined || data === null)
        return data;
    // If you do not pass the keys of the properties that will be returned, they will all be selected
    var pickedProperties = properties.length ? properties : Object.keys(data);
    // Combines the properties that were selected with new properties that will be added
    var combinedProperties = __spreadArray(__spreadArray([], pickedProperties, true), Object.keys(addProperties), true);
    return combinedProperties.reduce(function (obj, key) {
        var _a;
        var isExcluded = excludedProperties === null || excludedProperties === void 0 ? void 0 : excludedProperties.includes(key);
        if (isExcluded)
            return obj;
        var isKeyInData = data[key] !== undefined;
        var newKey = (_a = renamedProperties === null || renamedProperties === void 0 ? void 0 : renamedProperties[key]) !== null && _a !== void 0 ? _a : key;
        var isTransformFnDefinedForKey = transformFn === null || transformFn === void 0 ? void 0 : transformFn[key];
        var isAddPropertiesFnDefinedForKey = addProperties === null || addProperties === void 0 ? void 0 : addProperties[key];
        var oldValue;
        if (isKeyInData)
            oldValue = data[key];
        var addedPropertie = addPropertie(oldValue, isAddPropertiesFnDefinedForKey, data);
        var value = transformValue(addedPropertie, isTransformFnDefinedForKey, data);
        var invalidValue = value === null || value === undefined;
        if (filterNullsAndInvalids && invalidValue)
            return obj;
        obj[newKey] = value;
        return obj;
    }, {});
};
exports.format = format;
var formatArray = function (_a) {
    var data = _a.data, properties = _a.properties, excludedProperties = _a.excludedProperties, renamedProperties = _a.renamedProperties, transformFn = _a.transformFn, addProperties = _a.addProperties, filterNullsAndInvalids = _a.filterNullsAndInvalids;
    if (!(data === null || data === void 0 ? void 0 : data.length))
        return data;
    return data.map(function (item) {
        return (0, exports.format)({
            data: item,
            properties: properties,
            excludedProperties: excludedProperties,
            renamedProperties: renamedProperties,
            transformFn: transformFn,
            addProperties: addProperties,
            filterNullsAndInvalids: filterNullsAndInvalids,
        });
    });
};
exports.formatArray = formatArray;
