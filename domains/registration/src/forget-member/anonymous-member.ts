export const ANONYMOUS = "Anonymous";
export const ANONYMOUS_MOBILE_PHONE = "0600000000";

export type AnonymousMember = {
  firstName: typeof ANONYMOUS;
  lastName: typeof ANONYMOUS;
  nickname: null;
  email: string;
  mobilePhone: typeof ANONYMOUS_MOBILE_PHONE;
  comment: null;
};
