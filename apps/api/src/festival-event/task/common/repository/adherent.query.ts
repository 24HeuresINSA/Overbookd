import { SELECT_VOLUNTEER } from "../../../common/repository/volunteer.query";

export const SELECT_CONTACT = { ...SELECT_VOLUNTEER, phone: true };
