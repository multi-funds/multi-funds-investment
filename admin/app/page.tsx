import React from 'react';

export default function Page() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <h1>Admin Dashboard</h1>
      <nav>
        <ul>
          <li><a href="#stats">Stats Grid</a></li>
          <li><a href="#transactions">Transaction Management</a></li>
          <li><a href="#users">User Management</a></li>
          <li><a href="#fees">Fee Configuration</a></li>
          <li><a href="#audit">Audit Logs</a></li>
        </ul>
      </nav>
      <section id="stats">
        <h2>Stats Grid</h2>
        <p>Placeholder for stats components.</p>
      </section>
      <section id="transactions">
        <h2>Transaction Management</h2>
        <p>Placeholder for transaction management UI.</p>
      </section>
      <section id="users">
        <h2>User Management</h2>
        <p>Placeholder for user management UI.</p>
      </section>
      <section id="fees">
        <h2>Fee Configuration</h2>
        <p>Placeholder for fee configuration UI.</p>
      </section>
      <section id="audit">
        <h2>Audit Logs</h2>
        <p>Placeholder for audit logs UI.</p>
      </section>
    </div>
  );
}
