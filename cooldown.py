import datetime
import mysql.connector
global mydb

mydb = mysql.connector.connect(
    host="t",
    user="t",
    password="t",
    database="t"
    )

def UPDATE_DAILY():
    cursor = mydb.cursor()
    sql = "UPDATE users SET daily_cooldown = %s WHERE daily_cooldown = %s"
    var = (0, 1)
    cursor.execute(sql, var)
    mydb.commit()
    print("Daily Cooldown reset!")
    cursor.close()
def UPDATE_MINUTES():
    cursor = mydb.cursor()
    sql = "UPDATE users SET quiz_cooldown = %s WHERE quiz_cooldown = %s"
    var = (0, 1)
    cursor.execute(sql, var)
    mydb.commit()
    print("QUIZ COOLDOWN RESET!")
    cursor.close()

def main():
    TIME = False
    TIME_QUIZ = False
    TIMEARR = []
    TIMEARR_QUIZ = []
    c=0
    while True:
        datetime_now = datetime.datetime.now()
        DAY = int(datetime_now.strftime("%d"))
        MINUTE = int(datetime_now.strftime("%M"))
        if TIME == False:
            TIMEARR.append(DAY)
            TIME = True
            PREV_DAY = int(TIMEARR[0]) + 1
            
        if TIME_QUIZ == False:
            TIMEARR_QUIZ.append(MINUTE)
            TIME = True
            NEXT_MINUTES = int(TIMEARR_QUIZ[0] + 5)
        #Happens 00:00 everyday
        if DAY == PREV_DAY:
            print('day', DAY, 'prev_day', PREV_DAY)
            UPDATE_DAILY()
            TIME = False
            TIMEARR = []
        if NEXT_MINUTES > 59:
            NEXT_MINUTES = 0
        c+=1
        if c == 100000000:
            c=0
            print(MINUTE, ' == ', NEXT_MINUTES)
        #Happens every 10 minutes
        if MINUTE == NEXT_MINUTES:
            print('Minute', MINUTE, 'NEXT_MINUTES', NEXT_MINUTES)
            UPDATE_MINUTES()
            TIME_QUIZ = False
            TIMEARR_QUIZ = []
    
if __name__ == "__main__":
    main()