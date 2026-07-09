import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORES } from '../utils/constants';

export default function InputField({
  label,
  value,
  onChangeText,
  error,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  editable = true,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          error && styles.inputError,
          !editable && styles.inputDisabled,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A0AEC0"
        keyboardType={keyboardType}
        multiline={multiline}
        editable={editable}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORES.texto,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORES.borde,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORES.texto,
    backgroundColor: COLORES.tarjeta,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: COLORES.peligro,
  },
  inputDisabled: {
    backgroundColor: '#F1F3F5',
    color: COLORES.textoSecundario,
  },
  errorText: {
    color: COLORES.peligro,
    fontSize: 12,
    marginTop: 4,
  },
});
