import eventDB from '../repository/event.db';
import userDB from '../repository/user.db';
import { Event } from '../model/event';
import { User } from '../model/user';
import { ExperienceInput, UserInput} from '../types';

const getAllEvents = async (): Promise<Event[]> => eventDB.getAllEvents();

const getEventById = async ({ id }: { id: number }): Promise<Event> => {
    const event = await eventDB.getEventById({ id });
    if (!event) {
        throw new Error(`Event with id: ${id} does not exist.`);
    }
    return event;
};

const getEventsByOrganiserId = async ({ organiserId }: { organiserId: number }): Promise<Event[]> => {
    const events = await eventDB.getEventsByOrganiserId({ organiserId });
    return events;
};

const getUpcomingEvents = async (): Promise<Event[]> => {
    const allEvents = await eventDB.getAllEvents();
    const now = new Date();
    return allEvents.filter((event) => event.getDate() > now);
};

const createEvent = async ({
     name,
     description,
     date,
     location,
}: ExperienceInput, user:User): Promise<Event> => {
 
    // only an organiser is allowed create a new event
    if (!user.getIsOrganiser())
    {
        throw new Error(`The user with email=${user.getEmail()}, is not an organiser`);
    }    
    
    // let the domain layer validate the properties input
    const event = new Event({
        name,
        description,
        date,
        location,
        organiser:user,
        attendees:[],
    });
    return await eventDB.createEvent(event);
}

export default {
    getAllEvents,
    getEventById,
    getEventsByOrganiserId,
    getUpcomingEvents,
    createEvent,
};
