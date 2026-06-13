import * as admin from 'firebase-admin';
import { getResourcePath } from '../../utils/paths';

class FirebaseLoggerService {
  private db: admin.firestore.Firestore | null = null;

  constructor() {
    try {
      const serviceAccountPath = getResourcePath('firebase-credentials.json');
      const serviceAccount = require(serviceAccountPath);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      this.db = admin.firestore();
      console.log('[Firebase] Logger service initialized successfully.');
    } catch (error) {
      console.error('[Firebase] Failed to initialize logger service:', error);
      // The service will not log if initialization fails.
    }
  }

  public log(logData: Omit<any, 'timestamp'>) {
    if (!this.db) {
      // Silently fail if the DB is not initialized.
      return;
    }

    const logWithTimestamp = {
      ...logData,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    this.db
      .collection('logs')
      .add(logWithTimestamp)
      .catch((error) => {
        console.error('[Firebase] Error writing log to Firestore:', error);
      });
  }
}

export const firebaseLoggerService = new FirebaseLoggerService();
