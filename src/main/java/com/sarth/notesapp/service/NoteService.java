package com.sarth.notesapp.service;

import com.sarth.notesapp.dto.NoteRequestDTO;
import com.sarth.notesapp.dto.NoteResponseDTO;
import com.sarth.notesapp.exception.NoteNotFoundException;
import com.sarth.notesapp.model.Note;
import com.sarth.notesapp.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;
import java.util.List;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    public NoteResponseDTO createNote(NoteRequestDTO requestDTO){
        Note note = new Note(requestDTO.title(), requestDTO.content());
        Note savedNote = noteRepository.save(note);
        return toResponseDTO(savedNote);
        /*"Jo bhi savedNote (entity) hai, usko toResponseDTO function se guzaaro,
        jo mujhe wapas ek NoteResponseDTO de dega — aur wahi main return kar dunga."*/
    }

    public Page<NoteResponseDTO> getAllNotes(Pageable pageable){
        return noteRepository.findAll(pageable)
                .map(this::toResponseDTO);
    }

    public NoteResponseDTO getNoteById(Long id){
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new NoteNotFoundException("Note with id " + id + " not found"));
        return toResponseDTO(note);
    }

    public NoteResponseDTO updateNote(Long id, NoteRequestDTO requestDTO){
        Note existingNote = noteRepository.findById(id)
                .orElseThrow(() -> new NoteNotFoundException("Note with id " + id + " not found"));

        existingNote.setTitle(requestDTO.title());
        existingNote.setContent(requestDTO.content());

        Note updatedNote = noteRepository.save(existingNote);
        return toResponseDTO(updatedNote);
    }

    public void deleteNote(Long id){
        if(!noteRepository.existsById(id)){
            throw new NoteNotFoundException("Note with id " + id + " not found");
        }
        noteRepository.deleteById(id);
    }

    private NoteResponseDTO toResponseDTO(Note note) {
        return new NoteResponseDTO(note.getId(), note.getTitle(), note.getContent());
    }

}



/*package com.sarth.notesapp.service;

import com.sarth.notesapp.exception.NoteNotFoundException;
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
        return noteRepository.findById(id).orElseThrow(() -> new NoteNotFoundException("Note with id " + id + " not found"));
    }

    public void deleteNote(Long id){

        if(!noteRepository.existsById(id)){
            throw new NoteNotFoundException("Note with id " + id + " not found");
        }
        noteRepository.deleteById(id);
    }

    public Note updateNote(Long id, Note updatedNote){
        Note existingNote = noteRepository.findById(id).orElseThrow(()
                -> new NoteNotFoundException("Note with id " + id + " not found"));

        existingNote.setTitle(updatedNote.getTitle());
        existingNote.setContent(updatedNote.getContent());
        return noteRepository.save(existingNote);
    }
}
*/