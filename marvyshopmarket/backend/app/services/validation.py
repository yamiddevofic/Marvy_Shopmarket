from ..errors import APIError


def require_fields(data, fields):
    for field in fields:
        value = data.get(field)
        if value is None or (isinstance(value, str) and not value.strip()):
            raise APIError(f'El campo {field} es requerido', 400)


def parse_int(value, field):
    try:
        return int(value)
    except (TypeError, ValueError):
        raise APIError(f'El campo {field} debe ser un número válido', 400)


def require_email(value, field):
    if not isinstance(value, str) or '@' not in value or len(value) > 100:
        raise APIError(f'El campo {field} debe ser un correo válido', 400)
    return value.strip()


def require_password(value, field):
    # bcrypt solo admite hasta 72 bytes.
    if not isinstance(value, str) or len(value) < 6 or len(value.encode('utf-8')) > 72:
        raise APIError(f'El campo {field} debe tener entre 6 y 72 caracteres', 400)
    return value
