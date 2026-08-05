package com.sarth.notesapp.dto;

public record NoteResponseDTO(
        Long id,
        String title,
        String content
) {
}
