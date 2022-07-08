import Welcome from "./components/Welcome";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { useStateIfMounted } from "use-state-if-mounted";
import Main from "./components/Main";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./components/Login";

const Stack = createNativeStackNavigator();

export default function App() {
  const [keyResult, setKeyResult] = useStateIfMounted(0);

  useEffect(() => {
    let isMounted = true;
    getKey();
    return () => {
      isMounted = false;
    };

    function getKey() {
      // let result = SecureStore.getItemAsync("sessionID");
      // setKeyResult(result);
      if (isMounted) {
        setKeyResult(null);
      } else return;
    }
  }, []);

  if (keyResult === null) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={Main} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
