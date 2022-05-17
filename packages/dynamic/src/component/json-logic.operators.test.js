import jsonLogic from './json-logic.operators';

test('fn with a single param', () => expect(jsonLogic.apply({
    fn: [
        a => a * 3,
        2
    ],
})).toBe(6));

test('fn with multiple params', () => expect(jsonLogic.apply({
    fn: [
        (a, b) => a + b,
        1, 2
    ],
})).toBe(3));


test('mergeObjects', () => expect(jsonLogic.apply({
    mergeObjects: [
        { a: 1, b: 2 },
        { b: 3, c: 4 }
    ],
})).toStrictEqual(
    { a: 1, b: 3, c: 4 }
));
