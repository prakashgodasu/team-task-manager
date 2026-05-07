import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API = 'http://localhost:5000/api';

function Tasks() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title:'', description:'', dueDate:'', priority:'Medium' });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get(`${API}/tasks/project/${projectId}`, { headers });
    setTasks(res.data);
  };

  const createTask = async () => {
    if (!form.title) return;
    await axios.post(`${API}/tasks`, { ...form, project: projectId }, { headers });
    setForm({ title:'', description:'', dueDate:'', priority:'Medium' });
    fetchTasks();
  };

  const updateStatus = async (id, status) => {
    await axios.put(`${API}/tasks/${id}`, { status }, { headers });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/tasks/${id}`, { headers });
    fetchTasks();
  };

  const getStatusColor = (status) => {
    if (status === 'Done') return '#4caf50';
    if (status === 'In Progress') return '#ff9800';
    return '#2196f3';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'High') return '#f44336';
    if (priority === 'Medium') return '#ff9800';
    return '#4caf50';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/projects')}>← Back</button>
        <h2 style={styles.title}>Project Tasks</h2>
        <button style={styles.dashBtn} onClick={() => navigate('/dashboard', { state: { projectId } })}>Dashboard</button>
      </div>

      <div style={styles.card}>
        <h3>Add New Task</h3>
        <input style={styles.input} placeholder="Task Title" value={form.title}
          onChange={e => setForm({...form, title: e.target.value})} />
        <input style={styles.input} placeholder="Description"
          onChange={e => setForm({...form, description: e.target.value})} />
        <input style={styles.input} type="date"
          onChange={e => setForm({...form, dueDate: e.target.value})} />
        <select style={styles.input}
          onChange={e => setForm({...form, priority: e.target.value})}>
          <option>Medium</option>
          <option>High</option>
          <option>Low</option>
        </select>
        <button style={styles.button} onClick={createTask}>Add Task</button>
      </div>

      <h3 style={{marginTop:'30px'}}>Tasks ({tasks.length})</h3>
      <div style={styles.taskList}>
        {tasks.map(t => (
          <div key={t._id} style={styles.taskCard}>
            <div style={styles.taskHeader}>
              <h4 style={styles.taskTitle}>{t.title}</h4>
              <span style={{...styles.badge, background: getPriorityColor(t.priority)}}>{t.priority}</span>
            </div>
            <p style={styles.taskDesc}>{t.description}</p>
            {t.dueDate && <p style={styles.dueDate}>Due: {new Date(t.dueDate).toLocaleDateString()}</p>}
            <div style={styles.taskFooter}>
              <span style={{...styles.statusBadge, background: getStatusColor(t.status)}}>{t.status}</span>
              <select style={styles.select} value={t.status}
                onChange={e => updateStatus(t._id, e.target.value)}>
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
              <button style={styles.deleteBtn} onClick={() => deleteTask(t._id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth:'900px', margin:'0 auto', padding:'20px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', background:'#1a73e8', padding:'15px 20px', borderRadius:'10px', color:'white', marginBottom:'20px' },
  title: { margin:0, color:'white' },
  backBtn: { background:'white', color:'#1a73e8', border:'none', padding:'8px 15px', borderRadius:'5px', cursor:'pointer' },
  dashBtn: { background:'white', color:'#1a73e8', border:'none', padding:'8px 15px', borderRadius:'5px', cursor:'pointer' },
  card: { background:'white', padding:'20px', borderRadius:'10px', boxShadow:'0 2px 10px rgba(0,0,0,0.1)' },
  input: { width:'100%', padding:'10px', marginBottom:'10px', borderRadius:'5px', border:'1px solid #ddd', boxSizing:'border-box' },
  button: { background:'#1a73e8', color:'white', border:'none', padding:'10px 20px', borderRadius:'5px', cursor:'pointer' },
  taskList: { display:'flex', flexDirection:'column', gap:'15px' },
  taskCard: { background:'white', padding:'20px', borderRadius:'10px', boxShadow:'0 2px 10px rgba(0,0,0,0.1)' },
  taskHeader: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  taskTitle: { margin:0, color:'#333' },
  badge: { padding:'4px 10px', borderRadius:'20px', color:'white', fontSize:'12px' },
  taskDesc: { color:'#666', fontSize:'14px', margin:'8px 0' },
  dueDate: { fontSize:'13px', color:'#999' },
  taskFooter: { display:'flex', alignItems:'center', gap:'10px', marginTop:'10px' },
  statusBadge: { padding:'4px 10px', borderRadius:'20px', color:'white', fontSize:'12px' },
  select: { padding:'5px', borderRadius:'5px', border:'1px solid #ddd' },
  deleteBtn: { background:'none', border:'none', cursor:'pointer', fontSize:'18px' }
};

export default Tasks;