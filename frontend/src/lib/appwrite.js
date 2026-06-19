import { Client, Account } from 'appwrite'

const client = new Client()

const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'

if (!projectId || projectId === 'your_appwrite_project_id_here') {
  console.warn('Appwrite Project ID is not set. Please configure VITE_APPWRITE_PROJECT_ID in your .env file.')
}

client
  .setEndpoint(endpoint)
  .setProject(projectId || 'placeholder')

export const account = new Account(client)
export { client }
