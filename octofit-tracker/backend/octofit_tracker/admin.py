from django.contrib import admin
from .models import User, Team, Activity, Leaderboard, Workout


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'team', 'created_at')
    list_filter = ('team', 'created_at')
    search_fields = ('name', 'email')


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity', 'distance', 'date', 'created_at')
    list_filter = ('activity', 'date')
    search_fields = ('user',)


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ('team', 'points', 'updated_at')
    list_filter = ('updated_at',)
    search_fields = ('team',)


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('user', 'workout', 'reps', 'created_at')
    list_filter = ('workout', 'created_at')
    search_fields = ('user',)
