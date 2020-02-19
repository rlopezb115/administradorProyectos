export default function validarCrearCuenta(valores)
{
    let errores = {};

    if (!valores.nombre)
    {
        errores.nombre = "El campo nombre es un campo obligatorio.";
    }

    if (!valores.email)
    {
        errores.email = "El campo email es un campo obligatorio.";
    }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email))
    {
        errores.mail = "Email no valido.";
    }

    if (!valores.password)
    {
        errores.password = "El campo password es un campo obligatorio.";
    }
    else if (valores.password.length < 6)
    {
        errores.password = 'El password debe ser de almenos 6 caracteres.';
    }

    return errores;
}