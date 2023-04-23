export async function* generateAsynIterator(events: Promise<any>) {
  yield events;
}
