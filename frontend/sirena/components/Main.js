import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

export default function Main() {
    const [loaded] = useFonts({
        RalewaySemiBold: require("../assets/fonts/Raleway-SemiBold.ttf"),
        RalewayMedium: require("../assets/fonts/Raleway-Medium.ttf"),
    });

    if (!loaded) return <Text>Loading...</Text>;

    return (
        <View style={styles.mainContainer}>
            <View>
                <Text>This is the main screen.</Text>
            </View>
            <StatusBar style="auto" />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})