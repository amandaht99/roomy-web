import { describe, expect, it } from "@jest/globals";

import { getAllFlats, putFlatDate } from "./flats";

describe("getAllFlats", () => {
  it("should return an array of flats not owned by the user", async () => {
    const userId = "123";

    const flats = await getAllFlats(userId);

    expect(flats).toBeInstanceOf(Array);

    flats.forEach((flat) => {
      expect(flat.ownerId).not.toEqual(userId);
    });
  });

  it("should return an array of all flats when user.id not given", async () => {
    const userId = "undefined";

    const flats = await getAllFlats(userId);

    expect(flats).toBeInstanceOf(Array);

    flats.forEach((flat) => {
      expect(flat.ownerId).not.toEqual(userId);
      expect(flat).toHaveProperty("id");
      expect(flat).toHaveProperty("dateFrom");
      expect(flat).toHaveProperty("dateTo");
      expect(flat).toHaveProperty("address");
      expect(flat.address).toHaveProperty("street");
      expect(flat.address).toHaveProperty("city");
    });
  });
});

describe("putFlatDate", () => {
  // These tests are not working yet since the flatId cannot be found in the database.
  // Use beforeAll to create a flat in the database before running the tests:
  beforeAll(async () => {

    
  });

  it("should update the 'From' date of a flat", async () => {
    const flatId = "10";
    const date = "2026-12-31";

    const flat = await putFlatDate(flatId, { type: "From", date });

    expect(flat).toHaveProperty("id");
    expect(flat).toHaveProperty("dateFrom");
    expect(flat).toHaveProperty("dateTo");
    expect(flat).toHaveProperty("address");
    expect(flat?.address).toHaveProperty("street");
    expect(flat?.address).toHaveProperty("city");
    expect(flat?.dateFrom).toEqual(new Date(date));
  });

  it("should update the 'To' date of a flat", async () => {
    const flatId = "10";
    const date = "2026-12-31";

    const flat = await putFlatDate(flatId, { type: "To", date });

    expect(flat).toHaveProperty("id");
    expect(flat).toHaveProperty("dateFrom");
    expect(flat).toHaveProperty("dateTo");
    expect(flat).toHaveProperty("address");
    expect(flat?.address).toHaveProperty("street");
    expect(flat?.address).toHaveProperty("city");
    expect(flat?.dateTo).toEqual(new Date(date));
  });
});
