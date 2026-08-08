package com.sarth.notesapp.service;

import com.sarth.notesapp.dto.NoteRequestDTO;
import com.sarth.notesapp.dto.NoteResponseDTO;
import com.sarth.notesapp.exception.NoteNotFoundException;
import com.sarth.notesapp.model.Note;
import com.sarth.notesapp.model.User;
import com.sarth.notesapp.repository.NoteRepository;
import com.sarth.notesapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;
    @Autowired
    private UserRepository userRepository;

    public NoteResponseDTO createNote(NoteRequestDTO requestDTO){
        User currentUser = getCurrentUser();
        Note note = new Note(requestDTO.title(), requestDTO.content());
        note.setOwner(currentUser);
        Note savedNote = noteRepository.save(note);
        return toResponseDTO(savedNote);

    }

    public Page<NoteResponseDTO> getAllNotes(Pageable pageable){
        User currentUser = getCurrentUser();
        return noteRepository.findByOwner(currentUser,pageable)
                .map(this::toResponseDTO);
    }

    public NoteResponseDTO getNoteById(Long id){
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new NoteNotFoundException("Note with id " + id + " not found"));

        User currentUser = getCurrentUser();
        if(!note.getOwner().getId().equals(currentUser.getId())){
            throw new NoteNotFoundException(
                    "Note with id " + id + " not found");
        }
        return toResponseDTO(note);
    }

    public NoteResponseDTO updateNote(Long id, NoteRequestDTO requestDTO){
        Note existingNote = noteRepository.findById(id)
                .orElseThrow(() -> new NoteNotFoundException("Note with id " + id + " not found"));

        User currentUser = getCurrentUser();
        if (!existingNote.getOwner().getId().equals(currentUser.getId())) {
            throw new NoteNotFoundException(
                    "Note with id " + id + " not found");
        }

        existingNote.setTitle(requestDTO.title());
        existingNote.setContent(requestDTO.content());

        Note updatedNote = noteRepository.save(existingNote);
        return toResponseDTO(updatedNote);
    }

    public void deleteNote(Long id){

        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new NoteNotFoundException(
                        "Note with id " + id + " not found"));

        User currentUser = getCurrentUser();

        if (!note.getOwner().getId().equals(currentUser.getId())) {
            throw new NoteNotFoundException(
                    "Note with id " + id + " not found");
        }
        noteRepository.deleteById(id);
    }

    private NoteResponseDTO toResponseDTO(Note note) {
        return new NoteResponseDTO(note.getId(), note.getTitle(), note.getContent());
    }
    private User getCurrentUser(){
        String username  = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

    }

}


