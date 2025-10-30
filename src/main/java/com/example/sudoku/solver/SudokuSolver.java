package com.example.sudoku.solver;

public class SudokuSolver {
    private final int[] rowMask = new int[9];
    private final int[] colMask = new int[9];
    private final int[] boxMask = new int[9];
    private int[][] grid;

    public boolean solve(int[][] board) {
        this.grid = board;
        initMasks();
        return backtrack(0, 0);
    }

    private void initMasks() {
        for (int i = 0; i < 9; i++) {
            rowMask[i] = 0;
            colMask[i] = 0;
            boxMask[i] = 0;
        }
        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                int v = grid[r][c];
                if (v != 0) place(r, c, v);
            }
        }
    }

    private boolean backtrack(int r, int c) {
        if (r == 9) return true;
        int nr = (c == 8) ? r + 1 : r;
        int nc = (c == 8) ? 0 : c + 1;

        if (grid[r][c] != 0) return backtrack(nr, nc);

        int box = (r / 3) * 3 + (c / 3);
        for (int v = 1; v <= 9; v++) {
            if (isFree(r, c, box, v)) {
                place(r, c, v);
                grid[r][c] = v;
                if (backtrack(nr, nc)) return true;
                remove(r, c, v);
                grid[r][c] = 0;
            }
        }
        return false;
    }

    private boolean isFree(int r, int c, int box, int v) {
        int bit = 1 << (v - 1); 
        return (rowMask[r] & bit) == 0 && (colMask[c] & bit) == 0 && (boxMask[box] & bit) == 0;
    }

    private void place(int r, int c, int v) {
        int bit = 1 << (v - 1); 
        int box = (r / 3) * 3 + (c / 3);
        rowMask[r] |= bit;
        colMask[c] |= bit;
        boxMask[box] |= bit;
    }

    private void remove(int r, int c, int v) {
        int bit = ~(1 << (v - 1));  
        int box = (r / 3) * 3 + (c / 3);
        rowMask[r] &= bit;
        colMask[c] &= bit;
        boxMask[box] &= bit;
    }
}
