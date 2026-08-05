export const ANONYMOUS = "Anonymous";
export const ANONYMOUS_MOBILE_PHONE = "0600000000";
export const ANONYMOUS_BIRTH_DATE = new Date("1970-01-01");

export type AnonymousMember = {
  firstName: typeof ANONYMOUS;
  lastName: typeof ANONYMOUS;
  nickname: null;
  email: string;
  mobilePhone: typeof ANONYMOUS_MOBILE_PHONE;
  birthDate: typeof ANONYMOUS_BIRTH_DATE;
  comment: null;
  note: null;
  profilePicture: null;
  oidcId: null;
};
