import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChipProps {
  label: string;
  color: string;
  bg: string;
}

export default function Chip({ label, color, bg }: ChipProps) {
  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
