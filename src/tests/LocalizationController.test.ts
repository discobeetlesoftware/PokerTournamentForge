import LocalizationController from '../controllers/LocalizationController';

let strings = {
    test: 'victory',
    a: {
        b: {
            output: 'shallow',
            c: {
                d: 'deep'
            }
        },
        list: ['a', 'b', 'c']
    },
    list: ['a', 'b', 'c']
};

const call = (str: string): string | string[] => {
    return LocalizationController.mapString(str, strings);
}

test('empty', () => {
    expect(call('')).toStrictEqual('');
});

test('partial', () => {
    expect(call('%gogo')).toStrictEqual('%gogo');
});

test('single', () => {
    expect(call('%test%')).toStrictEqual('victory');
});

test('double', () => {
    expect(call('%test% %test%')).toStrictEqual('victory victory');
});

test('nested partial', () => {
    expect(call('%a.b.output%')).toStrictEqual('shallow');
});

test('nested full', () => {
    expect(call('%a.b.c.d%')).toStrictEqual('deep');
});

test('%', () => {
    expect(call('%')).toStrictEqual('%');
    expect(call('%%')).toStrictEqual('%%');
    expect(call('%%.')).toStrictEqual('%%.');
    expect(call('%.%.')).toStrictEqual('%.%.');
});

test('missing', () => {
    expect(call('%a.missing%')).toStrictEqual('%a.missing%');
});

test('list', () => {
    expect(() => call('%a.list%')).toThrowError('Target for %a.list% is an Array; Unknown injection solution.');
    expect(() => call('%list%')).toThrowError('Target for %list% is an Array; Unknown injection solution.');
});