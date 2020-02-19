import React, {useState, useContext, Children} from 'react';
import Layout from '../components/layout/Layout';
import Router, {useRouter} from 'next/router';
import FileUploader from 'react-firebase-file-uploader';
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';
import {css} from '@emotion/core';

import {FirebaseContext} from '../firabase';

import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';

const STATE_INICIAL = {
    nombre: '',
    empresa: '',
    url: '',
    descripcion: ''
};

const NuevoProducto = () => {

    const [nombreImagen, guardarNombre] = useState('');
    const [subiendo, guardarSubiendo] = useState(false);
    const [progreso, guardarProgreso]= useState(0);
    const [urlimagen, guardarUrlImagen] = useState('');

    const [error, setError] = useState(false);
    const {valores, errores, submitForm, handleChange, handleSubmit, handleBlur} = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);
    const {nombre, empresa, url, descripcion} = valores;
    const router = useRouter();
    const {usuario, firebase} = useContext(FirebaseContext);

    async function crearProducto()
    {
        try{
            if (!usuario) return router.push('/login');
            console.log('Inicio del registro del producto')
            firebase.db.collection('productos').add({
                nombre,
                empresa,
                url,
                urlimagen,
                descripcion,
                votos: 0,
                comentarios: [],
                creado: Date.now(),
                creador: {
                    id: usuario.uid,
                    nombre: usuario.displayName
                },
                haVotado: []
            });
            return router.push('/');
        }
        catch(exc)
        {
            setError(exc.message);
            console.error('Error al crear el producto.');
            console.error(exc);
        }
    }

    const handleUploadStart = () => {
        guardarProgreso(0);
        guardarSubiendo(true);
    };

    const handleProgress = progreso => guardarProgreso({progreso});

    const handleUploadError = error =>
    {
        guardarSubiendo(error);
        console.error(error);
    };

    const handleUploadSuccess = nombre =>
    {
        guardarProgreso(100);
        guardarSubiendo(false);
        guardarNombre(nombre);
        firebase.storage
                .ref("productos")
                .child(nombre)
                .getDownloadURL()
                .then(url => {
                    console.log('URL del producto: ');
                    console.log(url)
                    guardarUrlImagen(url);
                });
    };

    return (
        <div>
            <Layout>
                <h2
                    css={css`
                        text-align: center;
                        margin-top: 5rem;
                    `}
                >Registrar Producto</h2>
                <Formulario
                    onSubmit={handleSubmit}
                >
                    <fieldset>
                        <legend>Información General</legend>
                        <Campo>
                            <label htmlFor="nombre">Nombre: </label>
                            <input 
                                type="text"
                                id="nombre"
                                name="nombre"
                                placeholder="Nombre del producto"
                                value={nombre}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {errores.nombre && <Error>{errores.nombre}</Error>}
                        <Campo>
                            <label htmlFor="empresa">Empresa: </label>
                            <input 
                                type="text"
                                id="empresa"
                                name="empresa"
                                placeholder="Nombre de empresa"
                                value={empresa}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {errores.empresa && <Error>{errores.empresa}</Error>}
                        <Campo>
                            <label htmlFor="url">URL: </label>
                            <input 
                                type="url"
                                id="url"
                                name="url"
                                placeholder="URL del producto"
                                value={url}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {errores.url && <Error>{errores.url}</Error>}
                        <Campo>
                            <label htmlFor="imagen">Imagen: </label>
                            <FileUploader 
                                accept="image/*"
                                id="imagen"
                                name="imagen"
                                randomizeFilename
                                storageRef={firebase.storage.ref("productos")}
                                onUploadStart={handleUploadStart}
                                onUploadError={handleUploadError}
                                onUploadSuccess={handleUploadSuccess}
                                onProgress={handleProgress}
                            />
                        </Campo>
                    </fieldset>
                    <fieldset>
                        <legend>Sobre tu Producto</legend>
                        <Campo>
                            <label htmlFor="descrcipcion">Descripción: </label>
                            <textarea 
                                id="descripcion"
                                name="descripcion"
                                value={descripcion}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {errores.descripcion && <Error>{errores.descripcion}</Error>}
                    </fieldset>
                    
                    {error && <Error>{error}</Error>}
                    <InputSubmit 
                        type="submit"
                        value="Guardar"
                    />
                </Formulario>
            </Layout>
        </div>
    );
};

export default NuevoProducto;