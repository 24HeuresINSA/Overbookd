import UserCard from "./userCard.vue";

export default {
  title: "Organisms/UserCard",
  component: UserCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { UserCard },
  template: '<UserCard :user="user"/>',
});

export const Classic = Template.bind({});
Classic.args = {};
