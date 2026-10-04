import os

from dotenv import load_dotenv

load_dotenv()  # carga variables del .env

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

DEFAULT_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://172.19.0.3:5173",
    "http://localhost:5000",
    "https://marvyshopmarket.com",
    "https://marvy-shopmarket.onrender.com",
]


def _split_env_list(value):
    return [item.strip() for item in value.split(',') if item.strip()] if value else []


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')

    # MySQL (SQLAlchemy)
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': 10,
        'pool_recycle': 3600,
        'pool_timeout': 30,
        'pool_pre_ping': True,
        'max_overflow': 20,
    }

    # MongoDB: nunca escribir credenciales aquí, solo vía entorno.
    MONGO_URI = os.getenv('MONGO_URI')

    # Archivos subidos (logo de la tienda)
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', os.path.join(BASE_DIR, 'uploads'))
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024

    CORS_ORIGINS = _split_env_list(os.getenv('CORS_ORIGINS')) or DEFAULT_CORS_ORIGINS

    # En desarrollo el frontend (localhost:5173) y la API (localhost:5000) son
    # same-site, así que Lax sin Secure funciona sobre HTTP.
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_COOKIE_SECURE = False


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False

    SQLALCHEMY_ENGINE_OPTIONS = {
        **Config.SQLALCHEMY_ENGINE_OPTIONS,
        'pool_size': 20,
        'max_overflow': 40,
        'pool_recycle': 1800,
    }

    # Frontend y API en dominios distintos: la cookie debe viajar cross-site sobre HTTPS.
    SESSION_COOKIE_SAMESITE = 'None'
    SESSION_COOKIE_SECURE = True


class TestingConfig(Config):
    TESTING = True
    SECRET_KEY = 'test-secret-key'
    SQLALCHEMY_DATABASE_URI = 'sqlite://'
    SQLALCHEMY_ENGINE_OPTIONS = {}
    MONGO_URI = None
    BCRYPT_LOG_ROUNDS = 4


def get_config():
    env = os.getenv('FLASK_ENV', 'development')
    if env == 'production':
        return ProductionConfig
    return DevelopmentConfig
