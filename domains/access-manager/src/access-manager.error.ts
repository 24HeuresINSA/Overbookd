export class AccessManagerError extends Error {}

export class TeamNotFound extends AccessManagerError {
  constructor(code: string) {
    super(`L'équipe ${code} est introuvable`);
  }
}
