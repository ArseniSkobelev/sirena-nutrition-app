import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useFonts } from "expo-font";

export default function App() {
  const [loaded] = useFonts({
    RalewayBold: require("./assets/fonts/Raleway-Bold.ttf"),
    RalewayMedium: require("./assets/fonts/Raleway-Medium.ttf"),
  });

  const navigateToLogin = () => {};

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("./assets/welcome-bg.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <Text style={styles.header}>Nutrition & Diet</Text>
        <Text style={styles.paragraph}>
          Let’s take care of your diet together! Join us today!
        </Text>
        <TouchableOpacity onPress={navigateToLogin} style={styles.mainButton}>
          <Text style={styles.mainButtonText}>Get started</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  header: {
    fontFamily: "RalewayBold",
    color: "#F4F6F6",
    fontSize: 42,
    marginBottom: 8,
  },
  paragraph: {
    fontFamily: "RalewayMedium",
    color: "#F4F6F6",
    fontSize: 22,
    textAlign: "center",
    width: "80%",
    marginBottom: 48,
  },
  mainButton: {
    backgroundColor: "#F4F6F6",
    borderRadius: 10,
    paddingTop: 15,
    paddingLeft: 35,
    paddingBottom: 15,
    paddingRight: 35,
  },
  mainButtonText: {
    fontFamily: "RalewayMedium",
    fontSize: 26,
    color: "#12452C",
  },
});
