# mysql-database/import_data.py
#!/usr/bin/env python3

import os
import json
import mysql.connector
from dotenv import load_dotenv

# ------------------------------------------------------------------------------
# 1) Load environment variables from .env
# ------------------------------------------------------------------------------
load_dotenv()  # parse .env file

DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# ------------------------------------------------------------------------------
# 2) Read JSON from disk
# ------------------------------------------------------------------------------
PLAYERS_JSON_PATH = "static/allnbaplayers.json"
STATS_JSON_PATH   = "static/stats.json"

with open(PLAYERS_JSON_PATH, "r", encoding="utf-8") as f:
    players_data = json.load(f)  # entire dict, including "rows"

with open(STATS_JSON_PATH, "r", encoding="utf-8") as f:
    stats_data = json.load(f)  # entire dict, including "rows"

players_rows = players_data["rows"]  # list of lists
stats_rows   = stats_data["rows"]    # list of lists

# ------------------------------------------------------------------------------
# 3) Connect to MySQL
# ------------------------------------------------------------------------------
try:
    connection = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    connection.autocommit = False  # we'll commit manually

    cursor = connection.cursor()

    # ------------------------------------------------------------------------------
    # 4) Insert into the "players" table
    #
    # MySQL "players" columns:
    #    id (int, PK), firstname (text), lastname (text), position (text),
    #    teamid (int), team (text)
    #
    # JSON "players" rows shape:
    #    [ id, name, lastname, position, teamid, team ]
    #
    # We must map JSON's "name" -> MySQL's "firstname"
    # ------------------------------------------------------------------------------
    print("Inserting data into `players` table...")
    insert_players_sql = """
        INSERT INTO players (id, firstname, lastname, position, teamid, team)
        VALUES (%s, %s, %s, %s, %s, %s)
    """

    # Optional: clear existing table if desired
    # cursor.execute("TRUNCATE TABLE players")

    for row in players_rows:
        # row should look like: [id, name, lastname, position, teamid, team]
        # Example row: [4, "Steven", "Adams", "C", 14, "Houston Rockets"]
        p_id       = row[0]
        firstname  = row[1]
        lastname   = row[2]
        position   = row[3]
        teamid     = row[4]
        team       = row[5]

        cursor.execute(insert_players_sql, (p_id, firstname, lastname, position, teamid, team))

    print(f"{cursor.rowcount} rows inserted into `players` (last batch).")

    # ------------------------------------------------------------------------------
    # 5) Insert into the "player_stats" table
    #
    # MySQL "player_stats" columns:
    #    player_id, firstname, lastname, points, minutes_played,
    #    field_goals_made,   field_goals_attempted,
    #    free_throws_made,   free_throws_attempted,
    #    three_pointers_made, three_pointers_attempted,
    #    offensive_rebounds, defensive_rebounds, total_rebounds,
    #    assists, personal_fouls, steals, turnovers, blocks, plus_minus, num_games
    #
    # JSON "stats" rows shape:
    #   [
    #     id, firstname, lastname, points,
    #     min, fgm, fga, ftm, fta,
    #     tpm, tpa, offReb, defReb, totReb,
    #     assists, pFouls, steals, turnovers,
    #     blocks, plusMinus, numGames
    #   ]
    #
    # We must rename columns, e.g. "id" -> "player_id", "min" -> "minutes_played",
    # "fgm" -> "field_goals_made", "pFouls" -> "personal_fouls", etc.
    # ------------------------------------------------------------------------------
    print("Inserting data into `player_stats` table...")
    insert_stats_sql = """
        INSERT INTO player_stats (
            player_id,
            firstname,
            lastname,
            points,
            minutes_played,
            field_goals_made,
            field_goals_attempted,
            free_throws_made,
            free_throws_attempted,
            three_pointers_made,
            three_pointers_attempted,
            offensive_rebounds,
            defensive_rebounds,
            total_rebounds,
            assists,
            personal_fouls,
            steals,
            turnovers,
            blocks,
            plus_minus,
            num_games
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    # Optional: clear existing table if desired
    # cursor.execute("TRUNCATE TABLE player_stats")

    for row in stats_rows:
        # row is in the order:
        #  0=id, 1=firstname, 2=lastname, 3=points,
        #  4=min, 5=fgm, 6=fga, 7=ftm, 8=fta,
        #  9=tpm, 10=tpa, 11=offReb, 12=defReb, 13=totReb,
        #  14=assists, 15=pFouls, 16=steals, 17=turnovers,
        #  18=blocks, 19=plusMinus, 20=numGames
        player_id              = row[0]
        firstname              = row[1]
        lastname               = row[2]
        points                 = row[3]
        minutes_played         = row[4]   # 'min' in JSON
        field_goals_made       = row[5]   # 'fgm'
        field_goals_attempted  = row[6]   # 'fga'
        free_throws_made       = row[7]   # 'ftm'
        free_throws_attempted  = row[8]   # 'fta'
        three_pointers_made    = row[9]   # 'tpm'
        three_pointers_attempted = row[10]# 'tpa'
        offensive_rebounds     = row[11]  # 'offReb'
        defensive_rebounds     = row[12]  # 'defReb'
        total_rebounds         = row[13]  # 'totReb'
        assists                = row[14]
        personal_fouls         = row[15]  # 'pFouls'
        steals                 = row[16]
        turnovers              = row[17]
        blocks                 = row[18]
        plus_minus             = row[19]  # 'plusMinus'
        num_games              = row[20]  # 'numGames'

        cursor.execute(
            insert_stats_sql,
            (
                player_id,
                firstname,
                lastname,
                points,
                minutes_played,
                field_goals_made,
                field_goals_attempted,
                free_throws_made,
                free_throws_attempted,
                three_pointers_made,
                three_pointers_attempted,
                offensive_rebounds,
                defensive_rebounds,
                total_rebounds,
                assists,
                personal_fouls,
                steals,
                turnovers,
                blocks,
                plus_minus,
                num_games
            )
        )

    print(f"{cursor.rowcount} rows inserted into `player_stats` (last batch).")

    # ------------------------------------------------------------------------------
    # 6) Commit changes
    # ------------------------------------------------------------------------------
    connection.commit()
    print("Data successfully imported and committed.")

except mysql.connector.Error as err:
    print(f"Error: {err}")
    if connection:
        connection.rollback()
finally:
    if cursor:
        cursor.close()
    if connection:
        connection.close()
