import traceback
from flask import request, jsonify
from flask.views import MethodView
from werkzeug.exceptions import BadRequest
from sqlalchemy.exc import IntegrityError
from .. import bcrypt, db
from ..models import Tenderos, Tiendas

class RegistrarTenderoAPI(MethodView):
    def post(self):
        try:
            data = request.get_json()
            if not data:
                raise BadRequest('JSON no proporcionado')

            required_fields = ['tendero_Id', 'tendero_Nombre', 'tendero_Correo', 
                             'tendero_Password', 'tienda_Id']

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

