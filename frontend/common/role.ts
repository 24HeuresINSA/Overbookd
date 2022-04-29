import _ from "lodash";

/**
 * @deprecated
 */
export function getConfig(context: any, key: string) {
  const conf = context.$store.state.config.data.data.find(
    (e: { key: string }) => e.key === key
  );
  if (conf) {
    return _.cloneDeep(conf.value);
  }
  return undefined;
}
