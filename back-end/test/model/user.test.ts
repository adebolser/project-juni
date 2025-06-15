import { User } from '../../model/user';

test('given: valid values for User, when: user is created, then: user is created with those values', () => {
    // given

    // when
    const actualUser = new User({
        firstName: 'Jan',
        lastName: 'Janssen',
        email: 'jan.janssens@ucll.be',
        password: 'jan123',
        isOrganiser: false,
    });

    // then
    expect(actualUser.getFirstName()).toEqual('Jan');
    expect(actualUser.getLastName()).toEqual('Janssen');
    expect(actualUser.getEmail()).toEqual('jan.janssens@ucll.be');
    expect(actualUser.getPassword()).toEqual('jan123');
    expect(actualUser.getIsOrganiser()).toEqual(false);
    expect(actualUser.getId()).toBeUndefined();
});

test('given: empty email for User, when: user is created, then: a "is required" error is reported', () => {
    // given
    let emptyEmail =  "   ";

    // when
    const createUser = () => new User({
        firstName: 'Jan',
        lastName: 'Janssen',
        email: emptyEmail,
        password: 'jan123',
        isOrganiser: false,
    });

    // then
    expect(createUser).toThrow('Email is required');
});

