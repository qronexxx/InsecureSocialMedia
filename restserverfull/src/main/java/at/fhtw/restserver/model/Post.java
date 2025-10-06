package at.fhtw.restserver.model;

import java.time.OffsetDateTime;

public class Post {
    public long id;
    public String content;
    public int likesCount;
    public int commentCount;
    public String fileName;
    public String fileBase64;
    public OffsetDateTime postedOn;
    public String authorUsername;
    public Boolean liked;
    public Boolean bookmarked;
}
