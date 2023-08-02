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
    name: 'write-catalog',
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
    name: 'read-catalog',
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
    name: 'write-inventory',
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
    name: 'affect-volunteer',
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
        data: [{ teamCode: 'admin' }],
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
    name: 'read-animation-to-publish',
    description: 'Peut voir les animations à publier',
    teams: {
      createMany: {
        data: [{ teamCode: 'communication' }],
      },
    },
  },
  {
    name: 'read-fa',
    description: 'Peut lire les FA',
    teams: {
      createMany: {
        data: [{ teamCode: 'hard' }, { teamCode: 'vieux' }],
      },
    },
  },
  {
    name: 'read-ft',
    description: 'Peut lire les FT',
    teams: {
      createMany: {
        data: [{ teamCode: 'hard' }, { teamCode: 'vieux' }],
      },
    },
  },
  {
    name: 'view-stats',
    description: 'Peut voir les stats',
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
  {
    name: 'view-timeline',
    description: 'Peut voir la timeline',
    teams: {
      createMany: {
        data: [{ teamCode: 'hard' }],
      },
    },
  },
  {
    name: 'ask-for-help',
    description: "Peut accéder à la demande d'aide",
    teams: {
      createMany: {
        data: [{ teamCode: 'hard' }],
      },
    },
  },
  {
    name: 'download-planning',
    description: 'Peut télécharger son planning',
    teams: {
      createMany: {
        data: [{ teamCode: 'hard' }, { teamCode: 'soft' }],
      },
    },
  },
];
