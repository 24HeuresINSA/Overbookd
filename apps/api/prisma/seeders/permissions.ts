import {
  AFFECT_TEAM,
  AFFECT_VOLUNTEER,
  ASK_FOR_HELP,
  BE_AFFECTED,
  DOWNLOAD_PLANNING,
  ENROLL_HARD,
  HAVE_PERSONAL_ACCOUNT,
  MANAGE_CONFIG,
  MANAGE_CONTRIBUTIONS,
  MANAGE_LOCATION,
  MANAGE_PERSONAL_ACCOUNTS,
  MANAGE_USERS,
  MANAGE_TEAMS,
  PAY_CONTRIBUTION,
  READ_ANIMATION_TO_PUBLISH,
  READ_FA,
  READ_FT,
  READ_GEAR_CATALOG,
  READ_SIGNAGE_CATALOG,
  VALIDATE_FA,
  VALIDATE_FT,
  VIEW_FESTIVAL_EVENTS_STATS,
  VIEW_LOCATION,
  VIEW_PLANNING,
  VIEW_TIMELINE,
  VIEW_VOLUNTEER,
  VIEW_VOLUNTEER_DETAILS,
  WRITE_FA,
  WRITE_FT,
  WRITE_GEAR_CATALOG,
  WRITE_INVENTORY,
  WRITE_SIGNAGE_CATALOG,
  VIEW_GEAR_DASHBOARD,
  PURCHASE_GEARS,
  BORROW_GEARS,
  SYNC_PLANNING,
  MANAGE_CHARISMA_EVENTS,
  READ_INVENTORY,
  SET_FAVORITE_PAGES,
  VIEW_SECURITY_DASHBOARD,
  SHOTGUN_SHARED_MEAL,
  OFFER_SHARED_MEAL,
  VIEW_ORGA_MOBILE_NAV,
  EXPORT_FOR_SIGNA,
  ENTER_EXTENDED_AVAILABILITITES,
  VIEW_FA_GEAR_DASHBOARD,
  VIEW_MULTI_PLANNING,
} from "@overbookd/permission";

export const permissions = [
  {
    name: HAVE_PERSONAL_ACCOUNT,
    description: "Possède un compte perso",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }, { teamCode: "vieux" }],
      },
    },
  },
  {
    name: AFFECT_TEAM,
    description: "Peut affecter des utilisateurs à des équipes",
    teams: {
      createMany: {
        data: [{ teamCode: "humain" }, { teamCode: "sg" }],
      },
    },
  },
  {
    name: BE_AFFECTED,
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
    name: WRITE_GEAR_CATALOG,
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
    name: READ_GEAR_CATALOG,
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
    name: VIEW_GEAR_DASHBOARD,
    description: "Peut voir le recap du matos",
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
    name: READ_SIGNAGE_CATALOG,
    description: "Peut voir le catalogue de la signa",
    teams: {
      createMany: {
        data: [{ teamCode: "signa" }, { teamCode: "hard" }],
      },
    },
  },
  {
    name: WRITE_SIGNAGE_CATALOG,
    description: "Peut éditer le catalogue de la signa",
    teams: {
      createMany: {
        data: [{ teamCode: "signa" }],
      },
    },
  },
  {
    name: VIEW_LOCATION,
    description: "Peut voir les lieux de la signa",
    teams: {
      createMany: {
        data: [{ teamCode: "signa" }, { teamCode: "hard" }],
      },
    },
  },
  {
    name: READ_INVENTORY,
    description: "Peut lire l'inventaire",
    teams: {
      createMany: {
        data: [
          { teamCode: "matos" },
          { teamCode: "elec" },
          { teamCode: "hard" },
        ],
      },
    },
  },
  {
    name: WRITE_INVENTORY,
    description: "Peut éditer l'inventaire",
    teams: {
      createMany: {
        data: [{ teamCode: "matos" }, { teamCode: "elec" }],
      },
    },
  },
  {
    name: PURCHASE_GEARS,
    description: "Peut acheter du matos",
    teams: {
      createMany: {
        data: [{ teamCode: "matos" }, { teamCode: "elec" }],
      },
    },
  },
  {
    name: BORROW_GEARS,
    description: "Peut emprunter du matos",
    teams: {
      createMany: {
        data: [{ teamCode: "matos" }, { teamCode: "elec" }],
      },
    },
  },
  {
    name: MANAGE_PERSONAL_ACCOUNTS,
    description: "Peut gérer les comptes persos",
    teams: {
      createMany: {
        data: [{ teamCode: "sg" }],
      },
    },
  },
  {
    name: MANAGE_USERS,
    description: "Peut gérer les utilisateurs",
    teams: {
      createMany: {
        data: [{ teamCode: "bureau" }, { teamCode: "humain" }],
      },
    },
  },
  {
    name: MANAGE_TEAMS,
    description: "Peut gérer les équipes",
    teams: {
      createMany: {
        data: [{ teamCode: "bureau" }],
      },
    },
  },
  {
    name: AFFECT_VOLUNTEER,
    description: "Peut affecter",
    teams: {
      createMany: {
        data: [{ teamCode: "humain" }],
      },
    },
  },
  {
    name: MANAGE_CONFIG,
    description: "Peut gérer la configuration",
    teams: {
      createMany: {
        data: [{ teamCode: "admin" }],
      },
    },
  },
  {
    name: MANAGE_LOCATION,
    description: "Peut gérer les lieux",
    teams: {
      createMany: {
        data: [{ teamCode: "signa" }],
      },
    },
  },
  {
    name: VALIDATE_FA,
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
          { teamCode: "communication" },
        ],
      },
    },
  },
  {
    name: VALIDATE_FT,
    description: "Peut valider les FT",
    teams: {
      createMany: {
        data: [
          { teamCode: "humain" },
          { teamCode: "matos" },
          { teamCode: "elec" },
        ],
      },
    },
  },
  {
    name: READ_ANIMATION_TO_PUBLISH,
    description: "Peut voir les animations à publier",
    teams: {
      createMany: {
        data: [{ teamCode: "communication" }],
      },
    },
  },
  {
    name: READ_FA,
    description: "Peut lire les FA",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }, { teamCode: "vieux" }],
      },
    },
  },
  {
    name: WRITE_FA,
    description: "Peut écrire dans les FA",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }, { teamCode: "vieux" }],
      },
    },
  },
  {
    name: READ_FT,
    description: "Peut lire les FT",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }, { teamCode: "vieux" }],
      },
    },
  },
  {
    name: WRITE_FT,
    description: "Peut écrire dans les FT",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }, { teamCode: "vieux" }],
      },
    },
  },
  {
    name: VIEW_FESTIVAL_EVENTS_STATS,
    description: "Peut voir les stats des FA et des FT",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }, { teamCode: "vieux" }],
      },
    },
  },
  {
    name: VIEW_TIMELINE,
    description: "Peut voir la timeline",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }],
      },
    },
  },
  {
    name: ASK_FOR_HELP,
    description: "Peut accéder à la demande d'aide",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }],
      },
    },
  },
  {
    name: VIEW_PLANNING,
    description: "Peut voir les plannings",
    teams: {
      createMany: {
        data: [{ teamCode: "benevole" }],
      },
    },
  },
  {
    name: DOWNLOAD_PLANNING,
    description: "Peut télécharger son planning",
    teams: {
      createMany: {
        data: [{ teamCode: "benevole" }],
      },
    },
  },
  {
    name: SYNC_PLANNING,
    description: "Peut synchroniser son planning",
    teams: {
      createMany: {
        data: [{ teamCode: "benevole" }],
      },
    },
  },
  {
    name: VIEW_MULTI_PLANNING,
    description: "Peut accéder aux multi plannings",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }, { teamCode: "vieux" }],
      },
    },
  },
  {
    name: ENROLL_HARD,
    description: "Peut enrôler des nouveaux",
    teams: {
      createMany: {
        data: [{ teamCode: "sg" }, { teamCode: "humain" }],
      },
    },
  },
  {
    name: VIEW_VOLUNTEER,
    description: "Peut voir les bénévoles",
    teams: {
      createMany: {
        data: [{ teamCode: "benevole" }],
      },
    },
  },
  {
    name: VIEW_VOLUNTEER_DETAILS,
    description: "Peut voir les détails des bénévoles",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }, { teamCode: "vieux" }],
      },
    },
  },
  {
    name: MANAGE_CONTRIBUTIONS,
    description: "Peut gérer les cotisations",
    teams: {
      createMany: {
        data: [{ teamCode: "sg" }],
      },
    },
  },
  {
    name: PAY_CONTRIBUTION,
    description: "Peut payer sa cotisation",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }],
      },
    },
  },
  {
    name: OFFER_SHARED_MEAL,
    description: "Peut proposer un repas partagé",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }, { teamCode: "vieux" }],
      },
    },
  },
  {
    name: SHOTGUN_SHARED_MEAL,
    description: "Peut shotgun un repas partagé",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }, { teamCode: "vieux" }],
      },
    },
  },
  {
    name: MANAGE_CHARISMA_EVENTS,
    description: "Peut gérer les événements charismatiques",
    teams: {
      createMany: {
        data: [{ teamCode: "bureau" }],
      },
    },
  },
  {
    name: SET_FAVORITE_PAGES,
    description: "Peut définir des pages favorites",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }, { teamCode: "vieux" }],
      },
    },
  },
  {
    name: VIEW_FA_GEAR_DASHBOARD,
    description: "Peut voir la page avec toutes les demandes de matos des FA",
    teams: {
      createMany: {
        data: [
          { teamCode: "matos" },
          { teamCode: "elec" },
          { teamCode: "barrieres" },
          { teamCode: "bar" },
        ],
      },
    },
  },
  {
    name: VIEW_SECURITY_DASHBOARD,
    description: "Peut voir le récapitulatif sécurité",
    teams: {
      createMany: {
        data: [{ teamCode: "secu" }],
      },
    },
  },
  {
    name: VIEW_ORGA_MOBILE_NAV,
    description: "Peut voir la navigation mobile pour les orgas",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }, { teamCode: "vieux" }],
      },
    },
  },
  {
    name: EXPORT_FOR_SIGNA,
    description: "Peut exporter pour la signa",
    teams: {
      createMany: {
        data: [{ teamCode: "signa" }],
      },
    },
  },
  {
    name: ENTER_EXTENDED_AVAILABILITITES,
    description: "Peut renseigner des disponibilités étendues",
    teams: {
      createMany: {
        data: [{ teamCode: "hard" }, { teamCode: "vieux" }],
      },
    },
  },
];
