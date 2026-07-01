@description('Static Web App name.')
param name string

@description('Location (SWA-supported region).')
param location string

@description('Tags.')
param tags object

resource staticWebApp 'Microsoft.Web/staticSites@2023-12-01' = {
  name: name
  location: location
  tags: tags
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    // CI/CD wired up at deploy time (azd / GitHub Actions / SWA CLI).
    allowConfigFileUpdates: true
  }
}

output name string = staticWebApp.name
output defaultHostname string = staticWebApp.properties.defaultHostname
