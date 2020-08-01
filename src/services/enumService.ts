export function GetEnumValues<T>(enumObject: T): number[] {
    return Object.keys(enumObject)
        .filter((key) => isNaN(parseInt(key)))
        .map((k) => enumObject[k])
}