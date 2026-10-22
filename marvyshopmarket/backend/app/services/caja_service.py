"""Resumen de caja: entradas (ventas) y salidas (gastos) de un periodo."""
from datetime import date, timedelta

from . import fechas, gasto_service, venta_service


def resumen(tienda_id, periodo='hoy'):
    desde, hasta = fechas.rango(periodo or 'hoy')
    ventas = [v for v in venta_service.listar(tienda_id, desde, hasta) if not v['anulada']]
    gastos = gasto_service.listar(tienda_id, desde, hasta)

    por_categoria = {}
    for gasto in gastos:
        por_categoria[gasto['categoria']] = por_categoria.get(gasto['categoria'], 0) + gasto['monto']

    # Una entrada por día del rango, también los días sin movimientos
    por_dia = {}
    dia, fin = date.fromisoformat(desde), date.fromisoformat(hasta)
    while dia <= fin:
        por_dia[dia.isoformat()] = {'dia': dia.isoformat(), 'entradas': 0, 'salidas': 0}
        dia += timedelta(days=1)
    for venta in ventas:
        por_dia[venta['dia']]['entradas'] += venta['total']
    for gasto in gastos:
        por_dia[gasto['dia']]['salidas'] += gasto['monto']

    entradas = sum(v['total'] for v in ventas)
    salidas = sum(g['monto'] for g in gastos)
    return {
        'periodo': periodo or 'hoy',
        'desde': desde,
        'hasta': hasta,
        'entradas': entradas,
        'salidas': salidas,
        'balance': entradas - salidas,
        'num_ventas': len(ventas),
        'num_gastos': len(gastos),
        'gastos_por_categoria': [
            {'categoria': c, 'total': t} for c, t in sorted(por_categoria.items(), key=lambda par: -par[1])
        ],
        'por_dia': list(por_dia.values()),
    }
