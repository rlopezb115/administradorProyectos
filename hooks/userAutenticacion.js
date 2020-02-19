import React, {useEffect, useState} from 'react';
import firebase from '../firabase';

function userAutenticacion()
{
    const[usuarioAutenticado, setUsuarioAutenticado] = useState(null);

    useEffect(() => {
        // revisar si hay un usuario autenticado
        const unsuscribe = firebase.auth.onAuthStateChanged(usuario => 
        {
            if (usuario)
            {
                // el usuario esta autenticado
                setUsuarioAutenticado(usuario);
            }
            else
            {
                // el usuario no esta autenticado
                setUsuarioAutenticado(null);
            }
        });

        return () => unsuscribe();
    }, []);

    return usuarioAutenticado;
}

export default userAutenticacion;