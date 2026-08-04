package com.sarth.notesapp.controller;


import com.sarth.notesapp.model.Note;
import com.sarth.notesapp.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notes")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @PostMapping
    public Note createNote(@RequestBody Note note){
        return noteService.createNote(note);
    }

    @GetMapping
    public List<Note> getAllNotes(){
        return noteService.getAllNotes();
    }
    @GetMapping("/{id}")
    public Note getNoteById(@PathVariable Long id){
        return noteService.getNoteById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteNote(@PathVariable Long id){
        noteService.deleteNote(id);
    }
    @PutMapping("/{id}")
    public Note updateNote(@PathVariable Long id, @RequestBody Note note){
        return noteService.updateNote(id, note);
    }
}
/*
* Jab bhi kisi object ke andar ka method call karna ho, syntax hota hai:

   objectName.methodName(...)*/
/*
* Postman se JSON aati hai
       ↓
@RequestBody isko Note object mein badalta hai (naam: note)
       ↓
Controller method (createNote) ye note object leta hai
       ↓
noteService.createNote(note) ko call karta hai, note pass karke
       ↓
Service andar noteRepository.save(note) call karta hai
       ↓
Database mein save hota hai, aur wapas saved Note object milta hai (ab id bhi bhar chuki hoti hai)
       ↓
Ye saved Note object wapas Controller tak aata hai
       ↓
Controller usko return karta hai → Spring JSON mein convert karke Postman ko response deta hai*/