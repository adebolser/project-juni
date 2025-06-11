type UserInput = {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isOrganiser: boolean;
};

type AuthenticationResponse = {
    token: string;
    id: number;
    firstName: string;
    lastName: string;
    role: 'ORGANISER' | 'CLIENT';
};

export { UserInput, AuthenticationResponse };
