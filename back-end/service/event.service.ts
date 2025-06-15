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

// Problem : <ExperienceInput>req.body does not create a date object => date2:Date is a string object => why is this ?
// 
// chat GPT: one or both of the values you're passing to the function 
// aren't actually Date objects — they might be strings, numbers, or something else.
function isSameDay(date1: Date | string, date2: Date | string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    throw new Error('Invalid date input');
  }

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

const getEventsByOrganiserIdOnDate = async ({ organiserId, date }: { organiserId: number; date: Date }): Promise<Event[]> => {
    
    const allEvents = await eventDB.getEventsByOrganiserId({ organiserId });
    const eventsOnDate = allEvents.filter(event => isSameDay(event.getDate(), date));
    return eventsOnDate;
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
    
    // only one event a day is allowed
    const existingEventsOnDate = await getEventsByOrganiserIdOnDate({organiserId: user.getId()!, date})
    if (existingEventsOnDate.length > 0)
    {
        throw new Error(`There is alreay an event on the selected day for organiser ${user.getFullName()}`);
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
