import { Text } from 'react-native';

interface MVErrorLabelProps {
    error: string;
}

export default function MVErrorLabel({ error }: MVErrorLabelProps ) {
    return <Text style={{ color: 'red', paddingVertical: 10 }}>{error}</Text>;
}