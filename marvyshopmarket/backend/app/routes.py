import traceback
import json
from flask import Blueprint, render_template, request, jsonify, session, Response
from flask.views import MethodView
from . import bcrypt
from .models import Administrador, Tenderos
from app import db

main_bp = Blueprint('main', __name__)

class VerificarUsuarioAPI(MethodView):
    def get(self):
        # Mensaje para verificar que el servidor está en funcionamiento
        response_data = {'message': 'Conexión exitosa con el servidor'}
        response_json = json.dumps(response_data, ensure_ascii=False)  # Esto evita el escape Unicode
        return Response(response_json, content_type='application/json; charset=utf-8', status=200)


    def post(self):
        data = request.get_json()
        userid = data.get('userid')
        password = data.get('password')

        if not userid or not password:
            return jsonify({'message': 'Faltan datos de usuario o contraseña'}), 400

        try:
            administrador = db.session.query(Administrador).filter_by(adm_Id=int(userid)).first()
            tendero = db.session.query(Tenderos).filter_by(tendero_Id=int(userid)).first()

            if administrador and bcrypt.check_password_hash(administrador.adm_Password, password):
                session['tienda_Id'] = administrador.tienda_Id
                session['adm_Id'] = administrador.adm_Id
                return jsonify({'message': 'Autenticación exitosa'}), 200
            elif tendero and bcrypt.check_password_hash(tendero.tendero_Password, password):
                session['tienda_Id'] = tendero.tienda_Id
                session['tendero_Id'] = tendero.tendero_Id
                return jsonify({'message': 'Autenticación exitosa'}), 200
            else:
                return jsonify({'message': 'Usuario no encontrado o contraseña incorrecta'}), 401
        except Exception as e:
            # Guardar el error en un archivo txt
            with open('error_log.txt', 'a', encoding='utf-8') as error_file:
                error_file.write(f"Error: {str(e)}\n")
                error_file.write(traceback.format_exc())  # Añadir el stack trace completo para más detalles
                error_file.write("\n" + "-"*50 + "\n")

            # Respuesta genérica para el cliente
            return jsonify({'message': 'Error, vuelve a intentarlo'}), 500

# Añadir la clase como vista al blueprint
verificar_usuario_view = VerificarUsuarioAPI.as_view('verificar_usuario_api')
main_bp.add_url_rule('/api/verificar-usuario', view_func=verificar_usuario_view, methods=['GET', 'POST'])
