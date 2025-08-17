import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Layout() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      navigate(`/${role}`);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Outlet />
    </div>
  );
}

export default Layout;