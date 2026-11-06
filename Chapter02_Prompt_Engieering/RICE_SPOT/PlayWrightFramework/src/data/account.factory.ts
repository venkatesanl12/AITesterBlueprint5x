import { faker } from '@faker-js/faker';

export type TestAccount = {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  password: string;
};

export function createTestAccount(): TestAccount {
  const uniqueSuffix = `${Date.now()}-${faker.string.alphanumeric(6).toLowerCase()}`;

  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: `playwright-${uniqueSuffix}@example.test`,
    telephone: faker.string.numeric(10),
    password: faker.internet.password(),
  };
}
