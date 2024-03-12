export interface Configuration<
  T extends object | string | number | boolean =
    | object
    | string
    | number
    | boolean,
> {
  key: string;
  value: T;
}

//TODO: update config key
export const INVITE_STAFF_LINK = "inviteNewAdherentLink";
