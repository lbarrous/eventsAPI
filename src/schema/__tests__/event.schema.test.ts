import { createEventSchema, deleteEventSchema, subscribeToEventSchema, updateEventSchema } from '../event.schema';

describe('Event schema', () => {
  const moreThan200Chars = Array(201).fill(0).join();

  it.each`
    eventBody
    ${{ body: {} }}
    ${{ body: { headline: 'headline' } }}
    ${{ body: { headline: 'headline', description: moreThan200Chars } }}
    ${{ body: { headline: 'headline', description: 'description' } }}
    ${{ body: { headline: 'headline', description: 'description', location: 'location' } }}
    ${{ body: { headline: 'headline', description: 'description', location: 'location', startDate: 'invaliDate' } }}
    ${{ body: { headline: 'headline', description: 'description', location: 'location', startDate: '2020-09-29 01:30:00' } }}
    ${{ body: { headline: 'headline', description: 'description', location: 'location', startDate: '2022-09-29 01:30:00', status: '' } }}
  `(
    'Create event schema should, when event body is $eventBody throw an error',
    async ({ eventBody }) => {
      await expect(
        createEventSchema.validate(eventBody)
      ).rejects.toThrowError();
    }
  );
  it.each`
    eventBody
    ${{ body: {} }}
    ${{ body: { headline: 'headline' } }}
    ${{ body: { headline: 'headline', description: moreThan200Chars } }}
    ${{ body: { headline: 'headline', description: 'description' } }}
    ${{ body: { headline: 'headline', description: 'description', location: 'location' } }}
    ${{ body: { headline: 'headline', description: 'description', location: 'location', startDate: 'invaliDate' } }}
    ${{ body: { headline: 'headline', description: 'description', location: 'location', startDate: '2020-09-29 01:30:00' } }}
    ${{ body: { headline: 'headline', description: 'description', location: 'location', startDate: '2022-09-29 01:30:00' }, params: {} }}
    ${{ body: { headline: 'headline', description: 'description', location: 'location', startDate: '2022-09-29 01:30:00', status: 'PRIVATE' } }}
    ${{ body: { headline: 'headline', description: 'description', location: 'location', startDate: '2022-09-29 01:30:00', status: 'PRIVATE' }, params: {} }}
  `(
    'Update event schema should, when event body is $eventBody throw an error',
    async ({ eventBody }) => {
      await expect(
        updateEventSchema.validate(eventBody)
      ).rejects.toThrowError();
    }
  );
  it.each`
    eventBody
    ${{ params: {} }}
  `(
    'delete and subscribe event schemas should, when event body is $eventBody throw an error',
    async ({ eventBody }) => {
      await expect(
        deleteEventSchema.validate(eventBody)
      ).rejects.toThrowError();
      await expect(
        subscribeToEventSchema.validate(eventBody)
      ).rejects.toThrowError();
    }
  );
});
