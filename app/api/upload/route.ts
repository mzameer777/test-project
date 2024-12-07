import { BlobServiceClient } from '@azure/storage-blob'
import { CosmosClient } from '@azure/cosmos'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const title = formData.get('title') as string
  const description = formData.get('description') as string

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const azureStorageConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
  const azureStorageContainerName = process.env.AZURE_STORAGE_CONTAINER_NAME
  const azureCosmosConnectionString = process.env.AZURE_COSMOS_CONNECTION_STRING
  const azureCosmosDatabaseName = process.env.AZURE_COSMOS_DATABASE_NAME
  const azureCosmosContainerName = process.env.AZURE_COSMOS_CONTAINER_NAME

  if (!azureStorageConnectionString || !azureStorageContainerName || !azureCosmosConnectionString || !azureCosmosDatabaseName || !azureCosmosContainerName) {
    console.error('Missing required environment variables')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  try {
    // Upload to Azure Blob Storage
    const blobServiceClient = BlobServiceClient.fromConnectionString(azureStorageConnectionString)
    const containerClient = blobServiceClient.getContainerClient(azureStorageContainerName)
    await containerClient.createIfNotExists()
    const blobClient = containerClient.getBlockBlobClient(file.name)

    const arrayBuffer = await file.arrayBuffer()
    await blobClient.uploadData(arrayBuffer)

    // Save metadata to Azure Cosmos DB
    const cosmosClient = new CosmosClient(azureCosmosConnectionString)
    
    // Create database if it doesn't exist
    const { database } = await cosmosClient.databases.createIfNotExists({ id: azureCosmosDatabaseName })
    console.log(`Database ${azureCosmosDatabaseName} created or already exists`)

    // Create container if it doesn't exist
    const { container } = await database.containers.createIfNotExists({ id: azureCosmosContainerName })
    console.log(`Container ${azureCosmosContainerName} created or already exists`)

    await container.items.create({
      id: new Date().getTime().toString(),
      title,
      description,
      fileName: file.name,
      fileUrl: blobClient.url,
      uploadDate: new Date().toISOString()
    })

    return NextResponse.json({ message: 'File uploaded successfully' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 })
  }
}

