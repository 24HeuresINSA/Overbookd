export const SELECT_ADHERENT = {
  id: true,
  firstname: true,
  lastname: true,
  nickname: true,
};

export const SELECT_CONTACT = { ...SELECT_ADHERENT, phone: true };
