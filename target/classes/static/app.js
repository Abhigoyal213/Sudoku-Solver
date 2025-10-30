const grid = document.getElementById('grid');
const validateStatusEl = document.getElementById('validateStatus');
const solveStatusEl = document.getElementById('solveStatus');

// Build inputs with enhanced styling and navigation
for (let r = 0; r < 9; r++) {
  for (let c = 0; c < 9; c++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 1;
    input.className = 'cell';
    input.dataset.row = r;
    input.dataset.col = c;
    
    // Add 3x3 box borders
    if (c === 2 || c === 5) input.classList.add('box-right');
    if (r === 2 || r === 5) input.classList.add('box-bottom');
    
    // Enhanced input validation with visual feedback
    input.addEventListener('input', (e) => {
      const v = e.target.value.trim();
      if (v === '') return;
      if (!/^[1-9]$/.test(v)) {
        e.target.value = '';
        e.target.style.borderColor = 'var(--error-neon)';
        e.target.style.boxShadow = '0 0 15px rgba(255, 51, 102, 0.5)';
        setTimeout(() => {
          e.target.style.borderColor = '';
          e.target.style.boxShadow = '';
        }, 1000);
      } else {
        e.target.style.borderColor = 'var(--accent-neon)';
        e.target.style.boxShadow = '0 0 10px rgba(0, 255, 136, 0.3)';
        setTimeout(() => {
          e.target.style.borderColor = '';
          e.target.style.boxShadow = '';
        }, 500);
      }
    });
    
    grid.appendChild(input);
  }
}

// Get all cells for navigation
const cells = Array.from(document.querySelectorAll('.cell'));

// Helper function to get cell index from row and column
function getCellIndex(row, col) {
  return row * 9 + col;
}

// Helper function to get row and column from cell index
function getRowCol(index) {
  return {
    row: Math.floor(index / 9),
    col: index % 9
  };
}

// Add arrow key navigation to each cell
cells.forEach((cell, index) => {
  cell.addEventListener('keydown', (e) => {
    const { row, col } = getRowCol(index);
    let newRow = row;
    let newCol = col;
    let shouldPreventDefault = false;

    switch(e.key) {
      case 'ArrowUp':
        newRow = row === 0 ? 8 : row - 1; // Wrap to bottom if at top
        shouldPreventDefault = true;
        break;
        
      case 'ArrowDown':
        newRow = row === 8 ? 0 : row + 1; // Wrap to top if at bottom
        shouldPreventDefault = true;
        break;
        
      case 'ArrowLeft':
        if (col === 0) {
          // At leftmost column, wrap to rightmost column of previous row
          newCol = 8;
          newRow = row === 0 ? 8 : row - 1;
        } else {
          newCol = col - 1;
        }
        shouldPreventDefault = true;
        break;
        
      case 'ArrowRight':
        if (col === 8) {
          // At rightmost column, wrap to leftmost column of next row
          newCol = 0;
          newRow = row === 8 ? 0 : row + 1;
        } else {
          newCol = col + 1;
        }
        shouldPreventDefault = true;
        break;
        
      case 'Enter':
        // Move to next cell (like Tab behavior)
        if (col === 8) {
          newCol = 0;
          newRow = row === 8 ? 0 : row + 1;
        } else {
          newCol = col + 1;
        }
        shouldPreventDefault = true;
        break;
        
      case 'Escape':
        // Clear current cell and stay focused
        cell.value = '';
        cell.style.background = '';
        cell.style.color = '';
        cell.style.borderColor = '';
        shouldPreventDefault = true;
        break;
    }

    if (shouldPreventDefault) {
      e.preventDefault();
      
      // Focus new cell if position changed
      if (newRow !== row || newCol !== col) {
        const newIndex = getCellIndex(newRow, newCol);
        const newCell = cells[newIndex];
        newCell.focus();
        
        // Add smooth transition effect
        newCell.style.transform = 'scale(1.1)';
        setTimeout(() => {
          newCell.style.transform = 'scale(1)';
        }, 150);
      }
    }
  });
});

function readBoard() {
  const cells = grid.querySelectorAll('.cell');
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  cells.forEach((cell, idx) => {
    const r = Math.floor(idx / 9);
    const c = idx % 9;
    const v = cell.value.trim();
    board[r][c] = v === '' ? 0 : parseInt(v, 10);
  });
  return board;
}

function writeBoard(board) {
  const cells = grid.querySelectorAll('.cell');
  cells.forEach((cell, idx) => {
    const r = Math.floor(idx / 9);
    const c = idx % 9;
    const value = board[r][c];
    if (value !== 0) {
      cell.value = String(value);
      // Add solved cell styling
      cell.style.background = 'rgba(0, 255, 136, 0.2)';
      cell.style.color = 'var(--accent-neon)';
      cell.style.borderColor = 'var(--accent-neon)';
    }
  });
}

function updateStatus(element, message, type = 'default', loading = false) {
  const messageEl = element.querySelector('.status-message');
  messageEl.textContent = message;
  
  // Remove all status classes
  element.classList.remove('status-success', 'status-error', 'status-loading');
  
  // Add appropriate class
  if (loading) {
    element.classList.add('status-loading');
  } else if (type === 'success') {
    element.classList.add('status-success');
  } else if (type === 'error') {
    element.classList.add('status-error');
  }
}

async function postJSON(path, payload) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

// Enhanced validate button with better UX
document.getElementById('validateBtn').addEventListener('click', async () => {
  updateStatus(validateStatusEl, 'Analyzing constraints...', 'default', true);
  
  try {
    const data = await postJSON('/api/validate', { board: readBoard() });
    if (data.ok) {
      updateStatus(validateStatusEl, 'Board is valid ✓', 'success');
    } else {
      updateStatus(validateStatusEl, 'Invalid configuration ✗', 'error');
    }
  } catch (e) {
    updateStatus(validateStatusEl, 'Validation failed', 'error');
  }
});

// Enhanced solve button with better UX
document.getElementById('solveBtn').addEventListener('click', async () => {
  updateStatus(solveStatusEl, 'Running backtracking...', 'default', true);
  
  try {
    const data = await postJSON('/api/solve', { board: readBoard() });
    if (data.ok && data.board) {
      writeBoard(data.board);
      updateStatus(solveStatusEl, 'Solution found! ✓', 'success');
      
      // Add celebration effect
      const container = document.querySelector('.sudoku-container');
      container.style.animation = 'none';
      setTimeout(() => {
        container.style.animation = 'celebration-glow 2s ease-in-out';
      }, 10);
    } else {
      updateStatus(solveStatusEl, data.message || 'No solution exists ✗', 'error');
    }
  } catch (e) {
    updateStatus(solveStatusEl, 'Solver failed', 'error');
  }
});

// Enhanced clear button
document.getElementById('clearBtn').addEventListener('click', () => {
  const cells = grid.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.value = '';
    cell.style.background = '';
    cell.style.color = '';
    cell.style.borderColor = '';
  });
  
  updateStatus(validateStatusEl, 'Ready to validate', 'default');
  updateStatus(solveStatusEl, 'Ready to solve', 'default');
  
  // Remove celebration animation
  const container = document.querySelector('.sudoku-container');
  container.style.animation = 'none';
  
  // Focus first cell after clearing
  cells[0].focus();
});

// Add celebration animation and smooth transitions
const style = document.createElement('style');
style.textContent = `
  @keyframes celebration-glow {
    0%, 100% { 
      box-shadow: 0 0 50px rgba(0, 255, 255, 0.2), inset 0 0 50px rgba(0, 255, 255, 0.05); 
    }
    50% { 
      box-shadow: 0 0 100px rgba(0, 255, 136, 0.6), inset 0 0 80px rgba(0, 255, 136, 0.2); 
    }
  }
  
  .cell {
    transition: transform 0.15s ease, background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }
  
  .cell:focus {
    transform: scale(1.05);
  }
`;
document.head.appendChild(style);

// Auto-focus first cell on page load
window.addEventListener('load', () => {
  cells[0].focus();
});
