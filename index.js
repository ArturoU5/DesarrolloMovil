/**
 * RefreshProClean - Punto de entrada de la aplicación (Expo)
 */
import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent llama a AppRegistry.registerComponent('main', () => App).
// También asegura que la app corra correctamente tanto en Expo Go como en un build nativo.
registerRootComponent(App);
