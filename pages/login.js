import React, {useState} from 'react';
import Layout from '../components/layout/Layout';
import Router from 'next/router';
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';
import {css} from '@emotion/core';

import firebase from '../firabase';

import useValidacion from '../hooks/useValidacion';
import validarIniciarSesión from '../validacion/validarIniciarSesion';

const STATE_INICIAL = {
    email: '',
    password: ''
};

const Login = () => {

    const [error, setError] = useState(false);
    const {valores, errores, submitForm, handleChange, handleSubmit, handleBlur} = useValidacion(STATE_INICIAL, validarIniciarSesión, iniciarSesion);
    const {email, password} = valores;

    async function iniciarSesion()
    {
        try
        {
            await firebase.login(email, password);
            Router.push('/');
        }
        catch(exc)
        {
            setError(`Error al autenticar el usuario, ${exc.message}`);
            console.error(`Error al autenticar el usuario, ${exc.message}`);
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
                >Iniciar Sesión</h2>
                <Formulario
                    onSubmit={handleSubmit}
                >
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
                        value="Iniciar Sesión"
                    />
                </Formulario>
            </Layout>
        </div>
    );
};

export default Login;