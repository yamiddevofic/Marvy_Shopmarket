import urllib.parse
import urllib.request
import json

# URL de la API de Google Drive para obtener la lista de archivos
url = "https://www.googleapis.com/drive/v3/files"

# Parámetros de consulta para la solicitud
params = {
    'pageSize': 10,  # número máximo de archivos a recuperar
    'fields': 'nextPageToken, files(id, name)',  # campos a incluir en la respuesta
    'q': "'root' in parents and trashed=false",  # consulta para obtener los archivos en la raíz y que no estén en la papelera
}

# Token de autenticación (reemplaza 'TU_TOKEN' con tu token de acceso)
access_token = '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'

# Codifica los parámetros de la consulta
query_string = urllib.parse.urlencode(params)

# URL completa con parámetros de consulta
full_url = f"{url}?{query_string}"

# Cabecera de autorización con el token de acceso
headers = {
    'Authorization': f'Bearer {access_token}'
}

# Realiza la solicitud GET a la API de Google Drive
req = urllib.request.Request(full_url, headers=headers)
with urllib.request.urlopen(req) as response:
    # Lee y decodifica la respuesta JSON
    data = response.read().decode('utf-8')
    files_data = json.loads(data)
    files = files_data.get('files', [])

    # Imprime los nombres de los archivos
    print("Files in your Google Drive:")
    for file in files:
        print('Name: {}, ID: {}'.format(file['name'], file['id']))
