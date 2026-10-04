"""Lógica de negocio, independiente de HTTP.

Las rutas solo traducen petición/respuesta; los servicios validan, aplican
reglas de negocio y acceden a los datos. Los errores se lanzan como APIError.
"""
