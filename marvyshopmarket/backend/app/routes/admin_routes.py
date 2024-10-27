import os
import base64
import traceback
from flask import request, jsonify, session, current_app
from flask.views import MethodView
from sqlalchemy.exc import IntegrityError
from werkzeug.utils import secure_filename
from .. import bcrypt, db
from ..models import Administrador, Tiendas

UPLOAD_FOLDER = 'uploads/'  # Carpeta donde se guardarán las imágenes
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Método auxiliar para verificar si la extensión del archivo es permitida
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class RegistrarAdminTiendaAPI(MethodView):
    def post(self):
        try:
            data = request.get_json()
            imagen_base64 = data.get('tienda_Img')

            # Verificar campos requeridos
            required_fields = {
                'tienda': ['tienda_Id', 'tienda_Nombre', 'tienda_Correo'],
                'admin': ['adm_Id', 'adm_Nombre', 'adm_Correo', 'adm_Password']
            }

            for category, fields in required_fields.items():
                for field in fields:
                    if not data.get(field):
                        return jsonify({'message': f'El campo {field} es requerido'}), 400

            try:
                tienda_id = int(data['tienda_Id'])
                admin_id = int(data['adm_Id'])
            except ValueError:
                return jsonify({'message': 'Los IDs deben ser números válidos'}), 400

            # Verificación de existencia de registros
            if db.session.query(Tiendas).filter_by(tienda_Id=tienda_id).first():
                return jsonify({'message': 'El ID de tienda ya está registrado'}), 400

            if db.session.query(Administrador).filter_by(adm_Id=admin_id).first():
                return jsonify({'message': 'El ID de administrador ya está registrado'}), 400

            # Procesar imagen si existe y es válida
            image_url = None
            if imagen_base64:
                try:
                    image_data = base64.b64decode(imagen_base64.split(',')[1]) if ',' in imagen_base64 else base64.b64decode(imagen_base64)
                    filename = secure_filename(f"tienda_{tienda_id}.jpg")  # Asegurarse de que el nombre del archivo sea seguro
                    file_path = os.path.join(current_app.config.get('UPLOAD_FOLDER', UPLOAD_FOLDER), filename)
                    os.makedirs(os.path.dirname(file_path), exist_ok=True)  # Crear el directorio si no existe
                    with open(file_path, 'wb') as f:
                        f.write(image_data)
                    image_url = f'/uploads/{filename}'
                except Exception as e:
                    return jsonify({'message': 'Error al procesar la imagen'}), 400

            # Crear registro de la tienda
            new_tienda = Tiendas(
                id=tienda_id,  # Ajuste aquí para utilizar el nombre correcto del campo
                nombre=data['tienda_Nombre'],
                correo=data['tienda_Correo'],
                celular=data.get('tienda_Celular'),
                ubicacion=data.get('tienda_Ubicacion'),
                imagen=image_url  # Guardar la URL de la imagen como una cadena de texto
            )

            db.session.add(new_tienda)
            db.session.flush()

            # Crear registro del administrador
            hashed_password = bcrypt.generate_password_hash(data['adm_Password']).decode('utf-8')
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

            return jsonify({
                'message': 'Registro exitoso',
                'admin_id': admin_id,
                'tienda_id': tienda_id
            }), 201

        except IntegrityError as e:
            db.session.rollback()
            return jsonify({'message': 'Error de integridad de datos'}), 400
        except Exception as e:
            db.session.rollback()
            with open('error_log.txt', 'a', encoding='utf-8') as error_file:
                error_file.write(f"Error en registro: {str(e)}\n")
                error_file.write(traceback.format_exc())
                error_file.write("\n" + "-"*50 + "\n")
            return jsonify({'message': 'Error al registrar'}), 500



class ConsultarInfoAPI(MethodView):
    def get(self):
        try:
            tienda_id = session.get('tienda_Id')
            adm_id = session.get('adm_Id')

            print(f"Sesión actual - Tienda ID: {tienda_id}, Admin ID: {adm_id}")

            if not tienda_id or not adm_id:
                return jsonify({
                    'estado': 'error',
                    'mensaje': 'No hay una sesión activa',
                    'codigo': 'SESION_NO_ENCONTRADA'
                }), 401

            return self._obtener_info(adm_id, tienda_id)

        except Exception as e:
            self._registrar_error(e)
            return jsonify({
                'estado': 'error',
                'mensaje': 'Error al consultar la información',
                'error': str(e)
            }), 500

    def _obtener_info(self, admin_id, tienda_id):
        try:
            print(f"Consultando información - Admin ID: {admin_id}, Tienda ID: {tienda_id}")

            admin = db.session.query(Administrador).filter_by(adm_Id=int(admin_id)).first()
            tienda = db.session.query(Tiendas).filter_by(tienda_Id=int(tienda_id)).first()

            if not admin or not tienda:
                print("No se encontró admin o tienda")
                return jsonify({
                    'estado': 'error',
                    'mensaje': 'No se encontró la información solicitada',
                    'codigo': 'NO_ENCONTRADO'
                }), 404

            # Construir respuesta
            respuesta = {
                'estado': 'exitoso',
                'datos': {
                    'administrador': {
                        'id': admin.adm_Id,
                        'nombre': admin.adm_Nombre,
                        'correo': admin.adm_Correo,
                        'celular': admin.adm_Celular or '',
                        'estado': admin.adm_Estado if hasattr(admin, 'adm_Estado') else None,
                        'fecha_registro': str(admin.adm_FechaRegistro) if hasattr(admin, 'adm_FechaRegistro') else '',
                        'ultimo_acceso': str(admin.adm_UltimoAcceso) if hasattr(admin, 'adm_UltimoAcceso') else ''
                    },
                    'tienda': {
                        'id': tienda.tienda_Id,
                        'nombre': tienda.tienda_Nombre,
                        'correo': tienda.tienda_Correo,
                        'celular': tienda.tienda_Celular or '',
                        'ubicacion': tienda.tienda_Ubicacion or '',
                        'estado': tienda.tienda_Estado if hasattr(tienda, 'tienda_Estado') else None,
                        'fecha_registro': str(tienda.tienda_FechaRegistro) if hasattr(tienda, 'tienda_FechaRegistro') else '',
                    }
                }
            }

            # Manejar la imagen
            if hasattr(tienda, 'imagen') and tienda.imagen:
                # La imagen ya está guardada como nombre de archivo
                respuesta['datos']['tienda']['imagen'] = tienda.imagen
            else:
                respuesta['datos']['tienda']['imagen'] = None

            return jsonify(respuesta), 200

        except SQLAlchemyError as e:
            self._registrar_error(e)
            return jsonify({
                'estado': 'error',
                'mensaje': 'Error en la base de datos',
                'error': str(e)
            }), 500
        except Exception as e:
            self._registrar_error(e)
            return jsonify({
                'estado': 'error',
                'mensaje': 'Error al procesar la información',
                'error': str(e)
            }), 500

    def _registrar_error(self, error):
        with open('error_log.txt', 'a', encoding='utf-8') as archivo_error:
            archivo_error.write(f"\nError en ConsultarInfoAPI: {str(error)}\n")
            archivo_error.write(traceback.format_exc())
            archivo_error.write("\n" + "-"*50 + "\n")

class ImagenesAPI(MethodView):
    def get(self, filename):
        try:
            # Asegurarse de que UPLOAD_FOLDER está definido
            upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads/')
            return send_from_directory(upload_folder, filename)
        except FileNotFoundError:
            return jsonify({'message': 'Imagen no encontrada'}), 404
        except Exception as e:
            return jsonify({'message': f'Error al servir la imagen: {str(e)}'}), 500