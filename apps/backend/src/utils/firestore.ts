import { getFirestore } from "./firebase";

export function getQuestCollection() {
  const firestore = getFirestore();
  return firestore.collection("quest");
}

export function getLogCollection() {
  const firestore = getFirestore();
  return firestore.collection("log");
}
