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

export class NotCandidate extends MembershipApplicationError {
  constructor() {
    super("Le bénévole n'a pas candidaté pour cette édition");
  }
}

export class AlreadyRejected extends MembershipApplicationError {
  constructor(readonly membership: Membership) {
    super(
      `Ta candidature pour être ${readableMembership(membership)} a déjà été rejetée pour cette édition`,
    );
  }
}
