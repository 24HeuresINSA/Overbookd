import {
  Adherent,
  Contact,
  DraftWithoutConflicts,
  Feedback,
  FestivalTask,
  FestivalTaskReviewable,
  FestivalTaskWithoutConflicts,
  FestivalTaskKeyEvent as KeyEvent,
  Mobilization,
  ReadyToAssignWithoutConflicts,
  Reviewer,
  ReviewingStatus,
  Volunteer,
  isAssignedToDrive,
  isDraft,
} from "@overbookd/festival-event";
import { SELECT_CONTACT } from "./adherent.query";
import { SELECT_FESTIVAL_ACTIVITY } from "./festival-activity.query";
import { Prisma } from "@prisma/client";
import { SELECT_EVENT } from "./event.query";
import { SELECT_MOBILIZATION } from "./mobilization.query";
import { SELECT_INQUIRY_REQUEST } from "./inquiry.query";
import { SELECT_FEEDBACKS } from "./feedback.query";
import { SELECT_VOLUNTEER } from "../../../common/repository/volunteer.query";
import { SELECT_LOCATION } from "../../../common/repository/location.query";
import { Item } from "@overbookd/list";

const SELECT_REVIEWS = {
  reviews: {
    select: {
      team: true,
      status: true,
    },
  },
};

export const SELECT_FESTIVAL_TASK = {
  id: true,
  status: true,
  name: true,
  teamCode: true,
  category: true,
  topPriority: true,
  administrator: { select: SELECT_VOLUNTEER },
  appointment: { select: SELECT_LOCATION },
  festivalActivity: { select: SELECT_FESTIVAL_ACTIVITY },
  contacts: { select: { contact: { select: SELECT_CONTACT } } },
  globalInstruction: true,
  inChargeInstruction: true,
  inChargeVolunteers: { select: { volunteer: { select: SELECT_VOLUNTEER } } },
  mobilizations: { select: SELECT_MOBILIZATION },
  inquiries: { select: SELECT_INQUIRY_REQUEST },
  events: { select: SELECT_EVENT },
  ...SELECT_FEEDBACKS,
  ...SELECT_REVIEWS,
  reviewer: { select: SELECT_VOLUNTEER },
};

export class FestivalTaskQueryBuilder {
  static create(task: DraftWithoutConflicts) {
    return {
      ...databaseFestivalTaskWithoutListsMapping(task),
      contacts: {
        create: task.instructions.contacts.map(({ id }) => ({
          contact: { connect: { id } },
        })),
      },
      inChargeVolunteers: {
        create: task.instructions.inCharge.volunteers.map(({ id }) => ({
          volunteer: { connect: { id } },
        })),
      },
      mobilizations: {
        create: task.mobilizations.map((mobilization) =>
          databaseMobilizationForCreation(mobilization),
        ),
      },
      inquiries: {
        create: task.inquiries.map((inquiry) => ({
          ...inquiry,
          festivalTaskId: task.id,
        })),
      },
      events: {
        create: task.history.map(keyEventToHistory(task)),
      },
    };
  }

  static update(task: FestivalTaskWithoutConflicts) {
    const reviews = isDraft(task) ? {} : { reviews: this.upsertReviews(task) };
    const contacts = this.upsertContacts(task.id, task.instructions.contacts);
    const inChargeVolunteers = this.upsertInChargeVolunteers(
      task.id,
      task.instructions.inCharge.volunteers,
    );
    const mobilizations = this.upsertMobilizations(task.id, task.mobilizations);
    const inquiries = this.upsertInquiries(task);
    const feedbacks = this.upsertFeedbacks(task);
    const events = this.upsertHistory(task);

    return {
      ...databaseFestivalTaskWithoutListsMapping(task),
      ...reviews,
      contacts,
      inChargeVolunteers,
      mobilizations,
      inquiries,
      feedbacks,
      events,
    };
  }

  static askForReview(task: FestivalTaskReviewable) {
    const reviews = this.upsertReviews(task);
    const reviewerId = task.reviewer?.id;
    const events = this.upsertHistory(task);

    return {
      ...databaseFestivalTaskWithoutListsMapping(task),
      reviews,
      reviewerId,
      events,
    };
  }

  static enableAssignment(task: ReadyToAssignWithoutConflicts) {
    const { category, topPriority, status } = task;
    const mobilizations = {
      update: task.mobilizations.map((mobilization) => ({
        where: { ftId_id: { ftId: task.id, id: mobilization.id } },
        data: {
          assignments: {
            create: mobilization.assignments.map((assignment) => ({
              start: assignment.start,
              id: assignment.id,
              end: assignment.end,
              assignees: {
                create: assignment.assignees.map((assignee) => ({
                  userId: assignee.id,
                })),
              },
            })),
          },
        },
      })),
    };
    const events = this.upsertHistory(task);
    return {
      status,
      category,
      topPriority,
      mobilizations,
      events,
    };
  }

  private static upsertReviews(task: FestivalTaskReviewable) {
    const reviews = Object.entries(task.reviews)
      .filter((entry): entry is [Reviewer<"FT">, ReviewingStatus] => true)
      .map(([team, status]) => ({ team, status }));

    return {
      upsert: reviews.map((review) => ({
        where: { ftId_team: { ftId: task.id, team: review.team } },
        update: review,
        create: review,
      })),
    };
  }

  private static upsertContacts(
    festivalTaskId: FestivalTask["id"],
    contacts: Contact[],
  ) {
    return {
      upsert: contacts.map((contact) => ({
        where: {
          contactId_festivalTaskId: {
            contactId: contact.id,
            festivalTaskId,
          },
        },
        create: { contact: { connect: { id: contact.id } } },
        update: { contact: { connect: { id: contact.id } } },
      })),
      deleteMany: {
        festivalTaskId,
        contactId: { notIn: contacts.map(({ id }) => id) },
      },
    };
  }

  private static upsertInChargeVolunteers(
    festivalTaskId: FestivalTask["id"],
    volunteers: Volunteer[],
  ) {
    return {
      upsert: volunteers.map((volunteer) => ({
        where: {
          volunteerId_festivalTaskId: {
            volunteerId: volunteer.id,
            festivalTaskId,
          },
        },
        create: { volunteer: { connect: { id: volunteer.id } } },
        update: { volunteer: { connect: { id: volunteer.id } } },
      })),
      deleteMany: {
        festivalTaskId,
        volunteerId: { notIn: volunteers.map(({ id }) => id) },
      },
    };
  }

  private static upsertMobilizations(
    festivalTaskId: FestivalTask["id"],
    mobilizations: Mobilization<{
      withConflicts: false;
      withAssignments: false;
    }>[],
  ) {
    return {
      upsert: mobilizations.map((mobilization) => ({
        where: { ftId_id: { ftId: festivalTaskId, id: mobilization.id } },
        update: databaseMobilisationForUpdate(mobilization),
        create: databaseMobilizationForCreation(mobilization),
      })),
      deleteMany: {
        ftId: festivalTaskId,
        id: { notIn: mobilizations.map(({ id }) => id) },
      },
    };
  }

  private static upsertInquiries(task: FestivalTaskWithoutConflicts) {
    return {
      upsert: task.inquiries.map((request) => {
        const update = isAssignedToDrive(request)
          ? { quantity: request.quantity, drive: request.drive }
          : { quantity: request.quantity };

        return {
          where: { slug_ftId: { slug: request.slug, ftId: task.id } },
          update,
          create: { slug: request.slug, quantity: request.quantity },
        };
      }),
      deleteMany: {
        ftId: task.id,
        slug: { notIn: task.inquiries.map(({ slug }) => slug) },
      },
    };
  }

  private static upsertFeedbacks(task: FestivalTaskWithoutConflicts) {
    return {
      upsert: task.feedbacks.map((feedback) => ({
        where: {
          ftId_authorId_publishedAt: {
            ftId: task.id,
            authorId: feedback.author.id,
            publishedAt: feedback.publishedAt,
          },
        },
        update: feedbackDatabaseMapping(feedback),
        create: feedbackDatabaseMapping(feedback),
      })),
      deleteMany: {
        ftId: task.id,
        NOT: {
          authorId: {
            in: task.feedbacks.map(({ author }) => author.id),
          },
          publishedAt: {
            in: task.feedbacks.map(({ publishedAt }) => publishedAt),
          },
        },
      },
    };
  }

  private static upsertHistory(task: FestivalTaskWithoutConflicts) {
    return {
      upsert: task.history.map((keyEvent) => ({
        where: {
          ftId_event_instigatorId_at: {
            ftId: task.id,
            instigatorId: keyEvent.by.id,
            event: keyEvent.action,
            at: keyEvent.at,
          },
        },
        update: { context: keyEvent.description },
        create: keyEventToHistory(task)(keyEvent),
      })),
    };
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
  task: FestivalTaskWithoutConflicts,
): (event: KeyEvent) => StoredHistoryKeyEvent {
  return ({ action, by, at, description }) => ({
    event: action,
    instigatorId: by.id,
    at,
    context: description,
    snapshot: task as unknown as Prisma.JsonObject,
  });
}

function databaseMobilisationForUpdate(
  mobilization: Item<FestivalTaskWithoutConflicts["mobilizations"]>,
) {
  return {
    id: mobilization.id,
    start: mobilization.start,
    end: mobilization.end,
    durationSplitInHour: mobilization.durationSplitInHour,
    volunteers: {
      createMany: {
        data: mobilization.volunteers.map(({ id }) => ({ volunteerId: id })),
        skipDuplicates: true,
      },
      deleteMany: {
        volunteerId: { notIn: mobilization.volunteers.map(({ id }) => id) },
      },
    },
    teams: {
      createMany: {
        data: mobilization.teams.map(({ count, team }) => ({
          count,
          teamCode: team,
        })),
        skipDuplicates: true,
      },
      deleteMany: {
        teamCode: { notIn: mobilization.teams.map(({ team }) => team) },
      },
    },
  };
}

function databaseMobilizationForCreation(
  mobilization: Item<FestivalTaskWithoutConflicts["mobilizations"]>,
) {
  return {
    id: mobilization.id,
    start: mobilization.start,
    end: mobilization.end,
    durationSplitInHour: mobilization.durationSplitInHour,
    volunteers: {
      create: mobilization.volunteers.map(({ id }) => ({ volunteerId: id })),
    },
    teams: {
      create: mobilization.teams.map(({ count, team }) => ({
        count,
        teamCode: team,
      })),
    },
  };
}

function databaseFestivalTaskWithoutListsMapping(
  task: FestivalTaskWithoutConflicts,
) {
  const reviewerId = isDraft(task) ? null : task.reviewer?.id;
  return {
    id: task.id,
    status: task.status,
    isDeleted: false,
    name: task.general.name,
    administratorId: task.general.administrator.id,
    teamCode: task.general.team,
    festivalActivityId: task.festivalActivity.id,
    appointmentId: task.instructions.appointment?.id,
    globalInstruction: task.instructions.global,
    inChargeInstruction: task.instructions.inCharge.instruction,
    reviewerId,
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

export const IS_NOT_DELETED = { isDeleted: false };

export function buildFestivalTaskCondition(id: FestivalTask["id"]) {
  return { id, ...IS_NOT_DELETED };
}
