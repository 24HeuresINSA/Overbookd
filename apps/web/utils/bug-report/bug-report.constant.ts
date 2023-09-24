export const issueTemplate = `# URL or page
${window.location.href}

# Expected behavior
<!---What did you expected--->


# Actual behavior
<!---What is happening--->

# Steps to reproduce

 - Step 1
 - Step 2
 ...

# Additional info
version: ${process.env.OVERBOOKD_VERSION}
user agent: ${navigator.userAgent}
date: ${Date().toLocaleString()}
resolution: ${window.screen.availWidth}x${window.screen.availHeight}`;
