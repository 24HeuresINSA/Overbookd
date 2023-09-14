import { PrismaClient } from "@prisma/client";
import { HashingUtilsService } from "../src/hashing-utils/hashing-utils.service";
import { Departments, Years } from "../src/user/dto/common";
import { categoriesAndGears } from "./seeders/gears";
import { permissions } from "./seeders/permissions";
import { signaLocations } from "./seeders/signa-locations";
import { Configuration } from "@overbookd/configuration";
import { defaultCommitmentPresentation } from "@overbookd/registration";
import { SlugifyService } from "@overbookd/slugify";
import { Team } from "../src/team/team.model";

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

  const teams: Team[] = [
    {
      name: "admin",
      code: "admin",
      color: "#000000",
      icon: "mdi-eye-circle",
    },
    {
      name: "Accueil artiste",
      code: "accueil-artiste",
      color: "#A166F2",
      icon: "mdi-plane-train",
    },
    {
      name: "bar",
      code: "bar",
      color: "#F9C80E",
      icon: "mdi-beer",
    },
    {
      name: "barrieres",
      code: "barrieres",
      color: "#F86624",
      icon: "mdi-boom-gate",
    },
    {
      name: "bde",
      code: "bde",
      color: "#FF4343",
      icon: "mdi-bootstrap",
    },
    {
      name: "bureau",
      code: "bureau",
      color: "#e9c46a",
      icon: "mdi-desk",
    },
    {
      name: "catering",
      code: "catering",
      color: "#662E9B",
      icon: "mdi-food",
    },
    {
      name: "camion",
      code: "camion",
      color: "#737F49",
      icon: "mdi-truck-outline",
    },
    {
      name: "communication",
      code: "communication",
      color: "#262E9B",
      icon: "mdi-camera",
    },
    {
      name: "concert",
      code: "concert",
      color: "#75d46c",
      icon: "mdi-microphone",
    },
    {
      name: "conducteur",
      code: "conducteur",
      color: "#9B2E2E",
      icon: "mdi-car-key",
    },
    {
      name: "conducteur FEN",
      code: "conducteur-fen",
      color: "#9B2E2E",
      icon: "mdi-key-variant",
    },
    {
      name: "confiance",
      code: "confiance",
      color: "#d169e0",
      icon: "mdi-account-check",
    },
    {
      name: "courses",
      code: "courses",
      color: "#75d46c",
      icon: "mdi-bike-fast",
    },
    {
      name: "culture",
      code: "culture",
      color: "#662E9B",
      icon: "mdi-theater",
    },
    {
      name: "DD",
      code: "dd",
      color: "#32a852",
      icon: "mdi-tree",
    },
    {
      name: "deco",
      code: "deco",
      color: "#662E9B",
      icon: "mdi-format-paint",
    },
    {
      name: "elec",
      code: "elec",
      color: "#ffb703",
      icon: "mdi-flash",
    },
    {
      name: "fen",
      code: "fen",
      color: "#737F49",
      icon: "mdi-forklift",
    },
    {
      name: "hard",
      code: "hard",
      color: "#969600",
      icon: "mdi-account-hard-hat",
    },
    {
      name: "humain",
      code: "humain",
      color: "#f4a261",
      icon: "mdi-human",
    },
    {
      name: "informatique",
      code: "informatique",
      color: "#3fd4af",
      icon: "mdi-monitor-screenshot",
    },
    {
      name: "karna",
      code: "karna",
      color: "#E4B613",
      icon: "mdi-party-popper",
    },
    {
      name: "kfet",
      code: "kfet",
      color: "#438EFF",
      icon: "mdi-beer",
    },
    {
      name: "beboo",
      code: "beboo",
      color: "#ff66e8",
      icon: "mdi-human-female-boy",
    },
    {
      name: "matos",
      code: "matos",
      color: "#d4411e",
      icon: "mdi-truck",
    },
    {
      name: "orga",
      code: "orga",
      color: "#e62727",
      icon: "mdi-account-hard-hat",
    },
    {
      name: "payant",
      code: "payant",
      color: "#118C4F",
      icon: "mdi-ticket",
    },
    {
      name: "plaizir",
      code: "plaizir",
      color: "#c9406a",
      icon: "mdi-ferris-wheel",
    },
    {
      name: "scene",
      code: "scene",
      color: "#EA3546",
      icon: "mdi-soundbar",
    },
    {
      name: "secu",
      code: "secu",
      color: "#e76f51",
      icon: "mdi-security",
    },
    {
      name: "sg",
      code: "sg",
      color: "#ab1f07",
      icon: "mdi-human-male-child",
    },
    {
      name: "signa",
      code: "signa",
      color: "#EA3546",
      icon: "mdi-sign-direction",
    },
    {
      name: "soft",
      code: "soft",
      color: "#2a9d8f",
      icon: "mdi-account-heart",
    },
    {
      name: "sponso",
      code: "sponso",
      color: "#50e691",
      icon: "mdi-cash",
    },
    {
      name: "sports",
      code: "sports",
      color: "#a632b3",
      icon: "mdi-football",
    },
    {
      name: "teckos",
      code: "teckos",
      color: "#CFA602",
      icon: "mdi-hammer-wrench",
    },
    {
      name: "tendrestival",
      code: "tendrestival",
      color: "#FF9300",
      icon: "mdi-balloon",
    },
    {
      name: "vieux",
      code: "vieux",
      color: "#B5C2CB",
      icon: "mdi-human-cane",
    },
    {
      name: "voiture",
      code: "voiture",
      color: "#737F49",
      icon: "mdi-car-side",
    },
    {
      name: "woods",
      code: "woods",
      color: "#02AC18",
      icon: "mdi-forest",
    },
    {
      name: "bénévole",
      code: "benevole",
      color: "#09A1C4",
      icon: "mdi-account",
    },
    {
      name: "INSA Strasbourg",
      code: "strasbourg",
      color: "#ACBB62",
      icon: "mdi-sausage",
    },
  ];

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

  const userTeamTuples: string[][] = [
    ["hard", "hard,benevole"],
    ["soft", "soft,benevole"],
    ["confiance", "confiance,benevole"],
    ["vieux", "vieux,benevole"],
    ["admin", "hard,admin,benevole"],
    ["bureau", "hard,bureau,benevole"],
    ["sg", "hard,bureau,sg,benevole"],
    ["matos", "hard,orga,matos,benevole"],
    ["elec", "hard,orga,elec,benevole"],
    ["secu", "hard,orga,secu,benevole"],
    ["payant", "hard,orga,payant,benevole"],
    ["humain", "hard,orga,humain,benevole"],
    ["bar", "hard,orga,bar,benevole"],
    ["barrieres", "hard,orga,barrieres,benevole"],
    ["catering", "hard,orga,catering,benevole"],
    ["beboo", "hard,orga,beboo,benevole"],
    ["scene", "hard,orga,scene,benevole"],
    ["signa", "hard,orga,signa,benevole"],
    ["communication", "hard,communication,benevole"],
    ["concert", "hard,concert,benevole"],
    ["courses", "hard,courses,benevole"],
    ["culture", "hard,culture,benevole"],
    ["DD", "hard,DD,benevole"],
    ["deco", "hard,deco,benevole"],
    ["comsa", "hard,informatique,benevole"],
    ["plaizir", "hard,plaizir,benevole"],
    ["sponso", "hard,sponso,benevole"],
    ["sports", "hard,sports,benevole"],
    ["fen", "hard,fen"],
    ["voiture", "hard,voiture"],
    ["camion", "hard,camion"],
    ["accueil-artiste", "hard,orga,accueil-artiste,benevole"],
  ];

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
        department: Departments.TC,
        year: Years.A1,
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
