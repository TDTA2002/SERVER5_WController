import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/* Your Config */
const firebaseConfig = {
    apiKey: "AIzaSyD-uPQlOI3t-iF6wGyHYr4ML1KNRmEryB0",
    authDomain: "md5-project-ccd09.firebaseapp.com",
    projectId: "md5-project-ccd09",
    storageBucket: "md5-project-ccd09.appspot.com",
    messagingSenderId: "602291270127",
    appId: "1:602291270127:web:0eee2e5251207e557f461a",
    measurementId: "G-ZXGHVZ7D4P"
};
/* End Config */

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);


export async function uploadFileToStorage(file: any, folderName: any, bufferData: any) {
  


    if (!file) {
        return false
    }

    let fileRef;
    let metadata;
    if (!bufferData) {
        // tên file trên file base
        fileRef = ref(storage, `${folderName}/` + Math.random() * Date.now());

    } else {
        // tên file trên file base
        fileRef = ref(storage, `${folderName}/` + Math.random() * Date.now());
        metadata = {
            contentType: (file as any).mimetype,
        };
    }


    let url;
    if (bufferData) {
        // upload file lên fire storage
        url = await uploadBytes(fileRef, bufferData, metadata).then(async res => {
            // khi up thành công thì tìm URL
            return await getDownloadURL(res.ref)
                .then(url => url)
                .catch(er => false)
        })
    } else {
        // upload file lên fire storage
        url = await uploadBytes(fileRef, file).then(async res => {
            // khi up thành công thì tìm URL
            return await getDownloadURL(res.ref)
                .then(url => url)
                .catch(er => false)
        })
    }


    return url
}