


from datetime import datetime, timedelta

def generar_horas(inicio, fin):
    formato = "%H:%M"
    hora_actual = datetime.now()
    
    # Convertir a objetos datetime para comparación
    hora_inicio = datetime.strptime(inicio, formato)
    hora_fin = datetime.strptime(fin, formato)
    
    # Ajustar las fechas para que coincidan con hoy
    hoy = hora_actual.date()
    hora_inicio = hora_inicio.replace(year=hoy.year, month=hoy.month, day=hoy.day)
    hora_fin = hora_fin.replace(year=hoy.year, month=hoy.month, day=hoy.day)
    
    # Si el rango termina antes de empezar (ej. 23:00 a 01:00), sumar un día al final
    if hora_fin < hora_inicio:
        hora_fin += timedelta(days=1)
    
    # Si la hora actual ya pasó la hora de inicio
    if hora_actual > hora_inicio:
        # Calcular la diferencia en horas y redondear hacia arriba
        diferencia = hora_actual - hora_inicio
        horas_a_sumar = diferencia.seconds // 3600 + 1
        hora_inicio += timedelta(hours=horas_a_sumar)
    
    # Generar las horas
    horas = []
    while hora_inicio <= hora_fin:
        horas.append(hora_inicio.strftime(formato))
        hora_inicio += timedelta(hours=1)
    
    return horas


# Ejemplo de uso
horas = generar_horas("03:00", "05:00")
print(horas)  # ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00']




def generar_horas2(inicio, fin):
    
    formato = "%H:%M"
    actual = datetime.now().strftime(formato)

    hora_inicio = datetime.strptime(inicio, formato)
    hora_fin = datetime.strptime(fin, formato)
    
    horas = []
    while hora_inicio <= hora_fin:
        horas.append(hora_inicio.strftime(formato))
        hora_inicio += timedelta(hours=1)
    
    return horas

# Ejemplo de uso
horas2 = generar_horas2("20:00", "23:00")
print(horas2)