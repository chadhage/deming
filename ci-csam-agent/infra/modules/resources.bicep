// Resource-group-scoped composition for one agent + ring.
@description('Short agent key used in resource names.')
param agentKey string

@description('Deployment ring.')
param ring string

@description('Primary region.')
param location string

@description('Paired/secondary region for geo-redundancy.')
param secondaryLocation string

@description('Resource tags.')
param tags object

var suffix = uniqueString(subscription().id, resourceGroup().id, agentKey, ring)
var namePrefix = '${agentKey}${ring}'

module monitoring 'monitoring.bicep' = {
  name: 'monitoring'
  params: {
    name: 'appi-${namePrefix}-${suffix}'
    location: location
    tags: tags
  }
}

module storage 'storage.bicep' = {
  name: 'storage'
  params: {
    // Storage account names: 3-24 lowercase alphanumeric.
    name: toLower(substring('st${namePrefix}${suffix}', 0, 24))
    location: location
    // GA gets geo-redundant storage; lower rings stay zone-redundant for cost.
    sku: ring == 'ga' ? 'Standard_RAGRS' : 'Standard_ZRS'
    tags: tags
  }
}

module openai 'openai.bicep' = {
  name: 'openai'
  params: {
    name: 'oai-${namePrefix}-${suffix}'
    location: location
    tags: tags
  }
}

module functionApp 'functionApp.bicep' = {
  name: 'functionApp'
  params: {
    name: 'func-${namePrefix}-${suffix}'
    planName: 'plan-${namePrefix}-${suffix}'
    location: location
    storageAccountName: storage.outputs.name
    appInsightsConnectionString: monitoring.outputs.connectionString
    openaiAccountName: openai.outputs.name
    openaiEndpoint: openai.outputs.endpoint
    openaiDeployment: openai.outputs.deploymentName
    ring: ring
    tags: tags
  }
}

module staticWebApp 'staticWebApp.bicep' = {
  name: 'staticWebApp'
  params: {
    name: 'swa-${namePrefix}-${suffix}'
    // SWA is a global resource; some regions only. Use a SWA-supported region.
    location: 'eastus2'
    tags: tags
  }
}

output functionAppName string = functionApp.outputs.name
output functionAppHostname string = functionApp.outputs.defaultHostname
output staticWebAppName string = staticWebApp.outputs.name
output storageAccountName string = storage.outputs.name
output openaiAccountName string = openai.outputs.name
output openaiEndpoint string = openai.outputs.endpoint
output secondaryLocation string = secondaryLocation
