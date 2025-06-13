import eventDB from '../repository/event.db';
import userDB from '../repository/user.db';
import { Event } from '../model/event';
import { User } from '../model/user';

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

const createEvent = ()=>{}


export default {
    getAllEvents,
    getEventById,
    getEventsByOrganiserId,
    getUpcomingEvents,
    createEvent,
};
