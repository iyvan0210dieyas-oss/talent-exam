import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  writeBatch,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Submission } from './types';

const SUBMISSIONS_COLLECTION = 'submissions';

/**
 * Adds a new student submission to Firestore.
 * Returns the Firestore document ID on success.
 */
export async function addSubmission(submission: Submission): Promise<string> {
  const docRef = await addDoc(collection(db, SUBMISSIONS_COLLECTION), submission);
  return docRef.id;
}

/**
 * Subscribes to real-time updates of all submissions (sorted newest first).
 * Calls `callback` immediately with current data, then on every change.
 * Returns an unsubscribe function.
 */
export function subscribeToSubmissions(callback: (submissions: Submission[]) => void): () => void {
  const q = query(collection(db, SUBMISSIONS_COLLECTION), orderBy('timestamp', 'desc'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const submissions: Submission[] = snapshot.docs.map((docSnap) => ({
      ...(docSnap.data() as Omit<Submission, 'id'>),
      id: docSnap.id,
    }));
    callback(submissions);
  });
  return unsubscribe;
}

/**
 * Deletes all submission documents from Firestore.
 */
export async function clearAllSubmissions(): Promise<void> {
  const snapshot = await getDocs(collection(db, SUBMISSIONS_COLLECTION));
  const batch = writeBatch(db);
  snapshot.docs.forEach((docSnap) => {
    batch.delete(doc(db, SUBMISSIONS_COLLECTION, docSnap.id));
  });
  await batch.commit();
}

/**
 * Deletes a single submission by its Firestore document ID.
 */
export async function deleteSubmission(submissionId: string): Promise<void> {
  await deleteDoc(doc(db, SUBMISSIONS_COLLECTION, submissionId));
}
