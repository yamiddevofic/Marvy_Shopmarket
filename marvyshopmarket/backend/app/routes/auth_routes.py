import json
import traceback
from flask import request, jsonify, session, Response
from flask.views import MethodView
from .. import bcrypt, db
from ..models import Administrador, Tenderos

class VerificarUsuarioAPI(MethodView):
    def get(self):
        response_data = {'message': 'Conexión exitosa con el servidor'}
        response_json = json.dumps(response_data, ensure_ascii=False)
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
                return jsonify({
                    'message': 'Autenticación exitosa',
                    'name': administrador.adm_Nombre
                }), 200
            elif tendero and bcrypt.check_password_hash(tendero.tendero_Password, password):
                session['tienda_Id'] = tendero.tienda_Id
                session['tendero_Id'] = tendero.tendero_Id
                return jsonify({
                    'message': 'Autenticación exitosa',
                    'name': tendero.tendero_Nombre
                }), 200
            else:
                return jsonify({'message': 'Usuario no encontrado o contraseña incorrecta'}), 401

        except Exception as e:
            with open('error_log.txt', 'a', encoding='utf-8') as error_file:
                error_file.write(f"Error: {str(e)}\n")
                error_file.write(traceback.format_exc())
                error_file.write("\n" + "-"*50 + "\n")
            return jsonify({'message': 'Error, vuelve a intentarlo'}), 500

class CerrarSesionAPI(MethodView):
    def post(self):
        try:
            # Limpiar todas las variables de sesión
            session.clear()
            return jsonify({'message': 'Cierre de sesión exitoso'}), 200
        except Exception as e:
            with open('error_log.txt', 'a', encoding='utf-8') as error_file:
                error_file.write(f"Error: {str(e)}\n")
                error_file.write(traceback.format_exc())
                error_file.write("\n" + "-"*50 + "\n")
            return jsonify({'message': 'Error al cerrar sesión, vuelve a intentarlo'}), 500

class RutaProtegidaAPI(MethodView):
    def get(self):
        if not session.get('logged_in'):
            return redirect(url_for('verificarusuarioapi_get'))
        return jsonify({'message': 'Acceso permitido a la ruta protegida'}), 200
