from celery import Celery
from celery.schedules import crontab

celery = Celery(__name__, broker='redis://localhost:6379/0',
                backend='redis://localhost:6379/0',)


CELERY_BEAT_SCHEDULE = {
    'monthly-report': {
        'task': 'tasks.monthly_report',
        'schedule': 50.0,
        # 'schedule': crontab(day_of_month='1'),
    },
    'daily-reminder': {
        'task': 'tasks.daily_reminder',
        'schedule': 10.0,
        # 'schedule': crontab(hour=17),
    },
    
}

celery.conf.beat_schedule = CELERY_BEAT_SCHEDULE