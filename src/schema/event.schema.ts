import moment from 'moment';
import { object, string } from 'yup';

const EVENT_STATUS_TYPES = ['PRIVATE', 'PUBLIC', 'DRAFT'];
const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

const payload = {
  body: object({
    headline: string().required('Headline is required'),
    description: string()
      .required('Description is required')
      .max(200, 'Description can have up to 200 characters.'),
    location: string().required('Location is required'),
    startDate: string()
      .required('Start date is required')
      .test(
        'allowedDate',
        'Must be a valid date (yyyy-mm-dd hh:mm.ss)',
        (val) => DATE_REGEX.test(val || ''),
      )
      .test('afterToday', 'Start date must be after today', (val) => {
        const momentDate = moment(val, 'YYYY-MM-DD HH:mm:ss');
        return momentDate.isAfter(moment());
      }),
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
        (val) => EVENT_STATUS_TYPES.includes(val || '')
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
