import Time from "../models/Time";

test('init', () => {
    let time = new Time(3, 2, 1);
    expect(time.minute).toStrictEqual(3);
    expect(time.hour).toStrictEqual(2);
    expect(time.day).toStrictEqual(1);
});

test('append', () => {
    let time = new Time();
    expect(time.toString()).toStrictEqual('00:00');
    time.append(19);
    expect(time.toString()).toStrictEqual('00:19');
    expect(time.minute).toStrictEqual(19);
    expect(time.hour).toStrictEqual(0);
    expect(time.day).toStrictEqual(0);

    time.append(41);
    expect(time.toString()).toStrictEqual('01:00');
    expect(time.minute).toStrictEqual(0);
    expect(time.hour).toStrictEqual(1);
    expect(time.day).toStrictEqual(0);

    time.append(61);
    expect(time.toString()).toStrictEqual('02:01');
    expect(time.minute).toStrictEqual(1);
    expect(time.hour).toStrictEqual(2);
    expect(time.day).toStrictEqual(0);

    time.append(60 * 21);
    expect(time.toString()).toStrictEqual('23:01');
    expect(time.minute).toStrictEqual(1);
    expect(time.hour).toStrictEqual(23);
    expect(time.day).toStrictEqual(0);

    time.append(59);
    expect(time.toString()).toStrictEqual('00:00');
    expect(time.minute).toStrictEqual(0);
    expect(time.hour).toStrictEqual(0);
    expect(time.day).toStrictEqual(1);
});
