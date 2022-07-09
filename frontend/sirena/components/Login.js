import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useStateIfMounted } from 'use-state-if-mounted';

export default function Login() {
    const [email, setEmail] = useStateIfMounted("");
    const [password, setPassword] = useStateIfMounted("");

    const [loaded] = useFonts({
        RalewaySemiBold: require("../assets/fonts/Raleway-SemiBold.ttf"),
        RalewayMedium: require("../assets/fonts/Raleway-Medium.ttf"),
    });

    if (!loaded) return <Text>Loading...</Text>;

    const handleLogin = () => {

    }

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={require('../assets/login.png')} />
            </View>
            <View style={styles.loginHeader}>
                <Text style={{fontFamily: 'RalewaySemiBold', fontSize: 42}}>
                    Login
                </Text>
            </View>
            <View>
                <View style={styles.inputBox}>
                    <Image style={styles.inputIco} source={require('../assets/ico/Vector.png')} />
                    <View style={{flexDirection: "column", width: "100%", marginBottom: 48}}>
                        <TextInput onChangeText={newEmail => setEmail(newEmail)} textContentType='emailAddress' placeholder='Email' style={{fontFamily: 'RalewaySemiBold', fontSize: 24, marginBottom: 8, color: "#C0C0C0", width: "80%"}} />
                        <View style={styles.separator} />
                        <Text>{ email }</Text>
                    </View>
                </View>
                <View style={styles.inputBox}>
                    <Image style={styles.inputIco} source={require('../assets/ico/dashicons_lock.png')} />
                    <View style={{flexDirection: "column", width: "100%"}}>
                        <TextInput onChangeText={newPassword => setPassword(newPassword)} secureTextEntry={true} textContentType='password' placeholder='Password' style={{fontFamily: 'RalewaySemiBold', fontSize: 24, marginBottom: 8, color: "#C0C0C0", width: "80%"}} />
                        <View style={styles.separator} />
                        <Text>{ password }</Text>
                    </View>
                </View>
            </View>
            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButton}>Login</Text>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 36, marginBottom: 36}}>
                <View style={styles.separatorTwo} />
                <Text style={{color: "#C0C0C0", paddingHorizontal: 8, fontFamily: "RalewaySemiBold", fontSize: 18}}>OR</Text>
                <View style={styles.separatorTwo} />
            </View>
            <View>
                <TouchableOpacity style={styles.signupRedirect}>
                    <Text style={styles.signupRedirect}>Click here to create a new account</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30
    },
    imageContainer: {
        flex: 0,
        padding: 30,
        width: '100%',
        height: 'auto',
        marginBottom: 32
    },
    image: {
        width: '100%',
        height: undefined,
        aspectRatio: 1.25,
        padding: 0,
        margin: 0
    },
    loginHeader: {
        marginBottom: 48
    },
    inputs: {
    },
    inputIco: {
        width: 26,
        height: 26,
        marginRight: 10
    },
    inputBox: {
        flexDirection: 'row',
        width: "100%",
        alignContent: 'center',
        color: "#C0C0C0"
    },
    separator: {
        height: 2,
        backgroundColor: "#C0C0C0",
        width: "80%"
    },
    separatorTwo: {
        height: 2,
        backgroundColor: "#C0C0C0",
        width: "40%"
    },
    btnContainer: {
        alignItems: "center",
        marginTop: 48
    },
    loginButton: {
        backgroundColor: "#37715B",
        borderRadius: 10,
        paddingTop: 10,
        paddingLeft: 35,
        paddingBottom: 10,
        paddingRight: 35,
        color: "#F4F6F6",
        fontFamily: "RalewayMedium",
        fontSize: 26,
    },
    signupRedirect: {
        color: "#37715B",
        fontFamily: "RalewayMedium",
        fontSize: 18,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
