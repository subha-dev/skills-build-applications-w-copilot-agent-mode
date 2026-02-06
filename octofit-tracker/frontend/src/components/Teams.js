import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      
      // Get API URL based on environment
      const codespaceAPIUrl = process.env.REACT_APP_CODESPACE_NAME
        ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
        : 'http://localhost:8000/api/teams/';
      
      console.log('Fetching Teams from:', codespaceAPIUrl);
      
      const response = await fetch(codespaceAPIUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Teams data fetched:', data);
      
      // Handle both paginated (.results) and plain array responses
      const teamsList = data.results || data;
      setTeams(Array.isArray(teamsList) ? teamsList : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError(error.message);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="container mt-4">
      <div className="alert alert-info d-flex align-items-center" role="alert">
        <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
        <span>Loading teams...</span>
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
          <h2 className="display-5 fw-bold text-primary mb-2">🏆 Teams</h2>
          <p className="text-muted">View team information and member details</p>
        </div>
        <div className="col-auto">
          <button 
            className="btn btn-primary btn-lg" 
            onClick={fetchTeams}
          >
            <i className="bi bi-arrow-clockwise"></i> Refresh
          </button>
        </div>
      </div>

      {teams.length === 0 ? (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <h4 className="alert-heading">No Teams Found</h4>
          <p>There are currently no teams in the system.</p>
          <button type="button" className="btn-close" onClick={() => {}}></button>
        </div>
      ) : (
        <div className="row g-4">
          {teams.map((team) => (
            <div key={team.id || team.name} className="col-lg-6 col-xl-4">
              <div className="card shadow-lg h-100 border-0 team-card">
                <div className={`card-header bg-gradient text-white py-3 ${team.name === 'marvel' ? 'bg-danger' : 'bg-primary'}`}>
                  <h5 className="mb-0 fw-bold">
                    <i className="bi bi-people-fill me-2"></i>
                    {team.name.toUpperCase()}
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label text-muted fw-bold">Members ({Array.isArray(team.members) ? team.members.length : 1})</label>
                    <div className="list-group">
                      {Array.isArray(team.members) ? (
                        team.members.map((member, idx) => (
                          <a 
                            key={idx}
                            href={`mailto:${member}`}
                            className="list-group-item list-group-item-action border-0 py-2"
                          >
                            <i className="bi bi-person-circle me-2"></i>
                            {member}
                          </a>
                        ))
                      ) : (
                        <div className="alert alert-sm alert-info py-2 mb-0">
                          {team.members}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-light border-top">
                  <small className="text-muted">
                    <i className="bi bi-calendar-event me-1"></i>
                    Created: {team.created_at ? new Date(team.created_at).toLocaleDateString() : 'N/A'}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Teams;
