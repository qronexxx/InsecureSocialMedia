package at.fhtw.restserver.server;

import com.google.gson.*;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;

public class JsonUtil {

    private static final JsonSerializer<OffsetDateTime> ODTSER = (src, type, ctx) -> {
        if (src == null) return JsonNull.INSTANCE;
        return new JsonPrimitive(src.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
    };

    private static final JsonDeserializer<OffsetDateTime> ODTDESSER = (json, type, ctx) -> {
        if (json == null || json.isJsonNull()) return null;
        return OffsetDateTime.parse(json.getAsString(), DateTimeFormatter.ISO_OFFSET_DATE_TIME);
    };

    private static final Gson gson = new GsonBuilder()
            .registerTypeAdapter(OffsetDateTime.class, ODTSER)
            .registerTypeAdapter(OffsetDateTime.class, ODTDESSER)
            .serializeNulls()
            .create();

    public static Gson gson() { return gson; }
}
