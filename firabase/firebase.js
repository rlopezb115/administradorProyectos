import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import firebaseConfig from './config';

class Firebase {

    constructor()
    {
        if (!app.apps.length) app.initializeApp(firebaseConfig);
        this.auth = app.auth();
        this.db = app.firestore();
        this.storage = app.storage();
    }

    //Registrar usuario
    async registrar(nombre, email, password)
    {
        const newUser = await this.auth.createUserWithEmailAndPassword(email, password);
        return await newUser.user.updateProfile({
            displayName: nombre
        });
    }

    // Iniciar Sesión
    async login (email, password)
    {
        return await this.auth.signInWithEmailAndPassword(email, password);
    }

    async cerrarSesion ()
    {
        await this.auth.signOut();
    }
}

const firebase = new Firebase();
export default firebase;