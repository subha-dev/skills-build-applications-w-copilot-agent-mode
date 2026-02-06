from djongo import models


class User(models.Model):
    """User model for storing fitness app users"""
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    team = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.name


class Team(models.Model):
    """Team model for storing team information"""
    name = models.CharField(max_length=255, unique=True)
    members = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'teams'

    def __str__(self):
        return self.name


class Activity(models.Model):
    """Activity model for storing user activities"""
    user = models.CharField(max_length=255)
    activity = models.CharField(max_length=255)
    distance = models.FloatField()
    date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'activities'

    def __str__(self):
        return f"{self.user} - {self.activity}"


class Leaderboard(models.Model):
    """Leaderboard model for storing team scores"""
    team = models.CharField(max_length=255, unique=True)
    points = models.IntegerField()
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'leaderboard'

    def __str__(self):
        return f"{self.team} - {self.points} points"


class Workout(models.Model):
    """Workout model for storing user workouts"""
    user = models.CharField(max_length=255)
    workout = models.CharField(max_length=255)
    reps = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'workouts'

    def __str__(self):
        return f"{self.user} - {self.workout}"
