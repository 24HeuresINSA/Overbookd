import UserNotifications from "./userNotifications.vue";

export default {
  title: "Organisms/UserNotifications",
  component: UserNotifications,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { UserNotifications },
  template: '<UserNotifications :user="user"/>',
});

export const Broadcast = Template.bind({});
Broadcast.args = {
  user: {
    notifications: [
      {
        link: "wikipedia.fr",
        message: "Daaaamn",
        team: "bureau",
        date: "2021-09-24T13:29:38.137Z",
        type: "broadcast",
      },
    ],
  },
};

export const FriendRequest = Template.bind({});
FriendRequest.args = {
  user: {
    notifications: [
      {
        link: "tinder.com",
        message: "Wanna be my FRIIIIEND",
        team: "hard",
        date: "2021-09-24T13:29:38.137Z",
        type: "friendRequest",
      },
    ],
  },
};
