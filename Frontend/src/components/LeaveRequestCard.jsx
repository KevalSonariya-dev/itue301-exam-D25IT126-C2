function LeaveRequestCard({
  fromDate,
  toDate,
  days,
  leaveType,
  reason,
  status
}) {
  const colors = {
    pending: '#FFC107',
    approved: '#28A745',
    rejected: '#DC3545',
    cancelled: '#6c757d'
  };

  const badgeColor = colors[status?.toLowerCase()] || '#6c757d';

  return (
    <div
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        textAlign: 'left'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, color: '#333' }}>{leaveType} Leave</h3>
        <span
          style={{
            backgroundColor: badgeColor,
            color: '#fff',
            padding: '4px 12px',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            textTransform: 'capitalize'
          }}
        >
          {status}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        <p style={{ margin: 0 }}><strong>From:</strong> {fromDate}</p>
        <p style={{ margin: 0 }}><strong>To:</strong> {toDate}</p>
        <p style={{ margin: 0 }}><strong>Duration:</strong> {days} {days === 1 ? 'day' : 'days'}</p>
      </div>

      <p style={{ margin: 0, color: '#555' }}>
        <strong>Reason:</strong> {reason}
      </p>
    </div>
  );
}

export default LeaveRequestCard;