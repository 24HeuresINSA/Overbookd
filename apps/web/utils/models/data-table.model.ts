export type Header = {
  text: string;
  value: string;
  align?: string;
  sortable?: boolean;
  width?: string;
  filter?: (value: never) => boolean;
};
