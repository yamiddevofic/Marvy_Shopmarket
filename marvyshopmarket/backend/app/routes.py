import traceback
import json
import base64
from flask import Blueprint, render_template, request, jsonify, session, Response
from flask.views import MethodView
from . import bcrypt, db
from .models import Administrador, Tenderos, Tiendas
import sqlalchemy
from werkzeug.exceptions import BadRequest
from sqlalchemy.exc import IntegrityError
import logging


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
                return jsonify({
                    'message': 'Autenticación exitosa',
                    'name': administrador.adm_Nombre  # Incluir el nombre del administrador
                }), 200
            elif tendero and bcrypt.check_password_hash(tendero.tendero_Password, password):
                session['tienda_Id'] = tendero.tienda_Id
                session['tendero_Id'] = tendero.tendero_Id
                return jsonify({
                    'message': 'Autenticación exitosa',
                    'name': tendero.tendero_Nombre  # Incluir el nombre del tendero
                }), 200
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


class RegistrarAdminTiendaAPI(MethodView):
    def post(self):
        try:
            data = request.get_json()
            
            # Validar campos requeridos
            required_fields = {
                'tienda': ['tienda_Id', 'tienda_Nombre', 'tienda_Correo'],
                'admin': ['adm_Id', 'adm_Nombre', 'adm_Correo', 'adm_Password']
            }

            for category, fields in required_fields.items():
                for field in fields:
                    if not data.get(field):
                        return jsonify({'message': f'El campo {field} es requerido'}), 400

            # Convertir IDs a enteros
            try:
                tienda_id = int(data['tienda_Id'])
                admin_id = int(data['adm_Id'])
            except ValueError:
                return jsonify({'message': 'Los IDs deben ser números válidos'}), 400

            # Verificar duplicados
            existing_tienda = db.session.query(Tiendas).filter_by(tienda_Id=tienda_id).first()
            if existing_tienda:
                return jsonify({'message': 'El ID de tienda ya está registrado'}), 400

            existing_admin = db.session.query(Administrador).filter_by(adm_Id=admin_id).first()
            if existing_admin:
                return jsonify({'message': 'El ID de administrador ya está registrado'}), 400

            # Procesar imagen
            imagen_bytes = None
            if data.get('tienda_Img'):
                imagen_base64 = data['tienda_Img'].split(',')[1] if ',' in data['tienda_Img'] else data['tienda_Img']
                imagen_bytes = base64.b64decode(imagen_base64)

            # Crear instancia de Tiendas con los nombres de argumentos correctos
            new_tienda = Tiendas(
                id=tienda_id,
                nombre=data['tienda_Nombre'],
                correo=data['tienda_Correo'],
                celular=data.get('tienda_Celular'),
                ubicacion=data.get('tienda_Ubicacion'),
                imagen=imagen_bytes
            )

            db.session.add(new_tienda)
            db.session.flush()

            # Hashear contraseña
            hashed_password = bcrypt.generate_password_hash(data['adm_Password']).decode('utf-8')

            # Crear instancia de Administrador con los nombres de argumentos correctos
            new_admin = Administrador(
                id=admin_id,
                nombre=data['adm_Nombre'],
                correo=data['adm_Correo'],
                celular=data.get('adm_Celular'),
                password=hashed_password,
                tienda=tienda_id
            )

            db.session.add(new_admin)
            db.session.commit()

            response_data = {
                'message': 'Registro exitoso',
                'admin_id': admin_id,
                'tienda_id': tienda_id
            }

            return jsonify(response_data), 201

        except IntegrityError as e:
            db.session.rollback()
            # Imprimir la excepción en la consola
            print(f"IntegrityError: {e}")
            return jsonify({'message': 'Error de integridad de datos: posible duplicado de ID o correo electrónico.'}), 400
        except Exception as e:
            db.session.rollback()
            # Imprimir la excepción en la consola
            print(f"Error: {e}")
            # Logging del error
            with open('error_log.txt', 'a', encoding='utf-8') as error_file:
                error_file.write(f"Error en registro: {str(e)}\n")
                error_file.write(traceback.format_exc())
                error_file.write("\n" + "-"*50 + "\n")
            
            return jsonify({'message': f'Error al registrar: {str(e)}'}), 500


class RegistrarTenderoAPI(MethodView):
    def post(self):
        """Endpoint para registrar un nuevo tendero."""
        try:
            data = request.get_json()
            if not data:
                raise BadRequest('Solicitud inválida: JSON no proporcionado')

            # Validar campos requeridos
            required_fields = ['tendero_Id', 'tendero_Nombre', 'tendero_Correo', 'tendero_Password', 'tienda_Id']

            for field in required_fields:
                if not data.get(field):
                    raise BadRequest(f'El campo {field} es requerido')

            # Convertir IDs a enteros
            try:
                tendero_id = int(data['tendero_Id'])
                tienda_id = int(data['tienda_Id'])
            except ValueError:
                raise BadRequest('Los IDs deben ser números válidos')

            # Verificar que la tienda existe
            tienda = Tiendas.query.filter_by(tienda_Id=tienda_id).first()
            if not tienda:
                raise BadRequest('La tienda especificada no existe')

            # Verificar duplicados
            if Tenderos.query.filter_by(tendero_Id=tendero_id).first():
                raise BadRequest('El ID de tendero ya está registrado')

            if Tenderos.query.filter_by(tendero_Correo=data['tendero_Correo']).first():
                raise BadRequest('El correo del tendero ya está registrado')

            # Hashear contraseña
            hashed_password = bcrypt.generate_password_hash(data['tendero_Password']).decode('utf-8')

            # Crear instancia de Tenderos
            new_tendero = Tenderos(
                id=tendero_id,
                nombre=data['tendero_Nombre'],
                correo=data['tendero_Correo'],
                celular=data.get('tendero_Celular'),
                password=hashed_password,
                tienda=tienda_id
            )

            db.session.add(new_tendero)
            db.session.commit()

            response_data = {
                'message': 'Registro de tendero exitoso',
                'tendero_id': tendero_id
            }

            return jsonify(response_data), 201

        except BadRequest as e:
            db.session.rollback()
            return jsonify({'message': str(e)}), e.code
        except IntegrityError as e:
            db.session.rollback()
            logging.exception("Error de integridad de datos al registrar tendero")
            return jsonify({'message': 'Error de integridad de datos: posible duplicado de ID o correo electrónico.'}), 400
        except Exception as e:
            db.session.rollback()
            logging.exception("Error al registrar tendero")
            return jsonify({'message': 'Error interno del servidor'}), 500


# Registrar las vistas
verificar_usuario_view = VerificarUsuarioAPI.as_view('verificar_usuario_api')
main_bp.add_url_rule('/api/verificar-usuario', view_func=verificar_usuario_view, methods=['GET', 'POST'])
registrar_admin_tienda_view = RegistrarAdminTiendaAPI.as_view('registrar_admin_tienda_api')
main_bp.add_url_rule(
    '/api/registrar-admin-tienda', 
    view_func=registrar_admin_tienda_view, 
    methods=['POST']
)
# Registrar la vista para el registro de tenderos
main_bp.add_url_rule('/api/registrar-tendero', view_func=RegistrarTenderoAPI.as_view('registrar_tendero_api'), methods=['POST'])
