import { Event } from '../model/event';
import database from './database';

const getAllEvents = () => {};

const getEventById = () => {};

const getEventsByOrganiserId = async ({
    organiserId,
}: {
    organiserId: number;
}): Promise<Event[]> => {
    try {
        const eventsPrisma = await database.event.findMany({
            where: { organiserId },
            include: {
                organiser: true,
                attendees: true,
            },
        });
        return eventsPrisma.map((eventPrisma) => Event.from(eventPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const createEvent = () => {};

export default {
    getAllEvents,
    getEventById,
    getEventsByOrganiserId,
    createEvent,
};
