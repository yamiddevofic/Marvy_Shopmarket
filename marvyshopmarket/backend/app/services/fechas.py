"""Fechas en la hora local de la tienda y rangos de consulta por periodo."""
from datetime import date, datetime, timedelta, timezone

from flask import current_app

from ..errors import APIError

PERIODOS = ('hoy', 'semana', 'mes')


def ahora():
    horas = current_app.config.get('TIENDA_UTC_OFFSET_HORAS', -5)
    return datetime.now(timezone(timedelta(hours=horas))).replace(microsecond=0)


def hoy():
    return ahora().date()


def parse_dia(valor, campo):
    """Valida una fecha YYYY-MM-DD y la devuelve como texto normalizado."""
    try:
        return date.fromisoformat(str(valor)).isoformat()
    except ValueError:
        raise APIError(f'El campo {campo} debe ser una fecha AAAA-MM-DD', 400)


def rango(periodo=None, desde=None, hasta=None):
    """Devuelve (desde, hasta) como textos YYYY-MM-DD, ambos inclusive.

    ``periodo`` puede ser hoy, semana (últimos 7 días) o mes (mes en curso).
    Si llegan ``desde``/``hasta`` explícitos, tienen prioridad. Sin nada, (None, None).
    """
    if desde or hasta:
        inicio = parse_dia(desde, 'desde') if desde else None
        fin = parse_dia(hasta, 'hasta') if hasta else None
        if inicio and fin and inicio > fin:
            raise APIError('La fecha desde no puede ser posterior a hasta', 400)
        return inicio, fin
    if not periodo:
        return None, None
    if periodo not in PERIODOS:
        raise APIError(f"El periodo debe ser uno de: {', '.join(PERIODOS)}", 400)
    dia = hoy()
    if periodo == 'hoy':
        inicio = dia
    elif periodo == 'semana':
        inicio = dia - timedelta(days=6)
    else:
        inicio = dia.replace(day=1)
    return inicio.isoformat(), dia.isoformat()


def filtro_dia(desde, hasta, campo='dia'):
    """Filtro de Mongo para un campo de texto YYYY-MM-DD dentro del rango."""
    condicion = {}
    if desde:
        condicion['$gte'] = desde
    if hasta:
        condicion['$lte'] = hasta
    return {campo: condicion} if condicion else {}
