import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      
      // Get API URL based on environment
      const codespaceAPIUrl = process.env.REACT_APP_CODESPACE_NAME
        ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
        : 'http://localhost:8000/api/activities/';
      
      console.log('Fetching Activities from:', codespaceAPIUrl);
      
      const response = await fetch(codespaceAPIUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Activities data fetched:', data);
      
      // Handle both paginated (.results) and plain array responses
      const activitiesList = data.results || data;
      setActivities(Array.isArray(activitiesList) ? activitiesList : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError(error.message);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="container mt-4">
      <div className="alert alert-info d-flex align-items-center" role="alert">
        <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
        <span>Loading activities...</span>
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
          <h2 className="display-5 fw-bold text-primary mb-2">🏃 Activities</h2>
          <p className="text-muted">Track and view all logged fitness activities</p>
        </div>
        <div className="col-auto">
          <button 
            className="btn btn-primary btn-lg" 
            onClick={fetchActivities}
          >
            <i className="bi bi-arrow-clockwise"></i> Refresh
          </button>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <h4 className="alert-heading">No Activities Found</h4>
          <p>There are currently no activities logged in the system.</p>
          <button type="button" className="btn-close" onClick={() => {}}></button>
        </div>
      ) : (
        <div className="card shadow-lg">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">
              <i className="bi bi-list-check"></i> Activities Log ({activities.length})
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover table-striped mb-0">
                <thead className="table-dark">
                  <tr>
                    <th className="text-center" width="8%">ID</th>
                    <th width="20%">User</th>
                    <th width="18%">Activity</th>
                    <th className="text-center" width="12%">Distance</th>
                    <th width="18%">Activity Date</th>
                    <th width="14%">Logged Date</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, index) => (
                    <tr key={activity.id || `${activity.user}-${activity.date}`} className={index % 2 === 0 ? 'table-light' : ''}>
                      <td className="text-center fw-bold">{activity.id || index + 1}</td>
                      <td>
                        <span className="badge bg-info me-2">{activity.user.charAt(0)}</span>
                        {activity.user}
                      </td>
                      <td>
                        <span className={`badge bg-${getActivityColor(activity.activity)}`}>
                          {activity.activity.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="fw-bold">{activity.distance}</span> km
                      </td>
                      <td>{activity.date ? new Date(activity.date).toLocaleDateString() : 'N/A'}</td>
                      <td>{activity.created_at ? new Date(activity.created_at).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer bg-light">
            <small className="text-muted">
              Showing <strong>{activities.length}</strong> activities
            </small>
          </div>
        </div>
      )}
    </div>
  );
}

const getActivityColor = (activity) => {
  const colors = {
    'run': 'danger',
    'walk': 'warning',
    'cycle': 'info',
    'swim': 'primary',
    'workout': 'success',
  };
  return colors[activity.toLowerCase()] || 'secondary';
};

export default Activities;
