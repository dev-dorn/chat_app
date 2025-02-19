package chat_appcom.example.chat_app.model;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    private String senderName;
    private String receiverName;
    private String message;
    private LocalDateTime date;
    private Status status;

    public enum Status {
        SENT, RECEIVED, READ, JOINED, LEFT
    }
}
