import { db } from './firebase';
import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  where,
} from 'firebase/firestore';

// 🔹 Agregar patente (camión o rampla)
export async function addPatente(companyId: string, data: { patente: string; tipo: 'tracto' | 'rampla' | 'carro'; activo?: boolean }) {
  const colRef = collection(db, 'companies', companyId, 'trucks');
  await addDoc(colRef, {
    ...data,
    activo: data.activo ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

// 🔹 Listar todas las patentes
export async function getPatentes(companyId: string) {
  const colRef = collection(db, 'companies', companyId, 'trucks');
  const q = query(colRef, orderBy('patente'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// 🔹 Buscar patente por texto
export async function searchPatente(companyId: string, term: string) {
  const colRef = collection(db, 'companies', companyId, 'trucks');
  const q = query(colRef, where('activo', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((t: any) => t.patente.toLowerCase().includes(term.toLowerCase()));
}
