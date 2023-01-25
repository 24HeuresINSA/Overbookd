import { EventGearRequest } from "~/utils/models/gearRequests";

interface State {
  gearRequests: EventGearRequest[];
}

const gearRequests: EventGearRequest[] = [
  {
    seeker: { type: "FA", id: 2, name: "Cine Club" },
    rentalPeriod: {
      start: new Date("2023-05-13T08:00:00.000Z"),
      end: new Date("2023-05-14T10:30:00.000Z"),
      id: 1,
    },
    quantity: 4,
    drive: "Parking Eiffel",
    gear: {
      name: "Vauban 2m",
      slug: "vauban-2m",
      id: 1,
      isPonctualUsage: false,
      category: { name: "BARRIERES", path: "barrieres", id: 1 },
      owner: { name: "barrieres", code: "barrieres" },
      code: "BA_001",
    },
  },
  {
    seeker: { type: "FA", id: 2, name: "Cine Club" },
    rentalPeriod: {
      start: new Date("2023-05-13T08:00:00.000Z"),
      end: new Date("2023-05-14T10:30:00.000Z"),
      id: 1,
    },
    quantity: 1,
    drive: "Magasin",
    gear: {
      name: "Table de cours 2 personnes",
      slug: "table-de-cours-2-personnes",
      id: 263,
      isPonctualUsage: false,
      category: { name: "MOBILIER", path: "matos->mobilier", id: 14 },
      owner: { name: "matos", code: "matos" },
      code: "MA_MO_263",
    },
  },
  {
    seeker: { type: "FA", id: 2, name: "Cine Club" },
    rentalPeriod: {
      start: new Date("2023-05-13T08:00:00.000Z"),
      end: new Date("2023-05-14T10:30:00.000Z"),
      id: 1,
    },
    quantity: 2,
    drive: "Magasin",
    gear: {
      name: "Chaise",
      slug: "chaise",
      id: 266,
      isPonctualUsage: false,
      category: { name: "MOBILIER", path: "matos->mobilier", id: 14 },
      owner: { name: "matos", code: "matos" },
      code: "MA_MO_266",
    },
  },
  {
    seeker: { type: "FA", id: 2, name: "Cine Club" },
    rentalPeriod: {
      start: new Date("2023-05-13T08:00:00.000Z"),
      end: new Date("2023-05-14T10:30:00.000Z"),
      id: 1,
    },
    quantity: 1,
    drive: "Magasin",
    gear: {
      name: "Multiprise 4 prises",
      slug: "multiprise-4-prises",
      id: 13,
      isPonctualUsage: false,
      category: { name: "ALIMENTATION", path: "elec->alimentation", id: 5 },
      owner: { name: "elec", code: "elec" },
      code: "EL_AL_013",
    },
  },
];

export const state = (): State => ({
  gearRequests,
});
