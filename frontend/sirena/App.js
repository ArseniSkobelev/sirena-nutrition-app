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

  let isNull = null;

  useEffect(() => {
    let isMounted = true;
    let keyValue = getKey();
    console.log(keyValue);
    if (isMounted) {
      setKeyResult(keyValue);
    }

    function getKey() {
      // let result = SecureStore.getItemAsync("sessionID");
      let result = null;
      return result;
    }

    return () => {
      isMounted = false;
    };
  }, []);

  if (isNull === null) {
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
