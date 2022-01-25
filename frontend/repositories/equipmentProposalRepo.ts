import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { EquipmentProposal } from "~/utils/models/Equipment";

const resource = "/equipment/proposal";
type Context = { $axios: NuxtAxiosInstance };

export default {
  getEquipmentProposals(context: Context) {
    return context.$axios.get(resource);
  },
  createEquipmentProposal(
    context: Context,
    equipementProposal: EquipmentProposal
  ) {
    return context.$axios.post(resource, equipementProposal);
  },
  deleteEquipmentProposal(context: Context, id: string) {
    return context.$axios.delete(`${resource}/${id}`);
  },
  validateEquipmentProposal(context: Context, id: string) {
    return context.$axios.put(`${resource}/${id}/validate`);
  },
};
