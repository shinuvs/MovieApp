import { Stack } from "expo-router";
import { Provider } from 'react-redux';
import { store } from './store/store';

const RootLayout: React.FC = () => {
  return (
    <Provider store={store}>
      <Stack 
        screenOptions={{ 
          headerStyle: { backgroundColor: 'rgba(62, 153, 221, 0.9)' },
          headerBackTitle: "Back",
          headerTintColor: 'white',
          headerTitleStyle: { 
            fontWeight: 'bold',
          },
        }}
      />
    </Provider>
  );
}

export default RootLayout;
