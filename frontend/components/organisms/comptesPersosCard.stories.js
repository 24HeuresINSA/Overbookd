import ComptesPersosCard from "./comptesPersosCard.vue";

export default {
  title: "Organisms/ComptesPersosCard",
  component: ComptesPersosCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ComptesPersosCard },
  template: '<ComptesPersosCard :user="user"/>',
});

export const Classic = Template.bind({});
Classic.args = {};
