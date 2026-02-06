import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      // Get API URL based on environment
      const codespaceAPIUrl = process.env.REACT_APP_CODESPACE_NAME
        ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
        : 'http://localhost:8000/api/leaderboard/';
      
      console.log('Fetching Leaderboard from:', codespaceAPIUrl);
      
      const response = await fetch(codespaceAPIUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Leaderboard data fetched:', data);
      
      // Handle both paginated (.results) and plain array responses
      const leaderboardList = data.results || data;
      const sortedData = Array.isArray(leaderboardList)
        ? leaderboardList.sort((a, b) => (b.points || 0) - (a.points || 0))
        : [];
      
      setLeaderboard(sortedData);
      setError(null);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError(error.message);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="container mt-4">
      <div className="alert alert-info d-flex align-items-center" role="alert">
        <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
        <span>Loading leaderboard...</span>
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
          <h2 className="display-5 fw-bold text-primary mb-2">⭐ Leaderboard</h2>
          <p className="text-muted">Team rankings and competitive standings</p>
        </div>
        <div className="col-auto">
          <button 
            className="btn btn-primary btn-lg" 
            onClick={fetchLeaderboard}
          >
            <i className="bi bi-arrow-clockwise"></i> Refresh
          </button>
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <h4 className="alert-heading">No Leaderboard Data</h4>
          <p>There are currently no teams or points recorded in the system.</p>
          <button type="button" className="btn-close" onClick={() => {}}></button>
        </div>
      ) : (
        <div className="row">
          {/* Podium/Cards View */}
          <div className="col-12 mb-4">
            <div className="row g-3">
              {leaderboard.slice(0, 3).map((entry, index) => (
                <div key={entry.id || entry.team} className="col-lg-4 col-md-6">
                  <div className={`card shadow-lg position-relative podium-${index + 1}`}>
                    <div className={`card-header text-white text-center py-3 ${getPodiumColor(index)}`}>
                      <h4 className="mb-0">{getMedalEmoji(index)}</h4>
                      <h5 className="mb-0">Position {index + 1}</h5>
                    </div>
                    <div className="card-body text-center">
                      <h3 className="card-title fw-bold text-uppercase">
                        {entry.team}
                      </h3>
                      <div className="mb-3">
                        <span className={`badge bg-${getPointsBadgeColor(index)} fs-5 px-3 py-2`}>
                          {entry.points} Points
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Leaderboard Table */}
          <div className="col-12">
            <div className="card shadow-lg">
              <div className="card-header bg-secondary text-white">
                <h5 className="mb-0">
                  <i className="bi bi-list-task"></i> Full Rankings
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover table-striped mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th className="text-center" width="10%">Rank</th>
                        <th width="35%">Team</th>
                        <th className="text-center" width="30%">Points</th>
                        <th width="25%">Last Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry, index) => (
                        <tr key={entry.id || entry.team} className={`${index < 3 ? 'table-success' : ''} ${index % 2 === 0 ? 'table-light' : ''}`}>
                          <td className="text-center fw-bold fs-5">
                            {getMedalEmoji(index)}
                            {index > 2 && <span className="ms-2">{index + 1}</span>}
                          </td>
                          <td>
                            <strong className="text-uppercase">{entry.team}</strong>
                          </td>
                          <td className="text-center">
                            <span className={`badge bg-${getPointsBadgeColor(index)} fs-6`}>
                              {entry.points} pts
                            </span>
                          </td>
                          <td>
                            {entry.updated_at
                              ? new Date(entry.updated_at).toLocaleDateString()
                              : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer bg-light">
                <small className="text-muted">
                  Showing <strong>{leaderboard.length}</strong> teams
                </small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const getMedalEmoji = (index) => {
  const medals = ['🥇', '🥈', '🥉'];
  return medals[index] || '🏅';
};

const getPodiumColor = (index) => {
  const colors = ['bg-success', 'bg-secondary', 'bg-warning'];
  return colors[index] || 'bg-primary';
};

const getPointsBadgeColor = (index) => {
  const colors = ['success', 'secondary', 'warning'];
  return colors[index] || 'primary';
};

export default Leaderboard;
