import React from "react";
import { Pressable, Text, ViewStyle, TextStyle } from "react-native";

export enum ButtonStyleType {
    Primary = "primary",
    Secondary = "secondary",
    Danger = "danger",
    Success = "success",
}

// Props interface for the MVAppButton component
export interface MVAppButtonProps {
    text: string;
    styleType: ButtonStyleType;
    onPress: () => void;
}


const buttonStyle = (styleType: ButtonStyleType): ViewStyle => {
    switch (styleType) {
        case ButtonStyleType.Primary:
            return {
                backgroundColor: "rgba(62, 153, 221, 0.8)",
                borderRadius: 5,
                padding: 10,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
            };
        case ButtonStyleType.Secondary:
            return {
                backgroundColor: "#fff",
                borderColor: "#4F8EF7",
                borderWidth: 2,
                borderRadius: 5,
                padding: 10,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
            };
        case ButtonStyleType.Danger:
            return {
                backgroundColor: "#f00",
                borderColor: "#f00",
                borderWidth: 2,
                borderRadius: 5,
                padding: 10,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
            };
        case ButtonStyleType.Success:
            return {
                backgroundColor: "#0f0",
                borderColor: "#0f0",
                borderWidth: 2,
                borderRadius: 5,
                padding: 10,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
            };
        default:
            return {};
    }
};

const MVAppButton: React.FC<MVAppButtonProps> = ({ text, styleType, onPress }) => {
    const styles = buttonStyle(styleType);

    return (
        <Pressable style={styles} onPress={onPress}>
            <Text style={buttonTextStyles(styleType)}>{text}</Text>
        </Pressable>
    );
};

// Function to set text style based on the button type
const buttonTextStyles = (styleType: ButtonStyleType): TextStyle => {
    switch (styleType) {
        case ButtonStyleType.Primary:
        case ButtonStyleType.Danger:
        case ButtonStyleType.Success:
            return { color: "#fff", fontSize: 16, textAlign: "center" }; 
        case ButtonStyleType.Secondary:
            return { color: "#4F8EF7", fontSize: 16, textAlign: "center" }; 
        default:
            return { color: "#000", fontSize: 16, textAlign: "center" }; 
    }
};

export default MVAppButton;
