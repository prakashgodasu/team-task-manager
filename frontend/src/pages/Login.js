import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API = 'https://team-task-manager-production-fbe7.up.railway.app/api';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/projects');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Team Task Manager</h2>
        <h3 style={styles.subtitle}>Login</h3>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} placeholder="Email" type="email"
          onChange={e => setForm({...form, email: e.target.value})} />
        <input style={styles.input} placeholder="Password" type="password"
          onChange={e => setForm({...form, password: e.target.value})} />
        <button style={styles.button} onClick={handleSubmit}>Login</button>
        <p style={styles.link}>Don't have an account? <Link to="/signup">Signup</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#f0f2f5' },
  card: { background:'white', padding:'40px', borderRadius:'10px', boxShadow:'0 2px 10px rgba(0,0,0,0.1)', width:'350px' },
  title: { textAlign:'center', color:'#1a73e8', marginBottom:'5px' },
  subtitle: { textAlign:'center', color:'#333', marginBottom:'20px' },
  input: { width:'100%', padding:'10px', marginBottom:'15px', borderRadius:'5px', border:'1px solid #ddd', boxSizing:'border-box' },
  button: { width:'100%', padding:'10px', background:'#1a73e8', color:'white', border:'none', borderRadius:'5px', cursor:'pointer', fontSize:'16px' },
  error: { color:'red', textAlign:'center' },
  link: { textAlign:'center', marginTop:'15px' }
};

export default Login;