import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get API URL based on environment
      const codespaceAPIUrl = process.env.REACT_APP_CODESPACE_NAME
        ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`
        : 'http://localhost:8000/api/users/';
      
      console.log('Fetching Users from:', codespaceAPIUrl);
      
      const response = await fetch(codespaceAPIUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Users data fetched:', data);
      
      // Handle both paginated (.results) and plain array responses
      const usersList = data.results || data;
      setUsers(Array.isArray(usersList) ? usersList : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="container mt-4">
      <div className="alert alert-info d-flex align-items-center" role="alert">
        <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
        <span>Loading users...</span>
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
          <h2 className="display-5 fw-bold text-primary mb-2">👥 Users</h2>
          <p className="text-muted">Manage and view all registered users in the system</p>
        </div>
        <div className="col-auto">
          <button 
            className="btn btn-primary btn-lg" 
            onClick={fetchUsers}
          >
            <i className="bi bi-arrow-clockwise"></i> Refresh
          </button>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <h4 className="alert-heading">No Users Found</h4>
          <p>There are currently no users in the system.</p>
          <button type="button" className="btn-close" onClick={() => {}}></button>
        </div>
      ) : (
        <div className="card shadow-lg">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              <i className="bi bi-list-check"></i> Users List ({users.length})
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover table-striped mb-0">
                <thead className="table-dark">
                  <tr>
                    <th className="text-center" width="10%">ID</th>
                    <th width="25%">Name</th>
                    <th width="30%">Email</th>
                    <th width="20%">Team</th>
                    <th width="15%">Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id || user.email} className={index % 2 === 0 ? 'table-light' : ''}>
                      <td className="text-center fw-bold">{user.id || index + 1}</td>
                      <td>
                        <span className="badge bg-secondary me-2">{user.name.charAt(0)}</span>
                        {user.name}
                      </td>
                      <td>
                        <a href={`mailto:${user.email}`} className="link-primary text-decoration-none">
                          {user.email}
                        </a>
                      </td>
                      <td>
                        <span className={`badge bg-${user.team === 'marvel' ? 'danger' : 'primary'}`}>
                          {user.team.toUpperCase()}
                        </span>
                      </td>
                      <td>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer bg-light">
            <small className="text-muted">
              Showing <strong>{users.length}</strong> users
            </small>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
