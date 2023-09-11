import { permissions as perm } from "@overbookd/permission";

export const permissions = [
  {
    name: perm.HAVE_PERSONNAL_ACCOUNT,
    description: "Possède un compte perso",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }, { teamCode: "vieux" }],
      },
    },
  },
  {
    name: perm.AFFECT_TEAM,
    description: "Peut affecter des utilisateurs à des équipes",
    teams: {
      createMany: {
        data: [{ teamCode: "humain" }, { teamCode: "sg" }],
      },
    },
  },
  {
    name: perm.BE_AFFECTED,
    description: "Peut être affecté",
    teams: {
      createMany: {
        data: [
          { teamCode: "benevole" },
          { teamCode: "camion" },
          { teamCode: "voiture" },
          { teamCode: "fen" },
        ],
      },
    },
  },
  {
    name: perm.WRITE_GEAR_CATALOG,
    description: "Peut éditer le catalogue du matos",
    teams: {
      createMany: {
        data: [
          { teamCode: "matos" },
          { teamCode: "elec" },
          { teamCode: "barrieres" },
        ],
      },
    },
  },
  {
    name: perm.READ_GEAR_CATALOG,
    description: "Peut voir le catalogue du matos",
    teams: {
      createMany: {
        data: [
          { teamCode: "matos" },
          { teamCode: "elec" },
          { teamCode: "barrieres" },
          { teamCode: "signa" },
          { teamCode: "bar" },
          { teamCode: "catering" },
          { teamCode: "hard" },
        ],
      },
    },
  },
  {
    name: perm.READ_SIGNAGE_CATALOG,
    description: "Peut voir le catalogue de la signa",
    teams: {
      createMany: {
        data: [{ teamCode: "signa" }, { teamCode: "hard" }],
      },
    },
  },
  {
    name: perm.WRITE_SIGNAGE_CATALOG,
    description: "Peut éditer le catalogue du matos",
    teams: {
      createMany: {
        data: [{ teamCode: "signa" }],
      },
    },
  },
  {
    name: perm.WRITE_INVENTORY,
    description: "Peut éditer l'inventaire",
    teams: {
      createMany: {
        data: [{ teamCode: "matos" }, { teamCode: "elec" }],
      },
    },
  },
  {
    name: perm.MANAGE_PERSONNAL_ACCOUNTS,
    description: "Peut gérer les comptes persos",
    teams: {
      createMany: {
        data: [{ teamCode: "sg" }],
      },
    },
  },
  {
    name: perm.MANAGE_USERS,
    description: "Peut gérer les utilisateurs",
    teams: {
      createMany: {
        data: [{ teamCode: "bureau" }, { teamCode: "humain" }],
      },
    },
  },
  {
    name: perm.AFFECT_VOLUNTEER,
    description: "Peut affecter",
    teams: {
      createMany: {
        data: [{ teamCode: "humain" }],
      },
    },
  },
  {
    name: perm.MANAGE_CONFIG,
    description: "Peut gérer la configuration",
    teams: {
      createMany: {
        data: [{ teamCode: "admin" }],
      },
    },
  },
  {
    name: perm.MANAGE_LOCATION,
    description: "Peut gérer les lieux",
    teams: {
      createMany: {
        data: [{ teamCode: "signa" }],
      },
    },
  },
  {
    name: perm.VALIDATE_FA,
    description: "Peut valider les FA",
    teams: {
      createMany: {
        data: [
          { teamCode: "barrieres" },
          { teamCode: "elec" },
          { teamCode: "humain" },
          { teamCode: "matos" },
          { teamCode: "secu" },
          { teamCode: "signa" },
        ],
      },
    },
  },
  {
    name: perm.VALIDATE_FT,
    description: "Peut valider les FT",
    teams: {
      createMany: {
        data: [{ teamCode: "humain" }, { teamCode: "matos" }],
      },
    },
  },
  {
    name: perm.READ_ANIMATION_TO_PUBLISH,
    description: "Peut voir les animations à publier",
    teams: {
      createMany: {
        data: [{ teamCode: "communication" }],
      },
    },
  },
  {
    name: perm.READ_FA,
    description: "Peut lire les FA",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }, { teamCode: "vieux" }],
      },
    },
  },
  {
    name: perm.WRITE_FA,
    description: "Peut écrire dans les FA",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }, { teamCode: "vieux" }],
      },
    },
  },
  {
    name: perm.READ_FT,
    description: "Peut lire les FT",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }, { teamCode: "vieux" }],
      },
    },
  },
  {
    name: perm.WRITE_FT,
    description: "Peut écrire dans les FT",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }, { teamCode: "vieux" }],
      },
    },
  },
  {
    name: perm.VIEW_FESTIVAL_EVENTS_STATS,
    description: "Peut voir les stats des FA et des FT",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }, { teamCode: "vieux" }],
      },
    },
  },
  {
    name: perm.FILL_AVAILABILITY,
    description: "Peut remplir ses disponibilités",
    teams: {
      createMany: {
        data: [{ teamCode: "benevole" }],
      },
    },
  },
  {
    name: perm.VIEW_TIMELINE,
    description: "Peut voir la timeline",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }],
      },
    },
  },
  {
    name: perm.ASK_FOR_HELP,
    description: "Peut accéder à la demande d'aide",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }],
      },
    },
  },
  {
    name: perm.VIEW_PLANNING,
    description: "Peut voir les planning",
    teams: {
      createMany: {
        data: [{ teamCode: "benevole" }],
      },
    },
  },
  {
    name: perm.DOWNLOAD_PLANNING,
    description: "Peut télécharger son planning",
    teams: {
      createMany: {
        data: [{ teamCode: "benevole" }],
      },
    },
  },
  {
    name: perm.ENROLL_NEWCOMER,
    description: "Peut enrôler des nouveaux",
    teams: {
      createMany: {
        data: [{ teamCode: "sg" }, { teamCode: "humain" }],
      },
    },
  },
  {
    name: perm.VIEW_TROMBINOSCOPE,
    description: "Peut voir le trombinoscope",
    teams: {
      createMany: {
        data: [{ teamCode: "benevole" }],
      },
    },
  },
  {
    name: perm.VIEW_VOLUNTEER,
    description: "Peut voir les bénévoles",
    teams: {
      createMany: {
        data: [{ teamCode: "benevole" }],
      },
    },
  },
];
