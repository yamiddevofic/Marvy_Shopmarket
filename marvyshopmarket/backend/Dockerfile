FROM python:3.13

# Dependencias nativas → solo las que necesitas
RUN apt-get update && apt-get install -y \
    build-essential default-libmysqlclient-dev gcc pkg-config python3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /
COPY requirements.txt .

RUN pip install -r requirements.txt

# Copia SOLO el código, gracias al .dockerignore será muy liviano
COPY app ./app
COPY migrations ./migrations

CMD ["gunicorn", "app:create_app()", "--bind", "0.0.0.0:5000"]
