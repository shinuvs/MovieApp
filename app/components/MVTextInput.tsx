import { View, TextInput, StyleSheet } from "react-native";

interface MVTextInputProps {
    onChangeText: (text: string) => void;
    placeholder: string;
    value: string;
    secureTextEntry?: boolean;
}

export default function MVTextInput({ onChangeText, value, placeholder, secureTextEntry }: MVTextInputProps) {
    return (
        <View>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                onChangeText={onChangeText}
                value={value}
                secureTextEntry={secureTextEntry}
                accessibilityLabel={placeholder}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 45,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(62, 153, 221, 0.8)",
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});
