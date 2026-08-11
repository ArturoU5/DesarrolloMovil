import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORES } from '../../shared/constants';

interface ConfirmDialogProps {
  visible: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
}

export default function ConfirmDialog({
  visible,
  title = '¿Estás seguro?',
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Eliminar',
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.btnCancel} onPress={onCancel}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnConfirm} onPress={onConfirm}>
              <Text style={styles.btnConfirmText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: COLORES.tarjeta,
    borderRadius: 14,
    padding: 20,
    width: '100%',
  },
  title: { fontSize: 16, fontWeight: '700', color: COLORES.texto, marginBottom: 8 },
  message: { fontSize: 14, color: COLORES.textoSecundario, marginBottom: 20 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  btnCancel: { paddingVertical: 10, paddingHorizontal: 14, marginRight: 8 },
  btnCancelText: { color: COLORES.textoSecundario, fontWeight: '600' },
  btnConfirm: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: COLORES.peligro,
    borderRadius: 8,
  },
  btnConfirmText: { color: '#fff', fontWeight: '700' },
});
