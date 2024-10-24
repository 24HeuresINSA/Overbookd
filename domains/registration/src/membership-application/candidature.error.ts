import { Membership, STAFF } from "../newcomer.js";

function readableMembership(membership: Membership): string {
  return membership === STAFF ? "orga" : "bénévole";
}

export class MembershipApplicationError extends Error {}

export class AlreadyCandidate extends MembershipApplicationError {
  constructor(readonly membership: Membership) {
    super(
      `Tu as déjà candidaté pour être ${readableMembership(membership)} pour cette édition`,
    );
  }
}

export class Rejected extends MembershipApplicationError {
  constructor(readonly membership: Membership) {
    super(
      `Ta candidature pour être ${readableMembership(membership)} a été rejetée pour cette édition`,
    );
  }
}

export class AlreadyRejected extends MembershipApplicationError {
  constructor(readonly membership: Membership) {
    super(
      `Le bénévole a déjà été rejeté pour être ${readableMembership(membership)} pour cette édition`,
    );
  }
}

export class NotRejected extends MembershipApplicationError {
  constructor(readonly membership: Membership) {
    super(
      `Le bénévole n'a pas été rejeté pour être ${readableMembership(membership)} pour cette édition`,
    );
  }
}
