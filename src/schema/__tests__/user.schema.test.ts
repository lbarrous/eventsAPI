import { createUserSchema, createUserSessionSchema } from '../user.schema';

describe('User schema', () => {
  it.each`
    eventBody
    ${{ body: {} }}
    ${{ body: { name: 'name' } }}
    ${{ body: { name: 'name', password: '' } }}
    ${{ body: { name: 'name', password: 'àèìòù!' } }}
    ${{ body: { name: 'name', password: '123456', passwordConfirmation: '' } }}
    ${{ body: { name: 'name', password: '123456', passwordConfirmation: '123456' } }}
  `(
    'Create user schema should, when event body is $eventBody throw an error',
    async ({ eventBody }) => {
      await expect(createUserSchema.validate(eventBody)).rejects.toThrowError();
    }
  );
  it.each`
    eventBody
    ${{ body: {} }}
    ${{ body: { password: '' } }}
    ${{ body: { password: 'àèìòù!' } }}
    ${{ body: { password: '123456!' } }}
    ${{ body: { password: '123456!', email: '' } }}
  `(
    'Create user session schema should, when event body is $eventBody throw an error',
    async ({ eventBody }) => {
      await expect(
        createUserSessionSchema.validate(eventBody)
      ).rejects.toThrowError();
    }
  );
});
