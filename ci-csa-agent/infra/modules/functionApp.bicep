@description('Function App name.')
param name string

@description('Flex Consumption plan name.')
param planName string

@description('Location.')
param location string

@description('Storage account name for AzureWebJobs + deployment.')
param storageAccountName string

@description('Application Insights connection string.')
param appInsightsConnectionString string

@description('Azure OpenAI account name (for managed-identity role assignment).')
param openaiAccountName string

@description('Azure OpenAI endpoint (AZURE_OPENAI_ENDPOINT).')
param openaiEndpoint string

@description('Azure OpenAI deployment name (AZURE_OPENAI_DEPLOYMENT).')
param openaiDeployment string

@description('Deployment ring (exposed to the app as AGENT_RING).')
param ring string

@description('Tags.')
param tags object

var deploymentContainerName = 'deployments'

resource storage 'Microsoft.Storage/storageAccounts@2023-05-01' existing = {
  name: storageAccountName
}

// Flex Consumption plan (contract §4 — Functions Flex Consumption).
resource plan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: planName
  location: location
  tags: tags
  sku: {
    name: 'FC1'
    tier: 'FlexConsumption'
  }
  properties: {
    reserved: true
  }
}

resource functionApp 'Microsoft.Web/sites@2023-12-01' = {
  name: name
  location: location
  tags: tags
  kind: 'functionapp,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    functionAppConfig: {
      deployment: {
        storage: {
          type: 'blobContainer'
          value: '${storage.properties.primaryEndpoints.blob}${deploymentContainerName}'
          authentication: {
            type: 'SystemAssignedIdentity'
          }
        }
      }
      scaleAndConcurrency: {
        maximumInstanceCount: 100
        instanceMemoryMB: 2048
      }
      runtime: {
        name: 'node'
        version: '20'
      }
    }
    siteConfig: {
      appSettings: [
        {
          name: 'AzureWebJobsStorage__accountName'
          value: storageAccountName
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsightsConnectionString
        }
        {
          name: 'AGENT_RING'
          value: ring
        }
        {
          name: 'AZURE_OPENAI_ENDPOINT'
          value: openaiEndpoint
        }
        {
          name: 'AZURE_OPENAI_DEPLOYMENT'
          value: openaiDeployment
        }
        {
          name: 'AZURE_OPENAI_API_VERSION'
          value: '2024-10-21'
        }
      ]
    }
  }
}

// Managed-identity access to storage (no connection strings/keys).
var storageBlobDataOwner = subscriptionResourceId(
  'Microsoft.Authorization/roleDefinitions',
  'b7e6dc6d-f1e8-4753-8033-0f276bb0955b'
)
var storageQueueDataContributor = subscriptionResourceId(
  'Microsoft.Authorization/roleDefinitions',
  '974c5e8b-45b9-4653-ba55-5f855dd0fb88'
)
var storageTableDataContributor = subscriptionResourceId(
  'Microsoft.Authorization/roleDefinitions',
  '0a9a7e1f-b9d0-4cc4-a60d-0319b160aaa3'
)

resource blobRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storage.id, name, storageBlobDataOwner)
  scope: storage
  properties: {
    principalId: functionApp.identity.principalId
    roleDefinitionId: storageBlobDataOwner
    principalType: 'ServicePrincipal'
  }
}

resource queueRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storage.id, name, storageQueueDataContributor)
  scope: storage
  properties: {
    principalId: functionApp.identity.principalId
    roleDefinitionId: storageQueueDataContributor
    principalType: 'ServicePrincipal'
  }
}

resource tableRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storage.id, name, storageTableDataContributor)
  scope: storage
  properties: {
    principalId: functionApp.identity.principalId
    roleDefinitionId: storageTableDataContributor
    principalType: 'ServicePrincipal'
  }
}

// Keyless access to Azure OpenAI (Cognitive Services OpenAI User).
resource openai 'Microsoft.CognitiveServices/accounts@2024-10-01' existing = {
  name: openaiAccountName
}

var openaiUserRole = subscriptionResourceId(
  'Microsoft.Authorization/roleDefinitions',
  '5e0bd9bd-7b93-4f28-af87-19fc36ad61bd'
)

resource openaiRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(openai.id, name, openaiUserRole)
  scope: openai
  properties: {
    principalId: functionApp.identity.principalId
    roleDefinitionId: openaiUserRole
    principalType: 'ServicePrincipal'
  }
}

output name string = functionApp.name
output defaultHostname string = functionApp.properties.defaultHostName
output principalId string = functionApp.identity.principalId
