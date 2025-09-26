import traceback
from flask import request, jsonify
from flask.views import MethodView
from werkzeug.exceptions import BadRequest
from sqlalchemy.exc import IntegrityError
from .. import bcrypt, db
from ..models import Tenderos, Tiendas
from flask import session
from sqlalchemy.exc import SQLAlchemyError

class RegistrarTenderoAPI(MethodView):
    def post(self):
        try:
            data = request.get_json()
            if not data:
                raise BadRequest('JSON no proporcionado')

            required_fields = ['tendero_Id', 'tendero_Nombre', 'tendero_Correo', 'tendero_Password', 'tienda_Id']

            for field in required_fields:
                if not data.get(field):
                    raise BadRequest(f'El campo {field} es requerido')

            tendero_id = int(data['tendero_Id'])
            tienda_id = int(data['tienda_Id'])

            if not Tiendas.query.filter_by(tienda_Id=tienda_id).first():
                raise BadRequest('La tienda especificada no existe')

            if Tenderos.query.filter_by(tendero_Id=tendero_id).first():
                raise BadRequest('El ID de tendero ya está registrado')

            if Tenderos.query.filter_by(tendero_Correo=data['tendero_Correo']).first():
                raise BadRequest('El correo ya está registrado')

            hashed_password = bcrypt.generate_password_hash(data['tendero_Password']).decode('utf-8')

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

            return jsonify({
                'message': 'Registro de tendero exitoso',
                'tendero_id': tendero_id
            }), 201

        except BadRequest as e:
            db.session.rollback()
            return jsonify({'message': str(e)}), 400
        except IntegrityError as e:
            db.session.rollback()
            return jsonify({'message': 'Error de integridad de datos'}), 400
        except Exception as e:
            db.session.rollback()
            with open('error_log.txt', 'a', encoding='utf-8') as error_file:
                error_file.write(f"Error en registro de tendero: {str(e)}\n")
                error_file.write(traceback.format_exc())
                error_file.write("\n" + "-"*50 + "\n")
            return jsonify({'message': 'Error interno del servidor'}), 500

class ConsultarTenderosAPI(MethodView):
    def get(self):
        try:
            # Obtener el ID de la tienda desde la sesión (asumiendo que el admin está logueado)
            tienda_id = session.get('tienda_Id')
            print(f"ConsultarTenderosAPI - tienda_id from session: {tienda_id}")
            print(f"ConsultarTenderosAPI - session data: {dict(session)}")
            
            if not tienda_id:
                print("ConsultarTenderosAPI - No tienda_id in session, returning 401")
                return jsonify({'message': 'No hay una sesión activa o no tiene permisos'}), 401

            # Consultar todos los tenderos de la tienda
            tenderos = Tenderos.query.filter_by(tienda_Id=tienda_id).all()
            print(f"ConsultarTenderosAPI - Found {len(tenderos)} tenderos for tienda_id {tienda_id}")

            # Construir la respuesta con los datos de los tenderos
            tenderos_data = []
            for tendero in tenderos:
                tendero_data = {
                    'id': tendero.tendero_Id,
                    'nombre': tendero.tendero_Nombre,
                    'correo': tendero.tendero_Correo,
                    'celular': tendero.tendero_Celular or '',
                    'tienda_Id': tendero.tienda_Id
                }
                print(f"ConsultarTenderosAPI - Tendero data: {tendero_data}")
                tenderos_data.append(tendero_data)

            response_data = {
                'message': 'Consulta exitosa',
                'tenderos': tenderos_data,
                'total': len(tenderos_data)
            }
            print(f"ConsultarTenderosAPI - Response data: {response_data}")
            return jsonify(response_data), 200

        except SQLAlchemyError as e:
            db.session.rollback()
            with open('error_log.txt', 'a', encoding='utf-8') as error_file:
                error_file.write(f"Error en consulta de tenderos: {str(e)}\n")
                error_file.write(traceback.format_exc())
                error_file.write("\n" + "-"*50 + "\n")
            return jsonify({'message': 'Error en la base de datos'}), 500
        except Exception as e:
            with open('error_log.txt', 'a', encoding='utf-8') as error_file:
                error_file.write(f"Error inesperado en consulta de tenderos: {str(e)}\n")
                error_file.write(traceback.format_exc())
                error_file.write("\n" + "-"*50 + "\n")
            return jsonify({'message': 'Error interno del servidor'}), 500

class EliminarTenderoAPI(MethodView):
    def delete(self, tendero_id):
        try:
            tendero = Tenderos.query.filter_by(tendero_Id=tendero_id).first()
            if not tendero:
                return jsonify({'message': 'Tendero no encontrado'}), 404
            db.session.delete(tendero)
            db.session.commit()
            return jsonify({'message': 'Tendero eliminado exitosamente'}), 200
        except Exception as e:
            db.session.rollback()
            with open('error_log.txt', 'a', encoding='utf-8') as error_file:
                error_file.write(f"Error en eliminación de tendero: {str(e)}\n")
                error_file.write(traceback.format_exc())
                error_file.write("\n" + "-"*50 + "\n")
            response = jsonify({'message': 'Error interno del servidor'})
            origin = request.headers.get('Origin')
            if origin:
                response.headers.add('Access-Control-Allow-Origin', origin)
                response.headers.add('Access-Control-Allow-Credentials', 'true')
            return response, 500
class ActualizarTenderoAPI(MethodView):
    def patch(self, tendero_id):
        try:
            data = request.get_json()
            tendero = Tenderos.query.filter_by(tendero_Id=tendero_id).first()
            if not tendero:
                return jsonify({'message': 'Tendero no encontrado'}), 404

            # Update fields if provided
            if 'nombre' in data:
                tendero.tendero_Nombre = data['nombre']
            if 'correo' in data:
                tendero.tendero_Correo = data['correo']
            if 'celular' in data:
                tendero.tendero_Celular = data['celular']
            if 'tienda_Id' in data:
                tendero.tienda_Id = data['tienda_Id']

            db.session.commit()
            return jsonify({'message': 'Tendero actualizado exitosamente'}), 200
        except Exception as e:
            db.session.rollback()
            with open('error_log.txt', 'a', encoding='utf-8') as error_file:
                error_file.write(f"Error en actualización de tendero: {str(e)}\n")
                error_file.write(traceback.format_exc())
                error_file.write("\n" + "-"*50 + "\n")
            response = jsonify({'message': 'Error interno del servidor'})
            origin = request.headers.get('Origin')
            if origin:
                response.headers.add('Access-Control-Allow-Origin', origin)
                response.headers.add('Access-Control-Allow-Credentials', 'true')
            return response, 500