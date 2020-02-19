import React, { useState, useEffect, useContext } from 'react';
import {FirebaseContext} from '../firabase';

const useProductos = columnOrder => {

    const [productos, guardarProductos] = useState([]);
    const {firebase} = useContext(FirebaseContext);

    useEffect(() => {
        const obtenerProductos = () => {
            firebase.db.collection('productos').orderBy(columnOrder, 'desc').onSnapshot(manejarSnapshot);
        }

        obtenerProductos();
    }, [])

    function manejarSnapshot(snapshot)
    {
        const productos = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            };
        });

        guardarProductos(productos);
    }

    return {
        productos
    };
};

export default useProductos;