package ng.campusnig.com.repository;

import ng.campusnig.com.domain.Campagne;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Campagne entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CampagneRepository extends JpaRepository<Campagne, Long> {}
