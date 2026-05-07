import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API = 'http://localhost:5000/api';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('All fields are required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      console.log('Sending signup request:', form);
      const res = await axios.post(`${API}/auth/signup`, form);
      console.log('Signup successful:', res.data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/projects');
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      setError(err.response?.data?.message || err.message || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Team Task Manager</h2>
        <h3 style={styles.subtitle}>Create Account</h3>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} placeholder="Full Name" value={form.name}
          onChange={e => setForm({...form, name: e.target.value})} />
        <input style={styles.input} placeholder="Email" type="email" value={form.email}
          onChange={e => setForm({...form, email: e.target.value})} />
        <input style={styles.input} placeholder="Password" type="password" value={form.password}
          onChange={e => setForm({...form, password: e.target.value})} />
        <button style={styles.button} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        <p style={styles.link}>Already have an account? <Link to="/login">Login</Link></p>
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
  error: { color:'red', textAlign:'center', marginBottom:'15px', fontSize:'14px' },
  link: { textAlign:'center', marginTop:'15px' }
};

export default Signup;