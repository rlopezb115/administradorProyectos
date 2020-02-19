export default function validarCrearProducto(valores)
{
    let errores = {};

    if (!valores.nombre) errores.nombre = "El campo nombre es obligatorio.";
    if (!valores.empresa) errores.empresa = "El campo empresa es obligatorio.";
    if (!valores.url) errores.url = "La URL del producto es obligatorio.";
    else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) 
        errores.url = "La URL del producto no es valida, revise el formato.";
    if (!valores.descripcion) errores.descripcion = "El campo descripcion es obligatorio.";

    return errores;
}