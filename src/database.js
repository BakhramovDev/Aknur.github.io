import { getDatabase, ref, push, set, onChildAdded } from "firebase/database";

const db = getDatabase();

export { db, ref, push, set, onChildAdded };
