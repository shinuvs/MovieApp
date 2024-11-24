import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface MVChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

const MVChip: React.FC<MVChipProps> = ({ label, selected = false, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.chip,
        selected && styles.selectedChip
      ]}
    >
      <Text style={[
        styles.chipText,
        selected && styles.selectedChipText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  selectedChip: {
    backgroundColor: '#007AFF', // or your preferred selection color
  },
  chipText: {
    color: '#333',
  },
  selectedChipText: {
    color: '#fff',
  },
});

export default MVChip;