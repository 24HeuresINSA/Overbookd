import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  /**
   * return the configuration object
   */
  config() {
    return [
      {
        _id: '614c8b0eae8c2c0010a35bb7',
        key: 'error',
        value: 'Zebi',
        __v: 0,
      },
      {
        _id: '614c8b0eae8c2c0010a35bba',
        key: 'error_basic',
        value: 'Something went wrong blame the bad devs 💩',
        __v: 0,
      },
      {
        _id: '614c8b0fae8c2c0010a35bbd',
        key: 'isSignupOpen',
        value: true,
        __v: 0,
      },
      {
        _id: '614c8b0fae8c2c0010a35bc0',
        key: 'fb_signup_closed',
        value: 'les inscriptions sont fermées 😱',
        __v: 0,
      },
      {
        _id: '614c8b0fae8c2c0010a35bc3',
        key: 'signup_form',
        value: [
          {
            key: 'firstname',
            label: 'Prénom',
            option: 'given-name',
            isRequired: true,
          },
          {
            key: 'lastname',
            label: 'Nom',
            option: 'family-name',
            isRequired: true,
          },
          {
            key: 'nickname',
            label: 'Surnom',
          },
          {
            key: 'password',
            label: 'Mot de passe',
            option: 'password',
            isRequired: true,
            regex: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$',
            errorMessage:
              'au moins une MAJUSCULE, minuscule et un chiffre et au moins 6 caractères ',
          },
          {
            key: 'password2',
            label: 'Confirme ton mot de passe',
            option: 'password',
            isRequired: true,
            regex: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$',
            errorMessage:
              'au moins une MAJUSCULE, minuscule et un chiffre et au moins 6 caractères ',
          },
          {
            key: 'birthdate',
            label: 'Date de naissance',
            type: 'date',
            isRequired: true,
          },
          {
            key: 'email',
            label: 'Gmail (important que ca soit une addresse gmail)',
            isRequired: true,
            option: 'email',
            regex: '^.+@(gmail.com|24heures.org)$',
          },
          {
            key: 'phone',
            label: 'Ton 06 ?',
            isRequired: true,
            option: 'tel',
            regex: '0[6-7]{1}[0-9]{8}$',
          },
          {
            key: 'hasDriverLicense',
            label: 'Est-ce que tu as un permis de conduire ?',
            type: 'switch',
          },
          {
            key: 'driverLicenseDate',
            label: 'Date de permis',
            type: 'date',
          },
          {
            key: 'departement',
            label: 'Département',
            type: 'select',
            options: [
              'TC',
              'IF',
              'BS',
              'GCU',
              'SGM',
              'GI',
              'GM',
              'GEN',
              'SGM',
              'FIMI',
              'GE',
              "Pas à l'INSA",
            ],
          },
          {
            key: 'year',
            label: 'Année',
            type: 'select',
            options: [1, 2, 3, 4, 5, '6 et +', 'cerise'],
          },
          {
            key: 'comment',
            label: 'commentaire',
          },
        ],
        __v: 0,
      },
      {
        _id: '614c8b0fae8c2c0010a35bc9',
        key: 'fb_confirm_submit',
        value:
          "T'es sûr de ta FA la ? les zumains 🧂 seront pas content si c'est de la 💩",
        __v: 0,
      },
      {
        _id: '614c8b0fae8c2c0010a35bcc',
        key: 'fa_validators',
        value: ['humain', 'secu', 'log', 'barrieres', 'elec', 'signa'],
        __v: 0,
      },
      {
        _id: '614c8b10ae8c2c0010a35bcf',
        key: 'availabilities_description',
        value:
          "Remplis tes disponibilités, plus tu as de points de charisme, plus tu as de chances de faire parti de l'aventure. Coche tout ce que tu peux, nous ne t'affecterons bien évidemment pas à tous tes créneaux et te laisserons du temps pour te reposer et profiter du festival ! Les créneaux oranges ne sont plus modifiables une fois cochés.",
        __v: 0,
      },
      {
        _id: '614c8b10ae8c2c0010a35bd2',
        key: 'max_charisma',
        value: 1500,
        __v: 0,
      },
      {
        _id: '614c8b10ae8c2c0010a35bd5',
        key: 'ft_validators',
        value: ['humain', 'log'],
        __v: 0,
      },
      {
        _id: '614c8b10ae8c2c0010a35bd8',
        key: 'equipment_form',
        value: [
          {
            key: 'name',
            label: "Nom de l'objet",
          },
          {
            key: 'type',
            type: 'select',
            options: [
              'BARS',
              'BUREAUTIQUE',
              'BOIS',
              'CANAPE/FAUTEUIL',
              'CONSUMABLE',
              'CUISINE',
              'DECO',
              'ALIMENTATION ELECTRIQUE',
              'ECLAIRAGE',
              'FRIGO',
              'LITERIE',
              'MOBILIER',
              'PROPRETE',
              'SCENE',
              'SECU',
              'SIGNA',
              'OUTILLAGE',
              'QUINCAILLERIE',
              'TENTE',
              'EAU',
              'BARRIERE',
              'AUTRES MATOS',
              'AUTRES ELEC',
            ],
          },
          {
            key: 'amount',
            label: 'Quantite (en stock)',
            option: 'number',
          },
          {
            key: 'fromPool',
            label: 'Vient du pool des assos ? 🐔',
            type: 'switch',
          },
          {
            key: 'location',
            label: 'Localisation',
            type: 'autocomplete',
            options: ['local'],
          },
          {
            key: 'preciseLocation',
            label: 'Espace de stockage exact',
          },
          {
            key: 'comment',
            label: 'Commentaire',
          },
        ],
        __v: 0,
      },
      {
        _id: '614c8b10ae8c2c0010a35bdb',
        key: 'ft_form',
        value: [
          {
            key: 'name',
            label: 'Nom de la FT',
          },
          {
            key: 'inCharge',
            label: 'Orga responsable',
            type: 'user',
          },
          {
            key: 'location',
            label: 'Lieu du rdv 📍',
          },
          {
            key: 'isDriverLicenseRequired',
            label: 'Permis necessaire',
            type: 'select',
            options: [
              'non',
              'permis - un ans',
              'permis + un ans',
              'conducteur de Fen',
            ],
          },
          {
            key: 'isSecurity',
            label: 'Tâche de sécurité',
            type: 'switch',
          },
          {
            key: 'instructions',
            label: 'Consigne',
            type: 'textarea',
          },
        ],
        __v: 0,
      },
      {
        _id: '614c8b11ae8c2c0010a35bde',
        key: 'teams',
        value: [
          {
            name: 'hard',
            color: '#969600',
            icon: 'mdi-account-hard-hat',
          },
          {
            name: 'soft',
            color: '#2a9d8f',
            icon: 'mdi-account-heart',
          },
          {
            name: 'confiance',
            color: '#d169e0',
            icon: 'mdi-account-check',
          },
          {
            name: 'orga',
            color: '#e62727',
            icon: 'mdi-account-hard-hat',
          },
          {
            name: 'bureau',
            color: '#e9c46a',
            icon: 'mdi-desk',
          },
          {
            name: 'bar',
            color: '#F9C80E',
            icon: 'mdi-beer',
          },
          {
            name: 'barrieres',
            color: '#F86624',
            icon: 'mdi-boom-gate',
          },
          {
            name: 'catering',
            color: '#662E9B',
            icon: 'mdi-food',
          },
          {
            name: 'communication',
            color: '#262E9B',
            icon: 'mdi-camera',
          },
          {
            name: 'concert',
            color: '#75d46c',
            icon: 'mdi-microphone',
          },
          {
            name: 'courses',
            color: '#75d46c',
            icon: 'mdi-bike-fast',
          },
          {
            name: 'culture',
            color: '#662E9B',
            icon: 'mdi-theater',
          },
          {
            name: 'DD',
            color: '#32a852',
            icon: 'mdi-tree',
          },
          {
            name: 'deco',
            color: '#662E9B',
            icon: 'mdi-format-paint',
          },
          {
            name: 'elec',
            color: '#ffb703',
            icon: 'mdi-flash',
          },
          {
            name: 'humain',
            color: '#f4a261',
            icon: 'mdi-human',
          },
          {
            name: 'informatique',
            color: '#3fd4af',
            icon: 'mdi-monitor-screenshot',
          },
          {
            name: 'log',
            color: '#ffb703',
            icon: 'mdi-dump-truck',
          },
          {
            name: 'maman',
            color: '#ff66e8',
            icon: 'mdi-human-female-boy',
          },
          {
            name: 'secu',
            color: '#e76f51',
            icon: 'mdi-security',
          },
          {
            name: 'payant',
            color: '#118C4F',
            icon: 'mdi-ticket',
          },
          {
            name: 'scène',
            color: '#EA3546',
            icon: 'mdi-soundbar',
          },
          {
            name: 'signa',
            color: '#EA3546',
            icon: 'mdi-sign-direction',
          },
          {
            name: 'plaizir',
            color: '#c9406a',
            icon: 'mdi-ferris-wheel',
          },
          {
            name: 'sponso',
            color: '#50e691',
            icon: 'mdi-cash',
          },
          {
            name: 'sports',
            color: '#a632b3',
            icon: 'mdi-football',
          },
          {
            name: 'admin',
            color: '#000000',
            icon: 'mdi-eye-circle',
          },
          {
            name: 'matos',
            color: '#d4411e',
            icon: 'mdi-truck',
          },
          {
            name: 'bde',
            color: '#FF4343',
            icon: 'mdi-bootstrap',
          },
          {
            name: 'kfet',
            color: '#438EFF',
            icon: 'mdi-beer',
          },
          {
            name: 'karna',
            color: '#E4B613',
            icon: 'mdi-party-popper',
          },
          {
            name: 'woods',
            color: '#02AC18',
            icon: 'mdi-forest',
          },
          {
            name: 'teckos',
            color: '#CFA602',
            icon: 'mdi-hammer-wrench',
          },
          {
            name: 'tendrestival',
            color: '#FF9300',
            icon: 'mdi-balloon',
          },
          {
            name: 'vieux',
            color: '#B5C2CB',
            icon: 'mdi-human-cane',
          },
        ],
        __v: 0,
      },
      {
        _id: '614c8b11ae8c2c0010a35be1',
        key: 'isInventoryOpen',
        value: false,
        __v: 0,
      },
      {
        _id: '614c8b11ae8c2c0010a35be4',
        key: 'add_availabilities_roles',
        value: ['admin', 'bureau', 'humain'],
        __v: 0,
      },
      {
        _id: '614c8b11ae8c2c0010a35be7',
        key: 'timeframes',
        value: [
          {
            name: 'Manif',
            day: '2021-09-15',
          },
          {
            name: 'postManif',
            day: '2021-09-26',
          },
        ],
        __v: 0,
      },
      {
        _id: '614ef72fae8c2c0010a35ff7',
        key: 'fa_required_role',
        value: 'hard',
        __v: 0,
      },
      {
        _id: '614ef744ae8c2c0010a35ffa',
        key: 'ft_required_role',
        value: 'hard',
        __v: 0,
      },
      {
        _id: '6161725764870e0010292db4',
        key: 'are_transfers_open',
        value: true,
        __v: 0,
      },
      {
        _id: '61843542d2bbce00105aeff5',
        key: 'fa_general_form',
        value: [
          {
            key: 'name',
            label: 'Nom de la FA',
          },
          {
            key: 'type',
            type: 'select',
            options: [
              'Concert',
              'Course',
              'Divertissement',
              'Initiation',
              'Match de Gala',
              'Tournoi',
              'Vente',
              'Prévention',
              'Spectacle',
              'Autre',
            ],
          },
          {
            key: 'team',
            label: 'Equipe',
            type: 'teams',
          },
          {
            key: 'inCharge',
            label: 'Responsable',
            type: 'user',
            filter: 'hard',
          },
        ],
        __v: 0,
      },
      {
        _id: '61843542d2bbce00105aeff9',
        key: 'fa_details_form',
        value: [
          {
            key: 'description',
            label: 'Description',
            type: 'rich-text',
          },
          {
            key: 'isPublishable',
            label: 'Publier sur le site / plaquette',
            type: 'switch',
          },
          {
            key: 'isMajorAnim',
            label: 'Anim phare',
            type: 'switch',
          },
          {
            key: 'isForKids',
            label: 'Anim pour les gosses',
            type: 'switch',
          },
        ],
        __v: 0,
      },
      {
        _id: '61843542d2bbce00105aeffd',
        key: 'fa_security_form',
        value: [
          {
            key: 'securityDevice',
            label: 'Dispositif de sécurité particulier ',
            type: 'textarea',
          },
        ],
        __v: 0,
      },
      {
        _id: '61843542d2bbce00105af004',
        key: 'ft_general_form',
        value: [
          {
            key: 'name',
            label: 'Nom de la FT',
          },
          {
            key: 'inCharge',
            label: 'Responsable',
            type: 'user',
            filter: 'hard',
          },
          {
            key: 'areTimeframesStatic',
            label: 'Créneaux statiques',
            type: 'switch',
          },
        ],
        __v: 0,
      },
      {
        _id: '61843542d2bbce00105af008',
        key: 'ft_details_form',
        value: [
          {
            key: 'description',
            label: 'Description',
            type: 'rich-text',
          },
        ],
        __v: 0,
      },
      {
        _id: '61843544d2bbce00105af02d',
        key: 'event_date',
        value: '2022-05-21',
        __v: 0,
      },
      {
        _id: '61af655ff77ccb00103ed109',
        key: 'fa_external_form',
        value: [
          {
            key: 'fullname',
            label: "Nom complet de l'intervenant",
          },
          {
            key: 'company',
            label: 'Société',
          },
          {
            key: 'phone',
            label: 'Téléphone',
          },
          {
            key: 'email',
            label: 'E-mail',
          },
          {
            key: 'comment',
            label: 'Commentaire',
          },
          {
            key: 'needsHosting',
            label: "Besoin d'hébergement",
            type: 'switch',
          },
          {
            key: 'requiredSandwichFriday',
            label: 'Nombre de sandwichs vendredi',
            option: 'number',
          },
          {
            key: 'requiredSandwichSaterday',
            label: 'Nombre de sandwichs samedi',
            option: 'number',
          },
          {
            key: 'requiredSandwichSunday',
            label: 'Nombre de sandwichs dimanche',
            option: 'number',
          },
        ],
        __v: 0,
      },
      {
        _id: '61af655ff77ccb00103ed12c',
        key: 'fa_security_pass_form',
        value: [
          {
            key: 'fullname',
            label: "Nom complet d'intervenant Extérieur",
          },
          {
            key: 'phone',
            label: 'Telephone',
          },
          {
            key: 'licensePlate',
            label: "Plaque d'immatriculation",
          },
          {
            key: 'email',
            label: 'Email',
          },
          {
            key: 'comment',
            label: 'Commentaire',
          },
          {
            key: 'entity',
            label: 'Entité',
          },
          {
            key: 'reason',
            label: 'Raison',
          },
          {
            key: 'timeslot',
            label: 'plage horaire',
            type: 'select',
            multiple: true,
            options: [
              'Vendredi 18h-20h',
              'vendredi 20h-5h',
              'samedi 5h-20h',
              'samedi 20h-5h',
              'dimanche 5h-20h',
              'dimanche 20h-00h',
            ],
          },
        ],
        __v: 0,
      },
      {
        _id: '61af655ff77ccb00103ed12f',
        key: 'fa_water_form',
        value: [
          {
            key: 'isWaterNeeded',
            label: "Besoin d'eau",
            type: 'switch',
          },
          {
            key: 'waterNeed',
            label: 'Desctiption du besoin en eau',
          },
        ],
        __v: 0,
      },
      {
        _id: '61af655ff77ccb00103ed134',
        key: 'fa_signalisation_form',
        value: [
          {
            key: 'type',
            label: 'Type',
            type: 'select',
            options: ['bannière', 'panneau', 'pancarte'],
          },
          {
            key: 'text',
            label: 'Text signalétique',
          },
          {
            key: 'comment',
            label: 'Commentaire',
          },
        ],
        __v: 0,
      },
      {
        _id: '61af655ff77ccb00103ed137',
        key: 'fa_elec_form',
        value: [
          {
            key: 'connectionType',
            label: 'Type de prise',
            type: 'select',
            options: [
              'PC16',
              'P17 16A mono',
              'P17 16A tri',
              'P17 16A tetra',
              'P17 32A mono',
              'P17 32A tri',
              'P17 32A tetra',
            ],
          },
          {
            key: 'power',
            label: 'Puissance',
            option: 'number',
          },
          {
            key: 'comment',
            label: 'Commentaire',
          },
        ],
        __v: 0,
      },
      {
        _id: '61b0ca5877783200108bd4c2',
        key: 'is_ft_open',
        value: true,
        __v: 0,
      },
      {
        _id: '620cb64424568626d7f9e2a7',
        key: 'signup_form_soft',
        value: [
          {
            key: 'firstname',
            label: 'Prénom',
            option: 'given-name',
            isRequired: true,
          },
          {
            key: 'lastname',
            label: 'Nom',
            option: 'family-name',
            isRequired: true,
          },
          {
            key: 'password',
            label: 'Mot de passe',
            option: 'password',
            isRequired: true,
            regex: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$',
            errorMessage:
              'au moins une MAJUSCULE, minuscule et un chiffre et au moins 6 caractères ',
          },
          {
            key: 'password2',
            label: 'Confirme ton mot de passe',
            option: 'password',
            isRequired: true,
            regex: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$',
            errorMessage:
              'au moins une MAJUSCULE, minuscule et un chiffre et au moins 6 caractères ',
          },
          {
            key: 'birthdate',
            label: 'Date de naissance',
            type: 'date',
            isRequired: true,
          },
          {
            key: 'email',
            label: 'Adresse mail',
            isRequired: true,
            option: 'email',
            regex:
              "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$",
          },
          {
            key: 'phone',
            label: 'Numéro de téléphone',
            isRequired: true,
            option: 'tel',
            regex: '0[6-7]{1}[0-9]{8}$',
          },
          {
            key: 'departement',
            label: 'Département',
            type: 'select',
            options: [
              'TC',
              'IF',
              'BS',
              'GCU',
              'SGM',
              'GI',
              'GM',
              'GEN',
              'SGM',
              'FIMI',
              'GE',
              "Pas à l'INSA",
            ],
          },
          {
            key: 'year',
            label: 'Année',
            type: 'select',
            options: [1, 2, 3, 4, 5, '5+'],
          },
          {
            key: 'team',
            label: 'Team affiliée (laisser vide si non concerné)',
            type: 'select',
            options: [
              'BDE',
              'Kfet',
              'Karna',
              'Woods',
              'Teckos',
              'Tendrestival',
            ],
          },
          {
            key: 'comment',
            label:
              'Commentaire (handicap éventuel, allergies, la liste de tes amis, un mot doux pour les orgas...)',
          },
        ],
        __v: 0,
      },
      {
        _id: '624be11990b5de0011816811',
        key: 'show_ft_in_planning',
        value: false,
        __v: 0,
      },
      {
        _id: {
          $oid: '6268f658ae21802ea84db2b6',
        },
        key: 'sos_numbers',
        value: [
          {
            name: 'PC securite (1)',
            number: '04 28 29 22 11',
          },
          {
            name: 'PC securite (2)',
            number: '04 72 43 70 70',
          },
          {
            name: 'Pauline K, Resp. Orga',
            number: '07 67 33 73 32',
          },
          {
            name: 'Pauline R, Resp. Orga',
            number: '06 11 32 57 62',
          },
          {
            name: 'Damien, Resp. Orga',
            number: '06 09 72 90 06',
          },
        ],
        __v: 0,
      },
      {
        _id: { $oid: '6277e8c24e01a5b4707c629d' },
        key: 'availabilityMoment',
        value: false,
        __v: 0,
      },
    ];
  }
}
