// Deming agent — subscription-scoped entry point.
// Provisions one resource group per ring and the agent's resource set inside it.
targetScope = 'subscription'

@description('Deployment ring (logical segmentation per contract §3).')
@allowed([
  'canary'
  'private'
  'public'
  'ga'
])
param ring string = 'canary'

@description('Primary region.')
param location string = 'eastus2'

@description('Paired/secondary region for geo-redundancy.')
param secondaryLocation string = 'centralus'

@description('Short agent key used in resource names.')
param agentKey string = 'deming'

var tags = {
  agent: agentKey
  ring: ring
  workload: 'ci-agents'
}

resource rg 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: 'rg-${agentKey}-${ring}'
  location: location
  tags: tags
}

module resources 'modules/resources.bicep' = {
  name: '${agentKey}-${ring}-resources'
  scope: rg
  params: {
    agentKey: agentKey
    ring: ring
    location: location
    secondaryLocation: secondaryLocation
    tags: tags
  }
}

output resourceGroupName string = rg.name
output functionAppName string = resources.outputs.functionAppName
output staticWebAppName string = resources.outputs.staticWebAppName
output storageAccountName string = resources.outputs.storageAccountName
