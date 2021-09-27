import { object, string } from 'yup';
import { date } from 'yup/lib/locale';

const EVENT_STATUS_TYPES = ['PRIVATE', 'PUBLIC', 'DRAFT'];

const payload = {
  body: object({
    headline: string().required('Headline is required'),
    description: string()
      .required('Description is required')
      .max(200, 'Description can have up to 200 characters.'),
    location: string().required('Location is required'),
    //startDate: date().r
  }),
};

const updateEventParams = {
  params: object({
    eventId: string().required('eventId is required'),
    status: string()
      .required('Status is required')
      .test(
        'allowedValue',
        'Must be a valid status (Public, Private or Draft)',
        (val) => EVENT_STATUS_TYPES.includes(val || ''),
      ),
  }),
};

const withEventIdParams = {
  params: object({
    eventId: string().required('eventId is required'),
  }),
};

export const createEventSchema = object({
  ...payload,
});

export const updateEventSchema = object({
  ...updateEventParams,
  ...payload,
});

export const deleteEventSchema = object({
  ...withEventIdParams,
});

export const subscribeToEventSchema = object({
  ...withEventIdParams,
});
