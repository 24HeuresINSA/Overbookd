export const SELECT_VOLUNTEER = {
  id: true,
  firstname: true,
  lastname: true,
  nickname: true,
};

export const SELECT_CONTACT = { ...SELECT_VOLUNTEER, phone: true };
