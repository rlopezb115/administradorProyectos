import React, {useState} from 'react';
import Layout from '../components/layout/Layout';
import Router from 'next/router';
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';
import {css} from '@emotion/core';

import firebase from '../firabase';

import useValidacion from '../hooks/useValidacion';
import validarCrearCuenta from '../validacion/validarCrearCuenta';

const STATE_INICIAL = {
    nombre: '',
    email: '',
    password: ''
};

const CrearCuenta = () => {

    const [error, setError] = useState(false);
    const {valores, errores, submitForm, handleChange, handleSubmit, handleBlur} = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);
    const {nombre, email, password} = valores;

    async function crearCuenta()
    {
        try{
            await firebase.registrar(nombre, email, password);
            Router.push('/');
        }
        catch(exc)
        {
            setError(exc.message);
            console.error('Error al crear la cuenta de usuario.');
            console.error(exc);
        }
    }

    return (
        <div>
            <Layout>
                <h2
                    css={css`
                        text-align: center;
                        margin-top: 5rem;
                    `}
                >Crear cuenta de usuario</h2>
                <Formulario
                    onSubmit={handleSubmit}
                >
                    <Campo>
                        <label htmlFor="nomber">Nombre de Usuario: </label>
                        <input 
                            type="text"
                            id="nombre"
                            name="nombre"
                            placeholder="Ingresa tu nombre de usuario"
                            value={nombre}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.nombre && <Error>{errores.nombre}</Error>}
                    <Campo>
                        <label htmlFor="email">Email: </label>
                        <input 
                            type="email"
                            id="email"
                            name="email"
                            placeholder="example@mail.com"
                            value={email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.email && <Error>{errores.email}</Error>}
                    <Campo>
                        <label htmlFor="email">Contraseña: </label>
                        <input 
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Ingresa contraseña"
                            value={password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.password && <Error>{errores.password}</Error>}
                    {error && <Error>{error}</Error>}
                    <InputSubmit 
                        type="submit"
                        value="Crear Cuenta"
                    />
                </Formulario>
            </Layout>
        </div>
    );
};

export default CrearCuenta;