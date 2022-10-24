import { Prisma, PrismaClient } from '@prisma/client';
import { HashingUtilsService } from '../src/hashing-utils/hashing-utils.service';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating teams 👥');

  const teams: Prisma.TeamUncheckedCreateInput[] = [
    { name: 'admin' },
    { name: 'hard' },
    { name: 'soft' },
    { name: 'orga' },
    { name: 'confiance' },
    { name: 'vieux' },
    { name: 'bureau' },
    { name: 'sg' },
    { name: 'matos' },
    { name: 'elec' },
    { name: 'secu' },
    { name: 'payant' },
    { name: 'humain' },
    { name: 'bar' },
    { name: 'barrieres' },
    { name: 'catering' },
    { name: 'maman' },
    { name: 'scene' },
    { name: 'signa' },
    { name: 'communication' },
    { name: 'concerts' },
    { name: 'courses' },
    { name: 'culture' },
    { name: 'dd' },
    { name: 'deco' },
    { name: 'informatique' },
    { name: 'plaizir' },
    { name: 'sponso' },
    { name: 'sports' },
  ];

  await Promise.all(
    teams.map((team) =>
      prisma.team.upsert({
        where: { name: team.name },
        update: {},
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
            user_id_team_id: { user_id: dbUser.id, team_id: team.name },
          },
          update: {},
          create: {
            team_id: team.name,
            user_id: dbUser.id,
          },
        });
      } else {
        console.log(`Team ${teamName} not found`);
      }
    }
    console.log(`User ${user[0]} added to teams ${user[1]}`);
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
