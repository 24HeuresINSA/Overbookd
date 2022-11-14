import { Prisma, PrismaClient } from '@prisma/client';
import { HashingUtilsService } from '../src/hashing-utils/hashing-utils.service';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating teams 👥');

  const teams: Prisma.TeamUncheckedCreateInput[] = [
    {
      name: 'admin',
      code: 'admin',
      color: '#000000',
      icon: 'mdi-eye-circle',
    },
    {
      name: 'bar',
      code: 'bar',
      color: '#F9C80E',
      icon: 'mdi-beer',
    },
    {
      name: 'barrieres',
      code: 'barrieres',
      color: '#F86624',
      icon: 'mdi-boom-gate',
    },
    {
      name: 'bde',
      code: 'bde',
      color: '#FF4343',
      icon: 'mdi-bootstrap',
    },
    {
      name: 'bureau',
      code: 'bureau',
      color: '#e9c46a',
      icon: 'mdi-desk',
    },
    {
      name: 'catering',
      code: 'catering',
      color: '#662E9B',
      icon: 'mdi-food',
    },
    {
      name: 'camion',
      code: 'camion',
      color: '#737F49',
      icon: 'mdi-truck-outline',
    },
    {
      name: 'communication',
      code: 'communication',
      color: '#262E9B',
      icon: 'mdi-camera',
    },
    {
      name: 'concert',
      code: 'concert',
      color: '#75d46c',
      icon: 'mdi-microphone',
    },
    {
      name: 'conducteur',
      code: 'conducteur',
      color: '#9B2E2E',
      icon: 'mdi-car-key',
    },
    {
      name: 'conducteur FEN',
      code: 'conducteur-fen',
      color: '#9B2E2E',
      icon: 'mdi-key-variant',
    },
    {
      name: 'confiance',
      code: 'confiance',
      color: '#d169e0',
      icon: 'mdi-account-check',
    },
    {
      name: 'courses',
      code: 'courses',
      color: '#75d46c',
      icon: 'mdi-bike-fast',
    },
    {
      name: 'culture',
      code: 'culture',
      color: '#662E9B',
      icon: 'mdi-theater',
    },
    {
      name: 'DD',
      code: 'dd',
      color: '#32a852',
      icon: 'mdi-tree',
    },
    {
      name: 'deco',
      code: 'deco',
      color: '#662E9B',
      icon: 'mdi-format-paint',
    },
    {
      name: 'elec',
      code: 'elec',
      color: '#ffb703',
      icon: 'mdi-flash',
    },
    {
      name: 'fen',
      code: 'fen',
      color: '#737F49',
      icon: 'mdi-forklift',
    },
    {
      name: 'hard',
      code: 'hard',
      color: '#969600',
      icon: 'mdi-account-hard-hat',
    },
    {
      name: 'humain',
      code: 'humain',
      color: '#f4a261',
      icon: 'mdi-human',
    },
    {
      name: 'informatique',
      code: 'informatique',
      color: '#3fd4af',
      icon: 'mdi-monitor-screenshot',
    },
    {
      name: 'karna',
      code: 'karna',
      color: '#E4B613',
      icon: 'mdi-party-popper',
    },
    {
      name: 'kfet',
      code: 'kfet',
      color: '#438EFF',
      icon: 'mdi-beer',
    },
    {
      name: 'maman',
      code: 'maman',
      color: '#ff66e8',
      icon: 'mdi-human-female-boy',
    },
    {
      name: 'matos',
      code: 'matos',
      color: '#d4411e',
      icon: 'mdi-truck',
    },
    {
      name: 'orga',
      code: 'orga',
      color: '#e62727',
      icon: 'mdi-account-hard-hat',
    },
    {
      name: 'payant',
      code: 'payant',
      color: '#118C4F',
      icon: 'mdi-ticket',
    },
    {
      name: 'plaizir',
      code: 'plaizir',
      color: '#c9406a',
      icon: 'mdi-ferris-wheel',
    },
    {
      name: 'scene',
      code: 'scene',
      color: '#EA3546',
      icon: 'mdi-soundbar',
    },
    {
      name: 'secu',
      code: 'secu',
      color: '#e76f51',
      icon: 'mdi-security',
    },
    {
      name: 'sg',
      code: 'sg',
      color: '#ab1f07',
      icon: 'mdi-human-male-child',
    },
    {
      name: 'signa',
      code: 'signa',
      color: '#EA3546',
      icon: 'mdi-sign-direction',
    },
    {
      name: 'soft',
      code: 'soft',
      color: '#2a9d8f',
      icon: 'mdi-account-heart',
    },
    {
      name: 'sponso',
      code: 'sponso',
      color: '#50e691',
      icon: 'mdi-cash',
    },
    {
      name: 'sports',
      code: 'sports',
      color: '#a632b3',
      icon: 'mdi-football',
    },
    {
      name: 'teckos',
      code: 'teckos',
      color: '#CFA602',
      icon: 'mdi-hammer-wrench',
    },
    {
      name: 'tendrestival',
      code: 'tendrestival',
      color: '#FF9300',
      icon: 'mdi-balloon',
    },
    {
      name: 'vieux',
      code: 'vieux',
      color: '#B5C2CB',
      icon: 'mdi-human-cane',
    },
    {
      name: 'voiture',
      code: 'voiture',
      color: '#737F49',
      icon: 'mdi-car-side',
    },
    {
      name: 'woods',
      code: 'woods',
      color: '#02AC18',
      icon: 'mdi-forest',
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

  console.log('Creating users 👤');

  const userTeamTuples: string[][] = [
    ['hard', 'hard'],
    ['soft', 'soft'],
    ['confiance', 'confiance'],
    ['vieux', 'vieux'],
    ['admin', 'hard,admin'],
    ['bureau', 'hard,bureau'],
    ['sg', 'hard,bureau,sg'],
    ['matos', 'hard,orga,matos'],
    ['elec', 'hard,orga,elec'],
    ['secu', 'hard,orga,secu'],
    ['payant', 'hard,orga,payant'],
    ['humain', 'hard,orga,humain'],
    ['bar', 'hard,orga,bar'],
    ['barrieres', 'hard,orga,barrieres'],
    ['catering', 'hard,orga,catering'],
    ['maman', 'hard,orga,maman'],
    ['scene', 'hard,orga,scene'],
    ['signa', 'hard,orga,signa'],
    ['communication', 'hard,communication'],
    ['concerts', 'hard,concerts'],
    ['courses', 'hard,courses'],
    ['culture', 'hard,culture'],
    ['dd', 'hard,dd'],
    ['deco', 'hard,deco'],
    ['comsa', 'hard,informatique'],
    ['plaizir', 'hard,plaizir'],
    ['sponso', 'hard,sponso'],
    ['sports', 'hard,sports'],
    ['fen', 'hard,fen'],
    ['voiture', 'hard,voiture'],
    ['camion', 'hard,camion'],
  ];

  for (const userTeam of userTeamTuples) {
    const [user, teams] = userTeam;
    const data: Prisma.UserUncheckedCreateInput = {
      email: `${user}@24h.me`,
      firstname: user,
      lastname: user,
      nickname: '',
      birthdate: new Date(1990, 1, 1),
      phone: '0612345678',
      department: 'TC',
      year: 'A1',
      password: await new HashingUtilsService().hash('password'),
    };

    const dbUser = await prisma.user.upsert({
      where: { email: `${user}@24h.me` },
      update: data,
      create: data,
    });

    console.log(`User ${user} created with id ${dbUser.id}, adding to teams`);

    const teamNames = teams.split(',');
    for (const teamName of teamNames) {
      const team = await prisma.team.findUnique({
        where: { name: teamName },
      });

      if (team) {
        await prisma.user_Team.upsert({
          where: {
            user_id_team_id: { user_id: dbUser.id, team_id: team.id },
          },
          update: {},
          create: {
            team_id: team.id,
            user_id: dbUser.id,
          },
        });
      } else {
        console.log(`Team ${teamName} not found`);
      }
    }
    console.log(`User ${user} added to teams ${teamNames}`);
    console.log('------------------------------------------------------------');
  }
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
