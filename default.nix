{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  buildInputs = [
    pkgs.python3
    pkgs.python3Packages.flask
    pkgs.python3Packages.sqlalchemy
    pkgs.python3Packages.flask-sqlalchemy
    pkgs.python3Packages.mysqlclient
    pkgs.python3Packages.bcrypt
    pkgs.python3Packages.flask-bcrypt
    pkgs.python3Packages.python-dotenv
    pkgs.python3Packages.gunicorn
    pkgs.python3Packages.flask-migrate
    # Otros paquetes adicionales si es necesario
  ];
}
