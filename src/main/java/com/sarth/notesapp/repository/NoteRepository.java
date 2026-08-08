package com.sarth.notesapp.repository;

import com.sarth.notesapp.model.Note;
import com.sarth.notesapp.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Pageable;import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    Page<Note> findByOwner(User owner, Pageable pageable);
}
