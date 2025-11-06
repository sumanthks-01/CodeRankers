import psycopg2

# Step 1: Connect to PostgreSQL
try:
    connection = psycopg2.connect(
        host="localhost",        # or "127.0.0.1"
        database="canteen_db",   # your database name
        user="postgres",         # default username
        password="vineeth@sql" # the password you set during installation
    )

    print("✅ Connection successful!")

    # Step 2: Create a cursor to execute SQL
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM employees;")

    # Step 3: Fetch and print data
    rows = cursor.fetchall()
    for row in rows:
        print(row)

except Exception as e:
    print("❌ Error:", e)

finally:
    if connection:
        cursor.close()
        connection.close()
        print("🔒 PostgreSQL connection closed.")
