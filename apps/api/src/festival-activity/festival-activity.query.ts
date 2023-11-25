export const SELECT_DRAFT = {
  id: true,
  status: true,
  general: {
    select: {
      name: true,
      description: true,
      categories: true,
      isFlagship: true,
      photoLink: true,
      toPublish: true,
      timeWindows: {
        select: {
          id: true,
          start: true,
          end: true,
        },
      },
    },
  },
  inCharge: {
    select: {
      team: true,
      adherent: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          nickname: true,
        },
      },
      contractors: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          phone: true,
          email: true,
          company: true,
          comment: true,
        },
      },
    },
  },
  signa: {
    select: {
      location: true,
      signages: {
        select: {
          id: true,
          text: true,
          size: true,
          type: true,
          quantity: true,
          comment: true,
        },
      },
    },
  },
  security: {
    select: {
      specialNeed: true,
    },
  },
  supply: {
    select: {
      water: true,
      electricity: true,
    },
  },
  inquiry: {
    select: {
      timeWindows: {
        select: {
          id: true,
          start: true,
          end: true,
        },
      },
      requests: {
        select: {
          slug: true,
          name: true,
          quantity: true,
          catalogItem: {
            select: {
              category: {
                select: {
                  owner: {
                    select: {
                      code: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const SELECT_FESTIVAL_ACTIVITY = {
  ...SELECT_DRAFT,
  reviews: true,
};

export const SELECT_PREVIEW_FESTIVAL_ACTIVITY = {
  id: true,
  status: true,
  general: {
    select: {
      name: true,
    },
  },
  inCharge: {
    select: {
      team: true,
      adherent: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          nickname: true,
        },
      },
    },
  },
  reviews: true,
};
