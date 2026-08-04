import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  type WithFieldValue,
  type DocumentData,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export async function addItem<T extends WithFieldValue<DocumentData>>(
  collectionName: string,
  data: T
) {
  return addDoc(collection(db, collectionName), { ...data, createdAt: Date.now() });
}

export async function updateItem<T extends WithFieldValue<DocumentData>>(
  collectionName: string,
  id: string,
  data: Partial<T>
) {
  return updateDoc(doc(db, collectionName, id), data as WithFieldValue<DocumentData>);
}

export async function deleteItem(collectionName: string, id: string) {
  return deleteDoc(doc(db, collectionName, id));
}

/** Uploads to `${folder}/{timestamp}-{random}-{filename}` and returns the
 * public URL plus the storage path (needed later to delete the file). */
export async function uploadImage(folder: string, file: File) {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return { url, path };
}

export async function deleteImage(path: string) {
  if (!path) return;
  try {
    await deleteObject(ref(storage, path));
  } catch {
    // already deleted or never existed — safe to ignore
  }
}
