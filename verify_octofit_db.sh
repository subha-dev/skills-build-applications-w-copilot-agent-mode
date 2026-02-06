#!/bin/bash
mongosh --eval '
use octofit_db;
show collections;
print("\nSample users:");
printjson(db.users.findOne());
print("\nSample teams:");
printjson(db.teams.findOne());
print("\nSample activities:");
printjson(db.activities.findOne());
print("\nSample leaderboard:");
printjson(db.leaderboard.findOne());
print("\nSample workouts:");
printjson(db.workouts.findOne());
'