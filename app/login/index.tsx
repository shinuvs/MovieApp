import React, { useState } from 'react';
import { useRouter, useNavigation } from "expo-router";
import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import MVTextInput from "../components/MVTextInput";
import MVAppButton, { ButtonStyleType } from "../components/MVAppButton";
import MVErrorLabel from '../components/MVErrorLabel';
import { MESSAGES } from '../constants/strings';

export default function LoginScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
  
    useEffect(() => {
      navigation.setOptions({
        headerShown: false,
      });
    }, []);

    const hanleLogin = () => {
        if (!email || !password) {
            setError(MESSAGES.LOGIN.FIELDS_REQUIRED);
            return;
        }

        if (email === "admin" && password === "admin") {
            router.push("/movie");
        } else {
            setError(MESSAGES.LOGIN.INVALID_EMAIL_OR_PASSWORD);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.loginView}> 
                <MVTextInput onChangeText={(text) => setEmail(text)} value={email} placeholder={MESSAGES.LOGIN.EMAIL}/>
                <MVTextInput onChangeText={(text) => setPassword(text)} value={password} placeholder={MESSAGES.LOGIN.PASSWORD} secureTextEntry={true}/>
                <MVAppButton onPress={hanleLogin} text={MESSAGES.LOGIN.LOGIN_BUTTON} styleType={ButtonStyleType.Primary} />

                <View style={styles.errorView}>
                    {error ? <MVErrorLabel error={error} /> : null}
                </View>
                
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loginView: {
        width: 300,
        height: 150,
    },
    errorView: {
        width: 300,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
