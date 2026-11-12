import { test, expect } from '../../src/fixtures/test-fixtures';
import { BookingData, DataFactory } from '../../src/utils/data-factory';
import { BookingId, CreatedBooking } from '../../src/utils/booking-api';

test.describe('Booking API (Restful-Booker)', () => {
  test.beforeEach(async ({ bookingApi }) => {
    await bookingApi.authenticate();
  });

  test('full CRUD lifecycle of a booking @smoke', async ({ bookingApi }) => {
    const booking = DataFactory.booking();

    // CREATE
    const createRes = await bookingApi.create(booking);
    expect(createRes.status()).toBe(200);
    const { bookingid, booking: created } = (await createRes.json()) as CreatedBooking;
    expect(bookingid).toEqual(expect.any(Number));
    expect(created).toEqual(booking);

    // READ
    const getRes = await bookingApi.get(bookingid);
    expect(getRes.status()).toBe(200);
    expect(await getRes.json()).toEqual(booking);

    // UPDATE (PUT)
    const updated = DataFactory.booking();
    const putRes = await bookingApi.update(bookingid, updated);
    expect(putRes.status()).toBe(200);
    expect(await putRes.json()).toEqual(updated);

    // PARTIAL UPDATE (PATCH)
    const patchRes = await bookingApi.partialUpdate(bookingid, { firstname: 'Patched' });
    expect(patchRes.status()).toBe(200);
    expect(((await patchRes.json()) as BookingData).firstname).toBe('Patched');

    // DELETE
    const deleteRes = await bookingApi.delete(bookingid);
    expect(deleteRes.status()).toBe(201);
    expect((await bookingApi.get(bookingid)).status()).toBe(404);
  });

  test('new booking is returned when filtering by name', async ({ bookingApi }) => {
    const booking = DataFactory.booking({ firstname: `QA${Date.now()}` });
    const { bookingid } = await bookingApi.createAndParse(booking);

    const res = await bookingApi.list({ firstname: booking.firstname, lastname: booking.lastname });
    expect(res.status()).toBe(200);
    const ids = ((await res.json()) as BookingId[]).map((b) => b.bookingid);
    expect(ids).toContain(bookingid);

    await bookingApi.delete(bookingid);
  });

  test('delete without auth token is rejected (403)', async ({ bookingApi }) => {
    const { bookingid } = await bookingApi.createAndParse(DataFactory.booking());

    const res = await bookingApi.delete(bookingid, false);
    expect(res.status()).toBe(403);

    await bookingApi.delete(bookingid);
  });

  test('getting a non-existent booking returns 404', async ({ bookingApi }) => {
    const res = await bookingApi.get(999_999_999);
    expect(res.status()).toBe(404);
  });
});
