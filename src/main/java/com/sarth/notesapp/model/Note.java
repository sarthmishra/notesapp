package com.sarth.notesapp.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity//"ye class ek table hai"
public class Note {

    @Id//"ye column unique identifier hai"
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "Title cannot be empty")
    @Size(max = 100, message = "Title cannot exceed 100 characters")
    private String title;
    @NotBlank(message = "Content cannot be empty")
    private String content;
    @ManyToOne
    private User owner;

    public Note(){

    }

    public Note(String title, String content){
        this.title = title;
        this.content = content;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }
}
/*
Spring mein validation ke liye ek library use hoti hai Bean Validation
 (jisko jakarta.validation bhi kehte hain). Isme annotations hote hain jo aap
  seedhe apni Note class ke fields pe laga dete hain — jaise:

@NotBlank — field khaali ya sirf spaces wala nahi hona chahiye
@Size(min=.., max=..) — length ki limit
@NotNull — null nahi hona chahiye

Phir Controller mein @Valid keyword laga dete hain — Spring automatically check
 karta hai in rules ko, aur agar koi rule toote, khud hi ek error response bhej deta hai
  (jise humara GlobalExceptionHandler bhi customize kar sakta hai —
  isiliye maine bola tha exception handling pehle karna sahi rahega). */