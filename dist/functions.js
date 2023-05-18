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
var format = function (_a) {
    var data = _a.data, _b = _a.properties, properties = _b === void 0 ? [] : _b, excludedProperties = _a.excludedProperties, renamedProperties = _a.renamedProperties, transformFn = _a.transformFn, _c = _a.filterNullsAndInvalids, filterNullsAndInvalids = _c === void 0 ? true : _c, _d = _a.addProperties, addProperties = _d === void 0 ? {} : _d;
    if (data === undefined || data === null)
        return data;
    var pickedProperties = properties.length ? properties : Object.keys(data);
    var combinedProperties = __spreadArray(__spreadArray([], pickedProperties, true), Object.keys(addProperties), true);
    return combinedProperties.reduce(function (obj, key) {
        var _a;
        var isExcluded = excludedProperties === null || excludedProperties === void 0 ? void 0 : excludedProperties.includes(key);
        if (isExcluded)
            return obj;
        var isKeyInData = data[key] !== undefined;
        var isKeyInAddProperties = addProperties[key] !== undefined;
        var newKey = (_a = renamedProperties === null || renamedProperties === void 0 ? void 0 : renamedProperties[key]) !== null && _a !== void 0 ? _a : key;
        var isTransformFnDefinedForKey = transformFn === null || transformFn === void 0 ? void 0 : transformFn[key];
        var oldValue;
        if (isKeyInData)
            oldValue = data[key];
        if (isKeyInAddProperties)
            oldValue = addProperties[key];
        var value = transformValue(oldValue, isTransformFnDefinedForKey, isKeyInData ? data : addProperties);
        var invalidValue = value === null || value === undefined;
        if (filterNullsAndInvalids && invalidValue)
            return obj;
        obj[newKey] = value;
        return obj;
    }, {});
};
exports.format = format;
var formatArray = function (_a) {
    var data = _a.data, properties = _a.properties, excludedProperties = _a.excludedProperties, renamedProperties = _a.renamedProperties, transformFn = _a.transformFn, filterNullsAndInvalids = _a.filterNullsAndInvalids;
    if (!(data === null || data === void 0 ? void 0 : data.length))
        return data;
    return data.map(function (item) {
        return (0, exports.format)({
            data: item,
            properties: properties,
            excludedProperties: excludedProperties,
            renamedProperties: renamedProperties,
            transformFn: transformFn,
            filterNullsAndInvalids: filterNullsAndInvalids,
        });
    });
};
exports.formatArray = formatArray;
