/**
 * Manage snack notification bar state
 * See example of usage in LocationAdder
 */
export class Snack {
  timeout: number;
  feedbackMessage = "";
  active = false;
  constructor(t?: number) {
    this.timeout = t || 3000;
  }

  /**
   * Enable snackbar and setup the message to display
   * @param msg The message to display
   */
  display(msg: string) {
    this.feedbackMessage = msg;
    this.active = true;
  }
}
