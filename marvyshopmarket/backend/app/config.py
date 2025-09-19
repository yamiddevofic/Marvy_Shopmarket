import os
from dotenv import load_dotenv

load_dotenv()  # carga variables del .env

print("SQL URI =", os.getenv("SQLALCHEMY_DATABASE_URI"))

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')

    # Configuración básica de SQLAlchemy (MySQL)
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Configuración de MongoDB
    MONGO_URI = "mongodb+srv://yamiddev_db_user:Pamplona_2022@marvyshopmarket.aawe3en.mongodb.net/tienda?retryWrites=true&w=majority"


    # Configuración de Socket
    SOCKET_HOST = os.getenv('SOCKET_HOST')
    SOCKET_PORT = int(os.getenv('SOCKET_PORT', 12345))

    # Configuración del pool de conexiones SQL
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': 10,
        'pool_recycle': 3600,
        'pool_timeout': 30,
        'pool_pre_ping': True,
        'max_overflow': 20,
    }

    # Configuración adicional de MySQL
    MYSQL_DATABASE_CHARSET = 'utf8mb4'
    MYSQL_DATABASE_COLLATION = 'utf8mb4_unicode_ci'

    # Tiempo máximo de espera para consultas (en segundos)
    SQLALCHEMY_POOL_RECYCLE = 3600


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = False  # Log de las consultas SQL


class ProductionConfig(Config):
    DEBUG = False

    SQLALCHEMY_ENGINE_OPTIONS = {
        **Config.SQLALCHEMY_ENGINE_OPTIONS,
        'pool_size': 20,
        'max_overflow': 40,
        'pool_pre_ping': True,
        'pool_recycle': 1800,
    }

    SQLALCHEMY_COMMIT_ON_TEARDOWN = True
    SQLALCHEMY_POOL_TIMEOUT = 30


def get_config():
    env = os.getenv('FLASK_ENV', 'development')
    if env == 'production':
        return ProductionConfig
    return DevelopmentConfig
