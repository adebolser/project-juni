type UserInput = {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isOrganiser: boolean;
};

type ExperienceInput = {
    id?: number;
    name: string;
    description: string;
    date: Date;
    location: string;
}

type AuthenticationResponse = {
    token: string;
    id: number;
    firstName: string;
    lastName: string;
    role: 'ORGANISER' | 'CLIENT';
};

export { UserInput, ExperienceInput, AuthenticationResponse };
