package com.sarth.notesapp.exception;

import com.sarth.notesapp.model.Note;

public class NoteNotFoundException extends RuntimeException{
    public NoteNotFoundException(String message){//Ye constructor hai (yaad hai constructors humne Note mein dekhe the) — jab bhi ye exception banayenge, ek message denge (jaise "Note with id 5 not found").
        super(message);//super ka matlab hai "parent class ka constructor call karo"
    }
}
