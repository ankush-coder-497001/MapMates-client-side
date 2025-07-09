const mentionStyle = {
  control: {
    backgroundColor: '#1F2937',
    fontSize: 16,
    padding: '12px 16px',
    borderRadius: '1rem',
    border: '1px solid #555',
    color: '#fff',
  },
  highlighter: {
    overflow: 'hidden',
  },
  input: {
    margin: 0,
    color: '#fff',
  },
  suggestions: {
    list: {
      backgroundColor: '#111',
      border: '1px solid #444',
      fontSize: 14,
      borderRadius: 6,
      overflow: 'hidden',
    },
    item: {
      padding: '8px 12px',
      borderBottom: '1px solid #333',
      color: '#eee',
      '&focused': {
        backgroundColor: '#E50914',
        color: '#fff',
      },
    },
  },
};

export default mentionStyle;
