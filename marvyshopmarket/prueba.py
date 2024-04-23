import time

# Función o sección del código que deseas medir
def mi_seccion_de_codigo():
    # Utilizamos la fórmula de la suma aritmética para calcular la suma de los números del 1 al 1000000
    suma = (1 + 1298391028390128474816234) * 1298391028390128474816234 // 2
    print("La suma es:", suma)

# Tomamos el tiempo antes de ejecutar la sección de código
inicio = time.perf_counter()

# Ejecutamos la sección de código
mi_seccion_de_codigo()

# Tomamos el tiempo después de ejecutar la sección de código
fin = time.perf_counter()

# Calculamos el tiempo transcurrido
tiempo_transcurrido = fin - inicio

# Mostramos el tiempo transcurrido en la consola
print("Tiempo transcurrido:", tiempo_transcurrido, "segundos")
