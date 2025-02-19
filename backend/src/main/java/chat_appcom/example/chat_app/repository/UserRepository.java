package chat_appcom.example.chat_app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import chat_appcom.example.chat_app.model.User;

public interface UserRepository extends MongoRepository<User, String> {
    User findByUsername(String username);
}
