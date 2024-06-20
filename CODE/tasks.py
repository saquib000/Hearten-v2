from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime,date

from celery_config import celery
from main import app 

with app.app_context():
    from application.models import db,User

smtp_host = 'localhost'
smtp_port = 1025
email = 'me@mail.com'
password = ''

def send_email(to,subject,content):
    msg = MIMEMultipart()
    msg["To"] = to
    msg['Subject']=subject
    msg["From"]=email
    msg.attach(MIMEText(content,'html'))
    client = SMTP(host=smtp_host,port=smtp_port)
    client.send_message(msg=msg)
    client.quit()


@celery.task
def my_task():
    return "Hello!"

@celery.task
def daily_reminder():
    with app.app_context():
        today = date.today()
        users = User.query.filter(User.last_login_at < today).all()
        user_emails = [user.email for user in users]
        msg = "Hi, You have not visited our app today :( Please visit."
        for em in user_emails:
            send_email(em,"Daily Reminder",msg)
        return "Email sent."
    
@celery.task
def monthly_report():
    with app.app_context():
        month = datetime.now().strftime("%B")
        creators = User.query.filter(User.roles.any(id=2)).all()
        # print(creators)
        for user in creators:
            total_songs=len(user.songs)
            a1=user.albums
            total_albums=len(set([i.album_name for i in a1]))
            msg = f"""
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Monthly Report</title>
                </head>
                <body>
                    <h3>Dear {user.username}</h3>
                    <h3>Report for the month {month}</h3>
                    <h4>Your total Songs : {total_songs}</h4>
                    <h4>Your total Albums : {total_albums}</h4>
                </body>
                </html>
                """
            send_email(user.email,"Monthly Report",msg)
        return "Email sent."
    
monthly_report()