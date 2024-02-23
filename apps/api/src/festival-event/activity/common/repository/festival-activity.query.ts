import { Prisma } from "@prisma/client";
import {
  Draft,
  Feedback,
  FestivalActivity,
  Reviewable,
  ReviewStatus,
  Reviewer,
  TimeWindow,
  isDraft,
  isAssignedToDrive,
  FestivalActivityKeyEvent as KeyEvent,
  Adherent,
  isLinkedToCatalogItem,
} from "@overbookd/festival-event";
import { SELECT_VOLUNTEER } from "../../../common/repository/volunteer.query";
import { SELECT_LOCATION } from "../../../common/repository/location.query";
import { SELECT_CATALOG_SIGNAGE } from "./catalog-signage.query";

export const IS_NOT_DELETED = { isDeleted: false };

const SELECT_REVIEW = {
  team: true,
  status: true,
};

const SELECT_TIME_WINDOW = {
  id: true,
  start: true,
  end: true,
};

const SELECT_GENERAL = {
  name: true,
  description: true,
  toPublish: true,
  photoLink: true,
  isFlagship: true,
  categories: true,
  generalTimeWindows: { select: SELECT_TIME_WINDOW },
};

const SELECT_IN_CHARGE = {
  teamCode: true,
  adherent: {
    select: SELECT_VOLUNTEER,
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
};

const SELECT_SIGNA = {
  location: { select: SELECT_LOCATION },
  signages: {
    select: {
      id: true,
      quantity: true,
      text: true,
      size: true,
      type: true,
      comment: true,
      catalogItem: {
        select: SELECT_CATALOG_SIGNAGE,
      },
    },
  },
};

const SELECT_SECURITY = {
  specialNeed: true,
  freePass: true,
};

const SELECT_SUPPLY = {
  electricity: {
    select: {
      id: true,
      connection: true,
      device: true,
      count: true,
      power: true,
      comment: true,
    },
  },
  water: true,
};

const SELECT_INQUIRY = {
  inquiryTimeWindows: { select: SELECT_TIME_WINDOW },
  inquiries: {
    select: {
      slug: true,
      quantity: true,
      drive: true,
      catalogItem: {
        select: {
          name: true,
          category: {
            select: {
              owner: { select: { code: true } },
            },
          },
        },
      },
    },
  },
};

const SELECT_FEEDBACKS = {
  feedbacks: {
    select: {
      author: { select: SELECT_VOLUNTEER },
      content: true,
      publishedAt: true,
    },
    orderBy: { publishedAt: "asc" },
  },
} as const;

const SELECT_HISTORY = {
  events: {
    select: {
      instigator: { select: SELECT_VOLUNTEER },
      context: true,
      at: true,
      event: true,
    },
  },
};

const SELECT_FESTIVAL_TASKS = {
  festivalTasks: {
    select: {
      id: true,
      name: true,
      status: true,
    },
    where: IS_NOT_DELETED,
  },
};

export const SELECT_FESTIVAL_ACTIVITY = {
  id: true,
  status: true,
  reviews: { select: SELECT_REVIEW },
  ...SELECT_GENERAL,
  ...SELECT_IN_CHARGE,
  ...SELECT_SIGNA,
  ...SELECT_SECURITY,
  ...SELECT_SUPPLY,
  ...SELECT_INQUIRY,
  ...SELECT_FEEDBACKS,
  ...SELECT_HISTORY,
  ...SELECT_FESTIVAL_TASKS,
};

export class FestivalActivityQueryBuilder {
  static create(activity: Draft) {
    return {
      ...databaseFestivalActivityWithoutListsMapping(activity),
      generalTimeWindows: {
        create: activity.general.timeWindows,
      },
      contractors: {
        create: activity.inCharge.contractors,
      },
      signages: {
        create: activity.signa.signages,
      },
      electricity: {
        create: activity.supply.electricity,
      },
      inquiryTimeWindows: {
        create: activity.inquiry.timeWindows,
      },
      inquiries: {
        create: this.listInquiries(activity),
      },
      feedbacks: {
        create: activity.feedbacks.map(feedbackDatabaseMapping),
      },
      events: {
        create: activity.history.map(keyEventToHistory(activity)),
      },
    };
  }

  static update(activity: FestivalActivity) {
    const reviews = isDraft(activity)
      ? {}
      : { reviews: this.upsertReviews(activity) };
    const generalTimeWindows = this.upsertTimeWindows(
      activity.id,
      activity.general.timeWindows,
    );
    const contractors = this.upsertContractors(activity);
    const signages = this.upsertSignages(activity);
    const electricity = this.upsertElectricitySupplies(activity);
    const inquiryTimeWindows = this.upsertTimeWindows(
      activity.id,
      activity.inquiry.timeWindows,
    );
    const inquiries = this.upsertInquiries(activity);
    const feedbacks = this.upsertFeedbacks(activity);
    const events = this.upsertHistory(activity);

    return {
      ...databaseFestivalActivityWithoutListsMapping(activity),
      generalTimeWindows,
      contractors,
      signages,
      electricity,
      inquiryTimeWindows,
      inquiries,
      feedbacks,
      events,
      ...reviews,
    };
  }

  static askForReview(activity: Reviewable) {
    const reviews = this.upsertReviews(activity);
    const events = this.upsertHistory(activity);
    return {
      ...databaseFestivalActivityWithoutListsMapping(activity),
      reviews,
      events,
    };
  }

  private static upsertSignages(activity: FestivalActivity) {
    const signages = activity.signa.signages.map((signage) => {
      const catalogItem = isLinkedToCatalogItem(signage)
        ? { catalogItemId: signage.catalogItem?.id }
        : {};

      return {
        id: signage.id,
        quantity: signage.quantity,
        text: signage.text,
        size: signage.size,
        type: signage.type,
        comment: signage.comment,
        ...catalogItem,
      };
    });

    return {
      upsert: signages.map((signage) => ({
        where: { faId_id: { faId: activity.id, id: signage.id } },
        update: signage,
        create: signage,
      })),
      deleteMany: {
        faId: activity.id,
        id: { notIn: signages.map(({ id }) => id) },
      },
    };
  }

  private static upsertElectricitySupplies(activity: FestivalActivity) {
    return {
      upsert: activity.supply.electricity.map((electricitySupply) => ({
        where: { faId_id: { faId: activity.id, id: electricitySupply.id } },
        update: electricitySupply,
        create: electricitySupply,
      })),
      deleteMany: {
        faId: activity.id,
        id: { notIn: activity.supply.electricity.map(({ id }) => id) },
      },
    };
  }

  private static upsertTimeWindows(
    faId: FestivalActivity["id"],
    timeWindows: TimeWindow[],
  ) {
    return {
      upsert: timeWindows.map((timeWindow) => ({
        where: { faId_id: { faId, id: timeWindow.id } },
        update: timeWindow,
        create: timeWindow,
      })),
      deleteMany: { faId, id: { notIn: timeWindows.map(({ id }) => id) } },
    };
  }

  private static upsertInquiries(activity: FestivalActivity) {
    const inquiries = this.listInquiries(activity);
    return {
      upsert: inquiries.map((request) => {
        const update = isAssignedToDrive(request)
          ? { quantity: request.quantity, drive: request.drive }
          : { quantity: request.quantity };

        return {
          where: { slug_faId: { slug: request.slug, faId: activity.id } },
          update,
          create: { slug: request.slug, quantity: request.quantity },
        };
      }),
      deleteMany: {
        faId: activity.id,
        slug: { notIn: inquiries.map(({ slug }) => slug) },
      },
    };
  }

  private static upsertFeedbacks(activity: FestivalActivity) {
    return {
      upsert: activity.feedbacks.map((feedback) => ({
        where: {
          faId_authorId_publishedAt: {
            faId: activity.id,
            authorId: feedback.author.id,
            publishedAt: feedback.publishedAt,
          },
        },
        update: feedbackDatabaseMapping(feedback),
        create: feedbackDatabaseMapping(feedback),
      })),
      deleteMany: {
        faId: activity.id,
        NOT: {
          authorId: {
            in: activity.feedbacks.map(({ author }) => author.id),
          },
          publishedAt: {
            in: activity.feedbacks.map(({ publishedAt }) => publishedAt),
          },
        },
      },
    };
  }

  private static upsertHistory(activity: FestivalActivity) {
    return {
      upsert: activity.history.map((keyEvent) => ({
        where: {
          faId_event_instigatorId_at: {
            faId: activity.id,
            instigatorId: keyEvent.by.id,
            event: keyEvent.action,
            at: keyEvent.at,
          },
        },
        update: { context: keyEvent.description },
        create: keyEventToHistory(activity)(keyEvent),
      })),
    };
  }

  private static upsertContractors(activity: FestivalActivity) {
    return {
      upsert: activity.inCharge.contractors.map((contractor) => ({
        where: { faId_id: { faId: activity.id, id: contractor.id } },
        update: contractor,
        create: contractor,
      })),
      deleteMany: {
        faId: activity.id,
        id: { notIn: activity.inCharge.contractors.map(({ id }) => id) },
      },
    };
  }

  private static upsertReviews(activity: Reviewable) {
    const reviews = Object.entries(activity.reviews)
      .filter((entry): entry is [Reviewer<"FA">, ReviewStatus] => true)
      .map(([team, status]) => ({ team, status }));

    return {
      upsert: reviews.map((review) => ({
        where: { faId_team: { faId: activity.id, team: review.team } },
        update: review,
        create: review,
      })),
    };
  }

  private static listInquiries(activity: FestivalActivity) {
    return [
      ...activity.inquiry.barriers,
      ...activity.inquiry.electricity,
      ...activity.inquiry.gears,
    ];
  }
}

type StoredHistoryKeyEvent = {
  event: KeyEvent["action"];
  instigatorId: Adherent["id"];
  at: Date;
  context: KeyEvent["description"];
  snapshot: Prisma.JsonObject;
};

function keyEventToHistory(
  activity: FestivalActivity,
): (event: KeyEvent) => StoredHistoryKeyEvent {
  return ({ action, by, at, description }) => ({
    event: action,
    instigatorId: by.id,
    at,
    context: description,
    snapshot: activity as unknown as Prisma.JsonObject,
  });
}

function databaseFestivalActivityWithoutListsMapping(
  activity: FestivalActivity,
) {
  return {
    id: activity.id,
    status: activity.status,
    isDeleted: false,
    name: activity.general.name,
    description: activity.general.description,
    toPublish: activity.general.toPublish,
    photoLink: activity.general.photoLink,
    isFlagship: activity.general.isFlagship,
    categories: activity.general.categories,
    teamCode: activity.inCharge.team,
    adherentId: activity.inCharge.adherent.id,
    locationId: activity.signa.location?.id,
    specialNeed: activity.security.specialNeed,
    freePass: activity.security.freePass,
    water: activity.supply.water,
  };
}

type DatabaseFeedback = {
  authorId: number;
  content: string;
  publishedAt: Date;
};

function feedbackDatabaseMapping(feedback: Feedback): DatabaseFeedback {
  return {
    authorId: feedback.author.id,
    content: feedback.content,
    publishedAt: feedback.publishedAt,
  };
}

export function buildFestivalActivityCondition(id: FestivalActivity["id"]) {
  return { id, ...IS_NOT_DELETED };
}
