export class BugReport {
  static template(
    expectedBehavior: string,
    actualBehavior: string,
    stepsToReproduce: string,
  ): string {
    return `# URL ou page
${window.location.href}

# Comportement attendu
<!---Décrivez ci-dessous le comportement souhaité.--->
${expectedBehavior}

# Comportement constaté
<!---Décrivez ci-dessous le comportement observé.--->
${actualBehavior}

# Étapes pour reproduire
<!---Listez ci-dessous les étapes à suivre pour reproduire le problème.--->
${stepsToReproduce}

# Informations complémentaires
version: ${process.env.OVERBOOKD_VERSION}  
user agent: ${navigator.userAgent}  
date: ${Date().toLocaleString()}  
resolution: ${window.screen.availWidth}x${window.screen.availHeight}`;
  }
}
