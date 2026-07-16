export type ApiZitadelUser = {
  userId: string;
  details: {
    sequence: string;
    changeDate: string;
    resourceOwner: string;
    creationDate: string;
  };
  state: string;
  username: string;
  loginNames: string[];
  preferredLoginName: string;
  human: {
    profile: {
      givenName: string;
      familyName: string;
      nickName: string;
      displayName: string;
      preferredLanguage: string;
      gender: string;
      avatarUrl: string;
    };
    email: {
      email: string;
      isVerified: boolean;
    };
    phone: {
      phone: string;
    };
    passwordChanged: string;
  };
};
