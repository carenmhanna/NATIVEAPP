import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ButtonProps {
    text: string;
    onPress: () => void;
    disabled?: boolean;
}

const CustomButton: React.FC<ButtonProps> = ({ text, onPress, disabled = false }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, disabled && styles.disabled]} disabled={disabled}>
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#6B2A88',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: '500',
    },
    disabled: {
        backgroundColor: '#B0A0C3',
    },
});

export default CustomButton;
