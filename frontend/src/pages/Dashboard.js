import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const API = 'http://localhost:5000/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = location.state?.projectId;
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    if (projectId) fetchStats();
  }, []);

  const fetchStats = async () => {
    const res = await axios.get(`${API}/tasks/dashboard/${projectId}`, { headers });
    setStats(res.data);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
        <h2 style={styles.title}>Project Dashboard</h2>
        <div></div>
      </div>

      {stats ? (
        <div style={styles.grid}>
          <div style={{...styles.statCard, background:'#1a73e8'}}>
            <h1 style={styles.statNumber}>{stats.total}</h1>
            <p style={styles.statLabel}>Total Tasks</p>
          </div>
          <div style={{...styles.statCard, background:'#2196f3'}}>
            <h1 style={styles.statNumber}>{stats.todo}</h1>
            <p style={styles.statLabel}>To Do</p>
          </div>
          <div style={{...styles.statCard, background:'#ff9800'}}>
            <h1 style={styles.statNumber}>{stats.inProgress}</h1>
            <p style={styles.statLabel}>In Progress</p>
          </div>
          <div style={{...styles.statCard, background:'#4caf50'}}>
            <h1 style={styles.statNumber}>{stats.done}</h1>
            <p style={styles.statLabel}>Done</p>
          </div>
          <div style={{...styles.statCard, background:'#f44336'}}>
            <h1 style={styles.statNumber}>{stats.overdue}</h1>
            <p style={styles.statLabel}>Overdue</p>
          </div>
        </div>
      ) : (
        <p style={styles.noData}>No data available</p>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth:'900px', margin:'0 auto', padding:'20px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', background:'#1a73e8', padding:'15px 20px', borderRadius:'10px', color:'white', marginBottom:'30px' },
  title: { margin:0, color:'white' },
  backBtn: { background:'white', color:'#1a73e8', border:'none', padding:'8px 15px', borderRadius:'5px', cursor:'pointer' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:'20px' },
  statCard: { padding:'30px 20px', borderRadius:'10px', textAlign:'center', color:'white', boxShadow:'0 2px 10px rgba(0,0,0,0.1)' },
  statNumber: { margin:0, fontSize:'48px', fontWeight:'bold' },
  statLabel: { margin:'10px 0 0', fontSize:'16px' },
  noData: { textAlign:'center', color:'#666', fontSize:'18px' }
};

export default Dashboard;