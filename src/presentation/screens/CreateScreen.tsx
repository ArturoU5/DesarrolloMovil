import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import InputField from '../components/InputField';
import { useSolicitudes } from '../../infrastructure/context/SolicitudesContext';
import { useAuth } from '../../infrastructure/context/AuthContext';
import { crearSolicitud, PRIORIDADES, Prioridad } from '../../domain/models/Solicitud';
import { validarFormularioSolicitud, ErroresFormularioSolicitud } from '../../shared/validations';
import { COLORES, PRIORIDAD_CONFIG } from '../../shared/constants';
import type { AdminStackParamList, ClienteStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<
  AdminStackParamList & ClienteStackParamList,
  'Crear'
>;

interface FormularioCreate {
  clienteNombre: string;
  telefono: string;
  direccion: string;
  servicioId: string | null;
  prioridad: Prioridad;
  descripcion: string;
}

export default function CreateScreen({ navigation }: Props) {
  const { servicios, crearSolicitud: agregarSolicitud } = useSolicitudes();
  const { auth } = useAuth();
  const esCliente = auth?.role === 'CLIENTE';

  const estadoInicialForm: FormularioCreate = {
    clienteNombre: esCliente && auth?.role === 'CLIENTE' ? auth.nombre : '',
    telefono: esCliente && auth?.role === 'CLIENTE' ? auth.telefono : '',
    direccion: '',
    servicioId: null,
    prioridad: PRIORIDADES.MEDIA,
    descripcion: '',
  };

  const [form, setForm] = useState<FormularioCreate>(estadoInicialForm);
  const [errores, setErrores] = useState<Partial<ErroresFormularioSolicitud>>({});

  const actualizarCampo = <K extends keyof FormularioCreate>(
    campo: K,
    valor: FormularioCreate[K]
  ) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleGuardar = () => {
    const { errores: erroresValidados, esValido } = validarFormularioSolicitud(form);
    setErrores(erroresValidados);

    if (!esValido) return;

    const nuevaSolicitud = crearSolicitud({
      id: `R${Date.now()}`,
      clienteNombre: form.clienteNombre.trim(),
      telefono: form.telefono.trim(),
      direccion: form.direccion.trim(),
      servicioId: form.servicioId,
      usuarioId: null,
      prioridad: form.prioridad,
      descripcion: form.descripcion.trim(),
      fechaReserva: new Date().toISOString(),
    });

    agregarSolicitud(nuevaSolicitud);

    Alert.alert('Solicitud registrada', 'La solicitud se creó correctamente.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Nueva solicitud</Text>

        <InputField
          label="Nombre del cliente"
          value={form.clienteNombre}
          onChangeText={(v) => actualizarCampo('clienteNombre', v)}
          error={errores.clienteNombre}
          placeholder="Ej. María Gómez"
          editable={!esCliente}
        />

        <InputField
          label="Teléfono"
          value={form.telefono}
          onChangeText={(v) => actualizarCampo('telefono', v)}
          error={errores.telefono}
          placeholder="Ej. 987654321"
          keyboardType="phone-pad"
          editable={!esCliente}
        />

        <InputField
          label="Dirección de recojo/entrega"
          value={form.direccion}
          onChangeText={(v) => actualizarCampo('direccion', v)}
          error={errores.direccion}
          placeholder="Ej. Av. Los Álamos 234"
        />

        <Text style={styles.label}>Tipo de servicio</Text>
        <View style={styles.serviciosWrap}>
          {servicios.map((sv) => (
            <TouchableOpacity
              key={sv.id}
              style={[
                styles.servicioOpcion,
                form.servicioId === sv.id && styles.servicioOpcionActiva,
              ]}
              onPress={() => actualizarCampo('servicioId', sv.id)}
            >
              <Text style={styles.servicioIcono}>{sv.icono}</Text>
              <Text
                style={[
                  styles.servicioTexto,
                  form.servicioId === sv.id && styles.servicioTextoActivo,
                ]}
              >
                {sv.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errores.servicioId ? (
          <Text style={styles.errorText}>{errores.servicioId}</Text>
        ) : null}

        <Text style={[styles.label, { marginTop: 16 }]}>Prioridad</Text>
        <View style={styles.prioridadWrap}>
          {(Object.keys(PRIORIDADES) as Array<keyof typeof PRIORIDADES>).map((key) => {
            const cfg = PRIORIDAD_CONFIG[PRIORIDADES[key]];
            const activo = form.prioridad === PRIORIDADES[key];
            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.prioridadChip,
                  { backgroundColor: activo ? cfg.color : cfg.bg },
                ]}
                onPress={() => actualizarCampo('prioridad', PRIORIDADES[key])}
              >
                <Text
                  style={{
                    color: activo ? '#fff' : cfg.color,
                    fontWeight: '700',
                    fontSize: 13,
                  }}
                >
                  {cfg.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <InputField
          label="Descripción de la solicitud"
          value={form.descripcion}
          onChangeText={(v) => actualizarCampo('descripcion', v)}
          error={errores.descripcion}
          placeholder="Detalla las prendas, cantidad, indicaciones..."
          multiline
        />

        <TouchableOpacity style={styles.btnGuardar} onPress={handleGuardar}>
          <Text style={styles.btnGuardarText}>Guardar solicitud</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnCancelar} onPress={() => navigation.goBack()}>
          <Text style={styles.btnCancelarText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORES.fondo },
  scroll: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: '800', color: COLORES.texto, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: COLORES.texto, marginBottom: 8 },
  serviciosWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  servicioOpcion: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.tarjeta,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  servicioOpcionActiva: { borderColor: COLORES.primario, backgroundColor: '#E7F1F8' },
  servicioIcono: { fontSize: 16, marginRight: 6 },
  servicioTexto: { fontSize: 13, color: COLORES.texto },
  servicioTextoActivo: { color: COLORES.primarioOscuro, fontWeight: '700' },
  errorText: { color: COLORES.peligro, fontSize: 12, marginTop: 4 },
  prioridadWrap: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  prioridadChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
  },
  btnGuardar: {
    backgroundColor: COLORES.primario,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  btnGuardarText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnCancelar: { alignItems: 'center', paddingVertical: 14 },
  btnCancelarText: { color: COLORES.textoSecundario, fontWeight: '600' },
});
