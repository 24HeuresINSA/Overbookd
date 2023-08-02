export const permissions = [
  {
    name: 'admin',
    description: 'Admin',
    teams: {
      createMany: {
        data: [{ teamCode: 'admin' }],
      },
    },
  },
  {
    name: 'config-write',
    description: 'Utilisateurs qui peuvent écrire dans la config',
    teams: {
      createMany: {
        data: [{ teamCode: 'admin' }],
      },
    },
  },
  {
    name: 'hard',
    description: 'Uniquement les hards',
    teams: {
      createMany: {
        data: [{ teamCode: 'hard' }],
      },
    },
  },
  {
    name: 'cp',
    description: 'Utilisateurs qui ont des CP',
    teams: {
      createMany: {
        data: [{ teamCode: 'hard' }, { teamCode: 'vieux' }],
      },
    },
  },
  {
    name: 'affect-team',
    description:
      'Utilisateurs qui peuvent affecter des utilisateurs à des équipes',
    teams: {
      createMany: {
        data: [{ teamCode: 'humain' }, { teamCode: 'sg' }],
      },
    },
  },
  {
    name: 'validated-user',
    description: 'Utilisateurs validés',
    teams: {
      createMany: {
        data: [
          { teamCode: 'hard' },
          { teamCode: 'vieux' },
          { teamCode: 'soft' },
          { teamCode: 'camion' },
          { teamCode: 'voiture' },
          { teamCode: 'fen' },
        ],
      },
    },
  },
  {
    name: 'catalog-write',
    description: 'Peut éditer le catalogue',
    teams: {
      createMany: {
        data: [
          { teamCode: 'matos' },
          { teamCode: 'elec' },
          { teamCode: 'barrieres' },
        ],
      },
    },
  },
  {
    name: 'catalog-read',
    description: 'Peut voir le catalogue',
    teams: {
      createMany: {
        data: [
          { teamCode: 'matos' },
          { teamCode: 'elec' },
          { teamCode: 'barrieres' },
          { teamCode: 'signa' },
          { teamCode: 'bar' },
          { teamCode: 'catering' },
        ],
      },
    },
  },
  {
    name: 'inventory-write',
    description: "Peut éditer l'inventaire",
    teams: {
      createMany: {
        data: [{ teamCode: 'matos' }, { teamCode: 'elec' }],
      },
    },
  },
  {
    name: 'manage-cp',
    description: 'Utilisateurs qui peuvent gérer les CP',
    teams: {
      createMany: {
        data: [{ teamCode: 'sg' }],
      },
    },
  },
  {
    name: 'send-broadcast',
    description: 'Utilisateurs qui peuvent envoyer des notifications',
    teams: {
      createMany: {
        data: [{ teamCode: 'bureau' }, { teamCode: 'orga' }],
      },
    },
  },
  {
    name: 'manage-users',
    description: 'Utilisateurs qui peuvent gérer les utilisateurs',
    teams: {
      createMany: {
        data: [{ teamCode: 'bureau' }, { teamCode: 'humain' }],
      },
    },
  },
  {
    name: 'bureau',
    description: 'Le bureau',
    teams: {
      createMany: {
        data: [{ teamCode: 'bureau' }],
      },
    },
  },
  {
    name: 'can-affect',
    description: 'Peut affecter',
    teams: {
      createMany: {
        data: [{ teamCode: 'humain' }],
      },
    },
  },
  {
    name: 'manage-config',
    description: 'Peut gérer la configuration',
    teams: {
      createMany: {
        data: [{ teamCode: 'humain' }, { teamCode: 'sg' }],
      },
    },
  },
  {
    name: 'manage-location',
    description: 'Peut gérer les lieux',
    teams: {
      createMany: {
        data: [{ teamCode: 'signa' }],
      },
    },
  },
  {
    name: 'orga',
    description: "L'équipe d'organisation",
    teams: {
      createMany: {
        data: [{ teamCode: 'orga' }],
      },
    },
  },
  {
    name: 'manage-pass-secu',
    description: 'Peut gérer les passes sécurité',
    teams: {
      createMany: {
        data: [{ teamCode: 'secu' }],
      },
    },
  },
  {
    name: 'fa-validator',
    description: 'Peut valider les FA',
    teams: {
      createMany: {
        data: [
          { teamCode: 'barrieres' },
          { teamCode: 'elec' },
          { teamCode: 'humain' },
          { teamCode: 'matos' },
          { teamCode: 'secu' },
          { teamCode: 'signa' },
        ],
      },
    },
  },
  {
    name: 'ft-validator',
    description: 'Peut valider les FT',
    teams: {
      createMany: {
        data: [{ teamCode: 'humain' }, { teamCode: 'matos' }],
      },
    },
  },
  {
    name: 'communication-read',
    description: 'Peut accéder à la page communication',
    teams: {
      createMany: {
        data: [{ teamCode: 'communication' }],
      },
    },
  },
  {
    name: 'fa-read',
    description: 'Peut accéder aux FA',
    teams: {
      createMany: {
        data: [{ teamCode: 'hard' }, { teamCode: 'vieux' }],
      },
    },
  },
  {
    name: 'ft-read',
    description: 'Peut accéder aux FT',
    teams: {
      createMany: {
        data: [{ teamCode: 'hard' }, { teamCode: 'vieux' }],
      },
    },
  },
  {
    name: 'stats-read',
    description: 'Peut accéder aux stats',
    teams: {
      createMany: {
        data: [{ teamCode: 'hard' }, { teamCode: 'vieux' }],
      },
    },
  },
  {
    name: 'fill-availability',
    description: 'Peut remplir ses disponibilités',
    teams: {
      createMany: {
        data: [{ teamCode: 'hard' }, { teamCode: 'soft' }],
      },
    },
  },
];
