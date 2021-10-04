// @ts-nocheck
import Event from '../../model/event.model';
import * as EventService from '../event.service';

const mockingoose = require('mockingoose');

describe('Event service', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should find events', async () => {
    mockingoose(Event).toReturn({ _id: 'event1' }, 'find');
    const firstEvent = await EventService.findEvents('-_id');
    expect(firstEvent).toBeTruthy();
    mockingoose(Event).toReturn({ _id: 'event2' }, 'find');
    const secondEvent = await EventService.findEventsByCriteria({ _id: 'id' });
    expect(secondEvent).toBeTruthy();
  });
  it('should update events', async () => {
    const event = new Event();
    mockingoose(Event).toReturn({ _id: 'event1' }, 'find');
    EventService.findAndUpdateEvent(
      { eventId: event._id },
      event,
    );
    const eventAfterUpdate = EventService.findEventsByCriteria({ _id: event._id });
    expect(eventAfterUpdate).toBeTruthy();
  });
});
