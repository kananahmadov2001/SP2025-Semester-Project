# mysql-database/import_dump.py
#!/usr/bin/env python3

import os
from dotenv import load_dotenv
import mysql.connector

def main():
    # 1) Load .env for DB credentials
    load_dotenv()  # parse .env file

    DB_HOST = os.getenv("DB_HOST")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_NAME = os.getenv("DB_NAME")

    # 2) Connect to MySQL (note: not specifying database=DB_NAME yet)
    try:
        connection = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD
        )
        connection.autocommit = False
        cursor = connection.cursor()

        # 3) Drop & recreate the DB to delete everything
        print(f"Dropping and recreating database '{DB_NAME}'...")
        cursor.execute(f"DROP DATABASE IF EXISTS `{DB_NAME}`")
        cursor.execute(f"CREATE DATABASE `{DB_NAME}`")
        cursor.execute(f"USE `{DB_NAME}`")

        # 4) Read your colleague’s SQL dump file
        dump_file_path = "full_database_dump.sql"
        with open(dump_file_path, "r", encoding="utf-8") as f:
            dump_sql = f.read()

        # 5) Execute the dump in multi-statement mode
        print(f"Importing data from '{dump_file_path}'...")
        for statement in cursor.execute(dump_sql, multi=True):
            pass  # just iterate through all statements

        connection.commit()
        print("Import complete. Database is now replaced with colleague’s dump.")

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        if connection:
            connection.rollback()
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

if __name__ == "__main__":
    main()
