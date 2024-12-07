import { CosmosClient } from '@azure/cosmos'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cosmosClient = new CosmosClient(process.env.AZURE_COSMOS_CONNECTION_STRING!)
    const database = cosmosClient.database(process.env.AZURE_COSMOS_DATABASE_NAME!)
    const container = database.container(process.env.AZURE_COSMOS_CONTAINER_NAME!)

    const { resources } = await container.items.readAll().fetchAll()

    // Ensure we always return an array
    const objects = Array.isArray(resources) ? resources : []

    return NextResponse.json(objects)
  } catch (error) {
    console.error('Error fetching objects:', error)
    return NextResponse.json({ error: 'Error fetching objects' }, { status: 500 })
  }
}

