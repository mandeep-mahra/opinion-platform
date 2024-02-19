import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {doc, getFirestore, increment, updateDoc} from "firebase/firestore";
import { setDoc, getDocs, getDoc, addDoc, collection } from "firebase/firestore"; 
import { uploadBytes, getStorage, ref, getDownloadURL } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyABbxjbrTL29Lay2y8sf3QMV3lzNOe_89k",
  authDomain: "voteauth-ad8a9.firebaseapp.com",
  projectId: "voteauth-ad8a9",
  storageBucket: "voteauth-ad8a9.appspot.com",
  messagingSenderId: "911932926339",
  appId: "1:911932926339:web:3c8d315bf5edb49ca02eb6",
  measurementId: "G-G4KZFMM6CS"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

async function uploadPayload(data) {
  const db = getFirestore(app);
  addDoc(collection(db, "postDataAllUsers"), data, {merge : true});
}

async function downloadData(){
  const db = getFirestore(app);
  const querySnapshot = await getDocs(collection(db, "postDataAllUsers"));
  return (new Promise ((res, rej) => {
    res (querySnapshot);
    rej ("Error");
  })) 
}

async function updateData(id, email, option){
  const db = getFirestore(app);
  const docRef = doc(db, "postDataAllUsers", id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  if(email in data.votes){
    const old = data.votes[email];
    if(old !== option){
      await updateDoc(docRef, {
        votes : {[email] : option} ,
        [old] : increment(-1),
        [option] : increment(1),
    });
    }
  }
    
  else{
    await updateDoc(docRef, {
      votes : {[email] : option},
      [option] : increment(1),
    });
  }
  
}

async function getVoteCount(id, option){
  const db = getFirestore(app);
  const docRef = doc(db, "postDataAllUsers", id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  if(data[option] !== undefined)
    return data[option];
  return 0;
}

async function uploadUserImage(image){
  const storage = getStorage();
  const storageRef = ref(storage, image.name);
  await uploadBytes(storageRef, image)
  const res = await getDownloadURL(storageRef);
  return res;
}

async function votedFor(id, email){
  const db = getFirestore(app);
  const docRef = doc(db, "postDataAllUsers", id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  if(email in data.votes){
    const old = data.votes[email];
    return old;
  }
    
  else{
    return "";
  }
  
}

//update("79PgfMpXOxk8lsgtj7yp", 4);

export { 
  votedFor,
  uploadUserImage, 
  getVoteCount, 
  uploadPayload, 
  downloadData, 
  updateData
};
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);