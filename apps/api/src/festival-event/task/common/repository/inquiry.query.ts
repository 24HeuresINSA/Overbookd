export const SELECT_INQUIRY_REQUEST = {
  slug: true,
  quantity: true,
  drive: true,
  catalogItem: {
    select: { name: true },
  },
};

export const SELECT_GEAR = {
  slug: true,
  name: true,
};

export type DatabaseInquiryRequest = {
  slug: string;
  quantity: number;
  drive: string | null;
  catalogItem: { name: string };
};
