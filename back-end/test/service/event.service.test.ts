import { Event } from "../../model/event"
import { User } from "../../model/user"
import eventDb from "../../repository/event.db";
import userDb from "../../repository/user.db";
import eventService from "../../service/event.service";
import { UserInput, ExperienceInput } from "../../types";

const testUserInput: UserInput = {
    id:1,    
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@ucll.be',
    password: 'johnd123',
    isOrganiser: true
};

// ... is spreading => spread elements of one object into another one
const testUser = new User({
    ...testUserInput,
});

const testClientUserInput: UserInput = {
    id:2,    
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@ucll.be',
    password: 'jane123',
    isOrganiser: false
};

// ... is spreading => spread elements of one object into another one
const testClientUser = new User({
    ...testClientUserInput,
});

const testEvent = new Event({
    name: 'Bierproeverij in Leuven',
    description: 'Proef de beste Belgische bieren....',
    date: new Date("2025-06-29T08:05"),
    location: "Leuven",
    organiser: testUser,
    attendees: [],
});

let mockEventDbCreateEvent: jest.Mock;
let mockEventDbGetEventByOrganiserId: jest.Mock;
let mockEventDbGetEventById: jest.Mock;
let mockUserDbGetUserById: jest.Mock;

beforeEach(() => {
    mockEventDbGetEventByOrganiserId = jest.fn();
    mockEventDbGetEventById = jest.fn();
    mockEventDbCreateEvent = jest.fn();
    mockUserDbGetUserById = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('Given events, when events by organiser id requested, then the events are returned', async () => {

    // given
    const expectedEvents = [testEvent];
    eventDb.getEventsByOrganiserId = mockEventDbGetEventByOrganiserId.mockResolvedValue(expectedEvents);
 
    // when
    const actualEvents = await eventService.getEventsByOrganiserId({organiserId:1});
 
    // then
    expect(mockEventDbGetEventByOrganiserId).toHaveBeenCalledTimes(1);
    expect(actualEvents.length).toBe(1);
    expect(actualEvents[0].equals(testEvent)).toBeTruthy();
});

test('Given events, when a non existing event is requested by id, then a "Event does not exist" error is reported', async () => {

    //given
    eventDb.getEventById = mockEventDbGetEventById.mockResolvedValue(null);
  
    //when 
    const invalid_id:number = -1;
    const getEventById = async () => eventService.getEventById({id:invalid_id})
  
    // then
    expect(getEventById).rejects.toThrow(`Event with id: ${invalid_id} does not exist.`);
});

test('Given minimal valid event values, when event is created, then event is created with with those values', async () => {

    //given
    eventDb.createEvent = mockEventDbCreateEvent.mockResolvedValue(testEvent);
    eventDb.getEventsByOrganiserId = mockEventDbGetEventByOrganiserId.mockResolvedValue([]);
    userDb.getUserById = mockUserDbGetUserById.mockResolvedValue(testUser);
 
    //when 
    const name = 'Bierproeverij in Leuven';
    const description = 'Proef de beste Belgische bieren....';
    const date = new Date("2025-06-29T08:05");
    const location = "Leuven";

    const actualEvent = await eventService.createEvent({name, description, date, location}, testUserInput);
 
    //then
    expect(mockEventDbGetEventByOrganiserId).toHaveBeenCalledTimes(1);
    expect(mockEventDbCreateEvent).toHaveBeenCalledTimes(1);
    expect(mockEventDbCreateEvent).toHaveBeenCalledWith(testEvent);
    expect(actualEvent.equals(testEvent)).toBeTruthy();
});

test('Given events, when a event is create by a client user, then a "The user is not an organiser error is reported', async () => {

    //given
    userDb.getUserById = mockUserDbGetUserById.mockResolvedValue(testClientUser);
  
    //when 
    const name = 'Bierproeverij in Leuven';
    const description = 'Proef de beste Belgische bieren....';
    const date = new Date("2025-06-29T08:05");
    const location = "Leuven";

    const createEvent = async () => eventService.createEvent({name, description, date, location}, testClientUserInput)
  
    // then
    expect(createEvent).rejects.toThrow(`The user with email=${testClientUser.getEmail()}, is not an organiser`);
});