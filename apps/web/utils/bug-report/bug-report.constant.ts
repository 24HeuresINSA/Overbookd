export class BugReport {
  static template(
    expectedBehavior: string,
    actualBehavior: string,
    stepsToReproduce: string,
  ): string {
    return `# URL ou page
${window.location.href}

# Comportement attendu
${expectedBehavior}

# Comportement constaté
${actualBehavior}

# Étapes pour reproduire
${stepsToReproduce}

# Informations complémentaires
version: ${process.env.OVERBOOKD_VERSION}  
user agent: ${navigator.userAgent}  
date: ${Date().toLocaleString()}  
resolution: ${window.screen.availWidth}x${window.screen.availHeight}`;
  }
}
