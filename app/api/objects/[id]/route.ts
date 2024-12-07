import { CosmosClient } from '@azure/cosmos'
import { BlobServiceClient } from '@azure/storage-blob'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    // Delete from Cosmos DB
    const cosmosClient = new CosmosClient(process.env.AZURE_COSMOS_CONNECTION_STRING!)
    const database = cosmosClient.database(process.env.AZURE_COSMOS_DATABASE_NAME!)
    const container = database.container(process.env.AZURE_COSMOS_CONTAINER_NAME!)

    const { resource: item } = await container.item(id, id).read()
    if (!item) {
      return NextResponse.json({ error: 'Object not found' }, { status: 404 })
    }

    await container.item(id, id).delete()

    // Delete from Blob Storage
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING!)
    const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME!)
    const blobClient = containerClient.getBlobClient(item.fileName)
    await blobClient.delete()

    return NextResponse.json({ message: 'Object deleted successfully' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error deleting object' }, { status: 500 })
  }
}

