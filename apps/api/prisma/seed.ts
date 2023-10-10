import { PrismaClient } from "@prisma/client";
import { HashingUtilsService } from "../src/hashing-utils/hashing-utils.service";
import { categoriesAndGears } from "./seeders/gears";
import { permissions } from "./seeders/permissions";
import { signaLocations } from "./seeders/signa-locations";
import { Configuration } from "@overbookd/configuration";
import { defaultCommitmentPresentation } from "@overbookd/registration";
import { SlugifyService } from "@overbookd/slugify";
import { Team } from "../src/team/team.model";
import { teams } from "./seeders/teams";
import { userTeamTuples } from "./seeders/users";

const prisma = new PrismaClient();

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
  console.log("Creating teams 👥");

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

  console.log("Creating users 👤");

  const hashPassword = await new HashingUtilsService().hash("password");
  await Promise.all(
    userTeamTuples.map(async (userTeam) => {
      const [user, teamNames] = userTeam;

      const teams = databaseTeams
        .filter((team) => teamNames.split(",").includes(team.code))
        .map((team) => ({ teamCode: team.code }));

      const email = `${user}@24h.me`;

      const userData = {
        email,
        firstname: user,
        lastname: user,
        nickname: "",
        birthdate: new Date(1990, 1, 1),
        phone: "0612345678",
        password: hashPassword,
        teams: {
          create: teams,
        },
      };

      await prisma.user.upsert({
        where: { email },
        update: userData,
        create: userData,
      });

      console.log(`User ${user} added with teams ${teamNames.split(",")}`);
      console.log(
        "------------------------------------------------------------",
      );
    }),
  );

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

  console.log(`\n${savedPermissions.length} permissions inserted`);

  const sgConfig: Configuration = {
    key: "sg",
    value: {
      prixFutBlonde: 0,
      prixFutBlanche: 0,
      prixFutTriple: 0,
      prixFutFlower: 0,
    },
  };
  console.log("Creating of sg config");
  await prisma.configuration.upsert({
    where: { key: "sg" },
    update: sgConfig,
    create: sgConfig,
  });

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const eventDateConfig: Configuration = {
    key: "eventDate",
    value: {
      start: currentDate.toISOString(),
    },
  };
  console.log("Creating of event date config");
  await prisma.configuration.upsert({
    where: { key: "eventDate" },
    update: eventDateConfig,
    create: eventDateConfig,
  });
  console.log("Creating of register form config");
  const registerFormConfig: Configuration = {
    key: "registerForm",
    value: {
      description: defaultCommitmentPresentation,
    },
  };
  await prisma.configuration.upsert({
    where: { key: "registerForm" },
    update: registerFormConfig,
    create: registerFormConfig,
  });

  const locations = await Promise.all(
    signaLocations.map(({ name }) =>
      prisma.signaLocation.create({ data: { name } }),
    ),
  );

  console.log(`\n${locations.length} Signa Locations inserted ⛳`);

  const charismaPeriodData = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 12; j += 2) {
      charismaPeriodData.push({
        name: `Charisma ${i} - ${j}`,
        description: `Charisma ${i} - ${j}`,
        start: new Date(2021, 8, i, j),
        end: new Date(2021, 8, i, j + 2),
        charisma: j % 2 === 0 ? 10 : 5,
      });
    }
  }

  const charismaPeriods = await Promise.all(
    charismaPeriodData.map((period) =>
      prisma.charismaPeriod.create({ data: period }),
    ),
  );

  console.log(`\n${charismaPeriods.length} Charisma Periods inserted 🎉`);
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
