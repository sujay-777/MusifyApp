package in.bushansigur.musifyapi.repository;

import in.bushansigur.musifyapi.document.Song;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SongRepository extends MongoRepository<Song, String> {
}
