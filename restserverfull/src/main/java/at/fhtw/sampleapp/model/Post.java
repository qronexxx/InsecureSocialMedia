package at.fhtw.sampleapp.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class Post {
    @JsonAlias({"id"})
    private Long id;
    @JsonAlias({"content"})
    private String content;
    @JsonAlias({"likes_count"})
    private Integer likesCount;
    @JsonAlias({"file_data"})
    private byte[] fileData;
    @JsonAlias({"file_name"})
    private String fileName;
    @JsonAlias({"posted_on"})
    private Timestamp postedOn;
    @JsonAlias({"author_username"})
    private String authorUsername;

    // Jackson needs the default constructor
    public Post() {
    }

    public Post(Long id, String content, Integer likesCount, byte[] fileData, String fileName, Timestamp postedOn, String authorUsername) {
        this.id = id;
        this.content = content;
        this.likesCount = likesCount;
        this.fileData = fileData;
        this.fileName = fileName;
        this.postedOn = postedOn;
        this.authorUsername = authorUsername;
    }
}