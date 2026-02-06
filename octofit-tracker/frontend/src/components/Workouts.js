import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      
      // Get API URL based on environment
      const codespaceAPIUrl = process.env.REACT_APP_CODESPACE_NAME
        ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
        : 'http://localhost:8000/api/workouts/';
      
      console.log('Fetching Workouts from:', codespaceAPIUrl);
      
      const response = await fetch(codespaceAPIUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Workouts data fetched:', data);
      
      // Handle both paginated (.results) and plain array responses
      const workoutsList = data.results || data;
      setWorkouts(Array.isArray(workoutsList) ? workoutsList : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError(error.message);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="container mt-4">
      <div className="alert alert-info d-flex align-items-center" role="alert">
        <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
        <span>Loading workouts...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mt-4">
      <div className="alert alert-danger alert-dismissible fade show" role="alert">
        <h4 className="alert-heading">Error</h4>
        <p className="mb-0">{error}</p>
        <button type="button" className="btn-close" onClick={() => setError(null)}></button>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="display-5 fw-bold text-primary mb-2">💪 Workouts</h2>
          <p className="text-muted">View all recorded workout sessions</p>
        </div>
        <div className="col-auto">
          <button 
            className="btn btn-primary btn-lg" 
            onClick={fetchWorkouts}
          >
            <i className="bi bi-arrow-clockwise"></i> Refresh
          </button>
        </div>
      </div>

      {workouts.length === 0 ? (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <h4 className="alert-heading">No Workouts Found</h4>
          <p>There are currently no workouts logged in the system.</p>
          <button type="button" className="btn-close" onClick={() => {}}></button>
        </div>
      ) : (
        <div className="card shadow-lg">
          <div className="card-header bg-warning text-dark">
            <h5 className="mb-0 fw-bold">
              <i className="bi bi-list-check"></i> Workouts Log ({workouts.length})
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover table-striped mb-0">
                <thead className="table-dark">
                  <tr>
                    <th className="text-center" width="10%">ID</th>
                    <th width="25%">User</th>
                    <th width="30%">Workout</th>
                    <th className="text-center" width="15%">Reps</th>
                    <th width="20%">Logged Date</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.map((workout, index) => (
                    <tr key={workout.id || `${workout.user}-${workout.workout}`} className={index % 2 === 0 ? 'table-light' : ''}>
                      <td className="text-center fw-bold">{workout.id || index + 1}</td>
                      <td>
                        <span className="badge bg-secondary me-2">{workout.user.charAt(0)}</span>
                        {workout.user}
                      </td>
                      <td>
                        <span className={`badge bg-${getWorkoutColor(workout.workout)}`}>
                          {workout.workout.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-info fs-6">{workout.reps}</span>
                      </td>
                      <td>{workout.created_at ? new Date(workout.created_at).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer bg-light">
            <small className="text-muted">
              Showing <strong>{workouts.length}</strong> workouts
            </small>
          </div>
        </div>
      )}
    </div>
  );
}

const getWorkoutColor = (workout) => {
  const colors = {
    'pushups': 'danger',
    'situps': 'warning',
    'squats': 'info',
    'pullups': 'success',
    'deadlift': 'danger',
    'bench': 'primary',
  };
  return colors[workout.toLowerCase()] || 'secondary';
};

export default Workouts;
