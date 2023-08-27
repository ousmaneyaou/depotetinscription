package ng.campusnig.com.repository;

import java.util.List;
import java.util.Optional;
import ng.campusnig.com.domain.Administration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Administration entity.
 */
@Repository
public interface AdministrationRepository extends JpaRepository<Administration, Long> {
    default Optional<Administration> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Administration> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Administration> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct administration from Administration administration left join fetch administration.user",
        countQuery = "select count(distinct administration) from Administration administration"
    )
    Page<Administration> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct administration from Administration administration left join fetch administration.user")
    List<Administration> findAllWithToOneRelationships();

    @Query("select administration from Administration administration left join fetch administration.user where administration.id =:id")
    Optional<Administration> findOneWithToOneRelationships(@Param("id") Long id);
}
