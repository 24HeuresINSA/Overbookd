import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { HashingUtilsService } from "../src/hashing-utils/hashing-utils.service";
import { categoriesAndGears } from "./seeders/gears";
import { permissions } from "./seeders/permissions";
import { defaultGeoLocation, signaLocations } from "./seeders/signa-locations";
import {
  Configuration,
  EVENT_DATE_KEY,
  ORGA_WEEK_DATE_KEY,
  REGISTER_FORM_KEY,
  USEFUL_LINKS_KEY,
} from "@overbookd/configuration";
import { defaultCommitmentPresentation } from "@overbookd/registration";
import { SlugifyService } from "@overbookd/slugify";
import { teams } from "./seeders/teams";
import { userTeamTuples } from "./seeders/users";
import { signages } from "./seeders/signages";
import { Team } from "@overbookd/team";
import { Duration, OverDate } from "@overbookd/time";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not defined");
}
const adapter = new PrismaPg({ connectionString: url });
const prisma = new PrismaClient({ adapter });

async function insertOrUpdateCategory(
  name: string,
  teams: Team[],
  parent?: { id: number; path: string; ownerCode: string },
) {
  const parentId = parent?.id;
  const path = parent
    ? `${parent.path}->${SlugifyService.apply(name)}`
    : SlugifyService.apply(name);
  const owner = parent
    ? { code: parent.ownerCode }
    : teams.find((team) => team.code === name.toLocaleLowerCase());
  const ownerPart = owner ? { ownerCode: owner.code } : {};
  const category = { name, path, parent: parentId, ...ownerPart };
  return prisma.catalogCategory.upsert({
    create: category,
    update: category,
    where: { path },
  });
}

function insertOrUpdateGear(name: string, categoryId: number) {
  const slug = SlugifyService.apply(name);
  const gear = { name, slug, categoryId };
  return prisma.catalogGear.upsert({
    create: gear,
    update: gear,
    where: { slug },
  });
}

async function main() {
  await Promise.all(
    teams.map((team) =>
      prisma.team.upsert({
        where: { name: team.name },
        update: team,
        create: team,
      }),
    ),
  );
  const databaseTeams = await prisma.team.findMany();

  console.log(`\n${databaseTeams.length} teams inserted 👥`);

  console.log("\nCreating users 👤");

  const hashPassword = await new HashingUtilsService().hash("password");
  const savedUsers = await Promise.all(
    userTeamTuples.map(async (userTeam) => {
      const [user, teamNames] = userTeam;

      const teams = databaseTeams
        .filter((team) => teamNames.split(",").includes(team.code))
        .map((team) => ({ teamCode: team.code }));

      const email = `${user}@24h.me`;

      const userCreateData = {
        email,
        zitadelId: email,
        firstName: user,
        lastName: user,
        nickname: null,
        birthDate: new Date(1990, 1, 1),
        phoneNumber: "0612345678",
        password: hashPassword,
        teams: {
          create: teams,
        },
      };

      const userUpdateData = {
        firstName: user,
        lastName: user,
        password: hashPassword,
      };

      await prisma.user.upsert({
        where: { email },
        update: userUpdateData,
        create: userCreateData,
      });

      console.log(
        "------------------------------------------------------------",
      );
      console.log(`User ${user} added with teams ${teamNames.split(",")}`);
    }),
  );

  console.log("------------------------------------------------------------");
  console.log(`${savedUsers.length} users inserted 👤`);

  console.log("\nCreating gears and categories 🛠️");

  await Promise.all(
    categoriesAndGears.map(async ({ name, gears, categories }) => {
      console.log(`🏷️ Inserting ${name}`);
      const {
        id: categoryId,
        path: categoryPath,
        ownerCode,
      } = await insertOrUpdateCategory(name, databaseTeams);
      const gearsInsert = gears
        ? gears?.map((name) => {
            console.log(`🔨 Inserting ${name} with category ${categoryPath}`);
            return insertOrUpdateGear(name, categoryId);
          })
        : [];
      const categoriesInsert = categories
        ? categories.map(async (subCategory) => {
            console.log(
              `🏷️ Inserting ${subCategory.name} with category #${categoryId} as parent`,
            );
            const { id: subCategoryId, path: subCategoryPath } =
              await insertOrUpdateCategory(subCategory.name, databaseTeams, {
                id: categoryId,
                path: categoryPath,
                ownerCode,
              });
            return Promise.all(
              subCategory.gears.map((gear) => {
                console.log(
                  `🔨 Inserting ${gear} with category ${subCategoryPath}`,
                );
                return insertOrUpdateGear(gear, subCategoryId);
              }),
            );
          })
        : [];
      await Promise.all([...gearsInsert, ...categoriesInsert]);
    }),
  );

  console.log("\nCreating permissions 💂");

  const savedPermissions = await Promise.all(
    permissions.map(async (permission) => {
      const name = permission.name;
      console.log("----------------------------------------------------------");
      console.log(`Inserting ${name} as permission`);
      return prisma.permission.upsert({
        where: { name },
        update: permission,
        create: permission,
      });
    }),
  );

  console.log("----------------------------------------------------------");
  console.log(`${savedPermissions.length} permissions inserted 💂`);

  console.log("\nCreating config ⚙️");

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const currentDate = OverDate.fromLocal(now);

  console.log("----------------------------------------------------------");
  console.log("Inserting event date");
  const eventDate = currentDate.plus(Duration.ONE_WEEK.times(6));
  const eventDateConfig: Configuration = {
    key: EVENT_DATE_KEY,
    value: { start: eventDate.date.toISOString() },
  };
  await prisma.configuration.upsert({
    where: { key: EVENT_DATE_KEY },
    update: eventDateConfig,
    create: eventDateConfig,
  });

  console.log("----------------------------------------------------------");
  console.log("Inserting orga week date");
  const orgaWeekDate = currentDate.plus(Duration.ONE_WEEK);
  const orgaWeekDateConfig: Configuration = {
    key: ORGA_WEEK_DATE_KEY,
    value: { start: orgaWeekDate.date.toISOString() },
  };
  await prisma.configuration.upsert({
    where: { key: ORGA_WEEK_DATE_KEY },
    update: orgaWeekDateConfig,
    create: orgaWeekDateConfig,
  });

  console.log("----------------------------------------------------------");
  console.log("Inserting register form text");
  const registerFormConfig: Configuration = {
    key: REGISTER_FORM_KEY,
    value: {
      description: defaultCommitmentPresentation,
    },
  };
  await prisma.configuration.upsert({
    where: { key: REGISTER_FORM_KEY },
    update: registerFormConfig,
    create: registerFormConfig,
  });

  console.log("----------------------------------------------------------");
  console.log("Inserting useful links");
  const usefulLinksConfig: Configuration = {
    key: USEFUL_LINKS_KEY,
    value: {
      googleCalendar: "https://calendar.google.com",
      slack: "https://join.slack.com",
    },
  };
  await prisma.configuration.upsert({
    where: { key: USEFUL_LINKS_KEY },
    update: usefulLinksConfig,
    create: usefulLinksConfig,
  });

  console.log("----------------------------------------------------------");

  const locations = await Promise.all(
    signaLocations.map(({ name }) =>
      prisma.signaLocation.create({
        data: { name, geoLocation: defaultGeoLocation },
      }),
    ),
  );

  console.log(`\n${locations.length} signa locations inserted ⛳`);

  const charismaPeriodData = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 24; j += 2) {
      const start = eventDate
        .plus(Duration.ONE_DAY.times(i))
        .plus(Duration.ONE_HOUR.times(j));
      const end = eventDate
        .plus(Duration.ONE_DAY.times(i))
        .plus(Duration.ONE_HOUR.times(j + 2));
      charismaPeriodData.push({
        name: `Charisma ${i} - ${j}`,
        start: start.date,
        end: end.date,
        charisma: j >= 18 ? 5 : 10,
      });
    }
  }

  const charismaPeriods = await Promise.all(
    charismaPeriodData.map((period) =>
      prisma.charismaPeriod.create({ data: period }),
    ),
  );

  console.log(`\n${charismaPeriods.length} charisma periods inserted 🎉`);

  const savedSignages = await prisma.catalogSignage.createMany({
    data: signages,
  });

  console.log(`\n${savedSignages.count} signages inserted 📍`);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
