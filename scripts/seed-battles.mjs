// One-time seed for the real "battles" (tattoo competition category) content.
// Run once after connecting a real Firebase project:
//
//   1. Firebase Console → Project settings → Service accounts →
//      Generate new private key. Save the JSON somewhere OUTSIDE the repo.
//   2. GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\key.json" node scripts/seed-battles.mjs
//
// Safe to re-run: it always clears the "battles" collection first, so it
// never creates duplicates.

import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

initializeApp({
  credential: keyPath ? cert(keyPath) : applicationDefault(),
});

const db = getFirestore();

const BATTLES = [
  // Day 1
  { day: 1, groupName: "Healed Tattoo Competition", itemNumber: "1", itemText: "Best Traditional Tattoo" },
  { day: 1, groupName: "Healed Tattoo Competition", itemNumber: "2", itemText: "Best Color Tattoo" },
  { day: 1, groupName: "Healed Tattoo Competition", itemNumber: "3", itemText: "Best Realistic Tattoo" },
  { day: 1, groupName: "Tattoo Battles", itemNumber: "1", itemText: "Best Small Tattoo 10-12cm" },
  { day: 1, groupName: "Tattoo Battles", itemNumber: "2", itemText: "Best Freehand Tattoo +20cm" },
  { day: 1, groupName: "Tattoo Battles", itemNumber: "3", itemText: "Best Black & Grey Tattoo +20cm" },
  // Day 2
  { day: 2, groupName: "Healed Pieces — Healed Tattoo Competition", itemNumber: "1", itemText: "Best Calligraphy Tattoo" },
  { day: 2, groupName: "Healed Pieces — Healed Tattoo Competition", itemNumber: "2", itemText: "Best Black & Grey Tattoo" },
  { day: 2, groupName: "Healed Pieces — Healed Tattoo Competition", itemNumber: "3", itemText: "Best Portrait Tattoo" },
  { day: 2, groupName: "Healed Pieces — Healed Tattoo Competition", itemNumber: "—", itemText: "Best Art" },
  { day: 2, groupName: "Tattoo Battles", itemNumber: "", itemText: "Best Black & Dotwork Tattoo +20cm" },
  { day: 2, groupName: "Tattoo Battles", itemNumber: "", itemText: "Best Color Tattoo +20cm" },
];

async function main() {
  const col = db.collection("battles");

  const existing = await col.get();
  const batchDelete = db.batch();
  existing.docs.forEach((doc) => batchDelete.delete(doc.ref));
  if (!existing.empty) await batchDelete.commit();

  const batchWrite = db.batch();
  BATTLES.forEach((item, order) => {
    const ref = col.doc();
    batchWrite.set(ref, { ...item, order, createdAt: Date.now() });
  });
  await batchWrite.commit();

  console.log(`Seeded ${BATTLES.length} battle categories.`);
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
