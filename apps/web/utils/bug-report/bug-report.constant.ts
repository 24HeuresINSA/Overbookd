export class BugReport {
  static template(
    expectedBehavior: string,
    actualBehavior: string,
    stepsToReproduce: string,
  ): string {
    const config = useRuntimeConfig();

    return `# URL ou page
${window.location.href}

# Comportement attendu
${expectedBehavior}

# Comportement constaté
${actualBehavior}

# Étapes pour reproduire
${stepsToReproduce}

# Informations complémentaires
version: ${config.public.version}  
user agent: ${navigator.userAgent}  
date: ${Date().toLocaleString()}  
resolution: ${window.screen.availWidth}x${window.screen.availHeight}`;
  }
}
