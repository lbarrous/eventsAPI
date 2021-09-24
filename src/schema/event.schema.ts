import { object, string } from 'yup';

const payload = {
  body: object({
    headline: string().required('Headline is required'),
    description: string()
      .required('Description is required')
      .max(200, 'Description can have up to 200 characters.'),
  }),
};

const params = {
  params: object({
    eventId: string().required('eventId is required'),
  }),
};

export const createEventSchema = object({
  ...payload,
});

export const updateEventSchema = object({
  ...params,
  ...payload,
});

export const deleteEventSchema = object({
  ...params,
});
