import { Event } from '../model/event';
import database from './database';

const getAllEvents = async () : Promise<Event[]> => {
    try {
        const eventsPrisma = await database.event.findMany({
            include: {
                organiser: true,
                attendees: true,
            },
        });
        return eventsPrisma.map((eventPrisma)=> Event.from(eventPrisma));

    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.')
    }
};   

const getEventById = async ({id}: {id: number}): Promise<Event | null> => {
    try {
        const eventPrisma = await database.event.findUnique({
            where: { id },
            include: {
                organiser: true,
                attendees: true,
            },
        });
        return eventPrisma ? Event.from(eventPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

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

const createEvent = async (event: Event) : Promise<Event> => {
    try {
        const eventPrisma = await database.event.create({
            data: {
                name: event.getName(),
                description: event.getDescription(),
                date: event.getDate(),
                location: event.getLocation(),
                organiser: {
                    connect: { id: event.getOrganiser().getId() },
                },
                attendees: {
                    connect: event.getAttendees().map((attendee)=> ({ id: attendee.getId() })),
                },
            },
            include: {
                organiser: true,
                attendees: true,
            },
        });
        return Event.from(eventPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
}

export default {
    getAllEvents,
    getEventById,
    getEventsByOrganiserId,
    createEvent,
};
