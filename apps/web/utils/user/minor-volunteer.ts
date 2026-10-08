export function willBeMinorAtEvent(birthDate: Date): boolean {
  const MAJORITY_AGE = 18;
  const majorityDate = new Date(
    birthDate.getFullYear() + MAJORITY_AGE,
    birthDate.getMonth(),
    birthDate.getDate(),
  );
  return majorityDate > useConfigurationStore().mondayBeforeEventDate;
}
