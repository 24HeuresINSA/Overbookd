export class BugReport {
  static get template(): string {
    return `# URL or page
${window.location.href}

# Comportement attendu
<!---Décrivez ci-dessous le comportement souhaité.--->


# Comportement constaté
<!---Décrivez ci-dessous le comportement observé.--->

# Étapes pour reproduire
<!---Listez ci-dessous les étapes à suivre pour reproduire le problème.--->

 - Étape 1
 - Étape 2
 ...

# Informations complémentaires
version: ${process.env.OVERBOOKD_VERSION}
user agent: ${navigator.userAgent}
date: ${Date().toLocaleString()}
resolution: ${window.screen.availWidth}x${window.screen.availHeight}`;
  }
}
