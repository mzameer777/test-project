/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  env: {
    AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING,
    AZURE_STORAGE_CONTAINER_NAME: process.env.AZURE_STORAGE_CONTAINER_NAME,
    AZURE_COSMOS_CONNECTION_STRING: process.env.AZURE_COSMOS_CONNECTION_STRING,
    AZURE_COSMOS_DATABASE_NAME: process.env.AZURE_COSMOS_DATABASE_NAME,
    AZURE_COSMOS_CONTAINER_NAME: process.env.AZURE_COSMOS_CONTAINER_NAME,
  },
}

module.exports = nextConfig