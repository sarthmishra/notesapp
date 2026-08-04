package com.sarth.notesapp.service;

import com.sarth.notesapp.model.Note;
import com.sarth.notesapp.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    public Note createNote(Note note){
        return noteRepository.save(note);
    }
    public List<Note> getAllNotes(){
        return noteRepository.findAll();
    }

    public Note getNoteById(Long id){
        return noteRepository.findById(id).orElse(null);
    }

    public void deleteNote(Long id){
        noteRepository.deleteById(id);
    }

    public Note updateNote(Long id, Note updatedNote){
        Note existingNote = noteRepository.findById(id).orElse(null);
        if(existingNote == null){
            return null;
        }
        existingNote.setTitle(updatedNote.getTitle());
        existingNote.setContent(updatedNote.getContent());
        return noteRepository.save(existingNote);
    }
}
