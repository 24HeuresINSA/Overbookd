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

export class AlreadyCandidateForMembership extends MembershipApplicationError {
  constructor(readonly membership: Membership) {
    super(
      `Le·a candidat·e a déjà candidaté pour être ${readableMembership(membership)} pour cette édition`,
    );
  }
}

export class AlreadyRejected extends MembershipApplicationError {
  constructor(readonly membership: Membership) {
    super(
      `Le·a candidat·e a déjà été rejeté·e pour être ${readableMembership(membership)} pour cette édition`,
    );
  }
}

export class NotRejected extends MembershipApplicationError {
  constructor(readonly membership: Membership) {
    super(
      `Le·a candidat·e n'a pas été rejeté·e pour être ${readableMembership(membership)} pour cette édition`,
    );
  }
}
