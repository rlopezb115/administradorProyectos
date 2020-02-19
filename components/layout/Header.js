import React, {useContext} from 'react';
import Buscar from '../ui/Buscar';
import Navegacion from './Navegacion';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Link from 'next/link';
import Boton from '../ui/Boton';
import { FirebaseContext } from '../../firabase';

const ContenerHeader = styled.div`
    max-width: 1200px;
    width: 95%;
    margin: 0 auto;

    @media (min-width: 768px){
        display: flex;
        justify-content: space-between;
    }
`;

const Logo = styled.p`
    color: var(--naranja);
    font-size: 4rem;
    line-height: 0;
    font-weight: 700;
    font-family: 'Roboto Slab', serif;
    margin-right: 2rem;
`;

const Header = () => {

    const {usuario, firebase} = useContext(FirebaseContext);

    return (
        <header
            css={css`
                border-bottom: 2px solid var(--gris3);
                padding: 1rem 0;
            `}
        >
            <ContenerHeader>
                <div css={css`
                    display: flex;
                    align-items: center;
                `}>
                    <Link href="/">
                        <Logo>MVS Televisión</Logo>
                    </Link>

                    <Buscar />
                    <Navegacion />
                </div>
                <div css={css`
                    display: flex;
                    align-items: center;
                `}>
                    {
                        usuario 
                        ?
                        <>
                            <p css={css`
                                margin-right: 2rem;
                            `}>Hola: {usuario.displayName}</p>
                            <Link href="/">
                                <Boton 
                                    bgColor="true"
                                    onClick={ () => firebase.cerrarSesion() }
                                >Cerrar Sesion</Boton>
                            </Link>
                        </>
                        :
                        <>
                            <Link href="/login">
                                <Boton
                                    bgColor="true"
                                >Login</Boton>
                            </Link>
                            <Link href="/crear-cuenta">
                                <Boton>Crear Cuenta</Boton>
                            </Link>
                        </>
                    }
                </div>
            </ContenerHeader>
        </header>
    );
}
 
export default Header;