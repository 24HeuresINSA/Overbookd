import { Membership, STAFF } from "../newcomer";

export class MembershipApplicationError extends Error {}

export class AlreadyCandidate extends MembershipApplicationError {
  constructor(readonly membership: Membership) {
    const readableMembership = membership === STAFF ? "orga" : "bénévole";
    super(
      `Tu as déjà candidaté pour être ${readableMembership} pour cette édition`,
    );
  }
}
