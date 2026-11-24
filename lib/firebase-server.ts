import { Storage } from '@google-cloud/storage'
import { Firestore, FieldValue } from '@google-cloud/firestore'
import { OAuth2Client } from 'google-auth-library'
import fs from 'fs'
import path from 'path'
import os from 'os'

export const PROJECT_ID = 'ssk-coaching-website-33ef8'
export const STORAGE_BUCKET = 'ssk-coaching-website-33ef8.firebasestorage.app'
export const FIRESTORE_DATABASE = '(default)'

let storageInstance: Storage | null = null
let firestoreInstance: Firestore | null = null

/**
 * Resolves local OAuth client from Firebase CLI config if running in local dev.
 * In production (Cloud Run / App Hosting), returns null so Google Cloud SDK
 * automatically leverages Application Default Credentials (ADC) from the compute service account.
 */
async function getAuthClient(): Promise<OAuth2Client | null> {
  // If explicitly configured in environment or running on App Hosting / Cloud Run
  if (process.env.K_SERVICE || process.env.FUNCTION_NAME || process.env.FIREBASE_CONFIG) {
    return null
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
    return null
  }

  // Attempt to use local Firebase CLI credentials for development
  try {
    const configPath = path.join(os.homedir(), '.config', 'configstore', 'firebase-tools.json')
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
      if (config.tokens?.refresh_token) {
        try {
          // Dynamically try firebase-tools auth to refresh token
          const authModulePath = 'C:/Users/kkour/AppData/Roaming/npm/node_modules/firebase-tools/lib/auth'
          if (fs.existsSync(authModulePath + '.js')) {
            const dynamicRequire = eval('require')
            const authModule = dynamicRequire(authModulePath)
            const refreshed = await authModule.getAccessToken(config.tokens.refresh_token, [
              'https://www.googleapis.com/auth/cloud-platform',
            ])
            if (refreshed?.access_token) {
              const client = new OAuth2Client()
              client.setCredentials({ access_token: refreshed.access_token })
              return client
            }
          }
        } catch {
          // Fall back to stored access token if present
        }

        if (config.tokens.access_token) {
          const client = new OAuth2Client()
          client.setCredentials({ access_token: config.tokens.access_token })
          return client
        }
      }
    }
  } catch (err) {
    console.warn('[firebase-server] Local credential resolution notice:', err)
  }

  return null
}

/**
 * Returns authenticated Google Cloud Storage instance and default bucket.
 */
export async function getServerStorage(): Promise<{ storage: Storage; bucket: ReturnType<Storage['bucket']> }> {
  if (!storageInstance) {
    const authClient = await getAuthClient()
    const options: ConstructorParameters<typeof Storage>[0] = {
      projectId: PROJECT_ID,
    }
    if (authClient) {
      options.authClient = authClient
    }
    storageInstance = new Storage(options)
  }
  return {
    storage: storageInstance,
    bucket: storageInstance.bucket(STORAGE_BUCKET),
  }
}

/**
 * Returns authenticated Cloud Firestore instance.
 */
export async function getServerFirestore(): Promise<Firestore> {
  if (!firestoreInstance) {
    const authClient = await getAuthClient()
    const options: ConstructorParameters<typeof Firestore>[0] = {
      projectId: PROJECT_ID,
      databaseId: FIRESTORE_DATABASE,
    }
    if (authClient) {
      options.authClient = authClient
    }
    firestoreInstance = new Firestore(options)
  }
  return firestoreInstance
}

export { FieldValue }
