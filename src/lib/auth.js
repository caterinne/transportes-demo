import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

export async function changeUserPassword(currentPassword, newPassword) {
  const user = auth.currentUser;

  if (!user) throw new Error("No hay usuario autenticado");

  // Reautenticación
  const cred = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, cred);

  // Cambio de contraseña
  await updatePassword(user, newPassword);

  return true;
}


export async function registerUser(email, password, companyId, nombre, role = "user") {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const user = res.user;

  await setDoc(doc(db, "profiles", user.uid), {
    uid: user.uid,
    email,
    nombre,
    companyId,
    role,
    createdAt: new Date(),
  });

  return user;
}


export async function loginUser(email, password) {
  const res = await signInWithEmailAndPassword(auth, email, password);
  const user = res.user;
  try {
    await updateDoc(doc(db, "profiles", user.uid), {
      lastLogin: serverTimestamp(),
    });
  } catch (err) {
    console.error("Error guardando último acceso:", err);
  }

  return user;
}

export async function logoutUser() {
  await signOut(auth);
}

export function listenAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "profiles", uid));
  return snap.exists() ? snap.data() : null;
}
