import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000/api';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await axios.get(`${API}/projects`, { headers });
    setProjects(res.data);
  };

  const createProject = async () => {
    if (!name) return;
    await axios.post(`${API}/projects`, { name, description }, { headers });
    setName('');
    setDescription('');
    fetchProjects();
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Team Task Manager</h2>
        <div>
          <span style={styles.welcome}>👋 {user?.name}</span>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </div>

      <div style={styles.card}>
        <h3>Create New Project</h3>
        <input style={styles.input} placeholder="Project Name" value={name}
          onChange={e => setName(e.target.value)} />
        <input style={styles.input} placeholder="Description"
          onChange={e => setDescription(e.target.value)} />
        <button style={styles.button} onClick={createProject}>Create Project</button>
      </div>

      <h3 style={{marginTop:'30px'}}>My Projects</h3>
      <div style={styles.grid}>
        {projects.map(p => (
          <div key={p._id} style={styles.projectCard}
            onClick={() => navigate(`/tasks/${p._id}`)}>
            <h4 style={styles.projectName}>{p.name}</h4>
            <p style={styles.projectDesc}>{p.description}</p>
            <p style={styles.adminText}>Admin: {p.admin?.name}</p>
            <p style={styles.memberText}>Members: {p.members?.length}</p>
            <button style={styles.viewBtn}>View Tasks →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth:'900px', margin:'0 auto', padding:'20px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', background:'#1a73e8', padding:'15px 20px', borderRadius:'10px', color:'white' },
  title: { margin:0, color:'white' },
  welcome: { marginRight:'15px' },
  logoutBtn: { background:'white', color:'#1a73e8', border:'none', padding:'8px 15px', borderRadius:'5px', cursor:'pointer' },
  card: { background:'white', padding:'20px', borderRadius:'10px', boxShadow:'0 2px 10px rgba(0,0,0,0.1)' },
  input: { width:'100%', padding:'10px', marginBottom:'10px', borderRadius:'5px', border:'1px solid #ddd', boxSizing:'border-box' },
  button: { background:'#1a73e8', color:'white', border:'none', padding:'10px 20px', borderRadius:'5px', cursor:'pointer' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:'15px', marginTop:'15px' },
  projectCard: { background:'white', padding:'20px', borderRadius:'10px', boxShadow:'0 2px 10px rgba(0,0,0,0.1)', cursor:'pointer' },
  projectName: { margin:'0 0 10px', color:'#1a73e8' },
  projectDesc: { color:'#666', fontSize:'14px' },
  adminText: { fontSize:'13px', color:'#333' },
  memberText: { fontSize:'13px', color:'#333' },
  viewBtn: { background:'#1a73e8', color:'white', border:'none', padding:'8px 15px', borderRadius:'5px', cursor:'pointer', marginTop:'10px' }
};

export default Projects;