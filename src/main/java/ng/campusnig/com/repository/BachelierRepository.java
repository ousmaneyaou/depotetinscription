package ng.campusnig.com.repository;

import java.util.List;
import java.util.Optional;
import ng.campusnig.com.domain.Bachelier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Bachelier entity.
 */
@Repository
public interface BachelierRepository extends JpaRepository<Bachelier, Long> {
    default Optional<Bachelier> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Bachelier> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Bachelier> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct bachelier from Bachelier bachelier left join fetch bachelier.user",
        countQuery = "select count(distinct bachelier) from Bachelier bachelier"
    )
    Page<Bachelier> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct bachelier from Bachelier bachelier left join fetch bachelier.user")
    List<Bachelier> findAllWithToOneRelationships();

    @Query("select bachelier from Bachelier bachelier left join fetch bachelier.user where bachelier.id =:id")
    Optional<Bachelier> findOneWithToOneRelationships(@Param("id") Long id);
}
