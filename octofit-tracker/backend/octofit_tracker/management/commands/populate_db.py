from django.core.management.base import BaseCommand
from django.conf import settings
from django.db import connections

import datetime

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        db = connections['default'].cursor().db_conn.client[settings.DATABASES['default']['NAME']]

        # Drop collections if they exist
        db.users.drop()
        db.teams.drop()
        db.activities.drop()
        db.leaderboard.drop()
        db.workouts.drop()

        # Create unique index on email
        db.users.create_index([('email', 1)], unique=True)

        # Sample users
        users = [
            {"name": "Iron Man", "email": "ironman@marvel.com", "team": "marvel"},
            {"name": "Captain America", "email": "cap@marvel.com", "team": "marvel"},
            {"name": "Wonder Woman", "email": "wonderwoman@dc.com", "team": "dc"},
            {"name": "Batman", "email": "batman@dc.com", "team": "dc"},
        ]
        db.users.insert_many(users)

        # Sample teams
        teams = [
            {"name": "marvel", "members": ["ironman@marvel.com", "cap@marvel.com"]},
            {"name": "dc", "members": ["wonderwoman@dc.com", "batman@dc.com"]},
        ]
        db.teams.insert_many(teams)

        # Sample activities
        activities = [
            {"user": "ironman@marvel.com", "activity": "run", "distance": 5, "date": datetime.datetime.now()},
            {"user": "cap@marvel.com", "activity": "cycle", "distance": 20, "date": datetime.datetime.now()},
            {"user": "wonderwoman@dc.com", "activity": "swim", "distance": 2, "date": datetime.datetime.now()},
            {"user": "batman@dc.com", "activity": "walk", "distance": 3, "date": datetime.datetime.now()},
        ]
        db.activities.insert_many(activities)

        # Sample leaderboard
        leaderboard = [
            {"team": "marvel", "points": 100},
            {"team": "dc", "points": 90},
        ]
        db.leaderboard.insert_many(leaderboard)

        # Sample workouts
        workouts = [
            {"user": "ironman@marvel.com", "workout": "pushups", "reps": 50},
            {"user": "cap@marvel.com", "workout": "situps", "reps": 40},
            {"user": "wonderwoman@dc.com", "workout": "squats", "reps": 60},
            {"user": "batman@dc.com", "workout": "pullups", "reps": 30},
        ]
        db.workouts.insert_many(workouts)

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data.'))
