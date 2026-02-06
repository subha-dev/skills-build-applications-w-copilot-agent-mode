import React from 'react';

function Home() {
  return (
    <div className="container mt-5">
      <div className="jumbotron">
        <h1 className="display-4">Welcome to OctoFit Tracker</h1>
        <p className="lead">Track fitness activities, join teams, and compete on the leaderboard!</p>
        <hr className="my-4" />
        <p>Use the navigation menu above to explore:</p>
        <ul>
          <li><strong>Users</strong> - View all registered users</li>
          <li><strong>Teams</strong> - See team information</li>
          <li><strong>Activities</strong> - Track fitness activities</li>
          <li><strong>Workouts</strong> - View workout records</li>
          <li><strong>Leaderboard</strong> - Check team rankings</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
