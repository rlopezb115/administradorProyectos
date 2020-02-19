import React, {useEffect, useContext, useState} from 'react';
import {useRouter} from 'next/router';
import {FirebaseContext} from '../../firabase';
import NotFound from '../../components/layout/404';
import Layout from '../../components/layout/Layout';
import {css} from '@emotion/core';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import {es} from 'date-fns/locale';
import {Campo, InputSubmit} from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';

const ContenedorProducto = styled.div`
    @media (min-width: 768px)
    {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #FFF;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;

const Producto = () => {
    const router = useRouter();
    const {query: {id}} = router;

    const [error, setError] = useState(false);
    const [producto, guardarProducto] = useState({});
    const [comentario, guardarComentario] = useState({});
    const {firebase, usuario} = useContext(FirebaseContext);

    useEffect(() => {

        if (id)
        {
            const obtenerProducto = async () => {
                const query = await firebase.db.collection('productos').doc(id);
                const data = await query.get();
                if (data.exists)
                {
                    setError(false);
                    guardarProducto(data.data());
                }
                else
                {
                    setError(true);
                }
            };
            
            obtenerProducto();
        }

    }, [id, producto]);

    if (Object.keys(producto).length === 0) return 'Cargando...';

    const { comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos, creador, haVotado} = producto;
    const votarProducto = () => {
        // Si no esta autenticado, no podra votar
        if (!usuario)
        {
            return router.push('/login');
        }

        if (haVotado.includes(usuario.uid)) return;
        const hanVotado = [...haVotado, usuario.uid];

        const totalVotos = votos + 1;
        firebase.db.collection('productos').doc(id).update({
            votos: totalVotos,
            haVotado: hanVotado
        });

        // Actualizar el state
        guardarProducto({
            ...producto,
            votos: totalVotos
        });
    };

    const comentarioChange = e =>
    {
        guardarComentario({
            ...comentario,
            [e.target.name]: e.target.value
        });
    };

    const agregarComentario = e =>
    {
        e.preventDefault();
        if (!usuario) return router.push('/login');
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;
        const nuevosComentarios = [...comentarios, comentario];

        firebase.db.collection('productos').doc(id).update({
            comentarios: nuevosComentarios
        });

        guardarProducto({
            ...producto,
            comentarios: nuevosComentarios
        });
    }

    const esCreador = id =>
    {
        let resultado = false;
        if (creador.id === id) resultado = true;
        return resultado;
    };

    const isAutenticado = () =>
    {
        let resultado = false;
        if (usuario) resultado = true;
        return resultado;
    }

    const permisoBorrar = () => 
    {
        if (!isAutenticado()) return false;
        if (!esCreador(usuario.uid)) return false;
        return true;
    };

    const eliminarProducto = async() =>
    {
        if (!permisoBorrar()) return router.push('/');

        try
        {
            await firebase.db.collection('productos').doc(id).delete();
            router.push('/');
        }
        catch(error)
        {
            console.log(error);
        }
    };

    return (
        <Layout>
            <>
                {error && <NotFound />}
                <div className="contenedor">
                    <h1 css={css`
                        text-align: center;
                        margin-top: 5rem;
                    `}
                    >{nombre}</h1>

                    <ContenedorProducto>
                        <div>
                            <p>
                                Publicado Hace: {formatDistanceToNow(new Date(creado), {locale: es})}
                            </p>
                            <p>Por: {creador.nombre} de {empresa}</p>
                            <img src={urlimagen} />
                            <p>{descripcion}</p>
                            
                            {
                                usuario && (
                                    <>
                                        <h2>Agrega tu comentario</h2>
                                        <form
                                            onSubmit={agregarComentario}
                                        >
                                            <Campo>
                                                <input 
                                                    type="text"
                                                    name="mensaje"
                                                    onChange={comentarioChange}
                                                />
                                            </Campo>
                                            <InputSubmit 
                                                type="submit"
                                                value="Agregar Comentario"
                                            />
                                        </form>
                                    </>
                                )
                            }
                            
                            <h2 css={css`
                                margin: 2rem 0;
                            `}>Comentarios</h2>
                            {
                                comentarios.length === 0 
                                ? <p>Aún no hay comentarios</p>
                                : (
                                    <ul>
                                        {comentarios.map((comentario, i) => (
                                            <li
                                                key={`${comentario.usuarioId}-${i}`}
                                                css={css`
                                                    border: 1px solid #E1E1E1;
                                                    padding: 2rem;
                                                `}
                                            >
                                                <p>{comentario.mensaje}</p>
                                                <p>Escrito por:  
                                                    <span
                                                        css={css`
                                                            font-weight: bold;
                                                        `}
                                                    > {comentario.usuarioNombre}</span>
                                                </p>
                                                {
                                                    esCreador(comentario.usuarioId) &&  <CreadorProducto>Es Creador</CreadorProducto>
                                                }
                                            </li>
                                        ))}
                                    </ul>
                                )
                            }
                        </div>
                        <aside>
                            <Boton
                                target="_blank"
                                bgColor="true"
                                href={url}
                            >Visitar URL</Boton>
                            <div css={css`
                                margin-top:
                            `}>
                                <p css={css`
                                    text-align: center;
                                `}>{votos} Votos</p>
                                {
                                    usuario && (
                                        <Boton 
                                            css={css`
                                                color: #FFF;
                                                background-color: #28A745;
                                                border-color: #28A745;
                                                border-radius: .25rem;
                                                transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
                                            `}
                                            onClick={votarProducto}
                                        >
                                            Votar
                                        </Boton>
                                    )
                                }
                                {
                                    permisoBorrar() && (
                                        <Boton
                                            onClick={eliminarProducto}
                                        >Eliminar Producto</Boton>
                                    )
                                }
                            </div>
                        </aside>
                    </ContenedorProducto>
                </div>
            </>
        </Layout>
    );
}
 
export default Producto;