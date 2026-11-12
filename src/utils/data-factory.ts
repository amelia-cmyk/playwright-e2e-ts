import { faker } from '@faker-js/faker';

export interface EmployeeData {
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;
}

export interface BookingData {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds: string;
}

const isoDate = (d: Date) => d.toISOString().split('T')[0];

/** Generates unique test data so tests never collide on the shared demo environment. */
export const DataFactory = {
  employee(overrides: Partial<EmployeeData> = {}): EmployeeData {
    return {
      firstName: faker.person.firstName(),
      middleName: faker.person.middleName(),
      lastName: `QA${faker.string.alphanumeric(6)}`,
      employeeId: faker.string.numeric(8),
      ...overrides,
    };
  },

  booking(overrides: Partial<BookingData> = {}): BookingData {
    const checkin = faker.date.soon({ days: 30 });
    const checkout = faker.date.soon({ days: 7, refDate: checkin });
    return {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      totalprice: faker.number.int({ min: 50, max: 1000 }),
      depositpaid: faker.datatype.boolean(),
      bookingdates: { checkin: isoDate(checkin), checkout: isoDate(checkout) },
      additionalneeds: faker.helpers.arrayElement(['Breakfast', 'Late checkout', 'Airport pickup']),
      ...overrides,
    };
  },
};
