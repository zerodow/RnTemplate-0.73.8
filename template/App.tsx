import * as React from 'react';
import {Provider} from 'react-redux';
import {persistor, store} from './src/store';
import {PersistGate} from 'redux-persist/lib/integration/react';
import AppConfigScreen from './src/routes';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppConfigScreen />
      </PersistGate>
    </Provider>
  );
};

export default App;
