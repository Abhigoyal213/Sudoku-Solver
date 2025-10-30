    package com.example.sudoku.util;

    public class SudokuValidator {
        public static boolean isValidBoard(int[][] grid) {
            if (grid == null || grid.length != 9) return false;
            for (int[] row : grid) if (row == null || row.length != 9) return false;

            // Validate rows and columns
            for (int i = 0; i < 9; i++) {
                boolean[] rowSeen = new boolean[10];
                boolean[] colSeen = new boolean[10];
                for (int j = 0; j < 9; j++) {
                    int r = grid[i][j];
                    int c = grid[j][i];
                    if (r < 0 || r > 9 || c < 0 || c > 9) return false;
                    if (r != 0) {
                        if (rowSeen[r]) return false;
                        rowSeen[r] = true;
                    }
                    if (c != 0) {
                        if (colSeen[c]) return false;
                        colSeen[c] = true;
                    }
                }
            }

            // Validate 3x3 subgrids
            for (int boxRow = 0; boxRow < 9; boxRow += 3) {
                for (int boxCol = 0; boxCol < 9; boxCol += 3) {
                    boolean[] seen = new boolean[10];
                    for (int i = 0; i < 3; i++) {
                        for (int j = 0; j < 3; j++) {
                            int v = grid[boxRow + i][boxCol + j];
                            if (v != 0) {
                                if (seen[v]) return false;
                                seen[v] = true;
                            }
                        }
                    }
                }
            }
            return true;
        }
    }
    
