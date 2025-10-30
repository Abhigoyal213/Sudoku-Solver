package com.example.sudoku.controller;

import com.example.sudoku.model.SudokuBoard;
import com.example.sudoku.solver.SudokuSolver;
import com.example.sudoku.util.SudokuValidator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
// @CrossOrigin(origins = "*") //Uncomment if serving frontend from a different origin
public class SudokuController {

    @PostMapping("/validate")
    public ResponseEntity<?> validate(@RequestBody SudokuBoard payload) {
        int[][] grid = payload.getBoard();
        boolean ok = SudokuValidator.isValidBoard(grid);
        return ResponseEntity.ok().body(new ApiResponse(ok, ok ? "Valid" : "Invalid"));
    }

    @PostMapping("/solve")
    public ResponseEntity<?> solve(@RequestBody SudokuBoard payload) {
        int[][] grid = payload.getBoard();
        if (!SudokuValidator.isValidBoard(grid)) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Invalid board"));
        }
        SudokuSolver solver = new SudokuSolver();
        boolean solved = solver.solve(grid);
        if (!solved) {
            return ResponseEntity.ok().body(new SolveResponse(false, "No solution", null));
        }
        return ResponseEntity.ok().body(new SolveResponse(true, "Solved", grid));
    }

    // Simple DTOs for responses
    static class ApiResponse {
        public boolean ok;
        public String message;
        public ApiResponse(boolean ok, String message) { this.ok = ok; this.message = message; }
    }

    static class SolveResponse {
        public boolean ok;
        public String message;
        public int[][] board;
        public SolveResponse(boolean ok, String message, int[][] board) {
            this.ok = ok; this.message = message; this.board = board;
        }
    }
}
 
