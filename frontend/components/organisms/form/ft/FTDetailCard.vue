<template>
    <v-card :style="isDisabled ? `border-left: 5px solid green` : ``">
      <v-card-title>Détail</v-card-title>
      <v-card-text>
        <RichEditor
            :value="data"
            :disabled="isDisabled"
            :data="data"
            @change="onFormChange"
            ></RichEditor>
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  import RichEditor from '~/components/atoms/RichEditor.vue';
  
  export default {
    name: "FTDetailCard",
    components: { RichEditor },
    props: {
      topic: {
        type: String,
        default: () => "",
      },
      formKey: {
        type: String,
        default: () => {
          null;
        },
      },
      isDisabled: {
        type: Boolean,
        default: () => {
          false;
        },
      },
      form: {
        type: Object,
        default: () => ({}),
      },
    },
    data: () => {
      return {
        FORM: undefined,
      };
    },
    computed: {
      data: function () {
        return this.form[this.topic];
      },
    },
    mounted() {
      this.FORM = Array.from(this.$accessor.config.getConfig(this.formKey));
    },
    methods: {
      onFormChange(form) {
        this.$emit("form-change", form);
      },
    },
  };
  </script>
  
  <style scoped></style>
  