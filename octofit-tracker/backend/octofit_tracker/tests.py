from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import User, Team, Activity, Leaderboard, Workout
import datetime


class UserTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            name="Iron Man",
            email="ironman@marvel.com",
            team="marvel"
        )

    def test_user_creation(self):
        self.assertEqual(self.user.name, "Iron Man")
        self.assertEqual(self.user.email, "ironman@marvel.com")
        self.assertEqual(self.user.team, "marvel")

    def test_user_list_api(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_detail_api(self):
        response = self.client.get(f'/api/users/{self.user.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TeamTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.team = Team.objects.create(
            name="marvel",
            members=["ironman@marvel.com", "cap@marvel.com"]
        )

    def test_team_creation(self):
        self.assertEqual(self.team.name, "marvel")
        self.assertIn("ironman@marvel.com", self.team.members)

    def test_team_list_api(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ActivityTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.activity = Activity.objects.create(
            user="ironman@marvel.com",
            activity="run",
            distance=5.0,
            date=datetime.datetime.now()
        )

    def test_activity_creation(self):
        self.assertEqual(self.activity.user, "ironman@marvel.com")
        self.assertEqual(self.activity.activity, "run")

    def test_activity_list_api(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LeaderboardTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.leaderboard = Leaderboard.objects.create(
            team="marvel",
            points=100
        )

    def test_leaderboard_creation(self):
        self.assertEqual(self.leaderboard.team, "marvel")
        self.assertEqual(self.leaderboard.points, 100)

    def test_leaderboard_list_api(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class WorkoutTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.workout = Workout.objects.create(
            user="ironman@marvel.com",
            workout="pushups",
            reps=50
        )

    def test_workout_creation(self):
        self.assertEqual(self.workout.user, "ironman@marvel.com")
        self.assertEqual(self.workout.workout, "pushups")

    def test_workout_list_api(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class APIRootTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_api_root(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('users', response.data)
        self.assertIn('teams', response.data)
        self.assertIn('activities', response.data)
        self.assertIn('leaderboard', response.data)
        self.assertIn('workouts', response.data)
