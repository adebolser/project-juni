import { User } from "../../model/user"
import userDb from "../../repository/user.db";
import userService from "../../service/user.service";

let createUserMock: jest.Mock;
let mockUserDbGetUserByEmail: jest.Mock;

beforeEach(() => {
    mockUserDbGetUserByEmail = jest.fn();
    createUserMock = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('Given users, when an existing user is requested by email, then the user is returned', async () => {

    // given
    const expectedUser: User = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@ucll.be',
        password: 'johnd123',
        isOrganiser: true
    });
    userDb.getUserByEmail = mockUserDbGetUserByEmail.mockResolvedValue(expectedUser);

    // when
    const actualUser = await userService.getUserByEmail({email:'john.doe@ucll.be'});
 
    // then
    expect(mockUserDbGetUserByEmail).toHaveBeenCalledTimes(1);
    expect(actualUser.equals(expectedUser)).toBeTruthy();
});

test('Given users, when a non existing user is requested by email, then a "User does not exist" error is reported', async () => {

    //given
    userDb.getUserByEmail = mockUserDbGetUserByEmail.mockResolvedValue(null);
  
    //when 
    const invalid_email:string = 'no.user@ucll.be';
    const getUserByEmail = async () => userService.getUserByEmail({email:invalid_email})
  
    // then
    expect(getUserByEmail).rejects.toThrow(`User with email: ${invalid_email} does not exist.`);
});