import React, {useEffect, useState} from 'react';
import Layout from '../components/layout/Layout';
import  {useRouter} from 'next/router';
import DetallesProducto from '../components/layout/DetallesProducto';
import useProductos from '../hooks/useProductos';

const Buscar = () => {
    
    const [resultados, guardarResultados] = useState([]);
    const router = useRouter();
    const { query: {q} } = router;
    const { productos } = useProductos('creado');
    console.log(q);

    useEffect(() => {
        if (!q) return;
        const busqueda = q.toLowerCase();
        const filtro = productos.filter(producto => {
            return (
                producto.nombre.toLowerCase().includes(busqueda) ||
                producto.descripcion.toLowerCase().includes(busqueda)
            );
        });
        guardarResultados(filtro)
    }, [q, productos]);

    return (
        <div>
            <Layout>
                <h2>Pagina Principal</h2>
                <div className="listado-productos">
                    <div className="contenedor">
                        <ul className="bg-white">
                            {
                                resultados.map(producto => (
                                    <DetallesProducto 
                                        key={producto.id}
                                        producto={producto}
                                    />
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </Layout>
        </div>
    );
}

export default Buscar;