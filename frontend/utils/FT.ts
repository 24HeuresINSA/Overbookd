/**
 * Status list for FTs
 *
 * @property {string} draft FT is still a draft not ready for anything
 * @property {string} submitted FT has been submitted by the team, review by validators in progress
 * @property {string} refused FT has been refused by a validator at least
 * @property {string} validated FT has been validated by all validators
 * @property {string} ready has been marqued ready by management team (ie les humains)
 */
export const FTStatus = {
  draft: "draft",
  submitted: "submitted",
  refused: "refused",
  validated: "validated",
  ready: "ready",
};
