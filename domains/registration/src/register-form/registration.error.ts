export class RegistrationError extends Error {
  constructor(
    readonly reasons: string[],
    errorMessage: string = "Erreur lors de l'inscription",
  ) {
    super(`${errorMessage}:\n${reasons.join("\n")}`);
  }
}

export class NotFulfilledRegistration extends RegistrationError {
  constructor(reasons: string[]) {
    super(reasons, "L'inscription n'est pas complète");
  }
}
