export const permissions = [
  {
    name: 'admin',
    description: 'Admin',
    teams: {
      createMany: {
        data: [{ team_code: 'admin' }],
      },
    },
  },
  {
    name: 'config-write',
    description: 'Utilisateurs qui peuvent écrire dans la config',
    teams: {
      createMany: {
        data: [{ team_code: 'admin' }],
      },
    },
  },
  {
    name: 'hard',
    description: 'Uniquement les hards',
    teams: {
      createMany: {
        data: [{ team_code: 'hard' }],
      },
    },
  },
  {
    name: 'cp',
    description: 'Utilisateurs qui ont des CP',
    teams: {
      createMany: {
        data: [{ team_code: 'hard' }, { team_code: 'vieux' }],
      },
    },
  },
  {
    name: 'affect-team',
    description:
      'Utilisateurs qui peuvent affecter des utilisateurs à des équipes',
    teams: {
      createMany: {
        data: [{ team_code: 'humain' }, { team_code: 'sg' }],
      },
    },
  },
  {
    name: 'validated-user',
    description: 'Utilisateurs validés',
    teams: {
      createMany: {
        data: [
          { team_code: 'hard' },
          { team_code: 'vieux' },
          { team_code: 'soft' },
          { team_code: 'camion' },
          { team_code: 'voiture' },
          { team_code: 'fen' },
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
          { team_code: 'matos' },
          { team_code: 'elec' },
          { team_code: 'barrieres' },
          { team_code: 'signa' },
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
          { team_code: 'matos' },
          { team_code: 'elec' },
          { team_code: 'barrieres' },
          { team_code: 'signa' },
          { team_code: 'bar' },
          { team_code: 'catering' },
        ],
      },
    },
  },
  {
    name: 'inventory-write',
    description: "Peut éditer l'inventaire",
    teams: {
      createMany: {
        data: [{ team_code: 'matos' }, { team_code: 'elec' }],
      },
    },
  },
  {
    name: 'manage-cp',
    description: 'Utilisateurs qui peuvent gérer les CP',
    teams: {
      createMany: {
        data: [{ team_code: 'sg' }],
      },
    },
  },
  {
    name: 'send-broadcast',
    description: 'Utilisateurs qui peuvent envoyer des notifications',
    teams: {
      createMany: {
        data: [{ team_code: 'bureau' }, { team_code: 'orga' }],
      },
    },
  },
  {
    name: 'manage-users',
    description: 'Utilisateurs qui peuvent gérer les utilisateurs',
    teams: {
      createMany: {
        data: [{ team_code: 'bureau' }, { team_code: 'humain' }],
      },
    },
  },
  {
    name: 'bureau',
    description: 'Le bureau',
    teams: {
      createMany: {
        data: [{ team_code: 'bureau' }],
      },
    },
  },
  {
    name: 'can-affect',
    description: 'Peut affecter',
    teams: {
      createMany: {
        data: [{ team_code: 'humain' }],
      },
    },
  },
  {
    name: 'manage-config',
    description: 'Peut gérer la configuration',
    teams: {
      createMany: {
        data: [{ team_code: 'humain' }, { team_code: 'sg' }],
      },
    },
  },
  {
    name: 'manage-location',
    description: 'Peut gérer les lieux',
    teams: {
      createMany: {
        data: [{ team_code: 'signa' }],
      },
    },
  },
  {
    name: 'orga',
    description: "L'équipe d'organisation",
    teams: {
      createMany: {
        data: [{ team_code: 'orga' }],
      },
    },
  },
  {
    name: 'manage-pass-secu',
    description: 'Peut gérer les passes sécurité',
    teams: {
      createMany: {
        data: [{ team_code: 'secu' }],
      },
    },
  },
  {
    name: 'fa-validator',
    description: 'Peut valider les FA',
    teams: {
      createMany: {
        data: [
          { team_code: 'barrieres' },
          { team_code: 'elec' },
          { team_code: 'humain' },
          { team_code: 'matos' },
          { team_code: 'secu' },
          { team_code: 'signa' },
        ],
      },
    },
  },
  {
    name: 'ft-validator',
    description: 'Peut valider les FT',
    teams: {
      createMany: {
        data: [{ team_code: 'humain' }, { team_code: 'matos' }],
      },
    },
  },
  {
    name: 'communication-read',
    description: 'Peut accéder à la page communication',
    teams: {
      createMany: {
        data: [{ team_code: 'communication' }],
      },
    },
  },
];
