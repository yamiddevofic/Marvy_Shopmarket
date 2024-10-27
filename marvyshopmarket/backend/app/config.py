# config.py
import os
from dotenv import load_dotenv

# Cargar las variables desde el archivo .env
load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    # Configuración básica de SQLAlchemy
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configuración de Socket
    SOCKET_HOST = os.getenv('SOCKET_HOST')
    SOCKET_PORT = int(os.getenv('SOCKET_PORT', 12345))
    
    # Configuración del pool de conexiones
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': 10,        # número de conexiones permanentes
        'pool_recycle': 3600,   # reciclar conexiones después de 1 hora
        'pool_timeout': 30,     # tiempo de espera para obtener una conexión del pool
        'pool_pre_ping': True,  # verificar conexión antes de usarla
        'max_overflow': 20,     # conexiones adicionales que se pueden crear
    }
    
    # Configuración adicional de MySQL
    MYSQL_DATABASE_CHARSET = 'utf8mb4'
    MYSQL_DATABASE_COLLATION = 'utf8mb4_unicode_ci'
    
    # Tiempo máximo de espera para consultas (en segundos)
    SQLALCHEMY_POOL_RECYCLE = 3600

class DevelopmentConfig(Config):
    DEBUG = True
    # Configuración específica para desarrollo
    SQLALCHEMY_ECHO = False  # Log de las consultas SQL

class ProductionConfig(Config):
    DEBUG = False
    # Configuración más restrictiva para producción
    SQLALCHEMY_ENGINE_OPTIONS = {
        **Config.SQLALCHEMY_ENGINE_OPTIONS,
        'pool_size': 20,        # más conexiones para producción
        'max_overflow': 40,
        'pool_pre_ping': True,
        'pool_recycle': 1800    # reciclar conexiones cada 30 minutos
    }
    
    # Configuración adicional de seguridad para producción
    SQLALCHEMY_COMMIT_ON_TEARDOWN = True
    SQLALCHEMY_POOL_TIMEOUT = 30

# Función para obtener la configuración según el entorno
def get_config():
    env = os.getenv('FLASK_ENV', 'development')
    if env == 'production':
        return ProductionConfig
    return DevelopmentConfig
