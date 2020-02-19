import firebase, {FirebaseContext} from '../firabase';
import userAutenticacion from '../hooks/userAutenticacion';

const MyApp = ({Component, pageProps}) => 
{
    const usuario = userAutenticacion();

    return (
        <FirebaseContext.Provider
            value={{
                firebase,
                usuario
            }}
        >
            <Component {...pageProps} />
        </FirebaseContext.Provider>
    );
}
 
export default MyApp;